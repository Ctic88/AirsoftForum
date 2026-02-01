import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { eventId } = await req.json();
        const userId = session.user.id;

        console.log(`User ${userId} attempting to join event ${eventId}`);

        if (!eventId) {
            return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
        }

        // 1. Try to find the mission first just to check table exists
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('id')
            .eq('id', eventId)
            .maybeSingle();

        if (eventError) {
            console.error('Check event error:', eventError);
            return NextResponse.json({ message: 'Event not found', details: eventError.message }, { status: 404 });
        }

        // 2. Check if already joined
        const { data: existing, error: checkError } = await supabase
            .from('event_attendees')
            .select('*')
            .eq('event_id', eventId)
            .eq('user_id', userId)
            .maybeSingle();

        if (checkError) {
            console.error('Check existing attendee error:', checkError);
            // If table doesn't exist, we'll see it here
            return NextResponse.json({ message: 'Database error checking attendance', details: checkError.message, code: checkError.code }, { status: 500 });
        }

        if (existing) {
            return NextResponse.json({ message: 'Already joined this mission' }, { status: 400 });
        }

        // 3. Join the mission
        const { data, error: insertError } = await supabase
            .from('event_attendees')
            .insert([{
                event_id: eventId,
                user_id: userId
            }])
            .select();

        if (insertError) {
            console.error('Insert attendee error:', insertError);
            return NextResponse.json({ message: 'Failed to join mission', details: insertError.message, code: insertError.code }, { status: 500 });
        }

        return NextResponse.json({ message: 'Successfully joined mission', data: data?.[0] });
    } catch (error) {
        console.error("Join Mission Crash:", error);
        return NextResponse.json({ message: 'Internal server crash', details: error.message }, { status: 500 });
    }
}

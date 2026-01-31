import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: events, error } = await supabase
            .from('events')
            .select('*, location:fields(name), author:users(name, callsign)')
            .order('event_date', { ascending: true });

        if (error) throw error;
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching events' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { title, description, event_date, location_id } = await req.json();

        const { data: event, error } = await supabase
            .from('events')
            .insert([{ title, description, event_date, location_id, author_id: session.user.id }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ message: 'Error creating event', details: error.message }, { status: 500 });
    }
}

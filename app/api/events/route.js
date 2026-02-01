import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: events, error } = await supabase
            .from('events')
            .select(`
                *,
                location:fields(name),
                author:users(name, callsign),
                event_attendees(
                    user_id,
                    user:users(name, callsign)
                )
            `)
            .order('event_date', { ascending: true });

        if (error) {
            console.error('GET /api/events error:', error);
            return NextResponse.json({ message: 'Database error', details: error.message }, { status: 500 });
        }
        return NextResponse.json(events);
    } catch (error) {
        console.error('API GET /api/events crash:', error);
        return NextResponse.json({ message: 'Server crash', details: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { title, description, event_date, location_name } = await req.json();

        // 1. Find or Create the field
        let locationId;
        const { data: existingField } = await supabase
            .from('fields')
            .select('id')
            .eq('name', location_name)
            .maybeSingle();

        if (existingField?.id) {
            locationId = existingField.id;
        } else {
            const { data: newField, error: fieldError } = await supabase
                .from('fields')
                .insert([{ name: location_name, location: 'TBD', type: 'Manual Entry' }])
                .select()
                .maybeSingle();

            if (fieldError) throw fieldError;
            locationId = newField?.id;
        }

        if (!locationId) {
            return NextResponse.json({ message: 'Could not resolve location' }, { status: 400 });
        }

        // 2. Create the event
        const { data: event, error } = await supabase
            .from('events')
            .insert([{
                title,
                description,
                event_date,
                location_id: locationId,
                author_id: session.user.id
            }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(event);
    } catch (error) {
        console.error('POST /api/events error:', error);
        return NextResponse.json({ message: 'Error creating event', details: error.message }, { status: 500 });
    }
}
export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const { title, description, event_date, location_name } = await req.json();

        if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

        const { data: event } = await supabase
            .from('events')
            .select('author_id')
            .eq('id', id)
            .single();

        if (!event) return NextResponse.json({ message: 'Mission intelligence not found' }, { status: 404 });

        const isOwner = event.author_id === session.user.id;
        const isAdmin = session.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { data: updated, error } = await supabase
            .from('events')
            .update({
                title,
                description,
                event_date,
                location_name
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Supabase Update Event Error:", error);
        return NextResponse.json({ message: 'Error updating intelligence', details: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

        // 1. Get the event to check ownership
        const { data: event } = await supabase
            .from('events')
            .select('author_id')
            .eq('id', id)
            .single();

        if (!event) return NextResponse.json({ message: 'Event not found' }, { status: 404 });

        // 2. Allow if Owner OR Admin
        const isOwner = event.author_id === session.user.id;
        const isAdmin = session.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error("Supabase Delete Event Error:", error);
        return NextResponse.json({ message: 'Error deleting event', details: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        // Fetch all users with their mission participation for status determination
        const { data: users, error } = await supabase
            .from('users')
            .select(`
                id, name, callsign, role, team,
                event_attendees (
                    events (
                        id,
                        title,
                        event_date,
                        location:fields(name)
                    )
                )
            `)
            .order('callsign', { ascending: true });

        if (error) {
            console.error("Supabase Users Fetch Error:", error);
            return NextResponse.json({ message: 'Database error', details: error.message }, { status: 500 });
        }

        return NextResponse.json(users);
    } catch (error) {
        console.error("Users API Crash:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

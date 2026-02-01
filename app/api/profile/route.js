import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        // Querying for id, name, email as bare minimums, adding callsign/team/role if they exist
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, callsign, team, role')
            .eq('id', session.user.id)
            .maybeSingle(); // maybeSingle doesn't throw on 0 rows

        if (error) {
            console.error("Supabase Profile Fetch Error:", error);
            return NextResponse.json({ message: 'Database error', details: error.message }, { status: 500 });
        }

        if (!user) {
            return NextResponse.json({ message: 'User profile not found in database. Please re-register.' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Profile API Crash:", error);
        return NextResponse.json({ message: 'Internal server error', details: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { name, callsign, team, role } = await req.json();

        if (name && name.length < 2) {
            return NextResponse.json({ message: 'Name too short' }, { status: 400 });
        }

        // We use the common 'supabase' client which uses the anon key.
        // If this fails, it's likely due to RLS policies blocking public updates.
        const { data: user, error } = await supabase
            .from('users')
            .update({ name, callsign, team, role })
            .eq('id', session.user.id)
            .select('id, name, email, callsign, team, role')
            .single();

        if (error) {
            console.error("Supabase Profile Update Error:", error);
            // Provide more detail to help the user debug (e.g. if RLS is the issue)
            return NextResponse.json({
                message: 'Error updating profile',
                details: error.message,
                hint: "Check your Supabase RLS policies for the 'users' table."
            }, { status: 500 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Profile PUT Crash:", error);
        return NextResponse.json({ message: 'Internal server error', details: error.message }, { status: 500 });
    }
}

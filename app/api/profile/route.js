import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error) throw error;
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { name, callsign, team, role } = await req.json();

        const { data: user, error } = await supabase
            .from('users')
            .update({ name, callsign, team, role })
            .eq('id', session.user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating profile', details: error.message }, { status: 500 });
    }
}

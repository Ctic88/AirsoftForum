import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: loadouts, error } = await supabase
            .from('loadouts')
            .select('*, author:users(name, callsign, role)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(loadouts);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching loadouts' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { title, description, image_url, kit_list } = await req.json();

        const { data: loadout, error } = await supabase
            .from('loadouts')
            .insert([
                {
                    title,
                    description,
                    image_url,
                    kit_list,
                    user_id: session.user.id
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(loadout);
    } catch (error) {
        return NextResponse.json({ message: 'Error creating loadout', details: error.message }, { status: 500 });
    }
}

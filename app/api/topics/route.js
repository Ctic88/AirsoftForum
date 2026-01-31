import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: topics, error } = await supabase
            .from('topics')
            .select('*, author:users(name)')
            .order('createdAt', { ascending: false });

        if (error) throw error;

        return NextResponse.json(topics);
    } catch (error) {
        console.error("Supabase Fetch Topics Error:", error);
        return NextResponse.json({ message: 'Error fetching topics', details: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { title, content } = await req.json();

        const { data: topic, error } = await supabase
            .from('topics')
            .insert([
                {
                    title,
                    content,
                    authorId: session.user.id
                }
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(topic, { status: 201 });
    } catch (error) {
        console.error("Supabase Create Topic Error:", error);
        return NextResponse.json({ message: 'Error creating topic', details: error.message }, { status: 500 });
    }
}

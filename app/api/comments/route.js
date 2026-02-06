import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const topicId = searchParams.get('topicId');

        if (!topicId) {
            return NextResponse.json({ message: 'Topic ID is required' }, { status: 400 });
        }

        const { data: comments, error } = await supabase
            .from('comments')
            .select('*, author:users(name, callsign)')
            .eq('topic_id', topicId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Supabase Fetch Comments Error:", error);
        return NextResponse.json({ message: 'Error fetching comments' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { content, topicId } = await req.json();

        const { data: comment, error } = await supabase
            .from('comments')
            .insert([
                {
                    content,
                    topic_id: topicId,
                    author_id: session.user.id
                }
            ])
            .select('*, author:users(name, callsign)')
            .single();

        if (error) throw error;

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("Supabase Create Comment Error:", error);
        return NextResponse.json({
            message: 'Error creating comment',
            details: error?.message || 'Unknown error',
            hint: error?.hint || '',
            code: error?.code || ''
        }, { status: 500 });
    }
}

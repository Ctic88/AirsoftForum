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

        const { title, content, category } = await req.json();

        const { data: topic, error } = await supabase
            .from('topics')
            .insert([
                {
                    title,
                    content,
                    category,
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
export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const { title, content, category } = await req.json();

        if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

        const { data: topic } = await supabase
            .from('topics')
            .select('authorId')
            .eq('id', id)
            .single();

        if (!topic) return NextResponse.json({ message: 'Topic not found' }, { status: 404 });

        const isOwner = topic.authorId === session.user.id;
        const isAdmin = session.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { data: updated, error } = await supabase
            .from('topics')
            .update({ title, content, category })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Supabase Update Topic Error:", error);
        return NextResponse.json({ message: 'Error updating topic', details: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

        // 1. Get the topic to check ownership
        const { data: topic } = await supabase
            .from('topics')
            .select('authorId')
            .eq('id', id)
            .single();

        if (!topic) return NextResponse.json({ message: 'Topic not found' }, { status: 404 });

        // 2. Allow if Owner OR Admin
        const isOwner = topic.authorId === session.user.id;
        const isAdmin = session.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { error } = await supabase
            .from('topics')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Topic deleted successfully' });
    } catch (error) {
        console.error("Supabase Delete Topic Error:", error);
        return NextResponse.json({ message: 'Error deleting topic', details: error.message }, { status: 500 });
    }
}

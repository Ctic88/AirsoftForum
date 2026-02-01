import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: fields, error } = await supabase
            .from('fields')
            .select('*')
            .order('name');

        if (error) throw error;
        return NextResponse.json(fields);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching fields' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
        }

        const { name, location, type, contact_url } = await req.json();

        const { data: field, error } = await supabase
            .from('fields')
            .insert([{ name, location, type, contact_url }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(field);
    } catch (error) {
        return NextResponse.json({ message: 'Error creating field' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

        const { error } = await supabase
            .from('fields')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ message: 'Field deleted successfully' });
    } catch (error) {
        console.error("Supabase Delete Field Error:", error);
        return NextResponse.json({ message: 'Error deleting field' }, { status: 500 });
    }
}
export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const { name, location, type, rating, contact_url } = await req.json();

        if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

        const { data: field, error } = await supabase
            .from('fields')
            .update({ name, location, type, rating, contact_url })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(field);
    } catch (error) {
        console.error("Supabase Update Field Error:", error);
        return NextResponse.json({ message: 'Error updating field' }, { status: 500 });
    }
}

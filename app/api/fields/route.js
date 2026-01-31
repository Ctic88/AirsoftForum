import { NextResponse } from 'next/server';
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

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        // Check if user already exists in the 'users' table
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Insert new user into 'users' table
        const { data, error } = await supabase
            .from('users')
            .insert([
                { name, email, password } // Storing plain text password as per original logic (NOT RECOMMENDED FOR PRODUCTION)
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ message: 'User created successfully', user: data }, { status: 201 });
    } catch (error) {
        console.error("Supabase Register Error:", error);
        return NextResponse.json({ message: 'Internal server error', details: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        // Basic validation
        if (!email.includes('@')) {
            return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ message: 'Password too short (min 6 chars)' }, { status: 400 });
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const { data, error } = await supabase
            .from('users')
            .insert([
                { name, email, password: hashedPassword }
            ])
            .select('id, name, email')
            .single();

        if (error) throw error;

        return NextResponse.json({ message: 'User created successfully', user: data }, { status: 201 });
    } catch (error) {
        console.error("Supabase Register Error:", error);
        return NextResponse.json({ message: 'Internal server error', details: error.message }, { status: 500 });
    }
}

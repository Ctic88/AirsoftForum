import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const { data: user } = await supabase
                    .from('users')
                    .select('id, password, name, email, role, callsign')
                    .eq('email', credentials.email)
                    .single();

                if (user && await bcrypt.compare(credentials.password, user.password)) {
                    return { id: user.id, name: user.name, email: user.email, role: user.role, callsign: user.callsign };
                }
                return null;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.callsign = user.callsign;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub;
                session.user.role = token.role;
                session.user.callsign = token.callsign;
            }
            return session;
        }
    }
};

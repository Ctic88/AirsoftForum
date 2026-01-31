import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

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

                const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', credentials.email)
                    .single();

                if (user && user.password === credentials.password) {
                    return { id: user.id, name: user.name, email: user.email };
                }
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub;
            }
            return session;
        }
    }
};

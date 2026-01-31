import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = async (req, res) => {
    try {
        return await NextAuth(authOptions)(req, res);
    } catch (error) {
        console.error("NextAuth Route Error:", error);
        return new Response(JSON.stringify({
            error: "Internal Server Error",
            details: error.message
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

export { handler as GET, handler as POST };

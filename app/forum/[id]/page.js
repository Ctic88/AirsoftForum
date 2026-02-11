'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DecryptText from '@/components/DecryptText';
import { User, Calendar, MessageSquare, Send, Loader2, ChevronLeft, Crosshair, Package, Shield, Cpu } from 'lucide-react';

const CATEGORY_ICONS = {
    'Tactics': Crosshair,
    'Gear': Package,
    'Milsim': Shield,
    'Tech': Cpu,
    'General': MessageSquare
};
import Link from 'next/link';

export default function TopicPage({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const { data: session, status } = useSession();
    const router = useRouter();
    const [topic, setTopic] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentContent, setCommentContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && id) {
            fetchTopicData();
        }
    }, [id, status]);

    const fetchTopicData = async () => {
        try {
            // Fetch topic detail
            const resTopics = await fetch('/api/topics');
            const allTopics = await resTopics.json();
            const currentTopic = allTopics.find(t => t.id === id);
            setTopic(currentTopic);

            // Fetch comments
            const resComments = await fetch(`/api/comments?topicId=${id}`);
            const commentsData = await resComments.json();
            setComments(commentsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        setSubmitting(true);
        const res = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: commentContent, topicId: id }),
        });

        if (res.ok) {
            const newComment = await res.json();
            setComments([...comments, newComment]);
        } else {
            const errorData = await res.json();
            window.dispatchEvent(new CustomEvent('hud-alert', {
                detail: { content: `Error: ${errorData.message || 'Failed to post comment'}`, type: 'alert' }
            }));
        }
        setCommentContent('');
        setSubmitting(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-accent-light" />
        </div>
    );

    if (!topic) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
            <p className="text-foreground/40 text-xl font-bold uppercase tracking-widest">Intel Not Found</p>
            <Link href="/forum" className="text-accent-light hover:underline">Back to Base</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-4xl mx-auto">
                <Link href="/forum" className="flex items-center gap-2 text-foreground/40 hover:text-accent-light transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                    <ChevronLeft size={16} />
                    Back to Briefing
                </Link>

                <article className="glass p-6 md:p-10 rounded-apple-lg md:rounded-apple-xl border border-white/10 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[80px]" />

                    <header className="mb-8">
                        <div className="flex gap-3 mb-6">
                            <span className="bg-accent/20 text-accent-light px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/20 flex items-center gap-2">
                                {(() => {
                                    const Icon = CATEGORY_ICONS[topic?.category] || MessageSquare;
                                    return <Icon size={10} />;
                                })()}
                                {topic?.category || 'Confidential Intel'}
                            </span>
                            <span className="bg-white/5 text-foreground/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5">Status: Active</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{topic.title}</h1>
                        <div className="flex items-center gap-6 text-sm text-foreground/40">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{topic.author?.callsign || topic.author?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </header>

                    <div className="text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap border-t border-white/5 pt-8">
                        <DecryptText text={topic.content} speed={15} />
                    </div>
                </article>

                <section className="space-y-8">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-accent-light" />
                        Comms Log ({comments.length})
                    </h3>

                    {/* Comment Form */}
                    {session ? (
                        <form onSubmit={handlePostComment} className="glass p-5 md:p-6 rounded-[28px] md:rounded-apple-lg border border-white/10 relative group">
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Add intel to this briefing..."
                                className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none text-foreground p-2 min-h-[100px]"
                                required
                            />
                            <div className="flex justify-end pt-4 border-t border-white/5">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-accent hover:bg-accent-light text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 shadow-xl hover:scale-105"
                                >
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    Deploy Comment
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="glass p-8 rounded-apple-lg border border-dashed border-white/10 text-center">
                            <p className="text-foreground/40 mb-4">Authentication required to post comments.</p>
                            <Link href="/login" className="text-accent-light font-bold hover:underline">Log in to Base</Link>
                        </div>
                    )}

                    {/* Comments Feed */}
                    <div className="space-y-6">
                        {comments.length > 0 ? comments.map((comment) => (
                            <div key={comment.id} className="glass p-6 rounded-[28px] border border-white/5 relative group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent-light font-bold text-xs uppercase">
                                            {(comment.author?.callsign || comment.author?.name || 'U').charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{comment.author?.callsign || comment.author?.name}</p>
                                            <p className="text-[10px] text-foreground/30 uppercase tracking-widest">{new Date(comment.created_at).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-foreground/20 font-bold uppercase tracking-widest">#{comment.id.slice(0, 4)}</span>
                                </div>
                                <p className="text-foreground/70 leading-relaxed pl-11">{comment.content}</p>
                            </div>
                        )) : (
                            <div className="text-center py-12 text-foreground/20 italic">
                                No comms recorded yet.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

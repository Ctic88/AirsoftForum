'use client';

import { Radio, Table, MessageSquare, Shield } from 'lucide-react';

const NATO_ALPHABET = [
    { char: 'A', word: 'Alpha' }, { char: 'B', word: 'Bravo' }, { char: 'C', word: 'Charlie' },
    { char: 'D', word: 'Delta' }, { char: 'E', word: 'Echo' }, { char: 'F', word: 'Foxtrot' },
    { char: 'G', word: 'Golf' }, { char: 'H', word: 'Hotel' }, { char: 'I', word: 'India' },
    { char: 'J', word: 'Juliett' }, { char: 'K', word: 'Kilo' }, { char: 'L', word: 'Lima' },
    { char: 'M', word: 'Mike' }, { char: 'N', word: 'November' }, { char: 'O', word: 'Oscar' },
    { char: 'P', word: 'Papa' }, { char: 'Q', word: 'Quebec' }, { char: 'R', word: 'Romeo' },
    { char: 'S', word: 'Sierra' }, { char: 'T', word: 'Tango' }, { char: 'U', word: 'Uniform' },
    { char: 'V', word: 'Victor' }, { char: 'W', word: 'Whiskey' }, { char: 'X', word: 'X-ray' },
    { char: 'Y', word: 'Yankee' }, { char: 'Z', word: 'Zulu' }
];

const PMR_CHANNELS = [
    { ch: 1, freq: '446.00625' }, { ch: 2, freq: '446.01875' },
    { ch: 3, freq: '446.03125' }, { ch: 4, freq: '446.04375' },
    { ch: 5, freq: '446.05625' }, { ch: 6, freq: '446.06875' },
    { ch: 7, freq: '446.08125' }, { ch: 8, freq: '446.09375' }
];

export default function CommsGuide() {
    return (
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
            {/* NATO Phonetic Alphabet */}
            <div className="glass p-8 rounded-[32px] border border-white/10 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-accent-light" />
                    NATO Phonetic Alphabet
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {NATO_ALPHABET.map((item) => (
                        <div key={item.char} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                            <span className="font-bold text-accent-light">{item.char}</span>
                            <span className="text-xs text-foreground/60">{item.word}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* PMR Frequencies */}
            <div className="glass p-8 rounded-[32px] border border-white/10 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Radio className="w-5 h-5 text-accent-light" />
                    PMR446 Frequencies
                </h3>
                <div className="space-y-3">
                    {PMR_CHANNELS.map((item) => (
                        <div key={item.ch} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="text-sm font-bold">CH {item.ch}</span>
                            <span className="text-xs font-mono text-accent-light">{item.freq} MHz</span>
                        </div>
                    ))}
                </div>
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] text-foreground/40 leading-relaxed uppercase tracking-wider">
                    <p className="flex items-center gap-2 mb-2 font-bold text-accent-light">
                        <Shield size={12} /> Comms Discipline
                    </p>
                    <p>Keep transmissions short. Say "Over" when finished. Say "Out" to end conversation. Listen before transmitting.</p>
                </div>
            </div>
        </div>
    );
}

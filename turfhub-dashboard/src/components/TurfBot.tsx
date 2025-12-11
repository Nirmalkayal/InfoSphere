import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { TurfBotService, type BotResponse } from "@/services/turfBot";

interface Message {
    id: string;
    type: 'user' | 'bot';
    content: string;
    data?: any;
}

export function TurfBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', type: 'bot', content: "Hi! I'm TurfBot. Ask me about your revenue, bookings, or predictions." }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), type: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await TurfBotService.processQuery(userMsg.content);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: res.text,
                data: res.data
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (e) {
            // ignore
        } finally {
            setIsTyping(false);
        }
    };

    const chips = [
        "Revenue this month",
        "Predict next week",
        "Who is my best customer?",
        "How many bookings today?"
    ];

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all z-50 hover:scale-105",
                    isOpen ? "bg-red-500 rotate-90" : "bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse-slow"
                )}
            >
                {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
            </button>

            {/* Chat Window */}
            <div className={cn(
                "fixed bottom-24 right-6 w-96 bg-card border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 overflow-hidden",
                isOpen ? "opacity-100 translate-y-0 h-[500px]" : "opacity-0 translate-y-10 h-0 pointer-events-none"
            )}>
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">TurfBot AI</h3>
                        <p className="text-indigo-100 text-[10px] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            Online
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full mb-2",
                                msg.type === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "max-w-[80%] rounded-2xl p-3 text-sm",
                                msg.type === 'user'
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-white border border-border rounded-tl-none shadow-sm"
                            )}>
                                <p>{msg.content}</p>
                                {msg.data && (
                                    <div className="mt-2 p-2 bg-muted/50 rounded-lg flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">{msg.data.label}</span>
                                        <span className="font-bold text-foreground">{msg.data.value}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start w-full">
                            <div className="bg-white border border-border rounded-2xl rounded-tl-none p-3 shadow-sm flex gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-card border-t border-border">
                    {/* Chips */}
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                        {chips.map((chip, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setInput(chip);
                                    // Optional: Auto send
                                }}
                                className="whitespace-nowrap px-3 py-1 bg-muted hover:bg-muted/80 text-[10px] rounded-full text-muted-foreground transition-colors border border-border"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask for insights..."
                            className="w-full pl-4 pr-10 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

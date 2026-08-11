import React, { useState, useRef, useEffect } from 'react';
import { askAngkorScholar, ChatMessage } from '../api/geminiClient';
import { Send, Bot, User, X, Sparkles, ScrollText, RefreshCw } from 'lucide-react';

interface AIHistorianModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIHistorianModal: React.FC<AIHistorianModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Suostei! I am the Royal Khmer Scholar of Angkor. Ask me anything about King Suryavarman II, the Churning of the Ocean of Milk, sandstone engineering, or modern LiDAR discoveries.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const reply = await askAngkorScholar(userText, messages);
      setMessages([...newMessages, { role: 'model', text: reply }]);
    } catch {
      setMessages([...newMessages, { role: 'model', text: "Forgive me, noble traveler. The temple winds briefly obscure our connection. Please inquire again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-neutral-950/70 backdrop-blur-md animate-fade-in p-2 sm:p-4">
      <div className="w-full max-w-lg h-[90vh] bg-neutral-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-amber-100">
        
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-amber-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-200 text-lg flex items-center gap-2">
                Royal Angkor Historian
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </h3>
              <p className="text-xs text-amber-300/70">Powered by Gemini AI • Historical Wisdom</p>
            </div>
          </div>

          <button
            id="close-scholar-modal-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-amber-300 rounded-xl hover:bg-neutral-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-neutral-950/60 border-b border-amber-900/30 flex gap-2 overflow-x-auto text-xs no-scrollbar">
          {[
            "Why does Angkor Wat face West?",
            "How were the 5M sandstone blocks moved?",
            "What is the Churning of Ocean of Milk?",
            "What did LiDAR reveal about Angkor?",
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q)}
              className="whitespace-nowrap px-3 py-1.5 bg-neutral-800 hover:bg-amber-900/40 text-amber-200 rounded-full border border-amber-900/40 transition-all text-[11px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-serif text-sm">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 border border-amber-500/40 text-amber-400'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl max-w-[82%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-neutral-950 font-sans text-xs sm:text-sm font-medium rounded-tr-none shadow-md'
                    : 'bg-neutral-950/80 border border-amber-900/40 text-amber-100 rounded-tl-none shadow-inner'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-amber-400 text-xs italic p-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Consulting ancient Sanskrit inscriptions...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-neutral-950 border-t border-amber-900/50 flex items-center gap-2">
          <input
            id="scholar-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Angkor Wat history, carvings, or astronomy..."
            className="flex-1 bg-neutral-900 border border-amber-900/50 rounded-2xl px-4 py-3 text-xs sm:text-sm text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 font-sans"
          />
          <button
            id="send-scholar-input-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-2xl transition-all shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

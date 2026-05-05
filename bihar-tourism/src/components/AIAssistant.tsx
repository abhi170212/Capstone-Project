'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User, Bot, X, Send, Music2, Utensils, Shirt, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import BiharMusicPlayer from './BiharMusicPlayer';
import BiharAttireModal from './BiharAttireModal';
import BiharFoodModal from './BiharFoodModal';
import { faqData } from '@/data/faqData';
import toast from 'react-hot-toast';

export default function AIAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [showAttireModal, setShowAttireModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [suggestions, setSuggestions] = useState<{question: string, answer: string}[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMounted(true);
    // Pick 5 random suggestions from faqData
    const shuffled = [...faqData].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 5));
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToProcess = (customText || inputText).trim();
    if (!textToProcess || isLoading) return;

    if (!user) {
      toast.error("Please login first to chat with the AI assistant.");
      return;
    }

    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: textToProcess }]);
    setIsLoading(true);

    try {
      // Check if it's a FAQ match (simple inclusion)
      const faqMatch = faqData.find(f => 
        textToProcess.toLowerCase().includes(f.question.toLowerCase().replace('?', '')) || 
        f.question.toLowerCase().replace('?', '').includes(textToProcess.toLowerCase())
      );

      if (faqMatch) {
        // Wait a bit to simulate thinking
        await new Promise(resolve => setTimeout(resolve, 500));
        setMessages(prev => [...prev, { role: 'bot', text: faqMatch.answer }]);
        setIsLoading(false);
        return;
      }

      // If no FAQ match, call AI
      setMessages(prev => [...prev, { role: 'bot', text: '...' }]);

      const response = await api.post('/ai/chat', {
        prompt: textToProcess,
        context: window.location.pathname
      });

      const aiText = response.data.text;

      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs[newMsgs.length - 1].text === '...') {
          newMsgs[newMsgs.length - 1] = { role: 'bot', text: aiText };
        } else {
          newMsgs.push({ role: 'bot', text: aiText });
        }
        return newMsgs;
      });

    } catch (err) {
      console.error("AI Chat Error:", err);
      const errMsg = "I'm having trouble connecting to my servers right now.";
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs[newMsgs.length - 1].text === '...') {
          newMsgs[newMsgs.length - 1] = { role: 'bot', text: errMsg };
        } else {
          newMsgs.push({ role: 'bot', text: errMsg });
        }
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Global Action Bar */}
      <div className="fixed bottom-[80px] sm:bottom-8 right-4 sm:right-8 z-40 flex items-center gap-3 sm:gap-4">
        {/* Culture Icons */}
        <div className="flex gap-2 bg-[#FFF8EC]/90 backdrop-blur-md p-2 rounded-full border-2 border-[#546B41] shadow-[4px_4px_0px_#546B41]">
          <button 
            onClick={() => setShowMusicModal(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-[#546B41] text-[#FFF8EC] rounded-full flex items-center justify-center hover:bg-[#DCCCAC] hover:text-black transition-colors"
            title="Songs of Bihar"
          >
            <Music2 size={20} />
          </button>
          <button 
            onClick={() => setShowFoodModal(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-[#DCCCAC] text-black rounded-full flex items-center justify-center hover:bg-[#99AD7A] transition-colors"
            title="Cuisine of Bihar"
          >
            <Utensils size={20} />
          </button>
          <button 
            onClick={() => setShowAttireModal(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-[#DCCCAC] text-black rounded-full flex items-center justify-center hover:bg-[#99AD7A] transition-colors"
            title="Attires of Bihar"
          >
            <Shirt size={20} />
          </button>
        </div>

        {/* AI Chat Button */}
        <motion.button
          onClick={() => {
            if (!user) {
              toast.error("Please login to use the AI Chat Guide!", {
                icon: '🔒',
              });
              return;
            }
            setIsOpen(!isOpen);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-[#99AD7A] rounded-full flex items-center justify-center border-2 border-[#546B41] shadow-[4px_4px_0px_#546B41] transition-all hover:bg-[#DCCCAC]"
          title="AI Chat Guide"
        >
          <MessageSquare size={28} className="text-black" />
        </motion.button>
      </div>

      {/* Chat Interface Modal */}
      <AnimatePresence>
        {isOpen && user && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-[140px] sm:bottom-28 right-4 sm:right-8 w-[calc(100vw-32px)] sm:w-[400px] max-w-[400px] h-[500px] bg-[#FFF8EC] border-2 border-[#546B41] rounded-3xl overflow-hidden shadow-[8px_8px_0px_#546B41] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#546B41] border-b-2 border-[#546B41] p-4 flex justify-between items-center text-[#FFF8EC]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#99AD7A] rounded-full flex items-center justify-center border-2 border-[#FFF8EC]/20">
                  <Bot size={24} className="text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">AI Guide</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">Online & Ready</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:rotate-90 transition-transform duration-300 p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-[#FFF8EC] scrollbar-thin scrollbar-thumb-[#546B41] scrollbar-track-transparent">
              {messages.length === 0 ? (
                <div className="flex flex-col gap-6 my-auto">
                  <div className="text-center text-black/60 font-medium italic p-4">
                    Hi {user.name}! I'm your Bihar Tourism guide. Ask me anything about Bihar's destinations, culture, or history.
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#546B41] text-center">Suggested Questions</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(undefined, s.question)}
                          className="text-xs bg-white border border-[#546B41] px-3 py-2 rounded-full hover:bg-[#99AD7A] hover:text-white transition-colors text-black font-medium shadow-[2px_2px_0px_#546B41]"
                        >
                          {s.question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={idx} 
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 border-[#546B41] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#546B41] ${msg.role === 'user' ? 'bg-[#DCCCAC]' : 'bg-[#99AD7A]'}`}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div className={`p-3.5 max-w-[85%] rounded-2xl border-2 border-[#546B41] text-sm font-semibold shadow-[3px_3px_0px_#546B41] ${
                        msg.role === 'user' 
                          ? 'bg-white text-black rounded-tr-none' 
                          : 'bg-[#DCCCAC] text-black rounded-tl-none'
                      } ${msg.text === '...' ? 'animate-pulse' : ''}`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Show suggestions even after chat starts, at the bottom if user is idle? 
                      Actually, let's keep them at the top or in a separate small scrollable area if needed.
                      For now, showing them only at start is fine. */}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-[#DCCCAC] border-t-2 border-[#546B41] flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-white border-2 border-[#546B41] rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#99AD7A] placeholder-black/40 text-black"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#546B41] transition-all ${!inputText.trim() || isLoading ? 'bg-gray-300 cursor-not-allowed opacity-50' : 'bg-[#99AD7A] hover:bg-white text-black hover:scale-105 active:scale-95'}`}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <BiharMusicPlayer 
        isOpen={showMusicModal} 
        onClose={() => setShowMusicModal(false)} 
      />

      <BiharAttireModal
        isOpen={showAttireModal}
        onClose={() => setShowAttireModal(false)}
      />

      <BiharFoodModal
        isOpen={showFoodModal}
        onClose={() => setShowFoodModal(false)}
      />
    </>
  );
}

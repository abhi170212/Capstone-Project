'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, User, Bot, X, Volume2, Loader2, PauseCircle, Music2, Utensils, Shirt } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import BiharMusicPlayer from './BiharMusicPlayer';

export default function VoiceAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceType, setVoiceType] = useState<'male' | 'female'>('female');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    setMounted(true);
    synthRef.current = window.speechSynthesis;

    // Initialize SpeechRecognition if available
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserVoiceInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const getVoice = (type: 'male' | 'female') => {
    if (!synthRef.current) return null;
    const voices = synthRef.current.getVoices();
    // Try to find Indian English voices first, then general English
    let filteredVoices = voices.filter(v => v.lang.includes('en'));

    // Very basic heuristic for male vs female robotic voices
    if (type === 'female') {
      return filteredVoices.find(v => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Google UK English Female')) || filteredVoices[0];
    } else {
      return filteredVoices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('Google UK English Male')) || filteredVoices[0];
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = getVoice(voiceType);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleMicClick = () => {
    if (!user) {
      const loginMsg = "Please login first to use the interactive voice assistant.";
      speak(loginMsg);
      alert(loginMsg);
      return;
    }
    setIsOpen(true);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      stopSpeaking(); // Stop AI from talking if user wants to speak
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error("Could not start recognition", err);
      }
    }
  };

  const handleUserVoiceInput = async (transcript: string) => {
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', text: transcript }]);

    try {
      // Show loading bot state temporarily
      setMessages(prev => [...prev, { role: 'bot', text: '...' }]);

      const response = await api.post('/ai/chat', {
        prompt: transcript,
        context: window.location.pathname
      });

      const aiText = response.data.text;

      // Update the bot message with real text
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { role: 'bot', text: aiText };
        return newMsgs;
      });

      // Speak the response out loud
      speak(aiText);

    } catch (err) {
      console.error("AI Chat Error:", err);
      const errMsg = "I'm having trouble connecting to my servers right now.";
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { role: 'bot', text: errMsg };
        return newMsgs;
      });
      speak(errMsg);
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
            onClick={() => alert("Cuisine modal coming soon!")}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-[#99AD7A] text-black rounded-full flex items-center justify-center hover:bg-[#DCCCAC] transition-colors"
            title="Cuisine of Bihar"
          >
            <Utensils size={20} />
          </button>
          <button 
            onClick={() => alert("Attires modal coming soon!")}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-[#DCCCAC] text-black rounded-full flex items-center justify-center hover:bg-[#99AD7A] transition-colors"
            title="Attires of Bihar"
          >
            <Shirt size={20} />
          </button>
        </div>

        {/* AI Mic Button */}
        <motion.button
          onClick={handleMicClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-[#99AD7A] rounded-full flex items-center justify-center border-2 border-[#546B41] shadow-[4px_4px_0px_#546B41] transition-all hover:bg-[#DCCCAC]"
          title="AI Voice Guide"
        >
          <Mic size={28} className="text-black" />
        </motion.button>
      </div>

      {/* Voice Interface Modal */}
      <AnimatePresence>
        {isOpen && user && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-[140px] sm:bottom-28 right-4 sm:right-8 w-[calc(100vw-32px)] sm:w-[350px] max-w-[350px] bg-[#FFF8EC] border-2 border-[#546B41] rounded-3xl overflow-hidden shadow-[8px_8px_0px_#546B41] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#DCCCAC] border-b-2 border-[#546B41] p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={24} className="text-black" />
                <h3 className="font-bold text-black text-lg">AI Tourism Guide</h3>
              </div>
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="text-black hover:scale-110 transition-transform"
              >
                <X size={24} />
              </button>
            </div>

            {/* Voice Settings */}
            <div className="flex bg-[#FFF8EC] border-b-2 border-[#546B41] divide-x-2 divide-[#546B41]">
              <button
                onClick={() => setVoiceType('female')}
                className={`flex-1 py-2 text-sm font-bold transition-colors ${voiceType === 'female' ? 'bg-[#99AD7A] text-black' : 'hover:bg-[#DCCCAC]/50 text-black/70'}`}
              >
                Female Voice
              </button>
              <button
                onClick={() => setVoiceType('male')}
                className={`flex-1 py-2 text-sm font-bold transition-colors ${voiceType === 'male' ? 'bg-[#99AD7A] text-black' : 'hover:bg-[#DCCCAC]/50 text-black/70'}`}
              >
                Male Voice
              </button>
            </div>

            {/* Conversation Area */}
            <div className="p-4 h-[300px] overflow-y-auto flex flex-col gap-4 bg-[#FFF8EC]">
              {messages.length === 0 ? (
                <div className="text-center text-black/60 font-medium my-auto italic">
                  Hi {user.name}! Tap the mic icon below and ask me "What is this all about?" or ask about any destination in Bihar.
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full border border-[#546B41] flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[#DCCCAC]' : 'bg-[#99AD7A]'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-3 rounded-2xl border border-[#546B41] text-sm font-medium ${msg.role === 'user' ? 'bg-white rounded-tr-none' : 'bg-[#DCCCAC] rounded-tl-none'} ${msg.text === '...' ? 'animate-pulse' : ''}`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Action Area */}
            <div className="p-6 bg-[#DCCCAC] border-t-2 border-[#546B41] flex flex-col items-center justify-center gap-4 relative">
              {isSpeaking && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#546B41]/20 overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-1/2 h-full bg-[#546B41]"
                  />
                </div>
              )}

              <div className="flex items-center gap-4">
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="w-10 h-10 rounded-full bg-white border border-[#546B41] flex items-center justify-center hover:bg-red-100 transition-colors tooltip"
                    title="Stop Speaking"
                  >
                    <PauseCircle size={20} className="text-red-500" />
                  </button>
                )}

                <button
                  onClick={toggleListening}
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#546B41] transition-transform ${isListening ? 'bg-red-500 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-[#99AD7A] hover:bg-white hover:scale-105'}`}
                >
                  <Mic size={28} className={isListening ? "text-white animate-pulse" : "text-black"} />
                </button>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#546B41]">
                {isListening ? 'Listening...' : (isSpeaking ? 'Speaking...' : 'Tap Mic to Speak')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BiharMusicPlayer 
        isOpen={showMusicModal} 
        onClose={() => setShowMusicModal(false)} 
      />
    </>
  );
}

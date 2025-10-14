import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Mic, Send, Bot, Maximize, Minimize } from 'lucide-react';
import { apiService } from '../utils/api';

// --- Main Chatbot Component ---
const HealthMateChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false); // State for maximize/minimize
    const [messages, setMessages] = useState([
        { from: 'ai', text: "Hi Ishan 👋! I’m HealthMate, your wellness guide. You can type or speak your question." }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const isMealQuery = (message) => {
        const mealKeywords = ['ate', 'had for breakfast', 'lunch', 'dinner', 'snack', 'meal'];
        return mealKeywords.some(keyword => message.toLowerCase().includes(keyword));
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const userMessage = { from: 'user', text: newMessage };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsLoading(true);

        try {
            let response;
            if (isMealQuery(userMessage.text)) {
                response = await apiService.chatbot.analyzeMeal({ message: userMessage.text });
                const aiMessage = { from: 'ai', text: response.summary };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                response = await apiService.chatbot.getGeminiReply({ message: userMessage.text });
                const aiMessage = { from: 'ai', text: response.reply };
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error("Chatbot API error:", error);
            const errorMessage = { from: 'ai', text: `Sorry, I've run into a problem: ${error.message}` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceInput = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setNewMessage(transcript);
            setTimeout(() => document.getElementById('send-button').click(), 100);
        };

        recognition.start();
    };
    
    // Dynamic classes for window size
    const windowSizeClasses = isMaximized
      ? "fixed inset-0 w-full h-full rounded-none"
      : "fixed bottom-24 right-6 w-[90vw] max-w-md h-[70vh] rounded-2xl";

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary-light to-secondary-light rounded-full shadow-2xl flex items-center justify-center text-white"
            >
                <MessageCircle size={32} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        layout // Animate size and position changes
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`${windowSizeClasses} bg-white/80 backdrop-blur-xl shadow-2xl flex flex-col z-50 overflow-hidden border border-neutral-200`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white/50 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <Bot className="text-primary" />
                                <h3 className="font-bold text-neutral-800">HealthMate</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Maximize/Minimize Button */}
                                <button onClick={() => setIsMaximized(!isMaximized)} className="text-neutral-500 hover:text-neutral-800">
                                    {isMaximized ? <Minimize size={20} /> : <Maximize size={20} />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-neutral-800"><X size={20} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <ChatMessage key={index} from={msg.from} text={msg.text} />
                            ))}
                            {isLoading && <TypingIndicator />}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-neutral-200 bg-white/50 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={isListening ? "Listening..." : "Ask a health question..."}
                                    className="flex-1 w-full px-4 py-2 bg-neutral-100 border-transparent rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    autoFocus
                                    disabled={isLoading || isListening}
                                />
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleVoiceInput}
                                    disabled={isLoading}
                                    className={`p-2 rounded-full transition-colors ${isListening ? 'bg-danger text-white animate-pulse' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'}`}
                                >
                                    <Mic size={20} />
                                </motion.button>
                                <motion.button
                                    id="send-button"
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSendMessage}
                                    disabled={isLoading}
                                    className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                                >
                                    <Send size={20} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// --- Child Components for UI ---
const ChatMessage = ({ from, text }) => {
    const isAI = from === 'ai';
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-2 mb-4 ${isAI ? '' : 'justify-end'}`}
        >
            {isAI && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white flex-shrink-0"><Bot size={20} /></div>}
            <div className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-sm break-words ${isAI ? 'bg-neutral-100 text-neutral-800 rounded-bl-none' : 'bg-primary text-white rounded-br-none'}`}>
                <p className="text-sm">{text}</p>
            </div>
        </motion.div>
    );
};

const TypingIndicator = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end gap-2 mb-4"
    >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white flex-shrink-0"><Bot size={20} /></div>
        <div className="px-4 py-3 rounded-2xl bg-neutral-100 rounded-bl-none">
            <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce delay-0"></span>
                <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce delay-150"></span>
                <span className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce delay-300"></span>
            </div>
        </div>
    </motion.div>
);

export default HealthMateChatbot;


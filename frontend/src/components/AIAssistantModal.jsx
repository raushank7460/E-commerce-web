// AI Shopping Assistant modal with real-time MongoDB product recommendations
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { FiX, FiSend, FiShoppingBag, FiStar } from 'react-icons/fi';
import { Bot, User as UserIcon, Sparkles } from 'lucide-react';

const getFirstImage = (images) => {
  if (!images) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80';
  if (Array.isArray(images)) return images[0] || '';
  return images.split(' ')[0] || '';
};

const AIAssistantModal = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your AI Shopping Assistant. How can I help you today? You can ask me for budget recommendations, gadget advice, fashion picks, or product comparisons.',
      products: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Suggest a laptop under ₹60,000',
    'I need running shoes',
    'Which phone has the best camera?',
    'Show me products for a college student'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await api.post('/api/recommendations/assistant', { message: query });
      const { reply, products } = res.data.data;
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: reply, products: products || [] }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'I apologize, but I encountered an error searching the catalog. Please try asking again!',
          products: []
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[620px] shadow-2xl flex flex-col overflow-hidden border border-slate-200">

        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Bot className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">AI Shopping Assistant</h3>
                <span className="text-[10px] bg-emerald-400 text-slate-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live DB
                </span>
              </div>
              <p className="text-xs text-teal-100/80">Ask in plain English &amp; discover the best match</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0 text-sm shadow-sm mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none shadow-md shadow-teal-600/20'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="font-medium whitespace-pre-wrap">{msg.text}</p>

                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {msg.products.map((p) => {
                      const displayPrice = p.discountPrice > 0 ? p.discountPrice : p.price;
                      return (
                        <div
                          key={p._id}
                          className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 flex flex-col justify-between hover:bg-white transition-all shadow-xs"
                        >
                          <div className="flex gap-2.5 items-start">
                            <img
                              src={getFirstImage(p.images)}
                              alt={p.name}
                              className="w-14 h-14 object-cover rounded-lg flex-shrink-0 bg-slate-200"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">
                                {p.brand}
                              </span>
                              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</h4>
                              <div className="flex items-center gap-1 my-0.5">
                                <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-[11px] font-bold text-slate-600">
                                  {p.rating?.toFixed(1) || '4.5'}
                                </span>
                              </div>
                              <span className="text-xs font-extrabold text-slate-900 block">
                                ₹{displayPrice.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
                            <Link
                              to={`/products/${p._id}`}
                              onClick={onClose}
                              className="flex-1 text-center py-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                            >
                              Inspect
                            </Link>
                            <button
                              onClick={() => addToCart(p, 1)}
                              className="flex items-center justify-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                            >
                              <FiShoppingBag className="w-3 h-3" /> Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center flex-shrink-0 text-sm shadow-sm mt-1">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium pl-10">
              <span className="animate-spin text-teal-600">&#9696;</span>
              <span>AI is thinking &amp; scanning MongoDB products...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] font-semibold text-slate-600 bg-white hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-full px-3 py-1 whitespace-nowrap transition-all shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="E.g. Find black running shoes under 3000..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 focus:bg-white transition-all"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:hover:bg-teal-600 text-white flex items-center justify-center transition-all shadow-md shadow-teal-600/20 flex-shrink-0"
          >
            <FiSend className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;

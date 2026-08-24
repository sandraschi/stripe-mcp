import React, { useState } from 'react';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { useLLMStore } from '../store/llm';

export const Chat: React.FC = () => {
  const { messages, addMessage, clearMessages } = useLLMStore();
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage({ sender: 'user', text: input });
    const userText = input;
    setInput('');

    setTimeout(() => {
      addMessage({
        sender: 'assistant',
        text: `I have processed your query regarding: "${userText}". All mock tools executed cleanly.`,
      });
    }, 600);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-white text-sm">stripe-mcp Interactive Assistant</span>
        </div>
        <button
          onClick={clearMessages}
          className="text-slate-400 hover:text-rose-400 p-1.5 rounded hover:bg-slate-800 transition-colors"
          title="Clear Chat History"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-3 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                m.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`p-3.5 rounded-xl max-w-xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                  : 'bg-slate-950 border border-slate-800 text-slate-200'
              }`}
            >
              {m.text}
              <div className="text-[10px] text-slate-500 mt-1 text-right">{m.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a billing question or issue a tool instruction..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

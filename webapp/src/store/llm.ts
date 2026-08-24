import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

interface LLMStore {
  provider: 'local' | 'openai' | 'anthropic';
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  setProvider: (provider: 'local' | 'openai' | 'anthropic') => void;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

export const useLLMStore = create<LLMStore>((set) => ({
  provider: 'local',
  apiKey: '',
  model: 'llama3.2',
  messages: [
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello! I am your stripe-mcp billing & Austrian tax assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  setProvider: (provider) => set({ provider }),
  setApiKey: (apiKey) => set({ apiKey }),
  setModel: (model) => set({ model }),
  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
}));

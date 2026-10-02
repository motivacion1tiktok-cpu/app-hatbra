'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, ShieldCheck, User } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export default function MensajesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    async function initChat() {
      // 1. Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }

      // 2. Cargar historial de mensajes
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
      setLoading(false);
    }

    initChat();

    // 3. Suscribirse a mensajes en tiempo real (Realtime)
    const channel = supabase
      .channel('realtime_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll al recibir o enviar mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    const contentToSend = newMessage.trim();
    setNewMessage('');

    const { error } = await supabase.from('messages').insert([
      {
        sender_id: userId,
        content: contentToSend,
      },
    ]);

    if (error) {
      console.error('Error enviando mensaje:', error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Canal de Comunicación</h1>
        <p className="text-slate-500 text-sm">
          Coordinación directa y segura con el equipo de HATBRA.
        </p>
      </div>

      <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-xl">
            <User className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-medium text-sm">Soporte / Profesional HATBRA</h2>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              En línea • Canal Activo
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Chat Certificado</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 h-[420px] flex flex-col justify-between shadow-sm">
        <div className="overflow-y-auto space-y-3 pr-2 flex-1">
          {loading ? (
            <div className="text-center text-slate-400 py-10 text-sm">Cargando mensajes...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-slate-400 py-10 text-sm">
              No hay mensajes previos. ¡Inicia la conversación!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === userId;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                      isMe
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        isMe ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-100">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje para el profesional..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
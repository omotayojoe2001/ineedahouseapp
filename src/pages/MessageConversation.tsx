import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Send, Smile, MessageCircle, Paperclip, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const MessageConversation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecipient = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, full_name, avatar_url')
          .eq('user_id', id)
          .single();
        
        if (!error && data) {
          setRecipient(data);
        }
      } catch (error) {
        console.error('Error fetching recipient:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipient();
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;

    const fetchMessages = async () => {
      console.log('🔍 Fetching messages between:', user.id, 'and', id);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      console.log('📨 Messages fetched:', data?.length || 0, 'messages');
      if (error) console.error('❌ Error fetching messages:', error);
      
      if (!error && data) {
        setMessages(data);
        
        // Mark all received messages as read
        const unreadIds = data.filter(m => m.recipient_id === user.id && !m.read).map(m => m.id);
        if (unreadIds.length > 0) {
          await supabase.from('messages').update({ read: true }).in('id', unreadIds);
        }
      }
    };

    fetchMessages();

    // Subscribe to new messages
    console.log('🔔 Setting up real-time subscription for user:', user.id);
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('📬 New message received:', payload.new);
          // Add message if it's from the current conversation
          if (
            (payload.new.sender_id === id && payload.new.recipient_id === user.id) ||
            (payload.new.sender_id === user.id && payload.new.recipient_id === id)
          ) {
            console.log('✅ Message belongs to this conversation, adding to UI');
            setMessages((prev) => [...prev, payload.new]);
          } else {
            console.log('⏭️ Message not for this conversation');
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    return () => {
      console.log('🔌 Unsubscribing from messages channel');
      supabase.removeChannel(channel);
    };
  }, [user, id]);

  const getDisplayName = () => {
    if (!recipient) return 'User';
    if (recipient.full_name) return recipient.full_name;
    if (recipient.first_name && recipient.last_name) return `${recipient.first_name} ${recipient.last_name}`;
    if (recipient.first_name) return recipient.first_name;
    return 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      // Check if it's a video
      if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setAttachments(prev => [...prev, event.target?.result as string]);
        };
        reader.readAsDataURL(file);
        return;
      }

      // Handle image compression
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 800;
          const scale = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          setAttachments(prev => [...prev, canvas.toDataURL('image/jpeg', 0.6)]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSend = async () => {
    if ((!message.trim() && attachments.length === 0) || !user || !id || sending) return;

    console.log('📤 Sending message from:', user.id, 'to:', id);
    setSending(true);
    try {
      const newMessage = {
        sender_id: user.id,
        recipient_id: id,
        message: message.trim() || `[${attachments.length} file${attachments.length > 1 ? 's' : ''}]`,
        attachment: attachments.length > 0 ? JSON.stringify(attachments) : null,
      };
      
      console.log('💾 Inserting message:', newMessage);
      const { data, error } = await supabase.from('messages').insert(newMessage).select().single();

      if (error) {
        console.error('❌ Error sending message:', error);
        throw error;
      }

      console.log('✅ Message sent successfully:', data);
      setMessages((prev) => [...prev, data]);
      setMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('❌ Error in handleSend:', error);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Layout activeTab="messages">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/messages')} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <button 
              onClick={() => navigate(`/user/${id}`)}
              className="flex items-center gap-3 flex-1 hover:bg-muted/50 rounded-lg p-2 transition-colors"
            >
              {recipient?.avatar_url ? (
                <img src={recipient.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">{loading ? '...' : getInitials()}</span>
                </div>
              )}
              <div className="text-left">
                <h2 className="font-semibold">{loading ? 'Loading...' : getDisplayName()}</h2>
                <p className="text-sm text-muted-foreground">Tap to view profile</p>
              </div>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 py-4 pb-32 overflow-y-auto" style={{ paddingTop: '72px' }}>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isMe = msg.sender_id === user?.id;
                const time = new Date(msg.created_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                });
                
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isMe
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    }`}>
                      {msg.attachment && (() => {
                        try {
                          const files = JSON.parse(msg.attachment);
                          return (
                            <div className="space-y-2 mb-2">
                              {files.map((file: string, idx: number) => (
                                file.startsWith('data:video/') ? (
                                  <video key={idx} src={file} controls className="rounded-lg max-w-full" />
                                ) : (
                                  <img key={idx} src={file} alt="Attachment" className="rounded-lg max-w-full" />
                                )
                              ))}
                            </div>
                          );
                        } catch {
                          return msg.attachment.startsWith('data:video/') ? (
                            <video src={msg.attachment} controls className="rounded-lg mb-2 max-w-full" />
                          ) : (
                            <img src={msg.attachment} alt="Attachment" className="rounded-lg mb-2 max-w-full" />
                          );
                        }
                      })()}
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {time}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="fixed bottom-16 left-0 right-0 lg:bottom-0 px-4 py-3 border-t border-border bg-card">
          {attachments.length > 0 && (
            <div className="mb-2 flex gap-2 flex-wrap">
              {attachments.map((att, idx) => (
                <div key={idx} className="relative inline-block">
                  {att.startsWith('data:video/') ? (
                    <video src={att} className="h-20 rounded-lg" />
                  ) : (
                    <img src={att} alt="Preview" className="h-20 rounded-lg" />
                  )}
                  <button
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
            >
              <Paperclip size={20} />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-muted rounded-full px-3 py-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent focus:outline-none text-sm"
              />
              <button className="p-1 hover:bg-background rounded-full text-muted-foreground transition-colors">
                <Smile size={18} />
              </button>
            </div>
            <button 
              onClick={handleSend}
              disabled={(!message.trim() && attachments.length === 0) || sending}
              className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessageConversation;

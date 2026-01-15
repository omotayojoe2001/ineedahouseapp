import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      console.log('📥 Fetching conversations for user:', user.id);
      
      // Get all messages where user is sender or recipient
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching messages:', error);
        setLoading(false);
        return;
      }

      console.log('📨 Total messages:', messages?.length);

      // Group by conversation partner
      const conversationMap = new Map();
      messages?.forEach(msg => {
        const partnerId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        const existing = conversationMap.get(partnerId);
        const isUnread = msg.recipient_id === user.id && !msg.read;
        
        if (!existing) {
          conversationMap.set(partnerId, {
            partnerId,
            lastMessage: msg.message,
            lastMessageTime: msg.created_at,
            unreadCount: isUnread ? 1 : 0,
          });
        } else if (isUnread) {
          existing.unreadCount++;
        }
      });

      // Fetch profiles for all partners
      const partnerIds = Array.from(conversationMap.keys());
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, full_name, avatar_url')
        .in('user_id', partnerIds);

      console.log('👥 Profiles fetched:', profiles?.length);

      const conversationsList = Array.from(conversationMap.values()).map(conv => {
        const profile = profiles?.find(p => p.user_id === conv.partnerId);
        return {
          ...conv,
          name: profile?.full_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User',
          avatar: profile?.avatar_url,
        };
      });

      console.log('💬 Conversations:', conversationsList.length);
      setConversations(conversationsList);
      setLoading(false);
    };

    fetchConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages-list')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        console.log('🔔 New message received, refreshing list');
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations
    .filter(conv => filter === 'all' || conv.unreadCount > 0)
    .filter(conv => conv.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Layout activeTab="messages">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">Messages</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <Search size={20} />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
                  className="p-2 hover:bg-muted rounded-full"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          {showSearch && (
            <div className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
          )}
          
          {/* Filter Chips */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'unread' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No messages yet</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.partnerId}
                className="px-4 py-4 hover:bg-muted/20 cursor-pointer"
                onClick={() => navigate(`/messages/${conv.partnerId}`)}
              >
                <div className="flex items-start gap-3">
                  {conv.avatar ? (
                    <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">{conv.name[0]}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="font-medium text-sm">{conv.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{formatTime(conv.lastMessageTime)}</span>
                        {conv.unreadCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, MoreHorizontal, CheckCheck, MessageCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            participant_1_profile:profiles!conversations_participant_1_fkey(first_name, last_name, avatar_url),
            participant_2_profile:profiles!conversations_participant_2_fkey(first_name, last_name, avatar_url),
            messages(content, created_at, sender_id, read_at)
          `)
          .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
          .order('last_message_at', { ascending: false });

        if (error) throw error;

        const processedConversations = (data || []).map(conv => {
          const otherParticipant = conv.participant_1 === user.id ? conv.participant_2_profile : conv.participant_1_profile;
          const lastMessage = conv.messages?.[0];
          const unreadMessages = conv.messages?.filter(msg => 
            msg.sender_id !== user.id && !msg.read_at
          ).length || 0;

          return {
            id: conv.id,
            name: `${otherParticipant?.first_name || ''} ${otherParticipant?.last_name || ''}`.trim() || 'Unknown User',
            avatar: otherParticipant?.avatar_url,
            lastMessage: lastMessage?.content || 'No messages yet',
            timestamp: lastMessage ? formatTimestamp(lastMessage.created_at) : '',
            unread: unreadMessages > 0,
            unreadCount: unreadMessages,
            property_id: conv.property_id,
            property_type: conv.property_type,
          };
        });

        setConversations(processedConversations);
        setUnreadCount(processedConversations.reduce((sum, conv) => sum + conv.unreadCount, 0));
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({ title: 'Error', description: 'Failed to load conversations', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to real-time updates
    const conversationsSubscription = supabase
      .channel('conversations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversations' },
        () => fetchConversations()
      )
      .subscribe();

    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      conversationsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  }, [user, toast]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout activeTab="messages">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header */}
        <div className="px-4 pt-12 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Messages</h1>
              {unreadCount > 0 && (
                <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                  {unreadCount}
                </div>
              )}
            </div>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <MoreHorizontal size={20} className="text-muted-foreground" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Messages List */}
        <div className="divide-y divide-border">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
              <p className="text-muted-foreground">Start a conversation with property owners and agents!</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div 
                key={conversation.id} 
                className="px-4 py-4 hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => navigate(`/messages/${conversation.id}`)}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {conversation.avatar ? (
                        <img src={conversation.avatar} alt={conversation.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground">
                          {conversation.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    {conversation.unread && (
                      <Circle size={12} className="absolute -top-1 -right-1 text-primary fill-current" />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground truncate">{conversation.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        {conversation.unreadCount > 0 && (
                          <div className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${conversation.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {conversation.lastMessage}
                      </p>
                      {!conversation.unread && (
                        <CheckCheck size={16} className="text-primary ml-2 flex-shrink-0" />
                      )}
                    </div>
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
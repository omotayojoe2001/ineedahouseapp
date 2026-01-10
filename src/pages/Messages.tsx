import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Search, MoreHorizontal, CheckCheck, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  property?: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [messages] = useState<Message[]>([
    {
      id: '1',
      name: 'John Adebayo',
      avatar: '/placeholder.svg',
      lastMessage: 'Is the apartment still available?',
      timestamp: '2m ago',
      unread: true,
      property: '3BR Apartment in Lekki',
    },
    {
      id: '2',
      name: 'Sarah Okafor',
      avatar: '/placeholder.svg',
      lastMessage: 'Thank you for the inspection report!',
      timestamp: '1h ago',
      unread: false,
      property: 'Villa in Banana Island',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      avatar: '/placeholder.svg',
      lastMessage: 'Can we schedule a viewing for tomorrow?',
      timestamp: '3h ago',
      unread: true,
      property: 'Land in Abuja',
    },
    {
      id: '4',
      name: 'Grace Emeka',
      avatar: '/placeholder.svg',
      lastMessage: 'Perfect! I\'ll take it.',
      timestamp: '1d ago',
      unread: false,
      property: 'Shortlet in VI',
    },
  ]);

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout activeTab="messages">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        {/* Header */}
        <div className="px-4 pt-12 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
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
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
              <p className="text-muted-foreground">Start a conversation with property owners and agents!</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div 
                key={message.id} 
                className="px-4 py-4 hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => navigate(`/messages/${message.id}`)}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-semibold text-muted-foreground">
                        {message.name.charAt(0)}
                      </span>
                    </div>
                    {message.unread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground truncate">{message.name}</h3>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    
                    {message.property && (
                      <p className="text-xs text-primary mb-1 truncate">{message.property}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${message.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {message.lastMessage}
                      </p>
                      {!message.unread && (
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
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { ArrowLeft, Send, Paperclip, Image, Video, FileText, Smile } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const MessageConversation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [messages] = useState([
    { id: '1', text: 'Hi, I\'m interested in your property listing', sender: 'other', time: '10:30 AM' },
    { id: '2', text: 'Hello! Thank you for your interest. Which property are you asking about?', sender: 'me', time: '10:32 AM' },
    { id: '3', text: 'The 3BR apartment in Lekki Phase 1', sender: 'other', time: '10:33 AM' },
    { id: '4', text: 'Great choice! It\'s available for viewing. When would you like to schedule an inspection?', sender: 'me', time: '10:35 AM' },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      // Add message logic here
      setMessage('');
    }
  };

  const handleFileUpload = (type: string) => {
    // File upload logic here
    console.log(`Upload ${type}`);
  };

  return (
    <Layout activeTab="messages">
      <div className="bg-background min-h-screen desktop-nav-spacing flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/messages')} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium">JD</span>
              </div>
              <div>
                <h2 className="font-semibold">John Doe</h2>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === 'me' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="px-4 py-4 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            {/* Attachment Options */}
            <div className="flex gap-1">
              <button 
                onClick={() => handleFileUpload('image')}
                className="p-2 hover:bg-muted rounded-lg text-muted-foreground"
              >
                <Image size={18} />
              </button>
              <button 
                onClick={() => handleFileUpload('video')}
                className="p-2 hover:bg-muted rounded-lg text-muted-foreground"
              >
                <Video size={18} />
              </button>
              <button 
                onClick={() => handleFileUpload('file')}
                className="p-2 hover:bg-muted rounded-lg text-muted-foreground"
              >
                <FileText size={18} />
              </button>
              <button 
                onClick={() => handleFileUpload('attachment')}
                className="p-2 hover:bg-muted rounded-lg text-muted-foreground"
              >
                <Paperclip size={18} />
              </button>
            </div>

            {/* Message Input */}
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
                <Smile size={18} />
              </button>
              <button 
                onClick={handleSend}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessageConversation;
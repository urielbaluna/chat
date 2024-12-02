import { useState, useEffect } from 'react';
import { ChatList } from './components/ChatList';
import { ChatWindow } from './components/ChatWindow';
import { AddContactModal } from './components/AddContactModal';
import { LoginModal } from './components/LoginModal';
import { ProfileModal } from './components/ProfileModal';
import type { Chat, Message, User } from './types';

const initialChats: Chat[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    lastMessage: 'Looking forward to our meeting!',
    unreadCount: 2,
    online: true,
    messages: [
      {
        id: '1',
        content: 'Hi there! How are you?',
        sender: 'Sarah Wilson',
        timestamp: new Date('2024-03-10T10:00:00'),
        isOwn: false,
      },
      {
        id: '2',
        content: "I'm doing great, thanks! How about you?",
        sender: 'me',
        timestamp: new Date('2024-03-10T10:01:00'),
        isOwn: true,
      },
      {
        id: '3',
        content: 'Looking forward to our meeting!',
        sender: 'Sarah Wilson',
        timestamp: new Date('2024-03-10T10:02:00'),
        isOwn: false,
      },
    ],
  },
  // ... other chats remain the same
];

function generateCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<string>(chats[0].id);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (name: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      code: generateCode(),
    };
    setUser(newUser);
    localStorage.setItem('chatUser', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chatUser');
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('chatUser', JSON.stringify(updatedUser));
  };

  const handleSendMessage = (content: string, file?: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'me',
      timestamp: new Date(),
      isOwn: true,
    };

    if (file) {
      const url = URL.createObjectURL(file);
      newMessage.attachment = {
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url,
        name: file.name,
        size: file.size,
      };
    }

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: content || `Sent ${file?.type.startsWith('image/') ? 'an image' : 'a file'}`,
            }
          : chat
      )
    );
  };

  const handleAddContact = (code: string) => {
    const newContact: Chat = {
      id: code,
      name: `User ${code}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      lastMessage: '',
      unreadCount: 0,
      online: true,
      messages: [],
    };

    setChats((prevChats) => [...prevChats, newContact]);
    setActiveChat(code);
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return <LoginModal onLogin={handleLogin} />;
  }

  const currentChat = chats.find((chat) => chat.id === activeChat)!;

  return (
    <div className="flex h-screen bg-dark text-white">
      <div
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:block md:w-80 lg:w-96 flex-shrink-0 h-full border-r border-white/10`}
      >
        <ChatList
          chats={chats}
          activeChat={activeChat}
          user={user}
          onChatSelect={(id) => {
            setActiveChat(id);
            setIsMobileMenuOpen(false);
          }}
          onAddContact={() => setIsAddModalOpen(true)}
          onProfileClick={() => setIsProfileModalOpen(true)}
        />
      </div>
      <ChatWindow
        chat={currentChat}
        onSendMessage={handleSendMessage}
        onMenuClick={() => setIsMobileMenuOpen(true)}
        isMobileMenuVisible={isMobileMenuOpen}
      />
      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddContact}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
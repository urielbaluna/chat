import { MessageCircle, UserPlus, User } from 'lucide-react';
import type { Chat, User as UserType } from '../types';

interface ChatListProps {
  chats: Chat[];
  activeChat: string;
  user: UserType;
  onChatSelect: (chatId: string) => void;
  onAddContact: () => void;
  onProfileClick: () => void;
}

export function ChatList({ 
  chats, 
  activeChat, 
  user,
  onChatSelect, 
  onAddContact,
  onProfileClick 
}: ChatListProps) {
  return (
    <div className="h-full flex flex-col bg-dark/95">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Messages
          </h1>
          <div className="flex gap-2">
            <button
              onClick={onAddContact}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Add Contact"
            >
              <UserPlus className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={onProfileClick}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Profile"
            >
              <User className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400">Code: {user.code}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors ${
              activeChat === chat.id ? 'bg-white/10' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">{chat.name}</h3>
              <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
            </div>
            {chat.unreadCount > 0 && (
              <div className="bg-primary px-2 py-1 rounded-full text-xs text-white">
                {chat.unreadCount}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
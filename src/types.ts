export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
  attachment?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size: number;
  };
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  code: string;
}
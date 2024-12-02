import React, { useRef, useEffect } from 'react';
import { Send, Menu, Paperclip, X, FileText } from 'lucide-react';
import type { Chat } from '../types';

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (content: string, attachment?: File) => void;
  onMenuClick: () => void;
  isMobileMenuVisible: boolean;
}

export function ChatWindow({ 
  chat, 
  onSendMessage, 
  onMenuClick
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chat.messages]);

  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      onSendMessage(message, selectedFile || undefined);
      setMessage('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-dark">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-medium text-white">{chat.name}</h2>
          <p className="text-sm text-gray-400">
            {chat.online ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-3 ${
                message.isOwn
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-white'
              }`}
            >
              {message.attachment && message.attachment.type === 'image' && (
                <div className="mb-2">
                  <img
                    src={message.attachment.url}
                    alt="Attachment"
                    className="rounded-lg max-h-[300px] w-auto"
                  />
                </div>
              )}
              {message.attachment && message.attachment.type === 'file' && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-white/5 rounded-lg">
                  <FileText className="w-5 h-5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{message.attachment.name}</p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(message.attachment.size)}
                    </p>
                  </div>
                </div>
              )}
              {message.content && <p className="break-words">{message.content}</p>}
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        {selectedFile && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg flex items-center gap-3">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded object-cover" />
            ) : (
              <div className="w-16 h-16 bg-white/10 rounded flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-400">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
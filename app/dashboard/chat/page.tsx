'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { MessageSquare, Send, Search, User } from 'lucide-react'

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const chats = [
    { id: '1', name: 'John Doe', lastMessage: 'Hello, I need help with...', unread: 2 },
    { id: '2', name: 'Jane Smith', lastMessage: 'Thanks for the quick response!', unread: 0 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-Time Chat</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2">Communicate with customers and shop owners</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden h-[calc(100vh-200px)] flex">
          {/* Chat List */}
          <div className="w-80 border-r border-gray-200 dark:border-slate-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 ${
                    selectedChat === chat.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">{chat.name}</p>
                        {chat.unread > 0 && (
                          <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {chats.find((c) => c.id === selectedChat)?.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-md">
                      <p className="text-sm text-gray-900">Hello, I need help with my order</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary-600 text-white rounded-lg px-4 py-2 max-w-md">
                      <p className="text-sm">How can I help you today?</p>
                      <p className="text-xs text-primary-100 mt-1">10:31 AM</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          // Send message
                          setMessage('')
                        }
                      }}
                    />
                    <button className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-slate-400">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}



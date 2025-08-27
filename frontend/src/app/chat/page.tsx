"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, ArrowLeft, Menu, X, LogOut, Users, Send } from "lucide-react";
import Logo from "@/components/Logo";
import WhatsAppButton from "@/components/WhatsAppButton";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-228802607375.asia-south1.run.app';


interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  aUserId: string;
  bUserId: string;
  createdAt: string;
  otherUser: {
    id: string;
    name: string;
    age: number;
    city: string;
  };
  lastMessage?: {
    text: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount?: number;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  readAt?: string;
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchConversations(token);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  const fetchConversations = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/chat/conversations`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/chat/messages?conversationId=${conversationId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setIsSending(true);
    try {
      const response = await fetch(`${API_URL}/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          text: newMessage,
        }),
      });

      if (response.ok) {
        const newMsg = await response.json();
        setMessages(prev => [...prev, newMsg]);
        setNewMessage("");
        fetchConversations(token);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
    
    if (conversation.unreadCount && conversation.unreadCount > 0) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`${API_URL}/chat/messages?conversationId=${conversation.id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (response.ok) {
            const messages = await response.json();
            for (const message of messages) {
              if (!message.readAt && message.senderId !== user?.id) {
                await fetch(`${API_URL}/chat/messages/${message.id}/read`, {
                  method: "PATCH",
                  headers: { "Authorization": `Bearer ${token}` }
                });
              }
            }
            fetchConversations(token);
          }
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-gray-700 hover:text-rose-600 font-medium">
                Dashboard
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-rose-600 font-medium">
                Search
              </Link>
              <Link href="/proposals" className="text-gray-700 hover:text-rose-600 font-medium">
                Proposals
              </Link>
              <Link href="/chat" className="text-rose-600 font-medium">
                Messages
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-rose-600 font-medium">
                Profile
              </Link>
              {user?.role === "ADMIN" && (
                <Link href="/admin" className="text-gray-700 hover:text-rose-600 font-medium">
                  Admin Panel
                </Link>
              )}
              <Link href="/settings" className="text-gray-700 hover:text-rose-600 font-medium">
                Settings
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleLogout} variant="outline" className="hidden sm:inline-flex text-gray-700 hover:text-rose-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <button
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-rose-600 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/search"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search
                </Link>
                <Link
                  href="/proposals"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Proposals
                </Link>
                <Link
                  href="/chat"
                  className="block px-3 py-2 text-rose-600 font-medium rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/settings"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                >
                  <LogOut className="h-4 w-4 mr-2 inline" />
                  Logout
                </button>
                
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Chat Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild className="md:hidden">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Chat with your matches</p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Conversations
              </CardTitle>
              <CardDescription>Your active chats</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-sm">Loading conversations...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Start chatting with your matches to see conversations here.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/proposals">View Matches</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "bg-rose-50 border border-rose-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{conversation.otherUser.name}</h4>
                            {conversation.unreadCount && conversation.unreadCount > 0 && (
                              <span className="bg-rose-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {conversation.otherUser.age} years • {conversation.otherUser.city}
                          </p>
                          {conversation.lastMessage && (
                            <p className={`text-sm truncate mt-1 ${
                              conversation.unreadCount && conversation.unreadCount > 0 
                                ? "text-gray-900 font-medium" 
                                : "text-gray-500"
                            }`}>
                              {conversation.lastMessage.text}
                            </p>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <div className="text-xs text-gray-400">
                            {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Chat
              </CardTitle>
              <CardDescription>Select a conversation to start chatting</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              {!selectedConversation ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Messages</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Connect with your matches and start meaningful conversations. 
                    You can chat once there's mutual interest.
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                      To start chatting:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="outline" asChild>
                        <Link href="/search">Find Matches</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/proposals">View Proposals</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="border-b pb-4 mb-4">
                  <Link href={`/profile/${selectedConversation.otherUser.id}`}>
                    <h3 className="font-semibold text-lg">{selectedConversation.otherUser.name}</h3>
                  </Link>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.otherUser.age} years • {selectedConversation.otherUser.city}
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-96">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === user?.id
                                ? "bg-rose-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === user?.id ? "text-rose-100" : "text-gray-500"
                            }`}>
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                    <Button onClick={sendMessage} disabled={isSending || !newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <WhatsAppButton variant="floating" />
    </div>
  );
}

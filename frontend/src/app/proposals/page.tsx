"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowLeft, Menu, X, LogOut, UserCheck, UserPlus, Star } from "lucide-react";
import Logo from "@/components/Logo";
import WhatsAppButton from "@/components/WhatsAppButton";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ProposalsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("matches");
  const [proposalsData, setProposalsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProposals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/interests/proposals", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProposalsData(data);
      } else {
        setError("Failed to load proposals");
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
      fetchProposals();
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

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

  const tabs = [
    { id: "matches", label: "Matches for You", icon: Users },
    { id: "received", label: "Interested in You", icon: UserCheck },
    { id: "sent", label: "Your Interests", icon: UserPlus },
    { id: "shortlisted", label: "Shortlisted", icon: Star }
  ];

  const renderEmptyState = (tabId: string) => {
    const emptyStates = {
      matches: {
        icon: Logo,
        title: "No matches yet",
        description: "We haven't found any compatible profiles for you yet. Complete your profile to get better matches!",
        action: "Complete Profile"
      },
      received: {
        icon: UserCheck,
        title: "No one has shown interest yet",
        description: "Don't worry! Make sure your profile is complete and attractive to get more interest.",
        action: "Update Profile"
      },
      sent: {
        icon: UserPlus,
        title: "You haven't sent any interests",
        description: "Start browsing profiles and send interests to people you like.",
        action: "Browse Profiles"
      },
      shortlisted: {
        icon: Star,
        title: "No shortlisted profiles",
        description: "Shortlist profiles you're interested in to keep track of potential matches.",
        action: "Find Matches"
      }
    };

    const state = emptyStates[tabId as keyof typeof emptyStates];
    const IconComponent = state.icon;

    return (
      <div className="text-center py-12">
        <IconComponent className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{state.title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{state.description}</p>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/search">{state.action}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  };

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
              <Link href="/proposals" className="text-rose-600 font-medium">
                Proposals
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-rose-600 font-medium">
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
                  className="block px-3 py-2 text-rose-600 font-medium rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Proposals
                </Link>
                <Link
                  href="/chat"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
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

      {/* Proposals Content */}
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Proposals</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your interests and matches</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-rose-500 text-rose-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const activeTabData = tabs.find(tab => tab.id === activeTab);
                const IconComponent = activeTabData?.icon || Users;
                return <IconComponent className="h-5 w-5" />;
              })()}
              {tabs.find(tab => tab.id === activeTab)?.label}
            </CardTitle>
            <CardDescription>
              {activeTab === "matches" && "Profiles that match your preferences"}
              {activeTab === "received" && "People who have shown interest in your profile"}
              {activeTab === "sent" && "Interests you have sent to other profiles"}
              {activeTab === "shortlisted" && "Profiles you have shortlisted for future reference"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchProposals} variant="outline">Try Again</Button>
              </div>
            ) : (
              <>
                {activeTab === "matches" && (
                  proposalsData?.matches?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {proposalsData.matches.map((profile: any) => (
                        <Card key={profile.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-lg">{profile.name}</h4>
                              <p className="text-sm text-gray-600">{profile.age} years • {profile.city}</p>
                              <p className="text-sm text-gray-600">{profile.occupation}</p>
                              <div className="pt-2">
                                <Button size="sm" asChild>
                                  <Link href={`/profile/${encodeURIComponent(profile.name)}`}>View Profile</Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : renderEmptyState("matches")
                )}
                
                {activeTab === "received" && (
                  proposalsData?.receivedInterests?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {proposalsData.receivedInterests.map((interest: any) => (
                        <Card key={interest.interestId} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-lg">{interest.profile.name}</h4>
                              <p className="text-sm text-gray-600">{interest.profile.age} years • {interest.profile.city}</p>
                              <p className="text-sm text-gray-600">{interest.profile.occupation}</p>
                              <p className="text-xs text-gray-500">Interested on {new Date(interest.createdAt).toLocaleDateString()}</p>
                              <div className="pt-2 flex gap-2">
                                <Button size="sm" asChild>
                                  <Link href={`/profile/${encodeURIComponent(interest.profile.name)}`}>View Profile</Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : renderEmptyState("received")
                )}
                
                {activeTab === "sent" && (
                  proposalsData?.sentInterests?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {proposalsData.sentInterests.map((interest: any) => (
                        <Card key={interest.interestId} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-lg">{interest.profile.name}</h4>
                              <p className="text-sm text-gray-600">{interest.profile.age} years • {interest.profile.city}</p>
                              <p className="text-sm text-gray-600">{interest.profile.occupation}</p>
                              <p className="text-xs text-gray-500">Status: {interest.status} • Sent on {new Date(interest.createdAt).toLocaleDateString()}</p>
                              <div className="pt-2">
                                <Button size="sm" asChild>
                                  <Link href={`/profile/${encodeURIComponent(interest.profile.name)}`}>View Profile</Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : renderEmptyState("sent")
                )}
                
                {activeTab === "shortlisted" && renderEmptyState("shortlisted")}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <WhatsAppButton variant="floating" />
    </div>
  );
}

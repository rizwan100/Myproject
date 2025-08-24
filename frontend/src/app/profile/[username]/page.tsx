"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ArrowLeft, Menu, X, LogOut, MapPin, Calendar, Phone, Mail, Briefcase, GraduationCap, Users, Home, FileText, Download, Eye } from "lucide-react";
import Logo from "@/components/Logo";
import WhatsAppButton from "@/components/WhatsAppButton";

interface Profile {
  id: string;
  userId: string;
  name: string;
  gender: string;
  age: number;
  maritalStatus: string;
  motherTongue: string;
  religion: string;
  caste: string;
  city: string;
  state: string;
  residingCountry: string;
  food: string;
  complexion: string;
  bodyType: string;
  heightCm: number;
  physicalStatus: string;
  educationQualification: string;
  occupation: string;
  aboutMe: string;
  approved: boolean;
  createdAt: string;
  photos: Array<{ id: string; url: string; isPrimary: boolean }>;
  documents: Array<{ id: string; url: string; type: string }>;
  mobileNumber?: string;
  hasMutualInterest?: boolean;
}

interface User {
  id: string;
  email: string;
  role: string;
}

export default function ProfileDetailPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sendingInterest, setSendingInterest] = useState(false);
  const [addingToShortlist, setAddingToShortlist] = useState(false);
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    const fetchProfile = async () => {
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`http://127.0.0.1:8000/profiles/by-name/${encodeURIComponent(username)}`, {
          headers
        });

        if (response.ok) {
          const profileData = await response.json();
          console.log("Profile data received:", profileData);
          console.log("hasMutualInterest:", profileData.hasMutualInterest);
          setProfile(profileData);
        } else if (response.status === 404) {
          setError("Profile not found");
        } else if (response.status === 403) {
          setError("You don't have permission to view this profile");
        } else {
          setError("Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleSendInterest = async () => {
    if (!profile || !user) return;
    
    setSendingInterest(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://127.0.0.1:8000/interests/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          toUserId: (profile as any).userId
        }),
      });

      if (response.ok) {
        alert("Interest sent successfully!");
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to send interest");
      }
    } catch (error) {
      console.error("Error sending interest:", error);
      alert("Network error. Please try again.");
    } finally {
      setSendingInterest(false);
    }
  };

  const handleAddToShortlist = async () => {
    if (!profile) return;
    
    setAddingToShortlist(true);
    try {
      alert("Added to shortlist! (Feature coming soon)");
    } catch (error) {
      console.error("Error adding to shortlist:", error);
      alert("Network error. Please try again.");
    } finally {
      setAddingToShortlist(false);
    }
  };

  const handleSendMessage = () => {
    router.push("/chat");
  };

  const handleBlockUser = async () => {
    if (!profile) return;
    
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/chat/block-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: profile.userId })
      });

      if (response.ok) {
        alert("User blocked successfully");
        router.push("/search");
      } else {
        alert("Failed to block user");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center">
              
                <span className="ml-2 text-xl font-bold text-gray-900">Aasan Rishte</span>
              </Link>
              <div className="flex items-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/search">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Search
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The profile you're looking for doesn't exist."}</p>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/search">Browse Profiles</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Go to Homepage</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-rose-600 font-medium">Dashboard</Link>
                  <Link href="/search" className="text-gray-700 hover:text-rose-600 font-medium">Search</Link>
                  <Link href="/proposals" className="text-gray-700 hover:text-rose-600 font-medium">Proposals</Link>
                  <Link href="/chat" className="text-gray-700 hover:text-rose-600 font-medium">Messages</Link>
                </>
              ) : (
                <>
                  <Link href="/register" className="text-gray-700 hover:text-rose-600 font-medium">Register Free</Link>
                  <Link href="/search" className="text-gray-700 hover:text-rose-600 font-medium">Search</Link>
                  <Link href="/login" className="text-gray-700 hover:text-rose-600 font-medium">Login</Link>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild className="hidden sm:inline-flex">
                <Link href="/search">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Link>
              </Button>
              {isLoggedIn && (
                <Button onClick={handleLogout} variant="outline" className="hidden sm:inline-flex text-gray-700 hover:text-rose-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
              <button
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-rose-600 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {isLoggedIn ? (
                  <>
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
                      className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Messages
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register Free
                    </Link>
                    <Link
                      href="/search"
                      className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Search
                    </Link>
                    <Link
                      href="/login"
                      className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-4 bg-gray-200 rounded-lg overflow-hidden">
                    {profile.photos && profile.photos.length > 0 ? (
                      <img
                        src={profile.photos.find(p => p.isPrimary)?.url || profile.photos[0]?.url}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="h-16 w-16" />
                      </div>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{profile.age} years old</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.city}, {profile.state}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{profile.occupation}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{profile.educationQualification}</span>
                    </div>
                  </div>
                  
                  {isLoggedIn && profile.mobileNumber ? (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <Phone className="h-4 w-4" />
                        <span className="font-medium">{profile.mobileNumber}</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">Contact information available</p>
                    </div>
                  ) : !isLoggedIn ? (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <Link href="/login" className="font-medium hover:underline">Login</Link> to view contact details
                      </p>
                    </div>
                  ) : null}
                  
                  {isLoggedIn && (
                    <div className="mt-6 space-y-3">
                      {profile.hasMutualInterest ? (
                        <Button 
                          onClick={handleSendMessage}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Send Message
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleSendInterest}
                          disabled={sendingInterest}
                          className="w-full bg-rose-600 hover:bg-rose-700"
                        >
                          {sendingInterest ? "Sending..." : "Send Interest"}
                        </Button>
                      )}
                      <Button 
                        onClick={handleAddToShortlist}
                        disabled={addingToShortlist}
                        variant="outline" 
                        className="w-full"
                      >
                        {addingToShortlist ? "Adding..." : "Add to Shortlist"}
                      </Button>
                      <Button 
                        onClick={handleBlockUser}
                        variant="destructive" 
                        className="w-full"
                      >
                        Block User
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{profile.aboutMe}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Marital Status</label>
                    <p className="text-gray-900">{profile.maritalStatus.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mother Tongue</label>
                    <p className="text-gray-900">{profile.motherTongue}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Religion</label>
                    <p className="text-gray-900">{profile.religion}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Caste</label>
                    <p className="text-gray-900">{profile.caste}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Height</label>
                    <p className="text-gray-900">{profile.heightCm} cm</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Complexion</label>
                    <p className="text-gray-900">{profile.complexion.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Body Type</label>
                    <p className="text-gray-900">{profile.bodyType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Physical Status</label>
                    <p className="text-gray-900">{profile.physicalStatus}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Food Preference</label>
                    <p className="text-gray-900">{profile.food.replace('_', ' ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">City</label>
                    <p className="text-gray-900">{profile.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">State</label>
                    <p className="text-gray-900">{profile.state}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Country</label>
                    <p className="text-gray-900">{profile.residingCountry}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Occupation</label>
                    <p className="text-gray-900">{profile.occupation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Education</label>
                    <p className="text-gray-900">{profile.educationQualification}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {profile.documents && profile.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Biodata Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.documents.map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {document.type === 'BIODATA_PDF' ? 'Biodata (PDF)' : 
                               document.type === 'BIODATA_DOC' ? 'Biodata (DOC)' : 
                               document.type === 'BIODATA_DOCX' ? 'Biodata (DOCX)' : 'Biodata Document'}
                            </p>
                            <p className="text-xs text-gray-500">Click to view or download</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {document.type === 'BIODATA_PDF' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(document.url, '_blank')}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = document.url;
                                link.download = `biodata.${document.type === 'BIODATA_DOC' ? 'doc' : 'docx'}`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <WhatsAppButton variant="floating" />
    </div>
  );
}

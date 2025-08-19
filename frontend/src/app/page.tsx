"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, MessageCircle, MapPin, Calendar, Phone, Mail, Menu, X, User } from "lucide-react";
import Logo from "@/components/Logo";
import WhatsAppButton from "@/components/WhatsAppButton";

interface Profile {
  id: string;
  name: string;
  age: number;
  city: string;
  state: string;
  occupation: string;
  educationQualification: string;
  gender: string;
  photos: Array<{ url: string; isPrimary: boolean }>;
}

export default function Home() {
  const [groomProfiles, setGroomProfiles] = useState<Profile[]>([]);
  const [brideProfiles, setBrideProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const groomResponse = await fetch("http://127.0.0.1:8000/profiles?lookingFor=GROOM");
        if (groomResponse.ok) {
          const grooms = await groomResponse.json();
          setGroomProfiles(grooms.slice(0, 6)); // Show latest 6
        }

        const brideResponse = await fetch("http://127.0.0.1:8000/profiles?lookingFor=BRIDE");
        if (brideResponse.ok) {
          const brides = await brideResponse.json();
          setBrideProfiles(brides.slice(0, 6)); // Show latest 6
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const ProfileCard = ({ profile }: { profile: Profile }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
          {profile.photos && profile.photos.length > 0 ? (
            <img
              src={profile.photos.find(p => p.isPrimary)?.url || profile.photos[0]?.url}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User className="h-12 w-12" />
            </div>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-1">{profile.name}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{profile.age} years</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{profile.city}, {profile.state}</span>
          </div>
          <div className="text-xs">
            <div>{profile.occupation}</div>
            <div>{profile.educationQualification}</div>
          </div>
        </div>
        <Button asChild className="w-full mt-3 bg-rose-600 hover:bg-rose-700" size="sm">
          <Link href={`/profile/${encodeURIComponent(profile.name)}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-rose-600 font-medium">
                Home
              </Link>
              <Link href="/register" className="text-gray-700 hover:text-rose-600 font-medium">
                Register Free
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-rose-600 font-medium">
                Advanced Search
              </Link>
              <Link href="/proposals" className="text-gray-700 hover:text-rose-600 font-medium">
                Proposals
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-rose-600 font-medium">
                Login
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild className="hidden sm:inline-flex bg-rose-600 hover:bg-rose-700">
                <Link href="/register">Register Free</Link>
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
                  href="/"
                  className="block px-3 py-2 text-rose-600 font-medium rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
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
                  Advanced Search
                </Link>
                <Link
                  href="/proposals"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Proposals
                </Link>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Find Your Perfect
            <span className="text-rose-600"> Life Partner</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Join thousands of Muslims looking for their soulmate. 
            Create your profile today and start your journey to find true love.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto">
              <Link href="/register">Register Free Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/search">Browse Profiles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Aasan Rishte?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-rose-600 mb-4" />
                <CardTitle>Verified Profiles</CardTitle>
                <CardDescription>
                  All profiles are manually verified to ensure authenticity and safety
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Search className="h-12 w-12 text-rose-600 mb-4" />
                <CardTitle>Advanced Search</CardTitle>
                <CardDescription>
                  Find matches based on age, education, profession, and more criteria
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-rose-600 mb-4" />
                <CardTitle>Secure Chat</CardTitle>
                <CardDescription>
                  Connect with matches through our secure messaging system
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Grooms Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Grooms</h2>
                <p className="text-gray-600 text-sm sm:text-base">Browse profiles of eligible bachelors looking for their life partner</p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Link href="/search?lookingFor=GROOM">View All Grooms</Link>
              </Button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : groomProfiles.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {groomProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <Logo showText={false} size="lg" className="mx-auto mb-4 opacity-50" />
                  <p>No groom profiles available yet</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Brides Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Brides</h2>
                <p className="text-gray-600 text-sm sm:text-base">Discover profiles of beautiful brides seeking their soulmate</p>
              </div>
              <Button asChild className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto">
                <Link href="/search?lookingFor=BRIDE">View All Brides</Link>
              </Button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : brideProfiles.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {brideProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <Logo showText={false} size="lg" className="mx-auto mb-4 opacity-50" />
                  <p>No bride profiles available yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Logo textClassName="text-white" />
              </div>
              <p className="text-gray-400">
                Find your perfect life partner with Aasan Rishte - the trusted matrimonial platform for Muslims.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:aasanrishtecontact@gmail.com" className="hover:text-white">
                    aasanrishtecontact@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+917569319126" className="hover:text-white">
                    +91 7569319126
                  </a>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex justify-center md:justify-end">
                <WhatsAppButton variant="outline" className="border-gray-600 text-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Aasan Rishte. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      <WhatsAppButton variant="floating" />
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users, ArrowLeft, Menu, X, LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import WhatsAppButton from "@/components/WhatsAppButton";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function SearchPage() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchFilters, setSearchFilters] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('searchFilters');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Error parsing saved search filters:', error);
        }
      }
    }
    return {
      ageMin: "",
      ageMax: "",
      location: "",
      education: "",
      occupation: "",
      maritalStatus: "",
      motherTongue: "",
      religion: "",
      caste: "",
      complexion: "",
      heightMin: "",
      heightMax: "",
      food: "",
      country: "",
      state: "",
      city: ""
    };
  });
  const router = useRouter();

  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      
      if (searchFilters.ageMin) params.append("ageMin", searchFilters.ageMin);
      if (searchFilters.ageMax) params.append("ageMax", searchFilters.ageMax);
      if (searchFilters.maritalStatus && searchFilters.maritalStatus !== "any") params.append("maritalStatus", searchFilters.maritalStatus);
      if (searchFilters.motherTongue && searchFilters.motherTongue !== "any") params.append("motherTongue", searchFilters.motherTongue);
      if (searchFilters.caste) params.append("caste", searchFilters.caste);
      if (searchFilters.complexion && searchFilters.complexion !== "any") params.append("complexion", searchFilters.complexion);
      if (searchFilters.heightMin) params.append("heightMin", searchFilters.heightMin);
      if (searchFilters.heightMax) params.append("heightMax", searchFilters.heightMax);
      if (searchFilters.education) params.append("education", searchFilters.education);
      if (searchFilters.occupation) params.append("occupation", searchFilters.occupation);
      if (searchFilters.country && searchFilters.country !== "any") params.append("country", searchFilters.country);
      if (searchFilters.state) params.append("state", searchFilters.state);
      if (searchFilters.city) params.append("city", searchFilters.city);
      if (searchFilters.food && searchFilters.food !== "any") params.append("food", searchFilters.food);
      if (searchFilters.religion) params.append("religion", searchFilters.religion);

      const response = await fetch(`http://127.0.0.1:8000/profiles?${params.toString()}`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });

      if (response.ok) {
        const profiles = await response.json();
        setSearchResults(profiles);
      } else {
        console.error("Search failed");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
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
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchFilters', JSON.stringify(searchFilters));
    }
  }, [searchFilters]);

  useEffect(() => {
    if (user) {
      const hasFilters = searchFilters.ageMin || searchFilters.ageMax || 
                        (searchFilters.maritalStatus && searchFilters.maritalStatus !== "any") ||
                        (searchFilters.motherTongue && searchFilters.motherTongue !== "any") ||
                        searchFilters.caste || 
                        (searchFilters.complexion && searchFilters.complexion !== "any") ||
                        searchFilters.heightMin || searchFilters.heightMax ||
                        searchFilters.education || searchFilters.occupation ||
                        (searchFilters.country && searchFilters.country !== "any") ||
                        searchFilters.state || searchFilters.city ||
                        (searchFilters.food && searchFilters.food !== "any") ||
                        searchFilters.religion;

      if (hasFilters && !hasSearched) {
        handleSearch();
      }
    }
  }, [user]); // Only run when user is loaded

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
              <Link href="/search" className="text-rose-600 font-medium">
                Search
              </Link>
              <Link href="/proposals" className="text-gray-700 hover:text-rose-600 font-medium">
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
                  className="block px-3 py-2 text-rose-600 font-medium rounded-md"
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Advanced Search</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Find your perfect match with detailed filters</p>
            </div>
          </div>
        </div>

        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Search Filters
            </CardTitle>
            <CardDescription>Refine your search to find the perfect match</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min age"
                        value={searchFilters.ageMin}
                        onChange={(e) => setSearchFilters({...searchFilters, ageMin: e.target.value})}
                      />
                      <Input
                        placeholder="Max age"
                        value={searchFilters.ageMax}
                        onChange={(e) => setSearchFilters({...searchFilters, ageMax: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                    <Select value={searchFilters.maritalStatus} onValueChange={(value) => setSearchFilters({...searchFilters, maritalStatus: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="NEVER_MARRIED">Never Married</SelectItem>
                        <SelectItem value="DIVORCED">Divorced</SelectItem>
                        <SelectItem value="WIDOWED">Widowed</SelectItem>
                        <SelectItem value="SEPARATED">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
                    <Select value={searchFilters.motherTongue} onValueChange={(value) => setSearchFilters({...searchFilters, motherTongue: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mother tongue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="URDU">Urdu</SelectItem>
                        <SelectItem value="HINDI">Hindi</SelectItem>
                        <SelectItem value="ENGLISH">English</SelectItem>
                        <SelectItem value="TELUGU">Telugu</SelectItem>
                        <SelectItem value="TAMIL">Tamil</SelectItem>
                        <SelectItem value="ARABIC">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <Select value={searchFilters.country} onValueChange={(value) => setSearchFilters({...searchFilters, country: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="INDIA">India</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="CANADA">Canada</SelectItem>
                        <SelectItem value="AUSTRALIA">Australia</SelectItem>
                        <SelectItem value="UAE">UAE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <Input
                      placeholder="Enter state"
                      value={searchFilters.state}
                      onChange={(e) => setSearchFilters({...searchFilters, state: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <Input
                      placeholder="Enter city"
                      value={searchFilters.city}
                      onChange={(e) => setSearchFilters({...searchFilters, city: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Professional & Educational</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    <Input
                      placeholder="Education qualification"
                      value={searchFilters.education}
                      onChange={(e) => setSearchFilters({...searchFilters, education: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                    <Input
                      placeholder="Profession"
                      value={searchFilters.occupation}
                      onChange={(e) => setSearchFilters({...searchFilters, occupation: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                    <Input
                      placeholder="Religion"
                      value={searchFilters.religion}
                      onChange={(e) => setSearchFilters({...searchFilters, religion: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Physical & Personal</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height Range (cm)</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min height"
                        value={searchFilters.heightMin}
                        onChange={(e) => setSearchFilters({...searchFilters, heightMin: e.target.value})}
                      />
                      <Input
                        placeholder="Max height"
                        value={searchFilters.heightMax}
                        onChange={(e) => setSearchFilters({...searchFilters, heightMax: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
                    <Select value={searchFilters.complexion} onValueChange={(value) => setSearchFilters({...searchFilters, complexion: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select complexion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="VERY_FAIR">Very Fair</SelectItem>
                        <SelectItem value="FAIR">Fair</SelectItem>
                        <SelectItem value="WHEATISH">Wheatish</SelectItem>
                        <SelectItem value="WHEATISH_BROWN">Wheatish Brown</SelectItem>
                        <SelectItem value="DARK">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Food Preference</label>
                    <Select value={searchFilters.food} onValueChange={(value) => setSearchFilters({...searchFilters, food: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select food preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="VEGETARIAN">Vegetarian</SelectItem>
                        <SelectItem value="NON_VEGETARIAN">Non-Vegetarian</SelectItem>
                        <SelectItem value="EGGETARIAN">Eggetarian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
                    <Input
                      placeholder="Caste"
                      value={searchFilters.caste}
                      onChange={(e) => setSearchFilters({...searchFilters, caste: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    const emptyFilters = {
                      ageMin: "",
                      ageMax: "",
                      location: "",
                      education: "",
                      occupation: "",
                      maritalStatus: "",
                      motherTongue: "",
                      religion: "",
                      caste: "",
                      complexion: "",
                      heightMin: "",
                      heightMax: "",
                      food: "",
                      country: "",
                      state: "",
                      city: ""
                    };
                    setSearchFilters(emptyFilters);
                    localStorage.setItem('searchFilters', JSON.stringify(emptyFilters));
                  }}
                >
                  Clear Filters
                </Button>
                <Button className="flex-1" onClick={handleSearch} disabled={isSearching}>
                  <Search className="h-4 w-4 mr-2" />
                  {isSearching ? "Searching..." : "Search Profiles"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Search Results
              {hasSearched && (
                <span className="text-sm font-normal text-gray-500">
                  ({searchResults.length} profiles found)
                </span>
              )}
            </CardTitle>
            <CardDescription>Profiles matching your criteria</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasSearched ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to search</h3>
                <p className="text-gray-600 mb-6">
                  Use the filters above to find your perfect match.
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search filters to find more matches.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={() => {
                    const emptyFilters = {
                      ageMin: "", ageMax: "", location: "", education: "", occupation: "",
                      maritalStatus: "", motherTongue: "", religion: "", caste: "",
                      complexion: "", heightMin: "", heightMax: "", food: "",
                      country: "", state: "", city: ""
                    };
                    setSearchFilters(emptyFilters);
                    localStorage.setItem('searchFilters', JSON.stringify(emptyFilters));
                  }}>
                    Clear All Filters
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Back to Dashboard</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((profile: any) => (
                  <Card key={profile.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg">{profile.name}</h4>
                        <p className="text-sm text-gray-600">
                          {profile.age} years • {profile.city}, {profile.state}
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.occupation} • {profile.educationQualification}
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.maritalStatus.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())} • {profile.motherTongue}
                        </p>
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
            )}
          </CardContent>
        </Card>
      </div>
      
      <WhatsAppButton variant="floating" />
    </div>
  );
}

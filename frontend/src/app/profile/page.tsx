"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Edit, ArrowLeft, Menu, X, LogOut, Camera, FileText, Trash2 } from "lucide-react";
import Logo from "@/components/Logo";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import FileUploader from "@/components/FileUploader";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Profile {
  photos: Array<{ id: string; url: string; isPrimary: boolean }>;
  documents: Array<{ id: string; url: string; type: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-service-228802607375.asia-south1.run.app';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<{[key: string]: boolean}>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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

      const fetchProfile = async () => {
        try {
          const response = await fetch(`${API_URL}/profiles/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
          }
        } catch (e) {
          console.error("Failed to fetch profile", e);
        } finally {
          setProfileLoading(false);
        }
      };
      fetchProfile();
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

  const handlePhotoUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    const token = localStorage.getItem("token");

    try {
      // 1. Get presigned URL from our backend
      const presignResponse = await fetch(
        `${API_URL}/upload/presign?filename=${encodeURIComponent(
          selectedFile.name
        )}&content_type=${encodeURIComponent(selectedFile.type)}&file_type=photo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!presignResponse.ok) {
        const errorData = await presignResponse.json();
        throw new Error(errorData.detail || "Failed to get presigned URL.");
      }

      const presignData = await presignResponse.json();
      const { url, fields } = presignData;

      // 2. Upload file to S3 using the presigned URL
      const formData = new FormData();
      Object.keys(fields).forEach((key) => {
        formData.append(key, fields[key]);
      });
      formData.append("file", selectedFile);

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        alert("Photo uploaded successfully!");
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        // You might want to refresh profile data here
      } else {
        console.error("S3 Upload Error:", await uploadResponse.text());
        throw new Error("Failed to upload photo to storage.");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert(
        `An error occurred while uploading the photo: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    const token = localStorage.getItem("token");
    setDeleting(prev => ({...prev, [photoId]: true}));
    try {
      const response = await fetch(`${API_URL}/upload/photo/${photoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Photo deleted successfully!');
        setProfile(prev => prev ? ({
          ...prev,
          photos: prev.photos.filter(p => p.id !== photoId)
        }) : null);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete photo: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('An error occurred while deleting the photo.');
    } finally {
      setDeleting(prev => ({...prev, [photoId]: false}));
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    const token = localStorage.getItem("token");
    setDeleting(prev => ({...prev, [docId]: true}));
    try {
      const response = await fetch(`${API_URL}/upload/document/${docId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Document deleted successfully!');
        setProfile(prev => prev ? ({
          ...prev,
          documents: prev.documents.filter(d => d.id !== docId)
        }) : null);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete document: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('An error occurred while deleting the document.');
    } finally {
      setDeleting(prev => ({...prev, [docId]: false}));
    }
  };

  if (!user || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
              <Link href="/chat" className="text-gray-700 hover:text-rose-600 font-medium">
                Messages
              </Link>
              <Link href="/profile" className="text-rose-600 font-medium">
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
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-rose-600 font-medium rounded-md"
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

      {/* Profile Content */}
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your profile information</p>
            </div>
          </div>
        </div>

        {/* Profile Setup Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Email: {user.email}</p>
                  <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/profile/create">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Camera className="h-8 w-8 text-green-600" />
                <div>
                  <CardTitle>Photos</CardTitle>
                  <CardDescription>Upload your best photos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">                
                {profile && profile.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {profile.photos.map(photo => (
                      <div key={photo.id} className="relative group aspect-square">
                        <img src={photo.url} alt="Profile photo" className="rounded-lg object-cover w-full h-full" />
                        <button onClick={() => handleDeletePhoto(photo.id)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        {deleting[photo.id] ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div> : <X className="h-3 w-3" />}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No photos uploaded yet. Add up to 6 photos to attract more matches.</p>
                )}
                <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photos
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload a Photo</DialogTitle>
                    </DialogHeader>
                    <FileUploader
                      onFileSelect={setSelectedFile}
                      acceptedTypes=".jpg,.jpeg,.png,.webp"
                      maxSize={5 * 1024 * 1024} // 5MB
                      label="Select a photo"
                    />
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
                      <Button onClick={handlePhotoUpload} disabled={!selectedFile || uploading}>{uploading ? 'Uploading...' : 'Upload'}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-purple-600" />
                <div>
                  <CardTitle>Biodata</CardTitle>
                  <CardDescription>Manage your biodata document</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile && profile.documents.length > 0 ? (
                  <div className="space-y-3">
                    {profile.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
                          <div className="truncate">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {doc.type.replace('BIODATA_', '').replace('_', ' ')} Document
                            </p>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                              Preview
                            </a>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => handleDeleteDocument(doc.id)} disabled={deleting[doc.id]}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No biodata uploaded yet. You can upload it on the profile edit page.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Profile Status
            </CardTitle>
            <CardDescription>Update your profile to get better matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Incomplete</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Update your profile to start finding matches. Add your personal information, 
                preferences, and photos to get started.
              </p>
              <div className="space-y-3">
                <div className="bg-gray-100 rounded-lg p-4 text-left max-w-md mx-auto">
                  <h4 className="font-medium text-gray-900 mb-2">Next Steps:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Update basic information</li>
                    <li>• Add personal preferences</li>
                    <li>• Upload profile photos</li>
                    <li>• Write about yourself</li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/profile/create">Update Profile</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Back to Dashboard</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <WhatsAppButton variant="floating" />
    </div>
  );
}

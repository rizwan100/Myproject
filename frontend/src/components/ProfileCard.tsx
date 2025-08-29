"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Calendar, MapPin } from "lucide-react";

export interface Profile {
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

const ProfileCard = ({ profile }: { profile: Profile }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-4">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
        {profile.photos && profile.photos.length > 0 ? (
          <img
            src={profile.photos.find((p) => p.isPrimary)?.url || profile.photos[0]?.url}
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

export default ProfileCard;
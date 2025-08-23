"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, User } from "lucide-react";
import Logo from "@/components/Logo";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Checkbox } from "@/components/ui/checkbox";
import FileUpload from "./FileUpload";

const profileSchema = z.object({
  createdBy: z.string().min(1, "Please select who created this profile"),
  motherTongue: z.string().min(1, "Please select mother tongue"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  gender: z.enum(["GROOM", "BRIDE"]),
  dob: z.string().min(1, "Please enter date of birth"),
  maritalStatus: z.string().min(1, "Please select marital status"),
  noOfChildren: z.string().min(1, "Please select number of children"),
  childrenLivingStatus: z.string().min(1, "Please select children living status"),
  religion: z.string().min(1, "Please select religion"),
  caste: z.string().min(1, "Please select caste"),
  citizenship: z.string().min(1, "Please select citizenship"),
  residingCountry: z.string().min(1, "Please select residing country"),
  state: z.string().min(1, "Please enter state"),
  city: z.string().min(1, "Please enter city"),
  countryCode: z.string().min(1, "Please enter country code"),
  landline: z.string().optional(),
  mobileNumber: z.string().min(10, "Please enter valid mobile number"),
  food: z.string().min(1, "Please select food preference"),
  complexion: z.string().min(1, "Please select complexion"),
  bodyType: z.string().min(1, "Please select body type"),
  heightCm: z.string().min(1, "Please enter height"),
  weightKg: z.string().min(1, "Please enter weight"),
  physicalStatus: z.string().min(1, "Please select physical status"),
  bloodGroup: z.string().min(1, "Please select blood group"),
  educationQualification: z.string().min(1, "Please enter education qualification"),
  occupation: z.string().min(1, "Please enter occupation"),
  employmentType: z.string().min(1, "Please select employment type"),
  annualIncomeCurrency: z.string().min(1, "Please select currency"),
  annualIncome: z.string().min(1, "Please enter annual income"),
  aboutMe: z.string().min(50, "About me must be at least 50 characters"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function CreateProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

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

  const [biodata, setBiodata] = useState<File | null>(null);
  
  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          heightCm: parseInt(data.heightCm),
          weightKg: parseInt(data.weightKg),
          annualIncome: parseInt(data.annualIncome),
        }),
      });

      if (response.ok) {
        const profileData = await response.json();
        
        if (biodata) {
          const token = localStorage.getItem("token");
          const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/presign?filename=${encodeURIComponent(biodata.name)}&content_type=${encodeURIComponent(biodata.type)}&file_type=document`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          
          if (uploadResponse.ok) {
            const { url, fields, fileId } = await uploadResponse.json();
            
            const formData = new FormData();
            Object.entries(fields).forEach(([key, value]) => {
              formData.append(key, value as string);
            });
            formData.append("file", biodata);
            
            await fetch(url, {
              method: "POST",
              body: formData,
            });
          }
        }
        
        router.push("/dashboard");
      } else {
        const error = await response.json();
        setError("root", { message: error.detail || "Profile creation failed" });
      }
    } catch (error) {
      setError("root", { message: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
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
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Create Profile</span>
              <Button asChild variant="outline">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Creation Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <User className="h-6 w-6" />
              Create Your Profile
            </CardTitle>
            <CardDescription>
              Fill in your details to help others find their perfect match
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="createdBy">Profile Created By</Label>
                    <Controller
                      name="createdBy"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.createdBy ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select who created this profile" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SELF">Self</SelectItem>
                            <SelectItem value="PARENT">Parent</SelectItem>
                            <SelectItem value="GUARDIAN">Guardian</SelectItem>
                            <SelectItem value="RELATIVE">Relative</SelectItem>
                            <SelectItem value="FRIEND">Friend</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.createdBy && (
                      <p className="text-sm text-red-500">{errors.createdBy.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motherTongue">Mother Tongue</Label>
                    <Controller
                      name="motherTongue"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.motherTongue ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select mother tongue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="URDU">Urdu</SelectItem>
                            <SelectItem value="HINDI">Hindi</SelectItem>
                            <SelectItem value="ENGLISH">English</SelectItem>
                            <SelectItem value="TELUGU">Telugu</SelectItem>
                            <SelectItem value="TAMIL">Tamil</SelectItem>
                            <SelectItem value="ARABIC">Arabic</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.motherTongue && (
                      <p className="text-sm text-red-500">{errors.motherTongue.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      {...register("name")}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GROOM">Groom</SelectItem>
                            <SelectItem value="BRIDE">Bride</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gender && (
                      <p className="text-sm text-red-500">{errors.gender.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      {...register("dob")}
                      className={errors.dob ? "border-red-500" : ""}
                    />
                    {errors.dob && (
                      <p className="text-sm text-red-500">{errors.dob.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Controller
                      name="maritalStatus"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.maritalStatus ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEVER_MARRIED">Never Married</SelectItem>
                            <SelectItem value="DIVORCED">Divorced</SelectItem>
                            <SelectItem value="WIDOWED">Widowed</SelectItem>
                            <SelectItem value="SEPARATED">Separated</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.maritalStatus && (
                      <p className="text-sm text-red-500">{errors.maritalStatus.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="noOfChildren">Number of Children</Label>
                    <Controller
                      name="noOfChildren"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.noOfChildren ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select number of children" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4+">4 or more</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.noOfChildren && (
                      <p className="text-sm text-red-500">{errors.noOfChildren.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="childrenLivingStatus">Children Living Status</Label>
                    <Controller
                      name="childrenLivingStatus"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.childrenLivingStatus ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select children living status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WITH_ME">With Me</SelectItem>
                            <SelectItem value="NOT_WITH_ME">Not With Me</SelectItem>
                            <SelectItem value="NOT_APPLICABLE">Not Applicable</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.childrenLivingStatus && (
                      <p className="text-sm text-red-500">{errors.childrenLivingStatus.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Controller
                      name="religion"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.religion ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select religion" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ISLAM">Islam</SelectItem>
                            <SelectItem value="HINDUISM">Hinduism</SelectItem>
                            <SelectItem value="CHRISTIANITY">Christianity</SelectItem>
                            <SelectItem value="SIKHISM">Sikhism</SelectItem>
                            <SelectItem value="BUDDHISM">Buddhism</SelectItem>
                            <SelectItem value="JAINISM">Jainism</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.religion && (
                      <p className="text-sm text-red-500">{errors.religion.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caste">Caste</Label>
                    <Input
                      id="caste"
                      placeholder="Enter caste"
                      {...register("caste")}
                      className={errors.caste ? "border-red-500" : ""}
                    />
                    {errors.caste && (
                      <p className="text-sm text-red-500">{errors.caste.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citizenship">Citizenship</Label>
                  <Input
                    id="citizenship"
                    placeholder="Enter citizenship"
                    {...register("citizenship")}
                    className={errors.citizenship ? "border-red-500" : ""}
                  />
                  {errors.citizenship && (
                    <p className="text-sm text-red-500">{errors.citizenship.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input
                      id="mobileNumber"
                      placeholder="Enter mobile number"
                      {...register("mobileNumber")}
                      className={errors.mobileNumber ? "border-red-500" : ""}
                    />
                    {errors.mobileNumber && (
                      <p className="text-sm text-red-500">{errors.mobileNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="countryCode">Country Code</Label>
                    <Input
                      id="countryCode"
                      placeholder="+91"
                      {...register("countryCode")}
                      className={errors.countryCode ? "border-red-500" : ""}
                    />
                    {errors.countryCode && (
                      <p className="text-sm text-red-500">{errors.countryCode.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      {...register("city")}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      {...register("state")}
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">{errors.state.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residingCountry">Country</Label>
                    <Controller
                      name="residingCountry"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.residingCountry ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INDIA">India</SelectItem>
                            <SelectItem value="USA">USA</SelectItem>
                            <SelectItem value="UK">UK</SelectItem>
                            <SelectItem value="CANADA">Canada</SelectItem>
                            <SelectItem value="AUSTRALIA">Australia</SelectItem>
                            <SelectItem value="UAE">UAE</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.residingCountry && (
                      <p className="text-sm text-red-500">{errors.residingCountry.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Physical Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Physical Information</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="food">Food Preference</Label>
                    <Controller
                      name="food"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.food ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select food preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VEGETARIAN">Vegetarian</SelectItem>
                            <SelectItem value="NON_VEGETARIAN">Non-Vegetarian</SelectItem>
                            <SelectItem value="EGGETARIAN">Eggetarian</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.food && (
                      <p className="text-sm text-red-500">{errors.food.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complexion">Complexion</Label>
                    <Controller
                      name="complexion"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.complexion ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select complexion" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VERY_FAIR">Very Fair</SelectItem>
                            <SelectItem value="FAIR">Fair</SelectItem>
                            <SelectItem value="WHEATISH">Wheatish</SelectItem>
                            <SelectItem value="WHEATISH_BROWN">Wheatish Brown</SelectItem>
                            <SelectItem value="DARK">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.complexion && (
                      <p className="text-sm text-red-500">{errors.complexion.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyType">Body Type</Label>
                    <Controller
                      name="bodyType"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.bodyType ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select body type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AVERAGE">Average</SelectItem>
                            <SelectItem value="ATHLETIC">Athletic</SelectItem>
                            <SelectItem value="SLIM">Slim</SelectItem>
                            <SelectItem value="HEAVY">Heavy</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.bodyType && (
                      <p className="text-sm text-red-500">{errors.bodyType.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heightCm">Height (cm)</Label>
                    <Input
                      id="heightCm"
                      type="number"
                      placeholder="Enter height in cm"
                      {...register("heightCm")}
                      className={errors.heightCm ? "border-red-500" : ""}
                    />
                    {errors.heightCm && (
                      <p className="text-sm text-red-500">{errors.heightCm.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weightKg">Weight (kg)</Label>
                    <Input
                      id="weightKg"
                      type="number"
                      placeholder="Enter weight in kg"
                      {...register("weightKg")}
                      className={errors.weightKg ? "border-red-500" : ""}
                    />
                    {errors.weightKg && (
                      <p className="text-sm text-red-500">{errors.weightKg.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="physicalStatus">Physical Status</Label>
                    <Controller
                      name="physicalStatus"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.physicalStatus ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select physical status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NORMAL">Normal</SelectItem>
                            <SelectItem value="PHYSICALLY_CHALLENGED">Physically Challenged</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.physicalStatus && (
                      <p className="text-sm text-red-500">{errors.physicalStatus.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Controller
                    name="bloodGroup"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.bloodGroup ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.bloodGroup && (
                    <p className="text-sm text-red-500">{errors.bloodGroup.message}</p>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="educationQualification">Education Qualification</Label>
                    <Input
                      id="educationQualification"
                      placeholder="Enter education qualification"
                      {...register("educationQualification")}
                      className={errors.educationQualification ? "border-red-500" : ""}
                    />
                    {errors.educationQualification && (
                      <p className="text-sm text-red-500">{errors.educationQualification.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      placeholder="Enter occupation"
                      {...register("occupation")}
                      className={errors.occupation ? "border-red-500" : ""}
                    />
                    {errors.occupation && (
                      <p className="text-sm text-red-500">{errors.occupation.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Controller
                      name="employmentType"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.employmentType ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GOVERNMENT">Government</SelectItem>
                            <SelectItem value="PRIVATE">Private</SelectItem>
                            <SelectItem value="BUSINESS">Business</SelectItem>
                            <SelectItem value="SELF_EMPLOYED">Self Employed</SelectItem>
                            <SelectItem value="NOT_WORKING">Not Working</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.employmentType && (
                      <p className="text-sm text-red-500">{errors.employmentType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annualIncomeCurrency">Currency</Label>
                    <Controller
                      name="annualIncomeCurrency"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.annualIncomeCurrency ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="AED">AED</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.annualIncomeCurrency && (
                      <p className="text-sm text-red-500">{errors.annualIncomeCurrency.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annualIncome">Annual Income</Label>
                    <Input
                      id="annualIncome"
                      type="number"
                      placeholder="Enter annual income"
                      {...register("annualIncome")}
                      className={errors.annualIncome ? "border-red-500" : ""}
                    />
                    {errors.annualIncome && (
                      <p className="text-sm text-red-500">{errors.annualIncome.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* About Me */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">About Me</h3>
                <div className="space-y-2">
                  <Label htmlFor="aboutMe">Tell us about yourself</Label>
                  <Textarea
                    id="aboutMe"
                    placeholder="Write about yourself, your interests, what you're looking for in a partner..."
                    rows={4}
                    {...register("aboutMe")}
                    className={errors.aboutMe ? "border-red-500" : ""}
                  />
                  {errors.aboutMe && (
                    <p className="text-sm text-red-500">{errors.aboutMe.message}</p>
                  )}
                </div>
              </div>
              
              {/* Biodata Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Biodata</h3>
                <FileUpload 
                  onFileSelect={(file) => setBiodata(file)}
                  acceptedTypes=".pdf,.doc,.docx"
                  maxSize={2 * 1024 * 1024}
                  label="Upload your biodata (PDF or Word document)"
                />
              </div>

              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.root.message}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/dashboard")}
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Profile..." : "Create Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <WhatsAppButton variant="floating" />
    </div>
  );
}

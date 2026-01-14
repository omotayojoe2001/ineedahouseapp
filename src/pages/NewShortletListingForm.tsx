import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Upload, Plus, Minus, Home, Building, Wifi, Snowflake, ChefHat, Tv, Car, Waves, Dumbbell, Shield, Zap, Coffee, Droplets } from "lucide-react";
import EnhancedLocationInput from "@/components/EnhancedLocationInput";

const propertyTypes = [
  { value: "apartment", label: "Apartment/Flat", icon: Home },
  { value: "house", label: "Entire House", icon: Building },
  { value: "studio", label: "Studio", icon: Home },
];

const propertySubTypes = {
  apartment: ["1 Bedroom Apartment", "2 Bedroom Apartment", "3 Bedroom Apartment", "4+ Bedroom Apartment", "Penthouse", "Serviced Apartment"],
  house: ["Duplex", "Bungalow", "Villa", "Townhouse", "Detached House"],
  studio: ["Studio Apartment", "Mini Studio", "Loft Studio"]
};

const amenitiesList = [
  { id: "wifi", label: "WiFi Internet", icon: Wifi },
  { id: "ac", label: "Air Conditioning", icon: Snowflake },
  { id: "kitchen", label: "Fully Equipped Kitchen", icon: ChefHat },
  { id: "tv", label: "Cable TV", icon: Tv },
  { id: "parking", label: "Free Parking", icon: Car },
  { id: "pool", label: "Swimming Pool", icon: Waves },
  { id: "gym", label: "Gym/Fitness Center", icon: Dumbbell },
  { id: "security", label: "24/7 Security", icon: Shield },
  { id: "power", label: "Backup Generator", icon: Zap },
  { id: "laundry", label: "Laundry Service", icon: Coffee },
  { id: "water", label: "Hot Water", icon: Droplets },
];

export default function NewShortletListingForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    property_type: "",
    property_sub_type: "",
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    location: "",
    address: "",
    images: [] as string[],
    amenities: [] as string[],
    title: "",
    description: "",
    daily_rate: "",
    weekly_rate: "",
    monthly_rate: "",
    cleaning_fee: "",
    security_deposit: "",
    minimum_stay: "1",
    maximum_stay: "",
    check_in_time: "",
    check_out_time: "",
    house_rules: "",
    nearby_attractions: "",
    allow_pets: "",
    instant_booking: "no",
    cancellation_policy: "",
  });

  useEffect(() => {
    if (editId) loadExistingListing();
  }, [editId]);

  const loadExistingListing = async () => {
    try {
      const { data, error } = await supabase.from("shortlets").select("*").eq("id", editId).single();
      if (error) throw error;
      if (data) {
        const amenities = [];
        if (data.wifi) amenities.push("wifi");
        if (data.air_conditioning) amenities.push("ac");
        if (data.kitchen) amenities.push("kitchen");
        if (data.cable_tv) amenities.push("tv");
        if (data.parking) amenities.push("parking");
        if (data.swimming_pool) amenities.push("pool");
        if (data.gym) amenities.push("gym");
        if (data.security_24_7) amenities.push("security");
        if (data.backup_generator) amenities.push("power");
        if (data.laundry_service) amenities.push("laundry");
        if (data.hot_water) amenities.push("water");

        setFormData({
          property_type: data.property_type || "",
          property_sub_type: data.property_sub_type || "",
          bedrooms: data.bedrooms || 1,
          bathrooms: data.bathrooms || 1,
          max_guests: data.max_guests || 2,
          location: data.location || "",
          address: data.address || "",
          images: data.images || [],
          amenities,
          title: data.title || "",
          description: data.description || "",
          daily_rate: data.daily_rate?.toString() || "",
          weekly_rate: data.weekly_rate?.toString() || "",
          monthly_rate: data.monthly_rate?.toString() || "",
          cleaning_fee: data.cleaning_fee?.toString() || "",
          security_deposit: data.security_deposit?.toString() || "",
          minimum_stay: data.minimum_stay?.toString() || "1",
          maximum_stay: data.maximum_stay?.toString() || "",
          check_in_time: data.check_in_time || "",
          check_out_time: data.check_out_time || "",
          house_rules: data.house_rules || "",
          nearby_attractions: data.nearby_attractions || "",
          allow_pets: data.allow_pets || "",
          instant_booking: data.instant_booking ? "yes" : "no",
          cancellation_policy: data.cancellation_policy || "",
        });
      }
    } catch (error: any) {
      toast.error("Failed to load listing");
      console.error(error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const imagePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      const base64Images = await Promise.all(imagePromises);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...base64Images] }));
      toast.success("Images uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload images");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to continue");
        return;
      }

      const shortletData: any = {
        user_id: user.id,
        property_type: formData.property_type,
        property_sub_type: formData.property_sub_type,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        max_guests: formData.max_guests,
        location: formData.location,
        images: formData.images,
        title: formData.title,
        description: formData.description,
        daily_rate: parseFloat(formData.daily_rate),
        minimum_stay: parseInt(formData.minimum_stay),
        wifi: formData.amenities.includes("wifi"),
        air_conditioning: formData.amenities.includes("ac"),
        kitchen: formData.amenities.includes("kitchen"),
        cable_tv: formData.amenities.includes("tv"),
        parking: formData.amenities.includes("parking"),
        swimming_pool: formData.amenities.includes("pool"),
        gym: formData.amenities.includes("gym"),
        security_24_7: formData.amenities.includes("security"),
        backup_generator: formData.amenities.includes("power"),
        laundry_service: formData.amenities.includes("laundry"),
        hot_water: formData.amenities.includes("water"),
        instant_booking: formData.instant_booking === "yes",
      };

      if (formData.address) shortletData.address = formData.address;
      if (formData.weekly_rate) shortletData.weekly_rate = parseFloat(formData.weekly_rate);
      if (formData.monthly_rate) shortletData.monthly_rate = parseFloat(formData.monthly_rate);
      if (formData.cleaning_fee) shortletData.cleaning_fee = parseFloat(formData.cleaning_fee);
      if (formData.security_deposit) shortletData.security_deposit = parseFloat(formData.security_deposit);
      if (formData.maximum_stay) shortletData.maximum_stay = parseInt(formData.maximum_stay);
      if (formData.check_in_time) shortletData.check_in_time = formData.check_in_time;
      if (formData.check_out_time) shortletData.check_out_time = formData.check_out_time;
      if (formData.house_rules) shortletData.house_rules = formData.house_rules;
      if (formData.nearby_attractions) shortletData.nearby_attractions = formData.nearby_attractions;
      if (formData.allow_pets) shortletData.allow_pets = formData.allow_pets;
      if (formData.cancellation_policy) shortletData.cancellation_policy = formData.cancellation_policy;

      if (editId) {
        const { error } = await supabase.from("shortlets").update(shortletData).eq("id", editId);
        if (error) throw error;
        toast.success("Listing updated successfully");
      } else {
        const { error } = await supabase.from("shortlets").insert([shortletData]);
        if (error) throw error;
        toast.success("Listing created successfully");
      }
      navigate("/my-listings");
    } catch (error: any) {
      toast.error(error.message || "Failed to save listing");
      console.error(error);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 18));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const canProceed = () => {
    const result = (() => {
      switch (currentStep) {
        case 1: return formData.property_type !== "";
        case 2: return formData.property_sub_type !== "";
        case 3: return true;
        case 4: return (formData.location && formData.location.trim() !== "") || (formData.address && formData.address.trim() !== "");
        case 5: return formData.images.length > 0;
        case 6: return formData.amenities.length > 0;
        case 7: return formData.title.trim() !== "";
        case 8: return formData.description.trim() !== "";
        case 9: return formData.daily_rate !== "" && parseFloat(formData.daily_rate) > 0;
        case 10: return true;
        case 11: return true;
        case 12: return formData.minimum_stay !== "";
        case 13: return true;
        case 14: return true;
        case 15: return true;
        case 16: return true;
        case 17: return true;
        case 18: return true;
        default: return false;
      }
    })();
    console.log(`[Step ${currentStep}] canProceed:`, result, { location: formData.location, address: formData.address });
    return result;
  };

  const getSubTypes = () => {
    if (formData.property_type === "apartment") return propertySubTypes.apartment;
    if (formData.property_type === "house") return propertySubTypes.house;
    if (formData.property_type === "studio") return propertySubTypes.studio;
    return [];
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => currentStep === 1 ? navigate(-1) : prevStep()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm text-gray-600">Step {currentStep} of 18</span>
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full">
            <div className="bg-[hsl(145,63%,42%)] h-1 rounded-full transition-all" style={{ width: `${(currentStep / 18) * 100}%` }} />
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What type of shortlet are you listing?</h1>
            <div className="grid gap-4">
              {propertyTypes.map((type) => (
                <Card key={type.value} className={`p-6 cursor-pointer transition-all hover:shadow-md ${formData.property_type === type.value ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, property_type: type.value, property_sub_type: "" })}>
                  <div className="flex items-center gap-4">
                    <type.icon className="w-8 h-8 text-[hsl(145,63%,42%)]" />
                    <span className="text-xl font-medium">{type.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What specific type?</h1>
            <div className="grid gap-3">
              {getSubTypes().map((subType) => (
                <Card key={subType} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.property_sub_type === subType ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, property_sub_type: subType })}>
                  <span className="text-lg">{subType}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">How many bedrooms, bathrooms, and guests?</h1>
            <div className="space-y-6">
              <div>
                <Label className="text-lg mb-4 block">Bedrooms</Label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setFormData({ ...formData, bedrooms: Math.max(0, formData.bedrooms - 1) })} className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"><Minus size={16} /></button>
                  <span className="text-xl font-medium w-8 text-center">{formData.bedrooms}</span>
                  <button onClick={() => setFormData({ ...formData, bedrooms: formData.bedrooms + 1 })} className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"><Plus size={16} /></button>
                </div>
              </div>
              <div>
                <Label className="text-lg mb-4 block">Bathrooms</Label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setFormData({ ...formData, bathrooms: Math.max(0, formData.bathrooms - 1) })} className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"><Minus size={16} /></button>
                  <span className="text-xl font-medium w-8 text-center">{formData.bathrooms}</span>
                  <button onClick={() => setFormData({ ...formData, bathrooms: formData.bathrooms + 1 })} className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"><Plus size={16} /></button>
                </div>
              </div>
              <div>
                <Label className="text-lg mb-4 block">Maximum Guests</Label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setFormData({ ...formData, max_guests: Math.max(1, formData.max_guests - 1) })} className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"><Minus size={16} /></button>
                  <span className="text-xl font-medium w-8 text-center">{formData.max_guests}</span>
                  <button onClick={() => setFormData({ ...formData, max_guests: formData.max_guests + 1 })} className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"><Plus size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Where is your shortlet located?</h1>
            <EnhancedLocationInput value={formData.location} onLocationChange={(locationData) => {
              const parts = [locationData.detailedAddress, locationData.landmarks].filter(p => p && p.trim());
              const fullAddress = parts.join(", ");
              setFormData({ ...formData, location: fullAddress, address: fullAddress });
            }} />
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Add photos of your shortlet</h1>
            <p className="text-gray-600">Upload at least one photo</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={uploading} />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Click to upload photos</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Property ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => removeImage(index)}>×</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What amenities do you offer?</h1>
            <div className="grid gap-3">
              {amenitiesList.map((amenity) => (
                <Card key={amenity.id} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.amenities.includes(amenity.id) ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => toggleAmenity(amenity.id)}>
                  <div className="flex items-center gap-3">
                    <amenity.icon className="w-6 h-6 text-[hsl(145,63%,42%)]" />
                    <span className="text-lg">{amenity.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Give your listing a title</h1>
            <p className="text-gray-600">Create a catchy title that highlights the best features</p>
            <Input type="text" placeholder="e.g., Luxury 2 Bedroom Shortlet in Lekki with Pool" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="text-lg p-6" />
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Describe your shortlet</h1>
            <p className="text-gray-600">Share what makes your property special</p>
            <Textarea placeholder="Describe the property features, amenities, and surroundings..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-[200px] text-lg" />
          </div>
        )}

        {currentStep === 9 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What is your daily rate?</h1>
            <p className="text-gray-600">Set your nightly price in Naira</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500">₦</span>
              <Input type="number" placeholder="0" value={formData.daily_rate} onChange={(e) => setFormData({ ...formData, daily_rate: e.target.value })} className="text-2xl p-6 pl-12" />
            </div>
          </div>
        )}

        {currentStep === 10 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Weekly and monthly rates (Optional)</h1>
            <p className="text-gray-600">Offer discounts for longer stays</p>
            <div className="space-y-4">
              <div>
                <Label className="text-lg mb-2 block">Weekly Rate</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">₦</span>
                  <Input type="number" placeholder="0" value={formData.weekly_rate} onChange={(e) => setFormData({ ...formData, weekly_rate: e.target.value })} className="text-xl p-4 pl-12" />
                </div>
              </div>
              <div>
                <Label className="text-lg mb-2 block">Monthly Rate</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">₦</span>
                  <Input type="number" placeholder="0" value={formData.monthly_rate} onChange={(e) => setFormData({ ...formData, monthly_rate: e.target.value })} className="text-xl p-4 pl-12" />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 11 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Additional fees (Optional)</h1>
            <div className="space-y-4">
              <div>
                <Label className="text-lg mb-2 block">Cleaning Fee</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">₦</span>
                  <Input type="number" placeholder="0" value={formData.cleaning_fee} onChange={(e) => setFormData({ ...formData, cleaning_fee: e.target.value })} className="text-xl p-4 pl-12" />
                </div>
              </div>
              <div>
                <Label className="text-lg mb-2 block">Security Deposit</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">₦</span>
                  <Input type="number" placeholder="0" value={formData.security_deposit} onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })} className="text-xl p-4 pl-12" />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 12 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What is the minimum stay?</h1>
            <div className="grid gap-3">
              {["1", "2", "3", "7", "30"].map((nights) => (
                <Card key={nights} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.minimum_stay === nights ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, minimum_stay: nights })}>
                  <span className="text-lg">{nights === "1" ? "1 Night" : nights === "7" ? "1 Week" : nights === "30" ? "1 Month" : `${nights} Nights`}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 13 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Maximum stay (Optional)</h1>
            <div className="grid gap-3">
              {["7", "30", "90", "365", "unlimited"].map((days) => (
                <Card key={days} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.maximum_stay === days ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, maximum_stay: days })}>
                  <span className="text-lg">{days === "7" ? "1 Week" : days === "30" ? "1 Month" : days === "90" ? "3 Months" : days === "365" ? "1 Year" : "No Limit"}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 14 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Check-in and check-out times</h1>
            <div className="space-y-4">
              <div>
                <Label className="text-lg mb-2 block">Check-in Time</Label>
                <div className="grid gap-3">
                  {["12:00", "14:00", "15:00", "16:00", "flexible"].map((time) => (
                    <Card key={time} className={`p-3 cursor-pointer transition-all hover:shadow-md ${formData.check_in_time === time ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, check_in_time: time })}>
                      <span>{time === "flexible" ? "Flexible" : time === "12:00" ? "12:00 PM" : time === "14:00" ? "2:00 PM" : time === "15:00" ? "3:00 PM" : "4:00 PM"}</span>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-lg mb-2 block">Check-out Time</Label>
                <div className="grid gap-3">
                  {["10:00", "11:00", "12:00", "flexible"].map((time) => (
                    <Card key={time} className={`p-3 cursor-pointer transition-all hover:shadow-md ${formData.check_out_time === time ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, check_out_time: time })}>
                      <span>{time === "flexible" ? "Flexible" : time === "10:00" ? "10:00 AM" : time === "11:00" ? "11:00 AM" : "12:00 PM"}</span>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 15 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">House rules (Optional)</h1>
            <p className="text-gray-600">Set clear expectations for your guests</p>
            <Textarea placeholder="e.g., No smoking, No parties, No pets..." value={formData.house_rules} onChange={(e) => setFormData({ ...formData, house_rules: e.target.value })} className="min-h-[150px]" />
          </div>
        )}

        {currentStep === 16 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Nearby attractions (Optional)</h1>
            <p className="text-gray-600">Help guests discover what's around</p>
            <Textarea placeholder="e.g., 5 minutes to beach, Close to shopping mall..." value={formData.nearby_attractions} onChange={(e) => setFormData({ ...formData, nearby_attractions: e.target.value })} className="min-h-[120px]" />
          </div>
        )}

        {currentStep === 17 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Pet policy and instant booking</h1>
            <div className="space-y-4">
              <div>
                <Label className="text-lg mb-2 block">Allow Pets?</Label>
                <div className="grid gap-3">
                  {["yes", "no", "small-pets"].map((option) => (
                    <Card key={option} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.allow_pets === option ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, allow_pets: option })}>
                      <span className="text-lg capitalize">{option === "small-pets" ? "Small Pets Only" : option}</span>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-lg mb-2 block">Instant Booking?</Label>
                <div className="grid gap-3">
                  {["yes", "no"].map((option) => (
                    <Card key={option} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.instant_booking === option ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, instant_booking: option })}>
                      <span className="text-lg capitalize">{option}</span>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 18 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Review your listing</h1>
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <div><h3 className="font-semibold text-lg mb-2">Property Type</h3><p className="text-gray-700 capitalize">{formData.property_type} - {formData.property_sub_type}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Capacity</h3><p className="text-gray-700">{formData.bedrooms} Bedrooms, {formData.bathrooms} Bathrooms, {formData.max_guests} Guests</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Location</h3><p className="text-gray-700">{formData.location}</p>{formData.address && <p className="text-gray-600 text-sm mt-1">{formData.address}</p>}</div>
              <div><h3 className="font-semibold text-lg mb-2">Photos</h3><div className="grid grid-cols-4 gap-2">{formData.images.map((url, index) => (<img key={index} src={url} alt={`Property ${index + 1}`} className="w-full h-20 object-cover rounded" />))}</div></div>
              <div><h3 className="font-semibold text-lg mb-2">Amenities</h3><div className="flex flex-wrap gap-2">{formData.amenities.map((id) => {const amenity = amenitiesList.find((a) => a.id === id);return amenity ? <span key={id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{amenity.label}</span> : null;})}</div></div>
              <div><h3 className="font-semibold text-lg mb-2">Title</h3><p className="text-gray-700">{formData.title}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Description</h3><p className="text-gray-700">{formData.description}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Pricing</h3><p className="text-2xl font-bold text-[hsl(145,63%,42%)]">₦{parseFloat(formData.daily_rate).toLocaleString()} / night</p>{formData.weekly_rate && <p className="text-gray-600 mt-1">Weekly: ₦{parseFloat(formData.weekly_rate).toLocaleString()}</p>}{formData.monthly_rate && <p className="text-gray-600">Monthly: ₦{parseFloat(formData.monthly_rate).toLocaleString()}</p>}</div>
              <div><h3 className="font-semibold text-lg mb-2">Booking Rules</h3><p className="text-gray-700">Minimum stay: {formData.minimum_stay} {formData.minimum_stay === "1" ? "night" : "nights"}</p>{formData.maximum_stay && <p className="text-gray-700">Maximum stay: {formData.maximum_stay === "unlimited" ? "No limit" : `${formData.maximum_stay} days`}</p>}</div>
              {formData.instant_booking === "yes" && <div><p className="text-green-600 font-medium">✓ Instant Booking Enabled</p></div>}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {currentStep < 18 && (<Button onClick={() => { console.log('Next button clicked'); nextStep(); }} disabled={!canProceed()} className="flex-1 bg-[hsl(145,63%,42%)] hover:bg-[hsl(145,63%,35%)] text-white py-6 text-lg">Next <ArrowRight className="ml-2 w-5 h-5" /></Button>)}
          {currentStep === 18 && (<Button onClick={handleSubmit} className="flex-1 bg-[hsl(145,63%,42%)] hover:bg-[hsl(145,63%,35%)] text-white py-6 text-lg">{editId ? "Update Listing" : "Publish Listing"}</Button>)}
        </div>
      </div>
    </div>
  );
}

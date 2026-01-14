import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Upload, Calendar, Users, MapPin, Music, Utensils, Car, Shield, Clock } from "lucide-react";
import EnhancedLocationInput from "@/components/EnhancedLocationInput";

const venueTypes = [
  { value: "hall", label: "Event Hall", icon: Calendar },
  { value: "outdoor", label: "Outdoor Venue", icon: MapPin },
  { value: "conference", label: "Conference Center", icon: Users },
  { value: "wedding", label: "Wedding Venue", icon: Calendar },
];

const venueSubTypes = {
  hall: ["Banquet Hall", "Reception Hall", "Community Hall", "Church Hall", "Hotel Ballroom", "Convention Center"],
  outdoor: ["Garden Venue", "Beach Venue", "Park Pavilion", "Rooftop Terrace", "Courtyard", "Open Field"],
  conference: ["Meeting Room", "Conference Hall", "Seminar Room", "Training Center", "Boardroom", "Auditorium"],
  wedding: ["Wedding Chapel", "Bridal Suite", "Reception Venue", "Ceremony Garden", "Destination Venue"]
};

const amenities = [
  { id: "sound", label: "Sound System", icon: Music },
  { id: "lighting", label: "Professional Lighting", icon: Calendar },
  { id: "catering", label: "Catering Kitchen", icon: Utensils },
  { id: "parking", label: "Parking Space", icon: Car },
  { id: "security", label: "24/7 Security", icon: Shield },
  { id: "ac", label: "Air Conditioning", icon: Clock },
  { id: "stage", label: "Stage/Platform", icon: Calendar },
  { id: "tables", label: "Tables & Chairs", icon: Users },
  { id: "restrooms", label: "Restroom Facilities", icon: MapPin },
  { id: "wifi", label: "WiFi Internet", icon: Clock },
];

export default function NewEventCenterListingForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    venue_type: "",
    venue_sub_type: "",
    capacity: "",
    indoor_outdoor: "",
    location: "",
    address: "",
    images: [] as string[],
    amenities: [] as string[],
    title: "",
    description: "",
    hourly_rate: "",
    daily_rate: "",
    weekend_rate: "",
    security_deposit: "",
    minimum_booking: "",
    catering_allowed: "",
    alcohol_allowed: "",
    decoration_policy: "",
    nearby_hotels: "",
  });

  useEffect(() => {
    if (editId) loadExistingListing();
  }, [editId]);

  const loadExistingListing = async () => {
    try {
      const { data, error } = await supabase.from("event_centers").select("*").eq("id", editId).single();
      if (error) throw error;
      if (data) {
        const amenities = [];
        if (data.sound_system) amenities.push("sound");
        if (data.professional_lighting) amenities.push("lighting");
        if (data.catering_kitchen) amenities.push("catering");
        if (data.parking_spaces > 0) amenities.push("parking");
        if (data.security_24_7) amenities.push("security");
        if (data.air_conditioning) amenities.push("ac");
        if (data.stage_platform) amenities.push("stage");
        if (data.tables_chairs) amenities.push("tables");
        if (data.restroom_facilities) amenities.push("restrooms");
        if (data.wifi_internet) amenities.push("wifi");

        setFormData({
          venue_type: data.venue_type || "",
          venue_sub_type: data.venue_sub_type || "",
          capacity: data.guest_capacity?.toString() || "",
          indoor_outdoor: data.indoor_outdoor || "",
          location: data.location || "",
          address: data.address || "",
          images: data.images || [],
          amenities,
          title: data.title || "",
          description: data.description || "",
          hourly_rate: data.hourly_rate?.toString() || "",
          daily_rate: data.daily_rate?.toString() || "",
          weekend_rate: data.weekend_rate?.toString() || "",
          security_deposit: data.security_deposit?.toString() || "",
          minimum_booking: data.minimum_booking || "",
          catering_allowed: data.catering_allowed ? "yes" : "no",
          alcohol_allowed: data.alcohol_allowed ? "yes" : "no",
          decoration_policy: data.decoration_policy || "",
          nearby_hotels: data.nearby_hotels || "",
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

      const eventCenterData: any = {
        user_id: user.id,
        venue_type: formData.venue_type,
        venue_sub_type: formData.venue_sub_type,
        guest_capacity: parseInt(formData.capacity),
        indoor_outdoor: formData.indoor_outdoor,
        location: formData.location,
        images: formData.images,
        title: formData.title,
        description: formData.description,
        sound_system: formData.amenities.includes("sound"),
        professional_lighting: formData.amenities.includes("lighting"),
        catering_kitchen: formData.amenities.includes("catering"),
        parking_spaces: formData.amenities.includes("parking") ? 50 : 0,
        security_24_7: formData.amenities.includes("security"),
        air_conditioning: formData.amenities.includes("ac"),
        stage_platform: formData.amenities.includes("stage"),
        tables_chairs: formData.amenities.includes("tables"),
        restroom_facilities: formData.amenities.includes("restrooms"),
        wifi_internet: formData.amenities.includes("wifi"),
        catering_allowed: formData.catering_allowed === "yes",
        alcohol_allowed: formData.alcohol_allowed === "yes",
      };

      if (formData.address) eventCenterData.address = formData.address;
      if (formData.hourly_rate) eventCenterData.hourly_rate = parseFloat(formData.hourly_rate);
      if (formData.daily_rate) eventCenterData.daily_rate = parseFloat(formData.daily_rate);
      if (formData.weekend_rate) eventCenterData.weekend_rate = parseFloat(formData.weekend_rate);
      if (formData.security_deposit) eventCenterData.security_deposit = parseFloat(formData.security_deposit);
      if (formData.minimum_booking) eventCenterData.minimum_booking = formData.minimum_booking;
      if (formData.decoration_policy) eventCenterData.decoration_policy = formData.decoration_policy;
      if (formData.nearby_hotels) eventCenterData.nearby_hotels = formData.nearby_hotels;

      if (editId) {
        const { error } = await supabase.from("event_centers").update(eventCenterData).eq("id", editId);
        if (error) throw error;
        toast.success("Listing updated successfully");
      } else {
        const { error } = await supabase.from("event_centers").insert([eventCenterData]);
        if (error) throw error;
        toast.success("Listing created successfully");
      }
      navigate("/my-listings");
    } catch (error: any) {
      toast.error(error.message || "Failed to save listing");
      console.error(error);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 15));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.venue_type !== "";
      case 2: return formData.venue_sub_type !== "";
      case 3: return formData.capacity !== "";
      case 4: return formData.indoor_outdoor !== "";
      case 5: return (formData.location && formData.location.trim() !== "") || (formData.address && formData.address.trim() !== "");
      case 6: return formData.images.length > 0;
      case 7: return formData.amenities.length > 0;
      case 8: return formData.title.trim() !== "";
      case 9: return formData.description.trim() !== "";
      case 10: return formData.hourly_rate !== "" || formData.daily_rate !== "";
      case 11: return true;
      case 12: return formData.minimum_booking !== "";
      case 13: return formData.catering_allowed !== "" && formData.alcohol_allowed !== "";
      case 14: return true;
      case 15: return true;
      default: return false;
    }
  };

  const getSubTypes = () => {
    if (formData.venue_type === "hall") return venueSubTypes.hall;
    if (formData.venue_type === "outdoor") return venueSubTypes.outdoor;
    if (formData.venue_type === "conference") return venueSubTypes.conference;
    if (formData.venue_type === "wedding") return venueSubTypes.wedding;
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
            <span className="text-sm text-gray-600">Step {currentStep} of 15</span>
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full">
            <div className="bg-[hsl(145,63%,42%)] h-1 rounded-full transition-all" style={{ width: `${(currentStep / 15) * 100}%` }} />
          </div>
        </div>

        {currentStep === 1 && (<div className="space-y-6"><h1 className="text-3xl font-bold">What type of event venue?</h1><div className="grid gap-4">{venueTypes.map((type) => (<Card key={type.value} className={`p-6 cursor-pointer transition-all hover:shadow-md ${formData.venue_type === type.value ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, venue_type: type.value, venue_sub_type: "" })}><div className="flex items-center gap-4"><type.icon className="w-8 h-8 text-[hsl(145,63%,42%)]" /><span className="text-xl font-medium">{type.label}</span></div></Card>))}</div></div>)}

        {currentStep === 2 && (<div className="space-y-6"><h1 className="text-3xl font-bold">What specific type?</h1><div className="grid gap-3">{getSubTypes().map((subType) => (<Card key={subType} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.venue_sub_type === subType ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, venue_sub_type: subType })}><span className="text-lg">{subType}</span></Card>))}</div></div>)}

        {currentStep === 3 && (<div className="space-y-6"><h1 className="text-3xl font-bold">What is the guest capacity?</h1><div className="grid gap-3">{["50", "100", "200", "500", "1000", "1000+"].map((cap) => (<Card key={cap} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.capacity === cap ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, capacity: cap })}><span className="text-lg">{cap === "1000+" ? "1000+ guests" : `Up to ${cap} guests`}</span></Card>))}</div></div>)}

        {currentStep === 4 && (<div className="space-y-6"><h1 className="text-3xl font-bold">Indoor or outdoor venue?</h1><div className="grid gap-4">{["indoor", "outdoor", "both"].map((type) => (<Card key={type} className={`p-6 cursor-pointer transition-all hover:shadow-md ${formData.indoor_outdoor === type ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, indoor_outdoor: type })}><span className="text-xl font-medium capitalize">{type === "both" ? "Indoor & Outdoor" : type}</span></Card>))}</div></div>)}

        {currentStep === 5 && (<div className="space-y-6"><h1 className="text-3xl font-bold">Where is the venue located?</h1><EnhancedLocationInput value={formData.location} onLocationChange={(locationData) => {
          const fullAddress = `${locationData.detailedAddress || ""}, ${locationData.landmarks || ""}`.trim();
          setFormData({ ...formData, location: fullAddress, address: fullAddress });
        }} /></div>)}

        {currentStep === 6 && (<div className="space-y-6"><h1 className="text-3xl font-bold">Add photos of your venue</h1><p className="text-gray-600">Upload at least one photo</p><div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"><input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={uploading} /><label htmlFor="image-upload" className="cursor-pointer"><Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" /><p className="text-lg font-medium">Click to upload photos</p><p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p></label></div>{formData.images.length > 0 && (<div className="grid grid-cols-3 gap-4 mt-4">{formData.images.map((url, index) => (<div key={index} className="relative"><img src={url} alt={`Venue ${index + 1}`} className="w-full h-32 object-cover rounded-lg" /><Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => removeImage(index)}>×</Button></div>))}</div>)}</div>)}

        {currentStep === 7 && (<div className="space-y-6"><h1 className="text-3xl font-bold">What amenities do you offer?</h1><div className="grid gap-3">{amenities.map((amenity) => (<Card key={amenity.id} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.amenities.includes(amenity.id) ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => toggleAmenity(amenity.id)}><div className="flex items-center gap-3"><amenity.icon className="w-6 h-6 text-[hsl(145,63%,42%)]" /><span className="text-lg">{amenity.label}</span></div></Card>))}</div></div>)}

        {currentStep === 8 && (<div className="space-y-6"><h1 className="text-3xl font-bold">Give your venue a title</h1><p className="text-gray-600">Create a catchy title that highlights your venue</p><Input type="text" placeholder="e.g., Elegant Wedding Hall in Victoria Island" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="text-lg p-6" /></div>)}

        {currentStep === 9 && (<div className="space-y-6"><h1 className="text-3xl font-bold">Describe your venue</h1><p className="text-gray-600">Share what makes your venue special for events</p><Textarea placeholder="Describe the venue, what makes it special for events..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-[200px] text-lg" /></div>)}

        {currentStep === 10 && (<div className="space-y-6"><h1 className="text-3xl font-bold">Set your venue rates</h1><p className="text-gray-600">Enter at least one rate</p><div className="space-y-4"><div><Label className="text-lg mb-2 block">Hourly Rate (Optional)</Label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">₦</span><Input type="number" placeholder="0" value={formData.hourly_rate} onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })} className="text-xl p-4 pl-12" /></div></div><div><Label className="text-lg mb-2 block">Daily Rate</Label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">₦</span><Input type="number" placeholder="0" value={formData.daily_rate} onChange={(e) => setFormData({ ...formData, daily_rate: e.target.value })} className="text-xl p-4 pl-12" /></div></div><div><Label className="text-lg mb-2 block">Weekend Rate (Optional)</Label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">₦</span><Input type="number" placeholder="0" value={formData.weekend_rate} onChange={(e) => setFormData({ ...formData, weekend_rate: e.target.value })} className="text-xl p-4 pl-12" /></div></div></div></div>)}

        {currentStep === 11 && (<div className="space-y-6"><h1 className="text-3xl font-bold">Security deposit (Optional)</h1><p className="text-gray-600">Set a refundable security deposit</p><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500">₦</span><Input type="number" placeholder="0" value={formData.security_deposit} onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })} className="text-2xl p-6 pl-12" /></div></div>)}

        {currentStep === 12 && (<div className="space-y-6"><h1 className="text-3xl font-bold">What is the minimum booking?</h1><div className="grid gap-3">{["2hours", "4hours", "6hours", "1day"].map((booking) => (<Card key={booking} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.minimum_booking === booking ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, minimum_booking: booking })}><span className="text-lg">{booking === "2hours" ? "2 Hours" : booking === "4hours" ? "4 Hours" : booking === "6hours" ? "6 Hours" : "1 Day"}</span></Card>))}</div></div>)}

        {currentStep === 13 && (<div className="space-y-6"><h1 className="text-3xl font-bold">Catering and alcohol policies</h1><div className="space-y-4"><div><Label className="text-lg mb-2 block">Catering Allowed?</Label><div className="grid gap-3">{["yes", "no", "inhouse-only"].map((option) => (<Card key={option} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.catering_allowed === option ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, catering_allowed: option })}><span className="text-lg capitalize">{option === "inhouse-only" ? "In-house Only" : option}</span></Card>))}</div></div><div><Label className="text-lg mb-2 block">Alcohol Allowed?</Label><div className="grid gap-3">{["yes", "no", "license-required"].map((option) => (<Card key={option} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.alcohol_allowed === option ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, alcohol_allowed: option })}><span className="text-lg capitalize">{option === "license-required" ? "License Required" : option}</span></Card>))}</div></div></div></div>)}

        {currentStep === 14 && (<div className="space-y-6"><h1 className="text-3xl font-bold">Decoration policy (Optional)</h1><p className="text-gray-600">Set clear expectations for decorations</p><Textarea placeholder="e.g., No nails in walls, candles allowed, confetti not allowed..." value={formData.decoration_policy} onChange={(e) => setFormData({ ...formData, decoration_policy: e.target.value })} className="min-h-[150px]" /></div>)}

        {currentStep === 15 && (<div className="space-y-6"><h1 className="text-3xl font-bold">Review your listing</h1><div className="space-y-6 bg-gray-50 p-6 rounded-lg"><div><h3 className="font-semibold text-lg mb-2">Venue Type</h3><p className="text-gray-700 capitalize">{formData.venue_type} - {formData.venue_sub_type}</p></div><div><h3 className="font-semibold text-lg mb-2">Capacity</h3><p className="text-gray-700">{formData.capacity === "1000+" ? "1000+ guests" : `Up to ${formData.capacity} guests`}</p></div><div><h3 className="font-semibold text-lg mb-2">Type</h3><p className="text-gray-700 capitalize">{formData.indoor_outdoor === "both" ? "Indoor & Outdoor" : formData.indoor_outdoor}</p></div><div><h3 className="font-semibold text-lg mb-2">Location</h3><p className="text-gray-700">{formData.location}</p>{formData.address && <p className="text-gray-600 text-sm mt-1">{formData.address}</p>}</div><div><h3 className="font-semibold text-lg mb-2">Photos</h3><div className="grid grid-cols-4 gap-2">{formData.images.map((url, index) => (<img key={index} src={url} alt={`Venue ${index + 1}`} className="w-full h-20 object-cover rounded" />))}</div></div><div><h3 className="font-semibold text-lg mb-2">Amenities</h3><div className="flex flex-wrap gap-2">{formData.amenities.map((id) => {const amenity = amenities.find((a) => a.id === id);return amenity ? <span key={id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{amenity.label}</span> : null;})}</div></div><div><h3 className="font-semibold text-lg mb-2">Title</h3><p className="text-gray-700">{formData.title}</p></div><div><h3 className="font-semibold text-lg mb-2">Description</h3><p className="text-gray-700">{formData.description}</p></div><div><h3 className="font-semibold text-lg mb-2">Pricing</h3>{formData.hourly_rate && <p className="text-gray-700">Hourly: ₦{parseFloat(formData.hourly_rate).toLocaleString()}</p>}{formData.daily_rate && <p className="text-2xl font-bold text-[hsl(145,63%,42%)]">₦{parseFloat(formData.daily_rate).toLocaleString()} / day</p>}{formData.weekend_rate && <p className="text-gray-600 mt-1">Weekend: ₦{parseFloat(formData.weekend_rate).toLocaleString()}</p>}</div><div><h3 className="font-semibold text-lg mb-2">Booking Rules</h3><p className="text-gray-700">Minimum: {formData.minimum_booking === "2hours" ? "2 Hours" : formData.minimum_booking === "4hours" ? "4 Hours" : formData.minimum_booking === "6hours" ? "6 Hours" : "1 Day"}</p></div><div><h3 className="font-semibold text-lg mb-2">Policies</h3><p className="text-gray-700">Catering: {formData.catering_allowed === "inhouse-only" ? "In-house Only" : formData.catering_allowed}</p><p className="text-gray-700">Alcohol: {formData.alcohol_allowed === "license-required" ? "License Required" : formData.alcohol_allowed}</p></div></div></div>)}

        <div className="mt-8 flex gap-4">{currentStep < 15 && (<Button onClick={nextStep} disabled={!canProceed()} className="flex-1 bg-[hsl(145,63%,42%)] hover:bg-[hsl(145,63%,35%)] text-white py-6 text-lg">Next <ArrowRight className="ml-2 w-5 h-5" /></Button>)}{currentStep === 15 && (<Button onClick={handleSubmit} className="flex-1 bg-[hsl(145,63%,42%)] hover:bg-[hsl(145,63%,35%)] text-white py-6 text-lg">{editId ? "Update Listing" : "Publish Listing"}</Button>)}</div>
      </div>
    </div>
  );
}

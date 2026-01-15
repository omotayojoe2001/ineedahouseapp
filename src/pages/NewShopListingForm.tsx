import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Upload, Store, ShoppingBag, Building, Car, Shield, Zap, Droplets, MapPin, Users, Clock } from "lucide-react";
import EnhancedLocationInput from "@/components/EnhancedLocationInput";

const shopTypes = [
  { value: "retail", label: "Retail Shop", icon: Store },
  { value: "mall", label: "Mall Space", icon: Building },
  { value: "market", label: "Market Stall", icon: ShoppingBag },
  { value: "plaza", label: "Plaza Shop", icon: Building },
];

const shopSubTypes = {
  retail: ["Ground Floor Shop", "Corner Shop", "Strip Mall Unit", "Standalone Store", "Roadside Shop"],
  mall: ["Mall Kiosk", "Anchor Store", "Inline Store", "Food Court Space", "Department Store"],
  market: ["Market Stall", "Container Shop", "Open Stall", "Covered Stall", "Lock-up Shop"],
  plaza: ["Plaza Unit", "Showroom", "Office-Retail Combo", "Upper Floor Shop", "Basement Shop"]
};

const shopFeatures = [
  { id: "parking", label: "Customer Parking", icon: Car },
  { id: "security", label: "24/7 Security", icon: Shield },
  { id: "power", label: "Reliable Power Supply", icon: Zap },
  { id: "water", label: "Water Supply", icon: Droplets },
  { id: "loading", label: "Loading Bay", icon: Building },
  { id: "storage", label: "Storage Room", icon: Store },
  { id: "display", label: "Display Windows", icon: ShoppingBag },
  { id: "signage", label: "Signage Space", icon: MapPin },
  { id: "restroom", label: "Customer Restroom", icon: Users },
  { id: "ac", label: "Air Conditioning", icon: Clock },
];

export default function NewShopListingForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    shop_type: "",
    shop_sub_type: "",
    sqft: "",
    frontage: "",
    floor_level: "",
    location: "",
    address: "",
    images: [] as string[],
    features: [] as string[],
    title: "",
    description: "",
    business_type: "",
    foot_traffic: "",
    operating_hours: "",
    monthly_rent: "",
    service_charge: "",
    security_deposit: "",
    target_customers: "",
    neighboring_businesses: "",
    public_transport: "",
    market_days: "",
    competition_analysis: "",
  });

  useEffect(() => {
    if (editId) loadExistingListing();
  }, [editId]);

  const loadExistingListing = async () => {
    try {
      const { data, error } = await supabase.from("shops").select("*").eq("id", editId).single();
      if (error) throw error;
      if (data) {
        const features = [];
        if (data.customer_parking) features.push("parking");
        if (data.security_24_7) features.push("security");
        if (data.power_supply) features.push("power");
        if (data.water_supply) features.push("water");
        if (data.loading_bay) features.push("loading");
        if (data.storage_room) features.push("storage");
        if (data.display_windows) features.push("display");
        if (data.signage_space) features.push("signage");
        if (data.customer_restroom) features.push("restroom");
        if (data.air_conditioning) features.push("ac");

        setFormData({
          shop_type: data.shop_type || "",
          shop_sub_type: data.shop_sub_type || "",
          sqft: data.floor_area_sqft?.toString() || "",
          frontage: data.frontage_ft?.toString() || "",
          floor_level: data.floor_level || "",
          location: data.location || "",
          address: data.address || "",
          images: data.images || [],
          features,
          title: data.title || "",
          description: data.description || "",
          business_type: data.suitable_business_types?.[0] || "",
          foot_traffic: data.foot_traffic_level || "",
          operating_hours: data.operating_hours || "",
          monthly_rent: data.monthly_rent?.toString() || "",
          service_charge: data.service_charge?.toString() || "",
          security_deposit: data.security_deposit?.toString() || "",
          target_customers: data.target_customers || "",
          neighboring_businesses: data.neighboring_businesses || "",
          public_transport: data.public_transport_access || "",
          market_days: data.market_days || "",
          competition_analysis: data.competition_analysis || "",
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
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const maxWidth = 800;
              const scale = Math.min(1, maxWidth / img.width);
              canvas.width = img.width * scale;
              canvas.height = img.height * scale;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.src = reader.result as string;
          };
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

  const toggleFeature = (featureId: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((id) => id !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to continue");
        return;
      }

      const shopData: any = {
        user_id: user.id,
        shop_type: formData.shop_type,
        shop_sub_type: formData.shop_sub_type,
        location: formData.location,
        images: formData.images,
        title: formData.title,
        description: formData.description,
        monthly_rent: parseFloat(formData.monthly_rent),
        customer_parking: formData.features.includes("parking"),
        security_24_7: formData.features.includes("security"),
        power_supply: formData.features.includes("power"),
        water_supply: formData.features.includes("water"),
        loading_bay: formData.features.includes("loading"),
        storage_room: formData.features.includes("storage"),
        display_windows: formData.features.includes("display"),
        signage_space: formData.features.includes("signage"),
        customer_restroom: formData.features.includes("restroom"),
        air_conditioning: formData.features.includes("ac"),
      };

      if (formData.address) shopData.address = formData.address;
      if (formData.sqft) shopData.floor_area_sqft = parseFloat(formData.sqft);
      if (formData.frontage) shopData.frontage_ft = parseFloat(formData.frontage);
      if (formData.floor_level) shopData.floor_level = formData.floor_level;
      if (formData.business_type) shopData.suitable_business_types = [formData.business_type];
      if (formData.foot_traffic) shopData.foot_traffic_level = formData.foot_traffic;
      if (formData.operating_hours) shopData.operating_hours = formData.operating_hours;
      if (formData.service_charge) shopData.service_charge = parseFloat(formData.service_charge);
      if (formData.security_deposit) shopData.security_deposit = parseFloat(formData.security_deposit);
      if (formData.target_customers) shopData.target_customers = formData.target_customers;
      if (formData.neighboring_businesses) shopData.neighboring_businesses = formData.neighboring_businesses;
      if (formData.public_transport) shopData.public_transport_access = formData.public_transport;
      if (formData.market_days) shopData.market_days = formData.market_days;
      if (formData.competition_analysis) shopData.competition_analysis = formData.competition_analysis;

      if (editId) {
        const { error } = await supabase.from("shops").update(shopData).eq("id", editId);
        if (error) throw error;
        toast.success("Listing updated successfully");
      } else {
        const { error } = await supabase.from("shops").insert([shopData]);
        if (error) throw error;
        toast.success("Listing created successfully");
      }
      navigate("/my-listings");
    } catch (error: any) {
      toast.error(error.message || "Failed to save listing");
      console.error(error);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 16));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.shop_type !== "";
      case 2: return formData.shop_sub_type !== "";
      case 3: return true;
      case 4: return true;
      case 5: return (formData.location && formData.location.trim() !== "") || (formData.address && formData.address.trim() !== "");
      case 6: return formData.images.length > 0;
      case 7: return formData.features.length > 0;
      case 8: return formData.title.trim() !== "";
      case 9: return formData.description.trim() !== "";
      case 10: return true;
      case 11: return true;
      case 12: return formData.monthly_rent !== "" && parseFloat(formData.monthly_rent) > 0;
      case 13: return true;
      case 14: return true;
      case 15: return true;
      case 16: return true;
      default: return false;
    }
  };

  const getSubTypes = () => {
    if (formData.shop_type === "retail") return shopSubTypes.retail;
    if (formData.shop_type === "mall") return shopSubTypes.mall;
    if (formData.shop_type === "market") return shopSubTypes.market;
    if (formData.shop_type === "plaza") return shopSubTypes.plaza;
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
            <span className="text-sm text-gray-600">Step {currentStep} of 16</span>
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full">
            <div className="bg-[hsl(145,63%,42%)] h-1 rounded-full transition-all" style={{ width: `${(currentStep / 16) * 100}%` }} />
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What type of shop are you listing?</h1>
            <div className="grid gap-4">
              {shopTypes.map((type) => (<Card key={type.value} className={`p-6 cursor-pointer transition-all hover:shadow-md ${formData.shop_type === type.value ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, shop_type: type.value, shop_sub_type: "" })}><div className="flex items-center gap-4"><type.icon className="w-8 h-8 text-[hsl(145,63%,42%)]" /><span className="text-xl font-medium">{type.label}</span></div></Card>))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What specific type?</h1>
            <div className="grid gap-3">
              {getSubTypes().map((subType) => (<Card key={subType} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.shop_sub_type === subType ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, shop_sub_type: subType })}><span className="text-lg">{subType}</span></Card>))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What is the floor area?</h1>
            <p className="text-gray-600">Enter the size in square feet</p>
            <Input type="number" placeholder="e.g., 500" value={formData.sqft} onChange={(e) => setFormData({ ...formData, sqft: e.target.value })} className="text-lg p-6" />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Shop dimensions and location</h1>
            <div className="space-y-4">
              <div><Label className="text-lg mb-2 block">Frontage (feet)</Label><Input type="number" placeholder="e.g., 20" value={formData.frontage} onChange={(e) => setFormData({ ...formData, frontage: e.target.value })} className="text-lg p-4" /></div>
              <div><Label className="text-lg mb-2 block">Floor Level</Label><div className="grid gap-3">{["ground", "mezzanine", "first", "upper", "basement"].map((level) => (<Card key={level} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.floor_level === level ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, floor_level: level })}><span className="text-lg capitalize">{level === "ground" ? "Ground Floor" : level === "mezzanine" ? "Mezzanine" : level === "first" ? "First Floor" : level === "upper" ? "Upper Floors" : "Basement"}</span></Card>))}</div></div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Where is the shop located?</h1>
            <EnhancedLocationInput value={formData.location} onLocationChange={(locationData) => {
              const fullAddress = `${locationData.detailedAddress || ""}, ${locationData.landmarks || ""}`.trim();
              setFormData({ ...formData, location: fullAddress, address: fullAddress });
            }} />
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Add photos of your shop</h1>
            <p className="text-gray-600">Upload at least one photo</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"><input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={uploading} /><label htmlFor="image-upload" className="cursor-pointer"><Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" /><p className="text-lg font-medium">Click to upload photos</p><p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p></label></div>
            {formData.images.length > 0 && (<div className="grid grid-cols-3 gap-4 mt-4">{formData.images.map((url, index) => (<div key={index} className="relative"><img src={url} alt={`Shop ${index + 1}`} className="w-full h-32 object-cover rounded-lg" /><Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => removeImage(index)}>×</Button></div>))}</div>)}
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What features does your shop have?</h1>
            <div className="grid gap-3">
              {shopFeatures.map((feature) => (<Card key={feature.id} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.features.includes(feature.id) ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => toggleFeature(feature.id)}><div className="flex items-center gap-3"><feature.icon className="w-6 h-6 text-[hsl(145,63%,42%)]" /><span className="text-lg">{feature.label}</span></div></Card>))}
            </div>
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Give your listing a title</h1>
            <p className="text-gray-600">Create a catchy title that highlights the location</p>
            <Input type="text" placeholder="e.g., Prime Retail Shop in Ikeja Shopping Plaza" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="text-lg p-6" />
          </div>
        )}

        {currentStep === 9 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Describe your shop</h1>
            <p className="text-gray-600">Share what makes this retail space special</p>
            <Textarea placeholder="Describe the shop, location advantages, foot traffic..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-[200px] text-lg" />
          </div>
        )}

        {currentStep === 10 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What business type is suitable?</h1>
            <div className="grid gap-3">
              {["fashion", "electronics", "food", "pharmacy", "beauty", "general", "services"].map((type) => (<Card key={type} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.business_type === type ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, business_type: type })}><span className="text-lg capitalize">{type === "fashion" ? "Fashion/Clothing" : type === "electronics" ? "Electronics" : type === "food" ? "Food/Restaurant" : type === "pharmacy" ? "Pharmacy/Medical" : type === "beauty" ? "Beauty/Salon" : type === "general" ? "General Merchandise" : "Professional Services"}</span></Card>))}
            </div>
          </div>
        )}

        {currentStep === 11 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Foot traffic and operating hours</h1>
            <div className="space-y-4">
              <div><Label className="text-lg mb-2 block">Foot Traffic Level</Label><div className="grid gap-3">{["very-high", "high", "moderate", "low"].map((level) => (<Card key={level} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.foot_traffic === level ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, foot_traffic: level })}><span className="text-lg capitalize">{level.replace("-", " ")}</span></Card>))}</div></div>
              <div><Label className="text-lg mb-2 block">Operating Hours</Label><div className="grid gap-3">{["24-7", "extended", "business", "flexible"].map((hours) => (<Card key={hours} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.operating_hours === hours ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, operating_hours: hours })}><span className="text-lg">{hours === "24-7" ? "24/7" : hours === "extended" ? "Extended Hours (6AM-10PM)" : hours === "business" ? "Business Hours (8AM-6PM)" : "Flexible"}</span></Card>))}</div></div>
            </div>
          </div>
        )}

        {currentStep === 12 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What is the monthly rent?</h1>
            <p className="text-gray-600">Set your rental price in Naira</p>
            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500">₦</span><Input type="number" placeholder="0" value={formData.monthly_rent} onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })} className="text-2xl p-6 pl-12" /></div>
          </div>
        )}

        {currentStep === 13 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Additional charges (Optional)</h1>
            <div className="space-y-4">
              <div><Label className="text-lg mb-2 block">Service Charge</Label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">₦</span><Input type="number" placeholder="0" value={formData.service_charge} onChange={(e) => setFormData({ ...formData, service_charge: e.target.value })} className="text-xl p-4 pl-12" /></div></div>
              <div><Label className="text-lg mb-2 block">Security Deposit</Label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">₦</span><Input type="number" placeholder="0" value={formData.security_deposit} onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })} className="text-xl p-4 pl-12" /></div></div>
            </div>
          </div>
        )}

        {currentStep === 14 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Target customers (Optional)</h1>
            <p className="text-gray-600">Who are the typical customers in this area?</p>
            <Textarea placeholder="e.g., Office workers, Students, Families, Tourists..." value={formData.target_customers} onChange={(e) => setFormData({ ...formData, target_customers: e.target.value })} className="min-h-[120px]" />
          </div>
        )}

        {currentStep === 15 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Business environment (Optional)</h1>
            <div className="space-y-4">
              <div><Label className="text-lg mb-2 block">Neighboring Businesses</Label><Textarea placeholder="e.g., Banks, Restaurants, Supermarket, Pharmacy..." value={formData.neighboring_businesses} onChange={(e) => setFormData({ ...formData, neighboring_businesses: e.target.value })} className="min-h-[100px]" /></div>
              <div><Label className="text-lg mb-2 block">Public Transport Access</Label><div className="grid gap-3">{["excellent", "good", "fair", "limited"].map((access) => (<Card key={access} className={`p-3 cursor-pointer transition-all hover:shadow-md ${formData.public_transport === access ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, public_transport: access })}><span className="capitalize">{access === "excellent" ? "Excellent (BRT/Metro nearby)" : access === "good" ? "Good (Bus stops nearby)" : access === "fair" ? "Fair (Walking distance)" : "Limited"}</span></Card>))}</div></div>
              <div><Label className="text-lg mb-2 block">Market Days (if applicable)</Label><Input type="text" placeholder="e.g., Monday, Wednesday, Friday" value={formData.market_days} onChange={(e) => setFormData({ ...formData, market_days: e.target.value })} className="p-4" /></div>
            </div>
          </div>
        )}

        {currentStep === 16 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Review your listing</h1>
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <div><h3 className="font-semibold text-lg mb-2">Shop Type</h3><p className="text-gray-700 capitalize">{formData.shop_type} - {formData.shop_sub_type}</p></div>
              {formData.sqft && <div><h3 className="font-semibold text-lg mb-2">Floor Area</h3><p className="text-gray-700">{formData.sqft} sqft</p></div>}
              {formData.frontage && <div><h3 className="font-semibold text-lg mb-2">Frontage</h3><p className="text-gray-700">{formData.frontage} feet</p></div>}
              {formData.floor_level && <div><h3 className="font-semibold text-lg mb-2">Floor Level</h3><p className="text-gray-700 capitalize">{formData.floor_level === "ground" ? "Ground Floor" : formData.floor_level}</p></div>}
              <div><h3 className="font-semibold text-lg mb-2">Location</h3><p className="text-gray-700">{formData.location}</p>{formData.address && <p className="text-gray-600 text-sm mt-1">{formData.address}</p>}</div>
              <div><h3 className="font-semibold text-lg mb-2">Photos</h3><div className="grid grid-cols-4 gap-2">{formData.images.map((url, index) => (<img key={index} src={url} alt={`Shop ${index + 1}`} className="w-full h-20 object-cover rounded" />))}</div></div>
              <div><h3 className="font-semibold text-lg mb-2">Features</h3><div className="flex flex-wrap gap-2">{formData.features.map((id) => {const feature = shopFeatures.find((f) => f.id === id);return feature ? <span key={id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{feature.label}</span> : null;})}</div></div>
              <div><h3 className="font-semibold text-lg mb-2">Title</h3><p className="text-gray-700">{formData.title}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Description</h3><p className="text-gray-700">{formData.description}</p></div>
              {formData.business_type && <div><h3 className="font-semibold text-lg mb-2">Suitable Business</h3><p className="text-gray-700 capitalize">{formData.business_type}</p></div>}
              {formData.foot_traffic && <div><h3 className="font-semibold text-lg mb-2">Foot Traffic</h3><p className="text-gray-700 capitalize">{formData.foot_traffic.replace("-", " ")}</p></div>}
              <div><h3 className="font-semibold text-lg mb-2">Monthly Rent</h3><p className="text-2xl font-bold text-[hsl(145,63%,42%)]">₦{parseFloat(formData.monthly_rent).toLocaleString()}</p>{formData.service_charge && <p className="text-gray-600 mt-1">Service Charge: ₦{parseFloat(formData.service_charge).toLocaleString()}</p>}{formData.security_deposit && <p className="text-gray-600">Security Deposit: ₦{parseFloat(formData.security_deposit).toLocaleString()}</p>}</div>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {currentStep < 16 && (<Button onClick={nextStep} disabled={!canProceed()} className="flex-1 bg-[hsl(145,63%,42%)] hover:bg-[hsl(145,63%,35%)] text-white py-6 text-lg">Next <ArrowRight className="ml-2 w-5 h-5" /></Button>)}
          {currentStep === 16 && (<Button onClick={handleSubmit} className="flex-1 bg-[hsl(145,63%,42%)] hover:bg-[hsl(145,63%,35%)] text-white py-6 text-lg">{editId ? "Update Listing" : "Publish Listing"}</Button>)}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Upload, Plus, Minus, Home, Building2, MapPin } from "lucide-react";
import EnhancedLocationInput from "@/components/EnhancedLocationInput";

const propertyTypes = [
  { value: "house", label: "House", icon: Home },
  { value: "commercial", label: "Commercial", icon: Building2 },
  { value: "land", label: "Land", icon: MapPin },
];

const houseSubTypes = ["Detached Duplex", "Semi-Detached Duplex", "Terrace", "Bungalow", "Mansion", "Penthouse"];
const commercialSubTypes = ["Office Space", "Warehouse", "Plaza", "Shopping Complex", "Factory"];
const landSubTypes = ["Residential Land", "Commercial Land", "Mixed Use Land", "Industrial Land", "Agricultural Land"];

const propertyAges = ["Less than 1 year", "1-5 years", "6-10 years", "11-20 years", "Over 20 years", "New Construction"];
const propertyConditions = ["Newly Built", "Renovated", "Good", "Fair", "Needs Renovation"];
const occupancyStatuses = ["Vacant", "Owner Occupied", "Tenant Occupied"];
const titleDocuments = ["Certificate of Occupancy (C of O)", "Governor's Consent", "Deed of Assignment", "Survey Plan", "Receipt of Purchase", "Other"];

export default function NewSaleListingForm() {
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
    location: "",
    address: "",
    property_age: "",
    land_size: "",
    property_condition: "",
    occupancy_status: "",
    title_document: "",
    images: [] as string[],
    title: "",
    description: "",
    nearby_landmarks: "",
    sale_price: "",
    price_negotiable: "no",
    reason_for_selling: "",
  });

  useEffect(() => {
    if (editId) {
      loadExistingListing();
    }
  }, [editId]);

  const loadExistingListing = async () => {
    try {
      const { data, error } = await supabase
        .from("sale_properties")
        .select("*")
        .eq("id", editId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          property_type: data.property_type || "",
          property_sub_type: data.property_sub_type || "",
          bedrooms: data.bedrooms || 1,
          bathrooms: data.bathrooms || 1,
          location: data.location || "",
          address: data.address || "",
          property_age: data.property_age || "",
          land_size: data.land_size || "",
          property_condition: data.property_condition || "",
          occupancy_status: data.occupancy_status || "",
          title_document: data.title_document || "",
          images: data.images || [],
          title: data.title || "",
          description: data.description || "",
          nearby_landmarks: data.nearby_landmarks || "",
          sale_price: data.sale_price?.toString() || "",
          price_negotiable: data.price_negotiable ? "yes" : "no",
          reason_for_selling: data.reason_for_selling || "",
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
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to continue");
        return;
      }

      const propertyData: any = {
        user_id: user.id,
        property_type: formData.property_type,
        property_sub_type: formData.property_sub_type,
        location: formData.location,
        address: formData.address,
        images: formData.images,
        title: formData.title,
        description: formData.description,
        sale_price: parseFloat(formData.sale_price),
        price_negotiable: formData.price_negotiable === "yes",
      };

      if (formData.property_type !== "land") {
        propertyData.bedrooms = formData.bedrooms;
        propertyData.bathrooms = formData.bathrooms;
      }

      if (formData.property_age) propertyData.property_age = formData.property_age;
      if (formData.land_size) propertyData.land_size = formData.land_size;
      if (formData.property_condition) propertyData.property_condition = formData.property_condition;
      if (formData.occupancy_status) propertyData.occupancy_status = formData.occupancy_status;
      if (formData.title_document) propertyData.title_document = formData.title_document;
      if (formData.nearby_landmarks) propertyData.nearby_landmarks = formData.nearby_landmarks;
      if (formData.reason_for_selling) propertyData.reason_for_selling = formData.reason_for_selling;

      if (editId) {
        const { error } = await supabase
          .from("sale_properties")
          .update(propertyData)
          .eq("id", editId);

        if (error) throw error;
        toast.success("Listing updated successfully");
      } else {
        const { error } = await supabase
          .from("sale_properties")
          .insert([propertyData]);

        if (error) throw error;
        toast.success("Listing created successfully");
      }

      navigate("/my-listings");
    } catch (error: any) {
      toast.error(error.message || "Failed to save listing");
      console.error(error);
    }
  };

  const nextStep = () => {
    if (currentStep === 3 && formData.property_type === "land") {
      setCurrentStep(4);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 17));
    }
  };

  const prevStep = () => {
    if (currentStep === 4 && formData.property_type === "land") {
      setCurrentStep(2);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.property_type !== "";
      case 2: return formData.property_sub_type !== "";
      case 3: return true;
      case 4: return (formData.location && formData.location.trim() !== "") || (formData.address && formData.address.trim() !== "");
      case 5: return formData.property_age !== "";
      case 6: return formData.land_size !== "";
      case 7: return formData.property_condition !== "";
      case 8: return formData.occupancy_status !== "";
      case 9: return formData.title_document !== "";
      case 10: return formData.images.length > 0;
      case 11: return formData.title.trim() !== "";
      case 12: return formData.description.trim() !== "";
      case 13: return true;
      case 14: return formData.sale_price !== "" && parseFloat(formData.sale_price) > 0;
      case 15: return formData.price_negotiable !== "";
      case 16: return true;
      case 17: return true;
      default: return false;
    }
  };

  const getSubTypes = () => {
    if (formData.property_type === "house") return houseSubTypes;
    if (formData.property_type === "commercial") return commercialSubTypes;
    if (formData.property_type === "land") return landSubTypes;
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
            <span className="text-sm text-gray-600">Step {currentStep} of 17</span>
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full">
            <div
              className="bg-[hsl(145,63%,42%)] h-1 rounded-full transition-all"
              style={{ width: `${(currentStep / 17) * 100}%` }}
            />
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What type of property are you selling?</h1>
            <div className="grid gap-4">
              {propertyTypes.map((type) => (
                <Card
                  key={type.value}
                  className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                    formData.property_type === type.value
                      ? "border-[hsl(145,63%,42%)] border-2 bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setFormData({ ...formData, property_type: type.value, property_sub_type: "" })}
                >
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
                <Card
                  key={subType}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    formData.property_sub_type === subType
                      ? "border-[hsl(145,63%,42%)] border-2 bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setFormData({ ...formData, property_sub_type: subType })}
                >
                  <span className="text-lg">{subType}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && formData.property_type !== "land" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">How many bedrooms and bathrooms?</h1>
            <div className="space-y-6">
              <div>
                <Label className="text-lg mb-4 block">Bedrooms</Label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, bedrooms: Math.max(0, formData.bedrooms - 1) })}
                    className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-xl font-medium w-8 text-center">{formData.bedrooms}</span>
                  <button
                    onClick={() => setFormData({ ...formData, bedrooms: formData.bedrooms + 1 })}
                    className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div>
                <Label className="text-lg mb-4 block">Bathrooms</Label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, bathrooms: Math.max(0, formData.bathrooms - 1) })}
                    className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-xl font-medium w-8 text-center">{formData.bathrooms}</span>
                  <button
                    onClick={() => setFormData({ ...formData, bathrooms: formData.bathrooms + 1 })}
                    className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Where is the property located?</h1>
            <EnhancedLocationInput
              onLocationChange={(locationData) => {
                // Build location string from state, city, area names
                const parts = [];
                if (locationData.areaId) parts.push(locationData.areaId); // Will need to get name
                if (locationData.cityId) parts.push(locationData.cityId); // Will need to get name
                if (locationData.stateId) parts.push(locationData.stateId); // Will need to get name
                
                // For now, use the detailed address and landmarks
                const addressParts = [locationData.detailedAddress, locationData.landmarks].filter(p => p && p.trim());
                const fullAddress = addressParts.join(", ");
                
                setFormData({ ...formData, location: fullAddress, address: fullAddress });
              }}
            />
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">How old is the property?</h1>
            <div className="grid gap-3">
              {propertyAges.map((age) => (
                <Card
                  key={age}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    formData.property_age === age
                      ? "border-[hsl(145,63%,42%)] border-2 bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setFormData({ ...formData, property_age: age })}
                >
                  <span className="text-lg">{age}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What is the land size?</h1>
            <p className="text-gray-600">Enter the size in square meters or plots</p>
            <Input
              type="text"
              placeholder="e.g., 500 sqm or 2 plots"
              value={formData.land_size}
              onChange={(e) => setFormData({ ...formData, land_size: e.target.value })}
              className="text-lg p-6"
            />
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What is the property condition?</h1>
            <div className="grid gap-3">
              {propertyConditions.map((condition) => (
                <Card
                  key={condition}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    formData.property_condition === condition
                      ? "border-[hsl(145,63%,42%)] border-2 bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setFormData({ ...formData, property_condition: condition })}
                >
                  <span className="text-lg">{condition}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What is the occupancy status?</h1>
            <div className="grid gap-3">
              {occupancyStatuses.map((status) => (
                <Card
                  key={status}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    formData.occupancy_status === status
                      ? "border-[hsl(145,63%,42%)] border-2 bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setFormData({ ...formData, occupancy_status: status })}
                >
                  <span className="text-lg">{status}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 9 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What title document do you have?</h1>
            <div className="grid gap-3">
              {titleDocuments.map((doc) => (
                <Card
                  key={doc}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    formData.title_document === doc
                      ? "border-[hsl(145,63%,42%)] border-2 bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setFormData({ ...formData, title_document: doc })}
                >
                  <span className="text-lg">{doc}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 10 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Add photos of your property</h1>
            <p className="text-gray-600">Upload at least one photo</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
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
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 11 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Give your listing a title</h1>
            <p className="text-gray-600">Create a catchy title that highlights the best features</p>
            <Input
              type="text"
              placeholder="e.g., Luxury 4 Bedroom Duplex in Lekki"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-lg p-6"
            />
          </div>
        )}

        {currentStep === 12 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Describe your property</h1>
            <p className="text-gray-600">Share what makes your property special</p>
            <Textarea
              placeholder="Describe the property features, amenities, and surroundings..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[200px] text-lg"
            />
          </div>
        )}

        {currentStep === 13 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Any nearby landmarks?</h1>
            <p className="text-gray-600">Help buyers find your property easily (Optional)</p>
            <Textarea
              placeholder="e.g., Close to Shoprite, 5 minutes from Lekki Toll Gate"
              value={formData.nearby_landmarks}
              onChange={(e) => setFormData({ ...formData, nearby_landmarks: e.target.value })}
              className="min-h-[120px]"
            />
          </div>
        )}

        {currentStep === 14 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What is your asking price?</h1>
            <p className="text-gray-600">Set your sale price in Naira</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500">₦</span>
              <Input
                type="number"
                placeholder="0"
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                className="text-2xl p-6 pl-12"
              />
            </div>
          </div>
        )}

        {currentStep === 15 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Is the price negotiable?</h1>
            <div className="grid gap-4">
              {["yes", "no"].map((option) => (
                <Card
                  key={option}
                  className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                    formData.price_negotiable === option
                      ? "border-[hsl(145,63%,42%)] border-2 bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setFormData({ ...formData, price_negotiable: option })}
                >
                  <span className="text-xl font-medium capitalize">{option}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 16 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Why are you selling?</h1>
            <p className="text-gray-600">This helps buyers understand your motivation (Optional)</p>
            <Textarea
              placeholder="e.g., Relocating abroad, Upgrading to a bigger property"
              value={formData.reason_for_selling}
              onChange={(e) => setFormData({ ...formData, reason_for_selling: e.target.value })}
              className="min-h-[120px]"
            />
          </div>
        )}

        {currentStep === 17 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Review your listing</h1>
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <h3 className="font-semibold text-lg mb-2">Property Type</h3>
                <p className="text-gray-700 capitalize">{formData.property_type} - {formData.property_sub_type}</p>
              </div>
              {formData.property_type !== "land" && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Bedrooms & Bathrooms</h3>
                  <p className="text-gray-700">{formData.bedrooms} Bedrooms, {formData.bathrooms} Bathrooms</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg mb-2">Location</h3>
                <p className="text-gray-700">{formData.location}</p>
                {formData.address && <p className="text-gray-600 text-sm mt-1">{formData.address}</p>}
              </div>
              {formData.property_age && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Property Age</h3>
                  <p className="text-gray-700">{formData.property_age}</p>
                </div>
              )}
              {formData.land_size && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Land Size</h3>
                  <p className="text-gray-700">{formData.land_size}</p>
                </div>
              )}
              {formData.property_condition && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Condition</h3>
                  <p className="text-gray-700">{formData.property_condition}</p>
                </div>
              )}
              {formData.occupancy_status && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Occupancy Status</h3>
                  <p className="text-gray-700">{formData.occupancy_status}</p>
                </div>
              )}
              {formData.title_document && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Title Document</h3>
                  <p className="text-gray-700">{formData.title_document}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg mb-2">Photos</h3>
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((url, index) => (
                    <img key={index} src={url} alt={`Property ${index + 1}`} className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Title</h3>
                <p className="text-gray-700">{formData.title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700">{formData.description}</p>
              </div>
              {formData.nearby_landmarks && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Nearby Landmarks</h3>
                  <p className="text-gray-700">{formData.nearby_landmarks}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg mb-2">Sale Price</h3>
                <p className="text-2xl font-bold text-[hsl(145,63%,42%)]">
                  ₦{parseFloat(formData.sale_price).toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Price is {formData.price_negotiable === "yes" ? "negotiable" : "not negotiable"}
                </p>
              </div>
              {formData.reason_for_selling && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Reason for Selling</h3>
                  <p className="text-gray-700">{formData.reason_for_selling}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {currentStep < 17 && (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1 bg-[hsl(145,63%,42%)] hover:bg-[hsl(145,63%,35%)] text-white py-6 text-lg"
            >
              Next <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          )}
          {currentStep === 17 && (
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-[hsl(145,63%,42%)] hover:bg-[hsl(145,63%,35%)] text-white py-6 text-lg"
            >
              {editId ? "Update Listing" : "Publish Listing"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

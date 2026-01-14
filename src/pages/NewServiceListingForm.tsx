import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Upload, Car, Paintbrush, Package, Wrench } from "lucide-react";

const serviceTypes = [
  { value: "relocation", label: "Car Delivery & Relocation", icon: Car },
  { value: "painting", label: "Painting Services", icon: Paintbrush },
  { value: "furniture", label: "Furniture Services", icon: Package },
  { value: "other", label: "Other Services", icon: Wrench },
];

export default function NewServiceListingForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const editId = searchParams.get("edit");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    service_type: typeParam || "",
    title: "",
    description: "",
    experience: "",
    pricing: "",
    location: "",
    availability: "",
    images: [] as string[],
    certifications: "",
    contact_phone: "",
    contact_email: "",
    business_address: "",
  });

  useEffect(() => {
    if (editId) loadExistingListing();
  }, [editId]);

  const loadExistingListing = async () => {
    try {
      const { data, error } = await supabase.from("services").select("*").eq("id", editId).single();
      if (error) throw error;
      if (data) {
        setFormData({
          service_type: data.service_type || "",
          title: data.title || "",
          description: data.description || "",
          experience: data.experience_years || "",
          pricing: data.pricing || "",
          location: data.location || "",
          availability: data.availability || "",
          images: data.images || [],
          certifications: data.certifications || "",
          contact_phone: data.contact_phone || "",
          contact_email: data.contact_email || "",
          business_address: data.business_address || "",
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

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to continue");
        return;
      }

      const serviceData: any = {
        user_id: user.id,
        service_type: formData.service_type,
        title: formData.title,
        description: formData.description,
        experience_years: formData.experience,
        pricing: formData.pricing,
        location: formData.location,
        availability: formData.availability,
        images: formData.images,
        certifications: formData.certifications,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        business_address: formData.business_address,
      };

      console.log('🔍 Submitting service data:', serviceData);

      if (editId) {
        const { error, data } = await supabase.from("services").update(serviceData).eq("id", editId).select();
        console.log('✅ Update result:', { error, data });
        if (error) throw error;
        toast.success("Listing updated successfully");
      } else {
        const { error, data } = await supabase.from("services").insert([serviceData]).select();
        console.log('✅ Insert result:', { error, data });
        if (error) throw error;
        toast.success("Listing created successfully");
      }
      navigate("/my-listings");
    } catch (error: any) {
      console.error('❌ Error saving service:', error);
      toast.error(error.message || "Failed to save listing");
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 10));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.service_type !== "";
      case 2: return formData.title.trim() !== "";
      case 3: return formData.description.trim() !== "";
      case 4: return formData.experience !== "";
      case 5: return formData.pricing !== "";
      case 6: return formData.location !== "";
      case 7: return formData.availability !== "";
      case 8: return formData.images.length > 0;
      case 9: return formData.contact_phone !== "";
      case 10: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => currentStep === 1 ? navigate(-1) : prevStep()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm text-gray-600">Step {currentStep} of 10</span>
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full">
            <div className="bg-[hsl(145,63%,42%)] h-1 rounded-full transition-all" style={{ width: `${(currentStep / 10) * 100}%` }} />
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What service do you offer?</h1>
            <div className="grid gap-4">
              {serviceTypes.map((type) => (
                <Card key={type.value} className={`p-6 cursor-pointer transition-all hover:shadow-md ${formData.service_type === type.value ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, service_type: type.value })}>
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
            <h1 className="text-3xl font-bold">Give your service a title</h1>
            <p className="text-gray-600">Create a clear title that describes your service</p>
            <Input type="text" placeholder="e.g., Professional Painting Services in Lagos" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="text-lg p-6" />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Describe your service</h1>
            <p className="text-gray-600">Share what makes your service unique</p>
            <Textarea placeholder="Describe your service, experience, and what makes you unique..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-[200px] text-lg" />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">How many years of experience?</h1>
            <div className="grid gap-3">
              {["1-2", "3-5", "6-10", "10+"].map((exp) => (
                <Card key={exp} className={`p-4 cursor-pointer transition-all hover:shadow-md ${formData.experience === exp ? "border-[hsl(145,63%,42%)] border-2 bg-green-50" : "border-gray-200"}`} onClick={() => setFormData({ ...formData, experience: exp })}>
                  <span className="text-lg">{exp === "10+" ? "10+ years" : `${exp} years`}</span>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What is your pricing?</h1>
            <p className="text-gray-600">Enter your service rates</p>
            <Input type="text" placeholder="e.g., From ₦5,000 per room" value={formData.pricing} onChange={(e) => setFormData({ ...formData, pricing: e.target.value })} className="text-lg p-6" />
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What areas do you serve?</h1>
            <p className="text-gray-600">List the locations where you provide service</p>
            <Textarea placeholder="e.g., Lagos Island, Victoria Island, Lekki, Ikoyi" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="min-h-[120px]" />
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">What is your availability?</h1>
            <p className="text-gray-600">When are you available to provide service?</p>
            <Textarea placeholder="e.g., Monday-Friday 8AM-6PM, Weekends available" value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })} className="min-h-[120px]" />
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Add photos of your work</h1>
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
                    <img src={url} alt={`Work ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => removeImage(index)}>×</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 9 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Contact information</h1>
            <p className="text-gray-600">How can customers reach you?</p>
            <div className="space-y-4">
              <div>
                <Label className="text-lg mb-2 block">Phone Number</Label>
                <Input type="tel" placeholder="+234 xxx xxx xxxx" value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} className="text-lg p-4" />
              </div>
              <div>
                <Label className="text-lg mb-2 block">Email Address (Optional)</Label>
                <Input type="email" placeholder="your.email@example.com" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} className="text-lg p-4" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 10 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Review your listing</h1>
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <div><h3 className="font-semibold text-lg mb-2">Service Type</h3><p className="text-gray-700 capitalize">{serviceTypes.find(t => t.value === formData.service_type)?.label}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Title</h3><p className="text-gray-700">{formData.title}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Description</h3><p className="text-gray-700">{formData.description}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Experience</h3><p className="text-gray-700">{formData.experience === "10+" ? "10+ years" : `${formData.experience} years`}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Pricing</h3><p className="text-2xl font-bold text-[hsl(145,63%,42%)]">{formData.pricing}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Service Areas</h3><p className="text-gray-700">{formData.location}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Availability</h3><p className="text-gray-700">{formData.availability}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Photos</h3><div className="grid grid-cols-4 gap-2">{formData.images.map((url, index) => (<img key={index} src={url} alt={`Work ${index + 1}`} className="w-full h-20 object-cover rounded" />))}</div></div>
              {formData.certifications && <div><h3 className="font-semibold text-lg mb-2">Certifications</h3><p className="text-gray-700">{formData.certifications}</p></div>}
              <div><h3 className="font-semibold text-lg mb-2">Contact</h3><p className="text-gray-700">Phone: {formData.contact_phone}</p>{formData.contact_email && <p className="text-gray-700">Email: {formData.contact_email}</p>}{formData.business_address && <p className="text-gray-700 mt-1">{formData.business_address}</p>}</div>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {currentStep < 10 && (<Button onClick={nextStep} disabled={!canProceed()} className="flex-1 bg-[hsl(145,63%,42%)] hover:bg-[hsl(145,63%,35%)] text-white py-6 text-lg">Next <ArrowRight className="ml-2 w-5 h-5" /></Button>)}
          {currentStep === 10 && (<Button onClick={handleSubmit} className="flex-1 bg-[hsl(145,63%,42%)] hover:bg-[hsl(145,63%,35%)] text-white py-6 text-lg">{editId ? "Update Listing" : "Publish Listing"}</Button>)}
        </div>
      </div>
    </div>
  );
}

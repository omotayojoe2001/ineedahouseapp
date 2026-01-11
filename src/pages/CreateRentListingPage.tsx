import React, { useState } from 'react';
import Layout from '../components/Layout';
import EnhancedLocationInput from '../components/EnhancedLocationInput';
import LocationInputWithMap from '../components/LocationInputWithMap';
import { ArrowLeft, Upload, X, Home, Building, Store, Calendar, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PropertyService } from '../services/propertyService';

const CreateRentListingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [images, setImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertySubType: '',
    bedrooms: '',
    bathrooms: '',
    guestToilet: '',
    totalRooms: '',
    sqft: '',
    // Location will be handled by EnhancedLocationInput
    locationData: {
      stateId: '',
      cityId: '',
      areaId: '',
      streetId: '',
      detailedAddress: '',
      landmarks: ''
    },
    // Pricing
    rentType: 'monthly',
    rentAmount: '',
    serviceCharge: '',
    securityDeposit: '',
    agreementFee: '',
    commissionFee: '',
    legalFee: '',
    cautionFee: '',
    agencyFee: '',
    inspectionFee: '',
    otherFees: [],
    // Property Features
    floorLevel: '',
    totalUnitsInBuilding: '',
    livingRoom: '',
    diningArea: '',
    kitchen: '',
    kitchenCabinets: '',
    countertop: '',
    heatExtractor: '',
    balcony: '',
    storage: '',
    // Utilities & Infrastructure
    electricityType: '',
    transformer: '',
    generator: '',
    waterSupply: '',
    borehole: '',
    treatedWater: '',
    internetReady: '',
    wasteManagement: '',
    // Security
    gatedCompound: '',
    security24_7: '',
    cctv: '',
    accessControl: '',
    // Parking
    parkingSpaces: '',
    visitorParking: '',
    // Finishing & Condition
    popCeiling: '',
    tiledFloors: '',
    sanitaryFittings: '',
    paintCondition: '',
    buildingCondition: '',
    // Legal Documentation
    certificateOfOccupancy: '',
    deedOfAssignment: '',
    buildingPlan: '',
    // Lease Terms
    leaseDuration: '',
    availableFrom: '',
    allowsPets: '',
    furnished: '',
    // Combined fees
    agreementCommission: '',
    legalAgency: '',
    // Amenities (checkboxes)
    amenities: {
      gym: false,
      kitchen: false,
      ac: false,
      generator: false,
      furniture: false,
      elevator: false,
      balcony: false,
      parking: false,
      water: false,
      internet: false,
      security: false,
      garden: false,
      pool: false,
      cctv: false
    },
  });

  const propertyTypes = [
    { id: 'house', label: 'House/Apartment', icon: Home, description: 'Houses, flats, and residential properties' },
    { id: 'commercial', label: 'Commercial Space', icon: Building, description: 'Offices, warehouses, commercial buildings' },
    { id: 'shop', label: 'Shop/Store', icon: Store, description: 'Retail spaces and shops' },
    { id: 'event', label: 'Event Center', icon: Calendar, description: 'Event halls and venues' },
  ];

  const propertySubTypes = {
    house: ['Self-Contained', 'Mini Flat', '1 Bedroom Flat', '2 Bedroom Flat', '3 Bedroom Flat', '4+ Bedroom Flat', 'Duplex', 'Bungalow'],
    commercial: ['Office Space', 'Warehouse', 'Factory', 'Co-working Space', 'Medical Center'],
    shop: ['Shop/Store', 'Supermarket', 'Mall Space', 'Kiosk', 'Market Stall'],
    event: ['Event Hall', 'Conference Center', 'Wedding Venue', 'Party Hall']
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (locationData: any) => {
    setFormData(prev => ({ ...prev, locationData }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Map form data to PropertyData interface - CLEAN VERSION
      const propertyData = {
        title: formData.title,
        description: formData.description,
        category: 'rent' as const,
        property_type: formData.propertySubType,
        price: parseFloat(formData.rentAmount) || 0,
        location: formData.locationData.detailedAddress || 'Location not specified',
        
        // Location data
        state_id: formData.locationData.stateId || null,
        city_id: formData.locationData.cityId || null,
        area_id: formData.locationData.areaId || null,
        street_id: formData.locationData.streetId || null,
        address: formData.locationData.detailedAddress,
        nearby_landmarks: formData.locationData.landmarks,
        
        // Basic property info
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        guest_toilet: formData.guestToilet === 'yes' ? 1 : 0,
        
        // Pricing
        rent_type: formData.rentType as 'daily' | 'weekly' | 'monthly' | 'annual',
        annual_rent: parseFloat(formData.rentAmount) || 0,
        security_deposit: parseFloat(formData.securityDeposit) || 0,
        service_charge: parseFloat(formData.serviceCharge) || 0,
        agreement_fee: parseFloat(formData.agreementCommission) || 0,
        legal_fee: parseFloat(formData.legalAgency) || 0,
        other_fees: formData.otherFees || [],
        
        // Building details
        floor_level: formData.floorLevel === 'ground' ? 0 : 
                    formData.floorLevel === '1st' ? 1 :
                    formData.floorLevel === '2nd' ? 2 :
                    formData.floorLevel === '3rd' ? 3 : 4,
        total_units_in_building: parseInt(formData.totalUnitsInBuilding) || 0,
        building_condition: formData.buildingCondition,
        
        // Amenities (boolean)
        gym: formData.amenities.gym,
        air_conditioning: formData.amenities.ac,
        parking: formData.amenities.parking,
        swimming_pool: formData.amenities.pool,
        garden: formData.amenities.garden,
        elevator: formData.amenities.elevator,
        furnished: formData.amenities.furniture,
        
        // Security (boolean)
        gated_compound: formData.gatedCompound === 'yes',
        security_personnel: formData.security24_7 === 'yes',
        cctv_surveillance: formData.cctv !== 'none' && formData.cctv !== '',
        parking_spaces: parseInt(formData.parkingSpaces) || 0,
        
        // Finishing (boolean)
        pop_ceiling: formData.popCeiling === 'yes',
        tiled_floors: formData.tiledFloors === 'yes',
        
        // Legal documents (boolean)
        certificate_of_occupancy: formData.certificateOfOccupancy === 'available',
        deed_of_assignment: formData.deedOfAssignment === 'available',
        approved_building_plan: formData.buildingPlan === 'approved',
        
        // Lease terms
        available_from: formData.availableFrom,
        lease_terms: formData.leaseDuration,
        
        // Images
        images: images.map(img => URL.createObjectURL(img)),
        
        status: 'active' as const
      };

      console.log('Property data being sent:', propertyData);
      await PropertyService.createProperty(propertyData);
      alert('Rent listing created successfully!');
      navigate('/my-listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Property Type for Rent</h2>
              <p className="text-muted-foreground mb-6">What type of property are you renting out?</p>
            </div>
            
            <div className="grid gap-4">
              {propertyTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setPropertyType(type.id)}
                    className={`p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:shadow-lg ${
                      propertyType === type.id 
                        ? 'border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg' 
                        : 'border-border hover:border-primary/30 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        propertyType === type.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                      }`}>
                        <IconComponent size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{type.label}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{type.description}</p>
                      </div>
                      {propertyType === type.id && (
                        <div className="text-primary">
                          <CheckCircle size={24} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Property Details & Location</h2>
              <p className="text-muted-foreground mb-4">Tell us about your rental property</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Property Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="e.g., Modern 3-Bedroom Apartment for Rent in Lekki"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Specific Property Type</label>
                <select
                  value={formData.propertySubType}
                  onChange={(e) => handleInputChange('propertySubType', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                >
                  <option value="">Select specific type</option>
                  {propertyType && propertySubTypes[propertyType as keyof typeof propertySubTypes]?.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Room Details */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">Room Configuration</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Select</option>
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <select
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Select</option>
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Guest Toilet</label>
                    <select
                      value={formData.guestToilet}
                      onChange={(e) => handleInputChange('guestToilet', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">Location Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address (with auto-complete)</label>
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Location</label>
                    <LocationInputWithMap
                      value={formData.locationData.detailedAddress}
                      onChange={(address) => setFormData(prev => ({
                        ...prev,
                        locationData: { ...prev.locationData, detailedAddress: address }
                      }))}
                      onLocationChange={(locationData) => {
                        console.log('Location data:', locationData);
                        // You can auto-populate state/city here if needed
                      }}
                      placeholder="Enter your property address or get current location"
                    />
                  </div>
                    <p className="text-xs text-gray-500 mt-1">💡 This auto-fills from your selection above</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-3">Additional location details (optional):</p>
                    <EnhancedLocationInput
                      onLocationChange={handleLocationChange}
                      initialData={formData.locationData}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg h-24"
                  placeholder="Describe your rental property..."
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Photos & Property Features</h2>
              <p className="text-muted-foreground mb-4">Upload photos and specify property features</p>
            </div>

            <div className="space-y-6">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Property Photos</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload photos (Max 10)</p>
                  </label>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Building Details */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">Building Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Which floor is the house on?</label>
                    <select
                      value={formData.floorLevel}
                      onChange={(e) => handleInputChange('floorLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Choose floor</option>
                      <option value="ground">Ground floor (downstairs)</option>
                      <option value="1st">1st floor (upstairs)</option>
                      <option value="2nd">2nd floor</option>
                      <option value="3rd">3rd floor</option>
                      <option value="4th+">4th floor or higher</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">How many flats are in the building?</label>
                    <input
                      type="number"
                      value={formData.totalUnitsInBuilding}
                      onChange={(e) => handleInputChange('totalUnitsInBuilding', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                      placeholder="e.g. 12"
                    />
                  </div>
                </div>
              </div>

              {/* Interior Features */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">Inside the House</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">How is the sitting room?</label>
                      <select
                        value={formData.livingRoom}
                        onChange={(e) => handleInputChange('livingRoom', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="spacious">Very big (spacious)</option>
                        <option value="well-lit">Bright with good light</option>
                        <option value="compact">Small but okay</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Dining space</label>
                      <select
                        value={formData.diningArea}
                        onChange={(e) => handleInputChange('diningArea', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="dedicated">Separate dining room</option>
                        <option value="combined">Part of sitting room</option>
                        <option value="none">No dining space</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Kitchen cabinets</label>
                      <select
                        value={formData.kitchenCabinets}
                        onChange={(e) => handleInputChange('kitchenCabinets', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="fitted">Has kitchen cabinets</option>
                        <option value="none">No cabinets</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Kitchen counter</label>
                      <select
                        value={formData.countertop}
                        onChange={(e) => handleInputChange('countertop', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="granite">Granite (stone)</option>
                        <option value="marble">Marble (smooth stone)</option>
                        <option value="laminate">Normal counter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Kitchen fan (extractor)</label>
                      <select
                        value={formData.heatExtractor}
                        onChange={(e) => handleInputChange('heatExtractor', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Balcony (verandah)</label>
                      <select
                        value={formData.balcony}
                        onChange={(e) => handleInputChange('balcony', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Store room</label>
                      <select
                        value={formData.storage}
                        onChange={(e) => handleInputChange('storage', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="in-apartment">Store inside the house</option>
                        <option value="external">Store outside the house</option>
                        <option value="none">No store room</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Utilities & Infrastructure */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">Light, Water & Other Services</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Type of light (electricity)</label>
                      <select
                        value={formData.electricityType}
                        onChange={(e) => handleInputChange('electricityType', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="public">NEPA/PHCN light</option>
                        <option value="prepaid">Prepaid meter</option>
                        <option value="postpaid">Monthly bill</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Transformer</label>
                      <select
                        value={formData.transformer}
                        onChange={(e) => handleInputChange('transformer', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="dedicated">Own transformer</option>
                        <option value="shared">Shared transformer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Generator</label>
                      <select
                        value={formData.generator}
                        onChange={(e) => handleInputChange('generator', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="estate-managed">Estate provides generator</option>
                        <option value="personal">Your own generator</option>
                        <option value="none">No generator</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Water supply</label>
                      <select
                        value={formData.waterSupply}
                        onChange={(e) => handleInputChange('waterSupply', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="borehole">Borehole water</option>
                        <option value="treated">Clean treated water</option>
                        <option value="public">Government water</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Internet connection</label>
                      <select
                        value={formData.internetReady}
                        onChange={(e) => handleInputChange('internetReady', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="fiber-ready">Fast internet ready</option>
                        <option value="cable-ready">Cable internet ready</option>
                        <option value="none">No internet setup</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Parking */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">Security & Car Parking</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Is there a gate?</label>
                      <select
                        value={formData.gatedCompound}
                        onChange={(e) => handleInputChange('gatedCompound', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="yes">Yes, gated compound</option>
                        <option value="no">No gate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Security guard</label>
                      <select
                        value={formData.security24_7}
                        onChange={(e) => handleInputChange('security24_7', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="yes">Yes, day and night</option>
                        <option value="no">No security guard</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Security cameras</label>
                      <select
                        value={formData.cctv}
                        onChange={(e) => handleInputChange('cctv', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="common-areas">Only in common areas</option>
                        <option value="full-coverage">Everywhere</option>
                        <option value="none">No cameras</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Car parking space</label>
                      <select
                        value={formData.parkingSpaces}
                        onChange={(e) => handleInputChange('parkingSpaces', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="1">1 car space</option>
                        <option value="2">2 car spaces</option>
                        <option value="3+">3 or more spaces</option>
                        <option value="none">No parking space</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">What This Place Offers</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'gym', label: 'Gym' },
                    { key: 'kitchen', label: 'Kitchen' },
                    { key: 'ac', label: 'Air Conditioning' },
                    { key: 'generator', label: 'Generator' },
                    { key: 'furniture', label: 'Furnished' },
                    { key: 'elevator', label: 'Elevator' },
                    { key: 'balcony', label: 'Balcony' },
                    { key: 'parking', label: 'Parking' },
                    { key: 'water', label: 'Water Supply' },
                    { key: 'internet', label: 'Internet' },
                    { key: 'security', label: '24/7 Security' },
                    { key: 'garden', label: 'Garden' },
                    { key: 'pool', label: 'Swimming Pool' },
                    { key: 'cctv', label: 'CCTV' }
                  ].map(amenity => (
                    <label key={amenity.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities[amenity.key]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          amenities: { ...prev.amenities, [amenity.key]: e.target.checked }
                        }))}
                        className="rounded border-border"
                      />
                      <span className="text-sm">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Finishing & Legal - Simplified with checkboxes */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">House Finishing & Papers</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.popCeiling === 'yes'}
                        onChange={(e) => handleInputChange('popCeiling', e.target.checked ? 'yes' : 'no')}
                        className="rounded border-border"
                      />
                      <span className="text-sm">POP ceiling (smooth ceiling)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.tiledFloors === 'yes'}
                        onChange={(e) => handleInputChange('tiledFloors', e.target.checked ? 'yes' : 'no')}
                        className="rounded border-border"
                      />
                      <span className="text-sm">Tiled floors</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">How is the building?</label>
                    <select
                      value={formData.buildingCondition}
                      onChange={(e) => handleInputChange('buildingCondition', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Choose</option>
                      <option value="newly-built">Brand new building</option>
                      <option value="renovated">Just renovated</option>
                      <option value="good">Good condition</option>
                      <option value="fair">Okay condition</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">C of O (government paper)</label>
                      <select
                        value={formData.certificateOfOccupancy}
                        onChange={(e) => handleInputChange('certificateOfOccupancy', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="available">Yes, we have it</option>
                        <option value="processing">Still getting it</option>
                        <option value="not-available">Don't have it</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Deed (ownership paper)</label>
                      <select
                        value={formData.deedOfAssignment}
                        onChange={(e) => handleInputChange('deedOfAssignment', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="available">Yes, we have it</option>
                        <option value="processing">Still getting it</option>
                        <option value="not-available">Don't have it</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Building approval</label>
                      <select
                        value={formData.buildingPlan}
                        onChange={(e) => handleInputChange('buildingPlan', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Choose</option>
                        <option value="approved">Government approved</option>
                        <option value="processing">Still getting approval</option>
                        <option value="not-available">No approval yet</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Rental Terms & Pricing</h2>
              <p className="text-muted-foreground mb-4">Set your rental terms and pricing</p>
            </div>

            <div className="space-y-6">
              {/* Rent Type and Amount */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">Rent Details</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rent Type</label>
                    <select
                      value={formData.rentType}
                      onChange={(e) => handleInputChange('rentType', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="daily">Daily Rent</option>
                      <option value="weekly">Weekly Rent</option>
                      <option value="monthly">Monthly Rent</option>
                      <option value="annual">Annual Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {formData.rentType === 'daily' ? 'Daily' : 
                       formData.rentType === 'weekly' ? 'Weekly' : 
                       formData.rentType === 'monthly' ? 'Monthly' : 'Annual'} Rent (₦)
                    </label>
                    <input
                      type="number"
                      value={formData.rentAmount}
                      onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                      placeholder="150000"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Fees */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">Additional Fees</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      Security Deposit (₦)
                      <span className="text-xs text-gray-500 cursor-help" title="Refundable deposit to cover damages">❓</span>
                    </label>
                    <input
                      type="number"
                      value={formData.securityDeposit}
                      onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                      placeholder="300000"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      Service Charge (₦)
                      <span className="text-xs text-gray-500 cursor-help" title="Monthly maintenance and utility fees">❓</span>
                    </label>
                    <input
                      type="number"
                      value={formData.serviceCharge}
                      onChange={(e) => handleInputChange('serviceCharge', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                      placeholder="25000"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      Agreement & Commission (₦)
                      <span className="text-xs text-gray-500 cursor-help" title="Combined agreement preparation and agent commission fees">❓</span>
                    </label>
                    <input
                      type="number"
                      value={formData.agreementCommission}
                      onChange={(e) => handleInputChange('agreementCommission', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                      placeholder="125000"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      Legal & Agency (₦)
                      <span className="text-xs text-gray-500 cursor-help" title="Combined legal documentation and agency processing fees">❓</span>
                    </label>
                    <input
                      type="number"
                      value={formData.legalAgency}
                      onChange={(e) => handleInputChange('legalAgency', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                      placeholder="130000"
                    />
                  </div>
                </div>
              </div>

              {/* Other Fees */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Other Fees</h3>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, otherFees: [...(prev.otherFees || []), { name: '', amount: '' }] }))}
                    className="flex items-center gap-2 text-primary hover:text-primary/80"
                  >
                    <Plus size={16} />
                    Add Fee
                  </button>
                </div>
                {formData.otherFees?.map((fee, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={fee.name}
                      onChange={(e) => {
                        const newFees = [...(formData.otherFees || [])];
                        newFees[index] = { ...newFees[index], name: e.target.value };
                        setFormData(prev => ({ ...prev, otherFees: newFees }));
                      }}
                      className="flex-1 px-3 py-2 border border-border rounded-lg"
                      placeholder="Fee name"
                    />
                    <input
                      type="number"
                      value={fee.amount}
                      onChange={(e) => {
                        const newFees = [...(formData.otherFees || [])];
                        newFees[index] = { ...newFees[index], amount: e.target.value };
                        setFormData(prev => ({ ...prev, otherFees: newFees }));
                      }}
                      className="w-32 px-3 py-2 border border-border rounded-lg"
                      placeholder="Amount"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, otherFees: (prev.otherFees || []).filter((_, i) => i !== index) }))}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                <h3 className="font-semibold mb-3">Cost Summary</h3>
                <div className="space-y-2 text-sm">
                  {formData.rentAmount && (
                    <div className="flex justify-between">
                      <span>{formData.rentType.charAt(0).toUpperCase() + formData.rentType.slice(1)} Rent:</span>
                      <span>₦{parseFloat(formData.rentAmount || '0').toLocaleString()}</span>
                    </div>
                  )}
                  {formData.securityDeposit && (
                    <div className="flex justify-between">
                      <span>Security Deposit:</span>
                      <span>₦{parseFloat(formData.securityDeposit || '0').toLocaleString()}</span>
                    </div>
                  )}
                  {formData.serviceCharge && (
                    <div className="flex justify-between">
                      <span>Service Charge:</span>
                      <span>₦{parseFloat(formData.serviceCharge || '0').toLocaleString()}</span>
                    </div>
                  )}
                  {formData.agreementCommission && (
                    <div className="flex justify-between">
                      <span>Agreement & Commission:</span>
                      <span>₦{parseFloat(formData.agreementCommission || '0').toLocaleString()}</span>
                    </div>
                  )}
                  {formData.legalAgency && (
                    <div className="flex justify-between">
                      <span>Legal & Agency:</span>
                      <span>₦{parseFloat(formData.legalAgency || '0').toLocaleString()}</span>
                    </div>
                  )}
                  {(formData.otherFees || []).map((fee, index) => 
                    fee.name && fee.amount ? (
                      <div key={index} className="flex justify-between">
                        <span>{fee.name}:</span>
                        <span>₦{parseFloat(fee.amount || '0').toLocaleString()}</span>
                      </div>
                    ) : null
                  )}
                  <div className="border-t border-primary/20 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Upfront Cost:</span>
                      <span className="text-primary">
                        ₦{(
                          (parseFloat(formData.rentAmount) || 0) +
                          (parseFloat(formData.securityDeposit) || 0) +
                          (parseFloat(formData.serviceCharge) || 0) +
                          (parseFloat(formData.agreementCommission) || 0) +
                          (parseFloat(formData.legalAgency) || 0) +
                          (formData.otherFees || []).reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lease Terms */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">Lease Terms</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      Lease Duration
                      <span className="text-xs text-gray-500 cursor-help" title="How long the tenant will rent the property">❓</span>
                    </label>
                    <select
                      value={formData.leaseDuration}
                      onChange={(e) => handleInputChange('leaseDuration', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    >
                      <option value="">Select duration</option>
                      <option value="6months">6 Months</option>
                      <option value="1year">1 Year</option>
                      <option value="2years">2 Years</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Available From</label>
                    <input
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout activeTab="upload">
      <div className="bg-background min-h-screen desktop-nav-spacing">
        <div className="px-4 pt-4 pb-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/80 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-primary" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-primary">List Property for Rent</h1>
              <p className="text-sm text-muted-foreground">Step {currentStep} of 4 • Create your rental listing</p>
            </div>
          </div>
          
          <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-4 py-6 pb-32 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-2xl mx-auto">
            {renderStep()}
          </div>
        </div>

        <div className="fixed bottom-20 lg:bottom-6 left-0 right-0 px-4 bg-white/95 backdrop-blur-sm border-t border-border py-4 z-50 shadow-lg">
          <div className="max-w-2xl mx-auto flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={currentStep === 4 ? handleSubmit : handleNext}
              disabled={currentStep === 1 && !propertyType}
              className="flex-1 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl font-medium disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
            >
              {currentStep === 4 ? 'Publish Rental ✨' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRentListingPage;
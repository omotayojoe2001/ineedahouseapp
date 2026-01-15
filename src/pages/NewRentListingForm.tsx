import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, Building, Plus, Minus, MapPin, Upload, DollarSign } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LocationInputWithMap from '../components/LocationInputWithMap';
import EnhancedLocationInput from '../components/EnhancedLocationInput';
import { nigeriaStates, lgasByState } from '@/data/nigeriaLocations';

const NewRentListingForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(!!editId);
  const [showConfirmAddress, setShowConfirmAddress] = useState(false);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: '',
    propertySubType: '',
    title: '',
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    guestToilet: '',
    totalRooms: '',
    sqft: '',
    locationData: { stateId: '', cityId: '', areaId: '', streetId: '', detailedAddress: '', landmarks: '', area: '', state: '', street: '', busStop: '', lga: '' },
    floorLevel: '',
    totalUnitsInBuilding: '',
    livingRoom: '',
    diningArea: '',
    kitchenCabinets: '',
    countertop: '',
    heatExtractor: '',
    balcony: '',
    storage: '',
    electricityType: '',
    transformer: '',
    generator: '',
    waterSupply: '',
    internetReady: '',
    gatedCompound: '',
    security24_7: '',
    cctv: '',
    parkingSpaces: '',
    popCeiling: '',
    tiledFloors: '',
    buildingCondition: '',
    certificateOfOccupancy: '',
    deedOfAssignment: '',
    buildingPlan: '',
    rentType: 'monthly',
    rentAmount: '',
    serviceCharge: '',
    securityDeposit: '',
    agreementCommission: '',
    legalAgency: '',
    leaseDuration: '',
    availableFrom: '',
    allowsPets: '',
    tenantPreference: '',
    images: []
  });

  useEffect(() => {
    if (editId) {
      const fetchProperty = async () => {
        try {
          const { data, error } = await supabase.from('properties').select('*').eq('id', editId).single();
          if (error) throw error;

          const existingImages: File[] = [];
          if (data.images && Array.isArray(data.images)) {
            for (let i = 0; i < data.images.length; i++) {
              try {
                const response = await fetch(data.images[i]);
                const blob = await response.blob();
                existingImages.push(new File([blob], `image-${i}.jpg`, { type: 'image/jpeg' }));
              } catch (err) {
                console.error('Error loading image:', err);
              }
            }
          }

          setFormData({
            propertyType: 'house',
            propertySubType: data.property_type || '',
            title: data.title || '',
            description: data.description || '',
            bedrooms: data.bedrooms || 1,
            bathrooms: data.bathrooms || 1,
            guestToilet: data.guest_toilet ? 'yes' : 'no',
            totalRooms: '',
            sqft: '',
            locationData: {
              stateId: data.state_id || '',
              cityId: data.city_id || '',
              areaId: data.area_id || '',
              streetId: data.street_id || '',
              detailedAddress: data.address || '',
              landmarks: data.nearby_landmarks || '',
              area: '', state: '', street: '', busStop: '', lga: ''
            },
            floorLevel: data.floor_level === 0 ? 'ground' : data.floor_level === 1 ? '1st' : data.floor_level === 2 ? '2nd' : data.floor_level === 3 ? '3rd' : '4th+',
            totalUnitsInBuilding: data.total_units_in_building?.toString() || '',
            livingRoom: data.living_room || '',
            diningArea: data.dining_area ? 'dedicated' : 'combined',
            kitchenCabinets: data.kitchen_cabinets || '',
            countertop: data.countertop || '',
            heatExtractor: data.heat_extractor || '',
            balcony: data.balcony_feature ? 'yes' : 'no',
            storage: data.storage || '',
            electricityType: data.electricity_type || '',
            transformer: data.transformer ? 'dedicated' : 'shared',
            generator: data.generator_type || 'none',
            waterSupply: data.water_supply ? 'borehole' : 'public',
            internetReady: data.internet_ready ? 'fiber-ready' : 'none',
            gatedCompound: data.gated_compound ? 'yes' : 'no',
            security24_7: data.security_personnel ? 'yes' : 'no',
            cctv: data.cctv_surveillance ? 'full-coverage' : 'none',
            parkingSpaces: data.parking_spaces?.toString() || '',
            popCeiling: data.pop_ceiling ? 'yes' : 'no',
            tiledFloors: data.tiled_floors ? 'yes' : 'no',
            buildingCondition: data.building_condition || '',
            certificateOfOccupancy: data.certificate_of_occupancy ? 'available' : 'not-available',
            deedOfAssignment: data.deed_of_assignment ? 'available' : 'not-available',
            buildingPlan: data.approved_building_plan ? 'approved' : 'not-available',
            rentType: data.rent_type || 'monthly',
            rentAmount: data.price?.toString() || data.annual_rent?.toString() || '',
            serviceCharge: data.service_charge?.toString() || '',
            securityDeposit: data.security_deposit?.toString() || '',
            agreementCommission: data.agreement_fee?.toString() || '',
            legalAgency: data.legal_fee?.toString() || '',
            leaseDuration: data.lease_terms || '',
            availableFrom: data.available_from || '',
            allowsPets: data.allows_pets || '',
            tenantPreference: data.tenant_preference || '',
            images: existingImages
          });
          setAddressConfirmed(true);
        } catch (error) {
          console.error('Error:', error);
          toast({ title: 'Error', description: 'Failed to load property', variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [editId, toast]);

  const propertyTypes = [
    { id: 'house', label: 'House/Apartment', icon: Home, desc: 'Residential properties' },
    { id: 'commercial', label: 'Commercial Space', icon: Building, desc: 'Offices, warehouses' }
  ];

  const subTypes = {
    house: ['Self-Contained', 'Mini Flat', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4+ Bedroom', 'Duplex'],
    commercial: ['Office Space', 'Warehouse', 'Factory', 'Co-working Space']
  };

  const parseAddress = (address: string) => {
    const parts = address.toLowerCase().split(',').map(p => p.trim()).filter(p => p);
    const parsed = { street: '', busStop: '', area: '', lga: '', state: '' };
    
    // Extract state (last part usually)
    const lastPart = parts[parts.length - 1] || '';
    const foundState = nigeriaStates.find(s => lastPart.includes(s.toLowerCase()));
    if (foundState) parsed.state = foundState;
    
    // Extract LGA if state is found
    if (parsed.state && lgasByState[parsed.state]) {
      for (const part of parts) {
        const foundLga = lgasByState[parsed.state].find(lga => part.includes(lga.toLowerCase()));
        if (foundLga) {
          parsed.lga = foundLga;
          break;
        }
      }
    }
    
    // First part with number is street
    if (parts.length >= 1 && /\d/.test(parts[0])) {
      parsed.street = parts[0];
    }
    
    // Second part is bus stop
    if (parts.length >= 2) parsed.busStop = parts[1];
    
    // Third part is area
    if (parts.length >= 3) parsed.area = parts[2];
    
    return parsed;
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.propertyType !== '';
      case 2: return formData.propertySubType !== '';
      case 4: return formData.locationData.detailedAddress !== '' && addressConfirmed;
      case 12: return formData.title !== '';
      case 14: return formData.rentAmount !== '';
      default: return true;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'Please sign in to create listings', variant: 'destructive' });
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      // Get city and state names from IDs
      let cityName = '';
      let stateName = '';
      
      if (formData.locationData.cityId) {
        const { data: cityData } = await supabase
          .from('cities')
          .select('name')
          .eq('id', formData.locationData.cityId)
          .single();
        cityName = cityData?.name || '';
      }
      
      if (formData.locationData.stateId) {
        const { data: stateData } = await supabase
          .from('states')
          .select('name')
          .eq('id', formData.locationData.stateId)
          .single();
        stateName = stateData?.name || '';
      }

      // Convert images to base64
      const imagePromises = formData.images.map(async (img) => {
        return new Promise<string>((resolve) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const image = new Image();
          image.onload = () => {
            const maxWidth = 800;
            const ratio = Math.min(maxWidth / image.width, maxWidth / image.height);
            canvas.width = image.width * ratio;
            canvas.height = image.height * ratio;
            ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          image.src = URL.createObjectURL(img);
        });
      });

      const processedImages = await Promise.all(imagePromises);

      const propertyData: any = {
        title: formData.title,
        description: formData.description,
        category: 'rent',
        property_type: formData.propertySubType,
        price: parseFloat(formData.rentAmount) || 0,
        location: `${cityName}, ${stateName}`.trim().replace(/^,\s*/, ''),
        address: formData.locationData.detailedAddress,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        guest_toilet: formData.guestToilet === 'yes' ? 1 : 0,
        rent_type: formData.rentType,
        annual_rent: parseFloat(formData.rentAmount) || 0,
        images: processedImages,
        user_id: user.id,
        status: 'active'
      };

      // Add optional fields only if they have values
      if (formData.locationData.stateId) propertyData.state_id = formData.locationData.stateId;
      if (formData.locationData.cityId) propertyData.city_id = formData.locationData.cityId;
      if (formData.locationData.areaId) propertyData.area_id = formData.locationData.areaId;
      if (formData.locationData.streetId) propertyData.street_id = formData.locationData.streetId;
      if (formData.locationData.landmarks) propertyData.nearby_landmarks = formData.locationData.landmarks;
      if (formData.securityDeposit) propertyData.security_deposit = parseFloat(formData.securityDeposit);
      if (formData.serviceCharge) propertyData.service_charge = parseFloat(formData.serviceCharge);
      if (formData.agreementCommission) propertyData.agreement_fee = parseFloat(formData.agreementCommission);
      if (formData.legalAgency) propertyData.legal_fee = parseFloat(formData.legalAgency);
      if (formData.floorLevel) propertyData.floor_level = formData.floorLevel === 'ground' ? 0 : formData.floorLevel === '1st' ? 1 : formData.floorLevel === '2nd' ? 2 : formData.floorLevel === '3rd' ? 3 : 4;
      if (formData.totalUnitsInBuilding) propertyData.total_units_in_building = parseInt(formData.totalUnitsInBuilding);
      // Text fields - skip 'none' values
      if (formData.livingRoom) propertyData.living_room = formData.livingRoom;
      if (formData.kitchenCabinets && formData.kitchenCabinets !== 'none') propertyData.kitchen_cabinets = formData.kitchenCabinets;
      if (formData.countertop) propertyData.countertop = formData.countertop;
      if (formData.heatExtractor) propertyData.heat_extractor = formData.heatExtractor;
      if (formData.storage && formData.storage !== 'none') propertyData.storage = formData.storage;
      if (formData.electricityType) propertyData.electricity_type = formData.electricityType;
      if (formData.generator && formData.generator !== 'none') propertyData.generator_type = formData.generator;
      if (formData.buildingCondition) propertyData.building_condition = formData.buildingCondition;
      if (formData.leaseDuration) propertyData.lease_terms = formData.leaseDuration;
      if (formData.availableFrom) propertyData.available_from = formData.availableFrom;
      if (formData.allowsPets) propertyData.allows_pets = formData.allowsPets;
      if (formData.tenantPreference) propertyData.tenant_preference = formData.tenantPreference;
      
      // Boolean fields - ALWAYS set these
      propertyData.dining_area = formData.diningArea === 'dedicated';
      propertyData.balcony_feature = formData.balcony === 'yes';
      propertyData.transformer = formData.transformer === 'dedicated';
      propertyData.water_supply = formData.waterSupply === 'borehole' || formData.waterSupply === 'treated';
      propertyData.internet_ready = formData.internetReady === 'fiber-ready' || formData.internetReady === 'cable-ready';
      propertyData.gated_compound = formData.gatedCompound === 'yes';
      propertyData.security_personnel = formData.security24_7 === 'yes';
      propertyData.cctv_surveillance = formData.cctv === 'full-coverage' || formData.cctv === 'common-areas';
      propertyData.pop_ceiling = formData.popCeiling === 'yes';
      propertyData.tiled_floors = formData.tiledFloors === 'yes';
      propertyData.certificate_of_occupancy = formData.certificateOfOccupancy === 'available';
      propertyData.deed_of_assignment = formData.deedOfAssignment === 'available';
      
      console.log('🔍 BOOLEAN FIELDS BEING SENT:', {
        dining_area: propertyData.dining_area,
        balcony_feature: propertyData.balcony_feature,
        transformer: propertyData.transformer,
        water_supply: propertyData.water_supply,
        internet_ready: propertyData.internet_ready,
        gated_compound: propertyData.gated_compound,
        security_personnel: propertyData.security_personnel,
        cctv_surveillance: propertyData.cctv_surveillance,
        pop_ceiling: propertyData.pop_ceiling,
        tiled_floors: propertyData.tiled_floors,
        certificate_of_occupancy: propertyData.certificate_of_occupancy,
        deed_of_assignment: propertyData.deed_of_assignment
      });
      
      // Numeric fields
      propertyData.parking_spaces = formData.parkingSpaces === 'none' || !formData.parkingSpaces ? 0 : formData.parkingSpaces === '3+' ? 3 : parseInt(formData.parkingSpaces) || 0;

      console.log('🔍 DEBUG: Property data being saved:', JSON.stringify(propertyData, null, 2));
      console.log('🔍 FULL DATA OBJECT:', propertyData);
      console.log('📊 Interior Features:', {
        living_room: propertyData.living_room,
        dining_area: propertyData.dining_area,
        kitchen_cabinets: propertyData.kitchen_cabinets,
        countertop: propertyData.countertop,
        heat_extractor: propertyData.heat_extractor,
        balcony_feature: propertyData.balcony_feature,
        storage: propertyData.storage
      });
      console.log('⚡ Utilities:', {
        electricity_type: propertyData.electricity_type,
        transformer: propertyData.transformer,
        generator_type: propertyData.generator_type,
        water_supply: propertyData.water_supply,
        internet_ready: propertyData.internet_ready
      });
      console.log('💰 Fees:', {
        security_deposit: propertyData.security_deposit,
        service_charge: propertyData.service_charge,
        agreement_fee: propertyData.agreement_fee,
        legal_fee: propertyData.legal_fee
      });
      console.log('👥 Tenant Preferences:', {
        allows_pets: propertyData.allows_pets,
        tenant_preference: propertyData.tenant_preference
      });

      if (editId) {
        const { error, data } = await supabase.from('properties').update(propertyData).eq('id', editId).select();
        if (error) throw error;
        console.log('✅ UPDATE SUCCESS - Data saved to database:', data);
        toast({ title: 'Success', description: 'Listing updated successfully!' });
      } else {
        const { error, data } = await supabase.from('properties').insert([propertyData]).select();
        if (error) throw error;
        console.log('✅ INSERT SUCCESS - Data saved to database:', data);
        toast({ title: 'Success', description: 'Listing created successfully!' });
      }
      navigate('/my-listings');
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error', description: 'Failed to create listing', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12 text-foreground">What type of property are you renting?</h1>
            <div className="space-y-4">
              {propertyTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setFormData(prev => ({ ...prev, propertyType: type.id }))}
                    className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                      formData.propertyType === type.id ? 'border-foreground bg-muted' : 'border-border hover:border-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={32} className="text-foreground" />
                      <div>
                        <div className="font-semibold text-lg text-foreground">{type.label}</div>
                        <div className="text-muted-foreground text-sm">{type.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12 text-foreground">What specific type?</h1>
            <div className="grid grid-cols-2 gap-4">
              {formData.propertyType && subTypes[formData.propertyType] ? subTypes[formData.propertyType].map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData(prev => ({ ...prev, propertySubType: type }))}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.propertySubType === type ? 'border-foreground bg-muted' : 'border-border hover:border-foreground'
                  }`}
                >
                  <div className="font-medium text-lg text-foreground">{type}</div>
                </button>
              )) : (
                <div className="col-span-2 text-center text-gray-500 py-12">
                  <p>Please select a property type first</p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Share some basics</h1>
            <div className="space-y-8">
              {[
                { label: 'Bedrooms', key: 'bedrooms' },
                { label: 'Bathrooms', key: 'bathrooms' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-6 border-b">
                  <span className="text-xl font-medium">{item.label}</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, [item.key]: Math.max(1, prev[item.key] - 1) }))}
                      className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-xl font-medium w-8 text-center">{formData[item.key]}</span>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, [item.key]: prev[item.key] + 1 }))}
                      className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="py-6 border-b">
                <label className="text-xl font-medium mb-4 block">Guest toilet?</label>
                <div className="flex gap-4">
                  {['yes', 'no'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData(prev => ({ ...prev, guestToilet: opt }))}
                      className={`flex-1 py-4 rounded-xl border-2 transition-all ${
                        formData.guestToilet === opt ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                      }`}
                    >
                      {opt === 'yes' ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-4">Where's your place located?</h1>
            <p className="text-gray-600 text-xl mb-8">Search for your address and the map will update automatically</p>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <label className="text-lg font-semibold mb-3 block">Search your address</label>
                <LocationInputWithMap
                  value={formData.locationData.detailedAddress}
                  onChange={(address) => {
                    setFormData(prev => ({
                      ...prev,
                      locationData: { ...prev.locationData, detailedAddress: address }
                    }));
                    setAddressConfirmed(false);
                  }}
                  onLocationChange={(locationData) => {
                    if (locationData.address) {
                      setFormData(prev => ({
                        ...prev,
                        locationData: {
                          ...prev.locationData,
                          detailedAddress: locationData.address
                        }
                      }));
                    }
                  }}
                  placeholder="Start typing your address..."
                />
                <p className="text-sm text-gray-500 mt-3">Your full address is only shared after booking</p>
              </div>
              
              {formData.locationData.detailedAddress && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setShowConfirmAddress(true);
                    }}
                    className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 border-2 border-gray-300"
                  >
                    {addressConfirmed ? 'Change Location' : 'Confirm Address'}
                  </button>
                </div>
              )}
              
              {addressConfirmed && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-green-700 font-semibold">✓ Address confirmed</p>
                  <p className="text-sm text-green-600 mt-1">Users will see: LGA, State</p>
                </div>
              )}
            </div>
            
            {showConfirmAddress && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold mb-4">Confirm Your Address</h2>
                  <p className="text-gray-600 mb-6">Verify the address you entered and select your location</p>
                  
                  <div className="bg-gray-50 p-4 rounded-xl mb-6 border-2 border-gray-200">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Address you entered:</label>
                    <p className="text-base font-medium text-gray-900">{formData.locationData.detailedAddress}</p>
                    <p className="text-xs text-gray-500 mt-2">This is what you typed. Now select your state and LGA below.</p>
                  </div>
                  
                  <div className="border-t-2 border-gray-200 pt-4">
                    <p className="text-sm font-semibold mb-4 text-gray-700">Select your location from dropdowns:</p>
                    <EnhancedLocationInput
                      onLocationChange={(locationData) => {
                        setFormData(prev => ({
                          ...prev,
                          locationData: {
                            ...prev.locationData,
                            stateId: locationData.stateId,
                            cityId: locationData.cityId,
                            areaId: locationData.areaId,
                            streetId: locationData.streetId || '',
                            landmarks: locationData.landmarks
                          }
                        }));
                      }}
                      initialData={{
                        stateId: formData.locationData.stateId,
                        cityId: formData.locationData.cityId,
                        areaId: formData.locationData.areaId,
                        streetId: formData.locationData.streetId,
                        detailedAddress: formData.locationData.detailedAddress,
                        landmarks: formData.locationData.landmarks
                      }}
                    />
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-xl mt-6">
                    <p className="text-sm font-semibold mb-1">What users will see on cards:</p>
                    <p className="text-lg font-medium">LGA, State</p>
                    <p className="text-xs text-gray-600 mt-1">Full address only shown after booking</p>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowConfirmAddress(false)}
                      className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setAddressConfirmed(true);
                        setShowConfirmAddress(false);
                      }}
                      className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Building information</h1>
            <div className="space-y-6">
              <div>
                <label className="text-xl font-medium mb-4 block">Which floor?</label>
                <div className="grid grid-cols-2 gap-3">
                  {['ground', '1st', '2nd', '3rd', '4th+'].map(floor => (
                    <button
                      key={floor}
                      onClick={() => setFormData(prev => ({ ...prev, floorLevel: floor }))}
                      className={`py-4 rounded-xl border-2 transition-all ${formData.floorLevel === floor ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
                    >
                      {floor === 'ground' ? 'Ground floor' : floor === '4th+' ? '4th or higher' : `${floor} floor`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xl font-medium mb-4 block">Total flats in building</label>
                <input
                  type="number"
                  value={formData.totalUnitsInBuilding}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalUnitsInBuilding: e.target.value }))}
                  className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none"
                  placeholder="e.g. 12"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Inside the house</h1>
            <div className="space-y-6">
              {[
                { label: 'Sitting room', key: 'livingRoom', options: [{ v: 'spacious', l: 'Very spacious' }, { v: 'well-lit', l: 'Bright & well-lit' }, { v: 'compact', l: 'Compact' }] },
                { label: 'Dining space', key: 'diningArea', options: [{ v: 'dedicated', l: 'Separate dining room' }, { v: 'combined', l: 'Part of sitting room' }, { v: 'none', l: 'No dining space' }] },
                { label: 'Kitchen cabinets', key: 'kitchenCabinets', options: [{ v: 'fitted', l: 'Has cabinets' }, { v: 'none', l: 'No cabinets' }] },
                { label: 'Kitchen counter', key: 'countertop', options: [{ v: 'granite', l: 'Granite' }, { v: 'marble', l: 'Marble' }, { v: 'laminate', l: 'Standard' }] },
                { label: 'Kitchen extractor', key: 'heatExtractor', options: [{ v: 'yes', l: 'Yes' }, { v: 'no', l: 'No' }] },
                { label: 'Balcony', key: 'balcony', options: [{ v: 'yes', l: 'Yes' }, { v: 'no', l: 'No' }] },
                { label: 'Store room', key: 'storage', options: [{ v: 'in-apartment', l: 'Inside house' }, { v: 'external', l: 'Outside house' }, { v: 'none', l: 'No store' }] }
              ].map(item => (
                <div key={item.key}>
                  <label className="text-xl font-medium mb-4 block">{item.label}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {item.options.map(opt => (
                      <button
                        key={opt.v}
                        onClick={() => setFormData(prev => ({ ...prev, [item.key]: opt.v }))}
                        className={`py-4 rounded-xl border-2 transition-all ${formData[item.key] === opt.v ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Light, water & services</h1>
            <div className="space-y-6">
              {[
                { label: 'Electricity type', key: 'electricityType', options: [{ v: 'public', l: 'NEPA/PHCN' }, { v: 'prepaid', l: 'Prepaid meter' }, { v: 'postpaid', l: 'Monthly bill' }] },
                { label: 'Transformer', key: 'transformer', options: [{ v: 'dedicated', l: 'Own transformer' }, { v: 'shared', l: 'Shared' }] },
                { label: 'Generator', key: 'generator', options: [{ v: 'estate-managed', l: 'Estate provides' }, { v: 'personal', l: 'Your own' }, { v: 'none', l: 'None' }] },
                { label: 'Water supply', key: 'waterSupply', options: [{ v: 'borehole', l: 'Borehole' }, { v: 'treated', l: 'Treated water' }, { v: 'public', l: 'Government' }] },
                { label: 'Internet', key: 'internetReady', options: [{ v: 'fiber-ready', l: 'Fiber ready' }, { v: 'cable-ready', l: 'Cable ready' }, { v: 'none', l: 'None' }] }
              ].map(item => (
                <div key={item.key}>
                  <label className="text-xl font-medium mb-4 block">{item.label}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {item.options.map(opt => (
                      <button
                        key={opt.v}
                        onClick={() => setFormData(prev => ({ ...prev, [item.key]: opt.v }))}
                        className={`py-4 rounded-xl border-2 transition-all ${formData[item.key] === opt.v ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Security & parking</h1>
            <div className="space-y-6">
              {[
                { label: 'Gated compound?', key: 'gatedCompound', options: [{ v: 'yes', l: 'Yes' }, { v: 'no', l: 'No' }] },
                { label: 'Security guard?', key: 'security24_7', options: [{ v: 'yes', l: 'Yes, 24/7' }, { v: 'no', l: 'No' }] },
                { label: 'CCTV cameras', key: 'cctv', options: [{ v: 'common-areas', l: 'Common areas' }, { v: 'full-coverage', l: 'Everywhere' }, { v: 'none', l: 'None' }] }
              ].map(item => (
                <div key={item.key}>
                  <label className="text-xl font-medium mb-4 block">{item.label}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {item.options.map(opt => (
                      <button
                        key={opt.v}
                        onClick={() => setFormData(prev => ({ ...prev, [item.key]: opt.v }))}
                        className={`py-4 rounded-xl border-2 transition-all ${formData[item.key] === opt.v ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <label className="text-xl font-medium mb-4 block">Parking spaces</label>
                <div className="grid grid-cols-2 gap-3">
                  {['1', '2', '3+', 'none'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData(prev => ({ ...prev, parkingSpaces: opt }))}
                      className={`py-4 rounded-xl border-2 transition-all ${formData.parkingSpaces === opt ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
                    >
                      {opt === 'none' ? 'No parking' : `${opt} ${opt === '1' ? 'space' : 'spaces'}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">House finishing</h1>
            <div className="space-y-6">
              {[
                { label: 'POP ceiling?', key: 'popCeiling', options: [{ v: 'yes', l: 'Yes' }, { v: 'no', l: 'No' }] },
                { label: 'Tiled floors?', key: 'tiledFloors', options: [{ v: 'yes', l: 'Yes' }, { v: 'no', l: 'No' }] },
                { label: 'Building condition', key: 'buildingCondition', options: [{ v: 'newly-built', l: 'Brand new' }, { v: 'renovated', l: 'Renovated' }, { v: 'good', l: 'Good' }] }
              ].map(item => (
                <div key={item.key}>
                  <label className="text-xl font-medium mb-4 block">{item.label}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {item.options.map(opt => (
                      <button key={opt.v} onClick={() => setFormData(prev => ({ ...prev, [item.key]: opt.v }))} className={`py-4 rounded-xl border-2 transition-all ${formData[item.key] === opt.v ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}>{opt.l}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 10:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Legal documents</h1>
            <div className="space-y-6">
              {[
                { label: 'Certificate of Occupancy', key: 'certificateOfOccupancy', options: [{ v: 'available', l: 'Available' }, { v: 'not-available', l: 'Not available' }] },
                { label: 'Deed of Assignment', key: 'deedOfAssignment', options: [{ v: 'available', l: 'Available' }, { v: 'not-available', l: 'Not available' }] }
              ].map(item => (
                <div key={item.key}>
                  <label className="text-xl font-medium mb-4 block">{item.label}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {item.options.map(opt => (
                      <button key={opt.v} onClick={() => setFormData(prev => ({ ...prev, [item.key]: opt.v }))} className={`py-4 rounded-xl border-2 transition-all ${formData[item.key] === opt.v ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}>{opt.l}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 11:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Add photos</h1>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gray-900 transition-all cursor-pointer">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
                }} 
                className="hidden" 
                id="photos" 
              />
              <label htmlFor="photos" className="cursor-pointer">
                <Upload size={64} className="mx-auto mb-4 text-gray-400" />
                <p className="text-xl font-medium">Click to upload photos</p>
                <p className="text-gray-500 mt-2">{formData.images.length} photos selected</p>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2">
                    <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 12:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Give your place a title</h1>
            <textarea value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full p-6 text-2xl border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none resize-none" rows={3} placeholder="Modern 3-bedroom apartment" maxLength={50} />
          </div>
        );

      case 13:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Create description</h1>
            <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full p-6 text-xl border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none resize-none" rows={8} placeholder="Share what makes your place special..." />
          </div>
        );

      case 14:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Set your price</h1>
            <div className="space-y-8">
              <div>
                <label className="text-xl font-medium mb-4 block">Rent type</label>
                <div className="grid grid-cols-2 gap-4">
                  {['monthly', 'annual'].map(type => (
                    <button 
                      key={type} 
                      onClick={() => setFormData(prev => ({ ...prev, rentType: type }))} 
                      className={`py-4 rounded-xl border-2 transition-all font-medium ${formData.rentType === type ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
                    >
                      {type === 'monthly' ? 'Monthly' : 'Annual'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xl font-medium mb-4 block">Rent amount</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400 pointer-events-none">₦</span>
                  <input 
                    type="text" 
                    value={formData.rentAmount ? parseInt(formData.rentAmount).toLocaleString() : ''} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData(prev => ({ ...prev, rentAmount: value }));
                    }} 
                    className="w-full pl-16 pr-6 py-6 text-3xl font-semibold border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none" 
                    placeholder="0" 
                  />
                </div>
                {formData.rentAmount && (
                  <p className="mt-3 text-gray-600 text-lg">Amount: ₦{parseInt(formData.rentAmount).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 15:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Tenant preferences</h1>
            <div className="space-y-6">
              <div>
                <label className="text-xl font-medium mb-4 block">Allow pets?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { v: 'yes', l: 'Yes, pets allowed' },
                    { v: 'no', l: 'No pets' },
                    { v: 'small-pets', l: 'Only small pets' }
                  ].map(opt => (
                    <button
                      key={opt.v}
                      onClick={() => setFormData(prev => ({ ...prev, allowsPets: opt.v }))}
                      className={`py-4 rounded-xl border-2 transition-all ${formData.allowsPets === opt.v ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xl font-medium mb-4 block">Preferred tenant type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { v: 'single', l: 'Single person' },
                    { v: 'couple', l: 'Couple' },
                    { v: 'small-family', l: 'Small family' },
                    { v: 'large-family', l: 'Large family' },
                    { v: 'professionals', l: 'Professionals' },
                    { v: 'students', l: 'Students' }
                  ].map(opt => (
                    <button
                      key={opt.v}
                      onClick={() => setFormData(prev => ({ ...prev, tenantPreference: opt.v }))}
                      className={`py-4 rounded-xl border-2 transition-all ${formData.tenantPreference === opt.v ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 16:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-12">Additional fees</h1>
            <div className="space-y-6">
              {[
                { label: 'Security deposit', key: 'securityDeposit', desc: 'Refundable deposit' },
                { label: 'Service charge', key: 'serviceCharge', desc: 'Monthly maintenance' },
                { label: 'Agreement & Commission', key: 'agreementCommission', desc: 'One-time fee' },
                { label: 'Legal & Agency', key: 'legalAgency', desc: 'Processing fee' }
              ].map(item => (
                <div key={item.key} className="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all">
                  <label className="text-xl font-semibold mb-1 block">{item.label}</label>
                  <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
                  <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400 pointer-events-none">₦</span>
                  <input 
                    type="text" 
                    value={formData[item.key] ? parseInt(formData[item.key]).toLocaleString() : ''} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData(prev => ({ ...prev, [item.key]: value }));
                    }} 
                    className="w-full pl-12 pr-4 py-4 text-xl font-semibold border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none bg-white" 
                    placeholder="0" 
                  />
                </div>
                  {formData[item.key] && (
                    <p className="mt-2 text-gray-600">Amount: ₦{parseInt(formData[item.key]).toLocaleString()}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 17:
        return (
          <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold mb-8">Review your listing</h1>
            <p className="text-gray-600 text-xl mb-12">Make sure everything looks good before publishing</p>
            
            <div className="space-y-6">
              {formData.images.length > 0 && (
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-xl mb-4">Photos ({formData.images.length})</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.slice(0, 6).map((img, i) => (
                      <img key={i} src={URL.createObjectURL(img)} alt="" className="w-full h-24 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-xl mb-4">Property Details</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Title:</span> <span className="font-medium">{formData.title || 'Not set'}</span></p>
                  <p><span className="text-gray-600">Type:</span> <span className="font-medium">{formData.propertySubType || 'Not set'}</span></p>
                  <p><span className="text-gray-600">Bedrooms:</span> <span className="font-medium">{formData.bedrooms}</span></p>
                  <p><span className="text-gray-600">Bathrooms:</span> <span className="font-medium">{formData.bathrooms}</span></p>
                  <p><span className="text-gray-600">Guest Toilet:</span> <span className="font-medium">{formData.guestToilet || 'Not set'}</span></p>
                  <p><span className="text-gray-600">Location:</span> <span className="font-medium">{formData.locationData.detailedAddress || 'Not set'}</span></p>
                </div>
              </div>
              
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-xl mb-4">Building Information</h3>
                <div className="space-y-2">
                  {formData.floorLevel && <p><span className="text-gray-600">Floor:</span> <span className="font-medium">{formData.floorLevel}</span></p>}
                  {formData.totalUnitsInBuilding && <p><span className="text-gray-600">Total Units:</span> <span className="font-medium">{formData.totalUnitsInBuilding}</span></p>}
                  {formData.buildingCondition && <p><span className="text-gray-600">Condition:</span> <span className="font-medium">{formData.buildingCondition}</span></p>}
                </div>
              </div>
              
              {(formData.livingRoom || formData.diningArea || formData.kitchenCabinets || formData.countertop || formData.heatExtractor || formData.balcony || formData.storage) && (
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-xl mb-4">Interior Features</h3>
                  <div className="space-y-2">
                    {formData.livingRoom && <p><span className="text-gray-600">Living Room:</span> <span className="font-medium">{formData.livingRoom}</span></p>}
                    {formData.diningArea && <p><span className="text-gray-600">Dining:</span> <span className="font-medium">{formData.diningArea}</span></p>}
                    {formData.kitchenCabinets && <p><span className="text-gray-600">Kitchen Cabinets:</span> <span className="font-medium">{formData.kitchenCabinets}</span></p>}
                    {formData.countertop && <p><span className="text-gray-600">Countertop:</span> <span className="font-medium">{formData.countertop}</span></p>}
                    {formData.heatExtractor && <p><span className="text-gray-600">Heat Extractor:</span> <span className="font-medium">{formData.heatExtractor}</span></p>}
                    {formData.balcony && <p><span className="text-gray-600">Balcony:</span> <span className="font-medium">{formData.balcony}</span></p>}
                    {formData.storage && <p><span className="text-gray-600">Storage:</span> <span className="font-medium">{formData.storage}</span></p>}
                  </div>
                </div>
              )}
              
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-xl mb-4">Utilities & Infrastructure</h3>
                <div className="space-y-2">
                  {formData.electricityType && <p><span className="text-gray-600">Electricity:</span> <span className="font-medium">{formData.electricityType}</span></p>}
                  {formData.transformer && <p><span className="text-gray-600">Transformer:</span> <span className="font-medium">{formData.transformer}</span></p>}
                  {formData.generator && <p><span className="text-gray-600">Generator:</span> <span className="font-medium">{formData.generator}</span></p>}
                  {formData.waterSupply && <p><span className="text-gray-600">Water Supply:</span> <span className="font-medium">{formData.waterSupply}</span></p>}
                  {formData.internetReady && <p><span className="text-gray-600">Internet:</span> <span className="font-medium">{formData.internetReady}</span></p>}
                </div>
              </div>
              
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-xl mb-4">Security & Parking</h3>
                <div className="space-y-2">
                  {formData.gatedCompound && <p><span className="text-gray-600">Gated:</span> <span className="font-medium">{formData.gatedCompound}</span></p>}
                  {formData.security24_7 && <p><span className="text-gray-600">Security:</span> <span className="font-medium">{formData.security24_7}</span></p>}
                  {formData.cctv && <p><span className="text-gray-600">CCTV:</span> <span className="font-medium">{formData.cctv}</span></p>}
                  {formData.parkingSpaces && <p><span className="text-gray-600">Parking:</span> <span className="font-medium">{formData.parkingSpaces}</span></p>}
                </div>
              </div>
              
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-xl mb-4">Finishing</h3>
                <div className="space-y-2">
                  {formData.popCeiling && <p><span className="text-gray-600">POP Ceiling:</span> <span className="font-medium">{formData.popCeiling}</span></p>}
                  {formData.tiledFloors && <p><span className="text-gray-600">Tiled Floors:</span> <span className="font-medium">{formData.tiledFloors}</span></p>}
                </div>
              </div>
              
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-xl mb-4">Legal Documents</h3>
                <div className="space-y-2">
                  {formData.certificateOfOccupancy && <p><span className="text-gray-600">C of O:</span> <span className="font-medium">{formData.certificateOfOccupancy}</span></p>}
                  {formData.deedOfAssignment && <p><span className="text-gray-600">Deed:</span> <span className="font-medium">{formData.deedOfAssignment}</span></p>}
                </div>
              </div>
              
              {(formData.allowsPets || formData.tenantPreference) && (
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-xl mb-4">Tenant Preferences</h3>
                  <div className="space-y-2">
                    {formData.allowsPets && <p><span className="text-gray-600">Allow Pets:</span> <span className="font-medium">{formData.allowsPets === 'yes' ? 'Yes, pets allowed' : formData.allowsPets === 'no' ? 'No pets' : 'Only small pets'}</span></p>}
                    {formData.tenantPreference && <p><span className="text-gray-600">Preferred Tenant:</span> <span className="font-medium capitalize">{formData.tenantPreference.replace('-', ' ')}</span></p>}
                  </div>
                </div>
              )}
              
              <div className="border-2 border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-xl mb-4">Pricing</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Rent ({formData.rentType}):</span> <span className="font-medium">₦{formData.rentAmount ? parseInt(formData.rentAmount).toLocaleString() : '0'}</span></p>
                  {formData.securityDeposit && <p><span className="text-gray-600">Security Deposit:</span> <span className="font-medium">₦{parseInt(formData.securityDeposit).toLocaleString()}</span></p>}
                  {formData.serviceCharge && <p><span className="text-gray-600">Service Charge:</span> <span className="font-medium">₦{parseInt(formData.serviceCharge).toLocaleString()}</span></p>}
                  {formData.agreementCommission && <p><span className="text-gray-600">Agreement Fee:</span> <span className="font-medium">₦{parseInt(formData.agreementCommission).toLocaleString()}</span></p>}
                  {formData.legalAgency && <p><span className="text-gray-600">Legal Fee:</span> <span className="font-medium">₦{parseInt(formData.legalAgency).toLocaleString()}</span></p>}
                  <div className="pt-3 mt-3 border-t-2 border-gray-300">
                    <p className="text-lg"><span className="text-gray-900 font-semibold">Total Initial Payment:</span> <span className="font-bold text-primary">₦{(
                      parseInt(formData.rentAmount || '0') +
                      parseInt(formData.securityDeposit || '0') +
                      parseInt(formData.serviceCharge || '0') +
                      parseInt(formData.agreementCommission || '0') +
                      parseInt(formData.legalAgency || '0')
                    ).toLocaleString()}</span></p>
                  </div>
                </div>
              </div>
              
              {formData.description && (
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-xl mb-4">Description</h3>
                  <p className="text-gray-700">{formData.description}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 mx-8">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-foreground transition-all" style={{ width: `${(step / 17) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-20 pb-32">{renderStep()}</div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => step > 1 && setStep(step - 1)} className="px-6 py-3 font-medium underline" disabled={loading}>Back</button>
          <button 
            onClick={() => step < 17 ? setStep(step + 1) : handleSubmit()} 
            disabled={loading || !canProceed()}
            className="px-8 py-3 bg-primary text-white font-medium rounded-lg disabled:opacity-50"
          >
            {loading ? 'Updating...' : step === 17 ? (editId ? 'Update' : 'Publish') : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewRentListingForm;

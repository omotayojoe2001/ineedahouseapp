import { supabase } from '@/integrations/supabase/client';

export interface State {
  id: string;
  name: string;
  code: string;
}

export interface City {
  id: string;
  name: string;
  state_id: string;
}

export interface Area {
  id: string;
  name: string;
  city_id: string;
}

export interface Street {
  id: string;
  name: string;
  area_id: string;
}

export interface Landmark {
  id: string;
  name: string;
  description?: string;
  area_id: string;
  landmark_type: string;
}

export class LocationService {
  // Get all states
  static async getStates(): Promise<State[]> {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Get cities by state
  static async getCitiesByState(stateId: string): Promise<City[]> {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('state_id', stateId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Get areas by city
  static async getAreasByCity(cityId: string): Promise<Area[]> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('city_id', cityId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Get streets by area
  static async getStreetsByArea(areaId: string): Promise<Street[]> {
    const { data, error } = await supabase
      .from('streets')
      .select('*')
      .eq('area_id', areaId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Get landmarks by area
  static async getLandmarksByArea(areaId: string): Promise<Landmark[]> {
    const { data, error } = await supabase
      .from('landmarks')
      .select('*')
      .eq('area_id', areaId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  // Add new city (if not exists)
  static async addCity(name: string, stateId: string): Promise<City> {
    const { data, error } = await supabase
      .from('cities')
      .insert({ name, state_id: stateId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Add new area (if not exists)
  static async addArea(name: string, cityId: string): Promise<Area> {
    const { data, error } = await supabase
      .from('areas')
      .insert({ name, city_id: cityId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Add new street (if not exists)
  static async addStreet(name: string, areaId: string): Promise<Street> {
    const { data, error } = await supabase
      .from('streets')
      .insert({ name, area_id: areaId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Add new landmark (if not exists)
  static async addLandmark(name: string, areaId: string, landmarkType: string = 'general'): Promise<Landmark> {
    const { data, error } = await supabase
      .from('landmarks')
      .insert({ name, area_id: areaId, landmark_type: landmarkType })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Search locations for autocomplete
  static async searchLocations(query: string) {
    const { data: areas, error: areasError } = await supabase
      .from('areas')
      .select(`
        *,
        cities!inner(name, states!inner(name))
      `)
      .ilike('name', `%${query}%`)
      .limit(10);

    const { data: landmarks, error: landmarksError } = await supabase
      .from('landmarks')
      .select(`
        *,
        areas!inner(name, cities!inner(name, states!inner(name)))
      `)
      .ilike('name', `%${query}%`)
      .limit(10);

    if (areasError || landmarksError) {
      throw areasError || landmarksError;
    }

    return {
      areas: areas || [],
      landmarks: landmarks || []
    };
  }
}
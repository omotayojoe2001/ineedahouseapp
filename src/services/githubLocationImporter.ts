// GitHub Location Data Importer
// Fetches comprehensive Nigerian location data from multiple sources

export interface NigerianLocationData {
  states: Array<{
    name: string;
    code?: string;
    capital?: string;
    latitude?: number;
    longitude?: number;
    lgas: string[];
  }>;
}

export class GitHubLocationImporter {
  
  // Multiple data sources for reliability
  static dataSources = [
    {
      name: 'temikeezy/nigeria-geojson-data (full.json)',
      url: 'https://raw.githubusercontent.com/temikeezy/nigeria-geojson-data/main/data/full.json',
      format: 'full'
    },
    {
      name: 'temikeezy/nigeria-geojson-data (lgas.json)',
      url: 'https://raw.githubusercontent.com/temikeezy/nigeria-geojson-data/main/data/lgas.json',
      format: 'lgas'
    },
    {
      name: 'devcenter-square/states-cities API',
      url: 'http://states-and-cities.com/api/v1/states',
      format: 'api'
    }
  ];

  // Fetch from GitHub/API
  static async fetchData(source: any) {
    try {
      console.log(`🔄 Fetching from ${source.name}...`);
      const response = await fetch(source.url);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      console.log(`✅ Successfully fetched from ${source.name}`);
      
      return { data, format: source.format };
    } catch (error) {
      console.error(`❌ Failed to fetch from ${source.name}:`, error);
      return null;
    }
  }

  // Convert different formats to standard format
  static async normalizeData(rawData: any, format: string) {
    switch (format) {
      case 'full':
        // Format: [{ "state": "Lagos", "lgas": [{ "name": "Ikeja", "wards": [...] }] }]
        return rawData.map((state: any) => ({
          name: state.state,
          code: this.getStateCode(state.state),
          lgas: state.lgas.map((lga: any) => lga.name)
        }));
        
      case 'lgas':
        // Format: { "Lagos": ["Ikeja", "Lagos Island", ...] }
        return Object.entries(rawData).map(([stateName, lgas]) => ({
          name: stateName,
          code: this.getStateCode(stateName),
          lgas: lgas as string[]
        }));
        
      case 'api':
        // Format: [{ "name": "Lagos", "capital": "Ikeja", ... }]
        const statesWithLgas = [];
        for (const state of rawData) {
          try {
            const lgasResponse = await fetch(`http://states-and-cities.com/api/v1/state/${state.name.toLowerCase()}/lgas`);
            const lgas = lgasResponse.ok ? await lgasResponse.json() : [];
            
            statesWithLgas.push({
              name: state.name,
              code: this.getStateCode(state.name),
              capital: state.capital,
              latitude: state.latitude,
              longitude: state.longitude,
              lgas: lgas.map((lga: any) => lga.name)
            });
          } catch (error) {
            console.error(`Error fetching LGAs for ${state.name}:`, error);
          }
        }
        return statesWithLgas;
        
      default:
        return rawData;
    }
  }

  // Get state code from name
  static getStateCode(stateName: string): string {
    const codes: { [key: string]: string } = {
      'Abia': 'AB', 'Adamawa': 'AD', 'Akwa Ibom': 'AK', 'Anambra': 'AN',
      'Bauchi': 'BA', 'Bayelsa': 'BY', 'Benue': 'BE', 'Borno': 'BO',
      'Cross River': 'CR', 'Delta': 'DE', 'Ebonyi': 'EB', 'Edo': 'ED',
      'Ekiti': 'EK', 'Enugu': 'EN', 'FCT': 'FC', 'Gombe': 'GO',
      'Imo': 'IM', 'Jigawa': 'JI', 'Kaduna': 'KD', 'Kano': 'KN',
      'Katsina': 'KT', 'Kebbi': 'KE', 'Kogi': 'KO', 'Kwara': 'KW',
      'Lagos': 'LA', 'Nasarawa': 'NA', 'Niger': 'NI', 'Ogun': 'OG',
      'Ondo': 'ON', 'Osun': 'OS', 'Oyo': 'OY', 'Plateau': 'PL',
      'Rivers': 'RI', 'Sokoto': 'SO', 'Taraba': 'TA', 'Yobe': 'YO',
      'Zamfara': 'ZA'
    };
    return codes[stateName] || stateName.substring(0, 2).toUpperCase();
  }

  // Try multiple sources until one works
  static async fetchLocationData(): Promise<NigerianLocationData | null> {
    for (const source of this.dataSources) {
      const result = await this.fetchData(source);
      
      if (result) {
        const normalizedData = await this.normalizeData(result.data, result.format);
        
        if (this.validateData(normalizedData)) {
          console.log(`✅ Successfully processed data from ${source.name}`);
          return { states: normalizedData };
        }
      }
    }
    
    console.log('❌ All sources failed, using fallback data');
    return this.getFallbackData();
  }

  // Validate data structure
  static validateData(data: any[]): boolean {
    return (
      Array.isArray(data) && 
      data.length >= 30 && // Should have 36+ states
      data[0].name && 
      Array.isArray(data[0].lgas)
    );
  }

  // Import to database
  static async importToDatabase(locationData: NigerianLocationData) {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      console.log(`🔄 Importing ${locationData.states.length} states...`);
      
      for (const state of locationData.states) {
        // Get or create state
        let stateRecord;
        const { data: existingState } = await supabase
          .from('states')
          .select('*')
          .eq('name', state.name)
          .single();

        if (existingState) {
          stateRecord = existingState;
          console.log(`✅ Found existing state: ${state.name}`);
        } else {
          const { data: newState, error: stateError } = await supabase
            .from('states')
            .insert({ 
              name: state.name, 
              code: state.code || this.getStateCode(state.name)
            })
            .select()
            .single();

          if (stateError) {
            console.error(`Error inserting state ${state.name}:`, stateError);
            continue;
          }
          stateRecord = newState;
          console.log(`✅ Created new state: ${state.name}`);
        }

        // Import LGAs for this state
        let importedCount = 0;
        for (const lga of state.lgas) {
          const { data: existingLga } = await supabase
            .from('cities')
            .select('id')
            .eq('name', lga)
            .eq('state_id', stateRecord.id)
            .single();

          if (!existingLga) {
            const { error: lgaError } = await supabase
              .from('cities')
              .insert({
                name: lga,
                state_id: stateRecord.id
              });

            if (!lgaError) {
              importedCount++;
            } else {
              console.error(`Error inserting LGA ${lga}:`, lgaError);
            }
          }
        }

        console.log(`✅ ${state.name}: ${importedCount} new LGAs imported (${state.lgas.length} total)`);
      }

      const totalLgas = locationData.states.reduce((sum, state) => sum + state.lgas.length, 0);
      console.log(`🎉 Import completed! ${locationData.states.length} states and ${totalLgas} LGAs processed!`);
      return true;
    } catch (error) {
      console.error('❌ Error importing to database:', error);
      return false;
    }
  }

  // Fallback data
  static getFallbackData(): NigerianLocationData {
    return {
      states: [
        {
          name: 'Lagos',
          code: 'LA',
          lgas: ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere']
        },
        {
          name: 'FCT',
          code: 'FC',
          lgas: ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council']
        }
      ]
    };
  }

  // Main import function
  static async importNigerianLocations() {
    console.log('🚀 Starting comprehensive Nigerian location import...');
    
    const locationData = await this.fetchLocationData();
    if (!locationData) {
      console.error('❌ Failed to fetch location data');
      return false;
    }

    const totalLgas = locationData.states.reduce((sum, state) => sum + state.lgas.length, 0);
    console.log(`📊 Found ${locationData.states.length} states and ${totalLgas} LGAs`);
    
    const success = await this.importToDatabase(locationData);
    
    if (success) {
      console.log('🎉 Location import completed successfully!');
    } else {
      console.log('❌ Location import failed');
    }
    
    return success;
  }
}

// Usage example:
// GitHubLocationImporter.importNigerianLocations();
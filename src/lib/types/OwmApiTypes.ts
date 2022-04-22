export type CoordsType = {
  lat: string,
  lon: string,
}

export type GeoOptsType = {
  q: string;
  limit?: string;
}
export type OneCallOptsType = {
  lat: string;
  lon: string;
  exclude?: string;
  units?: 'standard'|'metric'|'imperial';
  lang?: string;
}

export interface GeoResponseInterface {
  lat: number;
  lon: number;
  country: string;
  name: string;
  local_names?: {
    ru?: string;
    en?: string;
  }
}

export interface OneCallResponseInterface {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    clouds: number;
    dew_point: number;
    dt: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    sunrise: number;
    sunset: number;
    temp: number;
    uvi: number;
    visibility: number;
    weather:[
      {
        description: string;
        icon: string;
        id: number
        main: string;
      }
    ]
    wind_deg: number;
    wind_gust: number;
    wind_speed: number;
  };
  daily: {
    clouds: number;
    dew_point: number;
    dt: number;
    feels_like: {
      day: number, 
      night: number, 
      eve: number, 
      morn: number
    }
    humidity: number;
    moon_phase: number;
    moonrise: number;
    moonset: number;
    pop: number;
    pressure: number;
    sunrise: number;
    sunset: number;
    temp: {
      day: number, 
      night: number, 
      eve: number, 
      morn: number, 
      min: number, 
      max: number
    }
    uvi: number;
    weather: [
      {
        description: string;
        icon: string;
        id: number
        main: string;
      }
    ]
    wind_deg: number;
    wind_gust: number;
    wind_speed: number;
  }[];
}
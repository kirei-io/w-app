export interface WeatherAppInterace {
  timezoneOffset: number;
  location: 			LocationType;
  current: 				WeatherDetailsInterface;
  daily: 					WeatherDetailsInterface[];
}

export interface WeatherDetailsInterface {
  dt: number;
  temperature: { min?: number, max?: number, current?: number};
  weatherId: number;
  pressure?: number;
  humidity?: number;
  wind?: {
    speed: number;
    direction: string;
  }
}

export type LocationType = {
  city: {
    ru: string,
    en: string,
  }
  country: string,
}
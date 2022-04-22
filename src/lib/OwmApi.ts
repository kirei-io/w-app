import type { 
  GeoOptsType, 
  GeoResponseInterface, 
  OneCallOptsType, 
  OneCallResponseInterface, 
  CoordsType 
} from "./types/OwmApiTypes";
import type { LocationType } from "./types/WeatherAppInterface";


export async function getWeather(city: string) {
  const owm = new OwmApi('181b73277597dc1293fdca01011e0b81');
  const geo = await owm.geo({ q: city });
  const weather = await  owm.oneCall({
    ...OwmApi.geoToCoords(geo),
    exclude: 'minutely,hourly,alerts',
    units: 'metric',
    lang: 'en',
  });
  
  return {
    weatherResponse: weather,
    location: OwmApi.geoToLocation(geo),
  }
}

export class OwmApi {
  private readonly baseUrl = 'http://api.openweathermap.org/';
  private readonly endpoint = {
    geo: 'geo/1.0/direct',
    oneCall: 'data/2.5/onecall',
  }
  private readonly appid: ['appid', string];

  public constructor(appid: string) {
    this.appid = ['appid', appid];
  }

  private async request<T>(
    endpoint: string, 
    opts: Record<string, string>
  ): Promise<T> {
    const params = this.optsToParams(opts);
    return fetch(this.baseUrl+endpoint+'?'+params.toString())
      .then(async response=>{
        if(!response.ok) {
          const errData = await response.json() as {message: string, cod: number};
          if(errData) throw new OwmApiError(errData.cod, errData.message);
          throw new Error(response.statusText);
        }
        return response.json()
      })
  }
  private optsToParams(opts: Record<string, string>): URLSearchParams {
    const params = new URLSearchParams([this.appid]);
    for (const name in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, name)) {
        const value = opts[name];
        if(value) params.set(name, value);
      }
    }
    return params;
  }
  public geo = async (
    opts: GeoOptsType
  ) => this.request<GeoResponseInterface[]>(this.endpoint.geo, opts)
    .then(response=>{
      if(!response.length) throw new OwmApiError(400, 'location '+opts.q+' is not find');
      return response;
    });

  public oneCall = async (
    opts: OneCallOptsType
  ) => this.request<OneCallResponseInterface>(this.endpoint.oneCall, opts);
  
  public static geoToLocation(
    geo: GeoResponseInterface[]
  ): LocationType {
    return {
        city: { 
          ru: geo[0].local_names?.ru ?? geo[0].name, 
          en: geo[0].local_names?.en ?? geo[0].name
        },
        country: geo[0].country,
    }
  }

  public static geoToCoords(
    geo: GeoResponseInterface[]
  ): CoordsType {
    return {
        lat: geo[0].lat.toString(),
        lon: geo[0].lon.toString(),
    }
  }

}

export class OwmApiError extends Error {
  constructor(
    public readonly cod: number, 
    message: string
  ) {
    super(message)
  }
}
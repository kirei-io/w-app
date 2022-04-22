import { getWeather } from "./OwmApi";
import type { OneCallResponseInterface } from "./types/OwmApiTypes";
import type { WeatherAppInterace, LocationType, WeatherDetailsInterface } from "./types/WeatherAppInterface";
import { Units } from "./Units";


export class Weather implements WeatherAppInterace {
  private constructor(
    public readonly location: LocationType,
    private readonly weatherResponse: OneCallResponseInterface,
  ) {
    console.log(this);
  }

  public static async create(city: string): Promise<Weather> {
    return getWeather(city)
      .then(response=>new Weather(response.location, response.weatherResponse))
  }

  public static example(): WeatherAppInterace {
    const daily: Weather['daily'] = [];
    for (let index = 0; index < 8; index++) {
      daily.push(
        {
          dt: Date.now(),
          temperature: {
            min: 1,
            max: 2,
          },
          weatherId: index%2 ? 800 : 802
        }
      )
    }

    return {
      location: {
        city: {
          ru: '',
          en: '',
        },
        country: '',
      },
      current: {
        dt: Date.now(),
        weatherId: 800,
        temperature: {
          current: 0
        },
        humidity: 0,
        pressure: 0,
        wind: {
          direction: 's',
          speed: 0
        },
      },
      timezoneOffset: 0,
      daily
    }
  }

  public get timezoneOffset() {
    return this.weatherResponse.timezone_offset;
  }

  public get current(): WeatherDetailsInterface {
    return {
      dt: this.weatherResponse.current.dt*1000,
      temperature: {
        current: Math.round(this.weatherResponse.current.temp),
      },
      wind: {
        direction: Units.deg_to_direction(this.weatherResponse.current.wind_deg),
        speed: Math.round(this.weatherResponse.current.wind_speed*10)/10,
      },
      humidity: this.weatherResponse.current.humidity,
      pressure: Math.round(Units.hPa_to_mmHg(this.weatherResponse.current.pressure)),
      weatherId: this.weatherResponse.current.weather[0].id,
    }
  }

  public get daily(): WeatherDetailsInterface[] {
    return this.weatherResponse.daily.map(forecast => {
      return {
        dt: forecast.dt*1000,
        temperature: {
          min: Math.round(forecast.temp.min),
          max: Math.round(forecast.temp.max),
        },
        weatherId: forecast.weather[0].id,
      }
    })
  }
}

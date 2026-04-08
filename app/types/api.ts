export interface ShouldISurfApiResponse {
  response: string;
  weatherData: {
    time: string;
    weatherCode: number;
    location: {
      name: string;
      lat: number;
      lon: number;
    };
    temperature: {
      value: number;
      unit: string;
    };
    wind: {
      speed: number;
      speedUnit: string;
      direction: string;
      directionDegrees: number;
    };
    waves: {
      height: number;
      heightUnit: string;
      direction: string;
      directionDegrees: number;
    };
    swell: {
      height: number;
      heightUnit: string;
      direction: string;
      directionDegrees: number;
    };
    tide: {
      height: number;
      heightUnit: string;
    };
  };
};

export interface ApiLocation {
  name: string;
  lat: number;
  lon: number;
  distanceFromUserKm?: number;
}

export interface LocationsApiResponse {
  locations: ApiLocation[];
}
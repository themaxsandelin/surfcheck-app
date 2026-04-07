export interface ShouldISurfApiResponse {
  response: string;
  weatherData: {
    time: string;
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
    };
    waves: {
      height: number;
      heightUnit: string;
      direction: string;
    };
    swell: {
      height: number;
      heightUnit: string;
      direction: string;
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
  distanceFromUser?: string;
}

export interface LocationsApiResponse {
  locations: ApiLocation[];
}
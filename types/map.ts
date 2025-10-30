export interface Coordinate {
    latitude: number;
    longitude: number;
}

export type CountryPolygon = Coordinate[];
export type CountryPolygons = CountryPolygon[];

export interface CountryCoordinates {
    [countryName: string]: CountryPolygons;
}
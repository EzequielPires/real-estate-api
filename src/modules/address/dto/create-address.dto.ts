import { Property } from "src/modules/properties/entities/property.entity";
import { Address } from "../entities/address.entity";
import { City } from "../entities/city.entity";
import { District } from "../entities/district.entity";
import { State } from "../entities/state.entity";

export class CreateAddressDto {
    id?: string;
    nation?: string;
    state: State;
    city: City;
    district: District;
    route?: string;
    complement?: string;
    number?: number;
    zipcode?: string;
    place_id?: string;
    formatted_address?: string;
    location?: any;
    property?: Property;
}

export class CreateStateDto {
    id: number;
    name: string;
    shortName: string;
    region: string;
    cities: City[];
    addresses: Address[];
}

export class CreateCityDto {
    id: number;
    ibgeId: number;
    apiId: number;
	name: string;
    state: State;
    districts: District[];
    addresses: Address[];
}

export class CreateDistrictDto {
    id: number;
    apiId: number;
    name: string;
    city: City;
    addresses: Address[];
}

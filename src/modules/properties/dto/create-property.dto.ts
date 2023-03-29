import { AdType } from "src/enums/property.enum";
import { Address } from "src/modules/address/entities/address.entity";
import { Detail } from "src/modules/details/entities/detail.entity";
import { PropertyType } from "src/modules/property-types/entities/property-type.entity";
import { User } from "src/modules/users/entities/user.entity";
import { IDetail } from "../entities/property.entity";

export class CreatePropertyDto {
    id?: number;
    adType: AdType;
    numberRooms: number;
    numberBathroom: number;
    numberSuite: number;
    numberGarage: number;
    description: string;
    price: string;
    condominium: string;
    iptu: string;
    exemptIptu: boolean;
    usefulArea: number;
    totalArea: number;
    images: Array<string>;
    type: PropertyType;
    address: Address;
    pickup: User;
    owner: User;
    favorites: User;
    details: Detail[];
}

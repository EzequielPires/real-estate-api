import { Property } from "src/modules/properties/entities/property.entity";
import { User } from "src/modules/users/entities/user.entity";

export class CreateRentalContractDto {
    id: number;
    price: string;
    start: Date;
    end: Date;
    fineDelay: number;
    earlyTerminationFine: number;
    property: Property;
    owner: User;
    locator: User;
    tenant: User;
}

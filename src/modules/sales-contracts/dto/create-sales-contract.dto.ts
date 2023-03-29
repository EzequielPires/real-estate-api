import { Property } from "src/modules/properties/entities/property.entity";
import { User } from "src/modules/users/entities/user.entity";

export class CreateSalesContractDto {
    id?: number;
    price?: string;
    paymentForm?: string;
    property?: Property;
    owner?: User;
    buyer?: User;
    seller?: User;
    date?: Date;
}

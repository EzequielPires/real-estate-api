import { LeadType } from "src/enums/property.enum";
import { Property } from "src/modules/properties/entities/property.entity";
import { User } from "src/modules/users/entities/user.entity";

export class CreateLeadDto {
    id?: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    realtor?: User;
    property?: Property;
    type?: LeadType;

    //financing
    nance?: Date;
    document?: string;
    monthlyIncome?: string;
    married?: boolean;
    propertyPrice?: string;
    prohibited?: string;
    financingTime?: string;

    //visit
    time?: Date;
    date?: Date;
}

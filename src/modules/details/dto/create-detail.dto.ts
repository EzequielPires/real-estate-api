import { DetailType } from "src/enums/property.enum";

export class CreateDetailDto {
    id: number;
    name: string;
    slug: string;
    type: DetailType;
}

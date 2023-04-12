import { Banner } from "src/modules/banners/entities/banner.entity";

export class CreateBannerTypeDto {
    id?: number;
    name: string;
    width?: number;
    height?: number;
    banners: Banner[];
}

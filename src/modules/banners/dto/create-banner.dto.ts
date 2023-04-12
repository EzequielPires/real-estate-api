import { BannerType } from "src/modules/banner-types/entities/banner-type.entity";
import { Banner } from "../entities/banner.entity";

export class CreateBannerDto {
    id?: number;
    name: string;
    path: string;   
    link?: string;
    bannerType: BannerType;
}

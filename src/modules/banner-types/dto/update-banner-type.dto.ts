import { PartialType } from '@nestjs/swagger';
import { CreateBannerTypeDto } from './create-banner-type.dto';

export class UpdateBannerTypeDto extends PartialType(CreateBannerTypeDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateDetailDto } from './create-detail.dto';

export class UpdateDetailDto extends PartialType(CreateDetailDto) {}

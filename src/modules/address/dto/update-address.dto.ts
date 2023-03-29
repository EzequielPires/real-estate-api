import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto, CreateCityDto, CreateDistrictDto, CreateStateDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
export class UpdateCityDto extends PartialType(CreateCityDto) {}
export class UpdateStateDto extends PartialType(CreateStateDto) {}
export class UpdateDistrictDto extends PartialType(CreateDistrictDto) {}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateCityDto, CreateDistrictDto, CreateStateDto } from './dto/create-address.dto';
import { FindAddressDto } from './dto/find-address.dto';
import { UpdateAddressDto, UpdateCityDto, UpdateDistrictDto, UpdateStateDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@ApiTags('address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  //Create Data

  @Post()
  create(@Body() createAddressDto: Address) {
    return this.addressService.create(createAddressDto);
  }

  @Post('states')
  createState(@Body() createStateDto: CreateStateDto) {
    return this.addressService.createState(createStateDto);
  }
  
  @Post('cities')
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.addressService.createCity(createCityDto);
  }
  
  @Post('districts')
  createDistrict(@Body() createDistrictDto: CreateDistrictDto) {
    return this.addressService.createDistrict(createDistrictDto);
  }

  //Update Data

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Patch('states/:id')
  updateState(@Param('id') id: number, @Body() updateStateDto: UpdateStateDto) {
    return this.addressService.updateState(id, updateStateDto);
  }
  
  @Patch('cities/:id')
  updateCity(@Param('id') id: number, @Body() updateCityDto: UpdateCityDto) {
    return this.addressService.updateCity(id, updateCityDto);
  }
  
  @Post('districts/:id')
  updateDistrict(@Param('id') id: number, @Body() updateDistrictDto: UpdateDistrictDto) {
    return this.addressService.updateDistrict(id, updateDistrictDto);
  }

  //Remove Data

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.addressService.remove(id);
  }

  @Delete('states/:id')
  removeState(@Param('id') id: number) {
    return this.addressService.remove(id);
  }
  
  @Delete('cities/:id')
  removeCity(@Param('id') id: number) {
    return this.addressService.remove(id);
  }
  
  @Delete('districts/:id')
  removeDistrict(@Param('id') id: number) {
    return this.addressService.remove(id);
  }

  //Find Data

  @Get()
  findAddress() {
    return this.addressService.findAll();
  }

  @Get('states')
  findStates() {
    return this.addressService.findStates();
  }

  @Get('states/:id/cities')
  findCitiesByState(@Param('id') id: number) {
    return this.addressService.findCitiesByState(id);
  }
  
  @Get('cities/:id/districts')
  findDistrictsCity(@Param('id') id: number) {
    return this.addressService.findDistrictsByCity(id);
  }

  @Get('cities')
  findCities() {
    return this.addressService.findCities();
  }

  @Get('districts')
  findDistricts() {
    return this.addressService.findDistricts();
  }


  @Post('districts')
  findDistrictsByCity(@Body() data: { city: string }) {
    return this.addressService.findDistrictsByCity(+data.city);
  }

  @Get('tags')
  findTags(@Query() query: FindAddressDto): Promise<any> {
    return this.addressService.findTags(query);
  }

  //Outhers

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }
}

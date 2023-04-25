import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { PropertyTypesService } from './property-types.service';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { UserAdminGuard } from 'src/auth/guards/user-admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('property-types')
export class PropertyTypesController {
  constructor(private readonly propertyTypesService: PropertyTypesService) {}

  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Post()
  create(@Body() createPropertyTypeDto: CreatePropertyTypeDto) {
    return this.propertyTypesService.create(createPropertyTypeDto);
  }

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll() {
    return this.propertyTypesService.findAll();
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyTypesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyTypeDto: UpdatePropertyTypeDto) {
    return this.propertyTypesService.update(+id, updatePropertyTypeDto);
  }

  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyTypesService.remove(+id);
  }
}

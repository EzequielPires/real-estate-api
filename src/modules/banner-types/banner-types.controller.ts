import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BannerTypesService } from './banner-types.service';
import { CreateBannerTypeDto } from './dto/create-banner-type.dto';
import { UpdateBannerTypeDto } from './dto/update-banner-type.dto';

@Controller('banner-types')
export class BannerTypesController {
  constructor(private readonly bannerTypesService: BannerTypesService) {}

  @Post()
  create(@Body() createBannerTypeDto: CreateBannerTypeDto) {
    return this.bannerTypesService.create(createBannerTypeDto);
  }

  @Get()
  findAll() {
    return this.bannerTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannerTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBannerTypeDto: UpdateBannerTypeDto) {
    return this.bannerTypesService.update(+id, updateBannerTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannerTypesService.remove(+id);
  }
}

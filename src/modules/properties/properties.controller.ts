import { Controller, Get, Post, Body, Patch, Param, Delete, Query, CacheKey } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FindPropertyDto } from './dto/find-property.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName } from 'src/helpers/string';
import { compressImage } from 'src/helpers/compress';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(@Query() query: FindPropertyDto) {
    return this.propertiesService.findAll(query);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('code/:id')
  findOneByCode(@Param('id') code: string) {
    return this.propertiesService.findOneByCode(code);
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(+id);
  }

  @Patch(':id/emphasis')
  async changeEmphasis(@Param('id') id: string, @Body() body: UpdatePropertyDto) {
    return await this.propertiesService.changeEmphasis(+id, {
      emphasis: body.emphasis
    });
  }
  
  @Patch(':id/status')
  async changeStatus(@Param('id') id: string, @Body() body: UpdatePropertyDto) {
    return await this.propertiesService.changeStatus(+id, {
      status: body.status
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(+id);
  }

  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './storage/temp',
      filename: editFileName
    })
  }))
  @Post('upload/images/:id')
  async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const path = await compressImage(file);
    return await this.propertiesService.uploadImage(+id, path)
  }

  @Post('order/images/:id')
  async orderImage(@Param('id') id: string, @Body() body: {images: Array<string>}) {
    return await this.propertiesService.orderImages(+id, body.images);
  }

  @Post('remove/images/:id')
  async removeImage(@Param('id') id: string, @Body() {path}: {path: string}) {
    return await this.propertiesService.removeImage(+id, path);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RentalContractsService } from './rental-contracts.service';
import { CreateRentalContractDto } from './dto/create-rental-contract.dto';
import { UpdateRentalContractDto } from './dto/update-rental-contract.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserAdminGuard } from 'src/auth/guards/user-admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/helpers/string';
import { compressImage } from 'src/helpers/compress';

@UseGuards(JwtAuthGuard, UserAdminGuard)
@Controller('rental-contracts')
export class RentalContractsController {
  constructor(private readonly rentalContractsService: RentalContractsService) {}

  @Post()
  create(@Body() createRentalContractDto: CreateRentalContractDto) {
    return this.rentalContractsService.create(createRentalContractDto);
  }

  @Get()
  findAll() {
    return this.rentalContractsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentalContractsService.findOne(+id);
  }

  @Patch(':id/generate-document')
  generateDocument(@Param('id') id: string) {
    return this.rentalContractsService.generateDocument(+id);
  }

  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './storage/temp',
      filename: editFileName
    })
  }))
  @Post(':id/upload/images')
  async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const path = await compressImage(file);
    return await this.rentalContractsService.uploadImage(+id, path)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentalContractDto: UpdateRentalContractDto) {
    return this.rentalContractsService.update(+id, updateRentalContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalContractsService.remove(+id);
  }
}

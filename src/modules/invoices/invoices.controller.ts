import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, Query, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PdfInterceptor } from 'src/interceptors/pdf.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { editFileName, pdfFileFilter } from 'src/helpers/string';
import { FindInvoiceDto } from './dto/find-invoice.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserAdminGuard } from 'src/auth/guards/user-admin.guard';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './storage/invoices',
      filename: editFileName
    }),
    fileFilter: pdfFileFilter,
  }))
  @Post(':id/upload')
  async uploadPdf(@UploadedFile() pdfFile: Express.Multer.File, @Param('id') id: string) {
    return this.invoicesService.update(id, {path: pdfFile.path});
  }

  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Get()
  findAll(@Query() query: FindInvoiceDto) {
    return this.invoicesService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findAllMe(@Req() req: any) {
    return this.invoicesService.findAll({tenantId: req.user.id});
  }

  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }
}

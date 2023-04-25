import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { ResetPasswordRequest, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserGuard } from 'src/auth/guards/user.guard';
import { Role } from 'src/enums/role.enum';
import { FindUserDto } from './dto/find-user.dto';
import { UserAdminGuard } from 'src/auth/guards/user-admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/helpers/string';
import { compressImage } from 'src/helpers/compress';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //Customer
  @Post('customers')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({ ...createUserDto, role: Role.customer });
  }

  @UseInterceptors(CacheInterceptor)
  @Get('customers')
  findAll(@Query() query: FindUserDto) {
    return this.usersService.findAll({ ...query, role: Role.customer });
  }

  //Owner
  @Post('owners')
  createOwner(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({ ...createUserDto, role: Role.owner });
  }

  @UseInterceptors(CacheInterceptor)
  @Get('owners')
  findAllOwner(@Query() query: FindUserDto) {
    return this.usersService.findAll({ ...query, role: Role.owner });
  }

  //Realtors
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Post('realtors')
  createRealtor(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({ ...createUserDto, role: Role.realtor });
  }

  @UseInterceptors(CacheInterceptor)
  @Get('realtors')
  findAllRealtors(@Query() query: FindUserDto) {
    return this.usersService.findAll({ ...query, role: Role.realtor });
  }

  //Collaborators
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Post('collaborators')
  createCollaborator(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({ ...createUserDto, role: Role.collaborator });
  }

  @UseInterceptors(CacheInterceptor)
  @Get('collaborators')
  findAllCollaborators(@Query() query: FindUserDto) {
    return this.usersService.findAll({ ...query, role: Role.collaborator });
  }

  //Administrators
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Post('administrators')
  createAdministrators(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({ ...createUserDto, role: Role.admin });
  }

  @UseInterceptors(CacheInterceptor)
  @Get('administrators')
  findAllAdministrators(@Query() query: FindUserDto) {
    return this.usersService.findAll({ ...query, role: Role.admin });
  }

  //Outhers
  @UseInterceptors(CacheInterceptor)
  @Get()
  findAllNotCustomer(@Query() query: FindUserDto) {
    return this.usersService.findAllNotCustomer(query);
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, UserGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, UserGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './storage/temp',
      filename: editFileName
    })
  }))
  @Post('upload/avatar/:id')
  async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const path = await compressImage(file);
    return await this.usersService.uploadImage(id, path)
  }

  @Post('forgot-password')
  forgotPassword(@Body() body) {
    return this.usersService.sendForgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordRequest) {
    return this.usersService.resetPassword(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Body() body: ResetPasswordRequest, @Req() req: any) {
    return this.usersService.changePassword({ ...body, user_id: req.user.id });
  }
}

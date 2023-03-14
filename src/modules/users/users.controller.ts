import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserGuard } from 'src/auth/guards/user.guard';
import { Role } from 'src/enums/role.enum';
import { FindUserDto } from './dto/find-user.dto';
import { UserAdminGuard } from 'src/auth/guards/user-admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //Customer
  @Post('customers')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({...createUserDto, role: Role.customer});
  }

  @Get('customers')
  findAll(@Query() query: FindUserDto) {
    return this.usersService.findAll({...query, role: Role.customer});
  }

  //Realtors
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Post('realtors')
  createRealtor(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({...createUserDto, role: Role.realtor});
  }

  @Get('realtors')
  findAllRealtors(@Query() query: FindUserDto) {
    return this.usersService.findAll({...query, role: Role.realtor});
  }

  //Collaborators
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Post('collaborators')
  createCollaborator(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({...createUserDto, role: Role.collaborator});
  }

  @Get('collaborators')
  findAllCollaborators(@Query() query: FindUserDto) {
    return this.usersService.findAll({...query, role: Role.collaborator});
  }

  //Administrators
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  @Post('administrators')
  createAdministrators(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({...createUserDto, role: Role.admin});
  }

  @Get('administrators')
  findAllAdministrators(@Query() query: FindUserDto) {
    return this.usersService.findAll({...query, role: Role.admin});
  }

  //Outhers
  @Get()
  findAllNotCustomer(@Query() query: FindUserDto) {
    return this.usersService.findAllNotCustomer(query);
  }

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
}

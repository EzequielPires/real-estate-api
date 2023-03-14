import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enums/role.enum';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const userAlreadyExists = await this.findOneByEmail(createUserDto.email);

      if (userAlreadyExists.user) throw new Error('Usuário já existe');

      const user = this.userRepository.create(createUserDto);

      return {
        success: true,
        user: await this.userRepository.save(user)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll(queryDto?: FindUserDto) {
    const {limit, name, page, role} = queryDto;
    try {
      const query = this.userRepository.createQueryBuilder('user')
        .skip(page ? (limit ?? 15) * (page - 1) : 0)
        .take(limit ?? 15)
        .orderBy("user.name", 'ASC');

        {role && query.andWhere('user.role = :role', {role})};
      
        const [results, total] = await query.getManyAndCount();

      return {
        success: true,
        results,
        total,
        page: queryDto.page ? Number(queryDto.page) : 1,
        limit: queryDto.limit ? Number(queryDto.limit) : 15,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAllNotCustomer(queryDto?: FindUserDto) {
    const {limit, name, page, role} = queryDto;
    try {
      const query = this.userRepository.createQueryBuilder('user')
        .skip(page ? (limit ?? 15) * (page - 1) : 0)
        .take(limit ?? 15)
        .orderBy("user.name", 'ASC')
        .andWhere('user.role != :role', {role: 'customer'});
      
        const [results, total] = await query.getManyAndCount();

      return {
        success: true,
        results,
        total,
        page: queryDto.page ? Number(queryDto.page) : 1,
        limit: queryDto.limit ? Number(queryDto.limit) : 15,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new Error('Usuário não encontrado.');

      return {
        success: true,
        user
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) throw new Error('Usuário não encontrado.');

      return {
        success: true,
        user
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new Error('Usuário não encontrado.');

      await this.userRepository.update(id, updateUserDto);

      return {
        success: true,
        user: await this.userRepository.findOneBy({ id })
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new Error('Usuário não encontrado.');

      await this.userRepository.delete(id);

      return {
        success: true,
        user: 'Usuário removido com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

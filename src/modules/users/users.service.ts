import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enums/role.enum';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { compareSync, hashSync } from 'bcrypt';
import { addHours } from 'src/helpers/date';
import { TokenService } from '../token/token.service';
import { v4 as uuidV4 } from "uuid";
import { NodemailerService } from 'src/services/nodemailer/nodemailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export interface ResetPasswordRequest {
  token: string,
  password: string,
  repeat_password: string,
  current_password?: string,
  user_id?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User) private userRepository: Repository<User>,
    private tokenService: TokenService,
    private nodemailerService: NodemailerService
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
    } finally {
      await this.cacheManager.reset();
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
        .andWhere('user.role != :customer', {customer: 'customer'})
        .andWhere('user.role != :owner', {owner: 'owner'});
      
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
      const user = await this.userRepository.findOne({ where: {id}, relations: [
        'rentalContracts', 
        'salesContracts', 
        'favoriteProperties', 
        'rentalContractsLocator',
        'rentalContractsTenant',
        'rentalContractsTenant.property.address',
        'rentalContractsTenant.invoices',
        'salesContractsBuyer',
        'salesContractsBuyer.property.address'
      ] });

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
    const {password} = updateUserDto;
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new Error('Usuário não encontrado.');

      if(password) {
        const newPassword = hashSync(password, 10);
        await this.userRepository.update(id, {...updateUserDto, password: newPassword});
      }

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
    } finally {
      await this.cacheManager.reset();
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
    } finally {
      await this.cacheManager.reset();
    }
  }
  
  async uploadImage(id: string, path: string) {
    try {
      const property = await this.userRepository.findOne({ where: { id } });

      if (!property) throw new Error('Propriedade não encontrada.');

      await this.userRepository.update(id, {
        avatar: path
      });

      return {
        success: true,
        path: path,
        message: 'Avatar atualizada com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    } finally {
      await this.cacheManager.reset();
    }
  }

  async sendForgotPassword(email: string) {
    try {
      const user = await this.userRepository.findOne({where: {email}});

      if (!user) {
        throw new Error("Usuário com esse email não existe!");
      }

      const refresh_token = uuidV4();

      const expires_date = addHours(3);

      const userToken = await this.tokenService.create({
        expires_date,
        refresh_token,
        user
      });

      const messageOptions = {
        email: email,
        token: refresh_token,
        title: 'Recuperação de senha',
        body: `https://www.rotinaimoveis.com.br/reset-password?token=${refresh_token}&user=${user.id}`
      }


      const response = await this.nodemailerService.sendEmail(messageOptions);
      if (!response.success) {
        throw new Error("Falha ao enviar email com recuperação de senha.")
      }

      return {
        success: true,
        message: "Email com recuperação de senha enviado com sucesso.",
        data: userToken
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async resetPassword(data: ResetPasswordRequest) {
    const { password, repeat_password, token, current_password, user_id } = data;
    try {
      if (token) {
        const { isValid, user } = await this.tokenService.isValid(token);

        if (!isValid) throw new Error("Token de recuperação de senha inválido.");

        if (password != repeat_password) throw new Error("As senhas devem ser iguais.");

        user.password = hashSync(password, 10);

        await this.userRepository.save(user);

        await this.tokenService.remove(token);

        return {
          success: true,
          message: "Senha alterada com sucesso!"
        };
      } else {
        const userAlreadyExists = await this.userRepository.findOneBy({ id: user_id });

        if (!userAlreadyExists) throw new Error(`User not already exists.`);

        const passwordMatch = compareSync(current_password, userAlreadyExists.password);

        if (!passwordMatch) throw new Error(`Password invalid.`);

        if (password != repeat_password) throw new Error("As senhas devem ser iguais.");

        userAlreadyExists.password = hashSync(password, 10);

        await this.userRepository.save(userAlreadyExists);

        return {
          success: true,
          message: "Senha alterada com sucesso!"
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async changePassword({ password, repeat_password, current_password, user_id }: ResetPasswordRequest) {
    try {
      const userAlreadyExists = await this.userRepository.findOneBy({ id: user_id });

      if (!userAlreadyExists) throw new Error(`User not already exists.`);

      const passwordMatch = compareSync(current_password, userAlreadyExists.password);

      if (!passwordMatch) throw new Error(`Password invalid.`);

      if (password != repeat_password) throw new Error("As senhas devem ser iguais.");

      userAlreadyExists.password = hashSync(password, 10);

      await this.userRepository.save(userAlreadyExists);

      return {
        success: true,
        message: "Senha alterada com sucesso!"
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

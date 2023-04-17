import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isValidHours } from 'src/helpers/date';
import { Repository } from 'typeorm';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(@InjectRepository(Token) private tokenRepository: Repository<Token>) { }

  async create(createTokenDto: CreateTokenDto) {
    try {
      const token = this.tokenRepository.create(createTokenDto);
      return await this.tokenRepository.save(token);
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  async findAll() {
    return `This action returns all token`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} token`;
  }

  async update(id: string, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  async remove(id: string) {
    return `This action removes a #${id} token`;
  }

  async isValid(id: string) {
    try {
      const token = await this.tokenRepository.findOne({
        relations: ['user'],
        where: { refresh_token: id }
      });

      if (!token) {
        throw new Error("Token de recuperação de senha inválido.");
      }

      return {
        isValid: isValidHours(token.expires_date),
        user: token.user
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }
}

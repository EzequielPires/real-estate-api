import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeadType } from 'src/enums/property.enum';
import { Repository } from 'typeorm';
import { CreateLeadDto } from './dto/create-lead.dto';
import { FindLeadDto } from './dto/find-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from './entities/lead.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead) private leadRepository: Repository<Lead>
  ) { }

  async create(createLeadDto: CreateLeadDto) {
    const {type} = createLeadDto;
    try {
      if(type && !LeadType[type]) throw new Error('Tipo de lead inválido.');
      const lead = this.leadRepository.create(createLeadDto);

      return {
        success: true,
        result: await this.leadRepository.save(lead)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll(queryDto: FindLeadDto) {
    try {
      const [results, total] = await this.leadRepository.findAndCount({
        where: {
          realtor: {
            id: queryDto.realtorId
          },
          property: {
            id: queryDto.propertyId,
            code: queryDto.propertyCode
          }
        },
        skip: queryDto.page ? (queryDto.limit ?? 15) * (queryDto.page - 1) : 0,
        take: queryDto.limit ?? 15,
        order: {
          createdAt: 'DESC'
        }
      });

      return {
        success: true,
        results,
        total,
        page: queryDto.page ? Number(queryDto.page) : 1,
        limit: queryDto.limit ? Number(queryDto.limit) : 15
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findOne(id: number) {
    try {
      const lead = await this.leadRepository.findOne({ where: { id } });

      if (!lead) throw new Error('Lead não encontrado.')

      return {
        success: true,
        result: lead
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async update(id: number, updateLeadDto: UpdateLeadDto) {
    try {
      const lead = await this.leadRepository.findOne({ where: { id } });

      if (!lead) throw new Error('Lead não encontrado.');

      await this.leadRepository.update(id, updateLeadDto);

      return {
        success: true,
        result: await this.leadRepository.findOne({ where: { id } }),
        message: 'Lead atualizado com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async remove(id: number) {
    try {
      const lead = await this.leadRepository.findOne({ where: { id } });

      if (!lead) throw new Error('Lead não encontrado.');

      await this.leadRepository.delete(id);

      return {
        success: true,
        message: 'Lead removido com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }
}

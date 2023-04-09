import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Like, Repository } from 'typeorm';
import { PropertiesService } from '../properties/properties.service';
import { RentalContractsService } from '../rental-contracts/rental-contracts.service';
import { RentalContract } from '../rental-contracts/entities/rental-contract.entity';
import { FindInvoiceDto } from './dto/find-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
    private propertiesService: PropertiesService,
    private rentalContractsService: RentalContractsService
  ) { }

  async create({ expiration, reference, rentalContract, price }: CreateInvoiceDto) {
    try {
      const rentalContractExists = await this.rentalContractsService.findOne(rentalContract.id).then(res => res.result);
      if (!rentalContractExists) throw new Error('Contrato de locação não encontrado.');


      const invoiceExists = await this.verifyAlreadyExists(reference, rentalContract);
      const invoiceDiference = await this.checkDifference(new Date(reference), new Date(expiration));

      if (invoiceExists) {
        throw new Error('Boleto pra esse mês já existe');
      }

      if (!invoiceDiference) {
        throw new Error('A diferença entre a referência e o vencimento devem ser de no mínimo 28 dias.');
      }

      const invoice = this.invoiceRepository.create({
        expiration,
        reference,
        rentalContract,
        price: price.replace(/[^0-9]/g, '')
      })

      return {
        success: true,
        invoice: await this.invoiceRepository.save(invoice)
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async findAll(queryDto: FindInvoiceDto) {
    try {
      const { end, limit, locatorId, page, rentalContractId, start, tenantId } = queryDto;

      const query = this.invoiceRepository.createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.rentalContract', 'rentalContract')
        .leftJoinAndSelect('rentalContract.tenant', 'tenant')
        .leftJoinAndSelect('rentalContract.property', 'property')
        .leftJoinAndSelect('property.address', 'address')
        .leftJoinAndSelect('address.state', 'state')
        .leftJoinAndSelect('address.city', 'city')
        .leftJoinAndSelect('address.district', 'district')
        .leftJoinAndSelect('rentalContract.locator', 'locator')
        .skip(page ? (limit ?? 15) * (page - 1) : 0)
        .take(limit ?? 15)
        .orderBy("invoice.createdAt", 'DESC');

      { rentalContractId && query.andWhere('rentalContract.id = :rentalContractId', { rentalContractId }) }
      { tenantId && query.andWhere('tenant.id = :tenantId', { tenantId }) }
      { locatorId && query.andWhere('locator.id = :locatorId', { locatorId }) }

      const [results, count] = await query.getManyAndCount();

      return {
        success: true,
        results,
        count,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 15,
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
      const invoice = await this.invoiceRepository.findOne({
        where: { id },
        relations: [
          'rentalContract',
          'rentalContract.tenant',
          'rentalContract.property',
          'rentalContract.property.address',
          'rentalContract.property.address.city',
          'rentalContract.property.address.district',
        ]
      });
      if (!invoice) throw new Error('Fatura não encontrada.');

      return {
        success: true,
        invoice
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async update(id: string, { expiration, price, reference, status, path, payment }: UpdateInvoiceDto) {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id },
      });
      if (!invoice) throw new Error('Fatura não encontrada.');

      await this.invoiceRepository.update(id, {
        expiration: expiration ?? invoice.expiration, 
        price: price ? price.replace(/[^0-9]/g, '') : invoice.price, 
        reference: reference ?? invoice.reference, 
        status: status ?? invoice.status,
        path: path ?? invoice.path,
        payment: payment ?? invoice.payment,
      });

      return {
        success: true,
        invoice: await this.findOne(id).then(res => res.invoice)
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
      const invoice = await this.invoiceRepository.findOne({ where: { id } });
      if (!invoice) throw new Error('Fatura não encontrada.');

      await this.invoiceRepository.delete(id);

      return {
        success: true,
        message: 'Fatura removida com sucesso.'
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  async checkDifference(reference: Date, expiration: Date) {
    const diferencaEmMilissegundos = Math.abs(expiration.getTime() - reference.getTime());
    const diferencaEmDias = Math.ceil(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

    return diferencaEmDias >= 28;
  }

  async verifyAlreadyExists(date, rentalContract: RentalContract) {
    try {
      const mesReferenciaFormatado = date.toString().slice(0, 7);

      const query = this.invoiceRepository.createQueryBuilder('invoice')
        .leftJoin('invoice.rentalContract', 'rentalContract')
        .andWhere('rentalContract.id = :id', { id: rentalContract.id })
        .andWhere('DATE_FORMAT(invoice.reference, "%Y-%m-01") = :ref', { ref: `${mesReferenciaFormatado}-01` });

      const invoiceExists = await query.getOne();

      if (invoiceExists) {
        return true;
      } else return false;
    } catch (error) {
      return false;
    }
  }
}

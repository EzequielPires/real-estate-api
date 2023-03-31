import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15'
    });
  }
  async create(createPaymentDto: CreatePaymentDto) {
    try {
      /* const clientAlreadyExists = await this.stripe.customers.list({
        email: 'maria@gmail.com'
      });
      if(clientAlreadyExists.data.length > 0) throw new Error('Cliente já existe.');

      const client = await this.stripe.customers.create({
        email: 'maria@gmail.com',
        name: 'Maria de Lourdes Pires e Silva',
        phone: '(64) 99944-4492'
      })
        .then(customer => customer)
        .catch(error => console.error(error));
      return client; */

      const clientAlreadyExists = await this.stripe.customers.list({
        email: 'maria@gmail.com'
      });
      if (!(clientAlreadyExists.data.length > 0)) throw new Error('Cliente inválido.');

      const paymentIntent = await this.stripe.invoices.create({
        //amount: 98500,
        //currency: 'brl',
        customer: clientAlreadyExists.data[0].id,
        //payment_method_types: ['boleto'],
        description: 'Pagamento do aluguel',
      });

      return {
        success: true,
        payment: paymentIntent
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}

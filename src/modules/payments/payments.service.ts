import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import * as PagSeguro from 'pagseguro';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15'
    });
  }
  /* async create(createPaymentDto: CreatePaymentDto) {
   try {
     const clientAlreadyExists = await this.stripe.customers.list({
       email: 'maria@gmail.com'
     });
     if (!(clientAlreadyExists.data.length > 0)) throw new Error('Cliente inválido.');

     const paymentIntent = await this.stripe.invoices.create({
       amount: 98500,
       currency: 'brl',
       customer: clientAlreadyExists.data[0].id,
       payment_method_types: ['boleto'],
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
 }  */

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const pagseguro = new PagSeguro({
        email: 'ezequiel.pires082000@gmail.com',
        token: '31707B454B2A46EBA957F2611FA405EB',
        mode: 'sandbox'
      });

      pagseguro.currency('BRL');
      pagseguro.addItem({
        id: '1',
        description: 'Boleto teste.',
        quantity: '1',
        amount: 5000
      });
      pagseguro.setCustomer({
        name: 'Yasmim Lopes Oliveira',
        email: 'yasmin0143332@gmail.com'
      });
      const response = await pagseguro.createPaymentRequest({
        method: 'boleto',
        extraAmount: 5.00,
        expirationDays: 3,
        maxAge: 2592000,
        maxUses: 1
      });
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

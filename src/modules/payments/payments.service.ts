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
  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['boleto'],
        // The parameter is optional. The default value of expires_after_days is 3.
        payment_method_options: {
          boleto: {
            expires_after_days: 7
          }
        },
        line_items: [{
          price_data: {
            // To accept `boleto`, all line items must have currency: brl
            currency: 'brl',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 800,
        currency: 'brl',
        description: 'T-shirt',
        payment_method_types: ['boleto'],
      });

      const source = await this.stripe.paymentMethods.create({
        type: 'boleto',
        boleto: {
          tax_id: "70867831103"
        },
        billing_details: {
          email: 'yasmin0143332@gmail.com',
          name: 'Yasmim Lopes',
          phone: '64996268117',
          address: {
            city: 'Catalão',
            country: 'BR',
            line1: 'Rua José da Rosa Pena',
            line2: 'Ipanema',
            postal_code: '75705020',
            state: 'GO'
          }
        }
      });

      
      await this.stripe.paymentIntents.update(paymentIntent.id, {
        payment_method: source.id,
      });
      
      await this.stripe.paymentIntents.confirm(paymentIntent.id);
      
      const paymentIntentWithBoleto = await this.stripe.paymentIntents.retrieve(
        paymentIntent.id,
        { expand: ['payment_method'] },
      );

      return {
        success: true,
        paymentIntentWithBoleto: paymentIntentWithBoleto,
        payment_intent: paymentIntent,
        source: source,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
  }

  /* async create(createPaymentDto: CreatePaymentDto) {
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
 */
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

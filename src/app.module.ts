import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './modules/users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { PropertyTypesModule } from './modules/property-types/property-types.module';
import { PropertyType } from './modules/property-types/entities/property-type.entity';
import { Property } from './modules/properties/entities/property.entity';
import { Address } from './modules/address/entities/address.entity';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DetailsModule } from './modules/details/details.module';
import { Detail } from './modules/details/entities/detail.entity';
import { RentalContractsModule } from './modules/rental-contracts/rental-contracts.module';
import { SalesContractsModule } from './modules/sales-contracts/sales-contracts.module';
import { SalesContract } from './modules/sales-contracts/entities/sales-contract.entity';
import { RentalContract } from './modules/rental-contracts/entities/rental-contract.entity';
import { State } from './modules/address/entities/state.entity';
import { City } from './modules/address/entities/city.entity';
import { District } from './modules/address/entities/district.entity';
import { PaymentsModule } from './modules/payments/payments.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { Invoice } from './modules/invoices/entities/invoice.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PdfInterceptor } from './interceptors/pdf.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', ''),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [
        Address,
        City,
        Detail,
        District,
        PropertyType,
        SalesContract,
        RentalContract,
        State,
        User,
        Property,
        Invoice
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PropertiesModule,
    PropertyTypesModule,
    DetailsModule,
    RentalContractsModule,
    SalesContractsModule,
    PaymentsModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }

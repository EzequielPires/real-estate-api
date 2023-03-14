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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
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
        User,
        PropertyType,
        Property
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PropertiesModule,
    PropertyTypesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

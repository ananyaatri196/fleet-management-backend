import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import { OnRegister, onRegisterSchema } from '../schema/register.schema';
import { OnLogin, onLoginSchema } from '../schema/login.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnLogin.name, schema: onLoginSchema },
      { name: OnRegister.name, schema: onRegisterSchema },
    ]),
    DataModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { algorithm: 'HS256', expiresIn: '5m' },
    }),
  ],
  providers: [DataService],
  controllers: [DataController],
})
export class DataModule {}

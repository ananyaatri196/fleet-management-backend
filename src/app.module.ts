import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { OnLogin, onLoginSchema } from './schema/login.schema';
import { OnRegister, onRegisterSchema } from './schema/register.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/fleetManagement'),
    MongooseModule.forFeature([
      { name: OnLogin.name, schema: onLoginSchema },
      { name: OnRegister.name, schema: onRegisterSchema },
    ]),
    JwtModule,
    DataModule,
  ],
})
export class AppModule {}

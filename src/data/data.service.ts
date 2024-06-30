import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { OnLogin } from '../schema/login.schema';
import { OnRegister } from '../schema/register.schema';
import { JwtService } from '@nestjs/jwt';
import { nodeMailerConfig } from 'src/config/mail.config';

@Injectable()
export class DataService {
  constructor(
    @InjectModel(OnRegister.name) private onRegisterModel: Model<OnRegister>,
    @InjectModel(OnLogin.name) private onLoginModel: Model<OnLogin>,
    private readonly jwtService: JwtService,
  ) {}

  async isConnected() {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/fleetManagement');
    } catch (error) {
      throw new HttpException(
        'Connection Error',
        HttpStatus.SERVICE_UNAVAILABLE, // 503
      );
    }
  }

  async sendOtp(email: string) {
    // this.isConnected;
    const regUser = await this.onRegisterModel
      .findOne({ emailID: email })
      .exec();
    if (!regUser) {
      // await this.onRegisterModel.create({ emailID: email, _id: 1 })
      // return true;
      throw new HttpException('Invalid email id', HttpStatus.UNAUTHORIZED); // 401
    } else {
      const logUser = await this.onLoginModel
        .findOne({ emailID: email })
        .exec();
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport(nodeMailerConfig);
      const mailOptions = {
        from: 'nodemailer.otp.sender@gmail.com',
        to: email,
        subject: 'OTP for Login',
        text: `Your OTP for login is: ${otp}`,
      };
      transporter.sendMail(mailOptions, async (err) => {
        if (err) {
          throw new HttpException(
            'Unable to send Email, please try again later',
            HttpStatus.INTERNAL_SERVER_ERROR, // 500
          );
        } else {
          if (!logUser) {
            const newId = (await this.onLoginModel.countDocuments().exec()) + 1;
            const newLogUser = await this.onLoginModel.create({
              emailID: email,
              otp,
              _id: newId,
              attempts: 1,
            });
            newLogUser.save();
          } else {
            logUser.attempts = logUser.attempts + 1;
            const now = new Date();
            if (
              logUser.attempts > 3 &&
              (Date.now() - logUser.updatedAt.getTime()) / 60000 < 5
            ) {
              throw new HttpException(
                'Maximum limit reached!',
                HttpStatus.TOO_MANY_REQUESTS, // 429
              );
            } else {
              logUser.updatedAt = now;
              logUser.otp = otp;
              logUser.save();
            }
          }
        }
      });
    }
  }

  async verifyOtp(email: string, otp: string) {
    // this.isConnected;
    const regUser = await this.onRegisterModel
      .findOne({ emailID: email })
      .exec();
    const logUser = await this.onLoginModel.findOne({ emailID: email }).exec();
    if (regUser && logUser && logUser.otp === otp) {
      logUser.isVerified = true;
      logUser.attempts = 0;
      logUser.save();
      const payload = { sub: regUser._id };
      const token = await this.jwtService.signAsync(payload);
      const fullName = regUser.fullName;
      const occupation = regUser.occupation;
      regUser.isLoggedIn = true;
      regUser.save();
      return { token, fullName, occupation };
    } else {
      throw new HttpException('Invalid otp', HttpStatus.UNAUTHORIZED); // 401
    }
  }

  async logoutUser(email: string) {
    this.isConnected;
    const regUser = await this.onRegisterModel
      .findOne({ emailID: email })
      .exec();
    const logUser = await this.onLoginModel.findOne({ emailID: email }).exec();
    if (regUser && logUser) {
      logUser.isVerified = false;
      logUser.attempts = 0;
      logUser.save();
      regUser.isLoggedIn = false;
      regUser.save();
    } else {
      throw new HttpException(
        'An Error Occurred. Please try again later',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    return await this.dataService.sendOtp(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    const { email, otp } = body;
    return await this.dataService.verifyOtp(email, otp);
  }

  @Post('logout-user')
  async logoutUser(@Body('email') email: string) {
    return await this.dataService.logoutUser(email);
  }
}

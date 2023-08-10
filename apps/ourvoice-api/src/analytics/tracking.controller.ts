import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
@UseGuards(new AuthGuard())
export class TrackingController {
  @Post('tracking')
  async post(@Body() body: any) {
    // dummy endpoint for AnalyticsInterceptor to log data
    return 'OK';
  }
}

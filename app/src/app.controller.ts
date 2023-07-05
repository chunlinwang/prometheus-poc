import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrometheusService } from './prometheus/prometheus.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prometheusService: PrometheusService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('metrics')
  getMetrics(): Promise<string> {
    return this.prometheusService.getMetrics();
  }
}

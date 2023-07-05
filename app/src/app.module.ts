import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrometheusService } from './prometheus/prometheus.service';
import { PrometheusModule } from './prometheus/prometheus.module';

@Module({
  imports: [PrometheusModule],
  controllers: [AppController],
  providers: [AppService, PrometheusService],
})
export class AppModule {}

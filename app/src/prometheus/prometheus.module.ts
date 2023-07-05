import { Module } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';
import { PrometheusClient } from './prometheus-client';

@Module({
  exports: [PrometheusClient, PrometheusService],
  providers: [PrometheusClient, PrometheusService],
})
export class PrometheusModule {}

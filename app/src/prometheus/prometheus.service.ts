import { Injectable } from '@nestjs/common';
import { PrometheusClient } from './prometheus-client';

@Injectable()
export class PrometheusService {
  constructor(private prometheusClient: PrometheusClient) {}

  async getMetrics(): Promise<string> {
    const operatingSystems = [
      // 'psa',
      // 'psa-mph-v2',
      // 'psa-mph-v3',
      // 'fca-gsdp-eu',
      // 'fca-gsdp-latam',
      // 'fca-ada-na',
      // 'targa',
      // 'daimler',
      'kuantic',
    ];

    // const prometheusClient = new PrometheusClient();
    const stats = {
      operatingSystem: 'kuantic',
      step: 'push',
      durations: {
        before: Math.ceil(Math.random() * 10),
        after: Math.ceil(Math.random() * 10),
        during: Math.ceil(Math.random() * 10),
        age: Math.ceil(Math.random() * 10),
        full: Math.ceil(Math.random() * 10),
        pushing: Math.ceil(Math.random() * 10),
        push: Math.ceil(Math.random() * 10),
      },
      received: Math.ceil(Math.random() * 88),
      processed: Math.ceil(Math.random() * 99),
      processName: 'test',
      n: Math.ceil(Math.random() * 10),
      date: new Date(),
      hostname: process.env.HOSTNAME,
    };

    await this.prometheusClient.pushMetricObserve(stats);
    stats.step = 'process-data';
    await this.prometheusClient.processDataMetricObserve(stats);
    stats.step = 'push-to-kinesis';
    await this.prometheusClient.pushToKinesisMetricObserve(stats);
    stats.step = 'push-to-sqs';
    await this.prometheusClient.pushToSqsMetricObserve(stats);

    stats.date = new Date();

    return this.prometheusClient.getMetrics();
  }
}

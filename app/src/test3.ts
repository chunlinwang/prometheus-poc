/* eslint-disable @typescript-eslint/no-var-requires */

// const { PrometheusClient } = require('./prometheus/prometheus-client');

import { delay } from 'bluebird';
import Single from './singleton';

export default async () => {
  let total = 0;
  for (let q = 0; q < 2; q++) {
    console.log('metric gene,', q);
    const prometheusClient = Single.getInstance();

    for (let i = 0; i < 6; ++i) {
      const n = Math.ceil(Math.random() * 10);
      await prometheusClient.gaugeMetricSetValue('gauge_metric', {}, n);

      total = total + n;
      console.log('n: ', n);
      console.log('total: ', total);
      await delay(10);

      console.log('fin');
    }

    await delay(10);
  }
};

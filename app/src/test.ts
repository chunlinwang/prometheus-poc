/* eslint-disable @typescript-eslint/no-var-requires */
import Singleton from './singleton';

console.time('p');

import { delay } from 'bluebird';

console.timeEnd('p');

(async () => {
  let total = 0;
  for (let q = 0; q < 2; q++) {
    console.log('metric,', q);
    console.time('c');
    const prometheusClient = Singleton.getInstance();
    console.timeEnd('c');

    for (let i = 0; i < 6; ++i) {
      const n = Math.ceil(Math.random() * 10);
      await prometheusClient.counterMetricIncValue('counter_metric', {}, n);

      total = total + n;
      console.log('n: ', n);
      console.log('total: ', total);
      await delay(10);

      console.log('fin');
    }

    await prometheusClient.push2();

    await delay(10);
  }
})();

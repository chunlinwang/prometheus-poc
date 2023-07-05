/* eslint-disable @typescript-eslint/no-var-requires */
import { PrometheusClient } from './prometheus/prometheus-client';
let prometheusClient;

const Singleton = (() => {
  function createInstance() {
    return new PrometheusClient();
  }

  return {
    getInstance: () => {
      if (
        !(
            prometheusClient &&
            prometheusClient instanceof PrometheusClient
        )
      ) {
        createInstance();
      }

      return prometheusClient;
    },
  };
})();

export default Singleton;

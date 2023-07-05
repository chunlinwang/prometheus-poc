import { Injectable } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
  Pushgateway,
  Registry,
  Summary,
} from 'prom-client';
import * as process from 'process';

@Injectable()
export class PrometheusClient {
  [x: string]: any;

  constructor() {
    this.pushGatewayUrl = 'http://pushgateway:9091';
    this.pushTimeOut = 5000;
    this.counterMetrics = [];
    this.gaugeMetrics = [];
    this.histogramMetrics = [];
    this.summaryMetrics = [];
    this.registry = new Registry();

    this.id = `${process.pid}`;

    const defaultLabels = {
      project: 'my-project',
      serviceName: 'my-service',
      environment: process.env.ENVIRONMENT,
      hostname: process.env.HOSTNAME,
    };
    this.registry.setDefaultLabels(defaultLabels);

    // Allows to have default metrics such as memory consumption
    collectDefaultMetrics({
      register: this.registry,
      prefix: 'my_prefix',
    });

    this.gateway = new Pushgateway(
      this.pushGatewayUrl,
      {
        timeout: this.pushTimeOut,
      },
      this.registry,
    );
  }

  /**
   * Create Histogram Metric if it doesn't exist.
   *
   * @param {string} name
   * @param {string} help
   * @param {object} labelNames
   * @param {number[]} buckets
   */
  createHistogramMetric({
    name,
    help = '',
    labelNames = [],
    buckets = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
  }) {
    if (this.histogramMetrics[name] instanceof Histogram) {
      return;
    }

    const nameType = `${name}_histogram`;

    this.histogramMetrics[name] =
      this.registry.getSingleMetric(nameType) ??
      new Histogram({
        name: nameType,
        help,
        labelNames,
        buckets,
        registers: [this.registry],
      });
  }

  /**
   * Observer data.
   *
   * @param {string} name
   * @param {object} labels
   * @param {*} value
   */
  histogramMetricObserve(name, labels = {}, value) {
    this.createHistogramMetric({
      name: name,
      help: name,
      labelNames: Object.keys(labels),
    });

    this.histogramMetrics[name].observe(labels, value);
  }

  /**
   * Create Counter Metric if it doesn't exist.
   *
   * @param {string} name
   * @param {string} help
   * @param {object} labelNames
   * @param {number[]} buckets
   */
  createCounterMetric({ name, help = '', labelNames = [] }) {
    if (this.counterMetrics[name] instanceof Counter) {
      return;
    }
    const nameType = `${name}_counter`;

    this.counterMetrics[name] =
      this.registry.getSingleMetric(nameType) ??
      new Counter({
        name: nameType,
        help,
        labelNames,
        registers: [this.registry],
      });
  }

  /**
   * Counter metric inc data for label.
   *
   * @param {string} name
   * @param {object} labels
   * @param {*} value
   */
  counterMetricIncValue(name, labels = {}, value) {
    this.createCounterMetric({
      name: name,
      help: name,
      labelNames: Object.keys(labels),
    });

    this.counterMetrics[name].inc(labels, value);
  }

  /**
   * Create Gauge Metric if it doesn't exist.
   *
   * @param {string} name
   * @param {string} help
   * @param {object} labelNames
   * @param {number[]} buckets
   */
  createGaugeMetric({ name, help = '', labelNames = [] }) {
    if (this.gaugeMetrics[name] instanceof Gauge) {
      return;
    }

    const nameType = `${name}_gauge`;

    this.gaugeMetrics[name] =
      this.registry.getSingleMetric(nameType) ??
      new Gauge({
        name: nameType,
        help,
        labelNames,
        registers: [this.registry],
      });
  }

  /**
   * Guage metric inc data for label.
   *
   * @param {string} name
   * @param {object} labels
   * @param {*} value
   */
  gaugeMetricSetValue(name, labels = {}, value) {
    this.createGaugeMetric({
      name: name,
      help: name,
      labelNames: Object.keys(labels),
    });

    this.gaugeMetrics[name].inc(labels, value);
  }

  /**
   * Create Summary Metric if it doesn't exist.
   *
   * @param {string} name
   * @param {string} help
   * @param {object} labelNames
   * @param {number[]} percentiles
   */
  createSummaryMetric({
    name,
    help = '',
    labelNames = [],
    percentiles = [0.01, 0.1, 0.9, 0.99, 1],
  }) {
    if (this.summaryMetrics[name] instanceof Summary) {
      return;
    }

    const nameType = `${name}_summary`;

    this.summaryMetrics[name] =
      this.registry.getSingleMetric(nameType) ??
      new Summary({
        name: nameType,
        help,
        labelNames,
        percentiles,
        registers: [this.registry],
      });
  }

  /**
   * Summary Metric Observer data.
   *
   * @param {string} name
   * @param {object} labels
   * @param {*} value
   */
  summaryMetricObserve(name, labels = {}, value) {
    this.createSummaryMetric({
      name: name,
      help: name,
      labelNames: Object.keys(labels),
    });

    this.summaryMetrics[name].observe(labels, value);
  }

  async push() {
    try {
      const gateway = new Pushgateway(
        this.pushGatewayUrl,
        {
          timeout: this.pushTimeOut,
        },
        this.registry,
      );

      return gateway.pushAdd({
        jobName: this.id,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async getMetrics() {
    return this.registry.metrics();
  }
}

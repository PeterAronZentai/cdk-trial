#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { GoptimizepocStack } = require('../lib/goptimizepoc-stack');

const app = new cdk.App();
const account = '856324650258';
const region = 'eu-west-1';
new GoptimizepocStack(app, 'GoptimizepocStack', { env: { account, region  }});

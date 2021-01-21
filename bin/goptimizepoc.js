#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { GoptimizepocStack } = require('../lib/goptimizepoc-stack');

const app = new cdk.App();
new GoptimizepocStack(app, 'GoptimizepocStack');

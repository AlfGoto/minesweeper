#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MinesweeperStack } from '../lib/minesweeper-stack';

const app = new cdk.App();

new MinesweeperStack(app, 'MinesweeperStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
}); 
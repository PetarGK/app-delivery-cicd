#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AppDeliveryCicdStack } from '../lib/app-delivery-cicd-stack';

const app = new cdk.App();
new AppDeliveryCicdStack(app, 'AppDeliveryCicdStack');

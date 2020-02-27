#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PipelineStack } from '../lib/pipeline-stack';
import { UsersServiceStack } from '../lib/users-service-stack';
import { NotificationsServiceStack } from '../lib/notifications-service-stack';


const app = new cdk.App();

const usersStack = new UsersServiceStack(app, 'UsersServiceStack');
const notificationsStack = new NotificationsServiceStack(app, 'NotificationsServiceStack');

new PipelineStack(app, 'PipelineStack', {
    usersStack,
    notificationsStack
});

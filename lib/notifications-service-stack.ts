import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { Runtime } from '@aws-cdk/aws-lambda';

export class NotificationsServiceStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
  
      const addNotificationLambda = new NodejsFunction(this, 'add-notification', {
        entry: 'src/notifications-service/add-notification/lambda.ts',
        runtime: Runtime.NODEJS_12_X,
        memorySize: 512,
        minify: true
      })


    }
} 
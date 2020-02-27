import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';

export class UsersServiceStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
  
      const topic = new sns.Topic(this, 'UsersTopic', {
        displayName: 'Push notifications topic'
      }); 

    }
}  
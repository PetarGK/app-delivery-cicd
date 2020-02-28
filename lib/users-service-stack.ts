import * as cdk from '@aws-cdk/core';
import * as sam from '@aws-cdk/aws-sam';

export class UsersServiceStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      
      const myApp = new sam.CfnApplication(this, 'MyFirstApp', {
        location: {
          applicationId: 'arn:aws:serverlessrepo:us-east-1:009834006932:applications/sam-application-example',
          semanticVersion: '0.0.1'
        }
      })

    }
}  
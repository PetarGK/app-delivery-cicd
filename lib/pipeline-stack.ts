import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as ssm from '@aws-cdk/aws-ssm'
import * as targets from '@aws-cdk/aws-events-targets';
import * as sns from '@aws-cdk/aws-sns';
import * as events from '@aws-cdk/aws-events';
import { PipelineDeployStackAction } from '../constructs/pipeline-deploy-stack-action';

interface PipelineStackProps extends cdk.StackProps {
  usersStack: cdk.Stack,
  notificationsStack: cdk.Stack
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    
    const pipeline = new codepipeline.Pipeline(this, 'AppDeliveryPipeline', {
      pipelineName: 'app-delivery-cicd',
      restartExecutionOnUpdate: true
    });

    const repositoryUrl = ssm.StringParameter.fromStringParameterAttributes(this, 'GithubRepositoryName', {
      parameterName: '/app-delivery-cicd/RepositoryUrl',
    }).stringValue;      

    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'CodeSource',
      owner: 'PetarGK',
      repo: repositoryUrl,
      oauthToken: cdk.SecretValue.secretsManager('/app-delivery-cicd/GithubOAuthToken'),
      output: sourceOutput,
      branch: 'master', 
      trigger: codepipeline_actions.GitHubTrigger.WEBHOOK 
    })
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction]
    })


    const project = new codebuild.PipelineProject(this, 'CdkBuild', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
            install: {
              commands: 'npm install'
            },
            build: {
              commands: [
                'npm run build',
                'npm run cdk synth -- -o dist'
              ]
            }
        },
        artifacts: {
          'base-directory': 'dist',
          files: '**/*'
        }              
      })
    }) 
    
    const synthesizedApp = new codepipeline.Artifact();
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: sourceOutput,
      outputs: [synthesizedApp],
    })
    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction],
    })


    const selfUpdateAction = new PipelineDeployStackAction({
      changeSetName: 'selfUpdate',
      stack: this,
      input: synthesizedApp,
      adminPermissions: true,
    })
    pipeline.addStage({
      stageName: 'SelfUpdate',
      actions: [selfUpdateAction],
    })


    const usersServiceAction = new PipelineDeployStackAction({
      changeSetName: 'usersService',
      stack: props.usersStack,
      input: synthesizedApp,
      adminPermissions: true,
    })
    

    const notificationsServiceAction = new PipelineDeployStackAction({
      changeSetName: 'notificationsService',
      stack: props.notificationsStack,
      input: synthesizedApp,
      adminPermissions: true,
    })    

    const manualApprovalAction = new codepipeline_actions.ManualApprovalAction({
      actionName: 'Approve',
      notifyEmails: [
        'petar.korudzhiev@mentormate.com',
      ]
    })

    const deployStage = pipeline.addStage({
      stageName: 'Deploy',
      actions: [manualApprovalAction, usersServiceAction, notificationsServiceAction],
    })

    const pipelineNotificationsTopic = new sns.Topic(this, 'PipelineNotifications');
    const eventPipeline = events.EventField.fromPath('$.detail.pipeline');
    const eventState = events.EventField.fromPath('$.detail.state');

    pipeline.onStateChange('OnPipelineStateChange', {
      target: new targets.SnsTopic(pipelineNotificationsTopic, {
        message: events.RuleTargetInput.fromText(`Pipeline ${eventPipeline} changed state to ${eventState}`),
      })
    })
    
    
  }
}

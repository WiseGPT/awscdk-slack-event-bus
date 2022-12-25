// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Props for SlackEventsFunction
 */
export interface SlackEventsFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/lambdas/slack-events.
 */
export class SlackEventsFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: SlackEventsFunctionProps) {
    super(scope, id, {
      description: 'src/lambdas/slack-events.lambda.ts',
      ...props,
      runtime: new lambda.Runtime('nodejs18.x', lambda.RuntimeFamily.NODEJS),
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../assets/lambdas/slack-events.lambda')),
    });
    this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
  }
}
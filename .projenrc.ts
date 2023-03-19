import { awscdk, javascript } from "projen";
import { LambdaRuntime } from "projen/lib/awscdk";
import { NpmAccess } from "projen/lib/javascript";

const MIN_CDK_VERSION = "2.69.0";

const project = new awscdk.AwsCdkConstructLibrary({
  author: "Yiğitcan UÇUM",
  authorAddress: "yengas07+wisegpt@gmail.com",

  majorVersion: 1,

  name: "@wisegpt/awscdk-slack-event-bus",
  packageName: "@wisegpt/awscdk-slack-event-bus",
  npmAccess: NpmAccess.PUBLIC,
  description:
    "Exposes a Slack Events API Request URL that validates and sends all received events to an AWS Event Bus",
  keywords: [
    "aws",
    "cdk",
    "awscdk",
    "Amazon EventBridge",
    "slack",
    "events-api",
  ],

  workflowNodeVersion: "18.x",

  license: "Unlicense",

  cdkVersion: MIN_CDK_VERSION,
  defaultReleaseBranch: "main",

  lambdaOptions: {
    runtime: LambdaRuntime.NODEJS_18_X,
    bundlingOptions: {
      externals: ["@aws-sdk/*", "@aws-cdk/*"],
    },
  },

  github: true,
  release: true,
  packageManager: javascript.NodePackageManager.NPM,

  prettier: true,
  projenrcTs: true,
  repositoryUrl: "https://github.com/wisegpt/awscdk-slack-event-bus.git",

  peerDeps: [
    `@aws-cdk/aws-apigatewayv2-alpha@^${MIN_CDK_VERSION}-alpha.0`,
    `@aws-cdk/aws-apigatewayv2-integrations-alpha@^${MIN_CDK_VERSION}-alpha.0`,
  ],
  devDeps: [
    "@types/aws-lambda",
    "@aws-sdk/client-secrets-manager",
    "@aws-sdk/client-eventbridge",
  ],
});

project.npmignore?.exclude(
  "/lib/internal/**",
  ".DS_Store",
  ".prettier*",
  "*.iml",
  ".projenrc.ts",
  ".git*"
);

project.synth();

import { awscdk, javascript } from "projen";
import { LambdaRuntime } from "projen/lib/awscdk";

const project = new awscdk.AwsCdkConstructLibrary({
  author: "Yiğitcan UÇUM",
  authorAddress: "yengas07+wisegpt@gmail.com",

  name: "@wisegpt/awscdk-slack-event-bus",
  packageName: "@wisegpt/awscdk-slack-event-bus",
  description:
    "Exposes a Slack Events API Request URL that validates and sends all received events to an AWS Event Bus",

  cdkVersion: "2.56.0",
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

  deps: [
    "@aws-cdk/aws-apigatewayv2-alpha",
    "@aws-cdk/aws-apigatewayv2-integrations-alpha",
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

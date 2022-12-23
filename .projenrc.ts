import { awscdk, javascript } from "projen";
const project = new awscdk.AwsCdkConstructLibrary({
  author: "Yiğitcan UÇUM",
  authorAddress: "yigitcan@hotmail.com.tr",
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  github: true,
  name: "awscdk-slack-event-bus",
  packageManager: javascript.NodePackageManager.NPM,
  prettier: true,
  projenrcTs: true,
  release: true,
  repositoryUrl: "https://github.com/yigitcan/awscdk-slack-event-bus.git",

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();

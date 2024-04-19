import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.134.0',
  defaultReleaseBranch: 'main',
  name: 'apigateway',
  projenrcTs: true,

  deps: [
    '@types/aws-lambda',
    '@aws-lite/client',
    '@aws-lite/dynamodb',
  ],
  devDeps: [
    '@aws-lite/dynamodb-types',
    'ts-jest-mocker',
  ],
  tsconfigDev: {
    compilerOptions: {
      types: [
        '@aws-lite/dynamodb-types',
        'jest',
      ],
      emitDecoratorMetadata: true,
    },
  },
});
project.synth();

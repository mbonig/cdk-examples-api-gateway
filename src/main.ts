import { App } from 'aws-cdk-lib';
import { ApiStage } from './stages/ApiStage';

const app = new App();

new ApiStage(app, 'apigateway', {
  env: {
    account: '012345678901',
    region: 'us-east-1',
  },
  hostedZoneId: 'Z0123456789ABCDEFGHIJ',
});

app.synth();

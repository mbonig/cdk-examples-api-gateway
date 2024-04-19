import { Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Trigger } from 'aws-cdk-lib/triggers';
import { Construct } from 'constructs';
import { API_ENDPOINT } from './GetOrderTest.Resource';

export interface GetOrderTestProps {
  apiEndpoint: string;
}

export class GetOrderTest extends Construct {
  constructor(scope: Construct, id: string, props: GetOrderTestProps) {
    super(scope, id);
    let handler = new NodejsFunction(this, 'Resource', {
      runtime: Runtime.NODEJS_20_X,
      environment: {
        [API_ENDPOINT]: props.apiEndpoint,
      },
      timeout: Duration.seconds(10),
    });

    new Trigger(this, 'Trigger', {
      handler: handler,
    });
  }

}

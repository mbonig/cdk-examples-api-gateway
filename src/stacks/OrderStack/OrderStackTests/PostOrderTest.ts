import { Duration } from 'aws-cdk-lib';
import { ITableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Trigger } from 'aws-cdk-lib/triggers';
import { Construct } from 'constructs';
import { API_ENDPOINT, TABLE_NAME } from './PostOrderTest.Resource';

export interface PostOrderTestProps {
  apiEndpoint: string;
  table: ITableV2;
}

export class PostOrderTest extends Construct {
  constructor(scope: Construct, id: string, props: PostOrderTestProps) {
    super(scope, id);

    let handler = new NodejsFunction(this, 'Resource', {
      runtime: Runtime.NODEJS_20_X,
      environment: {
        [TABLE_NAME]: props.table.tableName,
        [API_ENDPOINT]: props.apiEndpoint,
      },
      timeout: Duration.seconds(10),

    });

    props.table.grant(handler, 'dynamodb:DeleteItem', 'dynamodb:Query');

    new Trigger(this, 'Trigger', {
      handler: handler,
    });
  }

}

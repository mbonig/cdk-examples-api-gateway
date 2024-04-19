import { StackProps } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';

export interface RestResourceProps extends StackProps {
  readonly api: RestApi;
  readonly table: TableV2;
}

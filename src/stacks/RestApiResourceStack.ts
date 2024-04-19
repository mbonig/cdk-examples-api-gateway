import { Stack } from 'aws-cdk-lib';
import { IRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { RestResourceProps } from './RestResourceStackProps';

export class RestApiResourceStack extends Stack {
  protected api: IRestApi;

  constructor(scope: Construct, id: string, props: RestResourceProps) {
    super(scope, id, props);

    this.api = RestApi.fromRestApiAttributes(this, 'RestApi', {
      restApiId: props.api.restApiId,
      rootResourceId: props.api.restApiRootResourceId,
    });

  }
}

import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { INDEX_NAME, TABLE_NAME } from './PersonStack.GetPersonHandler';
import { RestApiResourceStack } from '../RestApiResourceStack';
import { RestResourceProps } from '../RestResourceStackProps';

export interface PersonStackProps extends RestResourceProps {
}

export class PersonStack extends RestApiResourceStack {

  public deploymentDependencies: any[] = [];

  constructor(scope: Construct, id: string, props: PersonStackProps) {
    super(scope, id, props);

    const indexName = 'people';
    const getHandler = new NodejsFunction(this, 'GetPersonHandler', {
      environment: {
        [TABLE_NAME]: props.table.tableName,
        [INDEX_NAME]: indexName,
      },
    });
    props.table.grantReadData(getHandler);

    const personResource = this.api.root.addResource('person', {});

    const getMethod = personResource.addMethod('GET', new LambdaIntegration(getHandler));

    const getByIdMethod = personResource
      .addResource('{id}', {})
      .addMethod('GET', new LambdaIntegration(getHandler));

    props.table.addGlobalSecondaryIndex({
      indexName: indexName,
      partitionKey: {
        name: 'personId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },
    });

    this.deploymentDependencies.push({ method: getMethod.methodId }, { method: getByIdMethod.methodId });
  }

}

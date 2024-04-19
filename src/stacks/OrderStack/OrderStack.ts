import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { INDEX_NAME as GET_INDEX_NAME, TABLE_NAME as GET_TABLE_NAME } from './OrderStack.GetOrderHandler';
import { INDEX_NAME as POST_INDEX_NAME, TABLE_NAME as POST_TABLE_NAME } from './OrderStack.PostOrderHandler';
import { OrderStackTests } from './OrderStackTests/OrderStackTests';
import { RestApiResourceStack } from '../RestApiResourceStack';
import { RestResourceProps } from '../RestResourceStackProps';

interface OrderStackProps extends RestResourceProps {
}

export class OrderStack extends RestApiResourceStack {
  public deploymentDependencies: any[] = [];

  constructor(scope: Construct, id: string, props: OrderStackProps) {
    super(scope, id, props);
    const indexName = 'orders';

    const getHandler = new NodejsFunction(this, 'GetOrderHandler', {
      environment: {
        [GET_TABLE_NAME]: props.table.tableName,
        [GET_INDEX_NAME]: indexName,
      },
    });

    const postHandler = new NodejsFunction(this, 'PostOrderHandler', {
      environment: {
        [POST_TABLE_NAME]: props.table.tableName,
        [POST_INDEX_NAME]: indexName,
      },
    });
    props.table.grantReadWriteData(postHandler);
    props.table.grantReadData(getHandler);

    const orderResource = this.api.root.addResource('order', {});
    const getMethod = orderResource.addMethod('GET', new LambdaIntegration(getHandler));
    const postMethod = orderResource.addMethod('POST', new LambdaIntegration(postHandler));

    const getByIdMethod = orderResource
      .addResource('{id}', {})
      .addMethod('GET', new LambdaIntegration(getHandler));

    props.table.addGlobalSecondaryIndex({
      indexName: indexName,
      partitionKey: {
        name: 'orderId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },
    });

    new OrderStackTests(this, 'Tests', {
      getOptions: {
        apiEndpoint: 'https://api.example.matthewbonig.com/v1/order/',
      },
      postOptions: {
        apiEndpoint: 'https://api.example.matthewbonig.com/v1/order/',
        table: props.table,
      },
    });

    this.deploymentDependencies.push(
      { method: getMethod.methodId },
      { method: getByIdMethod.methodId },
      { method: postMethod.methodId },
    );
  }
}

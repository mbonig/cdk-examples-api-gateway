import { APIGatewayEvent } from 'aws-lambda';
import { IOrderApplication, OrderApplication } from './OrderApplication';
import { OrderRepository } from './OrderRepository';
import { DynamoDBAdapter } from '../common/IDatabaseAdapter';

export const INDEX_NAME = 'INDEX_NAME';
export const TABLE_NAME= 'TABLE_NAME';

export const handler = async (event: APIGatewayEvent) => {
  console.log(JSON.stringify(event, null, 2));

  const indexName = process.env[INDEX_NAME]!;
  const tableName = process.env[TABLE_NAME]!;

  const orderApplication: IOrderApplication = new OrderApplication(
    new OrderRepository(
      new DynamoDBAdapter(tableName),
      indexName,
    ),
  );

  if (event.pathParameters?.id) {
    const id = event.pathParameters.id;
    const person = await orderApplication.getById(id);
    if (!person) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Order not found' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(person),
    };
  }

  const orders = await orderApplication.getAll();
  return {
    statusCode: 200,
    body: JSON.stringify(orders),
  };
};

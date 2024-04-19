import { APIGatewayEvent } from 'aws-lambda';
import { Order, OrderApplication } from './OrderApplication';
import { OrderRepository } from './OrderRepository';
import { DynamoDBAdapter } from '../common/IDatabaseAdapter';

export const TABLE_NAME = 'TABLE_NAME';
export const INDEX_NAME = 'INDEX_NAME';

export const handler = async (event: APIGatewayEvent) => {
  console.log(JSON.stringify(event, null, 2));

  const indexName = process.env[INDEX_NAME]!;
  const tableName = process.env[TABLE_NAME]!;

  const orderApplication = new OrderApplication(
    new OrderRepository(
      new DynamoDBAdapter(tableName),
      indexName,
    ),
  );

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing request body' }),
    };
  }
  const newOrder = await orderApplication.save( JSON.parse(event.body!) as Order);
  return {
    statusCode: 200,
    body: JSON.stringify(newOrder),
  };
};

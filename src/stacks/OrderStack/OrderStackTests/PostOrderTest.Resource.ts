import awsLite from '@aws-lite/client';
import { Order } from '../OrderApplication';

export const API_ENDPOINT = 'API_ENDPOINT';
export const TABLE_NAME = 'TABLE_NAME';


export const handler = async () => {
  const api = process.env[API_ENDPOINT]!;
  const tableName = process.env[TABLE_NAME]!;

  console.log('Making API request to: ', api);

  const startTime = new Date();
  const value: Order = {
    personId: 'mtb',
    items: [{
      productId: 'bike',
      price: 50,
      quantity: 1,
    }],
    orderTotal: 50,
  };
  const results = await fetch(api, {
    method: 'POST',
    body: JSON.stringify(value),
  });
  const stopTime = new Date();
  console.log(`API request took: ${stopTime.getTime() - startTime.getTime()}ms`);
  console.log('results: ', results);
  if (!results.ok) {
    console.log('Failed to fetch data from API', results.status, results.statusText);
    throw new Error(`Failed to fetch data from API: ${results.status} | ${results.statusText}`);
  }
  let newOrder: Order = await results.json() as Order;
  console.log(JSON.stringify(newOrder, null, 2));
  console.log('Order was processed properly, deleting it now...');

  const awsClient: any = await awsLite({
    region: process.env.AWS_REGION,
    // @ts-ignore
    plugins: [await import('@aws-lite/dynamodb')],
  });
  const existingItems: any = await awsClient.DynamoDB.Query({
    IndexName: 'orders',
    TableName: tableName,
    KeyConditionExpression: '#pk = :orderId',
    ExpressionAttributeNames: {
      '#pk': 'orderId',
    },
    ExpressionAttributeValues: {
      ':orderId': newOrder.orderId,
    },
  });
  for (const item of existingItems.Items) {
    await awsClient.DynamoDB.DeleteItem({
      TableName: tableName,
      Key: { pk: item.pk, sk: item.sk },
    });
  }

  console.log('Order deleted!');

  return results;
};

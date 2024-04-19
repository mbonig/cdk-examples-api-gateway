import { Order } from '../OrderApplication';

export const API_ENDPOINT = 'API_ENDPOINT';
export const TABLE_NAME = 'TABLE_NAME';

async function testOrders(api: string) {
  console.log('Making API request to: ', api);
  const startTime = new Date();
  const results = await fetch(api);
  const stopTime = new Date();
  console.log(`API request took: ${stopTime.getTime() - startTime.getTime()}ms`);
  console.log('results: ', results);
  if (!results.ok) {
    console.log('Failed to fetch data from API', results.status, results.statusText);
    throw new Error(`Failed to fetch data from API: ${results.status} | ${results.statusText}`);
  }
  let orders: Order[] = await results.json() as Order[];
  console.log(JSON.stringify(orders, null, 2));
  return { orders };
}

async function testOrder(api: string, order: Order) {
  console.log('Found some orders, so going to query one specifically');
  const startTime = new Date();
  const results = await fetch(`${api}${order.orderId}`);
  const stopTime = new Date();
  console.log(`API request took: ${stopTime.getTime() - startTime.getTime()}ms`);
  console.log('results: ', results);
}

export const handler = async (event: any) => {
  console.log(JSON.stringify(event, null, 2));
  const api = process.env[API_ENDPOINT]!;

  const { orders } = await testOrders(api);

  if (orders.length !== 0) {
    await testOrder(api, orders[0]);
  } else {
    console.warn('No orders found in the system. Skipping test.');
  }
};

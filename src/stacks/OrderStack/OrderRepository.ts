import { Order } from './OrderApplication';
import { IDatabaseAdapter, TableModel } from '../common/IDatabaseAdapter';
import { IDatabaseRepository } from '../PersonStack/DatabaseRepository';

export interface IOrderRepository extends IDatabaseRepository<Order> {
}

export class OrderRepository implements IOrderRepository {
  constructor(private databaseAdapter: IDatabaseAdapter, private indexName: string) {

  }

  async get(id: string): Promise<Order> {
    const orderAndLineItems = await this.databaseAdapter.queryItem(id);
    return this.map(orderAndLineItems);
  }

  async getAll(): Promise<Order[]> {
    const ordersAndLines = await this.databaseAdapter.getAll(this.indexName);
    const orders = ordersAndLines.reduce((acc, item) => {
      if (!acc[item.pk]) {
        acc[item.pk] = [];
      }
      acc[item.pk].push(item);
      return acc;
    }, {} as { [key: string]: TableModel[] });
    return Object.values(orders).map(order => this.map(order));
  }

  async save(order: Order): Promise<Order> {
    await this.databaseAdapter.putItem({
      pk: order.orderId,
      sk: 'header',
      orderTotal: order.orderTotal,
      orderId: order.orderId,
      personId: order.personId,
    });
    let i = 1;
    for (const item of order.items) {
      await this.databaseAdapter.putItem({
        pk: order.orderId,
        sk: `line#${i.toString().padStart(3, '0')}`,
        orderId: order.orderId,
        ...item,
      });
      i++;
    }

    return order;
  }

  private map(orderAndLineItems: TableModel[]) {
    const header = orderAndLineItems.find(item => item.sk === 'header')!;
    const lineItems = orderAndLineItems.filter(item => item.sk !== 'header')!;

    return {
      orderId: header.pk,
      personId: header.personId,
      items: lineItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      orderTotal: header.orderTotal,
    };
  }
}

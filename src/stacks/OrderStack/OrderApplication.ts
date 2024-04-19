import { IOrderRepository } from './OrderRepository';
import { IdentifiableModel } from '../common/handlers/IdentifiableModel';

export interface OrderLineItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order extends IdentifiableModel {
  personId: string;
  items: OrderLineItem[];
  orderTotal: number;
}


export interface IOrderApplication {
  getById(id: string): Promise<Order>;

  getAll(): Promise<Order[]>;
}

export class OrderApplication implements IOrderApplication {
  constructor(private orderRepository: IOrderRepository) {}

  getAll(): Promise<Order[]> {
    return this.orderRepository.getAll();
  }

  getById(id: string): Promise<Order> {
    return this.orderRepository.get(id);
  }

  async save(order: Partial<Order>) {
    this.validateOrder(order);
    return this.orderRepository.save({
      orderId: `order-${order.personId}-${new Date().toISOString()}`,
      personId: order.personId!,
      items: order.items!,
      orderTotal: order.orderTotal!,
    });
  }

  private validateOrder(order: Partial<Order>) {
    if (!order.personId) {
      throw new Error('Please provide a personId');
    }
    if (!order.items || order.items.length === 0) {
      throw new Error('Please provide at least one item');
    }
  }
}

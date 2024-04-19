import { mock } from 'ts-jest-mocker';
import { IDatabaseAdapter } from '../../../src/stacks/common/IDatabaseAdapter';
import { OrderRepository } from '../../../src/stacks/OrderStack/OrderRepository';

describe('OrderRepository', () => {
  describe('save', () => {
    const mockDatabaseAdapter = mock<IDatabaseAdapter>();
    mockDatabaseAdapter.putItem.mockResolvedValue();
    const repository = new OrderRepository(mockDatabaseAdapter, 'index');

    test('saves separate records', async () => {
      // arrange

      // act
      await repository.save({
        orderId: 'order-1',
        personId: 'mtb',
        orderTotal: 100,
        items: [{
          productId: 'product-6789',
          quantity: 1,
          price: 100,
        }],
      });

      // assert
      expect(mockDatabaseAdapter.putItem).toHaveBeenNthCalledWith(1, {
        pk: 'order-1',
        sk: 'header',
        personId: 'mtb',
        orderId: 'order-1',
        orderTotal: 100,
      });

      expect(mockDatabaseAdapter.putItem).toHaveBeenNthCalledWith(2, {
        pk: 'order-1',
        sk: 'line#001',
        orderId: 'order-1',
        productId: 'product-6789',
        quantity: 1,
        price: 100,
      });
    });

  });

  describe('get', () => {
    const mockDatabaseAdapter = mock<IDatabaseAdapter>();
    mockDatabaseAdapter.queryItem.mockResolvedValue([
      {
        pk: 'order-1',
        sk: 'header',
        personId: 'mtb',
        orderTotal: 100,
      },
      {
        pk: 'order-1',
        sk: 'line#01',
        productId: 'product-6789',
        quantity: 1,
        price: 100,
      },
    ]);
    const orderRepository = new OrderRepository(mockDatabaseAdapter, 'index');


    test('maps the object accordingly', async () => {
      // arrange

      // act
      const person = await orderRepository.get('order-1');

      expect(person).toEqual({
        orderId: 'order-1',
        personId: 'mtb',
        orderTotal: 100,
        items: [{
          productId: 'product-6789',
          quantity: 1,
          price: 100,
        }],
      });

      expect(mockDatabaseAdapter.queryItem).toHaveBeenCalledWith('order-1');
    });
  });

  describe('getAll', () => {
    const mockDatabaseAdapter = mock<IDatabaseAdapter>();
    mockDatabaseAdapter.getAll.mockResolvedValue([
      {
        pk: 'order-1',
        sk: 'header',
        orderId: 'order-1',
        personId: 'mtb',
        orderTotal: 100,
      },
      {
        pk: 'order-2',
        sk: 'header',
        orderId: 'order-2',
        personId: 'mnb',
        orderTotal: 110,
      },
      {
        pk: 'order-1',
        sk: 'line#01',
        productId: 'product-6789',
        quantity: 1,
        price: 100,
      },
      {
        pk: 'order-2',
        sk: 'line#01',
        productId: 'product-6789',
        quantity: 1,
        price: 110,
      },
    ]);
    const orderRepository = new OrderRepository(mockDatabaseAdapter, 'index');

    test('removes the pk and turns the sk into an id', async () => {
      // arrange

      // act
      const people = await orderRepository.getAll();

      expect(people[0]).toEqual({
        orderId: 'order-1',
        personId: 'mtb',
        items: [{
          productId: 'product-6789',
          quantity: 1,
          price: 100,
        }],
        orderTotal: 100,
      });
      expect(people[1]).toEqual({
        orderId: 'order-2',
        personId: 'mnb',
        items: [{
          productId: 'product-6789',
          quantity: 1,
          price: 110,
        }],
        orderTotal: 110,
      });
    });
  });
});

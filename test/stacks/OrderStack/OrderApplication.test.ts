import { mock } from 'ts-jest-mocker';
import { Order, OrderApplication } from '../../../src/stacks/OrderStack/OrderApplication';
import { IOrderRepository } from '../../../src/stacks/OrderStack/OrderRepository';


describe('OrderApplication', () => {
  beforeAll(() => {
    jest.useFakeTimers({
      now: new Date(2024, 3, 1, 0, 0, 0, 0),
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  const mockRepository = mock<IOrderRepository>();
  const application = new OrderApplication(mockRepository);

  describe('validate', ()=> {
    test('throws if no personId', async () => {
      await expect( () => application.save({
        personId: '',
        items: [{
          productId: 'bike',
          price: 50,
          quantity: 1,
        }],
        orderTotal: 100,
      }))
        .rejects
        .toThrow('Please provide a personId');
    });

    test('throws if no items', async () => {
      await expect( () => application.save({
        personId: 'something',
        items: [],
        orderTotal: 100,
      }))
        .rejects
        .toThrow('Please provide at least one item');
    });
  });

  describe('save', () => {
    mockRepository.save.mockResolvedValue({
      orderId: 'order-mtb-2024-04-01T06:00:00.000Z',
      personId: 'mtb',
      items: [{
        productId: 'bike',
        price: 50,
        quantity: 1,
      }],
      orderTotal: 100,
    });

    test('writes to repository with a generated id', async () => {
      // arrange
      let exampleOrder: Order = {
        personId: 'mtb',
        items: [{
          productId: 'bike',
          price: 50,
          quantity: 1,
        }],
        orderTotal: 100,
      };

      // act
      await application.save(exampleOrder);

      // assert
      expect(mockRepository.save).toHaveBeenCalledWith({
        orderId: 'order-mtb-2024-04-01T06:00:00.000Z',
        personId: 'mtb',
        items: [{
          productId: 'bike',
          price: 50,
          quantity: 1,
        }],
        orderTotal: 100,
      });
    });
  });
});

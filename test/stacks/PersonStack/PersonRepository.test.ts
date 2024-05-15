import { mock } from 'ts-jest-mocker';
import { IDatabaseAdapter } from '../../../src/stacks/common/IDatabaseAdapter';
import { PersonRepository } from '../../../src/stacks/PersonStack/PersonRepository';

describe('PersonRepository', () => {
  describe('get', () => {
    const mockDatabaseAdapter = mock<IDatabaseAdapter>();
    mockDatabaseAdapter.getItem.mockResolvedValue({
      sk: 'person-Doe-John',
      pk: 'dontshowupanywhere',
      firstName: 'John',
      lastName: 'Doe',
    });
    const personRepository = new PersonRepository(mockDatabaseAdapter, 'index');


    test('removes the pk and turns the sk into an id', async () => {
      // arrange

      // act
      const person = await personRepository.get('person-Doe-John');

      expect(person).toEqual({
        personId: 'person-Doe-John',
        firstName: 'John',
        lastName: 'Doe',
      });
    });
  });

  describe('getAll', () => {
    const mockDatabaseAdapter = mock<IDatabaseAdapter>();
    mockDatabaseAdapter.getAll.mockResolvedValue([
      {
        sk: 'person-Doe-John',
        pk: 'person',
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        sk: 'person-Doe-Jane',
        pk: 'person',
        firstName: 'Jane',
        lastName: 'Doe',
      },
    ]);
    const personRepository = new PersonRepository(mockDatabaseAdapter, 'index');

    test('removes the pk and turns the sk into an id', async () => {
      // arrange

      // act
      const people = await personRepository.getAll();

      expect(people[0]).toEqual({
        personId: 'person-Doe-John',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(people[1]).toEqual({
        personId: 'person-Doe-Jane',
        firstName: 'Jane',
        lastName: 'Doe',
      });
    });
  });
});

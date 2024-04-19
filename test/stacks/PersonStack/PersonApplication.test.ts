import { mock } from 'ts-jest-mocker';
import { PersonApplication } from '../../../src/stacks/PersonStack/PersonApplication';
import { IPersonRepository } from '../../../src/stacks/PersonStack/PersonRepository';


describe('PersonApplication', () => {

  const mockPersonRepository = mock<IPersonRepository>();
  const application = new PersonApplication(mockPersonRepository);

  const stubPerson1 = {
    personId: 'person-Doe-John',
    firstName: 'John',
    lastName: 'Doe',
  };
  const stubPerson2 = {
    personId: 'person-Doe-Jane',
    firstName: 'Jane',
    lastName: 'Doe',
  };

  describe('get', () => {
    mockPersonRepository.get.mockResolvedValue(stubPerson1);

    test('byId', async () => {
      // arrange
      // act
      let onePerson = await application.getById(stubPerson1.personId);

      // assert
      expect(onePerson).toEqual(stubPerson1);
    });
  });
  describe('getAll', () => {
    mockPersonRepository.getAll.mockResolvedValue([stubPerson1, stubPerson2]);

    test('all', async () => {
      // arrange
      // act
      let persons = await application.getAll();

      // assert
      expect(persons).toEqual([stubPerson1, stubPerson2]);
    });
  });
});

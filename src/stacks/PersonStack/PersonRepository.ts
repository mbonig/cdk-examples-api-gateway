import { IDatabaseRepository } from './DatabaseRepository';
import { Person } from './Models';
import { IDatabaseAdapter, TableModel } from '../common/IDatabaseAdapter';


export interface IPersonRepository extends IDatabaseRepository<Person> {

}

export class PersonRepository implements IPersonRepository {
  constructor(private databaseAdapter: IDatabaseAdapter, private indexName: string) {

  }

  async getAll(): Promise<Person[]> {
    let people = await this.databaseAdapter.getAll(this.indexName);

    return people.map((person: TableModel) => ({
      id: person.sk,
      firstName: person.firstName,
      lastName: person.lastName,
    }));
  }

  async get(id: string): Promise<Person> {
    const person = await this.databaseAdapter.getItem(id, id);
    return { personId: person.sk, firstName: person.firstName, lastName: person.lastName };
  }

  async save(data: Person): Promise<Person> {
    const person: Person = {
      ...data,
    };
    await this.databaseAdapter.putItem({ pk: 'person', sk: person.personId, ...person });
    return person;
  }
}


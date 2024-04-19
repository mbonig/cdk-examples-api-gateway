import { Person } from './Models';
import { IPersonRepository } from './PersonRepository';

export interface IPersonApplication {
  getById(id: string): Promise<Person>;

  getAll(): Promise<Person[]>;

}

export class PersonApplication implements IPersonApplication {
  constructor(private personRepository: IPersonRepository) {
  }


  async getById(id: string): Promise<Person> {
    if (!id) {
      throw new Error('Please provide an id');
    }
    return this.personRepository.get(id);
  }

  async getAll(): Promise<Person[]> {
    return this.personRepository.getAll();
  }

}

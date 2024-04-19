import { IdentifiableModel } from '../common/handlers/IdentifiableModel';

export interface IDatabaseRepository<ModelType extends IdentifiableModel> {
  get(id: string): Promise<ModelType>;

  getAll(): Promise<ModelType[]>;

  save(data: ModelType): Promise<ModelType>;
}

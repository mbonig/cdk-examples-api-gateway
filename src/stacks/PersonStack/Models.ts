import { IdentifiableModel } from '../common/handlers/IdentifiableModel';

export interface Person extends IdentifiableModel {
  firstName: string;
  lastName: string;
}


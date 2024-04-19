export interface IdentifiableModel {
  [key: `${string}Id`]: string;
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

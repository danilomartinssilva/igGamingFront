export interface IClient {
  id?: number;
  name: string;
  email: string;
  phone: string;
  balance: number;
  currency: string;
  status: boolean;
  birthday: Date;
}

export interface IPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

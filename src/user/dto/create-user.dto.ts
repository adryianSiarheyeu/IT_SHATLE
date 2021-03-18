import { IAddress } from '../interfaces/address.interface';

export class CreateUserDto {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly gender: string;
  readonly password: string;
  readonly address: IAddress;
  readonly phone: string;
  readonly roles: Array<string>;
}

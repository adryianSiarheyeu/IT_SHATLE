import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async create(createUserDto: CreateUserDto, roles?: Array<string>): Promise<IUser> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(createUserDto.password, salt);

    const createdUser = new this.userModel(_.assignIn(createUserDto, { password: hash, roles }));

    if (createdUser) {
      return await createdUser.save();
    }

    throw new BadRequestException('kek');
  }

  async findById(id: string): Promise<IUser> {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<IUser> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<IUser[]> {
    return await this.userModel.find().exec();
  }
}

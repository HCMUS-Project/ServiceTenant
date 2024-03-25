import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/models/user/interfaces/user.interface';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@Inject('USER_MODEL') private readonly UserModel: Model<User>) {}

    async findAll(): Promise<User[]> {
        return await this.UserModel.find().exec();
    }

    async findByObjectId(id: string): Promise<User> {
        return await this.UserModel.findById(id);
    }

    async findById(user_id: string): Promise<User> {
        return await this.UserModel.findOne({ user_id }).exec();
    }

    async findByEmail(email: string): Promise<User> {
        return await this.UserModel.findOne({ email }).exec();
    }

    // async update(
    //   id: string,
    //   updateUserDto: UpdateUserDto,
    // ): Promise<UserDocument> {
    //   return this.userModel
    //     .findByIdAndUpdate(id, updateUserDto, { new: true })
    //     .exec();
    // }

    async remove(id: string): Promise<User> {
        return this.UserModel.findByIdAndDelete(id).exec();
    }
}

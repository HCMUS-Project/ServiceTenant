import * as mongoose from 'mongoose';
import { User as UserInterface } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

export const UserSchema = new mongoose.Schema<UserInterface>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            default: () => uuidv4(),
            unique: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

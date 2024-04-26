import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Token } from '../interfaces/token.interface';

export const TokenSchema = new mongoose.Schema<Token>(
    {
        id: {
            type: String,
            default: () => uuidv4(),
            unique: true,
        },

        access_token: {
            type: String,
            required: true,
        },

        refresh_token: {
            type: String,
            required: true,
        },

        user_id: {
            type: String,
            ref: 'users',
            required: true,
        },
        device_id: {
            type: String,
            required: true,
        },
        access_token_expired_at: {
            type: Date,
        },
        refresh_token_expired_at: {
            type: Date,
        },
    },
    { timestamps: true },
);

import { Document } from 'mongoose';

export interface user extends Document {
    readonly email: string;
    readonly password: string;
}

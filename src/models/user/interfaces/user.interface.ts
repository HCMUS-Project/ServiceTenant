import { Document } from 'mongoose';

export interface User extends Document {
    readonly email: string;
    readonly password: string;
    readonly user_id: string;
    readonly is_deleted: boolean;
    readonly is_active: boolean;
}

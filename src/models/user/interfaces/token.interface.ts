import * as mongoose from 'mongoose';

export interface Token extends Document {
    readonly id: string;
    readonly access_token: string;
    readonly refresh_token: string;
    readonly user_id: string;
    readonly device_id: string;
    readonly access_token_expired_at: Date;
    readonly refresh_token_expired_at: Date;
}

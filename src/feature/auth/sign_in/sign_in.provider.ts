import { Mongoose } from 'mongoose';
import { UserSchema } from '../../../models/user/schemas/user.schema';

export const signInProviders = [
    {
        provide: 'USER_MODEL',
        useFactory: (mongoose: Mongoose) => mongoose.model('user', UserSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];

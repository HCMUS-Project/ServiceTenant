import { Mongoose } from 'mongoose';
import { TokenSchema } from 'src/models/user/schemas/token.schema';
import { UserSchema } from 'src/models/user/schemas/user.schema';

export const UserProviders = [
    {
        provide: 'USER_MODEL',
        useFactory: (mongoose: Mongoose) => mongoose.model('user', UserSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];

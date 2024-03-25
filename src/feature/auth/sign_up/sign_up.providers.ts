import { Mongoose } from 'mongoose';
import { UserSchema } from 'src/models/user/schemas/user.schema';

export const signUpProviders = [
    {
        provide: 'SIGN_UP_MODEL',
        useFactory: (mongoose: Mongoose) => mongoose.model('user', UserSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];

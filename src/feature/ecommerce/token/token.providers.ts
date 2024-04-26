import { Mongoose } from 'mongoose';
import { TokenSchema } from 'src/models/user/schemas/token.schema';
import { UserSchema } from 'src/models/user/schemas/user.schema';

export const TokenProviders = [
    {
        provide: 'TOKEN_MODEL',
        useFactory: (mongoose: Mongoose) => mongoose.model('token', TokenSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];

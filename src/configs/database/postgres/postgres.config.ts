/**
 * @fileoverview postgres.config - Configuration for mongo database
 */

export default () => ({
    port: parseInt(process.env.MONGO_PORT, 10) || 5432,
    host: process.env.MONGO_HOST || 'localhost',
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
    database: process.env.MONGO_DATABASE,
});

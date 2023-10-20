import {Redis} from 'ioredis';
require('dotenv').config();

const connectRedis = () => {
    if(process.env.REDIS_URL){
        console.log(`Redis connection success`);
        return process.env.REDIS_URL;
    }
    throw new Error('Redis connection fail');
};

export const redis = new Redis(connectRedis());

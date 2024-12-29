import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
    const redisPort = this.configService.get<number>('REDIS_PORT', 6379);

    this.client = new Redis({
      host: redisHost,
      port: redisPort,
    });

    this.client.on('connect', () => {
      console.log(`Connected to Redis at ${redisHost}:${redisPort}`);
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async get(key: string): Promise<string | null> {
    console.log(`Fetching from cache with key: ${key}`);
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    console.log(`Saving to cache with key: ${key}, value: ${value}`);
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    console.log(`Deleting cache with key: ${key}`);
    await this.client.del(key);
  }

  async flushAll(): Promise<void> {
    console.log('Flushing all cache');
    await this.client.flushall();
  }
}

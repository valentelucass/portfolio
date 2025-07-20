import { CacheEntry } from '@/types';
import { logger } from './logger';

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private defaultTtl: number;

  constructor(maxSize: number = 100, defaultTtl: number = 3600000) {
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtl;
  }

  set<T>(key: string, data: T, ttl: number = this.defaultTtl): void {
    // Limpar cache se estiver cheio
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(key, entry);
    logger.debug('Cache entry set', { key, ttl });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      logger.debug('Cache miss', { key });
      return null;
    }

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      logger.debug('Cache entry expired', { key });
      return null;
    }

    logger.debug('Cache hit', { key });
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug('Cache entry deleted', { key });
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      logger.debug('Evicted oldest cache entry', { key: oldestKey });
    }
  }

  // Método para limpar entradas expiradas
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info('Cache cleanup completed', { cleanedCount });
    }

    return cleanedCount;
  }

  // Método para obter estatísticas do cache
  getStats() {
    const now = Date.now();
    let expiredCount = 0;
    let totalSize = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++;
      }
      totalSize += JSON.stringify(entry.data).length;
    }

    return {
      totalEntries: this.cache.size,
      expiredEntries: expiredCount,
      validEntries: this.cache.size - expiredCount,
      maxSize: this.maxSize,
      usagePercentage: (this.cache.size / this.maxSize) * 100,
      totalSizeBytes: totalSize,
    };
  }
}

// Instância global do cache
export const cacheManager = new CacheManager();

// Cache específico para dados do GitHub
export const githubCache = new CacheManager(50, 1800000); // 30 minutos TTL

// Cache específico para dados de projetos
export const projectsCache = new CacheManager(20, 3600000); // 1 hora TTL

// Cache específico para dados de skills
export const skillsCache = new CacheManager(10, 7200000); // 2 horas TTL 
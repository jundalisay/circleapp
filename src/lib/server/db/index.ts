// import { dev } from '$app/environment';
// import { drizzle } from 'drizzle-orm/libsql';
// import { createClient } from '@libsql/client';
// import * as schema from './schema';
// import { env } from '$env/dynamic/private';

// if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
// if (!dev && !env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

// const client = createClient({
// 	url: process.env.DATABASE_URL || 'file:local.db',
// 	// url: env.DATABASE_URL,
// 	authToken: env.DATABASE_AUTH_TOKEN
// });

// export const db = drizzle(client, { schema });


import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Lazy initialization to use runtime environment variables
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!dbInstance) {
    // Check multiple environment variable sources for Cloudflare compatibility
    const dbUrl = process.env.DATABASE_URL || 
                  // @ts-ignore - Cloudflare Pages environment
                  globalThis.DATABASE_URL || 
                  'file:local.db';
    
    const authToken = process.env.DATABASE_AUTH_TOKEN || 
                      // @ts-ignore - Cloudflare Pages environment
                      globalThis.DATABASE_AUTH_TOKEN;

    console.log('Initializing database connection:', { 
      url: dbUrl.substring(0, 20) + '...', 
      hasToken: !!authToken 
    });

    const client = createClient({
      url: dbUrl,
      authToken: authToken
    });

    dbInstance = drizzle(client, { schema });
  }
  
  return dbInstance;
}

export const db = getDb();
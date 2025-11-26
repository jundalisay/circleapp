import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const userId = cookies.get('userId');
  
  if (!userId) {
    return { user: null };
  }

  try {
    const { db } = await import('$lib/server/db');
    const { users } = await import('$lib/server/db/schema');
    const { eq } = await import('drizzle-orm');
    
    const userResult = await db.select().from(users).where(eq(users.id, parseInt(userId))).limit(1);
    
    if (userResult.length === 0) {
      // User not found, clear invalid cookie
      cookies.delete('userId', { path: '/' });
      return { user: null };
    }
    
    return {
      user: userResult[0]
    };
  } catch (error) {
    console.error('Error loading user:', error);
    // If database error, clear cookie and return null
    cookies.delete('userId', { path: '/' });
    return { user: null };
  }
};


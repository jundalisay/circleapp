import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, products, services, transactions } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
  const allUsers = await db.select().from(users);
  
  const shopsWithStats = await Promise.all(
    allUsers.map(async (user) => {
      const productCount = await db.select({ count: sql<number>`count(*)` })
        .from(products).where(eq(products.userId, user.id));
      const serviceCount = await db.select({ count: sql<number>`count(*)` })
        .from(services).where(eq(services.userId, user.id));
      
      const credits = await db.select({ total: sql<number>`sum(points)` })
        .from(transactions).where(eq(transactions.giverId, user.id));
      const debts = await db.select({ total: sql<number>`sum(points)` })
        .from(transactions).where(eq(transactions.getterId, user.id));
      
      const creditTotal = credits[0]?.total || 0;
      const debtTotal = debts[0]?.total || 0;
      const creditRatio = debtTotal > 0 ? creditTotal / debtTotal : creditTotal > 0 ? 1 : 0;
      
      return {
        ...user,
        productCount: productCount[0]?.count || 0,
        serviceCount: serviceCount[0]?.count || 0,
        creditRatio
      };
    })
  );
  
  shopsWithStats.sort((a, b) => b.creditRatio - a.creditRatio);
  
  return { shops: shopsWithStats };
};

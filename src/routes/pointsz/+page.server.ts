import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { transactions, users } from '$lib/server/db/schema';
import { eq, or, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ cookies }) => {
  const userId = parseInt(cookies.get('userId') || '0');
  
  const allTransactions = await db
    .select({
      id: transactions.id,
      name: transactions.name,
      points: transactions.points,
      kind: transactions.kind,
      dateCreated: transactions.dateCreated,
      giverId: transactions.giverId,
      getterId: transactions.getterId,
      giverName: sql<string>`giver.name`,
      getterName: sql<string>`getter.name`
    })
    .from(transactions)
    .leftJoin(users.as('giver'), eq(transactions.giverId, sql`giver.id`))
    .leftJoin(users.as('getter'), eq(transactions.getterId, sql`getter.id`))
    .where(or(eq(transactions.giverId, userId), eq(transactions.getterId, userId)));
  
  const balance = allTransactions.reduce((acc, tx) => {
    if (tx.getterId === userId) return acc - tx.points;
    if (tx.giverId === userId) return acc + tx.points;
    return acc;
  }, 0);
  
  const userBalances = new Map();
  allTransactions.forEach(tx => {
    const otherId = tx.giverId === userId ? tx.getterId : tx.giverId;
    const otherName = tx.giverId === userId ? tx.getterName : tx.giverName;
    const amount = tx.getterId === userId ? -tx.points : tx.points;
    
    if (!userBalances.has(otherId)) {
      userBalances.set(otherId, { id: otherId, name: otherName, balance: 0 });
    }
    userBalances.get(otherId).balance += amount;
  });
  
  return {
    balance,
    userBalances: Array.from(userBalances.values()),
    transactions: allTransactions.map(tx => ({
      ...tx,
      otherParty: tx.giverId === userId ? tx.getterName : tx.giverName
    })),
    stats: {
      totalTransactions: allTransactions.length,
      uniquePartners: userBalances.size,
      avgTransaction: allTransactions.length > 0 
        ? allTransactions.reduce((acc, tx) => acc + tx.points, 0) / allTransactions.length 
        : 0
    }
  };
};
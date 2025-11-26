import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { transactions, users, products, services } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyUser, verifyPin } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request }) => {
  const { type, itemId, sellerId, buyerCodename, buyerPin, amount } = await request.json();
  
  const buyer = await verifyUser(buyerCodename, '');
  if (!buyer) {
    return json({ message: 'Invalid buyer credentials' }, { status: 401 });
  }
  
  const pinValid = await verifyPin(buyer.id, buyerPin);
  if (!pinValid) {
    return json({ message: 'Invalid PIN' }, { status: 401 });
  }
  
  let item;
  if (type === 'product') {
    const result = await db.select().from(products).where(eq(products.id, parseInt(itemId))).limit(1);
    item = result[0];
  } else {
    const result = await db.select().from(services).where(eq(services.id, parseInt(itemId))).limit(1);
    item = result[0];
  }
  
  if (!item) {
    return json({ message: 'Item not found' }, { status: 404 });
  }
  
  const totalPoints = item.points * amount;
  
  await db.insert(transactions).values({
    name: item.name,
    points: totalPoints,
    measure: item.measure,
    amount,
    photo: item.photo1,
    kind: 'debt',
    status: 'accepted',
    giverId: parseInt(sellerId),
    getterId: buyer.id,
    dateAccepted: new Date().toISOString()
  });
  
  return json({ success: true });
};

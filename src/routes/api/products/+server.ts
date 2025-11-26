import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const userId = cookies.get('userId');
  if (!userId) {
    return json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const data = await request.json();
  
  await db.insert(products).values({
    ...data,
    userId: parseInt(userId)
  });
  
  return json({ success: true });
};

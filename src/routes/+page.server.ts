import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  const userId = cookies.get('userId');
  
  // If user is already logged in, redirect to posts
  if (userId) {
    throw redirect(303, '/posts');
  }
  
  return { user: null };
};


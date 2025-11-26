import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const data = await request.json();
  
  try {
    // Check if codename already exists
    const existing = await db.select().from(users).where(eq(users.codename, data.codename)).limit(1);
    if (existing.length > 0) {
      return json({ message: 'Codename already exists' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const hashedPin = await bcrypt.hash(data.pin, 10);
    
    const result = await db.insert(users).values({
      name: data.name,
      codename: data.codename,
      pin: hashedPin,
      password: hashedPassword,
      avatar: data.avatar_url || null,
      gender: data.gender || null,
      dateOfBirth: data.date_of_birth || null,
      email: data.email || null,
      phone: data.phone || null,
      location: data.location || null
    }).returning({ id: users.id });
    
    // Auto-login after registration
    cookies.set('userId', result[0].id.toString(), { 
      path: '/', 
      httpOnly: true, 
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax'
    });
    
    return json({ success: true, userId: result[0].id });
  } catch (error: any) {
    console.error('Registration error:', error);
    return json({ message: error.message || 'Registration failed. Please try again.' }, { status: 400 });
  }
};


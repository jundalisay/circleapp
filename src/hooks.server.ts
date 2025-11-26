import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
	});
});

// export const handle: Handle = handleParaglide;

export const handle: Handle = async ({ event, resolve }) => {
  if (event.platform?.env) {
    if (event.platform.env.DATABASE_URL) {
      process.env.DATABASE_URL = event.platform.env.DATABASE_URL;
    }
    if (event.platform.env.DATABASE_AUTH_TOKEN) {
      process.env.DATABASE_AUTH_TOKEN = event.platform.env.DATABASE_AUTH_TOKEN;
    }
  }
  return resolve(event);
};


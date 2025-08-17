import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";

const app = new Hono().basePath('/api');

// OAuth endpoints
app.get('/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: process.env.MOCHA_USERS_SERVICE_API_URL!,
    apiKey: process.env.MOCHA_USERS_SERVICE_API_KEY!,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: process.env.MOCHA_USERS_SERVICE_API_URL!,
    apiKey: process.env.MOCHA_USERS_SERVICE_API_KEY!,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: process.env.MOCHA_USERS_SERVICE_API_URL!,
      apiKey: process.env.MOCHA_USERS_SERVICE_API_KEY!,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Note: Database operations removed since D1 is not available on Vercel
// For a production deployment, you would need to set up a compatible database
app.get('/habits', authMiddleware, async (c) => {
  return c.json({ error: 'Database not configured for Vercel deployment' }, 500);
});

app.post('/habits', authMiddleware, async (c) => {
  return c.json({ error: 'Database not configured for Vercel deployment' }, 500);
});

app.get('/habits/:id/entries', authMiddleware, async (c) => {
  return c.json({ error: 'Database not configured for Vercel deployment' }, 500);
});

app.post('/habits/:id/entries', authMiddleware, async (c) => {
  return c.json({ error: 'Database not configured for Vercel deployment' }, 500);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

export default handle(app);

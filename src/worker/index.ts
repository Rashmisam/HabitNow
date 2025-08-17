import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";

const app = new Hono<{ Bindings: Env }>();

// OAuth endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
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

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
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

// Habits API endpoints
app.get('/api/habits', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM habits WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC"
  )
    .bind(user.id)
    .all();

  return c.json(results);
});

app.post('/api/habits', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const body = await c.req.json();

  const { results } = await c.env.DB.prepare(
    `INSERT INTO habits (user_id, name, category, description, target_frequency, target_amount, target_unit)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     RETURNING *`
  )
    .bind(
      user.id,
      body.name,
      body.category,
      body.description || null,
      body.target_frequency,
      body.target_amount,
      body.target_unit
    )
    .all();

  return c.json(results[0]);
});

app.get('/api/habits/:id/entries', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const habitId = c.req.param('id');

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM habit_entries WHERE habit_id = ? AND user_id = ? ORDER BY entry_date DESC"
  )
    .bind(habitId, user.id)
    .all();

  return c.json(results);
});

app.post('/api/habits/:id/entries', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const habitId = c.req.param('id');
  const body = await c.req.json();

  // Check if entry already exists for this date
  const existing = await c.env.DB.prepare(
    "SELECT id FROM habit_entries WHERE habit_id = ? AND user_id = ? AND entry_date = ?"
  )
    .bind(habitId, user.id, body.entry_date)
    .first();

  if (existing) {
    // Update existing entry
    const { results } = await c.env.DB.prepare(
      `UPDATE habit_entries SET amount = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? RETURNING *`
    )
      .bind(body.amount, body.notes || null, existing.id)
      .all();

    return c.json(results[0]);
  } else {
    // Create new entry
    const { results } = await c.env.DB.prepare(
      `INSERT INTO habit_entries (habit_id, user_id, entry_date, amount, notes)
       VALUES (?, ?, ?, ?, ?)
       RETURNING *`
    )
      .bind(habitId, user.id, body.entry_date, body.amount, body.notes || null)
      .all();

    return c.json(results[0]);
  }
});

export default app;

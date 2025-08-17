import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { zValidator } from "@hono/zod-validator";
import { CreateHabitSchema, CreateHabitEntrySchema } from "@/shared/types";

type Bindings = {
  DB: D1Database;
  MOCHA_USERS_SERVICE_API_KEY: string;
  MOCHA_USERS_SERVICE_API_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Add CORS middleware
app.use('/*', cors({
  origin: ['http://localhost:5173', 'https://localhost:5173'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

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

// Habits endpoints
app.get('/api/habits', authMiddleware, async (c) => {
  const user = c.get("user");
  
  try {
    const habits = await c.env.DB.prepare(`
      SELECT * FROM habits 
      WHERE user_id = ? AND is_active = 1 
      ORDER BY created_at DESC
    `).bind(user.id).all();

    return c.json(habits.results || []);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Failed to fetch habits' }, 500);
  }
});

app.post('/api/habits', authMiddleware, zValidator('json', CreateHabitSchema), async (c) => {
  const user = c.get("user");
  const habitData = c.req.valid('json');
  
  try {
    const result = await c.env.DB.prepare(`
      INSERT INTO habits (user_id, name, category, description, target_frequency, target_amount, target_unit, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      user.id,
      habitData.name,
      habitData.category,
      habitData.description || null,
      habitData.target_frequency,
      habitData.target_amount,
      habitData.target_unit
    ).run();

    if (!result.success) {
      throw new Error('Failed to create habit');
    }

    // Fetch the created habit
    const habit = await c.env.DB.prepare(`
      SELECT * FROM habits WHERE id = ?
    `).bind(result.meta.last_row_id).first();

    return c.json(habit);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Failed to create habit' }, 500);
  }
});

app.get('/api/habits/:id/entries', authMiddleware, async (c) => {
  const user = c.get("user");
  const habitId = c.req.param('id');
  
  try {
    const entries = await c.env.DB.prepare(`
      SELECT * FROM habit_entries 
      WHERE habit_id = ? AND user_id = ? 
      ORDER BY entry_date DESC
    `).bind(habitId, user.id).all();

    return c.json(entries.results || []);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Failed to fetch entries' }, 500);
  }
});

app.post('/api/habits/:id/entries', authMiddleware, zValidator('json', CreateHabitEntrySchema), async (c) => {
  const user = c.get("user");
  const habitId = c.req.param('id');
  const entryData = c.req.valid('json');
  
  try {
    // Check if entry already exists for this date
    const existingEntry = await c.env.DB.prepare(`
      SELECT id FROM habit_entries 
      WHERE habit_id = ? AND user_id = ? AND entry_date = ?
    `).bind(habitId, user.id, entryData.entry_date).first();

    let result;
    if (existingEntry) {
      // Update existing entry
      result = await c.env.DB.prepare(`
        UPDATE habit_entries 
        SET amount = ?, notes = ?, updated_at = datetime('now')
        WHERE id = ?
      `).bind(entryData.amount, entryData.notes || null, existingEntry.id).run();
    } else {
      // Create new entry
      result = await c.env.DB.prepare(`
        INSERT INTO habit_entries (habit_id, user_id, entry_date, amount, notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `).bind(
        habitId,
        user.id,
        entryData.entry_date,
        entryData.amount,
        entryData.notes || null
      ).run();
    }

    if (!result.success) {
      throw new Error('Failed to save entry');
    }

    // Fetch the entry
    const entryId = existingEntry ? existingEntry.id : result.meta.last_row_id;
    const entry = await c.env.DB.prepare(`
      SELECT * FROM habit_entries WHERE id = ?
    `).bind(entryId).first();

    return c.json(entry);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Failed to save entry' }, 500);
  }
});

export default app;

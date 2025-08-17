
CREATE TABLE habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'exercise', 'food', 'routine', 'study'
  description TEXT,
  target_frequency TEXT, -- 'daily', 'weekly', 'monthly'
  target_amount INTEGER, -- target number (e.g., 30 minutes, 3 times)
  target_unit TEXT, -- 'minutes', 'hours', 'times', 'servings'
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

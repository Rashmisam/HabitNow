
CREATE TABLE habit_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  entry_date DATE NOT NULL,
  amount INTEGER NOT NULL, -- actual amount completed
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

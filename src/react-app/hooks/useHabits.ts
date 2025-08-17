import { useState, useEffect } from "react";
import type { Habit, HabitEntry, CreateHabit, CreateHabitEntry } from "@/shared/types";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/habits');
      if (!response.ok) throw new Error('Failed to fetch habits');
      const data = await response.json();
      setHabits(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createHabit = async (habitData: CreateHabit) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData),
      });
      if (!response.ok) throw new Error('Failed to create habit');
      const newHabit = await response.json();
      setHabits(prev => [newHabit, ...prev]);
      return newHabit;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create habit');
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return {
    habits,
    isLoading,
    error,
    fetchHabits,
    createHabit,
  };
}

export function useHabitEntries(habitId: number) {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/habits/${habitId}/entries`);
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const addEntry = async (entryData: CreateHabitEntry) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      });
      if (!response.ok) throw new Error('Failed to add entry');
      const newEntry = await response.json();
      setEntries(prev => [newEntry, ...prev.filter(e => e.entry_date !== entryData.entry_date)]);
      return newEntry;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add entry');
    }
  };

  useEffect(() => {
    if (habitId) {
      fetchEntries();
    }
  }, [habitId]);

  return {
    entries,
    isLoading,
    error,
    fetchEntries,
    addEntry,
  };
}

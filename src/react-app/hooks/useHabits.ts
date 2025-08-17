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
      
      // Check content type first
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('API route not properly configured - received non-JSON response');
        setHabits([]);
        setError('API not available in current environment');
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch habits');
      }
      
      setHabits(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch habits:', err);
      // For now, set empty habits array if API is not available
      setHabits([]);
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
      
      // Check content type first
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API not available in current environment');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create habit');
      }
      
      setHabits(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Failed to create habit:', err);
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
      
      // Check content type first
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('API route not properly configured - received non-JSON response');
        setEntries([]);
        setError('API not available in current environment');
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch entries');
      }
      
      setEntries(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
      // For now, set empty entries array if API is not available
      setEntries([]);
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
      
      // Check content type first
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API not available in current environment');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add entry');
      }
      
      setEntries(prev => [data, ...prev.filter(e => e.entry_date !== entryData.entry_date)]);
      return data;
    } catch (err) {
      console.error('Failed to add entry:', err);
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

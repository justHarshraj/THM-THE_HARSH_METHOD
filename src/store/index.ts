import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  deadline?: string;
  status: 'Todo' | 'In Progress' | 'Done';
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  createdAt: string;
}

export interface DayEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  date: string; // YYYY-MM-DD
  color?: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  category: string;
  addedAt: string;
}

export interface TimeSession {
  id: string;
  name: string;
  duration: number; // in seconds
  date: string; // ISO string
}

export interface AppState {
  todos: Todo[];
  events: DayEvent[];
  links: LinkItem[];
  timeSessions: TimeSession[];
  lastLoginDate: string | null;
  
  // App initialization
  checkDailyReset: () => void;
  // Todos
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  
  // Events
  addEvent: (event: DayEvent) => void;
  updateEvent: (id: string, updates: Partial<DayEvent>) => void;
  deleteEvent: (id: string) => void;

  // Links
  addLink: (link: LinkItem) => void;
  updateLink: (id: string, updates: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;

  // Time Sessions
  addTimeSession: (session: TimeSession) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      todos: [],
      events: [],
      links: [],
      timeSessions: [],
      lastLoginDate: null,
      
      // App initialization
      checkDailyReset: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          if (state.lastLoginDate !== today) {
            const updatedTodos = state.todos.map((todo) => {
              if (todo.category === 'Daily' && todo.status === 'Done') {
                return { ...todo, status: 'Todo' as const, completed: false };
              }
              return todo;
            });
            return {
              todos: updatedTodos as Todo[],
              lastLoginDate: today,
            };
          }
          return state;
        }),
      
      // Todos
      addTodo: (todo) =>
        set((state) => ({ todos: [...state.todos, todo] })),
      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),

      // Events
      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      // Links
      addLink: (link) =>
        set((state) => ({ links: [...state.links, link] })),
      updateLink: (id, updates) =>
        set((state) => ({
          links: state.links.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        })),
      deleteLink: (id) =>
        set((state) => ({
          links: state.links.filter((l) => l.id !== id),
        })),

      // Time Sessions
      addTimeSession: (session) =>
        set((state) => ({ timeSessions: [...state.timeSessions, session] })),
    }),
    {
      name: 'thm-storage',
    }
  )
);

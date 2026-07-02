import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Tasks API ---

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, category, difficulty, completed } = req.body;
    const newTask = await prisma.task.create({
      data: { title, description, status, priority, dueDate, category, difficulty, completed }
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// --- Events API ---

app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, description, startTime, endTime, date, color } = req.body;
    const newEvent = await prisma.event.create({
      data: { title, description, startTime, endTime, date, color }
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData
    });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// --- Time Sessions API ---

app.get('/api/time-sessions', async (req, res) => {
  try {
    const sessions = await prisma.timeSession.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch time sessions' });
  }
});

app.post('/api/time-sessions', async (req, res) => {
  try {
    const { name, duration, date } = req.body;
    const newSession = await prisma.timeSession.create({
      data: { name, duration, date }
    });
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create time session' });
  }
});

app.delete('/api/time-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.timeSession.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete time session' });
  }
});

// --- Links API ---

app.get('/api/links', async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

app.post('/api/links', async (req, res) => {
  try {
    const { url, title, description, category, icon } = req.body;
    const newLink = await prisma.link.create({
      data: { url, title, description, category, icon }
    });
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create link' });
  }
});

app.delete('/api/links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.link.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

// --- Settings API ---

app.get('/api/settings', async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const updateData = req.body;
    let settings = await prisma.settings.findFirst();
    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: updateData
      });
    } else {
      settings = await prisma.settings.create({ data: updateData });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

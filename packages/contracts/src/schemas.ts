import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().min(2).max(80),
  phone: z.string().max(30).optional(),
});

export const leaveRequestSchema = z
  .object({
    dateFrom: z.string().min(1),
    dateTo: z.string().min(1),
    reason: z.string().min(3).max(1000),
  })
  .refine((v) => v.dateTo >= v.dateFrom, {
    message: 'End date must be on or after start date',
    path: ['dateTo'],
  });

export const announcementSchema = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(3).max(5000),
  audience: z.enum(['all', 'students', 'staff']).default('all'),
});

export const communityCreateSchema = z.object({
  name: z.string().min(3).max(80),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false),
});

export const maintenanceRequestSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(3).max(2000),
  location: z.string().min(1).max(120),
});

export const eventCreateSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(3).max(5000),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  location: z.string().min(1).max(200),
  capacity: z.number().int().positive().max(5000),
});

export const notificationCreateSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1).max(120),
  message: z.string().min(1).max(1000),
  link: z.string().optional(),
  category: z.enum(['workflow', 'announcements', 'events', 'system']).default('system'),
});

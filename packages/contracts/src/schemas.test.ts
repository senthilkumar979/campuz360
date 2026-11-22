import { describe, expect, it } from 'vitest';
import { leaveRequestSchema, signInSchema } from './schemas';

describe('signInSchema', () => {
  it('accepts valid credentials', () => {
    expect(signInSchema.parse({ email: 'a@campus.edu', password: 'password1' })).toBeTruthy();
  });
});

describe('leaveRequestSchema', () => {
  it('rejects inverted dates', () => {
    const result = leaveRequestSchema.safeParse({
      dateFrom: '2027-03-10',
      dateTo: '2027-03-01',
      reason: 'Conference',
    });
    expect(result.success).toBe(false);
  });
});

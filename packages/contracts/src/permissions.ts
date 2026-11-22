export const PERMISSIONS = [
  'nexus.access',
  'nexus.admin',
  'nexus.audit',
  'flow.access',
  'flow.leave.submit',
  'flow.leave.approve',
  'flow.admin',
  'connect.access',
  'connect.announce',
  'connect.admin',
  'sphere.access',
  'sphere.moderate',
  'sphere.admin',
  'residence.access',
  'residence.admin',
  'residence.maintenance',
  'pulse.access',
  'pulse.organize',
  'pulse.admin',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_KEYS = ['user', 'module_admin', 'platform_admin'] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

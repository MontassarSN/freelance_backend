import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../../users/infrastructure/entity';

export const ROLE_KEY = 'role';
export type RoleDecoratorArgs = { roles: RolesEnum[] };
export const Role = (args: RoleDecoratorArgs) => SetMetadata(ROLE_KEY, args);

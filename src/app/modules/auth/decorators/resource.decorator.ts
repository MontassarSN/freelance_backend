import { SetMetadata } from '@nestjs/common';
import { IDb } from 'src/app/database/types/IDb';

export const META_RESOURCE = 'resource';
export type ResourceDecoratorArgs = keyof IDb;
export const Resource = (args: ResourceDecoratorArgs) =>
  SetMetadata(META_RESOURCE, args);

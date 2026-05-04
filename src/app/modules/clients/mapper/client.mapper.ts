import { omit } from 'src/app/shared/utils/omit';
import { ClientEntity } from '../infrastructure/entity';

export default function ClientMapper<T extends Partial<ClientEntity>>(
  client: T,
) {
  return client;
}

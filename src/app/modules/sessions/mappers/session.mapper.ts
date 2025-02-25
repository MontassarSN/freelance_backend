import { omit } from 'src/app/shared/utils/omit';
import { SessionEntity } from '../infrastructure/entity';

export default function SessionMapper(session: SessionEntity) {
  return omit(session, ['hash']);
}

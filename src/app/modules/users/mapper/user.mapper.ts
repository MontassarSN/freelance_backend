import { omit } from 'src/app/shared/utils/omit';
import { UserEntity } from '../infrastructure/entity';

export default function UserMapper<T extends Partial<UserEntity>>(user: T) {
  return omit(user, ['password', 'temp_password']);
}

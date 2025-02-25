import { ITransaction } from 'src/app/database/types/transaction';
import { NotificationsService } from '../notification/service';
import { DB_PROVIDER } from 'src/app/database/conf/constants';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UsersHandler {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(DB_PROVIDER) private readonly trx: ITransaction,
  ) {}
}

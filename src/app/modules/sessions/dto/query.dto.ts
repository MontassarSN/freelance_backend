import { QueryDtoWithPagination } from '../../../shared/dto/QueryDtoWithPagination.dto';
import { IQuerySessionKeys } from '../infrastructure/entity';

export class QueryUserDto extends QueryDtoWithPagination<IQuerySessionKeys> {}

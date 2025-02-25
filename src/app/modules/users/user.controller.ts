import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update.dto';
import { QueryUserDto } from './dto/query.dto';
import { UsersService } from './user.service';
import { ITransaction } from '../../database/types/transaction';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { CreateUserDto, DeleteUserDto } from './dto/create.dto';
import UserMapper from './mapper/user.mapper';
import { UpdateMeDto } from './dto/updateMe.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/decorators/Role.decorator';
import { AuthenticatedUser } from '../auth/decorators/user.decorator';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { Resource } from '../auth/decorators/resource.decorator';
import { Public } from '../auth/decorators/IsPublic.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ParseEmailPipe } from 'src/app/shared/pipes/email.pipe';
import { ParsePhoneNumberPipe } from 'src/app/shared/pipes/phone_number.pipe';
import { RolesEnum } from './infrastructure/entity';

@Resource('users')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly service: UsersService,
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}
  @Role({ roles: [RolesEnum.ADMIN] })
  @UseGuards(RoleGuard)
  @Get()
  async getMany(@Query() query: QueryUserDto) {
    const res = await this.service.findManyWithPagination(query);
    return {
      ...res,
      data: res.data.map(UserMapper),
    };
  }

  @Get('me')
  async getMe(@AuthenticatedUser() userJwt: JwtPayloadType) {
    const res = await this.service.findOne({
      id: userJwt.user_id,
    });
    return UserMapper(res);
  }

  @Public()
  @Get('email/:email')
  async getUserByEmail(@Param('email', ParseEmailPipe) email: string) {
    const res = await this.service.findOneByEmail({
      email,
    });
    return UserMapper(res);
  }

  @Public()
  @Get('phone_number/:phone_number')
  async getUserByPhone(
    @Param('phone_number', ParsePhoneNumberPipe) phone_number: string,
  ) {
    const res = await this.service.findOneByPhoneNumber({
      phone_number,
    });
    return UserMapper(res);
  }

  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.service.findOne({ id });
    return UserMapper(res);
  }

  @Patch('me')
  async patchMe(
    @AuthenticatedUser() userJwt: JwtPayloadType,
    @Body() body: UpdateMeDto,
  ) {
    const updateEntity = await this.service.updateOne({
      id: userJwt.user_id,
      session_id: userJwt.session_id,
      payload: {
        ...body,
      },
    });
    this.trx.commit();
    return UserMapper(updateEntity);
  }

  @Role({ roles: [RolesEnum.ADMIN] })
  @UseGuards(RoleGuard)
  @Patch(':id')
  async patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    const updateEntity = await this.service.updateOne({
      id,
      payload: body,
    });
    this.trx.commit();
    return UserMapper(updateEntity);
  }

  @Role({ roles: [RolesEnum.ADMIN] })
  @UseGuards(RoleGuard)
  @Post()
  async post(@Body() body: CreateUserDto) {
    const createdEntity = await this.service.createOneByAdmin(body);
    this.trx.commit();
    return UserMapper(createdEntity);
  }

  @Delete('me')
  async deleteMe(
    @AuthenticatedUser() userJwt: JwtPayloadType,
    @Body() body: DeleteUserDto,
  ): Promise<void> {
    await this.service.deleteOne({
      id: userJwt.user_id,
      password: body.password,
    });
    this.trx.commit();
  }

  @Role({ roles: [RolesEnum.ADMIN] })
  @UseGuards(RoleGuard)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.deleteOne({ id });
    this.trx.commit();
  }
}

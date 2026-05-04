import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':user_id')
  async getClient(@Param('user_id') user_id: string) {
    return this.clientService.getClientByUserId(user_id);
  }

  @Post()
  async createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }

  @Put(':user_id')
  async updateClient(
    @Param('user_id') user_id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.updateClient(user_id, updateClientDto);
  }

  @Delete(':user_id')
  async deleteClient(@Param('user_id') user_id: string) {
    return this.clientService.deleteClient(user_id);
  }
}

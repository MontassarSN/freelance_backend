import { Injectable } from '@nestjs/common';
import { ClientRepository } from './infrastructure/repository';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { ClientEntity } from './infrastructure/entity';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async getClientByUserId(user_id: string): Promise<ClientEntity | null> {
    return this.clientRepository.findOne({ user_id });
  }

  async createClient(createClientDto: CreateClientDto): Promise<ClientEntity> {
    return this.clientRepository.create(createClientDto);
  }

  async updateClient(
    user_id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<ClientEntity> {
    return this.clientRepository.update(user_id, updateClientDto);
  }

  async deleteClient(user_id: string): Promise<void> {
    return this.clientRepository.delete(user_id);
  }
}

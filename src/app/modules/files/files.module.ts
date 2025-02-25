import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { LocalStorageService } from './services/local_storage.service';
import { DropboxService } from './services/dropbox.service';

@Module({
  controllers: [FilesController],
  providers: [LocalStorageService, DropboxService],
})
export class FilesModule {}

import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalStorageService } from './services/local_storage.service';
import { CreateFileDto } from './dto/CreateFileDto';
import { Response } from 'express';
import { File } from './domain/domain';
import { FileInterceptor } from '@nestjs/platform-express';
import { IncomingHttpHeaders } from 'http';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { Resource } from 'src/app/modules/auth/decorators/resource.decorator';
import initializeDownload from './utils/initializeDownload';
import { Public } from 'src/app/modules/auth/decorators/IsPublic.decorator';
import { JwtAuthGuard } from 'src/app/modules/auth/guards/jwt.guard';

@Resource('files')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(
    private readonly localStorage: LocalStorageService,
    // private readonly dropboxService: DropboxService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Throttle({
    default: {
      limit: 10,
      ttl: 10 * 1000,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileForUser(
    @Query() query: CreateFileDto,
    @UploadedFile() file: any,
  ) {
    new File({ file, query, allowedMaxSize: 1024 * 1024 * 10 });
    return await this.localStorage.uploadFile(file).then((res) => res.fileUrl);
  }

  // @HttpCode(HttpStatus.CREATED)
  // @Post('upload')
  // async uploadFileToDbxAsUser(
  //   @Req() req: Request,
  //   @Query() query: CreateFileDto,
  // ) {
  //   try {
  //     const result = await uploadFileFromRequest(
  //       req,
  //       {
  //         ...query,
  //         maxSize: 1024 * 1024 * 10,
  //       },
  //       async (fileStream, filename, mimeType, maxSize) => {
  //         const url = await this.dropboxService.uploadFileStreamToDropbox(
  //           fileStream,
  //           filename,
  //           mimeType,
  //           maxSize,
  //         );
  //         return url;
  //       },
  //     );
  //     return result;
  //   } catch (error) {
  //     throw new InternalServerErrorException((error as Error).message);
  //   }
  // }

  // @HttpCode(HttpStatus.CREATED)
  // @Post('admin/upload/dropbox')
  // async uploadToDropbox(@Req() req: Request, @Query() query: CreateFileDto) {
  //   try {
  //     const result = await uploadFileFromRequest(
  //       req,
  //       query,
  //       async (fileStream, filename, mimeType) => {
  //         const url = await this.dropboxService.uploadFileStreamToDropbox(
  //           fileStream,
  //           filename,
  //           mimeType,
  //         );
  //         return url;
  //       },
  //     );
  //     return result;
  //   } catch (error) {
  //     throw new InternalServerErrorException((error as Error).message);
  //   }
  // }

  @Public()
  @Throttle({
    default: {
      limit: 60,
      ttl: 10 * 1000,
    },
  })
  @Get(':fileName')
  async downloadVideo(
    @Param('fileName') fileName: string,
    @Headers() headers: IncomingHttpHeaders,
    @Res() res: Response,
  ) {
    const filesDir = this.configService.getOrThrow('app.filesDir', {
      infer: true,
    });
    const { filePath, fileSizeInBytes, fileMimeType } = initializeDownload({
      fileName,
      filesDir,
    });
    const range = headers.range;
    const IsVideo = fileMimeType === 'mp4';
    if (IsVideo && range) {
      const { headers, fileStream } = this.localStorage.downloadVideo({
        filePath,
        fileSizeInBytes,
        fileMimeType,
        range,
      });
      res.writeHead(HttpStatus.PARTIAL_CONTENT, headers);
      fileStream.pipe(res);
    } else {
      const { headers, fileStream } = this.localStorage.downloadFile({
        filePath,
        fileSizeInBytes,
        fileMimeType,
      });
      res.writeHead(HttpStatus.OK, headers);
      fileStream.pipe(res);
    }
  }
}

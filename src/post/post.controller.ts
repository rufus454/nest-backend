import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Query,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CurrentUser } from 'src/auth/user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CurrentUserGuard } from 'src/auth/current-user.guard';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ACGuard, UseRoles } from 'nest-access-control';

@Controller('post')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UsePipes(ValidationPipe)
  // @UseGuards(CurrentUserGuard, ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'create',
    resource: 'posts',
  })
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  findAll(@Query() query: ExpressQuery) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Get('pictures/:fileName')
  async getPicture(@Param('fileName') fileName: string, @Res() res: Response) {
    res.sendFile(fileName, { root: './uploads' });
  }

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const ext = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + `_${Date.now()}.${ext}`;
          return cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }

        if (file.size > 5 * 1024 * 1024) {
          return cb(new Error('File is too large'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not image');
    }

    const response = {
      filePath: `http://localhost:3000/post/pictures/${file.filename}`,
    };

    return response;
  }

  @Patch(':id')
  // @UseGuards(CurrentUserGuard, ACGuard)
  // @UseRoles({
  //   possession: 'any',
  //   action: 'update',
  //   resource: 'posts',
  // })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(CurrentUserGuard)
  @UseRoles({
    possession: 'any',
    action: 'delete',
    resource: 'posts',
  })
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}

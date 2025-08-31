import { Module } from '@nestjs/common';
import { AuthorityCategoriesController } from './authority-categories.controller';
import { AuthorityCategoriesService } from './authority-categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuthorityCategory,
  AuthorityCategorySchema,
} from './schemas/authority-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AuthorityCategory.name,
        schema: AuthorityCategorySchema,
      },
    ]),
  ],
  controllers: [AuthorityCategoriesController],
  providers: [AuthorityCategoriesService],
  exports: [AuthorityCategoriesService],
})
export class AuthorityCategoriesModule {}

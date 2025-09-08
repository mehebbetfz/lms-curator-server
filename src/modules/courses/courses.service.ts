import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/services/base.service';
import { Course } from './schemas/course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CoursesService extends BaseService<Course> {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {
    super(courseModel, Course.name);
  }
}

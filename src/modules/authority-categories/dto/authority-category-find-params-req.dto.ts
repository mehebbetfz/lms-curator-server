import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

export class CourseFindParamsReqDto extends PartialType(CreateCourseDto) {
    page: number;
    limit: number;
}

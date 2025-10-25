import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CourseFindParamsReqDto } from './dto/course-find-params-req-dto.dto';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';


@Controller('courses')
// @UseGuards(JwtAuthGuard, AuthoritiesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  
  @Post()
  // @Authorities('COURSE_CREATE')
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }
  
  @Get()
  // @Authorities('COURSE_READ_MANY')
  async find(@Query() query: CourseFindParamsReqDto) {
    const { page, limit, ...searchParams } = query;
    return await this.coursesService.find(searchParams, { page, limit });
  }
  
  @Get(':id')
  // @Authorities('COURSE_READ_ONE')
  async findById(@Param('id') id: string) {
    return await this.coursesService.findById(id);
  }
  
  @Patch(':id')
  // @Authorities('COURSE_UPDATE')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.coursesService.update(id, updateCourseDto);
  }
  
  @Delete(':id')
  // @Authorities('COURSE_DELETE_ONE')
  async deleteOne(@Param('id') id: string) {
    return await this.coursesService.deleteOne({ _id: id });
  }
}
  

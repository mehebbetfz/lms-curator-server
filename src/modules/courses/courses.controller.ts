import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
  // @Authorities('')
  async create(@Body() createCourseDto: CreateCourseDto, @Req() req: any) {
    return this.coursesService.create(createCourseDto, req.user.currentContext);
  }
  
  @Get()
  // @Authorities('')
  async find(@Query() query: CourseFindParamsReqDto) {
    const { page, limit, ...searchParams } = query;
    return await this.coursesService.find(searchParams, { page, limit });
  }
  
  @Get(':id')
  // @Authorities('')
  async findById(@Param('id') id: string) {
    return await this.coursesService.findById(id);
  }
  
  @Patch(':id')
  // @Authorities('')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.coursesService.update(id, updateCourseDto);
  }
  
  @Delete(':id')
  // @Authorities('')
  async deleteOne(@Param('id') id: string) {
    return await this.coursesService.deleteOne({ _id: id });
  }
}
  

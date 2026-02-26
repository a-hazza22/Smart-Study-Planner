import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SchedulerService } from './scheduler.service';
import type { Express } from 'express';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('upload-schedule')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.schedulerService.analyzeScheduleImage(file);
  }

  @Post('create')
  async createStudyPlan(@Body() body: any) {
    return this.schedulerService.generateStudyPlan(body);
  }
}
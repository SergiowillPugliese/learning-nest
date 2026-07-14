import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '../generated/prisma/client';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {

  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.prismaService.task.create({ data: createTaskDto });
  }

  async findAll(): Promise<Task[]> {
    return await this.prismaService.task.findMany();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const existing = await this.findOne(id);
    return await this.prismaService.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number): Promise<void> {
    const existing = await this.findOne(id);
    await this.prismaService.task.delete({
      where: { id },
    });
  }
}

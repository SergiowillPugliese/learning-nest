import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Description 3',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      title: 'Task 4',
      description: 'Description 4',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  private nextId = 5;

  create(createTaskDto: CreateTaskDto): Task {
    const newTask = {
      ...createTaskDto,
      id: this.nextId++,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks = [...this.tasks, newTask];
    return newTask;
  }

  findAll(): Task[] {
    return [...this.tasks] as Task[];
  }

  findOne(id: number): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const existing = this.findOne(id);
    const updated: Task = {
      ...existing,
      ...updateTaskDto,
      updatedAt: new Date(),
    };
    this.tasks = this.tasks.map((task) => (task.id === id ? updated : task));
    return updated;
  }

  remove(id: number): Task {
    const removed = this.findOne(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return removed;
  }
}

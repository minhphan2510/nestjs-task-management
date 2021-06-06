import { UserEntity } from './../auth/user.entity';
import { TasksRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getAll(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const tasks = await this.tasksRepository.getTasks(filterDto, user);
    return tasks;
  }

  async getTaskById(id: string, user: UserEntity): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException('This task is not found');
    }
    return task;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  // getTaskWithFilter(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let _tasks = this.getAll();

  //   if (status) {
  //     _tasks = _tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     _tasks = _tasks.filter((task) => {
  //       if (
  //         task.title?.includes(search) ||
  //         task.description?.includes(search)
  //       ) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }

  //   return _tasks;
  // }

  async updateTask(
    id: string,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: string, user: UserEntity): Promise<string> {
    await this.tasksRepository.delete({ id, user });
    return 'Successful';
  }
}

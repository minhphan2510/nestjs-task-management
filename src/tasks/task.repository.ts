import { TaskEntity } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserEntity } from 'src/auth/user.entity';

@EntityRepository(TaskEntity)
export class TasksRepository extends Repository<TaskEntity> {
  async getTasks(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (filterDto?.status) {
      query.andWhere('task.status = :status', { status: filterDto.status });
    }

    if (filterDto?.search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${filterDto.search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
}

import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ClientSession, FilterQuery, Model, PipelineStage, Types } from 'mongoose'
import { Context } from 'src/core/dto/context.dto'
import { BaseService } from '../../core/services/base.service'
import { UserCompanyRoleFindParamsReqDto } from './dto/user-company-role-find-params-req-dto.dto'
import { UserCompanyRole } from './schemas/user-company-role.schema'

@Injectable()
export class UserCompanyRolesService extends BaseService<UserCompanyRole> {
  constructor(
    @InjectModel(UserCompanyRole.name) private readonly userCompanyRoleModel: Model<UserCompanyRole>,
  ) {
    super(userCompanyRoleModel, UserCompanyRole.name)
  }

  async create(
    createData: Partial<UserCompanyRole>,
    context: Context,
    uniqueCheckFilter?: FilterQuery<UserCompanyRole>,
    session?: ClientSession,
  ): Promise<UserCompanyRole> {
    try {

      const data = {
        ...createData,
        company_id: context.companyId,
      }
      // Проверка на уникальность, если передан фильтр
      if (uniqueCheckFilter) {
        const existing = await this.model
          .findOne(uniqueCheckFilter, null, { session })
          .exec()
        if (existing) {
          throw new ConflictException('RECORD_ALREADY_EXISTS')
        }
      }

      const newDocument = new this.model(data)
      return (await newDocument.save({ session })) as UserCompanyRole
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      this.logger.error(`Ошибка при create(): ${error.message}`)
      throw new InternalServerErrorException('Ошибка при create()')
    }
  }

  async findCompanyRolesForUser(
    modelFilter: FilterQuery<UserCompanyRoleFindParamsReqDto>,
    params?: Record<string, unknown>,
    projection?: Record<string, unknown>,
  ): Promise<{ models: any[]; total: number }> {
    // Приводим page и limit к числам + защита от некорректных значений
    const page = Math.max(1, Number(params.page) || 1)
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 20)) // лимит до 100, можно изменить

    const skip = (page - 1) * limit

    const pipeline: PipelineStage[] = [
      // 1. Фильтруем по пользователю (и опционально по статусу связи, если передан)
      {
        $match: {
          user_id: new Types.ObjectId(modelFilter.user_id),
        },
      },

      // 2. Подтягиваем роль компании
      {
        $lookup: {
          from: 'companyroles', // имя коллекции в нижнем регистре
          localField: 'company_role_id',
          foreignField: '_id',
          as: 'role',
        },
      },

      // 3. Разворачиваем массив (отбрасываем записи, где роль не найдена)
      { $unwind: { path: '$role', preserveNullAndEmptyArrays: false } },

      // 5. Формируем удобный вид ответа
      {
        $project: {
          _id: '$_id',
          name: '$role.name',
          description: '$role.description',
          priority: '$role.priority',
          company_id: '$role.company_id',
          role_status: '$role.status',          // статус самой роли
          assignment_status: '$status',         // статус назначения пользователю
          branch_id: 1,
          course_id: 1,
          assignedAt: '$createdAt',
          updatedAt: '$updatedAt',
        },
      },

      // 6. Сортировка (по приоритету descending + имя ascending)
      { $sort: { priority: -1, name: 1 } },

      // 7. Пагинация + подсчёт общего количества через $facet
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          items: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]

    const result = await this.userCompanyRoleModel.aggregate(pipeline).exec()

    const total = result[0]?.metadata?.[0]?.total ?? 0
    const models = result[0]?.items ?? []

    return { models, total }
  }
}

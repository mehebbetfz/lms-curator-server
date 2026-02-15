import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import mongoose, {
  ClientSession,
  FilterQuery,
  Model,
  UpdateQuery,
} from 'mongoose'
import { Context } from '../dto/context.dto'

export class BaseService<T> {
  protected readonly logger: Logger

  constructor(
    protected readonly model: Model<T>,
    modelName: string,
  ) {
    this.logger = new Logger(modelName)
  }

  async create(
    createData: Partial<T>,
    constext: Context,
    uniqueCheckFilter?: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<T> {
    try {

      const data = {
        ...createData,
        company_id: constext.companyId,
        course_id: constext.courseId,
        branch_id: constext.branchId,
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
      return (await newDocument.save({ session })) as T
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      this.logger.error(`Ошибка при create(): ${error.message}`)
      throw new InternalServerErrorException('Ошибка при create()')
    }
  }

  async update(
    id: string,
    updateData: UpdateQuery<T>,
    userId?: string,
    session?: ClientSession,
  ): Promise<T> {
    try {
      // Добавляем информацию о пользователе, который обновляет
      const dataWithUser = userId
        ? { ...updateData, updated_by: userId, updated_at: new Date() }
        : updateData

      const updatedDocument = await this.model.findByIdAndUpdate(
        id,
        dataWithUser,
        { new: true, runValidators: true, session }
      ).exec()

      if (!updatedDocument) {
        throw new NotFoundException('Документ не найден')
      }

      return updatedDocument
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      this.logger.error(`Ошибка при update(): ${error.message}`)
      throw new InternalServerErrorException('Ошибка при update()')
    }
  }

  async find(
    modelFilter: FilterQuery<T>,
    params?: Record<string, unknown>,
    projection?: Record<string, unknown>,
  ): Promise<{ models: T[]; total: number }> {
    try {
      const page = params?.page ? Math.max(1, Number(params.page)) : null
      const limit = params?.limit ? Math.max(1, Number(params.limit)) : null
      const skip = page && limit ? (page - 1) * limit : 0

      const modifiedFilter = this.applyPartialMatch(modelFilter)

      const modelsQuery = this.model
        .find(modifiedFilter, projection)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit || null)
        .exec()

      const totalQuery = this.model.countDocuments(modifiedFilter).exec()

      const models = await modelsQuery
      const total = await totalQuery

      this.logger.log(
        `Найдено ${models.length} документ(ов) на странице ${page} из ${total}`,
      )

      return { models, total }
    } catch (error) {
      this.logger.error(`Ошибка при find(): ${error.message}`)
      throw new InternalServerErrorException('Ошибка при find()')
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter).exec()
    } catch (error) {
      this.logger.error(`Ошибка при findOne(): ${error.message}`)
      throw new InternalServerErrorException('Ошибка при findOne()')
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec()
    } catch (error) {
      this.logger.error(`Ошибка при findById(): ${error.message}`)
      throw new InternalServerErrorException('Ошибка при findById()')
    }
  }

  async findOneAndUpdate(
    userId: string,
    filter: FilterQuery<T>,
    updateData: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<T | null> {
    try {
      const data = { ...updateData, updated_by: userId }
      return await this.model
        .findOneAndUpdate(filter, data, { new: true, session })
        .exec()
    } catch (error) {
      this.logger.error(`Ошибка при findOneAndUpdate(): ${error.message}`)
      throw new InternalServerErrorException('Ошибка при findOneAndUpdate()')
    }
  }

  async updateMany(
    userId: string,
    filter: FilterQuery<T>,
    updateData: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<boolean> {
    try {
      const data = { ...updateData, updated_by: userId }
      const result = await this.model.updateMany(filter, data, { session })
      return result.modifiedCount > 0
    } catch (error) {
      this.logger.error(`Ошибка при updateMany(): ${error.message}`)
      throw new InternalServerErrorException('Ошибка при updateMany()')
    }
  }

  async deleteOne(
    filter: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<boolean> {
    console.log("deleteOne filter:", filter)
    try {
      const result = await this.model.deleteOne(filter, { session }).exec()
      return result.deletedCount === 1
    } catch (error) {
      this.logger.error(`Ошибка при deleteOne(): ${error.message}`)
      throw new InternalServerErrorException('Ошибка при deleteOne()')
    }
  }

  async deleteMany(
    filter: FilterQuery<T>,
    session?: ClientSession,
  ): Promise<number> {
    try {
      const result = await this.model.deleteMany(filter, { session }).exec()
      return result.deletedCount ?? 0
    } catch (error) {
      this.logger.error(`Ошибка при deleteMany(): ${error.message}`)
      throw new InternalServerErrorException('Ошибка при deleteMany()')
    }
  }

  protected isObjectIdStrict(value: any): boolean {
    return (
      typeof value === 'string' &&
      mongoose.Types.ObjectId.isValid(value) &&
      String(new mongoose.Types.ObjectId(value)) === value
    )
  }

  protected applyPartialMatch(
    modelFilter: FilterQuery<T>,
  ): Record<string, any> {
    const newFilter: Record<string, any> = {}
    const regexExcludedFields = ['status', 'type', 'category']
    const skipFields = ['min_balance', 'max_balance', 'page', 'limit']

    for (const key in modelFilter) {
      if (skipFields.includes(key)) continue

      const value = (modelFilter as any)[key]
      if (this.isObjectIdStrict(value)) {
        newFilter[key] = new mongoose.Types.ObjectId(value)
      } else if (
        typeof value === 'string' &&
        !regexExcludedFields.includes(key)
      ) {
        newFilter[key] = new RegExp(value, 'i')
      } else {
        newFilter[key] = value
      }
    }

    return newFilter
  }
}

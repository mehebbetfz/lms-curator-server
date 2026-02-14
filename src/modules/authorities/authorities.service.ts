import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { Context } from '../../core/dto/context.dto'
import { BaseService } from '../../core/services/base.service'
import { parsePaginationParams } from '../../core/utils/parse-pagination.util'
import { CompanyRole } from '../company-roles/schemas/company-role.schema'
import { AuthorityFindParamsReqDto } from './dto/authority-find-params-req.dto'
import { Authority } from './schemas/authority.schema'

@Injectable()
export class AuthoritiesService extends BaseService<Authority> {
  constructor(
    @InjectModel(Authority.name)
    private readonly authorityModel: Model<Authority>,
    @InjectModel(CompanyRole.name)
    private readonly companyRoleModel: Model<CompanyRole>,
  ) {
    super(authorityModel, Authority.name)
  }


  async findCategoryAuthorities(
    context: Context,
    modelFilter: FilterQuery<AuthorityFindParamsReqDto>,
    params?: Record<string, unknown>,
  ) {
    const { companyId, courseId, branchId } = context
    const { page, limit } = parsePaginationParams(params)
    const skip = (page - 1) * limit

    const modifiedFilter = this.applyPartialMatch(modelFilter)

    const companyRoles = await this.companyRoleModel
      .find({ company_id: new Types.ObjectId(companyId) })
      .select('name _id')
      .lean()
      .exec()

    const roleIds = companyRoles.map(role => role._id)

    // Строгие условия: если поле контекста задано, то точное совпадение;
    // если не задано, то ожидаем null в базе.
    const conditions: any[] = [
      { $eq: ['$authority_id', '$$authority_id'] },
      { $in: ['$company_role_id', roleIds] }
    ]

    // course_id
    if (courseId) {
      conditions.push({ $eq: ['$course_id', new Types.ObjectId(courseId)] })
    } else {
      conditions.push({ $eq: ['$course_id', null] })
    }

    // branch_id
    if (branchId) {
      conditions.push({ $eq: ['$branch_id', new Types.ObjectId(branchId)] })
    } else {
      conditions.push({ $eq: ['$branch_id', null] })
    }

    const pipelineMatch = {
      $expr: { $and: conditions }
    }

    const [authorities, total] = await Promise.all([
      this.authorityModel.aggregate([
        { $match: modifiedFilter },
        {
          $lookup: {
            from: 'companyroleauthorities',
            let: { authority_id: '$_id' },
            pipeline: [{ $match: pipelineMatch }],
            as: 'access_records',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            authority_category_id: 1,
            role_access: {
              $map: {
                input: companyRoles,
                as: 'role',
                in: {
                  company_role_id: '$$role._id',
                  role_name: '$$role.name',
                  has_access: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: '$access_records',
                            as: 'access',
                            cond: { $eq: ['$$access.company_role_id', '$$role._id'] }
                          }
                        }
                      },
                      0
                    ]
                  }
                }
              }
            }
          }
        },
        { $skip: skip },
        { $limit: limit },
        { $sort: { name: 1 } },
      ]),
      this.authorityModel.countDocuments(modifiedFilter),
    ])

    const models = authorities.map((authority) => {
      const authorityData: any = {
        authority_id: authority._id,
        name: authority.name,
        description: authority.description,
        authority_category_id: authority.authority_category_id,
        roles: {}
      }
      authority.role_access.forEach((access) => {
        authorityData.roles[access.role_name] = {
          has_access: access.has_access,
          company_role_id: access.company_role_id,
          branch_id: access.branch_id,
          course_id: access.course_id
        }
      })
      return authorityData
    })

    return { models, total }
  }

}

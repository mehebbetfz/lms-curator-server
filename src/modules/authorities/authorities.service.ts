import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/services/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Authority } from './schemas/authority.schema';
import { AuthorityFindParamsReqDto } from './dto/authority-find-params-req.dto';
import { parsePaginationParams } from '../../core/utils/parse-pagination.util';
import { Context } from '../../core/dto/context.dto';
import { CompanyRole } from '../company-roles/schemas/company-role.schema';

@Injectable()
export class AuthoritiesService extends BaseService<Authority> {
  constructor(
    @InjectModel(Authority.name)
    private readonly authorityModel: Model<Authority>,
    @InjectModel(CompanyRole.name)
    private readonly companyRoleModel: Model<CompanyRole>,
  ) {
    super(authorityModel, Authority.name);
  }
  
  async findCategoryAuthorities(
    context: Context,
    modelFilter: FilterQuery<AuthorityFindParamsReqDto>,
    params?: Record<string, unknown>,
  ) {
    const company_id = context.companyId;
    const { page, limit } = parsePaginationParams(params);
    const skip = (page - 1) * limit;
    
    const modifiedFilter = this.applyPartialMatch(modelFilter);
    
    // Получаем все активные роли компании
    const companyRoles = await this.companyRoleModel
      .find({ company_id: company_id })
      .select('name _id')
      .lean()
      .exec();
    
    const roleIds = companyRoles.map(role => role._id);
    const roleMap = Object.fromEntries(
      companyRoles.map(role => [role._id.toString(), role.name])
    );
    
    const [authorities, total] = await Promise.all([
      this.authorityModel.aggregate([
        { $match: modifiedFilter },
        // Ищем связанные CompanyRoleAuthority
        {
          $lookup: {
            from: 'companyroleauthorities',
            let: { authority_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$authority_id', '$$authority_id'] }
                }
              }
            ],
            as: 'access_records',
          },
        },
        // Фильтруем access_records только для ролей текущей компании
        {
          $addFields: {
            access_records: {
              $filter: {
                input: '$access_records',
                as: 'access',
                cond: { $in: ['$$access.company_role_id', roleIds] }
              }
            }
          }
        },
        // Формируем структуру с доступом для каждой роли
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
                            cond: {
                              $eq: ['$$access.company_role_id', '$$role._id']
                            }
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
    ]);
    
    const models = authorities.map((authority) => {
      const authorityData: any = {
        authority_id: authority._id,
        name: authority.name,
        description: authority.description,
        authority_category_id: authority.authority_category_id,
        roles: {}
      };
      
      authority.role_access.forEach((access) => {
        authorityData.roles[access.role_name] = {
          has_access: access.has_access,
          company_role_id: access.company_role_id,
        };
      });
      
      return authorityData;
    });
    
    return {
      models,
      total,
    };
  }
  
}

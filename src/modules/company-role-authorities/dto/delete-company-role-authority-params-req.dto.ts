import { IsString, MaxLength } from 'class-validator';

export class DeleteCompanyRoleAuthorityParamsReqDto {
  @IsString({ message: 'NAME_NEED_TO_BE_STRING' })
  @MaxLength(100, { message: 'NAME_IS_TOO_LONG' })
  company_role_id: string;
  
  @IsString({ message: 'DESCRIPTION_NEED_TO_BE_STRING' })
  @MaxLength(100, { message: 'DESCRIPTION_IS_TOO_LONG' })
  authority_id: string;
}

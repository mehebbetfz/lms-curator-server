import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckAuthorityService {
  constructor() {}

  async check(userId: string, authorities: string[]): Promise<boolean> {
    return true;
  }
}

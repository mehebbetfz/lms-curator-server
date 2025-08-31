import { SetMetadata } from '@nestjs/common';

export const Authorities = (...authorities: string[]) =>
  SetMetadata('authorities', authorities);

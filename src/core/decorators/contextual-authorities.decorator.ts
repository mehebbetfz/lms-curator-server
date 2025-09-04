// contextual-authorities.decorator.ts
import { SetMetadata } from '@nestjs/common';

export interface ContextualAuthorityRequirement {
  authority: string;
  contextKey?: string; // Позволяет ограничить проверку определенным контекстом
}

export const ContextualAuthorities = (
  ...authorities: (string | ContextualAuthorityRequirement)[]
) => {
  const requirements = authorities.map(auth =>
    typeof auth === 'string' ? { authority: auth } : auth,
  );
  return SetMetadata('contextualAuthorities', requirements);
};

// Декоратор для извлечения контекста
export const Context = () => {
  return (
    target: any,
    propertyKey: string,
    parameterIndex: number,
  ) => {
    const existingMetadata =
      Reflect.getMetadata('contextParameters', target, propertyKey) || [];
    existingMetadata.push(parameterIndex);
    Reflect.defineMetadata(
      'contextParameters',
      existingMetadata,
      target,
      propertyKey,
    );
  };
};

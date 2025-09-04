export enum UserRoleEnum {
  BASE_USER = 'BASE_USER',
  
  // Системные роли (глобальные)
  SUPER_ADMIN = 'SUPER_ADMIN', // Полный доступ ко всей системе
  SYSTEM_ADMIN = 'SYSTEM_ADMIN', // Админ системы
  SUPPORT = 'SUPPORT', // Техподдержка
  
  // Роли на уровне компании
  COMPANY_OWNER = 'COMPANY_OWNER', // Владелец компании
  COMPANY_CO_FOUNDER = 'COMPANY_CO_FOUNDER', // Со-владелец компании
  COMPANY_ADMIN = 'COMPANY_ADMIN', // Администратор компании
  COMPANY_MANAGER = 'COMPANY_MANAGER', // Менеджер компании
  
  // Роли на уровне курса
  COURSE_DIRECTOR = 'COURSE_DIRECTOR', // Директор курса
  COURSE_MANAGER = 'COURSE_MANAGER', // Менеджер курса
  COURSE_TEACHER = 'COURSE_TEACHER', // Преподаватель курса
  COURSE_ASSISTANT = 'COURSE_ASSISTANT', // Ассистент курса
  COURSE_PARENT = 'COURSE_PARENT', // Студент курса
  COURSE_STUDENT = 'COURSE_STUDENT', // Студент курса
  
  // Роли на уровне филиала
  BRANCH_MANAGER = 'BRANCH_MANAGER', // Менеджер филиала
  BRANCH_TEACHER = 'BRANCH_TEACHER', // Преподаватель филиала
  BRANCH_STUDENT = 'BRANCH_STUDENT', // Студент филиала
  
  // Специальные роли
  CONTENT_MANAGER = 'CONTENT_MANAGER', // Менеджер контента
  FINANCE_MANAGER = 'FINANCE_MANAGER', // Финансовый менеджер
  HR_MANAGER = 'HR_MANAGER', // HR менеджер
}

export enum BaseRole {
    // Системные роли
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',

    // Бизнес-роли
    STUDENT = 'student',
    TEACHER = 'teacher',
    MANAGER = 'manager',
    CONTENT_MANAGER = 'content_manager',
    BRANCH_DIRECTOR = 'branch_director'
}

export enum CourseRole {
    STUDENT = 'student',
    TEACHER = 'teacher',
    COURSE_MANAGER = 'course_manager',
    ASSISTANT = 'assistant'
}
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    HealthCheck,
    HealthCheckService,
    MongooseHealthIndicator,
    MemoryHealthIndicator
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('api/health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private mongoose: MongooseHealthIndicator,
        private memory: MemoryHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    @ApiOperation({ summary: 'Check API and MongoDB health status' })
    check() {
        return this.health.check([
            async () => this.mongoose.pingCheck('mongodb'),
            async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
        ]);
    }
}
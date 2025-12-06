import { Throttle } from '@nestjs/throttler';

export function ApiThrottle() {
    return Throttle({
        default: {
            ttl: Number(process.env.THROTTLE_TTL),
            limit: Number(process.env.THROTTLE_LIMIT),
        },
    });
}

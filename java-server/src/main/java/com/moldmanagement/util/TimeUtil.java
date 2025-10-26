package com.moldmanagement.util;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * 时间工具类
 */
@Component
public class TimeUtil {
    
    /**
     * 计算耗时（小时）
     */
    public static long calculateDurationInHours(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            return 0;
        }
        return ChronoUnit.HOURS.between(startTime, endTime);
    }

    /**
     * 计算耗时（分钟）
     */
    public static long calculateDurationInMinutes(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            return 0;
        }
        return ChronoUnit.MINUTES.between(startTime, endTime);
    }

    /**
     * 检查是否超期
     */
    public static boolean isOverdue(LocalDateTime deadline) {
        return deadline != null && LocalDateTime.now().isAfter(deadline);
    }
}

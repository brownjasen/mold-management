package com.moldmanagement.util;

import org.springframework.stereotype.Component;

/**
 * 队列管理工具类
 */
@Component
public class QueueManager {
    
    /**
     * 计算队列位置
     */
    public static int calculateQueue(int priority) {
        return priority;
    }

    /**
     * 检查是否应该优先处理（优先级是否最高）
     */
    public static boolean shouldPrioritize(int priority) {
        return priority == 0;
    }
}

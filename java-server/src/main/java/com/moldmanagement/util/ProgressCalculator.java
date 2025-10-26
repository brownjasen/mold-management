package com.moldmanagement.util;

import com.moldmanagement.entity.Mold;
import com.moldmanagement.entity.MoldModule;

public class ProgressCalculator {
    
    public static double calculateProgress(Mold mold) {
        if (mold.getModules() == null || mold.getModules().isEmpty()) {
            return 0.0;
        }

        double totalPercentage = 0.0;
        double completedPercentage = 0.0;

        for (MoldModule module : mold.getModules()) {
            totalPercentage += module.getStagePercentage();
            if ("completed".equals(module.getStatus())) {
                completedPercentage += module.getStagePercentage();
            }
        }

        if (totalPercentage == 0) {
            return 0.0;
        }

        return Math.round((completedPercentage / totalPercentage) * 10000.0) / 100.0;
    }
}

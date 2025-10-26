package com.moldmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoldDTO {
    private Long id;
    private String moldNumber;
    private LocalDateTime orderTime;
    private LocalDateTime startTime;
    private LocalDateTime completionTime;
    private Double overallProgress;
    private Integer priority;
    private Integer queue;
    private String status;
    private List<ModuleDTO> modules;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModuleDTO {
        private Long id;
        private String moduleName;
        private String stageName;
        private Double stagePercentage;
        private String status;
        private LocalDateTime startTime;
        private LocalDateTime completionTime;
    }
}

package com.moldmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDTO {
    private Long id;
    private String partName;
    private String partModel;
    private Integer currentStock;
    private Integer safetyStock;
    private Boolean lowStockAlert;
    private LocalDateTime inboundTime;
    private LocalDateTime outboundTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

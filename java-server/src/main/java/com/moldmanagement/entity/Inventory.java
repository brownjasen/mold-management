package com.moldmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String partName;         // 品名（唯一）
    private String partModel;        // 型号
    private Integer currentStock;    // 当前库存
    private Integer safetyStock;     // 安全库存（默认200）
    private Boolean lowStockAlert;   // 低库存预警

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime inboundTime;   // 入库时间

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime outboundTime;  // 出库时间

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (safetyStock == null) {
            safetyStock = 200;
        }
        if (currentStock == null) {
            currentStock = 0;
        }
        if (lowStockAlert == null) {
            lowStockAlert = false;
        }
        updateStockAlert();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        updateStockAlert();
    }

    private void updateStockAlert() {
        this.lowStockAlert = currentStock < safetyStock;
    }
}

package com.moldmanagement.controller;

import com.moldmanagement.dto.ApiResponse;
import com.moldmanagement.entity.Inventory;
import com.moldmanagement.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<?> getAllInventory() {
        try {
            List<Inventory> inventory = inventoryService.getAllInventory();
            return ResponseEntity.ok(ApiResponse.success("获取成功", inventory));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInventoryById(@PathVariable Long id) {
        try {
            return inventoryService.getInventoryById(id)
                    .map(inv -> ResponseEntity.ok(ApiResponse.success(inv)))
                    .orElseGet(() -> ResponseEntity.badRequest()
                            .body(ApiResponse.error("库存不存在")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addInventory(@RequestBody Inventory inventory) {
        try {
            Inventory added = inventoryService.addInventory(inventory);
            return ResponseEntity.ok(ApiResponse.success("入库成功", added));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/deduct")
    public ResponseEntity<?> deductInventory(@RequestBody Map<String, Object> request) {
        try {
            String partName = (String) request.get("partName");
            Integer quantity = Integer.parseInt(request.get("quantity").toString());
            
            Inventory updated = inventoryService.deductInventory(partName, quantity);
            return ResponseEntity.ok(ApiResponse.success("出库成功", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/restock")
    public ResponseEntity<?> restockInventory(@RequestBody Map<String, Object> request) {
        try {
            String partName = (String) request.get("partName");
            Integer quantity = Integer.parseInt(request.get("quantity").toString());
            
            Inventory updated = inventoryService.restockInventory(partName, quantity);
            return ResponseEntity.ok(ApiResponse.success("补货成功", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/alerts")
    public ResponseEntity<?> getLowStockAlerts() {
        try {
            List<Inventory> alerts = inventoryService.getLowStockAlerts();
            return ResponseEntity.ok(ApiResponse.success("低库存预警", alerts));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInventory(@PathVariable Long id) {
        try {
            inventoryService.deleteInventory(id);
            return ResponseEntity.ok(ApiResponse.success("库存删除成功", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

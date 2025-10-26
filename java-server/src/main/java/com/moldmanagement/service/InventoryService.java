package com.moldmanagement.service;

import com.moldmanagement.entity.Inventory;
import com.moldmanagement.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public Inventory addInventory(Inventory inventory) {
        inventory.setInboundTime(LocalDateTime.now());
        inventory.setCurrentStock(inventory.getCurrentStock() != null ? inventory.getCurrentStock() : 0);
        inventory.setSafetyStock(inventory.getSafetyStock() != null ? inventory.getSafetyStock() : 200);
        return inventoryRepository.save(inventory);
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Optional<Inventory> getInventoryById(Long id) {
        return inventoryRepository.findById(id);
    }

    public Optional<Inventory> getInventoryByPartName(String partName) {
        return inventoryRepository.findByPartName(partName);
    }

    public Inventory deductInventory(String partName, Integer quantity) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByPartName(partName);
        if (inventoryOpt.isEmpty()) {
            throw new RuntimeException("库存物品不存在: " + partName);
        }

        Inventory inventory = inventoryOpt.get();
        if (inventory.getCurrentStock() < quantity) {
            throw new RuntimeException("库存不足");
        }

        inventory.setCurrentStock(inventory.getCurrentStock() - quantity);
        inventory.setOutboundTime(LocalDateTime.now());
        return inventoryRepository.save(inventory);
    }

    public Inventory restockInventory(String partName, Integer quantity) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByPartName(partName);
        Inventory inventory;
        
        if (inventoryOpt.isPresent()) {
            inventory = inventoryOpt.get();
            inventory.setCurrentStock(inventory.getCurrentStock() + quantity);
        } else {
            inventory = new Inventory();
            inventory.setPartName(partName);
            inventory.setCurrentStock(quantity);
            inventory.setSafetyStock(200);
        }
        
        inventory.setInboundTime(LocalDateTime.now());
        return inventoryRepository.save(inventory);
    }

    public List<Inventory> getLowStockAlerts() {
        return inventoryRepository.findAllByLowStockAlertTrue();
    }

    public Inventory updateInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public void deleteInventory(Long inventoryId) {
        inventoryRepository.deleteById(inventoryId);
    }
}

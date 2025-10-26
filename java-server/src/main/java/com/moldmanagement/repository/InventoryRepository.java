package com.moldmanagement.repository;

import com.moldmanagement.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByPartName(String partName);
    List<Inventory> findAllByLowStockAlertTrue();
}

package com.moldmanagement.controller;

import com.moldmanagement.dto.ApiResponse;
import com.moldmanagement.entity.Mold;
import com.moldmanagement.service.MoldService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/molds")
@RequiredArgsConstructor
public class MoldController {
    private final MoldService moldService;

    @PostMapping("/create")
    public ResponseEntity<?> createMold(@RequestBody Mold mold) {
        try {
            Mold created = moldService.createMold(mold);
            return ResponseEntity.ok(ApiResponse.success("模具创建成功", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getAllMolds() {
        try {
            List<Mold> molds = moldService.getAllMolds();
            return ResponseEntity.ok(ApiResponse.success("获取成功", molds));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMoldById(@PathVariable Long id) {
        try {
            return moldService.getMoldById(id)
                    .map(mold -> ResponseEntity.ok(ApiResponse.success(mold)))
                    .orElseGet(() -> ResponseEntity.badRequest()
                            .body(ApiResponse.error("模具不存在")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/update-stage")
    public ResponseEntity<?> updateMoldStage(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        try {
            Long moduleId = Long.parseLong(request.get("moduleId").toString());
            String newStatus = (String) request.get("status");
            
            Mold updated = moldService.updateMoldStage(id, moduleId, newStatus);
            return ResponseEntity.ok(ApiResponse.success("工序更新成功", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/reprioritize")
    public ResponseEntity<?> reprioritizeMold(@PathVariable Long id) {
        try {
            Mold updated = moldService.reprioritizeMold(id);
            return ResponseEntity.ok(ApiResponse.success("加急成功", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/repair")
    public ResponseEntity<?> addRepairRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String repairReason = request.get("reason");
            Mold updated = moldService.addRepairRequest(id, repairReason);
            return ResponseEntity.ok(ApiResponse.success("返修申请成功", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMold(@PathVariable Long id) {
        try {
            moldService.deleteMold(id);
            return ResponseEntity.ok(ApiResponse.success("模具删除成功", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

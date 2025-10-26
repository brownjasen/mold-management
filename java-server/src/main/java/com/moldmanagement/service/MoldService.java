package com.moldmanagement.service;

import com.moldmanagement.entity.Mold;
import com.moldmanagement.entity.MoldModule;
import com.moldmanagement.repository.MoldRepository;
import com.moldmanagement.util.ProgressCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MoldService {
    private final MoldRepository moldRepository;

    public Mold createMold(Mold mold) {
        mold.setOrderTime(LocalDateTime.now());
        mold.setStatus("pending");
        mold.setOverallProgress(0.0);
        mold.setPriority(Integer.MAX_VALUE);
        return moldRepository.save(mold);
    }

    public List<Mold> getAllMolds() {
        return moldRepository.findAllByOrderByPriorityAscOrderTimeAsc();
    }

    public Optional<Mold> getMoldById(Long id) {
        return moldRepository.findById(id);
    }

    public Optional<Mold> getMoldByNumber(String moldNumber) {
        return moldRepository.findByMoldNumber(moldNumber);
    }

    public Mold updateMoldStage(Long moldId, Long moduleId, String newStatus) {
        Optional<Mold> moldOpt = moldRepository.findById(moldId);
        if (moldOpt.isEmpty()) {
            throw new RuntimeException("模具不存在");
        }

        Mold mold = moldOpt.get();
        for (MoldModule module : mold.getModules()) {
            if (module.getId().equals(moduleId)) {
                module.setStatus(newStatus);
                if ("in_progress".equals(newStatus)) {
                    module.setStartTime(LocalDateTime.now());
                } else if ("completed".equals(newStatus)) {
                    module.setCompletionTime(LocalDateTime.now());
                }
                break;
            }
        }

        mold.setOverallProgress(ProgressCalculator.calculateProgress(mold));
        
        if (mold.getOverallProgress() >= 100.0) {
            mold.setStatus("completed");
            mold.setCompletionTime(LocalDateTime.now());
        } else if (mold.getOverallProgress() > 0) {
            mold.setStatus("in_progress");
            if (mold.getStartTime() == null) {
                mold.setStartTime(LocalDateTime.now());
            }
        }

        return moldRepository.save(mold);
    }

    public Mold reprioritizeMold(Long moldId) {
        Optional<Mold> moldOpt = moldRepository.findById(moldId);
        if (moldOpt.isEmpty()) {
            throw new RuntimeException("模具不存在");
        }

        Mold mold = moldOpt.get();
        mold.setPriority(0);
        return moldRepository.save(mold);
    }

    public Mold addRepairRequest(Long moldId, String repairReason) {
        Optional<Mold> moldOpt = moldRepository.findById(moldId);
        if (moldOpt.isEmpty()) {
            throw new RuntimeException("模具不存在");
        }

        Mold mold = moldOpt.get();
        mold.setStatus("repair");
        mold.setPriority(0);
        return moldRepository.save(mold);
    }

    public Mold updateMold(Mold mold) {
        return moldRepository.save(mold);
    }

    public void deleteMold(Long moldId) {
        moldRepository.deleteById(moldId);
    }
}

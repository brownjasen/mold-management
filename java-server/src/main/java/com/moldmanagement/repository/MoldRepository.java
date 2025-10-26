package com.moldmanagement.repository;

import com.moldmanagement.entity.Mold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MoldRepository extends JpaRepository<Mold, Long> {
    Optional<Mold> findByMoldNumber(String moldNumber);
    List<Mold> findAllByOrderByPriorityAscOrderTimeAsc();
    List<Mold> findAllByStatus(String status);
}

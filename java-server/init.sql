-- 创建数据库
CREATE DATABASE IF NOT EXISTS mold_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE mold_management;

-- 创建模具表
CREATE TABLE IF NOT EXISTS molds (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    mold_number VARCHAR(100) UNIQUE NOT NULL,
    order_time DATETIME,
    start_time DATETIME,
    completion_time DATETIME,
    overall_progress DOUBLE DEFAULT 0,
    priority INT DEFAULT 2147483647,
    queue INT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_priority (priority),
    INDEX idx_status (status),
    INDEX idx_mold_number (mold_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建模具工序表
CREATE TABLE IF NOT EXISTS mold_modules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    mold_id BIGINT NOT NULL,
    module_name VARCHAR(100),
    stage_name VARCHAR(100),
    stage_percentage DOUBLE DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    start_time DATETIME,
    completion_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mold_id) REFERENCES molds(id) ON DELETE CASCADE,
    INDEX idx_mold_id (mold_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建库存表
CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    part_name VARCHAR(100) UNIQUE NOT NULL,
    part_model VARCHAR(100),
    current_stock INT DEFAULT 0,
    safety_stock INT DEFAULT 200,
    low_stock_alert BOOLEAN DEFAULT FALSE,
    inbound_time DATETIME,
    outbound_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_part_name (part_name),
    INDEX idx_low_stock (low_stock_alert)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入示例数据
INSERT INTO molds (mold_number, order_time, priority, status, overall_progress) VALUES
('MOL-001', NOW(), 100, 'pending', 0),
('MOL-002', DATE_SUB(NOW(), INTERVAL 1 DAY), 50, 'in_progress', 25.5),
('MOL-003', DATE_SUB(NOW(), INTERVAL 2 DAY), 10, 'in_progress', 60.0);

INSERT INTO inventory (part_name, part_model, current_stock, safety_stock) VALUES
('铜板', 'A-100', 500, 200),
('铜导套', 'B-200', 150, 200),
('导柱', 'C-300', 800, 200),
('导套', 'D-400', 300, 200),
('阀针', 'E-500', 100, 200),
('密封圈', 'F-600', 1200, 200);

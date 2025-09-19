#!/usr/bin/env python3
"""
🔍 AIOS 6502 Emulator Logging System
Advanced logging with rotation, categorization, and performance monitoring
"""

import logging
import logging.handlers
import os
import time
import json
from datetime import datetime
from typing import Dict, Any, Optional, List
from pathlib import Path


class EmulatorLogger:
    """Advanced logging system for the 6502 emulator"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logging_settings = config.get('logging_settings', {})
        self.performance_settings = config.get('emulator_settings', {}).get('performance_monitoring', {})
        
        # Performance tracking
        self.instruction_times = []
        self.memory_access_count = 0
        self.basic_command_count = 0
        self.start_time = time.time()
        
        # Setup logging
        self._setup_logging()
        
        # Create loggers for different categories
        self.cpu_logger = logging.getLogger('cpu')
        self.memory_logger = logging.getLogger('memory')
        self.basic_logger = logging.getLogger('basic')
        self.io_logger = logging.getLogger('io')
        self.error_logger = logging.getLogger('error')
        self.perf_logger = logging.getLogger('performance')
        self.debug_logger = logging.getLogger('debug')
        
        self.logger.info("🔍 Emulator logging system initialized")
    
    def _setup_logging(self):
        """Setup the logging configuration"""
        log_level = getattr(logging, self.logging_settings.get('log_level', 'INFO'))
        log_format = self.logging_settings.get('log_format', 
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        date_format = self.logging_settings.get('log_date_format', '%Y-%m-%d %H:%M:%S')
        
        # Create logs directory
        logs_dir = Path(self.logging_settings.get('log_file_path', 'logs/emulator.log')).parent
        logs_dir.mkdir(exist_ok=True)
        
        # Configure root logger
        logging.basicConfig(
            level=log_level,
            format=log_format,
            datefmt=date_format
        )
        
        self.logger = logging.getLogger('emulator')
        
        # Setup file handler with rotation
        if self.logging_settings.get('log_to_file', True):
            log_file = self.logging_settings.get('log_file_path', 'logs/emulator.log')
            rotation_config = self.logging_settings.get('log_rotation', {})
            
            if rotation_config.get('enabled', True):
                max_bytes = rotation_config.get('max_file_size_mb', 10) * 1024 * 1024
                backup_count = rotation_config.get('backup_count', 5)
                
                file_handler = logging.handlers.RotatingFileHandler(
                    log_file,
                    maxBytes=max_bytes,
                    backupCount=backup_count
                )
            else:
                file_handler = logging.FileHandler(log_file)
            
            file_handler.setFormatter(logging.Formatter(log_format, date_format))
            self.logger.addHandler(file_handler)
        
        # Setup console handler
        if self.logging_settings.get('log_to_console', True):
            console_handler = logging.StreamHandler()
            console_handler.setFormatter(logging.Formatter(log_format, date_format))
            self.logger.addHandler(console_handler)
    
    def log_cpu_state(self, cpu_state: Dict[str, Any], instruction: str = ""):
        """Log CPU state changes"""
        if not self.logging_settings.get('log_categories', {}).get('cpu_state', True):
            return
        
        state_info = {
            'pc': f"0x{cpu_state.get('pc', 0):04X}",
            'a': f"0x{cpu_state.get('a', 0):02X}",
            'x': f"0x{cpu_state.get('x', 0):02X}",
            'y': f"0x{cpu_state.get('y', 0):02X}",
            'sp': f"0x{cpu_state.get('sp', 0):02X}",
            'flags': f"0x{cpu_state.get('flags', 0):02X}",
            'instruction': instruction
        }
        
        self.cpu_logger.info(f"CPU State: {json.dumps(state_info)}")
    
    def log_memory_access(self, address: int, value: int, operation: str, size: int = 1):
        """Log memory access operations"""
        if not self.logging_settings.get('log_categories', {}).get('memory_access', True):
            return
        
        self.memory_access_count += 1
        
        access_info = {
            'address': f"0x{address:04X}",
            'value': f"0x{value:02X}" if size == 1 else f"0x{value:04X}",
            'operation': operation,
            'size': size
        }
        
        self.memory_logger.debug(f"Memory {operation}: {json.dumps(access_info)}")
    
    def log_basic_command(self, command: str, line_number: int = 0, variables: Dict[str, Any] = None):
        """Log BASIC command execution"""
        if not self.logging_settings.get('log_categories', {}).get('basic_commands', True):
            return
        
        self.basic_command_count += 1
        
        command_info = {
            'line': line_number,
            'command': command,
            'variables': variables or {}
        }
        
        self.basic_logger.info(f"BASIC Command: {json.dumps(command_info)}")
    
    def log_io_operation(self, operation: str, device: str, data: Any = None):
        """Log I/O operations"""
        if not self.logging_settings.get('log_categories', {}).get('io_operations', True):
            return
        
        io_info = {
            'operation': operation,
            'device': device,
            'data': str(data) if data is not None else None
        }
        
        self.io_logger.info(f"I/O Operation: {json.dumps(io_info)}")
    
    def log_error(self, error_type: str, message: str, context: Dict[str, Any] = None):
        """Log error conditions"""
        if not self.logging_settings.get('log_categories', {}).get('error_handling', True):
            return
        
        error_info = {
            'type': error_type,
            'message': message,
            'context': context or {},
            'timestamp': datetime.now().isoformat()
        }
        
        self.error_logger.error(f"Error: {json.dumps(error_info)}")
    
    def log_performance(self, instruction: str, execution_time: float, cycles: int = 1):
        """Log performance metrics"""
        if not self.logging_settings.get('log_categories', {}).get('performance', True):
            return
        
        if self.performance_settings.get('instruction_timing', True):
            self.instruction_times.append({
                'instruction': instruction,
                'time': execution_time,
                'cycles': cycles,
                'timestamp': time.time()
            })
        
        perf_info = {
            'instruction': instruction,
            'execution_time_ms': execution_time * 1000,
            'cycles': cycles,
            'instructions_per_second': 1.0 / execution_time if execution_time > 0 else 0
        }
        
        self.perf_logger.debug(f"Performance: {json.dumps(perf_info)}")
    
    def log_debug(self, message: str, data: Any = None):
        """Log debug information"""
        if not self.logging_settings.get('log_categories', {}).get('debug_info', False):
            return
        
        debug_info = {
            'message': message,
            'data': data,
            'timestamp': datetime.now().isoformat()
        }
        
        self.debug_logger.debug(f"Debug: {json.dumps(debug_info)}")
    
    def get_performance_summary(self) -> Dict[str, Any]:
        """Get performance summary statistics"""
        current_time = time.time()
        uptime = current_time - self.start_time
        
        if self.instruction_times:
            total_time = sum(entry['time'] for entry in self.instruction_times)
            avg_time = total_time / len(self.instruction_times)
            instructions_per_second = len(self.instruction_times) / uptime if uptime > 0 else 0
        else:
            total_time = 0
            avg_time = 0
            instructions_per_second = 0
        
        return {
            'uptime_seconds': uptime,
            'total_instructions': len(self.instruction_times),
            'memory_accesses': self.memory_access_count,
            'basic_commands': self.basic_command_count,
            'average_instruction_time_ms': avg_time * 1000,
            'instructions_per_second': instructions_per_second,
            'total_execution_time_ms': total_time * 1000
        }
    
    def log_performance_summary(self):
        """Log performance summary"""
        summary = self.get_performance_summary()
        self.perf_logger.info(f"Performance Summary: {json.dumps(summary, indent=2)}")
    
    def clear_logs(self):
        """Clear all log files"""
        log_file = self.logging_settings.get('log_file_path', 'logs/emulator.log')
        if os.path.exists(log_file):
            with open(log_file, 'w') as f:
                f.write("")
            self.logger.info("Logs cleared")
    
    def set_log_level(self, level: str):
        """Change log level dynamically"""
        log_level = getattr(logging, level.upper())
        self.logger.setLevel(log_level)
        self.logger.info(f"Log level changed to {level}")
    
    def enable_category(self, category: str):
        """Enable logging for a specific category"""
        categories = self.logging_settings.get('log_categories', {})
        categories[category] = True
        self.logger.info(f"Enabled logging for category: {category}")
    
    def disable_category(self, category: str):
        """Disable logging for a specific category"""
        categories = self.logging_settings.get('log_categories', {})
        categories[category] = False
        self.logger.info(f"Disabled logging for category: {category}")


class PerformanceProfiler:
    """Performance profiler for instruction timing"""
    
    def __init__(self, logger: EmulatorLogger):
        self.logger = logger
        self.start_time = None
        self.instruction_start = None
    
    def start_execution(self):
        """Start timing overall execution"""
        self.start_time = time.time()
        self.logger.logger.info("🚀 Execution profiling started")
    
    def start_instruction(self):
        """Start timing individual instruction"""
        self.instruction_start = time.time()
    
    def end_instruction(self, instruction: str, cycles: int = 1):
        """End timing for individual instruction"""
        if self.instruction_start:
            execution_time = time.time() - self.instruction_start
            self.logger.log_performance(instruction, execution_time, cycles)
            self.instruction_start = None
    
    def end_execution(self):
        """End timing overall execution"""
        if self.start_time:
            total_time = time.time() - self.start_time
            self.logger.logger.info(f"⏱️ Total execution time: {total_time:.3f} seconds")
            self.logger.log_performance_summary()


def create_logger(config: Dict[str, Any]) -> EmulatorLogger:
    """Factory function to create logger instance"""
    return EmulatorLogger(config)


if __name__ == "__main__":
    # Test the logging system
    test_config = {
        'logging_settings': {
            'log_level': 'DEBUG',
            'log_to_file': True,
            'log_to_console': True,
            'log_file_path': 'logs/test_emulator.log',
            'log_categories': {
                'cpu_state': True,
                'memory_access': True,
                'basic_commands': True,
                'io_operations': True,
                'error_handling': True,
                'performance': True,
                'debug_info': True
            }
        },
        'emulator_settings': {
            'performance_monitoring': {
                'enabled': True,
                'instruction_timing': True
            }
        }
    }
    
    logger = create_logger(test_config)
    
    # Test different log types
    logger.log_cpu_state({'pc': 0x8000, 'a': 0x42, 'x': 0x10, 'y': 0x20}, 'LDA #$42')
    logger.log_memory_access(0x8000, 0x42, 'READ')
    logger.log_basic_command('PRINT "Hello"', 10)
    logger.log_io_operation('WRITE', 'DISPLAY', 'Hello World')
    logger.log_error('SYNTAX_ERROR', 'Invalid command')
    logger.log_performance('LDA', 0.001, 2)
    logger.log_debug('Test debug message', {'test': True})
    
    # Show performance summary
    logger.log_performance_summary()
    
    print("✅ Logging system test completed")

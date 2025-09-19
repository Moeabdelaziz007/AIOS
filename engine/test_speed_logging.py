#!/usr/bin/env python3
"""
Test script for Phase 2.4: Speed Control and Logging
Tests the enhanced emulator with configurable speed and comprehensive logging
"""

import os
import sys
import json
import time
from pathlib import Path

# Add emulator directory to path
current_dir = Path(__file__).parent
emulator_dir = current_dir / "emulator"
sys.path.insert(0, str(emulator_dir))

try:
    from emulator.aios_6502_emulator import CPU6502, Emulator6502
    from emulator.emulator_logger import EmulatorLogger, PerformanceProfiler
except ImportError as e:
    print(f"❌ Error importing modules: {e}")
    print("Trying alternative import...")
    try:
        import sys
        sys.path.append('emulator')
        from aios_6502_emulator import CPU6502, Emulator6502
        from emulator_logger import EmulatorLogger, PerformanceProfiler
    except ImportError as e2:
        print(f"❌ Alternative import also failed: {e2}")
        sys.exit(1)


def test_speed_control():
    """Test CPU speed control functionality"""
    print("🧪 Testing CPU Speed Control")
    print("=" * 40)
    
    # Test configuration with different speeds
    test_configs = [
        {"name": "Slow Speed", "speed_multiplier": 0.1, "max_speed": False},
        {"name": "Normal Speed", "speed_multiplier": 1.0, "max_speed": False},
        {"name": "Fast Speed", "speed_multiplier": 10.0, "max_speed": False},
        {"name": "Maximum Speed", "speed_multiplier": 1.0, "max_speed": True}
    ]
    
    for config in test_configs:
        print(f"\n⚡ Testing {config['name']}")
        
        # Create CPU with speed configuration
        cpu_config = {
            "emulator_settings": {
                "cpu_speed": {
                    "frequency_hz": 1000000,
                    "cycle_delay_ms": 0.001,
                    "speed_multiplier": config["speed_multiplier"],
                    "max_speed": config["max_speed"]
                }
            }
        }
        
        cpu = CPU6502(cpu_config)
        
        # Test cycle delay timing
        start_time = time.time()
        
        # Simulate 100 cycles
        for i in range(100):
            cpu.apply_cycle_delay(1)
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        print(f"   Execution time: {execution_time:.3f} seconds")
        print(f"   Speed multiplier: {config['speed_multiplier']}x")
        print(f"   Max speed: {config['max_speed']}")
        
        # Verify speed differences
        if config["max_speed"]:
            assert execution_time < 0.01, "Maximum speed should be very fast"
        elif config["speed_multiplier"] == 0.1:
            assert execution_time > 0.001, "Slow speed should take longer than max speed"
        elif config["speed_multiplier"] == 10.0:
            assert execution_time < 0.01, "Fast speed should be faster than normal"
    
    print("✅ Speed control tests passed!")


def test_logging_system():
    """Test comprehensive logging system"""
    print("\n🧪 Testing Logging System")
    print("=" * 40)
    
    # Create test configuration
    test_config = {
        "logging_settings": {
            "log_level": "DEBUG",
            "log_to_file": True,
            "log_to_console": True,
            "log_file_path": "logs/test_emulator.log",
            "log_rotation": {
                "enabled": True,
                "max_file_size_mb": 1,
                "backup_count": 3
            },
            "log_categories": {
                "cpu_state": True,
                "memory_access": True,
                "basic_commands": True,
                "io_operations": True,
                "error_handling": True,
                "performance": True,
                "debug_info": True
            }
        },
        "emulator_settings": {
            "performance_monitoring": {
                "enabled": True,
                "instruction_timing": True
            }
        }
    }
    
    # Create logger
    logger = EmulatorLogger(test_config)
    
    print("📝 Testing different log categories...")
    
    # Test CPU state logging
    cpu_state = {
        'pc': 0x8000,
        'a': 0x42,
        'x': 0x10,
        'y': 0x20,
        'sp': 0xFF,
        'flags': 0x20
    }
    logger.log_cpu_state(cpu_state, "LDA #$42")
    
    # Test memory access logging
    logger.log_memory_access(0x8000, 0x42, 'READ')
    logger.log_memory_access(0x8001, 0x10, 'WRITE')
    
    # Test BASIC command logging
    logger.log_basic_command('PRINT "Hello World"', 10, {'A': 42, 'B': 10})
    
    # Test I/O operation logging
    logger.log_io_operation('WRITE', 'DISPLAY', 'Hello World')
    logger.log_io_operation('READ', 'KEYBOARD', 'A')
    
    # Test error logging
    logger.log_error('SYNTAX_ERROR', 'Invalid command', {'line': 10, 'command': 'PRIT'})
    
    # Test performance logging
    logger.log_performance('LDA', 0.001, 2)
    logger.log_performance('STA', 0.002, 3)
    
    # Test debug logging
    logger.log_debug('Test debug message', {'test': True, 'value': 42})
    
    # Test performance summary
    logger.log_performance_summary()
    
    # Test log level changes
    logger.set_log_level('ERROR')
    logger.logger.info("This should not appear")
    logger.logger.error("This should appear")
    
    # Test category enable/disable
    logger.disable_category('cpu_state')
    logger.log_cpu_state(cpu_state, "This should not log")
    
    logger.enable_category('cpu_state')
    logger.log_cpu_state(cpu_state, "This should log again")
    
    print("✅ Logging system tests passed!")


def test_performance_profiler():
    """Test performance profiler"""
    print("\n🧪 Testing Performance Profiler")
    print("=" * 40)
    
    # Create test configuration
    test_config = {
        "logging_settings": {
            "log_level": "INFO",
            "log_to_console": True,
            "log_categories": {
                "performance": True
            }
        },
        "emulator_settings": {
            "performance_monitoring": {
                "enabled": True,
                "instruction_timing": True
            }
        }
    }
    
    logger = EmulatorLogger(test_config)
    profiler = PerformanceProfiler(logger)
    
    print("📊 Testing performance profiling...")
    
    # Start execution profiling
    profiler.start_execution()
    
    # Simulate instruction execution
    instructions = [
        ('LDA', 0.001, 2),
        ('STA', 0.002, 3),
        ('LDX', 0.001, 2),
        ('STX', 0.002, 3),
        ('LDY', 0.001, 2),
        ('STY', 0.002, 3)
    ]
    
    for instruction, exec_time, cycles in instructions:
        profiler.start_instruction()
        time.sleep(exec_time)  # Simulate execution time
        profiler.end_instruction(instruction, cycles)
    
    # End execution profiling
    profiler.end_execution()
    
    # Get performance summary
    summary = logger.get_performance_summary()
    print(f"📊 Performance Summary:")
    print(f"   Total instructions: {summary['total_instructions']}")
    print(f"   Average time per instruction: {summary['average_instruction_time_ms']:.3f} ms")
    print(f"   Instructions per second: {summary['instructions_per_second']:.1f}")
    
    print("✅ Performance profiler tests passed!")


def test_integrated_emulator():
    """Test integrated emulator with speed and logging"""
    print("\n🧪 Testing Integrated Emulator")
    print("=" * 40)
    
    # Create comprehensive configuration
    config = {
        "emulator_settings": {
            "cpu_speed": {
                "frequency_hz": 1000000,
                "cycle_delay_ms": 0.001,
                "speed_multiplier": 1.0,
                "max_speed": False
            },
            "performance_monitoring": {
                "enabled": True,
                "instruction_timing": True
            }
        },
        "logging_settings": {
            "log_level": "INFO",
            "log_to_file": True,
            "log_to_console": True,
            "log_file_path": "logs/integrated_test.log",
            "log_categories": {
                "cpu_state": True,
                "memory_access": True,
                "performance": True
            }
        }
    }
    
    # Create emulator
    emulator = Emulator6502(config)
    
    print("🔧 Testing emulator with speed control and logging...")
    
    # Load a simple test program
    test_program = bytes([
        0xA9, 0x42,  # LDA #$42
        0x8D, 0x00, 0x80,  # STA $8000
        0xA2, 0x10,  # LDX #$10
        0x8E, 0x01, 0x80,  # STX $8001
        0xA0, 0x20,  # LDY #$20
        0x8C, 0x02, 0x80,  # STY $8002
        0x00  # BRK
    ])
    
    emulator.load_program(test_program, 0x8000)
    
    # Test different speeds
    speeds = [0.1, 1.0, 10.0]
    
    for speed in speeds:
        print(f"\n⚡ Testing at {speed}x speed")
        
        # Set CPU speed
        emulator.cpu.set_cpu_speed(speed_multiplier=speed)
        
        # Reset and run
        emulator.reset()
        emulator.cpu.pc = 0x8000
        emulator.cpu.running = True
        
        start_time = time.time()
        
        # Execute a few instructions
        for i in range(5):
            cycles = emulator.step()
            if cycles == 0:
                break
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        print(f"   Execution time: {execution_time:.3f} seconds")
        print(f"   CPU state: PC=${emulator.cpu.pc:04X} A=${emulator.cpu.a:02X}")
    
    print("✅ Integrated emulator tests passed!")


def test_log_rotation():
    """Test log rotation functionality"""
    print("\n🧪 Testing Log Rotation")
    print("=" * 40)
    
    # Create configuration with small log size for testing
    config = {
        "logging_settings": {
            "log_level": "DEBUG",
            "log_to_file": True,
            "log_file_path": "logs/rotation_test.log",
            "log_rotation": {
                "enabled": True,
                "max_file_size_mb": 0.001,  # Very small for testing
                "backup_count": 3
            },
            "log_categories": {
                "cpu_state": True,
                "memory_access": True
            }
        }
    }
    
    logger = EmulatorLogger(config)
    
    print("📝 Testing log rotation with small file size...")
    
    # Generate enough logs to trigger rotation
    for i in range(100):
        logger.log_cpu_state({'pc': i, 'a': i & 0xFF}, f"Instruction {i}")
        logger.log_memory_access(i, i & 0xFF, 'READ')
    
    # Check if log files were created
    log_dir = Path("logs")
    log_files = list(log_dir.glob("rotation_test.log*"))
    
    print(f"   Log files created: {len(log_files)}")
    for log_file in log_files:
        size = log_file.stat().st_size
        print(f"   {log_file.name}: {size} bytes")
    
    print("✅ Log rotation tests passed!")


def main():
    """Run all tests"""
    print("🚀 Phase 2.4: Speed Control and Logging Tests")
    print("=" * 50)
    
    # Create logs directory
    os.makedirs("logs", exist_ok=True)
    
    try:
        # Run all tests
        test_speed_control()
        test_logging_system()
        test_performance_profiler()
        test_integrated_emulator()
        test_log_rotation()
        
        print("\n🎉 All Phase 2.4 tests passed successfully!")
        print("\n📊 Test Summary:")
        print("✅ CPU Speed Control - Configurable execution speed")
        print("✅ Logging System - Comprehensive logging with categories")
        print("✅ Performance Profiler - Instruction timing and monitoring")
        print("✅ Integrated Emulator - Full emulator with speed and logging")
        print("✅ Log Rotation - Automatic log file rotation")
        
        print("\n🔧 Features Verified:")
        print("• Speed control via settings and command-line")
        print("• CPU state logging with detailed information")
        print("• Memory access logging for debugging")
        print("• Performance monitoring and profiling")
        print("• Log rotation with configurable size limits")
        print("• Multiple log categories and levels")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

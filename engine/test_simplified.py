#!/usr/bin/env python3
"""
Phase 2, Step 2.5: Simplified Emulator Test
Focus on testing what we can actually verify without full BASIC integration
"""

import os
import sys
import time
import json
from pathlib import Path

# Add emulator directory to path
emulator_dir = Path(__file__).parent / "emulator"
sys.path.insert(0, str(emulator_dir))

def test_basic_cpu_functionality():
    """Test basic CPU functionality"""
    print("🔍 Testing Basic CPU Functionality...")
    
    try:
        from aios_6502_emulator import CPU6502
        
        # Create CPU instance
        cpu = CPU6502()
        
        # Test basic properties
        assert cpu.a == 0, "Accumulator should start at 0"
        assert cpu.x == 0, "X register should start at 0"
        assert cpu.y == 0, "Y register should start at 0"
        assert cpu.pc == 0, "Program counter should start at 0"
        assert cpu.sp == 0xFF, "Stack pointer should start at 0xFF"
        
        # Test register operations
        cpu.a = 0x42
        cpu.x = 0x10
        cpu.y = 0x20
        
        assert cpu.a == 0x42, "Accumulator assignment failed"
        assert cpu.x == 0x10, "X register assignment failed"
        assert cpu.y == 0x20, "Y register assignment failed"
        
        # Test memory operations
        cpu.write_byte(0x1000, 0xAB)
        assert cpu.read_byte(0x1000) == 0xAB, "Memory write/read failed"
        
        cpu.write_word(0x2000, 0x1234)
        assert cpu.read_word(0x2000) == 0x1234, "Word write/read failed"
        
        print("✅ Basic CPU functionality test passed")
        return True
        
    except Exception as e:
        print(f"❌ Basic CPU functionality test failed: {e}")
        return False

def test_memory_management():
    """Test memory management"""
    print("🔍 Testing Memory Management...")
    
    try:
        from aios_6502_emulator import CPU6502
        
        cpu = CPU6502()
        
        # Test memory bounds
        cpu.write_byte(0x0000, 0x01)
        cpu.write_byte(0xFFFF, 0xFF)
        
        assert cpu.read_byte(0x0000) == 0x01, "Memory at 0x0000 failed"
        assert cpu.read_byte(0xFFFF) == 0xFF, "Memory at 0xFFFF failed"
        
        # Test memory array operations
        test_data = [0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99]
        for i, val in enumerate(test_data):
            cpu.write_byte(0x3000 + i, val)
            assert cpu.read_byte(0x3000 + i) == val, f"Memory array test failed at {i}"
        
        print("✅ Memory management test passed")
        return True
        
    except Exception as e:
        print(f"❌ Memory management test failed: {e}")
        return False

def test_flag_operations():
    """Test CPU flag operations"""
    print("🔍 Testing Flag Operations...")
    
    try:
        from aios_6502_emulator import CPU6502
        
        cpu = CPU6502()
        
        # Test flag setting
        cpu.set_flag(cpu.CARRY, True)
        assert cpu.get_flag(cpu.CARRY) == True, "Carry flag set failed"
        
        cpu.set_flag(cpu.ZERO, True)
        assert cpu.get_flag(cpu.ZERO) == True, "Zero flag set failed"
        
        cpu.set_flag(cpu.NEGATIVE, True)
        assert cpu.get_flag(cpu.NEGATIVE) == True, "Negative flag set failed"
        
        # Test flag clearing
        cpu.set_flag(cpu.CARRY, False)
        assert cpu.get_flag(cpu.CARRY) == False, "Carry flag clear failed"
        
        print("✅ Flag operations test passed")
        return True
        
    except Exception as e:
        print(f"❌ Flag operations test failed: {e}")
        return False

def test_instruction_execution():
    """Test basic instruction execution"""
    print("🔍 Testing Instruction Execution...")
    
    try:
        from aios_6502_emulator import CPU6502
        
        cpu = CPU6502()
        
        # Test LDA instruction (Load Accumulator)
        cpu.memory[0x0000] = 0xA9  # LDA immediate
        cpu.memory[0x0001] = 0x42  # Value to load
        
        # Execute instruction
        cpu.execute_instruction()
        
        assert cpu.a == 0x42, "LDA instruction failed"
        assert cpu.pc == 0x0002, "Program counter increment failed"
        
        print("✅ Instruction execution test passed")
        return True
        
    except Exception as e:
        print(f"❌ Instruction execution test failed: {e}")
        return False

def test_logging_system():
    """Test logging system"""
    print("🔍 Testing Logging System...")
    
    try:
        from emulator_logger import EmulatorLogger
        
        # Create logger with test config
        config = {
            "log_level": "INFO",
            "log_to_console": True,
            "log_to_file": False
        }
        
        logger = EmulatorLogger(config)
        
        # Test logging methods
        logger.log_cpu_state({"pc": 0x1000, "a": 0x42, "x": 0x10, "y": 0x20, "sp": 0xFF, "flags": 0x00})
        logger.log_memory_access(0x1000, 0x42, "read")
        logger.log_basic_command("PRINT", "Hello World")
        
        print("✅ Logging system test passed")
        return True
        
    except Exception as e:
        print(f"❌ Logging system test failed: {e}")
        return False

def test_performance_profiler():
    """Test performance profiler"""
    print("🔍 Testing Performance Profiler...")
    
    try:
        from emulator_logger import EmulatorLogger, PerformanceProfiler
        
        logger = EmulatorLogger({"log_level": "INFO"})
        profiler = PerformanceProfiler(logger)
        
        # Test instruction timing
        profiler.start_execution()
        profiler.start_instruction()
        time.sleep(0.001)  # Simulate instruction execution
        profiler.end_instruction("TEST_INSTRUCTION", 1)
        profiler.end_execution()
        
        # Verify profiler was created successfully
        assert profiler.logger is not None, "Profiler logger not initialized"
        
        print("✅ Performance profiler test passed")
        return True
        
    except Exception as e:
        print(f"❌ Performance profiler test failed: {e}")
        return False

def test_sample_programs():
    """Test sample program files"""
    print("🔍 Testing Sample Programs...")
    
    try:
        sample_dir = Path(__file__).parent / "sample_programs"
        sample_files = list(sample_dir.glob("*.bas"))
        
        if not sample_files:
            print("⚠️  No sample programs found")
            return False
        
        successful_reads = 0
        for sample_file in sample_files:
            try:
                with open(sample_file, 'r') as f:
                    content = f.read()
                    if len(content.strip()) > 0:
                        successful_reads += 1
                        print(f"  📄 {sample_file.name}: {len(content)} characters")
            except Exception as e:
                print(f"  ❌ Error reading {sample_file.name}: {e}")
        
        print(f"✅ Sample programs test passed: {successful_reads}/{len(sample_files)} files readable")
        return successful_reads > 0
        
    except Exception as e:
        print(f"❌ Sample programs test failed: {e}")
        return False

def test_settings_loading():
    """Test settings loading"""
    print("🔍 Testing Settings Loading...")
    
    try:
        settings_file = Path(__file__).parent / "settings.json"
        
        if not settings_file.exists():
            print("⚠️  Settings file not found")
            return False
        
        with open(settings_file, 'r') as f:
            settings = json.load(f)
        
        # Check required settings
        assert 'emulator_settings' in settings, "emulator_settings missing"
        assert 'logging_settings' in settings, "logging_settings missing"
        assert 'paths' in settings, "paths missing"
        
        print("✅ Settings loading test passed")
        return True
        
    except Exception as e:
        print(f"❌ Settings loading test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 AIOS Emulator Test Suite - Phase 2.5 (Simplified)")
    print("=" * 60)
    
    tests = [
        ("Basic CPU Functionality", test_basic_cpu_functionality),
        ("Memory Management", test_memory_management),
        ("Flag Operations", test_flag_operations),
        ("Instruction Execution", test_instruction_execution),
        ("Logging System", test_logging_system),
        ("Performance Profiler", test_performance_profiler),
        ("Sample Programs", test_sample_programs),
        ("Settings Loading", test_settings_loading),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        start_time = time.time()
        
        try:
            success = test_func()
            execution_time = time.time() - start_time
            
            results.append({
                "test": test_name,
                "status": "PASSED" if success else "FAILED",
                "execution_time": execution_time
            })
            
        except Exception as e:
            execution_time = time.time() - start_time
            print(f"💥 {test_name} - ERROR: {e}")
            results.append({
                "test": test_name,
                "status": "ERROR",
                "execution_time": execution_time,
                "error": str(e)
            })
    
    # Generate report
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    total_tests = len(results)
    passed_tests = len([r for r in results if r['status'] == 'PASSED'])
    failed_tests = len([r for r in results if r['status'] == 'FAILED'])
    error_tests = len([r for r in results if r['status'] == 'ERROR'])
    
    print(f"Total Tests: {total_tests}")
    print(f"✅ Passed: {passed_tests}")
    print(f"❌ Failed: {failed_tests}")
    print(f"💥 Errors: {error_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    
    # Save results
    logs_dir = Path(__file__).parent / "logs"
    logs_dir.mkdir(exist_ok=True)
    
    report_file = logs_dir / "simplified_test_report.json"
    with open(report_file, 'w') as f:
        json.dump({
            "timestamp": time.time(),
            "summary": {
                "total": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "errors": error_tests,
                "success_rate": (passed_tests/total_tests)*100
            },
            "results": results
        }, f, indent=2)
    
    print(f"\n📄 Detailed report saved to: {report_file}")
    
    if passed_tests == total_tests:
        print("\n🎉 ALL TESTS PASSED! Core emulator functionality is working.")
    elif passed_tests >= total_tests * 0.8:
        print(f"\n✅ {passed_tests}/{total_tests} tests passed. Emulator core is functional.")
    else:
        print(f"\n⚠️  Only {passed_tests}/{total_tests} tests passed. Some issues need attention.")

if __name__ == "__main__":
    main()

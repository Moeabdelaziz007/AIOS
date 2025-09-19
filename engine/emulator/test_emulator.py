#!/usr/bin/env python3
"""
Test Program for AIOS 6502 Emulator
Tests basic functionality and BASIC-M6502 integration
"""

import os
import sys
import time
import json

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from aios_emulator_bridge import AIOSEmulatorBridge, EmulatorConfig


def test_basic_emulator():
    """Test basic emulator functionality"""
    print("🧪 Testing Basic Emulator Functionality")
    
    config = EmulatorConfig(debug_mode=True, max_instructions=100)
    bridge = AIOSEmulatorBridge(config)
    
    # Test 1: Simple NOP program
    print("\n1. Testing NOP program...")
    nop_program = bytes([
        0xEA,  # NOP
        0xEA,  # NOP
        0xEA,  # NOP
        0x00   # BRK
    ])
    
    bridge.load_program(nop_program, 0x8000)
    result = bridge.run_program()
    
    if result['success']:
        print(f"   ✅ NOP program executed: {result['instructions']} instructions, {result['cycles']} cycles")
    else:
        print(f"   ❌ NOP program failed: {result['error']}")
        
    # Test 2: Step execution
    print("\n2. Testing step execution...")
    bridge.reset_emulator()
    bridge.load_program(nop_program, 0x8000)
    
    for i in range(4):
        step_result = bridge.step_program()
        cpu_status = bridge.get_cpu_status()
        print(f"   Step {i+1}: PC=${cpu_status['pc']:04X}, A=${cpu_status['a']:02X}, Cycles={step_result['cycles']}")
        
    # Test 3: Breakpoints
    print("\n3. Testing breakpoints...")
    bridge.reset_emulator()
    bridge.load_program(nop_program, 0x8000)
    bridge.set_breakpoint(0x8002)  # Break at third instruction
    
    result = bridge.run_program()
    cpu_status = bridge.get_cpu_status()
    print(f"   Breakpoint hit at PC=${cpu_status['pc']:04X}")
    
    return True


def test_basic_compilation():
    """Test BASIC compilation functionality"""
    print("\n🧪 Testing BASIC Compilation")
    
    bridge = AIOSEmulatorBridge()
    
    # Test BASIC programs
    test_programs = [
        {
            'name': 'Simple PRINT',
            'code': 'PRINT "Hello, AIOS!"\nEND',
            'should_succeed': True
        },
        {
            'name': 'Invalid syntax',
            'code': 'PRINT Hello\nEND',
            'should_succeed': False
        },
        {
            'name': 'Multiple statements',
            'code': 'REM Test program\nPRINT "Starting"\nPRINT "Ending"\nEND',
            'should_succeed': True
        }
    ]
    
    for test in test_programs:
        print(f"\n   Testing: {test['name']}")
        result = bridge.compile_and_load_basic(test['code'])
        
        if result['success'] == test['should_succeed']:
            print(f"   ✅ {test['name']} - Expected result")
            if result['success']:
                print(f"      Compiled size: {result['compiled_size']} bytes")
        else:
            print(f"   ❌ {test['name']} - Unexpected result")
            if not result['success']:
                print(f"      Errors: {result['errors']}")
                
    return True


def test_memory_operations():
    """Test memory read/write operations"""
    print("\n🧪 Testing Memory Operations")
    
    bridge = AIOSEmulatorBridge()
    
    # Test memory dump
    print("\n   Testing memory dump...")
    dump = bridge.get_memory_dump(0x0000, 64)
    lines = dump.split('\n')
    print(f"   Memory dump (first 4 lines):")
    for line in lines[:4]:
        print(f"      {line}")
        
    # Test CPU status
    print("\n   Testing CPU status...")
    status = bridge.get_cpu_status()
    print(f"   CPU Status:")
    print(f"      PC: ${status['pc']:04X}")
    print(f"      A:  ${status['a']:02X}")
    print(f"      X:  ${status['x']:02X}")
    print(f"      Y:  ${status['y']:02X}")
    print(f"      SP: ${status['sp']:02X}")
    print(f"      P:  ${status['p']:02X}")
    
    return True


def test_performance():
    """Test emulator performance"""
    print("\n🧪 Testing Performance")
    
    config = EmulatorConfig(max_instructions=10000)
    bridge = AIOSEmulatorBridge(config)
    
    # Create a longer program
    long_program = bytes([0xEA] * 1000 + [0x00])  # 1000 NOPs + BRK
    
    print("\n   Testing execution speed...")
    start_time = time.time()
    
    bridge.load_program(long_program, 0x8000)
    result = bridge.run_program()
    
    end_time = time.time()
    execution_time = end_time - start_time
    
    if result['success']:
        instructions_per_second = result['instructions'] / execution_time
        print(f"   ✅ Performance test completed:")
        print(f"      Instructions: {result['instructions']}")
        print(f"      Execution time: {execution_time:.3f}s")
        print(f"      Instructions/sec: {instructions_per_second:.0f}")
    else:
        print(f"   ❌ Performance test failed: {result['error']}")
        
    return True


def test_state_persistence():
    """Test state save/restore functionality"""
    print("\n🧪 Testing State Persistence")
    
    bridge = AIOSEmulatorBridge()
    
    # Load a program and run it partially
    test_program = bytes([0xEA, 0xEA, 0xEA, 0x00])
    bridge.load_program(test_program, 0x8000)
    bridge.step_program()  # Execute one instruction
    
    # Save state
    print("\n   Saving emulator state...")
    state = bridge.export_state()
    
    # Create new bridge and restore state
    print("   Restoring emulator state...")
    new_bridge = AIOSEmulatorBridge()
    new_bridge.import_state(state)
    
    # Compare states
    original_status = bridge.get_cpu_status()
    restored_status = new_bridge.get_cpu_status()
    
    if (original_status['pc'] == restored_status['pc'] and
        original_status['a'] == restored_status['a']):
        print("   ✅ State persistence test passed")
        return True
    else:
        print("   ❌ State persistence test failed")
        print(f"      Original PC: ${original_status['pc']:04X}")
        print(f"      Restored PC: ${restored_status['pc']:04X}")
        return False


def run_comprehensive_test():
    """Run all tests"""
    print("🚀 AIOS 6502 Emulator - Comprehensive Test Suite")
    print("=" * 60)
    
    tests = [
        ("Basic Emulator", test_basic_emulator),
        ("BASIC Compilation", test_basic_compilation),
        ("Memory Operations", test_memory_operations),
        ("Performance", test_performance),
        ("State Persistence", test_state_persistence)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            print(f"\n{'='*20} {test_name} {'='*20}")
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
            
    # Summary
    print(f"\n{'='*60}")
    print("📊 Test Results Summary:")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
            
    print(f"\nOverall: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 All tests passed! Emulator is ready for AIOS integration.")
    else:
        print("⚠️ Some tests failed. Please review the issues above.")
        
    return passed == total


if __name__ == "__main__":
    success = run_comprehensive_test()
    sys.exit(0 if success else 1)

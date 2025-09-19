#!/usr/bin/env python3
"""
Test script for AIOS Emulator Launcher
Tests the launcher functionality and BASIC program execution
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def test_launcher_import():
    """Test that launcher can be imported"""
    print("🧪 Testing launcher import...")
    
    try:
        # Add engine directory to path
        engine_dir = Path(__file__).parent
        sys.path.insert(0, str(engine_dir))
        
        from launch_emulator import AIOSEmulatorLauncher
        print("✅ Launcher import successful")
        return True
    except ImportError as e:
        print(f"❌ Launcher import failed: {e}")
        return False

def test_launcher_creation():
    """Test launcher creation and initialization"""
    print("\n🧪 Testing launcher creation...")
    
    try:
        from launch_emulator import AIOSEmulatorLauncher
        
        launcher = AIOSEmulatorLauncher("test_settings.json")
        print("✅ Launcher creation successful")
        
        # Test settings loading
        if launcher.settings:
            print("✅ Settings loaded successfully")
        else:
            print("❌ Settings not loaded")
            return False
            
        return True
    except Exception as e:
        print(f"❌ Launcher creation failed: {e}")
        return False

def test_emulator_creation():
    """Test emulator creation"""
    print("\n🧪 Testing emulator creation...")
    
    try:
        from launch_emulator import AIOSEmulatorLauncher
        
        launcher = AIOSEmulatorLauncher("test_settings.json")
        launcher.emulator = launcher.create_emulator()
        
        if launcher.emulator:
            print("✅ Emulator creation successful")
            return True
        else:
            print("❌ Emulator not created")
            return False
            
    except Exception as e:
        print(f"❌ Emulator creation failed: {e}")
        return False

def test_sample_programs():
    """Test sample program creation and loading"""
    print("\n🧪 Testing sample programs...")
    
    try:
        from launch_emulator import AIOSEmulatorLauncher
        
        launcher = AIOSEmulatorLauncher("test_settings.json")
        launcher.emulator = launcher.create_emulator()
        
        # Create sample programs
        launcher.create_sample_programs()
        
        # Check if sample programs were created
        sample_dir = launcher.settings["sample_programs_dir"]
        expected_files = ["hello.bas", "counter.bas", "calculator.bas", "loop_test.bas"]
        
        all_created = True
        for filename in expected_files:
            filepath = os.path.join(sample_dir, filename)
            if os.path.exists(filepath):
                print(f"✅ {filename} created")
            else:
                print(f"❌ {filename} not created")
                all_created = False
                
        return all_created
        
    except Exception as e:
        print(f"❌ Sample program test failed: {e}")
        return False

def test_basic_program_loading():
    """Test BASIC program loading"""
    print("\n🧪 Testing BASIC program loading...")
    
    try:
        from launch_emulator import AIOSEmulatorLauncher
        
        launcher = AIOSEmulatorLauncher("test_settings.json")
        launcher.emulator = launcher.create_emulator()
        
        # Create a simple test program
        test_program = '''REM Test Program
PRINT "Hello, AIOS!"
END'''
        
        test_file = "test_program.bas"
        with open(test_file, 'w') as f:
            f.write(test_program)
            
        # Test loading
        success = launcher.load_basic_program(test_file)
        
        # Cleanup
        if os.path.exists(test_file):
            os.remove(test_file)
            
        if success:
            print("✅ BASIC program loading successful")
            return True
        else:
            print("❌ BASIC program loading failed")
            return False
            
    except Exception as e:
        print(f"❌ BASIC program loading test failed: {e}")
        return False

def test_emulator_execution():
    """Test emulator execution"""
    print("\n🧪 Testing emulator execution...")
    
    try:
        from launch_emulator import AIOSEmulatorLauncher
        
        launcher = AIOSEmulatorLauncher("test_settings.json")
        launcher.emulator = launcher.create_emulator()
        
        # Load mock ROM
        launcher.load_basic_rom()
        
        # Create and load simple program
        test_program = bytes([0xEA, 0xEA, 0x00])  # NOP, NOP, BRK
        launcher.emulator.load_program(test_program, 0x8000)
        
        # Test step execution
        result = launcher.step_program()
        
        if result['success']:
            print("✅ Emulator execution successful")
            return True
        else:
            print(f"❌ Emulator execution failed: {result['error']}")
            return False
            
    except Exception as e:
        print(f"❌ Emulator execution test failed: {e}")
        return False

def test_command_line_interface():
    """Test command line interface"""
    print("\n🧪 Testing command line interface...")
    
    try:
        # Test help command
        result = subprocess.run([
            sys.executable, "launch_emulator.py", "--help"
        ], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0 and "AIOS" in result.stdout:
            print("✅ Command line interface working")
            return True
        else:
            print(f"❌ Command line interface failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Command line interface test failed: {e}")
        return False

def cleanup_test_files():
    """Clean up test files"""
    print("\n🧹 Cleaning up test files...")
    
    test_files = [
        "test_settings.json",
        "test_program.bas",
        "basic_rom.bin"
    ]
    
    for file in test_files:
        if os.path.exists(file):
            os.remove(file)
            print(f"✅ Removed {file}")
            
    # Remove sample programs directory if it was created
    if os.path.exists("sample_programs"):
        import shutil
        shutil.rmtree("sample_programs")
        print("✅ Removed sample_programs directory")

def run_comprehensive_test():
    """Run all tests"""
    print("🚀 AIOS Emulator Launcher - Comprehensive Test Suite")
    print("=" * 60)
    
    tests = [
        ("Launcher Import", test_launcher_import),
        ("Launcher Creation", test_launcher_creation),
        ("Emulator Creation", test_emulator_creation),
        ("Sample Programs", test_sample_programs),
        ("BASIC Program Loading", test_basic_program_loading),
        ("Emulator Execution", test_emulator_execution),
        ("Command Line Interface", test_command_line_interface)
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
    
    # Cleanup
    cleanup_test_files()
    
    if passed == total:
        print("🎉 All tests passed! Launcher is ready for use.")
    else:
        print("⚠️ Some tests failed. Please review the issues above.")
        
    return passed == total

if __name__ == "__main__":
    success = run_comprehensive_test()
    sys.exit(0 if success else 1)

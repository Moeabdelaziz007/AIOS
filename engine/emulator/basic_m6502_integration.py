#!/usr/bin/env python3
"""
BASIC-M6502 Integration Module for AIOS
Handles loading and running BASIC programs through the 6502 emulator
"""

import os
import sys
import struct
import time
from typing import Dict, List, Optional, Any
from .aios_6502_emulator import Emulator6502, CPU6502


class BasicM6502Interpreter:
    """BASIC-M6502 Interpreter Integration"""
    
    def __init__(self):
        self.emulator = Emulator6502()
        self.basic_rom_loaded = False
        self.basic_start_address = 0xA000
        self.basic_entry_point = 0xA000
        
        # BASIC-specific memory layout
        self.basic_variables_start = 0x0000
        self.basic_strings_start = 0x2000
        self.basic_program_start = 0x4000
        
        # I/O handlers for BASIC
        self.input_handler = None
        self.output_handler = None
        
    def load_basic_rom(self, rom_path: str) -> bool:
        """Load BASIC ROM from file"""
        try:
            if not os.path.exists(rom_path):
                print(f"❌ BASIC ROM file not found: {rom_path}")
                return False
                
            with open(rom_path, 'rb') as f:
                rom_data = f.read()
                
            if len(rom_data) != 8192:  # 8KB ROM
                print(f"⚠️ Warning: ROM size is {len(rom_data)} bytes, expected 8192")
                
            self.emulator.load_basic_rom(rom_data)
            self.basic_rom_loaded = True
            
            print(f"✅ BASIC ROM loaded successfully ({len(rom_data)} bytes)")
            return True
            
        except Exception as e:
            print(f"❌ Error loading BASIC ROM: {e}")
            return False
            
    def load_basic_program(self, program_data: bytes) -> bool:
        """Load a BASIC program into memory"""
        try:
            # Load program at BASIC program area
            self.emulator.load_program(program_data, self.basic_program_start)
            
            # Set up BASIC program pointer
            self.emulator.cpu.write_word(0x7F, self.basic_program_start)
            
            print(f"✅ BASIC program loaded at ${self.basic_program_start:04X}")
            return True
            
        except Exception as e:
            print(f"❌ Error loading BASIC program: {e}")
            return False
            
    def run_basic_program(self, max_instructions: int = 1000000) -> Dict[str, Any]:
        """Run a BASIC program"""
        if not self.basic_rom_loaded:
            return {
                'success': False,
                'error': 'BASIC ROM not loaded',
                'instructions': 0,
                'cycles': 0
            }
            
        try:
            # Reset emulator
            self.emulator.reset()
            
            # Set PC to BASIC entry point
            self.emulator.cpu.pc = self.basic_entry_point
            
            print("🚀 Starting BASIC program execution...")
            start_time = time.time()
            
            # Run the program
            instructions = self.emulator.run(max_instructions)
            
            end_time = time.time()
            execution_time = end_time - start_time
            
            status = self.emulator.get_status()
            
            return {
                'success': True,
                'instructions': instructions,
                'cycles': status['cpu']['cycles'],
                'execution_time': execution_time,
                'cpu_status': status['cpu'],
                'running': status['cpu']['running']
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'instructions': 0,
                'cycles': 0
            }
            
    def step_basic_program(self) -> Dict[str, Any]:
        """Execute one instruction of BASIC program"""
        if not self.basic_rom_loaded:
            return {
                'success': False,
                'error': 'BASIC ROM not loaded'
            }
            
        try:
            cycles = self.emulator.step()
            status = self.emulator.get_status()
            
            return {
                'success': True,
                'cycles': cycles,
                'cpu_status': status['cpu']
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
            
    def get_basic_variables(self) -> Dict[str, Any]:
        """Get BASIC variable values from memory"""
        variables = {}
        
        try:
            # Read variable area (simplified)
            for i in range(0, 256, 2):  # Variables are 2 bytes each
                addr = self.basic_variables_start + i
                value = self.emulator.cpu.read_word(addr)
                if value != 0:  # Non-zero variables
                    variables[f'VAR_{i//2:02X}'] = value
                    
        except Exception as e:
            print(f"Error reading variables: {e}")
            
        return variables
        
    def set_basic_variable(self, name: str, value: int):
        """Set a BASIC variable value"""
        try:
            # Simple variable storage (would need proper BASIC variable table)
            var_index = hash(name) % 128
            addr = self.basic_variables_start + (var_index * 2)
            self.emulator.cpu.write_word(addr, value & 0xFFFF)
            
        except Exception as e:
            print(f"Error setting variable {name}: {e}")
            
    def get_memory_dump(self, start: int = 0x0000, length: int = 256) -> str:
        """Get a memory dump for debugging"""
        dump = []
        
        for i in range(0, length, 16):
            addr = start + i
            line = f"{addr:04X}: "
            
            # Hex bytes
            for j in range(16):
                if i + j < length:
                    byte_val = self.emulator.cpu.read_byte(addr + j)
                    line += f"{byte_val:02X} "
                else:
                    line += "   "
                    
            # ASCII representation
            line += " "
            for j in range(16):
                if i + j < length:
                    byte_val = self.emulator.cpu.read_byte(addr + j)
                    if 32 <= byte_val <= 126:
                        line += chr(byte_val)
                    else:
                        line += "."
                else:
                    line += " "
                    
            dump.append(line)
            
        return "\n".join(dump)
        
    def set_input_handler(self, handler):
        """Set input handler for BASIC INPUT statements"""
        self.input_handler = handler
        
    def set_output_handler(self, handler):
        """Set output handler for BASIC PRINT statements"""
        self.output_handler = handler
        
    def get_status(self) -> Dict[str, Any]:
        """Get interpreter status"""
        return {
            'basic_rom_loaded': self.basic_rom_loaded,
            'basic_start_address': self.basic_start_address,
            'basic_entry_point': self.basic_entry_point,
            'emulator_status': self.emulator.get_status()
        }


class BasicM6502Compiler:
    """Simple BASIC-M6502 Compiler (placeholder)"""
    
    def __init__(self):
        self.supported_commands = [
            'PRINT', 'INPUT', 'LET', 'GOTO', 'IF', 'THEN', 'ELSE',
            'FOR', 'NEXT', 'WHILE', 'WEND', 'DO', 'LOOP',
            'REM', 'END', 'STOP', 'RUN', 'LIST', 'NEW'
        ]
        
    def compile_basic_program(self, basic_code: str) -> bytes:
        """Compile BASIC code to 6502 machine code (simplified)"""
        lines = basic_code.strip().split('\n')
        compiled_bytes = []
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('REM'):
                continue
                
            # Simple compilation (would need full BASIC compiler)
            if line.upper().startswith('PRINT'):
                # Placeholder for PRINT statement
                compiled_bytes.extend([0xEA, 0xEA])  # NOP instructions
            elif line.upper().startswith('END'):
                compiled_bytes.append(0x00)  # BRK instruction
                
        return bytes(compiled_bytes)
        
    def validate_basic_syntax(self, basic_code: str) -> List[str]:
        """Validate BASIC syntax and return errors"""
        errors = []
        lines = basic_code.strip().split('\n')
        
        for i, line in enumerate(lines, 1):
            line = line.strip()
            if not line or line.startswith('REM'):
                continue
                
            # Basic syntax validation
            if line.upper().startswith('PRINT') and '"' not in line:
                errors.append(f"Line {i}: PRINT statement missing quotes")
                
        return errors


def main():
    """Test the BASIC-M6502 integration"""
    print("🚀 AIOS BASIC-M6502 Integration - Testing")
    
    # Create interpreter
    interpreter = BasicM6502Interpreter()
    
    # Test with mock BASIC ROM
    print("Loading mock BASIC ROM...")
    mock_rom = bytes([0xEA] * 8192)  # Mock ROM with NOP instructions
    interpreter.emulator.load_basic_rom(mock_rom)
    
    # Test BASIC program
    test_program = bytes([
        0xEA, 0xEA, 0xEA,  # NOP instructions
        0x00               # BRK
    ])
    
    print("Loading test BASIC program...")
    interpreter.load_basic_program(test_program)
    
    print("Running BASIC program...")
    result = interpreter.run_basic_program(100)
    
    if result['success']:
        print(f"✅ Program executed successfully!")
        print(f"   Instructions: {result['instructions']}")
        print(f"   Cycles: {result['cycles']}")
        print(f"   Execution time: {result['execution_time']:.3f}s")
    else:
        print(f"❌ Program execution failed: {result['error']}")
        
    # Test compiler
    print("\nTesting BASIC compiler...")
    compiler = BasicM6502Compiler()
    
    test_basic = """
    REM Test BASIC program
    PRINT "Hello, AIOS!"
    END
    """
    
    errors = compiler.validate_basic_syntax(test_basic)
    if errors:
        print("Syntax errors found:")
        for error in errors:
            print(f"  - {error}")
    else:
        print("✅ BASIC syntax validation passed")
        
    compiled = compiler.compile_basic_program(test_basic)
    print(f"Compiled program size: {len(compiled)} bytes")
    
    print("\n✅ BASIC-M6502 integration test completed!")


if __name__ == "__main__":
    main()

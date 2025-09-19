#!/usr/bin/env python3
"""
AIOS Python Bridge for BASIC-M6502 Emulator
Provides Python API for controlling the 6502 emulator and BASIC interpreter
"""

import os
import sys
import json
import time
import asyncio
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass
from enum import Enum

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from aios_6502_emulator import Emulator6502, CPU6502
from basic_m6502_integration import BasicM6502Interpreter, BasicM6502Compiler


class EmulatorState(Enum):
    """Emulator execution states"""
    STOPPED = "stopped"
    RUNNING = "running"
    PAUSED = "paused"
    ERROR = "error"


@dataclass
class EmulatorConfig:
    """Emulator configuration"""
    max_instructions: int = 1000000
    debug_mode: bool = False
    breakpoints: List[int] = None
    memory_size: int = 65536
    rom_size: int = 8192
    
    def __post_init__(self):
        if self.breakpoints is None:
            self.breakpoints = []


class AIOSEmulatorBridge:
    """Main Python bridge for AIOS emulator integration"""
    
    def __init__(self, config: Optional[EmulatorConfig] = None):
        self.config = config or EmulatorConfig()
        self.emulator = Emulator6502()
        self.basic_interpreter = BasicM6502Interpreter()
        self.basic_compiler = BasicM6502Compiler()
        
        self.state = EmulatorState.STOPPED
        self.callbacks: Dict[str, List[Callable]] = {
            'on_start': [],
            'on_stop': [],
            'on_error': [],
            'on_breakpoint': [],
            'on_instruction': []
        }
        
        # Performance metrics
        self.metrics = {
            'total_instructions': 0,
            'total_cycles': 0,
            'total_execution_time': 0.0,
            'programs_run': 0,
            'errors_count': 0
        }
        
    def load_basic_rom(self, rom_path: str) -> bool:
        """Load BASIC ROM from file"""
        success = self.basic_interpreter.load_basic_rom(rom_path)
        if success:
            self._trigger_callback('on_start')
        return success
        
    def load_program(self, program_data: bytes, start_address: int = 0x8000) -> bool:
        """Load a program into emulator memory"""
        try:
            self.emulator.load_program(program_data, start_address)
            return True
        except Exception as e:
            self._handle_error(f"Failed to load program: {e}")
            return False
            
    def compile_and_load_basic(self, basic_code: str) -> Dict[str, Any]:
        """Compile BASIC code and load into emulator"""
        try:
            # Validate syntax
            errors = self.basic_compiler.validate_basic_syntax(basic_code)
            if errors:
                return {
                    'success': False,
                    'errors': errors,
                    'compiled_size': 0
                }
                
            # Compile to machine code
            compiled_code = self.basic_compiler.compile_basic_program(basic_code)
            
            # Load into emulator
            success = self.load_program(compiled_code)
            
            return {
                'success': success,
                'errors': [],
                'compiled_size': len(compiled_code),
                'compiled_code': compiled_code.hex() if success else None
            }
            
        except Exception as e:
            self._handle_error(f"Failed to compile BASIC: {e}")
            return {
                'success': False,
                'errors': [str(e)],
                'compiled_size': 0
            }
            
    def run_program(self, max_instructions: Optional[int] = None) -> Dict[str, Any]:
        """Run the loaded program"""
        if self.state == EmulatorState.RUNNING:
            return {
                'success': False,
                'error': 'Emulator is already running'
            }
            
        try:
            self.state = EmulatorState.RUNNING
            self._trigger_callback('on_start')
            
            start_time = time.time()
            max_inst = max_instructions or self.config.max_instructions
            
            # Run the program
            instructions = self.emulator.run(max_inst)
            
            end_time = time.time()
            execution_time = end_time - start_time
            
            # Update metrics
            self.metrics['total_instructions'] += instructions
            self.metrics['total_execution_time'] += execution_time
            self.metrics['programs_run'] += 1
            
            self.state = EmulatorState.STOPPED
            self._trigger_callback('on_stop')
            
            return {
                'success': True,
                'instructions': instructions,
                'cycles': self.emulator.cpu.cycles,
                'execution_time': execution_time,
                'cpu_status': self.emulator.cpu.get_status()
            }
            
        except Exception as e:
            self.state = EmulatorState.ERROR
            self.metrics['errors_count'] += 1
            self._handle_error(f"Program execution failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'instructions': 0,
                'cycles': 0
            }
            
    def step_program(self) -> Dict[str, Any]:
        """Execute one instruction"""
        if self.state == EmulatorState.RUNNING:
            return {
                'success': False,
                'error': 'Cannot step while running'
            }
            
        try:
            cycles = self.emulator.step()
            self.metrics['total_cycles'] += cycles
            
            # Check for breakpoints
            if self.emulator.cpu.pc in self.config.breakpoints:
                self.state = EmulatorState.PAUSED
                self._trigger_callback('on_breakpoint', self.emulator.cpu.pc)
                
            self._trigger_callback('on_instruction', {
                'pc': self.emulator.cpu.pc,
                'cycles': cycles
            })
            
            return {
                'success': True,
                'cycles': cycles,
                'cpu_status': self.emulator.cpu.get_status()
            }
            
        except Exception as e:
            self._handle_error(f"Step execution failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
            
    def pause_program(self) -> bool:
        """Pause program execution"""
        if self.state == EmulatorState.RUNNING:
            self.emulator.cpu.running = False
            self.state = EmulatorState.PAUSED
            return True
        return False
        
    def resume_program(self) -> bool:
        """Resume program execution"""
        if self.state == EmulatorState.PAUSED:
            self.emulator.cpu.running = True
            self.state = EmulatorState.RUNNING
            return True
        return False
        
    def reset_emulator(self):
        """Reset the emulator to initial state"""
        self.emulator.reset()
        self.state = EmulatorState.STOPPED
        self.metrics['total_instructions'] = 0
        self.metrics['total_cycles'] = 0
        self.metrics['total_execution_time'] = 0.0
        
    def set_breakpoint(self, address: int):
        """Set a breakpoint at address"""
        self.config.breakpoints.append(address)
        self.emulator.add_breakpoint(address)
        
    def remove_breakpoint(self, address: int):
        """Remove breakpoint at address"""
        if address in self.config.breakpoints:
            self.config.breakpoints.remove(address)
        self.emulator.remove_breakpoint(address)
        
    def get_memory_dump(self, start: int = 0x0000, length: int = 256) -> str:
        """Get memory dump for debugging"""
        return self.basic_interpreter.get_memory_dump(start, length)
        
    def get_cpu_status(self) -> Dict[str, Any]:
        """Get current CPU status"""
        return self.emulator.cpu.get_status()
        
    def get_emulator_status(self) -> Dict[str, Any]:
        """Get emulator status"""
        return {
            'state': self.state.value,
            'config': {
                'max_instructions': self.config.max_instructions,
                'debug_mode': self.config.debug_mode,
                'breakpoints': self.config.breakpoints,
                'memory_size': self.config.memory_size,
                'rom_size': self.config.rom_size
            },
            'metrics': self.metrics,
            'cpu_status': self.get_cpu_status()
        }
        
    def set_debug_mode(self, enabled: bool):
        """Enable/disable debug mode"""
        self.config.debug_mode = enabled
        self.emulator.set_debug(enabled)
        
    def add_callback(self, event: str, callback: Callable):
        """Add event callback"""
        if event in self.callbacks:
            self.callbacks[event].append(callback)
            
    def remove_callback(self, event: str, callback: Callable):
        """Remove event callback"""
        if event in self.callbacks and callback in self.callbacks[event]:
            self.callbacks[event].remove(callback)
            
    def _trigger_callback(self, event: str, *args, **kwargs):
        """Trigger event callbacks"""
        if event in self.callbacks:
            for callback in self.callbacks[event]:
                try:
                    callback(*args, **kwargs)
                except Exception as e:
                    print(f"Callback error for {event}: {e}")
                    
    def _handle_error(self, error: str):
        """Handle emulator errors"""
        print(f"❌ Emulator Error: {error}")
        self.state = EmulatorState.ERROR
        self._trigger_callback('on_error', error)
        
    def export_state(self) -> Dict[str, Any]:
        """Export emulator state for persistence"""
        return {
            'config': {
                'max_instructions': self.config.max_instructions,
                'debug_mode': self.config.debug_mode,
                'breakpoints': self.config.breakpoints,
                'memory_size': self.config.memory_size,
                'rom_size': self.config.rom_size
            },
            'state': self.state.value,
            'metrics': self.metrics,
            'cpu_status': self.get_cpu_status(),
            'memory': {
                'start': 0x0000,
                'data': self.emulator.cpu.memory[:1024].hex()  # First 1KB
            }
        }
        
    def import_state(self, state_data: Dict[str, Any]):
        """Import emulator state from persistence"""
        try:
            # Restore config
            config_data = state_data.get('config', {})
            self.config.max_instructions = config_data.get('max_instructions', 1000000)
            self.config.debug_mode = config_data.get('debug_mode', False)
            self.config.breakpoints = config_data.get('breakpoints', [])
            
            # Restore metrics
            self.metrics.update(state_data.get('metrics', {}))
            
            # Restore memory (if available)
            memory_data = state_data.get('memory', {})
            if 'data' in memory_data:
                memory_bytes = bytes.fromhex(memory_data['data'])
                for i, byte_val in enumerate(memory_bytes):
                    if i < len(self.emulator.cpu.memory):
                        self.emulator.cpu.memory[i] = byte_val
                        
            print("✅ Emulator state restored successfully")
            
        except Exception as e:
            self._handle_error(f"Failed to import state: {e}")


# Example usage and testing
def main():
    """Test the AIOS emulator bridge"""
    print("🚀 AIOS Emulator Bridge - Testing")
    
    # Create bridge
    config = EmulatorConfig(debug_mode=True, max_instructions=1000)
    bridge = AIOSEmulatorBridge(config)
    
    # Add callbacks
    def on_start():
        print("▶️ Emulator started")
        
    def on_stop():
        print("⏹️ Emulator stopped")
        
    def on_error(error):
        print(f"❌ Error: {error}")
        
    bridge.add_callback('on_start', on_start)
    bridge.add_callback('on_stop', on_stop)
    bridge.add_callback('on_error', on_error)
    
    # Test BASIC compilation
    test_basic = """
    REM Test program
    PRINT "Hello, AIOS!"
    END
    """
    
    print("Compiling BASIC program...")
    result = bridge.compile_and_load_basic(test_basic)
    
    if result['success']:
        print(f"✅ BASIC compiled successfully ({result['compiled_size']} bytes)")
        
        # Run the program
        print("Running program...")
        run_result = bridge.run_program()
        
        if run_result['success']:
            print(f"✅ Program executed successfully!")
            print(f"   Instructions: {run_result['instructions']}")
            print(f"   Cycles: {run_result['cycles']}")
            print(f"   Execution time: {run_result['execution_time']:.3f}s")
        else:
            print(f"❌ Program execution failed: {run_result['error']}")
    else:
        print(f"❌ BASIC compilation failed:")
        for error in result['errors']:
            print(f"   - {error}")
            
    # Test step execution
    print("\nTesting step execution...")
    bridge.reset_emulator()
    
    # Load simple program
    simple_program = bytes([0xEA, 0xEA, 0x00])  # NOP, NOP, BRK
    bridge.load_program(simple_program)
    
    # Step through instructions
    for i in range(3):
        step_result = bridge.step_program()
        if step_result['success']:
            print(f"Step {i+1}: PC=${bridge.get_cpu_status()['pc']:04X}, Cycles={step_result['cycles']}")
        else:
            print(f"Step {i+1} failed: {step_result['error']}")
            break
            
    # Get final status
    status = bridge.get_emulator_status()
    print(f"\nFinal Status: {status['state']}")
    print(f"Total Instructions: {status['metrics']['total_instructions']}")
    print(f"Total Cycles: {status['metrics']['total_cycles']}")
    
    print("\n✅ AIOS Emulator Bridge test completed!")


if __name__ == "__main__":
    main()

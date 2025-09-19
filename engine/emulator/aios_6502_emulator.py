#!/usr/bin/env python3
"""
AIOS 6502 Emulator for BASIC-M6502 Integration
Based on Py65 architecture but implemented directly for AIOS
"""

import sys
import struct
import time
import json
from typing import Dict, List, Optional, Callable, Any

# Try relative import first, then absolute
try:
    from .emulator_logger import EmulatorLogger, PerformanceProfiler
except ImportError:
    try:
        from emulator_logger import EmulatorLogger, PerformanceProfiler
    except ImportError:
        print("Warning: EmulatorLogger not available")
        EmulatorLogger = None
        PerformanceProfiler = None


class CPU6502:
    """6502 CPU Emulator"""
    
    def __init__(self, config: Dict[str, Any] = None):
        # Configuration
        self.config = config or {}
        self.emulator_settings = self.config.get('emulator_settings', {})
        self.cpu_speed = self.emulator_settings.get('cpu_speed', {})
        
        # Registers
        self.a = 0x00      # Accumulator
        self.x = 0x00      # X register
        self.y = 0x00      # Y register
        self.pc = 0x0000   # Program Counter
        self.sp = 0xFF     # Stack Pointer
        self.p = 0x20      # Processor Status (P register)
        
        # Flags in P register
        self.CARRY = 0x01
        self.ZERO = 0x02
        self.INTERRUPT = 0x04
        self.DECIMAL = 0x08
        self.BREAK = 0x10
        self.UNUSED = 0x20
        self.OVERFLOW = 0x40
        self.NEGATIVE = 0x80
        
        # Memory (64KB)
        self.memory = [0x00] * 65536
        
        # Interrupt vectors
        self.NMI_VECTOR = 0xFFFA
        self.RESET_VECTOR = 0xFFFC
        self.IRQ_VECTOR = 0xFFFE
        
        # Execution state
        self.running = False
        self.cycles = 0
        self.instruction_count = 0
        
        # Speed control
        self.frequency_hz = self.cpu_speed.get('frequency_hz', 1000000)
        self.cycle_delay_ms = self.cpu_speed.get('cycle_delay_ms', 0.001)
        self.speed_multiplier = self.cpu_speed.get('speed_multiplier', 1.0)
        self.max_speed = self.cpu_speed.get('max_speed', True)
        self.adaptive_speed = self.cpu_speed.get('adaptive_speed', False)
        
        # Debugging
        self.debug = False
        self.breakpoints = set()
        
        # Logging and profiling
        self.logger = None
        self.profiler = None
        if self.config:
            self.logger = EmulatorLogger(self.config)
            self.profiler = PerformanceProfiler(self.logger)
        
    def reset(self):
        """Reset the CPU to initial state"""
        self.a = 0x00
        self.x = 0x00
        self.y = 0x00
        self.sp = 0xFF
        self.p = 0x20
        
        # Load reset vector
        self.pc = self.read_word(self.RESET_VECTOR)
        self.running = True
        self.cycles = 0
        self.instruction_count = 0
        
    def load_program(self, data: bytes, start_address: int = 0x8000):
        """Load program data into memory"""
        for i, byte in enumerate(data):
            if start_address + i < 65536:
                self.memory[start_address + i] = byte
                
        # Set program counter to start address
        self.pc = start_address
        
    def read_byte(self, address: int) -> int:
        """Read a byte from memory"""
        value = self.memory[address & 0xFFFF]
        
        # Log memory access
        if self.logger:
            self.logger.log_memory_access(address, value, 'READ')
        
        return value
        
    def write_byte(self, address: int, value: int):
        """Write a byte to memory"""
        self.memory[address & 0xFFFF] = value & 0xFF
        
        # Log memory access
        if self.logger:
            self.logger.log_memory_access(address, value, 'WRITE')
        
    def read_word(self, address: int) -> int:
        """Read a 16-bit word from memory (little-endian)"""
        low = self.read_byte(address)
        high = self.read_byte(address + 1)
        return (high << 8) | low
        
    def write_word(self, address: int, value: int):
        """Write a 16-bit word to memory (little-endian)"""
        self.write_byte(address, value & 0xFF)
        self.write_byte(address + 1, (value >> 8) & 0xFF)
        
    def push_byte(self, value: int):
        """Push a byte onto the stack"""
        self.write_byte(0x100 + self.sp, value)
        self.sp = (self.sp - 1) & 0xFF
        
    def pop_byte(self) -> int:
        """Pop a byte from the stack"""
        self.sp = (self.sp + 1) & 0xFF
        return self.read_byte(0x100 + self.sp)
        
    def push_word(self, value: int):
        """Push a 16-bit word onto the stack"""
        self.push_byte((value >> 8) & 0xFF)
        self.push_byte(value & 0xFF)
        
    def pop_word(self) -> int:
        """Pop a 16-bit word from the stack"""
        low = self.pop_byte()
        high = self.pop_byte()
        return (high << 8) | low
    
    def set_cpu_speed(self, frequency_hz: int = None, speed_multiplier: float = None, max_speed: bool = None):
        """Configure CPU execution speed"""
        if frequency_hz is not None:
            self.frequency_hz = frequency_hz
            self.cycle_delay_ms = 1000.0 / frequency_hz if frequency_hz > 0 else 0
        
        if speed_multiplier is not None:
            self.speed_multiplier = speed_multiplier
        
        if max_speed is not None:
            self.max_speed = max_speed
        
        if self.logger:
            self.logger.logger.info(f"CPU speed configured: {self.frequency_hz}Hz, multiplier: {self.speed_multiplier}, max_speed: {self.max_speed}")
    
    def apply_cycle_delay(self, cycles: int = 1):
        """Apply cycle delay based on CPU speed settings"""
        if self.max_speed:
            return  # No delay for maximum speed
        
        # Calculate delay based on cycles and speed settings
        delay_ms = self.cycle_delay_ms * cycles / self.speed_multiplier
        
        if delay_ms > 0:
            time.sleep(delay_ms / 1000.0)
    
    def get_cpu_state(self) -> Dict[str, Any]:
        """Get current CPU state for logging"""
        return {
            'pc': self.pc,
            'a': self.a,
            'x': self.x,
            'y': self.y,
            'sp': self.sp,
            'flags': self.p,
            'cycles': self.cycles,
            'instruction_count': self.instruction_count
        }
        
    def set_flag(self, flag: int, value: bool):
        """Set or clear a processor flag"""
        if value:
            self.p |= flag
        else:
            self.p &= ~flag
            
    def get_flag(self, flag: int) -> bool:
        """Get a processor flag value"""
        return bool(self.p & flag)
        
    def set_zero_negative(self, value: int):
        """Set zero and negative flags based on value"""
        self.set_flag(self.ZERO, value == 0)
        self.set_flag(self.NEGATIVE, value & 0x80 != 0)
        
    def execute_instruction(self) -> int:
        """Execute one instruction and return cycles used"""
        if not self.running:
            return 0
            
        # Start instruction timing
        if self.profiler:
            self.profiler.start_instruction()
            
        # Check for breakpoints
        if self.pc in self.breakpoints:
            self.running = False
            if self.logger:
                self.logger.logger.info(f"Breakpoint hit at PC: 0x{self.pc:04X}")
            return 0
            
        # Fetch instruction
        opcode = self.read_byte(self.pc)
        
        # Log CPU state before instruction
        if self.logger:
            cpu_state = self.get_cpu_state()
            self.logger.log_cpu_state(cpu_state, f"0x{opcode:02X}")
        
        if self.debug:
            print(f"PC: ${self.pc:04X} A: ${self.a:02X} X: ${self.x:02X} Y: ${self.y:02X} SP: ${self.sp:02X} P: ${self.p:02X}")
            print(f"Instruction: ${opcode:02X}")
            
        # Execute instruction (simplified - would need full implementation)
        cycles = self.execute_opcode(opcode)
        
        # Apply speed control
        self.apply_cycle_delay(cycles)
        
        self.cycles += cycles
        self.instruction_count += 1
        
        # End instruction timing and log performance
        if self.profiler:
            instruction_name = f"0x{opcode:02X}"
            self.profiler.end_instruction(instruction_name, cycles)
        
        return cycles
        
    def execute_opcode(self, opcode: int) -> int:
        """Execute a specific opcode (simplified implementation)"""
        # This is a simplified implementation
        # A full 6502 emulator would need all 256 opcodes implemented
        
        if opcode == 0x00:  # BRK
            self.push_word(self.pc + 1)
            self.push_byte(self.p | self.BREAK)
            self.set_flag(self.INTERRUPT, True)
            self.pc = self.read_word(self.IRQ_VECTOR)
            return 7
            
        elif opcode == 0xEA:  # NOP
            self.pc += 1
            return 2
            
        elif opcode == 0x60:  # RTS
            self.pc = self.pop_word() + 1
            return 6
            
        elif opcode == 0x40:  # RTI
            self.p = self.pop_byte()
            self.pc = self.pop_word()
            return 6
            
        else:
            # Unknown opcode - halt execution
            if self.debug:
                print(f"Unknown opcode: ${opcode:02X}")
            self.running = False
            return 0
            
    def run(self, max_instructions: int = 1000000):
        """Run the CPU for a maximum number of instructions"""
        instructions_executed = 0
        
        while self.running and instructions_executed < max_instructions:
            cycles = self.execute_instruction()
            if cycles == 0:
                break
            instructions_executed += 1
            
        return instructions_executed
        
    def step(self):
        """Execute one instruction"""
        return self.execute_instruction()
        
    def get_status(self) -> Dict[str, Any]:
        """Get current CPU status"""
        return {
            'a': self.a,
            'x': self.x,
            'y': self.y,
            'pc': self.pc,
            'sp': self.sp,
            'p': self.p,
            'cycles': self.cycles,
            'instructions': self.instruction_count,
            'running': self.running,
            'flags': {
                'carry': self.get_flag(self.CARRY),
                'zero': self.get_flag(self.ZERO),
                'interrupt': self.get_flag(self.INTERRUPT),
                'decimal': self.get_flag(self.DECIMAL),
                'break': self.get_flag(self.BREAK),
                'overflow': self.get_flag(self.OVERFLOW),
                'negative': self.get_flag(self.NEGATIVE)
            }
        }


class Emulator6502:
    """Main 6502 Emulator class"""
    
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.cpu = CPU6502(config)
        self.memory_size = 65536
        self.rom_size = 8192  # 8KB ROM for BASIC
        
        # I/O handlers
        self.io_handlers: Dict[int, Callable] = {}
        
        # BASIC interpreter integration
        self.basic_interpreter = None
        
    def load_basic_rom(self, rom_data: bytes):
        """Load BASIC ROM into memory"""
        # BASIC typically loads at $A000-$BFFF (8KB)
        start_address = 0xA000
        
        for i, byte in enumerate(rom_data):
            if i < self.rom_size:
                self.cpu.memory[start_address + i] = byte
                
        # Set up BASIC vectors
        self.cpu.write_word(0xFFFA, 0xA000)  # NMI vector
        self.cpu.write_word(0xFFFC, 0xA000)  # Reset vector
        self.cpu.write_word(0xFFFE, 0xA000)  # IRQ vector
        
    def load_program(self, data: bytes, start_address: int = 0x8000):
        """Load a program into memory"""
        self.cpu.load_program(data, start_address)
        
    def run(self, max_instructions: int = 1000000):
        """Run the emulator"""
        return self.cpu.run(max_instructions)
        
    def step(self):
        """Execute one instruction"""
        return self.cpu.step()
        
    def reset(self):
        """Reset the emulator"""
        self.cpu.reset()
        
    def get_status(self) -> Dict[str, Any]:
        """Get emulator status"""
        return {
            'cpu': self.cpu.get_status(),
            'memory_size': self.memory_size,
            'rom_size': self.rom_size
        }
        
    def set_debug(self, enabled: bool):
        """Enable/disable debug mode"""
        self.cpu.debug = enabled
        
    def add_breakpoint(self, address: int):
        """Add a breakpoint"""
        self.cpu.breakpoints.add(address)
        
    def remove_breakpoint(self, address: int):
        """Remove a breakpoint"""
        self.cpu.breakpoints.discard(address)
        
    def read_memory(self, address: int, length: int = 1) -> bytes:
        """Read memory range"""
        return bytes(self.cpu.memory[address:address + length])
        
    def write_memory(self, address: int, data: bytes):
        """Write memory range"""
        for i, byte in enumerate(data):
            self.cpu.memory[address + i] = byte


def main():
    """Test the emulator with a simple program"""
    print("🚀 AIOS 6502 Emulator - Testing")
    
    # Create emulator
    emulator = Emulator6502()
    
    # Simple test program (NOP instructions)
    test_program = bytes([
        0xEA,  # NOP
        0xEA,  # NOP
        0xEA,  # NOP
        0x00   # BRK
    ])
    
    # Load and run
    emulator.load_program(test_program, 0x8000)
    emulator.set_debug(True)
    
    print("Running test program...")
    instructions = emulator.run(10)
    
    print(f"Executed {instructions} instructions")
    print("CPU Status:", emulator.get_status()['cpu'])
    
    print("✅ Emulator test completed successfully!")


if __name__ == "__main__":
    main()

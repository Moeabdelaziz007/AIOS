#!/usr/bin/env python3
"""
AIOS Emulator Launcher
Main Python script to launch and control the AIOS 6502 emulator with BASIC-M6502 integration
"""

import os
import sys
import json
import argparse
import time
import signal
from typing import Dict, List, Optional, Any
from pathlib import Path

# Add emulator directory to path
current_dir = Path(__file__).parent
emulator_dir = current_dir / "emulator"
sys.path.insert(0, str(emulator_dir))

try:
    from aios_emulator_bridge import AIOSEmulatorBridge, EmulatorConfig
    from basic_m6502_integration import BasicM6502Interpreter, BasicM6502Compiler
except ImportError as e:
    print(f"❌ Error importing emulator modules: {e}")
    print("Trying alternative import...")
    try:
        import sys
        sys.path.append('emulator')
        from aios_emulator_bridge import AIOSEmulatorBridge, EmulatorConfig
        from basic_m6502_integration import BasicM6502Interpreter, BasicM6502Compiler
    except ImportError as e2:
        print(f"❌ Alternative import also failed: {e2}")
        print("Creating mock classes for testing...")
        # Create mock classes for testing
        class AIOSEmulatorBridge:
            def __init__(self, config): 
                self.config = config
                self.callbacks = {}
            def load_basic_rom(self, path): return True
            def load_basic_program(self, path): return True
            def run_program(self): pass
            def step_program(self): pass
            def reset_emulator(self): pass
            def add_callback(self, event, callback): 
                self.callbacks[event] = callback
            def get_status(self): 
                return {"status": "running", "cpu": {"pc": 0x8000}}
        
        class EmulatorConfig:
            def __init__(self, settings, **kwargs): 
                self.settings = settings
                for key, value in kwargs.items():
                    setattr(self, key, value)
        
        class BasicM6502Interpreter:
            def __init__(self): pass
        
        class BasicM6502Compiler:
            def __init__(self): pass


class AIOSEmulatorLauncher:
    """Main launcher class for AIOS emulator"""
    
    def __init__(self, settings_file: str = "settings.json"):
        self.settings_file = settings_file
        self.settings = self.load_settings()
        self.emulator = None
        self.running = False
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
    def load_settings(self) -> Dict[str, Any]:
        """Load settings from JSON file"""
        default_settings = {
            "emulator_settings": {
                "memory_size_kb": 64,
                "basic_rom_size_kb": 8,
                "basic_rom_start_address": "0xC000",
                "debug_mode": False,
                "step_delay_ms": 10,
                "max_instructions": 1000000,
                "cpu_speed": {
                    "frequency_hz": 1000000,
                    "cycle_delay_ms": 0.001,
                    "speed_multiplier": 1.0,
                    "max_speed": True,
                    "adaptive_speed": False
                }
            },
            "logging_settings": {
                "log_level": "INFO",
                "log_to_file": True,
                "log_to_console": True,
                "log_file_path": "logs/emulator.log",
                "log_categories": {
                    "cpu_state": True,
                    "memory_access": True,
                    "basic_commands": True,
                    "io_operations": True,
                    "error_handling": True,
                    "performance": True,
                    "debug_info": False
                }
            },
            "paths": {
                "basic_rom_file": "src/m6502.asm",
                "sample_programs_dir": "sample_programs",
                "logs_dir": "logs",
                "temp_dir": "temp"
            }
        }
        
        if os.path.exists(self.settings_file):
            try:
                with open(self.settings_file, 'r') as f:
                    user_settings = json.load(f)
                default_settings.update(user_settings)
                print(f"✅ Settings loaded from {self.settings_file}")
            except Exception as e:
                print(f"⚠️ Error loading settings: {e}, using defaults")
        else:
            print(f"ℹ️ Settings file not found, creating default {self.settings_file}")
            self.save_settings(default_settings)
            
        return default_settings
        
    def save_settings(self, settings: Optional[Dict[str, Any]] = None):
        """Save settings to JSON file"""
        settings_to_save = settings or self.settings
        try:
            with open(self.settings_file, 'w') as f:
                json.dump(settings_to_save, f, indent=2)
            print(f"✅ Settings saved to {self.settings_file}")
        except Exception as e:
            print(f"❌ Error saving settings: {e}")
            
    def create_emulator(self) -> AIOSEmulatorBridge:
        """Create and configure emulator based on settings"""
        config = EmulatorConfig(
            settings=self.settings,
            max_instructions=self.settings.get("max_instructions", 1000000),
            debug_mode=self.settings.get("debug_mode", False),
            breakpoints=self.settings.get("breakpoints", []),
            memory_size=self.settings.get("memory_size", 65536),
            rom_size=self.settings.get("rom_size", 8192)
        )
        
        emulator = AIOSEmulatorBridge(config)
        
        # Add callbacks
        emulator.add_callback('on_start', self.on_emulator_start)
        emulator.add_callback('on_stop', self.on_emulator_stop)
        emulator.add_callback('on_error', self.on_emulator_error)
        emulator.add_callback('on_breakpoint', self.on_breakpoint_hit)
        
        return emulator
        
    def on_emulator_start(self):
        """Callback when emulator starts"""
        print("🚀 Emulator started")
        
    def on_emulator_stop(self):
        """Callback when emulator stops"""
        print("⏹️ Emulator stopped")
        
    def on_emulator_error(self, error: str):
        """Callback when emulator encounters an error"""
        print(f"❌ Emulator error: {error}")
        
    def on_breakpoint_hit(self, address: int):
        """Callback when breakpoint is hit"""
        print(f"🔴 Breakpoint hit at ${address:04X}")
        
    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        print(f"\n🛑 Received signal {signum}, shutting down...")
        self.shutdown()
        
    def shutdown(self):
        """Graceful shutdown"""
        if self.emulator:
            self.emulator.reset_emulator()
        self.running = False
        print("👋 AIOS Emulator Launcher shutdown complete")
        sys.exit(0)
    
    def apply_cli_overrides(self, args):
        """Apply command-line argument overrides to settings"""
        # Debug mode
        if args.debug:
            self.settings["debug_mode"] = True
        
        # Speed control overrides
        if args.speed is not None:
            self.settings["emulator_settings"]["cpu_speed"]["speed_multiplier"] = args.speed
            print(f"⚡ Speed multiplier set to {args.speed}x")
        
        if args.frequency is not None:
            self.settings["emulator_settings"]["cpu_speed"]["frequency_hz"] = args.frequency
            print(f"⚡ CPU frequency set to {args.frequency} Hz")
        
        if args.max_speed:
            self.settings["emulator_settings"]["cpu_speed"]["max_speed"] = True
            print("⚡ Maximum speed enabled")
        
        if args.slow:
            self.settings["emulator_settings"]["cpu_speed"]["speed_multiplier"] = 0.1
            print("🐌 Slow speed enabled (0.1x)")
        
        if args.fast:
            self.settings["emulator_settings"]["cpu_speed"]["speed_multiplier"] = 10.0
            print("🚀 Fast speed enabled (10x)")
        
        # Logging overrides
        if args.log_level:
            self.settings["logging_settings"]["log_level"] = args.log_level
            print(f"📝 Log level set to {args.log_level}")
        
        if args.log_file:
            self.settings["logging_settings"]["log_file_path"] = args.log_file
            print(f"📝 Log file set to {args.log_file}")
        
        if args.log_console:
            self.settings["logging_settings"]["log_to_console"] = True
            print("📝 Console logging enabled")
        
        if args.log_cpu:
            self.settings["logging_settings"]["log_categories"]["cpu_state"] = True
            print("📝 CPU state logging enabled")
        
        if args.log_memory:
            self.settings["logging_settings"]["log_categories"]["memory_access"] = True
            print("📝 Memory access logging enabled")
        
        if args.log_performance:
            self.settings["logging_settings"]["log_categories"]["performance"] = True
            print("📝 Performance logging enabled")
        
        if args.clear_logs:
            # Clear logs will be handled after emulator creation
            print("📝 Log clearing requested")
        
        # Performance monitoring
        if args.profile:
            self.settings["emulator_settings"]["performance_monitoring"]["enabled"] = True
            self.settings["emulator_settings"]["performance_monitoring"]["profile_execution"] = True
            print("📊 Performance profiling enabled")
        
        if args.monitor:
            self.settings["emulator_settings"]["performance_monitoring"]["enabled"] = True
            print("📊 Performance monitoring enabled")
        
    def load_basic_rom(self, rom_path: Optional[str] = None) -> bool:
        """Load BASIC ROM"""
        rom_path = rom_path or self.settings.get("paths", {}).get("basic_rom_file", "src/m6502.asm")
        
        if not os.path.exists(rom_path):
            print(f"⚠️ BASIC ROM not found at {rom_path}")
            print("Creating mock ROM for testing...")
            self.create_mock_rom(rom_path)
            
        success = self.emulator.load_basic_rom(rom_path)
        if success:
            print(f"✅ BASIC ROM loaded from {rom_path}")
        else:
            print(f"❌ Failed to load BASIC ROM from {rom_path}")
            
        return success
        
    def create_mock_rom(self, rom_path: str):
        """Create a mock BASIC ROM for testing"""
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(rom_path), exist_ok=True)
            
            # Create mock ROM with NOP instructions
            mock_rom = bytes([0xEA] * 8192)  # 8KB of NOP instructions
            
            with open(rom_path, 'wb') as f:
                f.write(mock_rom)
                
            print(f"✅ Mock ROM created at {rom_path}")
            
        except Exception as e:
            print(f"❌ Error creating mock ROM: {e}")
            
    def load_basic_program(self, program_path: str) -> bool:
        """Load BASIC program from file"""
        try:
            if not os.path.exists(program_path):
                print(f"❌ Program file not found: {program_path}")
                return False
                
            with open(program_path, 'r') as f:
                basic_code = f.read()
                
            print(f"📄 Loading BASIC program: {program_path}")
            result = self.emulator.compile_and_load_basic(basic_code)
            
            if result['success']:
                print(f"✅ Program compiled successfully ({result['compiled_size']} bytes)")
                return True
            else:
                print(f"❌ Compilation failed:")
                for error in result['errors']:
                    print(f"   - {error}")
                return False
                
        except Exception as e:
            print(f"❌ Error loading program: {e}")
            return False
            
    def run_program(self, max_instructions: Optional[int] = None) -> Dict[str, Any]:
        """Run the loaded program"""
        if not self.emulator:
            return {'success': False, 'error': 'Emulator not initialized'}
            
        print("▶️ Starting program execution...")
        start_time = time.time()
        
        result = self.emulator.run_program(max_instructions)
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        if result['success']:
            print(f"✅ Program completed successfully!")
            print(f"   Instructions: {result['instructions']}")
            print(f"   Cycles: {result['cycles']}")
            print(f"   Execution time: {execution_time:.3f}s")
            
            # Calculate performance metrics
            if execution_time > 0:
                ips = result['instructions'] / execution_time
                print(f"   Instructions/sec: {ips:.0f}")
        else:
            print(f"❌ Program execution failed: {result['error']}")
            
        return result
        
    def step_program(self) -> Dict[str, Any]:
        """Execute one instruction"""
        if not self.emulator:
            return {'success': False, 'error': 'Emulator not initialized'}
            
        result = self.emulator.step_program()
        
        if result['success']:
            cpu_status = result['cpu_status']
            print(f"Step: PC=${cpu_status['pc']:04X} A=${cpu_status['a']:02X} X=${cpu_status['x']:02X} Y=${cpu_status['y']:02X} SP=${cpu_status['sp']:02X} P=${cpu_status['p']:02X}")
        else:
            print(f"❌ Step failed: {result['error']}")
            
        return result
        
    def dump_cpu_state(self):
        """Dump current CPU state"""
        if not self.emulator:
            print("❌ Emulator not initialized")
            return
            
        status = self.emulator.get_cpu_status()
        
        print("\n📊 CPU State:")
        print(f"   PC: ${status['pc']:04X}")
        print(f"   A:  ${status['a']:02X}")
        print(f"   X:  ${status['x']:02X}")
        print(f"   Y:  ${status['y']:02X}")
        print(f"   SP: ${status['sp']:02X}")
        print(f"   P:  ${status['p']:02X}")
        
        print("\n🏁 Flags:")
        flags = status['flags']
        flag_names = ['C', 'Z', 'I', 'D', 'B', 'U', 'V', 'N']
        flag_values = [
            flags['carry'], flags['zero'], flags['interrupt'],
            flags['decimal'], flags['break'], flags['unused'],
            flags['overflow'], flags['negative']
        ]
        
        for name, value in zip(flag_names, flag_values):
            status_char = '1' if value else '0'
            print(f"   {name}: {status_char}")
            
        print(f"\n📈 Statistics:")
        print(f"   Total Instructions: {status['instructions']}")
        print(f"   Total Cycles: {status['cycles']}")
        print(f"   Running: {status['running']}")
        
    def dump_memory(self, start: int = 0x0000, length: int = 256):
        """Dump memory contents"""
        if not self.emulator:
            print("❌ Emulator not initialized")
            return
            
        print(f"\n💾 Memory Dump (${start:04X}-${start+length-1:04X}):")
        dump = self.emulator.get_memory_dump(start, length)
        print(dump)
        
    def set_breakpoint(self, address: int):
        """Set a breakpoint"""
        if not self.emulator:
            print("❌ Emulator not initialized")
            return
            
        self.emulator.set_breakpoint(address)
        print(f"🔴 Breakpoint set at ${address:04X}")
        
    def remove_breakpoint(self, address: int):
        """Remove a breakpoint"""
        if not self.emulator:
            print("❌ Emulator not initialized")
            return
            
        self.emulator.remove_breakpoint(address)
        print(f"🔴 Breakpoint removed at ${address:04X}")
        
    def list_breakpoints(self):
        """List all breakpoints"""
        if not self.emulator:
            print("❌ Emulator not initialized")
            return
            
        breakpoints = self.emulator.config.breakpoints
        if breakpoints:
            print("🔴 Active Breakpoints:")
            for bp in breakpoints:
                print(f"   ${bp:04X}")
        else:
            print("No breakpoints set")
            
    def create_sample_programs(self):
        """Create sample BASIC programs for testing"""
        sample_dir = self.settings.get("paths", {}).get("sample_programs_dir", "sample_programs")
        os.makedirs(sample_dir, exist_ok=True)
        
        sample_programs = {
            "hello.bas": '''REM Hello World Program
PRINT "Hello, AIOS!"
PRINT "Welcome to BASIC-M6502"
END''',
            
            "counter.bas": '''REM Counter Program
FOR I = 1 TO 10
    PRINT "Count: "; I
NEXT I
PRINT "Done!"
END''',
            
            "calculator.bas": '''REM Simple Calculator
INPUT "Enter first number: ", A
INPUT "Enter second number: ", B
LET C = A + B
PRINT "Sum: "; C
END''',
            
            "loop_test.bas": '''REM Loop Test
LET X = 0
WHILE X < 5
    PRINT "X = "; X
    LET X = X + 1
WEND
PRINT "Loop complete"
END'''
        }
        
        for filename, content in sample_programs.items():
            filepath = os.path.join(sample_dir, filename)
            with open(filepath, 'w') as f:
                f.write(content)
                
        print(f"✅ Sample programs created in {sample_dir}/")
        
    def interactive_mode(self):
        """Start interactive mode"""
        print("\n🎮 Interactive Mode - Type 'help' for commands")
        self.running = True
        
        while self.running:
            try:
                command = input("\nAIOS> ").strip().lower()
                
                if not command:
                    continue
                    
                if command == 'help':
                    self.show_help()
                elif command == 'quit' or command == 'exit':
                    self.shutdown()
                elif command == 'status':
                    self.dump_cpu_state()
                elif command == 'memory':
                    self.dump_memory()
                elif command == 'breakpoints':
                    self.list_breakpoints()
                elif command.startswith('load '):
                    program_path = command[5:].strip()
                    self.load_basic_program(program_path)
                elif command == 'run':
                    self.run_program()
                elif command == 'step':
                    self.step_program()
                elif command.startswith('break '):
                    try:
                        address = int(command[6:].strip(), 16)
                        self.set_breakpoint(address)
                    except ValueError:
                        print("❌ Invalid address format")
                elif command.startswith('unbreak '):
                    try:
                        address = int(command[8:].strip(), 16)
                        self.remove_breakpoint(address)
                    except ValueError:
                        print("❌ Invalid address format")
                elif command.startswith('memory '):
                    try:
                        parts = command[7:].strip().split()
                        start = int(parts[0], 16) if parts else 0x0000
                        length = int(parts[1], 16) if len(parts) > 1 else 256
                        self.dump_memory(start, length)
                    except ValueError:
                        print("❌ Invalid memory dump format")
                else:
                    print(f"❌ Unknown command: {command}")
                    
            except KeyboardInterrupt:
                print("\n🛑 Interrupted by user")
                self.shutdown()
            except EOFError:
                print("\n👋 Goodbye!")
                self.shutdown()
                
    def show_help(self):
        """Show help information"""
        help_text = """
🎮 AIOS Emulator Commands:

Basic Commands:
  help                    - Show this help
  quit/exit              - Exit the emulator
  status                 - Show CPU state
  memory [start] [len]   - Dump memory (default: 0x0000, 256 bytes)

Program Control:
  load <file>            - Load BASIC program from file
  run                    - Run loaded program
  step                   - Execute one instruction

Debugging:
  breakpoints            - List all breakpoints
  break <address>        - Set breakpoint at address (hex)
  unbreak <address>      - Remove breakpoint at address (hex)

Examples:
  load sample_programs/hello.bas
  run
  step
  break 8000
  memory 8000 64
        """
        print(help_text)


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="AIOS 6502 Emulator Launcher")
    parser.add_argument("--settings", default="settings.json", help="Settings file path")
    parser.add_argument("--rom", help="BASIC ROM file path")
    parser.add_argument("--program", help="BASIC program file to load")
    parser.add_argument("--run", action="store_true", help="Run program immediately")
    parser.add_argument("--step", action="store_true", help="Step through program")
    parser.add_argument("--interactive", action="store_true", help="Start interactive mode")
    parser.add_argument("--create-samples", action="store_true", help="Create sample programs")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode")
    
    # Speed control options
    parser.add_argument("--speed", type=float, help="CPU speed multiplier (0.1-10.0)")
    parser.add_argument("--frequency", type=int, help="CPU frequency in Hz")
    parser.add_argument("--max-speed", action="store_true", help="Run at maximum speed")
    parser.add_argument("--slow", action="store_true", help="Run at slow speed (0.1x)")
    parser.add_argument("--fast", action="store_true", help="Run at fast speed (10x)")
    
    # Logging options
    parser.add_argument("--log-level", choices=["DEBUG", "INFO", "WARNING", "ERROR"], 
                       help="Set logging level")
    parser.add_argument("--log-file", help="Log file path")
    parser.add_argument("--log-console", action="store_true", help="Enable console logging")
    parser.add_argument("--log-cpu", action="store_true", help="Enable CPU state logging")
    parser.add_argument("--log-memory", action="store_true", help="Enable memory access logging")
    parser.add_argument("--log-performance", action="store_true", help="Enable performance logging")
    parser.add_argument("--clear-logs", action="store_true", help="Clear log files")
    
    # Performance monitoring
    parser.add_argument("--profile", action="store_true", help="Enable performance profiling")
    parser.add_argument("--monitor", action="store_true", help="Enable performance monitoring")
    
    args = parser.parse_args()
    
    print("🚀 AIOS 6502 Emulator Launcher")
    print("=" * 40)
    
    # Create launcher
    launcher = AIOSEmulatorLauncher(args.settings)
    
    # Apply command-line overrides
    launcher.apply_cli_overrides(args)
    
    # Create emulator
    launcher.emulator = launcher.create_emulator()
    
    # Create sample programs if requested
    if args.create_samples:
        launcher.create_sample_programs()
        return
        
    # Load BASIC ROM
    if not launcher.load_basic_rom(args.rom):
        print("⚠️ Continuing without BASIC ROM...")
        
    # Load program if specified
    if args.program:
        if not launcher.load_basic_program(args.program):
            print("❌ Failed to load program, exiting")
            return
            
    # Run program if requested
    if args.run:
        launcher.run_program()
        
    # Step mode
    if args.step:
        print("🎮 Step mode - Press Enter to step, 'q' to quit")
        while True:
            try:
                user_input = input("Press Enter to step (or 'q' to quit): ").strip()
                if user_input.lower() == 'q':
                    break
                launcher.step_program()
            except KeyboardInterrupt:
                break
                
    # Interactive mode
    if args.interactive or (not args.run and not args.step):
        launcher.interactive_mode()
        
    print("👋 AIOS Emulator Launcher finished")


if __name__ == "__main__":
    main()

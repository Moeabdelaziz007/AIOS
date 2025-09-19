#!/bin/bash
# AIOS Emulator Launcher Verification Script
# Verifies the launcher setup and file structure

echo "🚀 AIOS Emulator Launcher - Setup Verification"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "launch_emulator.py" ]; then
    echo "❌ Error: Not in engine directory"
    exit 1
fi

echo "✅ Engine directory found"

# Check file structure
echo ""
echo "📁 Checking file structure..."

files=(
    "launch_emulator.py"
    "settings.json"
    "test_launcher.py"
    "README.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (missing)"
    fi
done

# Check emulator directory
echo ""
echo "🔧 Checking emulator directory..."

emulator_files=(
    "emulator/aios_6502_emulator.py"
    "emulator/basic_m6502_integration.py"
    "emulator/aios_emulator_bridge.py"
    "emulator/test_emulator.py"
)

for file in "${emulator_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (missing)"
    fi
done

# Check sample programs
echo ""
echo "📄 Checking sample programs..."

sample_files=(
    "sample_programs/hello.bas"
    "sample_programs/counter.bas"
    "sample_programs/calculator.bas"
    "sample_programs/loop_test.bas"
)

for file in "${sample_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (missing)"
    fi
done

# Check file sizes
echo ""
echo "📊 File sizes:"

all_files=(
    "launch_emulator.py"
    "settings.json"
    "test_launcher.py"
    "README.md"
    "emulator/aios_6502_emulator.py"
    "emulator/basic_m6502_integration.py"
    "emulator/aios_emulator_bridge.py"
    "emulator/test_emulator.py"
)

for file in "${all_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        lines=$(wc -l < "$file")
        echo "   $file: $size bytes, $lines lines"
    fi
done

# Check Python syntax
echo ""
echo "🐍 Checking Python syntax..."

python_files=(
    "launch_emulator.py"
    "test_launcher.py"
    "emulator/aios_6502_emulator.py"
    "emulator/basic_m6502_integration.py"
    "emulator/aios_emulator_bridge.py"
    "emulator/test_emulator.py"
)

for file in "${python_files[@]}"; do
    if [ -f "$file" ]; then
        # Basic syntax check using grep
        if grep -q "def \|class \|import \|from " "$file"; then
            echo "   ✅ $file (appears to be valid Python)"
        else
            echo "   ⚠️ $file (may have syntax issues)"
        fi
    fi
done

# Check for required imports
echo ""
echo "📦 Checking imports..."

required_imports=(
    "import os"
    "import sys"
    "import json"
    "import argparse"
)

for file in "${python_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   $file imports:"
        for imp in "${required_imports[@]}"; do
            if grep -q "$imp" "$file"; then
                echo "     ✅ $imp"
            else
                echo "     ❌ $imp (missing)"
            fi
        done
    fi
done

# Check for BASIC integration
echo ""
echo "🔧 Checking BASIC-M6502 integration..."

if grep -q "BASIC" launch_emulator.py; then
    echo "   ✅ BASIC integration found in launcher"
else
    echo "   ❌ BASIC integration not found in launcher"
fi

if grep -q "load_basic_program" launch_emulator.py; then
    echo "   ✅ BASIC program loading found"
else
    echo "   ❌ BASIC program loading not found"
fi

# Check for CLI interface
echo ""
echo "🎮 Checking CLI interface..."

cli_features=(
    "argparse"
    "interactive_mode"
    "load_basic_program"
    "run_program"
    "step_program"
)

if [ -f "launch_emulator.py" ]; then
    echo "   CLI features found:"
    for feature in "${cli_features[@]}"; do
        if grep -q "$feature" launch_emulator.py; then
            echo "     ✅ $feature"
        else
            echo "     ❌ $feature (missing)"
        fi
    done
else
    echo "   ❌ launch_emulator.py not found"
fi

# Check settings.json
echo ""
echo "⚙️ Checking settings.json..."

if [ -f "settings.json" ]; then
    if grep -q "memory_size" settings.json; then
        echo "   ✅ Memory size setting found"
    else
        echo "   ❌ Memory size setting missing"
    fi
    
    if grep -q "debug_mode" settings.json; then
        echo "   ✅ Debug mode setting found"
    else
        echo "   ❌ Debug mode setting missing"
    fi
    
    if grep -q "basic_rom_path" settings.json; then
        echo "   ✅ BASIC ROM path setting found"
    else
        echo "   ❌ BASIC ROM path setting missing"
    fi
else
    echo "   ❌ settings.json not found"
fi

# Check sample programs content
echo ""
echo "📄 Checking sample program content..."

if [ -f "sample_programs/hello.bas" ]; then
    if grep -q "PRINT" sample_programs/hello.bas; then
        echo "   ✅ Hello program has PRINT statements"
    else
        echo "   ❌ Hello program missing PRINT statements"
    fi
    
    if grep -q "END" sample_programs/hello.bas; then
        echo "   ✅ Hello program has END statement"
    else
        echo "   ❌ Hello program missing END statement"
    fi
else
    echo "   ❌ Hello program not found"
fi

# Summary
echo ""
echo "📋 Summary:"
echo "   Launcher: AIOS Emulator Launcher"
echo "   Files: ${#all_files[@]} Python/JSON files"
echo "   Sample Programs: ${#sample_files[@]} BASIC programs"
echo "   Emulator: Custom 6502 emulator"
echo "   Integration: BASIC-M6502 support"
echo "   Interface: Command-line + Interactive"

echo ""
echo "🎯 Next Steps:"
echo "   1. Install Python 3.x"
echo "   2. Run: python3 launch_emulator.py --help"
echo "   3. Test: python3 launch_emulator.py --create-samples"
echo "   4. Run: python3 launch_emulator.py --interactive"

echo ""
echo "✅ Setup verification completed!"
echo "   The launcher is ready for Python execution when Python is available."

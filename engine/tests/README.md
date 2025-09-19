# BASIC-M6502 Engine Tests

## Test Structure

This directory contains tests for the BASIC-M6502 engine integration.

## Test Categories

- **Unit Tests**: Individual component testing
- **Integration Tests**: Full system testing
- **Performance Tests**: Speed and memory usage
- **Compatibility Tests**: Cross-platform validation

## Test Files

- `test_emulator.py` - 6502 emulator functionality
- `test_basic_interpreter.py` - BASIC interpreter tests
- `test_integration.py` - Full system integration
- `test_performance.py` - Performance benchmarks

## Running Tests

```bash
# Install test dependencies
pip install -r requirements.txt

# Run all tests
pytest tests/

# Run specific test category
pytest tests/test_emulator.py
```

## Test Data

- Sample BASIC programs for validation
- Expected output files
- Performance benchmarks
- Compatibility matrices

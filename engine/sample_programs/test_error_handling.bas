10 REM Test Error Handling
20 PRINT "Starting Error Handling Test"
30 PRINT "Testing division by zero (should handle gracefully):"
40 LET A = 10
50 LET B = 0
60 IF B <> 0 THEN PRINT "A / B = "; A / B ELSE PRINT "Cannot divide by zero"
70 PRINT "Testing array bounds (should handle gracefully):"
80 DIM ARRAY(5)
90 FOR I = 0 TO 5
100   ARRAY(I) = I
110 NEXT I
120 IF I <= 5 THEN PRINT "ARRAY("; I-1; ") = "; ARRAY(I-1) ELSE PRINT "Array index out of bounds"
130 PRINT "Testing invalid operations:"
140 LET X = 0
150 IF X > 0 THEN PRINT "X is positive" ELSE PRINT "X is zero or negative"
160 PRINT "Error Handling Test Complete"
170 END

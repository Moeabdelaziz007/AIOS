10 REM Performance Benchmark Test
20 PRINT "Starting Performance Benchmark Test"
30 LET START_TIME = TIMER
40 PRINT "Starting benchmark at time: "; START_TIME
50 LET SUM = 0
60 FOR I = 1 TO 1000
70   FOR J = 1 TO 100
80     SUM = SUM + I * J
90   NEXT J
100 NEXT I
110 LET END_TIME = TIMER
120 PRINT "Benchmark completed at time: "; END_TIME
130 PRINT "Total iterations: "; I-1; " * "; J-1; " = "; (I-1) * (J-1)
140 PRINT "Final sum: "; SUM
150 PRINT "Execution time: "; END_TIME - START_TIME; " seconds"
160 PRINT "Performance Benchmark Test Complete"
170 END

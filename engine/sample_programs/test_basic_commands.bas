10 REM Test Basic Commands
20 PRINT "Starting Basic Commands Test"
30 LET A = 10
40 LET B = 20
50 LET C = A + B
60 PRINT "A = "; A
70 PRINT "B = "; B
80 PRINT "C = A + B = "; C
90 IF C > 25 THEN PRINT "C is greater than 25"
100 IF C <= 30 THEN PRINT "C is less than or equal to 30"
110 FOR I = 1 TO 5
120   PRINT "Loop iteration: "; I
130 NEXT I
140 PRINT "Basic Commands Test Complete"
150 END

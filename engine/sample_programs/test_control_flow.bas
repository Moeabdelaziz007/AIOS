10 REM Test Control Flow
20 PRINT "Starting Control Flow Test"
30 LET X = 5
40 PRINT "Testing IF-THEN-ELSE statements:"
50 IF X > 3 THEN PRINT "X is greater than 3" ELSE PRINT "X is not greater than 3"
60 IF X < 10 THEN PRINT "X is less than 10" ELSE PRINT "X is not less than 10"
70 PRINT "Testing WHILE loop:"
80 LET COUNT = 0
90 WHILE COUNT < 3
100   PRINT "While loop iteration: "; COUNT
110   COUNT = COUNT + 1
120 WEND
130 PRINT "Testing nested loops:"
140 FOR I = 1 TO 3
150   FOR J = 1 TO 2
160     PRINT "Nested: I="; I; ", J="; J
170   NEXT J
180 NEXT I
190 PRINT "Control Flow Test Complete"
200 END

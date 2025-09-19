10 REM Test Memory Operations
20 PRINT "Starting Memory Operations Test"
30 DIM ARRAY(10)
40 FOR I = 0 TO 10
50   ARRAY(I) = I * 2
60 NEXT I
70 PRINT "Array filled with values:"
80 FOR I = 0 TO 10
90   PRINT "ARRAY("; I; ") = "; ARRAY(I)
100 NEXT I
110 LET SUM = 0
120 FOR I = 0 TO 10
130   SUM = SUM + ARRAY(I)
140 NEXT I
150 PRINT "Sum of array elements: "; SUM
160 PRINT "Memory Operations Test Complete"
170 END

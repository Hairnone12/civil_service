/* =========================================================
   DATA FILE: Levels 1-20 Question Bank
   =========================================================
   This is the source pool for the 20 sequential leveled exams
   (Exam 1 through Exam 20 on the dashboard).

   HOW IT'S USED:
   Each of the 20 exams pulls 5 questions per category (20 total)
   from this pool. buildExam() in app.js cycles through this list
   and shuffles the order + answer choices differently for every
   exam and every attempt — so this file does NOT need one entry
   per exam; the same question pool gets reused and reshuffled
   across all 20 levels. (numerical: 74 items, others: 25 each —
   more in one category just means it takes longer to repeat.)

   HOW TO EDIT:
   - Each category (numerical / analytical / verbal / general) is
     its own array below.
   - Each question is one object: { q, o, a, e }
       q = the question text (string)
       o = array of answer choices (any length, but 4 is standard)
       a = index (0-based) of the correct answer in "o"
       e = explanation shown after answering (supports plain text;
           avoid raw HTML except <strong> if really needed)
   - To add a question: copy an existing {...} block within the
     right category array, edit it, and add a comma after the
     previous entry.
   - To remove a question: delete its {...} block (and the comma
     before or after it, so the array stays valid).
   - Do NOT rename "numerical" / "analytical" / "verbal" / "general"
     — app.js and every other data file reference these exact keys.
   ========================================================= */

const BANK = {
numerical:[
{q:"A car travels 240 km in 4 hours. What is its average speed?", o:["50 km/h","60 km/h","70 km/h","80 km/h"], a:1, e:"Speed = Distance ÷ Time = 240 ÷ 4 = 60 km/h."},
{q:"What number completes the sequence: 2, 4, 8, 16, __?", o:["24","28","32","36"], a:2, e:"Each term doubles the one before it: 16 × 2 = 32."},
{q:"What is 15% of 200?", o:["20","25","30","35"], a:2, e:"15% of 200 = 0.15 × 200 = 30."},
{q:"A shirt priced at ₱800 is on a 25% discount. What is the sale price?", o:["₱550","₱600","₱650","₱700"], a:1, e:"Discount = 25% of 800 = 200. Sale price = 800 − 200 = ₱600."},
{q:"Simplify the ratio 24:36 to lowest terms.", o:["3:4","4:5","2:3","1:2"], a:2, e:"Divide both terms by their GCF, 12: 24÷12=2, 36÷12=3, giving 2:3."},
{q:"Find the average of 12, 15, 18, 21, and 24.", o:["16","17","18","19"], a:2, e:"Sum = 90, divided by 5 numbers = 18."},
{q:"If 3 workers finish a job in 12 days, how many days will 6 workers need at the same rate?", o:["4 days","6 days","8 days","9 days"], a:1, e:"Total work = 3×12 = 36 worker-days. 36 ÷ 6 workers = 6 days."},
{q:"What number completes the Fibonacci-style sequence: 1, 1, 2, 3, 5, 8, __?", o:["11","12","13","14"], a:2, e:"Each term is the sum of the two before it: 5 + 8 = 13."},
{q:"A 120-meter train crosses a pole in 8 seconds. What is its speed in m/s?", o:["12 m/s","15 m/s","18 m/s","20 m/s"], a:1, e:"Speed = Distance ÷ Time = 120 ÷ 8 = 15 m/s."},
{q:"₱5,000 is invested at 4% simple interest for 3 years. What is the interest earned?", o:["₱500","₱550","₱600","₱650"], a:2, e:"Interest = Principal × Rate × Time = 5000 × 0.04 × 3 = ₱600."},
{q:"A value increases from 80 to 100. What is the percentage increase?", o:["20%","25%","30%","35%"], a:1, e:"Increase = 20. Percentage = (20 ÷ 80) × 100 = 25%."},
{q:"If x + 5 = 12, what is x?", o:["5","6","7","8"], a:2, e:"x = 12 − 5 = 7."},
{q:"What is the smallest prime number greater than 50?", o:["51","52","53","57"], a:2, e:"51 = 3×17 and 52 is even, so neither is prime. 53 has no divisors other than 1 and itself."},
{q:"What is the LCM (Least Common Multiple) of 4 and 6?", o:["8","10","12","24"], a:2, e:"Multiples of 4: 4,8,12... Multiples of 6: 6,12... The smallest common one is 12."},
{q:"What is the GCF (Greatest Common Factor) of 18 and 24?", o:["3","4","6","9"], a:2, e:"Factors of 18: 1,2,3,6,9,18. Factors of 24: 1,2,3,4,6,8,12,24. Largest common factor is 6."},
{q:"A rectangle has a length of 8 cm and width of 5 cm. What is its area?", o:["13 cm²","26 cm²","35 cm²","40 cm²"], a:3, e:"Area = length × width = 8 × 5 = 40 cm²."},
{q:"What is 3/4 of 96?", o:["64","68","72","76"], a:2, e:"3/4 × 96 = (3 × 96) ÷ 4 = 288 ÷ 4 = 72."},
{q:"What number completes the sequence: 3, 6, 11, 18, 27, __?", o:["34","36","38","40"], a:2, e:"The differences increase by 2 each time (+3,+5,+7,+9,+11): 27 + 11 = 38."},
{q:"If a:b = 2:3 and b:c = 4:5, what is a:c?", o:["6:15","8:15","2:5","4:9"], a:1, e:"Scale b to match: a:b = 8:12, b:c = 12:15. So a:c = 8:15."},
{q:"Convert 3/8 to a percentage.", o:["32.5%","35%","37.5%","40%"], a:2, e:"3 ÷ 8 = 0.375, which is 37.5%."},
{q:"Two numbers have a sum of 45 and a ratio of 4:5. What is the larger number?", o:["18","20","22","25"], a:3, e:"Total parts = 9. Each part = 45÷9 = 5. Larger number = 5 parts × 5 = 25."},
{q:"A man walks 5 km in 1 hour 15 minutes. What is his speed in km/h?", o:["3 km/h","4 km/h","5 km/h","6 km/h"], a:1, e:"1 hr 15 min = 1.25 hr. Speed = 5 ÷ 1.25 = 4 km/h."},
{q:"If 20 pens cost ₱240, how much would 35 pens cost at the same rate?", o:["₱380","₱400","₱420","₱440"], a:2, e:"Cost per pen = 240 ÷ 20 = ₱12. 35 pens = 35 × 12 = ₱420."},
{q:"What number completes the sequence: 100, 90, 81, 73, __?", o:["64","65","66","68"], a:2, e:"The differences decrease by 1 each time (−10,−9,−8,−7): 73 − 7 = 66."},
{q:"A boy is 3 times as old as his sister. In 5 years, he will be twice her age. How old is the sister now?", o:["3","5","7","10"], a:1, e:"Let sister = x, boy = 3x. 3x+5 = 2(x+5) → 3x+5=2x+10 → x=5."},
{q:"What is 17% of ₱1,100?", o:["₱162","₱187","₱237","₱287"], a:1, e:"Convert percentage to decimal: 17 / 100 = 0.17. Multiply: 1100 × 0.17 = 187."},
{q:"Find the next number in the sequence: 5, 11, 17, 23, ___", o:["27","29","32","34"], a:1, e:"The sequence increases by a common difference of +6 per step. 23 + 6 = 29."},
{q:"Two numbers are in the ratio 3:3. If their sum is 84, what is the smaller number?", o:["37","42","52","57"], a:1, e:"Sum of ratio parts: 3 + 3 = 6. Value of 1 part: 84 / 6 = 14. Smaller part: 3 × 14 = 42."},
{q:"Solve for x: 2x + 10 = 26", o:["10","12","7","8"], a:3, e:"Subtract 10 from both sides: 2x = 16. Divide by 2: x = 8."},
{q:"What is 22% of ₱1,350?", o:["₱272","₱297","₱347","₱397"], a:1, e:"Convert percentage to decimal: 22 / 100 = 0.22. Multiply: 1350 × 0.22 = 297."},
{q:"Find the next number in the sequence: 5, 8, 11, 14, ___", o:["15","17","20","22"], a:1, e:"The sequence increases by a common difference of +3 per step. 14 + 3 = 17."},
{q:"Two numbers are in the ratio 2:4. If their sum is 114, what is the smaller number?", o:["33","38","48","53"], a:1, e:"Sum of ratio parts: 2 + 4 = 6. Value of 1 part: 114 / 6 = 19. Smaller part: 2 × 19 = 38."},
{q:"Solve for x: 2x + 5 = 19", o:["11","6","7","9"], a:2, e:"Subtract 5 from both sides: 2x = 14. Divide by 2: x = 7."},
{q:"What is 17% of ₱1,600?", o:["₱247","₱272","₱322","₱372"], a:1, e:"Convert percentage to decimal: 17 / 100 = 0.17. Multiply: 1600 × 0.17 = 272."},
{q:"Find the next number in the sequence: 5, 9, 13, 17, ___", o:["19","21","24","26"], a:1, e:"The sequence increases by a common difference of +4 per step. 17 + 4 = 21."},
{q:"Two numbers are in the ratio 4:5. If their sum is 216, what is the smaller number?", o:["106","111","91","96"], a:3, e:"Sum of ratio parts: 4 + 5 = 9. Value of 1 part: 216 / 9 = 24. Smaller part: 4 × 24 = 96."},
{q:"Solve for x: 2x + 10 = 22", o:["10","5","6","8"], a:2, e:"Subtract 10 from both sides: 2x = 12. Divide by 2: x = 6."},
{q:"What is 22% of ₱1,850?", o:["₱382","₱407","₱457","₱507"], a:1, e:"Convert percentage to decimal: 22 / 100 = 0.22. Multiply: 1850 × 0.22 = 407."},
{q:"Find the next number in the sequence: 5, 10, 15, 20, ___", o:["23","25","28","30"], a:1, e:"The sequence increases by a common difference of +5 per step. 20 + 5 = 25."},
{q:"Two numbers are in the ratio 3:6. If their sum is 261, what is the smaller number?", o:["102","82","87","97"], a:2, e:"Sum of ratio parts: 3 + 6 = 9. Value of 1 part: 261 / 9 = 29. Smaller part: 3 × 29 = 87."},
{q:"Solve for x: 2x + 5 = 15", o:["4","5","7","9"], a:1, e:"Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5."},
{q:"What is 17% of ₱2,100?", o:["₱332","₱357","₱407","₱457"], a:1, e:"Convert percentage to decimal: 17 / 100 = 0.17. Multiply: 2100 × 0.17 = 357."},
{q:"Two numbers are in the ratio 2:3. If their sum is 170, what is the smaller number?", o:["63","68","78","83"], a:1, e:"Sum of ratio parts: 2 + 3 = 5. Value of 1 part: 170 / 5 = 34. Smaller part: 2 × 34 = 68."},
{q:"Solve for x: 2x + 10 = 18", o:["3","4","6","8"], a:1, e:"Subtract 10 from both sides: 2x = 8. Divide by 2: x = 4."},
{q:"What is 22% of ₱2,350?", o:["₱492","₱517","₱567","₱617"], a:1, e:"Convert percentage to decimal: 22 / 100 = 0.22. Multiply: 2350 × 0.22 = 517."},
{q:"Two numbers are in the ratio 4:4. If their sum is 312, what is the smaller number?", o:["151","156","166","171"], a:1, e:"Sum of ratio parts: 4 + 4 = 8. Value of 1 part: 312 / 8 = 39. Smaller part: 4 × 39 = 156."},
{q:"Solve for x: 2x + 5 = 11", o:["2","3","5","7"], a:1, e:"Subtract 5 from both sides: 2x = 6. Divide by 2: x = 3."},
{q:"What is 17% of ₱2,600?", o:["₱417","₱442","₱492","₱542"], a:1, e:"Convert percentage to decimal: 17 / 100 = 0.17. Multiply: 2600 × 0.17 = 442."},
{q:"Two numbers are in the ratio 3:5. If their sum is 352, what is the smaller number?", o:["127","132","142","147"], a:1, e:"Sum of ratio parts: 3 + 5 = 8. Value of 1 part: 352 / 8 = 44. Smaller part: 3 × 44 = 132."},
{q:"What is 22% of ₱2,850?", o:["₱602","₱627","₱677","₱727"], a:1, e:"Convert percentage to decimal: 22 / 100 = 0.22. Multiply: 2850 × 0.22 = 627."},
{q:"Two numbers are in the ratio 2:6. If their sum is 392, what is the smaller number?", o:["108","113","93","98"], a:3, e:"Sum of ratio parts: 2 + 6 = 8. Value of 1 part: 392 / 8 = 49. Smaller part: 2 × 49 = 98."},
{q:"What is 17% of ₱3,100?", o:["₱502","₱527","₱577","₱627"], a:1, e:"Convert percentage to decimal: 17 / 100 = 0.17. Multiply: 3100 × 0.17 = 527."},
{q:"What is 22% of ₱3,350?", o:["₱712","₱737","₱787","₱837"], a:1, e:"Convert percentage to decimal: 22 / 100 = 0.22. Multiply: 3350 × 0.22 = 737."},
{q:"Two numbers are in the ratio 3:4. If their sum is 413, what is the smaller number?", o:["172","177","187","192"], a:1, e:"Sum of ratio parts: 3 + 4 = 7. Value of 1 part: 413 / 7 = 59. Smaller part: 3 × 59 = 177."},
{q:"What is 17% of ₱3,600?", o:["₱587","₱612","₱662","₱712"], a:1, e:"Convert percentage to decimal: 17 / 100 = 0.17. Multiply: 3600 × 0.17 = 612."},
{q:"Two numbers are in the ratio 2:5. If their sum is 448, what is the smaller number?", o:["123","128","138","143"], a:1, e:"Sum of ratio parts: 2 + 5 = 7. Value of 1 part: 448 / 7 = 64. Smaller part: 2 × 64 = 128."},
{q:"What is 22% of ₱3,850?", o:["₱822","₱847","₱897","₱947"], a:1, e:"Convert percentage to decimal: 22 / 100 = 0.22. Multiply: 3850 × 0.22 = 847."},
{q:"Two numbers are in the ratio 4:6. If their sum is 690, what is the smaller number?", o:["271","276","286","291"], a:1, e:"Sum of ratio parts: 4 + 6 = 10. Value of 1 part: 690 / 10 = 69. Smaller part: 4 × 69 = 276."},
{q:"What is 17% of ₱4,100?", o:["₱672","₱697","₱747","₱797"], a:1, e:"Convert percentage to decimal: 17 / 100 = 0.17. Multiply: 4100 × 0.17 = 697."},
{q:"Two numbers are in the ratio 3:3. If their sum is 444, what is the smaller number?", o:["217","222","232","237"], a:1, e:"Sum of ratio parts: 3 + 3 = 6. Value of 1 part: 444 / 6 = 74. Smaller part: 3 × 74 = 222."},
{q:"What is 22% of ₱4,350?", o:["₱1,007","₱1,057","₱932","₱957"], a:3, e:"Convert percentage to decimal: 22 / 100 = 0.22. Multiply: 4350 × 0.22 = 957."},
{q:"Two numbers are in the ratio 2:4. If their sum is 474, what is the smaller number?", o:["153","158","168","173"], a:1, e:"Sum of ratio parts: 2 + 4 = 6. Value of 1 part: 474 / 6 = 79. Smaller part: 2 × 79 = 158."},
{q:"What is 17% of ₱4,600?", o:["₱757","₱782","₱832","₱882"], a:1, e:"Convert percentage to decimal: 17 / 100 = 0.17. Multiply: 4600 × 0.17 = 782."},
{q:"Two numbers are in the ratio 4:5. If their sum is 756, what is the smaller number?", o:["331","336","346","351"], a:1, e:"Sum of ratio parts: 4 + 5 = 9. Value of 1 part: 756 / 9 = 84. Smaller part: 4 × 84 = 336."},
{q:"What is 22% of ₱4,850?", o:["₱1,042","₱1,067","₱1,117","₱1,167"], a:1, e:"Convert percentage to decimal: 22 / 100 = 0.22. Multiply: 4850 × 0.22 = 1067."},
{q:"Two numbers are in the ratio 3:6. If their sum is 801, what is the smaller number?", o:["262","267","277","282"], a:1, e:"Sum of ratio parts: 3 + 6 = 9. Value of 1 part: 801 / 9 = 89. Smaller part: 3 × 89 = 267."},
{q:"What is 17% of ₱5,100?", o:["₱842","₱867","₱917","₱967"], a:1, e:"Convert percentage to decimal: 17 / 100 = 0.17. Multiply: 5100 × 0.17 = 867."},
{q:"Two numbers are in the ratio 2:3. If their sum is 470, what is the smaller number?", o:["183","188","198","203"], a:1, e:"Sum of ratio parts: 2 + 3 = 5. Value of 1 part: 470 / 5 = 94. Smaller part: 2 × 94 = 188."},
{q:"What is 22% of ₱5,350?", o:["₱1,152","₱1,177","₱1,227","₱1,277"], a:1, e:"Convert percentage to decimal: 22 / 100 = 0.22. Multiply: 5350 × 0.22 = 1177."},
{q:"Two numbers are in the ratio 4:4. If their sum is 792, what is the smaller number?", o:["391","396","406","411"], a:1, e:"Sum of ratio parts: 4 + 4 = 8. Value of 1 part: 792 / 8 = 99. Smaller part: 4 × 99 = 396."},
{q:"What is 17% of ₱5,600?", o:["₱1,002","₱1,052","₱927","₱952"], a:3, e:"Convert percentage to decimal: 17 / 100 = 0.17. Multiply: 5600 × 0.17 = 952."},
{q:"Two numbers are in the ratio 3:5. If their sum is 832, what is the smaller number?", o:["307","312","322","327"], a:1, e:"Sum of ratio parts: 3 + 5 = 8. Value of 1 part: 832 / 8 = 104. Smaller part: 3 × 104 = 312."},
{q:"What is 22% of ₱5,850?", o:["₱1,262","₱1,287","₱1,337","₱1,387"], a:1, e:"Convert percentage to decimal: 22 / 100 = 0.22. Multiply: 5850 × 0.22 = 1287."},
{q:"Two numbers are in the ratio 2:6. If their sum is 872, what is the smaller number?", o:["213","218","228","233"], a:1, e:"Sum of ratio parts: 2 + 6 = 8. Value of 1 part: 872 / 8 = 109. Smaller part: 2 × 109 = 218."}
],
analytical:[
{q:"BOOK is to READING as FORK is to ___?", o:["Kitchen","Eating","Metal","Spoon"], a:1, e:"A book is the tool/object used for the activity of reading, just as a fork is the tool used for the activity of eating."},
{q:"Which word does NOT belong with the others?", o:["Apple","Banana","Carrot","Mango"], a:2, e:"Apple, banana, and mango are fruits, while a carrot is a vegetable — the odd one out."},
{q:"All Blicks are Razzies. All Razzies are Tazzies. Which statement must be true?", o:["All Blicks are Tazzies","All Tazzies are Blicks","No Blicks are Tazzies","Cannot be determined"], a:0, e:"By transitivity, if every Blick is a Razzie and every Razzie is a Tazzie, then every Blick must also be a Tazzie."},
{q:"DOCTOR is to HOSPITAL as TEACHER is to ___?", o:["Student","Book","School","Lesson"], a:2, e:"A doctor's primary workplace is a hospital, just as a teacher's primary workplace is a school."},
{q:"What letter completes the series: A, C, E, G, __?", o:["H","I","J","K"], a:1, e:"The series skips one letter each time (A,_B_,C,_D_,E...): after G comes I."},
{q:"If today is Wednesday, what day was it 10 days ago?", o:["Friday","Saturday","Sunday","Monday"], a:2, e:"10 days = 1 full week (7 days, same day) plus 3 more days back. Wednesday minus 3 days is Sunday."},
{q:"Which word does NOT belong with the others?", o:["Whisper","Shout","Yell","Chair"], a:3, e:"Whisper, shout, and yell are all ways of speaking; a chair is an object, unrelated to the group."},
{q:"All members who pay dues attend meetings. Jose attends meetings. Which conclusion is valid?", o:["Jose pays dues","Jose does not pay dues","It cannot be determined if Jose pays dues","Jose is not a member"], a:2, e:"Attending meetings doesn't confirm dues-paying, since others could attend for different reasons. This is a logical fallacy (affirming the consequent), so it cannot be determined."},
{q:"What number completes the series: 2, 6, 12, 20, 30, __?", o:["36","40","42","44"], a:2, e:"The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42."},
{q:"PEN is to WRITE as KNIFE is to ___?", o:["Sharp","Cut","Kitchen","Blade"], a:1, e:"A pen is the tool used to write, just as a knife is the tool used to cut."},
{q:"Which word does NOT belong with the others?", o:["Circle","Square","Triangle","Red"], a:3, e:"Circle, square, and triangle are shapes; red is a color, not a shape."},
{q:"No reptiles are mammals. All snakes are reptiles. Which conclusion is valid?", o:["All snakes are mammals","No snakes are mammals","Some snakes are mammals","Cannot be determined"], a:1, e:"Since no reptile is a mammal, and every snake is a reptile, it logically follows that no snake can be a mammal."},
{q:"A is B's father. B is C's mother. What is A's relationship to C?", o:["Uncle","Father","Grandfather","Brother"], a:2, e:"A is the father of B, and B is the mother of C, which makes A the grandfather of C."},
{q:"What letter completes the series: Z, Y, X, W, __?", o:["U","V","T","S"], a:1, e:"The series moves backward through the alphabet one letter at a time: after W comes V."},
{q:"DOCTOR is to PATIENT as LAWYER is to ___?", o:["Judge","Court","Client","Case"], a:2, e:"A doctor's professional relationship is with a patient, just as a lawyer's professional relationship is with a client."},
{q:"Some A are B. All B are C. Which conclusion is valid?", o:["Some A are C","All A are C","No A are C","Cannot be determined"], a:0, e:"Since some A belong to B, and all B belong to C, those same A must also belong to C — so some A are C."},
{q:"Which word does NOT belong with the others?", o:["Triangle","Square","Pentagon","Circle"], a:3, e:"Triangle, square, and pentagon are polygons with straight sides; a circle has no straight sides or fixed number of sides."},
{q:"What number completes the series: 5, 10, 20, 40, __?", o:["60","70","80","90"], a:2, e:"Each term doubles the one before it: 40 × 2 = 80."},
{q:"AUTHOR is to BOOK as COMPOSER is to ___?", o:["Music","Orchestra","Piano","Concert"], a:0, e:"An author creates a book, just as a composer creates a piece of music."},
{q:"What letter completes the series: B, D, F, H, __?", o:["I","J","K","L"], a:1, e:"The series skips one letter each time: after H comes J."},
{q:"Which animal does NOT belong with the others: Eagle, Sparrow, Bat, Ostrich?", o:["Eagle","Sparrow","Bat","Ostrich"], a:2, e:"Eagle, sparrow, and ostrich are all birds; a bat is a mammal, making it the odd one out."},
{q:"THERMOMETER is to TEMPERATURE as BAROMETER is to ___?", o:["Pressure","Humidity","Wind","Altitude"], a:0, e:"A thermometer measures temperature, just as a barometer measures atmospheric pressure."},
{q:"If it rains, the ground gets wet. The ground is wet. Which conclusion is valid?", o:["It rained","It did not rain","It cannot be determined if it rained","It will rain"], a:2, e:"The ground could be wet for other reasons (like a sprinkler), so rain cannot be confirmed just because the ground is wet."},
{q:"A clock shows 4:00. What is the angle between the hour and minute hands?", o:["100°","110°","120°","130°"], a:2, e:"Each hour mark is 30° apart (360°÷12). At 4:00 the hands are 4 marks apart: 4 × 30° = 120°."},
{q:"Pointing to a photo, a man says, 'She is the daughter of my mother's only son.' If the man has no brothers, who is she to him?", o:["His sister","His daughter","His niece","His cousin"], a:1, e:"His mother's only son is himself, so 'the daughter of my mother's only son' is his own daughter."}
],
verbal:[
{q:"Choose the correct verb: 'Neither the manager nor the employees ___ present.'", o:["was","were","is","has been"], a:1, e:"With 'neither/nor,' the verb agrees with the subject closer to it — 'employees' (plural) — so 'were' is correct."},
{q:"Which word is closest in meaning to 'meticulous'?", o:["Careless","Careful","Hasty","Confused"], a:1, e:"Meticulous means showing great attention to detail, which is closest to 'careful.'"},
{q:"Which word is most nearly opposite to 'benevolent'?", o:["Kind","Generous","Malevolent","Gentle"], a:2, e:"Benevolent means kind and well-meaning; its opposite is malevolent, meaning having harmful intent."},
{q:"Choose the correctly written sentence.", o:["She don't like coffee.","She doesn't likes coffee.","She doesn't like coffee.","She not like coffee."], a:2, e:"With third-person singular subjects, the auxiliary 'doesn't' pairs with the base verb form: 'doesn't like.'"},
{q:"Choose the correct preposition: 'He is good ___ mathematics.'", o:["in","at","for","with"], a:1, e:"The standard idiomatic preposition after 'good' when referring to a skill or subject is 'at.'"},
{q:"Choose the correctly used word: '___ going to the market later.'", o:["Their","There","They're","Its"], a:2, e:"'They're' is the contraction of 'they are,' which fits the sentence; 'their' shows possession and 'there' indicates place."},
{q:"What is the passive voice of: 'The manager approved the report'?", o:["The report approved the manager.","The report was approved by the manager.","The manager was approving the report.","The report has approved the manager."], a:1, e:"In passive voice, the object becomes the subject: 'The report was approved by the manager.'"},
{q:"What is the correct plural form of 'criterion'?", o:["Criterions","Criteria","Criterias","Criterion's"], a:1, e:"'Criterion' is a Greek-origin word whose irregular plural is 'criteria.'"},
{q:"Which word is closest in meaning to 'ubiquitous'?", o:["Rare","Hidden","Widespread","Temporary"], a:2, e:"Ubiquitous means found everywhere, which is closest in meaning to 'widespread.'"},
{q:"Choose the correct verb: 'Each of the students ___ required to submit a report.'", o:["are","is","were","have been"], a:1, e:"'Each' is singular, so it takes the singular verb 'is,' even though 'students' (plural) follows it."},
{q:"What does the idiom 'bite the bullet' mean?", o:["To eat quickly","To avoid a problem","To endure a painful situation bravely","To argue fiercely"], a:2, e:"'Bite the bullet' means to face a difficult or unpleasant situation with courage."},
{q:"Which word is spelled correctly?", o:["Recieve","Receive","Receeve","Receve"], a:1, e:"The correct spelling follows the rule 'i before e except after c' is an exception here — it is actually 'receive' (e before i after c)."},
{q:"Choose the best conjunction: 'She was tired, ___ she finished the report.'", o:["so","but","because","or"], a:1, e:"'But' correctly shows the contrast between being tired and still finishing the task."},
{q:"Which word is most nearly opposite to 'frugal'?", o:["Thrifty","Economical","Extravagant","Modest"], a:2, e:"Frugal means careful with spending; its opposite, extravagant, means spending excessively."},
{q:"Choose the correctly written sentence.", o:["Between you and I, the plan will fail.","Between you and me, the plan will fail.","Between you and myself, the plan will fail.","Between yourself and I, the plan will fail."], a:1, e:"'Between' is a preposition and takes object pronouns, so 'me' is correct rather than 'I.'"},
{q:"Which word is most nearly opposite to 'candid'?", o:["Honest","Direct","Deceptive","Blunt"], a:2, e:"Candid means open and truthful; its opposite is deceptive, meaning misleading or dishonest."},
{q:"Choose the correct tense: 'By next year, I ___ from college.'", o:["will graduate","have graduated","will have graduated","am graduating"], a:2, e:"The future perfect tense 'will have graduated' correctly describes an action that will be completed before a specific future time."},
{q:"Choose the correct word: 'The medicine had a positive ___ on his health.'", o:["affect","effect","effected","affected"], a:1, e:"'Effect' (noun) means a result; 'affect' is typically used as a verb meaning to influence. The sentence needs the noun form."},
{q:"Choose the correct comparative form: 'This problem is more ___ than the last one.'", o:["difficulter","difficult","most difficult","difficultly"], a:1, e:"Multi-syllable adjectives like 'difficult' use 'more' + the base form rather than an '-er' ending."},
{q:"Which word is closest in meaning to 'diligent'?", o:["Lazy","Hardworking","Careless","Slow"], a:1, e:"Diligent describes someone who works with care and steady effort, closest to 'hardworking.'"},
{q:"Read the passage: 'The Code of Conduct and Ethical Standards for Public Officials and Employees (R.A. No. 6713) was enacted to promote a high standard of ethics in public service. It requires government workers to act with patriotism, justice, and sincerity, and to lead modest lives. The law also mandates the annual submission of a Statement of Assets, Liabilities, and Net Worth (SALN). Violations may result in administrative or criminal liability, depending on the gravity of the offense.' What is the primary purpose of R.A. 6713?", o:["To regulate government salaries","To promote high ethical standards in public service","To create new government agencies","To reduce the number of public employees"], a:1, e:"The passage states the law 'was enacted to promote a high standard of ethics in public service.'"},
{q:"Based on the same passage above, what annual document must public officials submit?", o:["Income Tax Return","Performance Review","Statement of Assets, Liabilities, and Net Worth (SALN)","Certificate of Employment"], a:2, e:"The passage explicitly states the law 'mandates the annual submission of a Statement of Assets, Liabilities, and Net Worth (SALN).'"},
{q:"Based on the same passage, what kind of life does the Code require public officials to lead?", o:["A modest life","A private life","A public life","A comfortable life"], a:0, e:"The passage states officials are required 'to lead modest lives.'"},
{q:"Based on the same passage, what may result from violations of the Code?", o:["Only a verbal warning","Automatic dismissal only","Administrative or criminal liability","No consequence unless repeated"], a:2, e:"The passage states violations 'may result in administrative or criminal liability, depending on the gravity of the offense.'"},
{q:"Based on the same passage, which value is NOT mentioned as required of public officials?", o:["Patriotism","Justice","Sincerity","Wealth accumulation"], a:3, e:"The passage lists patriotism, justice, and sincerity as required values; wealth accumulation is not mentioned and in fact contradicts the requirement to lead a modest life."}
],
general:[
{q:"In what year was the current Philippine Constitution ratified?", o:["1973","1981","1987","1992"], a:2, e:"The 1987 Constitution was ratified via plebiscite on February 2, 1987, following the EDSA Revolution."},
{q:"How many branches of government exist under the 1987 Constitution?", o:["Two","Three","Four","Five"], a:1, e:"There are three branches: Executive, Legislative, and Judicial, following the principle of separation of powers."},
{q:"How many members compose the Philippine Senate?", o:["12","24","48","250"], a:1, e:"The Philippine Senate is composed of 24 Senators elected at large."},
{q:"What is the term of office of a Philippine Senator?", o:["3 years","4 years","6 years","5 years"], a:2, e:"Senators serve a term of 6 years and may serve a maximum of two consecutive terms."},
{q:"What is the term of office of a member of the House of Representatives?", o:["2 years","3 years","4 years","6 years"], a:1, e:"Members of the House of Representatives serve a term of 3 years, renewable for up to three consecutive terms."},
{q:"What is the term of office of the President of the Philippines?", o:["4 years, renewable once","6 years, single term only","5 years, renewable once","6 years, renewable once"], a:1, e:"The President serves a single 6-year term and is constitutionally barred from re-election."},
{q:"Which branch of government has the power to declare a law unconstitutional?", o:["Executive","Legislative","Judiciary","Local Government"], a:2, e:"The Judiciary, through the Supreme Court, exercises judicial review to determine the constitutionality of laws."},
{q:"R.A. 6713 is also known as what?", o:["The Local Government Code","The Code of Conduct and Ethical Standards for Public Officials and Employees","The Administrative Code","The Civil Service Reform Act"], a:1, e:"R.A. 6713 is officially titled the Code of Conduct and Ethical Standards for Public Officials and Employees."},
{q:"Under R.A. 6713, what document must public officials declare regarding their finances?", o:["Income Tax Return","Statement of Assets, Liabilities, and Net Worth (SALN)","Bank Statement","Payroll Record"], a:1, e:"R.A. 6713 requires the annual filing of a Statement of Assets, Liabilities, and Net Worth (SALN)."},
{q:"Who has the constitutional power to grant pardons in the Philippines?", o:["The Chief Justice","The Senate President","The President","The Ombudsman"], a:2, e:"The Constitution vests the power of executive clemency, including pardons, in the President."},
{q:"How many Justices sit on the Philippine Supreme Court?", o:["9","11","15","21"], a:2, e:"The Supreme Court is composed of a Chief Justice and 14 Associate Justices, totaling 15."},
{q:"The 1987 Constitution declares the Philippines to be what kind of state?", o:["A monarchy","A democratic and republican state","A federal state","A theocratic state"], a:1, e:"Article II, Section 1 declares the Philippines to be a democratic and republican State."},
{q:"Which article of the 1987 Constitution contains the Bill of Rights?", o:["Article II","Article III","Article VI","Article VIII"], a:1, e:"Article III of the 1987 Constitution enumerates the Bill of Rights."},
{q:"What is the minimum age requirement to become President of the Philippines?", o:["35 years old","40 years old","45 years old","50 years old"], a:1, e:"The Constitution requires a presidential candidate to be at least 40 years old on election day."},
{q:"What is the minimum age requirement to become a Senator?", o:["25 years old","30 years old","35 years old","40 years old"], a:2, e:"A candidate for Senator must be at least 35 years old on election day."},
{q:"According to the Constitution, where does sovereignty reside?", o:["In the President","In Congress","In the people","In the Supreme Court"], a:2, e:"Article II, Section 1 states sovereignty resides in the people, and all government authority emanates from them."},
{q:"The principle of separation of Church and State is found in which part of the Constitution?", o:["Article II, Section 6","Article III, Section 1","Article V, Section 2","Article XIV, Section 1"], a:0, e:"Article II, Section 6 states: 'The separation of Church and State shall be inviolable.'"},
{q:"Which of the following are levels of local government units in the Philippines?", o:["Provinces, cities, municipalities, and barangays","Regions, districts, and wards","States, counties, and towns","Provinces and territories only"], a:0, e:"Philippine local government is structured into provinces, cities, municipalities, and barangays."},
{q:"What is the primary role of the Civil Service Commission (CSC)?", o:["To collect national taxes","To administer the civil service and ensure merit and fitness in government employment","To prosecute criminal cases","To manage foreign affairs"], a:1, e:"The CSC is the central personnel agency tasked with administering the civil service system based on merit and fitness."},
{q:"What is the constitutional basis for civil service in the Philippines primarily found under?", o:["Article IX-B","Article VII","Article X","Article XII"], a:0, e:"Article IX-B of the 1987 Constitution establishes and governs the Civil Service Commission."},
{q:"What does the 'merit and fitness' principle in civil service appointments mean?", o:["Appointments are based on political connections","Appointments are based on seniority alone","Appointments are based on qualifications and competence, not political influence","Appointments are made randomly"], a:2, e:"The merit and fitness principle requires that government appointments be based on qualifications and competence rather than political patronage."},
{q:"What is the national language of the Philippines as declared in the Constitution?", o:["English","Spanish","Filipino","Tagalog"], a:2, e:"Article XIV, Section 6 declares Filipino as the national language of the Philippines."},
{q:"In the Philippine flag, what does the color blue symbolize?", o:["Valor","Peace and truth","Equality","Unity"], a:1, e:"In the Philippine flag, blue represents peace, truth, and justice."},
{q:"In the Philippine flag, what does the white triangle symbolize?", o:["Wealth","Equality and liberty","Bravery","Sovereignty"], a:1, e:"The white triangle represents equality and liberty, and is also associated with the Katipunan."},
{q:"What do the three stars on the Philippine flag represent?", o:["The three branches of government","Luzon, Visayas, and Mindanao","Freedom, justice, and equality","The three founders of the Katipunan"], a:1, e:"The three five-pointed stars represent the three main island groups: Luzon, Visayas, and Mindanao."}
]
};

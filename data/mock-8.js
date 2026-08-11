/* =========================================================
   DATA FILE: Mock Exam 8 Question Bank (15 items)
   =========================================================
   Original source: 2013_cse_reviewer.html (Number Analogy, Number Series, Problem Solving, Vocabulary, Word Analogy, General Info)

   HOW IT'S USED:
   buildMockExam(8) in app.js takes ALL 15 items below,
   shuffles their order and each question's answer choices fresh
   on every attempt. Unlike the leveled exams (bank.js), this is
   NOT a shared pool — every item here is used every time.

   Unlock order: Mock Exam 8 unlocks after passing Mock Exam 7.
   Passing this exam unlocks Mock Exam 9.

   HOW TO EDIT:
   - Each question is one object: { cat, q, opts, correct, exp }
       cat     = "numerical" | "analytical" | "verbal" | "general"
                 (must be lowercase, must be one of these 4 exact
                 strings — this is the app's internal category key,
                 already mapped from the original source's own
                 category names during import)
       q       = the question text
       opts    = array of answer choices
       correct = index (0-based) of the correct answer in "opts"
       exp     = explanation shown after answering
   - To add a question: copy an existing {...} block, edit it, and
     make sure it's comma-separated from its neighbors.
   - To remove a question: delete its {...} block and the extra
     comma left behind.
   ========================================================= */

const MOCK_BANK_8 = [{"cat":"numerical","q":"0.75 is to 3/4 as 0.8 is to:","opts":["2/3","4/5","5/6","6/7","3/5"],"correct":1,"exp":"0.75 is equal to 3/4. To find the answer, convert 0.80 into fraction form: 80/100 = 8/10 = 4/5."},{"cat":"numerical","q":"Series: 4.16, 5.25, 6.36, 7.49, 8.64, ___","opts":["9.36","9.80","8.81","9.81","7.72"],"correct":3,"exp":"The progression of differences increases by .02 each time: 1.09, 1.11, 1.13, 1.15. The next difference is 1.17. 8.64 + 1.17 = 9.81."},{"cat":"numerical","q":"Series: 5, 6, 10, 19, 35, 60, ___","opts":["98","96","36","86","72"],"correct":1,"exp":"The differences are perfect squares: 1, 4, 9, 16, 25. The next difference is 6^2 (36). 60 + 36 = 96."},{"cat":"numerical","q":"Which has the greatest numerical value?","opts":["3/8","5/6","3/4","1/3","2/3"],"correct":1,"exp":"Converting to decimals: 3/8=0.375, 5/6=0.833, 3/4=0.75, 1/3=0.333, 2/3=0.666. 0.833 is the highest."},{"cat":"numerical","q":"Standard numerical value for 3.54 x 10^5?","opts":["35,400","0.000354","354,000","0.00354","3,540,000"],"correct":2,"exp":"Multiply 10 by itself 5 times (100,000) and multiply by 3.54. This moves the decimal point 5 steps to the right."},{"cat":"numerical","q":"Which has the least numerical value?","opts":["6+3x4","4+3x6","4x6+3","3x6+4","3+6x4"],"correct":0,"exp":"Applying MDAS: 6+(3x4)=18. This is lower than the others (22, 27)."},{"cat":"verbal","q":"ABRADES means:","opts":["To wear away by friction","To build up","To shine","To smooth","To stabilize"],"correct":0,"exp":"Defined as wearing away by friction or wearing down in spirit."},{"cat":"verbal","q":"DURESS means:","opts":["Freedom","Compulsion by threat","Voluntary action","Happiness","Wealth"],"correct":1,"exp":"Duress refers to compulsion by threat or restraint."},{"cat":"verbal","q":"IMMOLATE means:","opts":["To honor","To kill as a sacrificial victim","To create","To steal","To hide"],"correct":1,"exp":"To kill as a sacrificial victim."},{"cat":"verbal","q":"OPULENCE means:","opts":["Sickly","Wealthy","Disease","Poverty","Unfortunate"],"correct":1,"exp":"Opulence is defined as being wealthy."},{"cat":"analytical","q":"Happiness is to Prosperity as Condolence is to:","opts":["Loneliness","Awkward","Contend","Reginess","Vigorous"],"correct":0,"exp":"Word relationship analogy."},{"cat":"analytical","q":"Gun is to Holster as Sword is to:","opts":["Pistol","Cadet","Slay","Scabbard","War"],"correct":3,"exp":"A holster holds a gun; a scabbard holds a sword."},{"cat":"analytical","q":"Bilingual is to Language as Bicameral is to:","opts":["Legislative","Representation","Authority","Council","Taxation"],"correct":0,"exp":"Bicameral refers to a legislative body with two chambers."},{"cat":"general","q":"Ground for Impeachment of President and Vice President?","opts":["Sexual harassment","Heinous crime","Grave abuse of authority","Graft and corruption","Culpable violation of Constitution"],"correct":4,"exp":"Culpable violation of the Constitution is a primary ground for impeachment."},{"cat":"general","q":"Largest vote to impeach the President starts in the:","opts":["House of Senate","House of Congress","Cabinet","Ombudsman","Supreme Court"],"correct":1,"exp":"The impeachment process begins in the House of Congress."}];

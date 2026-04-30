import { useEffect, useRef, useState, useCallback } from "react";

const ADMIN_PIN = '1235';
const CRICAPI_KEY = '7b21d228-1705-49c5-a590-08d8a9a49edd';
const IPL_2026_SERIES_ID = '87c62aac-bc3c-4738-ab93-19da0690488f';
const COLORS = ['#FFD700','#00BFFF','#FF6B00','#00E676','#7C4DFF','#FF4081','#69F0AE','#EA80FC'];
const PHASE2_FROM_MATCH = 36;
const POINTS = { run:1, wicket:25, catch:5 };
const MARQUEE_MULTIPLIER = 1.5;

const OWNERS = [
  { id:1, name:'Kaustubh',  color:COLORS[0], marquee:['Yashasvi Jaiswal','Shreyas Iyer','Hardik Pandya'] },
  { id:2, name:'Maitreya',  color:COLORS[1], marquee:['Jos Buttler','Travis Head','Sanju Samson'] },
  { id:3, name:'Milanjeet', color:COLORS[2], marquee:['Abhishek Sharma','Arshdeep Singh','Ruturaj Gaikwad'] },
  { id:4, name:'Aayush',    color:COLORS[3], marquee:['Jasprit Bumrah','Quinton de Kock','Varun Chakaravarthy'] },
  { id:5, name:'Pare',      color:COLORS[4], marquee:['KL Rahul','Nicholas Pooran','Shubman Gill'] },
  { id:6, name:'Jayant',    color:COLORS[5], marquee:['Sai Sudharsan','Ravindra Jadeja','Trent Boult'] },
  { id:7, name:'Khera',     color:COLORS[6], marquee:['Suryakumar Yadav','Mitchell Marsh','Philip Salt'] },
  { id:8, name:'Ashutosh',  color:COLORS[7], marquee:['Virat Kohli','Aiden Markram','Ishan Kishan'] },
];

const PHASE2_OWNERS = [
  { id:1, name:'Kaustubh',  color:COLORS[0], marquee:['Prabhsimran Singh','KL Rahul','Arshdeep Singh'] },
  { id:2, name:'Maitreya',  color:COLORS[1], marquee:['Ravi Bishnoi','Heinrich Klaasen','Travis Head'] },
  { id:3, name:'Milanjeet', color:COLORS[2], marquee:['Abhishek Sharma','Vaibhav Sooryavanshi','Jamie Overton'] },
  { id:4, name:'Aayush',    color:COLORS[3], marquee:['MS Dhoni','Sanju Samson','Shreyas Iyer'] },
  { id:5, name:'Pare',      color:COLORS[4], marquee:['Josh Hazlewood','Dhruv Jurel','Priyansh Arya'] },
  { id:6, name:'Jayant',    color:COLORS[5], marquee:['Shubman Gill','Kagiso Rabada','Pat Cummins'] },
  { id:7, name:'Khera',     color:COLORS[6], marquee:['Bhuvneshwar Kumar','Ishan Kishan','Virat Kohli'] },
  { id:8, name:'Ashutosh',  color:COLORS[7], marquee:['Jos Buttler','Yashasvi Jaiswal','Jofra Archer'] },
];

// ── PHASE 1 PLAYERS (M1-M35) ──
const PLAYERS = [
  {name:'Yashasvi Jaiswal',ipl:'RR',cost:8.6,owner:1,role:'BAT'},{name:'Vaibhav Sooryavanshi',ipl:'RR',cost:6.6,owner:1,role:'BAT'},
  {name:'Prabhsimran Singh',ipl:'PBKS',cost:4.0,owner:1,role:'WK'},{name:'Rohit Sharma',ipl:'MI',cost:7.4,owner:1,role:'BAT'},
  {name:'Shreyas Iyer',ipl:'PBKS',cost:20.5,owner:1,role:'BAT'},{name:'Hardik Pandya',ipl:'MI',cost:6.2,owner:1,role:'AR'},
  {name:'Salil Arora',ipl:'SRH',cost:0.2,owner:1,role:'BOWL'},{name:'Vipraj Nigam',ipl:'DC',cost:1.8,owner:1,role:'AR'},
  {name:'Yuzvendra Chahal',ipl:'PBKS',cost:10.5,owner:1,role:'BOWL'},{name:'Mohammed Siraj',ipl:'GT',cost:3.0,owner:1,role:'BOWL'},
  {name:'Ravi Bishnoi',ipl:'RR',cost:6.6,owner:1,role:'BOWL'},{name:'Mayank Markande',ipl:'MI',cost:5.2,owner:1,role:'BOWL'},
  {name:'Mayank Yadav',ipl:'LSG',cost:4.4,owner:1,role:'BOWL'},{name:'Nandre Burger',ipl:'RR',cost:2.0,owner:1,role:'BOWL'},
  {name:'Arjun Tendulkar',ipl:'LSG',cost:0.6,owner:1,role:'BOWL'},{name:'Rasikh Salam Dar',ipl:'RCB',cost:6.0,owner:1,role:'BOWL'},
  {name:'Jos Buttler',ipl:'GT',cost:19.5,owner:2,role:'WK'},{name:'Ayush Badoni',ipl:'LSG',cost:4.8,owner:2,role:'BAT'},
  {name:'Shubham Dubey',ipl:'RR',cost:1.4,owner:2,role:'AR'},{name:'Travis Head',ipl:'SRH',cost:20.5,owner:2,role:'BAT'},
  {name:'T Natarajan',ipl:'DC',cost:7.8,owner:2,role:'BOWL'},{name:'Cameron Green',ipl:'KKR',cost:9.4,owner:2,role:'AR'},
  {name:'Rashid Khan',ipl:'GT',cost:4.6,owner:2,role:'BOWL'},{name:'Kartik Tyagi',ipl:'KKR',cost:1.2,owner:2,role:'BOWL'},
  {name:'Deepak Chahar',ipl:'MI',cost:5.2,owner:2,role:'BOWL'},{name:'Sanju Samson',ipl:'CSK',cost:17.5,owner:2,role:'WK'},
  {name:'Shahbaz Ahmed',ipl:'LSG',cost:0.4,owner:2,role:'AR'},{name:'Marcus Stoinis',ipl:'PBKS',cost:2.2,owner:2,role:'AR'},
  {name:'Kartik Sharma',ipl:'CSK',cost:0.6,owner:2,role:'BAT'},{name:'Kagiso Rabada',ipl:'GT',cost:1.2,owner:2,role:'BOWL'},
  {name:'Rinku Singh',ipl:'KKR',cost:1.0,owner:2,role:'BAT'},{name:'Venkatesh Iyer',ipl:'RCB',cost:1.0,owner:2,role:'AR'},
  {name:'Abhishek Sharma',ipl:'SRH',cost:18.5,owner:3,role:'BAT'},{name:'Ruturaj Gaikwad',ipl:'CSK',cost:4.6,owner:3,role:'BAT'},
  {name:'Ryan Rickelton',ipl:'MI',cost:1.0,owner:3,role:'WK'},{name:'Pathum Nissanka',ipl:'DC',cost:1.0,owner:3,role:'BAT'},
  {name:'Naman Dhir',ipl:'MI',cost:1.6,owner:3,role:'BAT'},{name:'Tristan Stubbs',ipl:'DC',cost:1.0,owner:3,role:'BAT'},
  {name:'Shimron Hetmyer',ipl:'RR',cost:1.0,owner:3,role:'BAT'},{name:'Rajat Patidar',ipl:'RCB',cost:2.8,owner:3,role:'BAT'},
  {name:'Nitish Kumar Reddy',ipl:'SRH',cost:4.4,owner:3,role:'AR'},{name:'Marco Jansen',ipl:'PBKS',cost:8.0,owner:3,role:'AR'},
  {name:'Axar Patel',ipl:'DC',cost:1.0,owner:3,role:'AR'},{name:'Pat Cummins',ipl:'SRH',cost:5.0,owner:3,role:'AR'},
  {name:'Arshdeep Singh',ipl:'PBKS',cost:7.0,owner:3,role:'BOWL'},{name:'Kuldeep Yadav',ipl:'DC',cost:11.0,owner:3,role:'BOWL'},
  {name:'Prasidh Krishna',ipl:'GT',cost:4.0,owner:3,role:'BOWL'},{name:'Shivang Kumar',ipl:'SRH',cost:0.2,owner:3,role:'BOWL'},
  {name:'Ishant Sharma',ipl:'GT',cost:1.0,owner:4,role:'BOWL'},{name:'Harpreet Brar',ipl:'PBKS',cost:5.0,owner:4,role:'AR'},
  {name:'Corbin Bosch',ipl:'MI',cost:1.0,owner:4,role:'AR'},{name:'Azmatullah Omarzai',ipl:'PBKS',cost:7.2,owner:4,role:'AR'},
  {name:'Dewald Brevis',ipl:'CSK',cost:9.6,owner:4,role:'BAT'},{name:'Sandeep Sharma',ipl:'RR',cost:0.2,owner:4,role:'BOWL'},
  {name:'Jaydev Unadkat',ipl:'SRH',cost:8.2,owner:4,role:'BOWL'},{name:'Tushar Deshpande',ipl:'RR',cost:7.2,owner:4,role:'BOWL'},
  {name:'Jasprit Bumrah',ipl:'MI',cost:16.5,owner:4,role:'BOWL'},{name:'Shashank Singh',ipl:'PBKS',cost:5.4,owner:4,role:'BAT'},
  {name:'Quinton de Kock',ipl:'MI',cost:8.2,owner:4,role:'WK'},{name:'Glenn Phillips',ipl:'GT',cost:5.2,owner:4,role:'WK'},
  {name:'Vignesh Puthur',ipl:'RR',cost:0.2,owner:4,role:'BOWL'},{name:'Cooper Connolly',ipl:'PBKS',cost:5.2,owner:4,role:'AR'},
  {name:'Varun Chakaravarthy',ipl:'KKR',cost:19.5,owner:4,role:'BOWL'},{name:'Prashant Veer',ipl:'CSK',cost:0.4,owner:4,role:'BOWL'},
  {name:'Aniket Verma',ipl:'SRH',cost:4.0,owner:5,role:'BAT'},{name:'Auqib Nabi Dar',ipl:'DC',cost:4.0,owner:5,role:'BOWL'},
  {name:'Sherfane Rutherford',ipl:'MI',cost:5.0,owner:5,role:'BAT'},{name:'Prince Yadav',ipl:'LSG',cost:0.2,owner:5,role:'BAT'},
  {name:'Zeeshan Ansari',ipl:'SRH',cost:4.2,owner:5,role:'BOWL'},{name:'Yudhvir Singh Charak',ipl:'RR',cost:0.4,owner:5,role:'BOWL'},
  {name:'KL Rahul',ipl:'DC',cost:19.0,owner:5,role:'WK'},{name:'Nicholas Pooran',ipl:'LSG',cost:10.5,owner:5,role:'WK'},
  {name:'Romario Shepherd',ipl:'RCB',cost:6.4,owner:5,role:'AR'},{name:'Josh Hazlewood',ipl:'RCB',cost:4.6,owner:5,role:'BOWL'},
  {name:'Riyan Parag',ipl:'RR',cost:3.6,owner:5,role:'AR'},{name:'Matt Henry',ipl:'CSK',cost:3.0,owner:5,role:'BOWL'},
  {name:'Nitish Rana',ipl:'DC',cost:3.8,owner:5,role:'BAT'},{name:'Shubman Gill',ipl:'GT',cost:22.0,owner:5,role:'BAT'},
  {name:'Lungi Ngidi',ipl:'DC',cost:4.8,owner:5,role:'BOWL'},{name:'Ayush Mhatre',ipl:'CSK',cost:4.5,owner:5,role:'BAT'},
  {name:'Priyansh Arya',ipl:'PBKS',cost:10.5,owner:6,role:'BAT'},{name:'Sai Sudharsan',ipl:'GT',cost:18.5,owner:6,role:'BAT'},
  {name:'Vaibhav Arora',ipl:'KKR',cost:6.0,owner:6,role:'BOWL'},{name:'Tilak Varma',ipl:'MI',cost:5.8,owner:6,role:'BAT'},
  {name:'Avesh Khan',ipl:'LSG',cost:6.4,owner:6,role:'BOWL'},{name:'Rishabh Pant',ipl:'LSG',cost:10.5,owner:6,role:'WK'},
  {name:'Ashutosh Sharma',ipl:'DC',cost:1.2,owner:6,role:'AR'},{name:'Krunal Pandya',ipl:'RCB',cost:9.2,owner:6,role:'AR'},
  {name:'Ravindra Jadeja',ipl:'RR',cost:4.0,owner:6,role:'AR'},{name:'Rahul Tewatia',ipl:'GT',cost:3.2,owner:6,role:'AR'},
  {name:'Ravisrinivasan Sai Kishore',ipl:'GT',cost:6.4,owner:6,role:'BOWL'},{name:'Harshal Patel',ipl:'SRH',cost:4.4,owner:6,role:'BOWL'},
  {name:'Trent Boult',ipl:'MI',cost:13.0,owner:6,role:'BOWL'},{name:'Digvesh Rathi',ipl:'LSG',cost:0.4,owner:6,role:'BOWL'},
  {name:'Mangesh Yadav',ipl:'RCB',cost:0.2,owner:6,role:'BOWL'},
  {name:'Suryakumar Yadav',ipl:'MI',cost:19.5,owner:7,role:'BAT'},{name:'Abishek Porel',ipl:'DC',cost:7.0,owner:7,role:'WK'},
  {name:'Heinrich Klaasen',ipl:'SRH',cost:12.0,owner:7,role:'WK'},{name:'Shivam Dube',ipl:'CSK',cost:11.0,owner:7,role:'AR'},
  {name:'Mukesh Kumar',ipl:'DC',cost:2.2,owner:7,role:'BOWL'},{name:'Nehal Wadhera',ipl:'PBKS',cost:6.8,owner:7,role:'BAT'},
  {name:'Mitchell Marsh',ipl:'LSG',cost:13.5,owner:7,role:'AR'},{name:'Bhuvneshwar Kumar',ipl:'RCB',cost:5.8,owner:7,role:'BOWL'},
  {name:'Jitesh Sharma',ipl:'RCB',cost:6.2,owner:7,role:'WK'},{name:'Philip Salt',ipl:'RCB',cost:8.4,owner:7,role:'WK'},
  {name:'Devdutt Padikkal',ipl:'RCB',cost:4.2,owner:7,role:'BAT'},{name:'Abdul Samad',ipl:'LSG',cost:0.2,owner:7,role:'BAT'},
  {name:'Krains Fuletra',ipl:'SRH',cost:0.2,owner:7,role:'BOWL'},{name:'Tim Seifert',ipl:'KKR',cost:1.0,owner:7,role:'WK'},
  {name:'Jacob Bethell',ipl:'RCB',cost:1.4,owner:7,role:'AR'},{name:'Sameer Rizvi',ipl:'DC',cost:0.6,owner:7,role:'BAT'},
  {name:'Virat Kohli',ipl:'RCB',cost:22.5,owner:8,role:'BAT'},{name:'Aiden Markram',ipl:'LSG',cost:16.0,owner:8,role:'BAT'},
  {name:'Ishan Kishan',ipl:'SRH',cost:19.5,owner:8,role:'WK'},{name:'Angkrish Raghuvanshi',ipl:'KKR',cost:8.8,owner:8,role:'BAT'},
  {name:'Mohsin Khan',ipl:'LSG',cost:0.6,owner:8,role:'BOWL'},{name:'Ajinkya Rahane',ipl:'KKR',cost:8.6,owner:8,role:'BAT'},
  {name:'Ramandeep Singh',ipl:'KKR',cost:1.6,owner:8,role:'AR'},{name:'Finn Allen',ipl:'KKR',cost:10.0,owner:8,role:'WK'},
  {name:'Mohammed Shami',ipl:'LSG',cost:5.0,owner:8,role:'BOWL'},{name:'Washington Sundar',ipl:'GT',cost:2.4,owner:8,role:'AR'},
  {name:'Suyash Sharma',ipl:'RCB',cost:0.4,owner:8,role:'BOWL'},{name:'Sunil Narine',ipl:'KKR',cost:2.4,owner:8,role:'AR'},
  {name:'Dhruv Jurel',ipl:'RR',cost:1.0,owner:8,role:'WK'},{name:'Noor Ahmad',ipl:'CSK',cost:1.0,owner:8,role:'BOWL'},
  {name:'Harsh Dubey',ipl:'SRH',cost:0.2,owner:8,role:'BOWL'},
];

// ── PHASE 2 PLAYERS (M36+) — all names verified against official IPL 2026 squads ──
const PHASE2_PLAYERS = [
  // KAUSTUBH (1)
  {name:'Prabhsimran Singh',ipl:'PBKS',cost:4.0,owner:1,role:'WK'},{name:'KL Rahul',ipl:'DC',cost:19.0,owner:1,role:'WK'},
  {name:'Ajinkya Rahane',ipl:'KKR',cost:8.6,owner:1,role:'BAT'},{name:'Tristan Stubbs',ipl:'DC',cost:1.0,owner:1,role:'BAT'},
  {name:'Josh Inglis',ipl:'LSG',cost:8.6,owner:1,role:'WK'},{name:'Donovan Ferreira',ipl:'RR',cost:1.0,owner:1,role:'AR'},
  {name:'Salil Arora',ipl:'SRH',cost:0.2,owner:1,role:'BOWL'},{name:'Aniket Verma',ipl:'SRH',cost:4.0,owner:1,role:'BAT'},
  {name:'Mukul Choudhary',ipl:'LSG',cost:2.6,owner:1,role:'BOWL'},{name:'Sakib Hussain',ipl:'SRH',cost:0.2,owner:1,role:'BOWL'},
  {name:'Rashid Khan',ipl:'GT',cost:4.6,owner:1,role:'BOWL'},{name:'Kuldeep Yadav',ipl:'DC',cost:11.0,owner:1,role:'BOWL'},
  {name:'Prince Yadav',ipl:'LSG',cost:0.2,owner:1,role:'BAT'},{name:'Mohammed Siraj',ipl:'GT',cost:3.0,owner:1,role:'BOWL'},
  {name:'Nandre Burger',ipl:'RR',cost:2.0,owner:1,role:'BOWL'},{name:'Arshdeep Singh',ipl:'PBKS',cost:7.0,owner:1,role:'BOWL'},
  // MAITREYA (2)
  {name:'Ruturaj Gaikwad',ipl:'CSK',cost:4.6,owner:2,role:'BAT'},{name:'Sarfaraz Khan',ipl:'CSK',cost:1.0,owner:2,role:'BAT'},
  {name:'Ashutosh Sharma',ipl:'DC',cost:1.2,owner:2,role:'AR'},{name:'Glenn Phillips',ipl:'GT',cost:5.2,owner:2,role:'WK'},
  {name:'Shahrukh Khan',ipl:'GT',cost:1.0,owner:2,role:'BAT'},{name:'Rinku Singh',ipl:'KKR',cost:1.0,owner:2,role:'BAT'},
  {name:'Cameron Green',ipl:'KKR',cost:9.4,owner:2,role:'AR'},{name:'Vaibhav Arora',ipl:'KKR',cost:6.0,owner:2,role:'BOWL'},
  {name:'Mitchell Marsh',ipl:'LSG',cost:13.5,owner:2,role:'AR'},{name:'Ayush Badoni',ipl:'LSG',cost:4.8,owner:2,role:'BAT'},
  {name:'Naman Dhir',ipl:'MI',cost:1.6,owner:2,role:'BAT'},{name:'Marcus Stoinis',ipl:'PBKS',cost:2.2,owner:2,role:'AR'},
  {name:'Tushar Deshpande',ipl:'RR',cost:7.2,owner:2,role:'BOWL'},{name:'Ravi Bishnoi',ipl:'RR',cost:6.6,owner:2,role:'BOWL'},
  {name:'Heinrich Klaasen',ipl:'SRH',cost:12.0,owner:2,role:'WK'},{name:'Travis Head',ipl:'SRH',cost:20.5,owner:2,role:'BAT'},
  // MILANJEET (3)
  {name:'Abhishek Sharma',ipl:'SRH',cost:18.5,owner:3,role:'BAT'},{name:'Nitish Kumar Reddy',ipl:'SRH',cost:4.4,owner:3,role:'AR'},
  {name:'Axar Patel',ipl:'DC',cost:1.0,owner:3,role:'AR'},{name:'Prasidh Krishna',ipl:'GT',cost:4.0,owner:3,role:'BOWL'},
  {name:'Romario Shepherd',ipl:'RCB',cost:6.4,owner:3,role:'AR'},{name:'Gurjapneet Singh',ipl:'CSK',cost:1.0,owner:3,role:'BOWL'},
  {name:'Vaibhav Sooryavanshi',ipl:'RR',cost:6.6,owner:3,role:'BAT'},{name:'Ashwani Kumar',ipl:'MI',cost:1.0,owner:3,role:'BOWL'},
  {name:'Brijesh Sharma',ipl:'RR',cost:1.0,owner:3,role:'BOWL'},{name:'Kyle Jamieson',ipl:'DC',cost:2.0,owner:3,role:'AR'},
  {name:'AM Ghazanfar',ipl:'MI',cost:1.0,owner:3,role:'BOWL'},{name:'Jamie Overton',ipl:'CSK',cost:1.0,owner:3,role:'AR'},
  {name:'Aiden Markram',ipl:'LSG',cost:16.0,owner:3,role:'BAT'},{name:'Jason Holder',ipl:'GT',cost:1.0,owner:3,role:'AR'},
  {name:'Shardul Thakur',ipl:'MI',cost:1.0,owner:3,role:'AR'},{name:'Abishek Porel',ipl:'DC',cost:7.0,owner:3,role:'WK'},
  // AAYUSH (4)
  {name:'Jitesh Sharma',ipl:'RCB',cost:6.2,owner:4,role:'WK'},{name:'Jasprit Bumrah',ipl:'MI',cost:16.5,owner:4,role:'BOWL'},
  {name:'David Miller',ipl:'DC',cost:2.0,owner:4,role:'BAT'},{name:'Shimron Hetmyer',ipl:'RR',cost:1.0,owner:4,role:'BAT'},
  {name:'Will Jacks',ipl:'MI',cost:1.0,owner:4,role:'AR'},{name:'Hardik Pandya',ipl:'MI',cost:6.2,owner:4,role:'AR'},
  {name:'MS Dhoni',ipl:'CSK',cost:1.0,owner:4,role:'WK'},{name:'Cooper Connolly',ipl:'PBKS',cost:5.2,owner:4,role:'AR'},
  {name:'Varun Chakaravarthy',ipl:'KKR',cost:19.5,owner:4,role:'BOWL'},{name:'Quinton de Kock',ipl:'MI',cost:8.2,owner:4,role:'WK'},
  {name:'Akeal Hosein',ipl:'CSK',cost:1.0,owner:4,role:'BOWL'},{name:'Nehal Wadhera',ipl:'PBKS',cost:6.8,owner:4,role:'BAT'},
  {name:'Sanju Samson',ipl:'CSK',cost:17.5,owner:4,role:'WK'},{name:'Shreyas Iyer',ipl:'PBKS',cost:20.5,owner:4,role:'BAT'},
  {name:'Yuzvendra Chahal',ipl:'PBKS',cost:10.5,owner:4,role:'BOWL'},{name:'Vipraj Nigam',ipl:'DC',cost:1.8,owner:4,role:'AR'},
  // PARE (5)
  {name:'Josh Hazlewood',ipl:'RCB',cost:4.6,owner:5,role:'BOWL'},{name:'Riyan Parag',ipl:'RR',cost:3.6,owner:5,role:'AR'},
  {name:'Avesh Khan',ipl:'LSG',cost:6.4,owner:5,role:'BOWL'},{name:'Xavier Bartlett',ipl:'PBKS',cost:1.0,owner:5,role:'BOWL'},
  {name:'Rishabh Pant',ipl:'LSG',cost:10.5,owner:5,role:'WK'},{name:'Sameer Rizvi',ipl:'DC',cost:0.6,owner:5,role:'BAT'},
  {name:'Lungi Ngidi',ipl:'DC',cost:4.8,owner:5,role:'BOWL'},{name:'Rasikh Salam Dar',ipl:'RCB',cost:6.0,owner:5,role:'BOWL'},
  {name:'Nitish Rana',ipl:'DC',cost:3.8,owner:5,role:'BAT'},{name:'Marco Jansen',ipl:'PBKS',cost:8.0,owner:5,role:'AR'},
  {name:'Philip Salt',ipl:'RCB',cost:8.4,owner:5,role:'WK'},{name:'Tilak Varma',ipl:'MI',cost:5.8,owner:5,role:'BAT'},
  {name:'Mitchell Starc',ipl:'DC',cost:1.0,owner:5,role:'BOWL'},{name:'Priyansh Arya',ipl:'PBKS',cost:10.5,owner:5,role:'BAT'},
  {name:'Dhruv Jurel',ipl:'RR',cost:1.0,owner:5,role:'WK'},{name:'Urvil Patel',ipl:'CSK',cost:1.0,owner:5,role:'WK'},
  // JAYANT (6)
  {name:'Krunal Pandya',ipl:'RCB',cost:9.2,owner:6,role:'AR'},{name:'Ravindra Jadeja',ipl:'RR',cost:4.0,owner:6,role:'AR'},
  {name:'Vijaykumar Vyshak',ipl:'PBKS',cost:1.0,owner:6,role:'BOWL'},{name:'Ashok Sharma',ipl:'GT',cost:1.0,owner:6,role:'BOWL'},
  {name:'T Natarajan',ipl:'DC',cost:7.8,owner:6,role:'BOWL'},{name:'Mohsin Khan',ipl:'LSG',cost:0.6,owner:6,role:'BOWL'},
  {name:'Shivang Kumar',ipl:'SRH',cost:0.2,owner:6,role:'BOWL'},{name:'Shashank Singh',ipl:'PBKS',cost:5.4,owner:6,role:'BAT'},
  {name:'Shubman Gill',ipl:'GT',cost:22.0,owner:6,role:'BAT'},{name:'Sai Sudharsan',ipl:'GT',cost:18.5,owner:6,role:'BAT'},
  {name:'Rohit Sharma',ipl:'MI',cost:7.4,owner:6,role:'BAT'},{name:'Nicholas Pooran',ipl:'LSG',cost:10.5,owner:6,role:'WK'},
  {name:'Dewald Brevis',ipl:'CSK',cost:9.6,owner:6,role:'BAT'},{name:'Kagiso Rabada',ipl:'GT',cost:1.2,owner:6,role:'BOWL'},
  {name:'Pat Cummins',ipl:'SRH',cost:5.0,owner:6,role:'AR'},
  // KHERA (7)
  {name:'Devdutt Padikkal',ipl:'RCB',cost:4.2,owner:7,role:'BAT'},{name:'Mukesh Kumar',ipl:'DC',cost:2.2,owner:7,role:'BOWL'},
  {name:'Suryakumar Yadav',ipl:'MI',cost:19.5,owner:7,role:'BAT'},{name:'Jacob Bethell',ipl:'RCB',cost:1.4,owner:7,role:'AR'},
  {name:'Shivam Dube',ipl:'CSK',cost:11.0,owner:7,role:'AR'},{name:'Tim David',ipl:'RCB',cost:1.0,owner:7,role:'BAT'},
  {name:'Ishan Kishan',ipl:'SRH',cost:19.5,owner:7,role:'WK'},{name:'Washington Sundar',ipl:'GT',cost:2.4,owner:7,role:'AR'},
  {name:'Digvesh Rathi',ipl:'LSG',cost:0.4,owner:7,role:'BOWL'},{name:'Rajat Patidar',ipl:'RCB',cost:2.8,owner:7,role:'BAT'},
  {name:'Akash Madhwal',ipl:'CSK',cost:1.0,owner:7,role:'BOWL'},{name:'Arshad Khan',ipl:'GT',cost:1.0,owner:7,role:'BOWL'},
  {name:'Tim Seifert',ipl:'KKR',cost:1.0,owner:7,role:'WK'},{name:'Bhuvneshwar Kumar',ipl:'RCB',cost:5.8,owner:7,role:'BOWL'},
  {name:'Virat Kohli',ipl:'RCB',cost:22.5,owner:7,role:'BAT'},{name:'Mukesh Choudhary',ipl:'CSK',cost:1.0,owner:7,role:'BOWL'},
  // ASHUTOSH (8)
  {name:'Harsh Dubey',ipl:'SRH',cost:0.2,owner:8,role:'BOWL'},{name:'Suyash Sharma',ipl:'RCB',cost:0.4,owner:8,role:'BOWL'},
  {name:'Sunil Narine',ipl:'KKR',cost:2.4,owner:8,role:'AR'},{name:'Rovman Powell',ipl:'KKR',cost:1.0,owner:8,role:'BAT'},
  {name:'Kartik Tyagi',ipl:'KKR',cost:1.2,owner:8,role:'BOWL'},{name:'Anshul Kamboj',ipl:'CSK',cost:1.0,owner:8,role:'BOWL'},
  {name:'Mohammed Shami',ipl:'LSG',cost:5.0,owner:8,role:'BOWL'},{name:'Noor Ahmad',ipl:'CSK',cost:1.0,owner:8,role:'BOWL'},
  {name:'Danish Malewar',ipl:'MI',cost:0.3,owner:8,role:'BAT'},{name:'Anukul Roy',ipl:'KKR',cost:1.0,owner:8,role:'AR'},
  {name:'Eshan Malinga',ipl:'SRH',cost:1.0,owner:8,role:'BOWL'},{name:'Praful Hinge',ipl:'SRH',cost:0.3,owner:8,role:'BOWL'},
  {name:'Angkrish Raghuvanshi',ipl:'KKR',cost:8.8,owner:8,role:'BAT'},{name:'Jos Buttler',ipl:'GT',cost:19.5,owner:8,role:'WK'},
  {name:'Yashasvi Jaiswal',ipl:'RR',cost:8.6,owner:8,role:'BAT'},{name:'Jofra Archer',ipl:'RR',cost:1.0,owner:8,role:'BOWL'},
];

const P1_NAMES_SET=new Set(PLAYERS.map(p=>p.name.toLowerCase()));
const P2_NAMES_SET=new Set(PHASE2_PLAYERS.map(p=>p.name.toLowerCase()));
const ALL_PLAYER_NAMES_SET=new Set([...P1_NAMES_SET,...P2_NAMES_SET]);
const EXCLUDED_API_NAMES=new Set(['jacob duffy','jacob g duffy','rahul chahar','khaleel ahmed','gurnoor brar','harshit rana']);

type ScoreEntry={runs:number;wickets:number;catches:number;stumpings:number;matchPts:number[]};
type Scores=Record<string,ScoreEntry>;
type UnsoldEntry={name:string;runs:number;wickets:number;catches:number;stumpings:number};
type ActiveView='leaderboard'|'teams'|'auction'|'progress'|'rawstats';
type MatchMeta={id:string;name:string;date:string;matchNum:number};
type OwnerType=typeof OWNERS[0];
type PhaseView='full'|'phase1'|'phase2';

function getPlayerConfig(mn:number){return mn>=PHASE2_FROM_MATCH?PHASE2_PLAYERS:PLAYERS;}
function getOwnerConfig(mn:number){return mn>=PHASE2_FROM_MATCH?PHASE2_OWNERS:OWNERS;}
function isMarqueeForMatch(name:string,mn:number){return getOwnerConfig(mn).some(o=>o.marquee.includes(name));}
function unsoldPts(e:UnsoldEntry){return e.runs*POINTS.run+e.wickets*POINTS.wicket+(e.catches+e.stumpings)*POINTS.catch;}
function ownerById(id:number):OwnerType|undefined{return OWNERS.find(o=>o.id===id);}
function p2OwnerById(id:number){return PHASE2_OWNERS.find(o=>o.id===id);}

function teamPts(ownerId:number,scores:Scores,phase:PhaseView='full'):number{
  // phase1: M1–M35 points for Phase 1 squad only
  const p1=PLAYERS.filter(p=>p.owner===ownerId).reduce((s,p)=>{const sc=scores[p.name];return s+(sc?sc.matchPts.slice(0,PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0):0);},0);
  // phase2: M36+ points for Phase 2 squad only
  const p2=PHASE2_PLAYERS.filter(p=>p.owner===ownerId).reduce((s,p)=>{const sc=scores[p.name];return s+(sc?sc.matchPts.slice(PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0):0);},0);
  if(phase==='phase1')return p1;
  if(phase==='phase2')return p2;
  return p1+p2; // full = phase1 + phase2, always consistent
}
function sortedTeams(scores:Scores){return[...OWNERS].sort((a,b)=>teamPts(b.id,scores,'full')-teamPts(a.id,scores,'full'));}

function extractMatchNumber(name:string):number{
  const m=name.match(/(\d+)(?:st|nd|rd|th)\s+match/i);if(m)return parseInt(m[1],10);
  const m2=name.match(/match\s+(\d+)/i);if(m2)return parseInt(m2[1],10);return 9999;
}

function fuzzyMatch(apiName:string|null|undefined,matchNum:number):string|null{
  if(!apiName)return null;
  const al=apiName.toLowerCase().replace(/[^a-z .]/g,'').trim();
  if(EXCLUDED_API_NAMES.has(al))return null;
  const el=getPlayerConfig(matchNum);
  let f=el.find(p=>p.name.toLowerCase()===al);if(f)return f.name;
  const ap=al.split(' ').filter(Boolean);
  if(ap.length>=2){
    const af=ap[0],alast=ap[ap.length-1];
    f=el.find(p=>{const pts=p.name.toLowerCase().replace(/[^a-z .]/g,'').split(' ').filter(Boolean);return pts.length>=2&&pts[0]===af&&pts[pts.length-1]===alast;});
    if(f)return f.name;
  }
  const sub=el.filter(p=>{const our=p.name.toLowerCase().replace(/[^a-z .]/g,'');return our.includes(al)||al.includes(our);});
  if(sub.length===1)return sub[0].name;
  if(ap.length>=1){const alast=ap[ap.length-1];const lm=el.filter(p=>{const pts=p.name.toLowerCase().replace(/[^a-z .]/g,'').split(' ').filter(Boolean);return pts[pts.length-1]===alast;});if(lm.length===1)return lm[0].name;}
  return null;
}

const SC_PREFIX='ipl26_sc_';const META_KEY='ipl26_match_metas';
const SCORES_KEY='ipl26_scores_v3';const UNSOLD_KEY='ipl26_unsold_v3';
function getCachedRaw(id:string):unknown{try{const v=localStorage.getItem(SC_PREFIX+id);return v?JSON.parse(v):null;}catch{return null;}}
function setCachedRaw(id:string,d:unknown){try{localStorage.setItem(SC_PREFIX+id,JSON.stringify(d));}catch{}}
function getCachedScores():Scores|null{try{const v=localStorage.getItem(SCORES_KEY);return v?JSON.parse(v):null;}catch{return null;}}
function setCachedScores(s:Scores){try{localStorage.setItem(SCORES_KEY,JSON.stringify(s));}catch{}}
function getCachedUnsold():UnsoldEntry[]|null{try{const v=localStorage.getItem(UNSOLD_KEY);return v?JSON.parse(v):null;}catch{return null;}}
function setCachedUnsold(u:UnsoldEntry[]){try{localStorage.setItem(UNSOLD_KEY,JSON.stringify(u));}catch{}}
function getCachedMetas():MatchMeta[]|null{try{const v=localStorage.getItem(META_KEY);return v?JSON.parse(v):null;}catch{return null;}}
function setCachedMetas(m:MatchMeta[]){try{localStorage.setItem(META_KEY,JSON.stringify(m));}catch{}}
function clearAllCache(){Object.keys(localStorage).filter(k=>k.startsWith(SC_PREFIX)||k===META_KEY||k===SCORES_KEY||k===UNSOLD_KEY).forEach(k=>localStorage.removeItem(k));}
function initScores():Scores{const s:Scores={};new Set([...PLAYERS,...PHASE2_PLAYERS].map(p=>p.name)).forEach(n=>{s[n]={runs:0,wickets:0,catches:0,stumpings:0,matchPts:[]};});return s;}

const TRACKS=[{id:'o6HZYvPPNGo',title:'Korbo Lorbo Jeetbo Re'},{id:'Dv_jwKBNMkQ',title:'IPL Anthem — Shor Macha'},{id:'jLJb1KQLR0Q',title:'Tunna Tunna — Cricket 07'}];
declare global{interface Window{YT:{Player:new(id:string,opts:object)=>YTPlayer;PlayerState:{PLAYING:number;PAUSED:number;ENDED:number}};onYouTubeIframeAPIReady?:()=>void;}}
interface YTPlayer{playVideo():void;pauseVideo():void;loadVideoById(id:string):void;setVolume(v:number):void;}

export default function App(){
  const [scores,setScores]=useState<Scores>(()=>getCachedScores()||initScores());
  const [unsoldPlayers,setUnsoldPlayers]=useState<UnsoldEntry[]>(()=>getCachedUnsold()||[]);
  const [matchMetas,setMatchMetas]=useState<MatchMeta[]>(()=>getCachedMetas()||[]);
  const [activeView,setActiveView]=useState<ActiveView>('leaderboard');
  const [activeFilter,setActiveFilter]=useState('ALL');
  const [playerPhase,setPlayerPhase]=useState<PhaseView>('full');
  const [teamsPhase,setTeamsPhase]=useState<PhaseView>('full');
  const [rawPhase,setRawPhase]=useState<PhaseView>('phase1');
  const [searchQuery,setSearchQuery]=useState('');
  const [matchesPlayed,setMatchesPlayed]=useState(()=>getCachedMetas()?.length||0);
  const [isAdmin,setIsAdmin]=useState(sessionStorage.getItem('auctionAdmin')==='1');
  const [apiStatus,setApiStatus]=useState<{state:'idle'|'ok'|'err'|'loading',msg:string}>({state:getCachedScores()?'ok':'idle',msg:getCachedScores()?`✓ Cached · ${getCachedMetas()?.length||0} matches`:'Click Refresh to sync'});
  const [showPinModal,setShowPinModal]=useState(false);
  const [pinInput,setPinInput]=useState('');
  const [pinError,setPinError]=useState('');
  const [modal,setModal]=useState<{title:string;body:string}|null>(null);
  const [toast,setToast]=useState<{msg:string;show:boolean}>({msg:'',show:false});
  const toastRef=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [rawTeam,setRawTeam]=useState(1);
  const [mobileNavOpen,setMobileNavOpen]=useState(false);
  const [currentTrack,setCurrentTrack]=useState(0);
  const [isPlaying,setIsPlaying]=useState(false);
  const [volume,setVolumeState]=useState(70);
  const [musicCollapsed,setMusicCollapsed]=useState(true);
  const ytRef=useRef<YTPlayer|null>(null);
  const ytReady=useRef(false);
  const pendingPlay=useRef(false);
  const skipCount=useRef(0);
  const skipCooldown=useRef(false);
  const autoSyncDone=useRef(false);

  function showToast(msg:string){setToast({msg,show:true});if(toastRef.current)clearTimeout(toastRef.current);toastRef.current=setTimeout(()=>setToast(t=>({...t,show:false})),3500);}

  useEffect(()=>{if(autoSyncDone.current)return;autoSyncDone.current=true;autoSync();},[]);

  async function autoSync(){
    try{
      const r=await fetch(`https://api.cricapi.com/v1/series_info?apikey=${CRICAPI_KEY}&id=${IPL_2026_SERIES_ID}`);
      const d=await r.json();if(d.status!=='success')return;
      const completed=(d.data?.matchList||[]).filter((m:any)=>m.matchStarted&&m.matchEnded).sort((a:any,b:any)=>{const na=extractMatchNumber(a.name||''),nb=extractMatchNumber(b.name||'');if(na!==nb)return na-nb;return new Date(a.dateTimeGMT||0).getTime()-new Date(b.dateTimeGMT||0).getTime();});
      const cachedIds=new Set(Object.keys(localStorage).filter(k=>k.startsWith(SC_PREFIX)).map(k=>k.replace(SC_PREFIX,'')));
      const missing=completed.filter((m:any)=>!cachedIds.has(m.id));
      const metas:MatchMeta[]=completed.map((m:any,i:number)=>({id:m.id,name:m.name||'Match',date:m.date||'',matchNum:extractMatchNumber(m.name||'')||i+1}));
      const validCompleted=completed.filter((m:any)=>{const c=getCachedRaw(m.id) as any;return Array.isArray(c)&&c.length>0;});if(missing.length===0){setMatchMetas(metas);setMatchesPlayed(validCompleted.length);setCachedMetas(metas);await reprocess(completed,metas);return;}
      setApiStatus({state:'loading',msg:`Fetching ${missing.length} new match${missing.length>1?'es':''}…`});
      for(const match of missing){const res=await fetch(`https://api.cricapi.com/v1/match_scorecard?apikey=${CRICAPI_KEY}&id=${match.id}`);const md=await res.json();const sc=md.data?.scorecard||[];if(md.status==='success'&&sc.length>0)setCachedRaw(match.id,sc);await new Promise(r=>setTimeout(r,300));}
      setMatchMetas(metas);setMatchesPlayed(completed.length);setCachedMetas(metas);
      await reprocess(completed,metas);showToast(`✓ ${missing.length} new match${missing.length>1?'es':''} synced`);
    }catch{}
  }

  async function reprocess(completed:any[],metas:MatchMeta[]){
    let sc:Scores=initScores();const unsoldMap:Record<string,UnsoldEntry>={};
    for(let i=0;i<completed.length;i++){const card=getCachedRaw(completed[i].id) as any[]|null;if(!card||!Array.isArray(card)||card.length===0)continue;sc=processMatch(card,sc,unsoldMap,metas[i]?.matchNum||i+1).scores;}
    setScores(sc);setCachedScores(sc);
    const ul=Object.values(unsoldMap).sort((a,b)=>unsoldPts(b)-unsoldPts(a));setUnsoldPlayers(ul);setCachedUnsold(ul);
    setApiStatus({state:'ok',msg:`✓ Synced · ${completed.length} matches · ${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}`});
  }

  function processMatch(scorecard:any[],cs:Scores,unsoldMap:Record<string,UnsoldEntry>,matchNum:number):{scores:Scores}{
    const us={...cs};Object.keys(us).forEach(k=>{us[k]={...us[k],matchPts:[...us[k].matchPts]};});
    const mPts:Record<string,number>={};
    scorecard.forEach((inn:any)=>{
      (inn.batting||[]).forEach((b:any)=>{
        const n=b.batsman?.name;const m=fuzzyMatch(n,matchNum);
        if(m&&us[m]){us[m].runs+=(b.r||0);mPts[m]=(mPts[m]||0)+(b.r||0)*POINTS.run;}
        else if(n){const l=n.toLowerCase();if(!EXCLUDED_API_NAMES.has(l)&&!ALL_PLAYER_NAMES_SET.has(l)){const c=n.trim();if(!unsoldMap[c])unsoldMap[c]={name:c,runs:0,wickets:0,catches:0,stumpings:0};unsoldMap[c].runs+=(b.r||0);}}
      });
      (inn.bowling||[]).forEach((bw:any)=>{
        const n=bw.bowler?.name;const m=fuzzyMatch(n,matchNum);
        if(m&&us[m]){us[m].wickets+=(bw.w||0);mPts[m]=(mPts[m]||0)+(bw.w||0)*POINTS.wicket;}
        else if(n){const l=n.toLowerCase();if(!EXCLUDED_API_NAMES.has(l)&&!ALL_PLAYER_NAMES_SET.has(l)){const c=n.trim();if(!unsoldMap[c])unsoldMap[c]={name:c,runs:0,wickets:0,catches:0,stumpings:0};unsoldMap[c].wickets+=(bw.w||0);}}
      });
      // CATCHING ARRAY ONLY — sole authoritative fielding source, no double counting
      (inn.catching||[]).forEach((c:any)=>{
        const n=c.catcher?.name;const m=fuzzyMatch(n,matchNum);
        if(m&&us[m]){us[m].catches+=(c.catch||0);us[m].stumpings+=(c.stumped||0);mPts[m]=(mPts[m]||0)+((c.catch||0)+(c.stumped||0))*POINTS.catch;}
        else if(n){const l=n.toLowerCase();if(!EXCLUDED_API_NAMES.has(l)&&!ALL_PLAYER_NAMES_SET.has(l)){const c2=n.trim();if(!unsoldMap[c2])unsoldMap[c2]={name:c2,runs:0,wickets:0,catches:0,stumpings:0};unsoldMap[c2].catches+=(c.catch||0);unsoldMap[c2].stumpings+=(c.stumped||0);}}
      });
    });
    // Bake marquee multiplier into matchPts at processing time
    Object.keys(us).forEach(name=>{const base=mPts[name]||0;us[name].matchPts.push(isMarqueeForMatch(name,matchNum)?Math.round(base*MARQUEE_MULTIPLIER):base);});
    return{scores:us};
  }

  async function handleFullResync(){
    clearAllCache();setApiStatus({state:'loading',msg:'Full resync…'});showToast('Resyncing all matches…');
    try{
      const r=await fetch(`https://api.cricapi.com/v1/series_info?apikey=${CRICAPI_KEY}&id=${IPL_2026_SERIES_ID}`);
      const d=await r.json();if(d.status!=='success')throw new Error(d.reason||'API error');
      const completed=(d.data?.matchList||[]).filter((m:any)=>m.matchStarted&&m.matchEnded).sort((a:any,b:any)=>{const na=extractMatchNumber(a.name||''),nb=extractMatchNumber(b.name||'');if(na!==nb)return na-nb;return new Date(a.dateTimeGMT||0).getTime()-new Date(b.dateTimeGMT||0).getTime();});
      const metas:MatchMeta[]=completed.map((m:any,i:number)=>({id:m.id,name:m.name||'Match',date:m.date||'',matchNum:extractMatchNumber(m.name||'')||i+1}));
      setMatchesPlayed(completed.length);setMatchMetas(metas);setCachedMetas(metas);
      for(let i=0;i<completed.length;i++){setApiStatus({state:'loading',msg:`Fetching M${i+1}/${completed.length}…`});const res=await fetch(`https://api.cricapi.com/v1/match_scorecard?apikey=${CRICAPI_KEY}&id=${completed[i].id}`);const md=await res.json();const sc2=md.data?.scorecard||[];if(md.status==='success'&&sc2.length>0)setCachedRaw(completed[i].id,sc2);await new Promise(r=>setTimeout(r,300));}
      await reprocess(completed,metas);showToast(`✓ Full resync complete · ${completed.length} matches`);
    }catch(err:unknown){const msg=err instanceof Error?err.message:'Check key';setApiStatus({state:'err',msg:'Resync failed · '+msg});showToast('✗ '+msg);}
  }
  async function handleRefresh(){setApiStatus({state:'loading',msg:'Checking for new matches…'});await autoSync();}

  useEffect(()=>{
    if(document.getElementById('yt-api-script'))return;
    const tag=document.createElement('script');tag.id='yt-api-script';tag.src='https://www.youtube.com/iframe_api';document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady=()=>{
      ytRef.current=new window.YT.Player('yt-player',{height:'1',width:'1',videoId:TRACKS[0].id,playerVars:{autoplay:0,controls:0,disablekb:1,fs:0,rel:0,modestbranding:1,origin:window.location.origin},events:{
        onReady:(e:{target:YTPlayer})=>{ytReady.current=true;e.target.setVolume(volume);if(pendingPlay.current){e.target.playVideo();pendingPlay.current=false;}},
        onStateChange:(e:{data:number})=>{if(e.data===window.YT.PlayerState.PLAYING){setIsPlaying(true);skipCount.current=0;}else if(e.data===window.YT.PlayerState.PAUSED||e.data===window.YT.PlayerState.ENDED)setIsPlaying(false);if(e.data===window.YT.PlayerState.ENDED){setCurrentTrack(t=>{const next=(t+1)%TRACKS.length;setTimeout(()=>doTrack(next),100);return next;});}},
        onError:(e:{data:number})=>{if(e.data!==100&&e.data!==101&&e.data!==150)return;if(skipCooldown.current)return;skipCooldown.current=true;skipCount.current++;setIsPlaying(false);if(skipCount.current>=TRACKS.length){skipCount.current=0;skipCooldown.current=false;showToast('Music unavailable');return;}showToast('Track unavailable — skipping…');setCurrentTrack(t=>{const next=(t+1)%TRACKS.length;setTimeout(()=>{skipCooldown.current=false;doTrack(next);},1500);return next;});}
      }});
    };
  },[]);

  function doTrack(i:number){setCurrentTrack(i);if(ytReady.current&&ytRef.current){ytRef.current.loadVideoById(TRACKS[i].id);ytRef.current.setVolume(volume);setIsPlaying(true);}}
  function togglePlay(){if(!ytReady.current){pendingPlay.current=true;showToast('Player loading…');return;}if(isPlaying)ytRef.current?.pauseVideo();else ytRef.current?.playVideo();}
  function handleVolumeChange(v:number){setVolumeState(v);if(ytReady.current&&ytRef.current)ytRef.current.setVolume(v);}
  const apDone=useRef(false);
  useEffect(()=>{function h(){if(apDone.current)return;apDone.current=true;document.removeEventListener('click',h);if(ytReady.current&&ytRef.current&&!isPlaying)ytRef.current.playVideo();else pendingPlay.current=true;}document.addEventListener('click',h);return()=>document.removeEventListener('click',h);},[]);

  function toggleAdmin(){if(isAdmin){setIsAdmin(false);sessionStorage.removeItem('auctionAdmin');showToast('Admin mode off');}else{setPinInput('');setPinError('');setShowPinModal(true);}}
  function checkPin(){if(pinInput===ADMIN_PIN){setIsAdmin(true);sessionStorage.setItem('auctionAdmin','1');setShowPinModal(false);showToast('✓ Admin mode on');}else{setPinError('Incorrect PIN');setPinInput('');}}

  function mqBadge(ph2=false){return ph2?`<span style="display:inline-flex;align-items:center;background:rgba(124,77,255,0.12);border:1px solid rgba(124,77,255,0.35);border-radius:3px;padding:1px 5px;font-size:8px;font-weight:700;letter-spacing:1.5px;color:#7C4DFF;margin-left:5px;vertical-align:middle;white-space:nowrap">⚡ PH2</span>`:`<span style="display:inline-flex;align-items:center;background:rgba(57,255,20,0.12);border:1px solid rgba(57,255,20,0.35);border-radius:3px;padding:1px 5px;font-size:8px;font-weight:700;letter-spacing:1.5px;color:#39FF14;margin-left:5px;vertical-align:middle;white-space:nowrap">⚡ MARQUEE</span>`;}
  function esc(s:string){return s.replace(/'/g,"\\'");}

  function getTeamCumulative(ownerId:number):number[]{
    const p1Names=PLAYERS.filter(p=>p.owner===ownerId).map(p=>p.name);
    const p2Names=PHASE2_PLAYERS.filter(p=>p.owner===ownerId).map(p=>p.name);
    const allNames=new Set([...p1Names,...p2Names]);
    const maxLen=Math.max(...[...allNames].map(n=>(scores[n]?.matchPts||[]).length),0);
    if(!maxLen)return[];
    const cum:number[]=[]; let run=0;
    for(let i=0;i<maxLen;i++){
      const isP2=i>=PHASE2_FROM_MATCH-1;
      const activeNames=isP2?p2Names:p1Names;
      let mt=0;activeNames.forEach(n=>{mt+=(scores[n]?.matchPts||[])[i]||0;});
      run+=mt;cum.push(run);
    }
    return cum;
  }

  const allUniq=[...new Map([...PLAYERS,...PHASE2_PLAYERS].map(p=>[p.name,p])).values()];
  const ranked=sortedTeams(scores);
  const topTeam=ranked[0];
  const topPts=teamPts(topTeam.id,scores,'full');
  const topP=allUniq.reduce((b,p)=>{const bp=(scores[b.name]?.matchPts||[]).reduce((a,x)=>a+x,0);const pp=(scores[p.name]?.matchPts||[]).reduce((a,x)=>a+x,0);return pp>bp?p:b;},allUniq[0]);

  function getMVP(){return allUniq.filter(p=>p.cost>0).map(p=>{const pts=(scores[p.name]?.matchPts||[]).reduce((a,b)=>a+b,0);const owner=ownerById(p.owner);const ratio=pts>0?(pts/(p.cost/100)):0;return{p,pts,ratio,owner};}).sort((a,b)=>b.ratio-a.ratio).slice(0,15);}

  function openPlayerModal(name:string){
    const p=PLAYERS.find(x=>x.name===name)||PHASE2_PLAYERS.find(x=>x.name===name);if(!p)return;
    const p2e=PHASE2_PLAYERS.find(x=>x.name===name);
    const own=ownerById(p.owner);const p2own=p2e?p2OwnerById(p2e.owner):null;
    const s=scores[name]||{runs:0,wickets:0,catches:0,stumpings:0,matchPts:[]};
    const tot=s.matchPts.reduce((a,b)=>a+b,0);
    const p1pts=s.matchPts.slice(0,PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0);
    const p2pts=s.matchPts.slice(PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0);
    const p1mq=OWNERS.some(o=>o.marquee.includes(name));const p2mq=PHASE2_OWNERS.some(o=>o.marquee.includes(name));
    const bars=s.matchPts.length?(()=>{const mx=Math.max(...s.matchPts,1);return s.matchPts.map((v,i)=>`<div style="flex:1;border-radius:3px 3px 0 0;background:${i>=PHASE2_FROM_MATCH-1?'linear-gradient(180deg,#7C4DFF,#4400CC)':'linear-gradient(180deg,#FF6B00,#B8960A)'};min-height:4px;height:${Math.round((v/mx)*50)+4}px" title="M${i+1}: ${v}pts"></div>`).join('');})():`<div style="color:#7A8BAA;font-size:11px;padding:8px 0">No data yet</div>`;
    const ownerLine=p2own&&p2own.id!==p.owner?`${own?.name||'—'} <span style="color:#7A8BAA">Ph1</span> → ${p2own.name} <span style="color:#7C4DFF">Ph2</span>`:own?.name||'—';
    const body=`<div class="m-stat"><span class="m-lbl">IPL Team</span><span class="m-val">${p.ipl}</span></div>
<div class="m-stat"><span class="m-lbl">Owner</span><span class="m-val">${ownerLine}</span></div>
${p1mq?`<div class="m-stat"><span class="m-lbl">Ph1 Marquee</span><span class="m-val" style="color:#39FF14">1.5× M1–M35 ⚡</span></div>`:''}
${p2mq?`<div class="m-stat"><span class="m-lbl">Ph2 Marquee</span><span class="m-val" style="color:#7C4DFF">1.5× M36+ ⚡</span></div>`:''}
<div class="m-stat"><span class="m-lbl">Total Points</span><span class="m-val" style="color:#FFD700;font-size:18px">${tot}</span></div>
<div class="m-stat"><span class="m-lbl">Phase 1</span><span class="m-val">${p1pts}</span></div>
<div class="m-stat"><span class="m-lbl">Phase 2</span><span class="m-val" style="color:#7C4DFF">${p2pts}</span></div>
<div style="border-top:1px solid #2A3550;margin:10px 0"></div>
<div class="m-stat"><span class="m-lbl">Runs</span><span class="m-val">${s.runs}</span></div>
<div class="m-stat"><span class="m-lbl">Wickets</span><span class="m-val">${s.wickets}</span></div>
<div class="m-stat"><span class="m-lbl">Catches</span><span class="m-val">${s.catches}</span></div>
<div class="m-stat"><span class="m-lbl">Stumpings</span><span class="m-val">${s.stumpings}</span></div>
<div style="font-size:9px;font-weight:700;letter-spacing:2px;color:#7A8BAA;text-transform:uppercase;margin:1rem 0 .5rem">Per-match <span style="color:#FF6B00">■ Ph1</span> <span style="color:#7C4DFF">■ Ph2</span></div>
<div style="display:flex;align-items:flex-end;gap:2px;height:54px;margin-top:10px">${bars}</div>`;
    setModal({title:`${name} <span class="p-role role-${p.role}" style="font-size:12px;vertical-align:middle;margin-left:6px">${p.role}</span>${(p1mq||p2mq)?mqBadge():''}`,body});
  }

  function openTeamModal(ownerId:number){
    const own=ownerById(ownerId)!;const p2own=p2OwnerById(ownerId)!;
    const tp=teamPts(ownerId,scores,'full');const p1pts=teamPts(ownerId,scores,'phase1');const p2pts=teamPts(ownerId,scores,'phase2');
    const rank=ranked.findIndex(o=>o.id===ownerId)+1;
    const p1sq=PLAYERS.filter(p=>p.owner===ownerId).sort((a,b)=>(scores[b.name]?.matchPts||[]).slice(0,PHASE2_FROM_MATCH-1).reduce((x,y)=>x+y,0)-(scores[a.name]?.matchPts||[]).slice(0,PHASE2_FROM_MATCH-1).reduce((x,y)=>x+y,0));
    const p2sq=PHASE2_PLAYERS.filter(p=>p.owner===ownerId).sort((a,b)=>(scores[b.name]?.matchPts||[]).slice(PHASE2_FROM_MATCH-1).reduce((x,y)=>x+y,0)-(scores[a.name]?.matchPts||[]).slice(PHASE2_FROM_MATCH-1).reduce((x,y)=>x+y,0));
    const body=`<div class="m-stat"><span class="m-lbl">Rank</span><span class="m-val" style="color:#FFD700">#${rank} of 8</span></div>
<div class="m-stat"><span class="m-lbl">Total</span><span class="m-val" style="font-size:18px">${tp.toLocaleString()}</span></div>
<div class="m-stat"><span class="m-lbl">Phase 1 (M1–M35)</span><span class="m-val">${p1pts.toLocaleString()}</span></div>
<div class="m-stat"><span class="m-lbl">Phase 2 (M36+)</span><span class="m-val" style="color:#7C4DFF">${p2pts.toLocaleString()}</span></div>
<div class="m-stat"><span class="m-lbl">Ph1 Marquee ⚡</span><span class="m-val" style="color:#39FF14;font-size:11px">${own.marquee.join(', ')}</span></div>
<div class="m-stat"><span class="m-lbl">Ph2 Marquee ⚡</span><span class="m-val" style="color:#7C4DFF;font-size:11px">${p2own.marquee.join(', ')}</span></div>
<div style="font-size:9px;font-weight:700;letter-spacing:2px;color:#FF6B00;text-transform:uppercase;margin:1rem 0 .4rem">Phase 1 Squad</div>
${p1sq.map(p=>{const mq=own.marquee.includes(p.name);const pts=(scores[p.name]?.matchPts||[]).slice(0,PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0);return `<div class="mh-row" onclick="window.__opm('${esc(p.name)}')" style="cursor:pointer${mq?';background:rgba(57,255,20,0.04)':''}"><span>${p.name}${mq?mqBadge():''}</span><span class="mh-pts">${pts}</span></div>`;}).join('')}
<div style="font-size:9px;font-weight:700;letter-spacing:2px;color:#7C4DFF;text-transform:uppercase;margin:1rem 0 .4rem">Phase 2 Squad</div>
${p2sq.map(p=>{const mq=p2own.marquee.includes(p.name);const pts=(scores[p.name]?.matchPts||[]).slice(PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0);return `<div class="mh-row" onclick="window.__opm('${esc(p.name)}')" style="cursor:pointer${mq?';background:rgba(124,77,255,0.07)':''}"><span>${p.name}${mq?mqBadge(true):''}</span><span class="mh-pts" style="color:#7C4DFF">${pts}</span></div>`;}).join('')}`;
    setModal({title:`<span style="color:${own.color}">${own.name}'s Team</span>`,body});
  }

  useEffect(()=>{(window as any)['__opm']=(name:string)=>{setModal(null);setTimeout(()=>openPlayerModal(name),180);};},[scores]);

  const filteredPlayers=useCallback(()=>{
    const pList=playerPhase==='phase2'?PHASE2_PLAYERS:playerPhase==='phase1'?PLAYERS:allUniq;
    const sold=pList.filter(p=>{
      if(activeFilter==='MARQUEE'){if(playerPhase==='phase2')return PHASE2_OWNERS.some(o=>o.marquee.includes(p.name));if(playerPhase==='phase1')return OWNERS.some(o=>o.marquee.includes(p.name));return OWNERS.some(o=>o.marquee.includes(p.name))||PHASE2_OWNERS.some(o=>o.marquee.includes(p.name));}
      if(activeFilter==='UNSOLD')return false;
      return(activeFilter==='ALL'||p.role===activeFilter)&&(!searchQuery||p.name.toLowerCase().includes(searchQuery.toLowerCase())||(p.ipl||'').toLowerCase().includes(searchQuery.toLowerCase()));
    }).map(p=>{
      const pts=playerPhase==='phase1'?(scores[p.name]?.matchPts||[]).slice(0,PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0):playerPhase==='phase2'?(scores[p.name]?.matchPts||[]).slice(PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0):(scores[p.name]?.matchPts||[]).reduce((a,b)=>a+b,0);
      const p1e=PLAYERS.find(x=>x.name===p.name);const p2e=PHASE2_PLAYERS.find(x=>x.name===p.name);
      let ownerLabel='—';let ownerColor='#7A8BAA';
      if(playerPhase==='phase1'){ownerLabel=ownerById(p1e?.owner||0)?.name||'—';ownerColor=ownerById(p1e?.owner||0)?.color||'#7A8BAA';}
      else if(playerPhase==='phase2'){ownerLabel=p2OwnerById(p2e?.owner||0)?.name||'—';ownerColor=PHASE2_OWNERS.find(o=>o.id===(p2e?.owner||0))?.color||'#7A8BAA';}
      else{const n1=ownerById(p1e?.owner||0)?.name;const n2=p2OwnerById(p2e?.owner||0)?.name;if(n1&&n2&&n1!==n2){ownerLabel=`${n1} → ${n2}`;ownerColor='#E8EDF5';}else if(n1){ownerLabel=n1;ownerColor=ownerById(p1e?.owner||0)?.color||'#7A8BAA';}else if(n2){ownerLabel=`Unsold Ph1, ${n2} Ph2`;ownerColor=PHASE2_OWNERS.find(o=>o.id===(p2e?.owner||0))?.color||'#7A8BAA';}}
      const isMq=(playerPhase==='phase2'?PHASE2_OWNERS:OWNERS).some(o=>o.marquee.includes(p.name));
      return{name:p.name,ipl:p.ipl,role:p.role,cost:p.cost,owner:ownerLabel,ownerColor,pts,isMarquee:isMq,isUnsold:false};
    }).sort((a,b)=>b.pts-a.pts);
    if(activeFilter==='MARQUEE')return sold;
    const unsold=activeFilter==='ALL'||activeFilter==='UNSOLD'?unsoldPlayers.filter(u=>!searchQuery||u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(u=>({name:u.name,ipl:'',role:'?',cost:0,owner:'UNSOLD',ownerColor:'#E8003D',pts:unsoldPts(u),isMarquee:false,isUnsold:true})):[];
    return[...sold,...unsold].sort((a,b)=>b.pts-a.pts);
  },[activeFilter,playerPhase,searchQuery,scores,unsoldPlayers]);

  const progressSVG=useCallback(()=>{
    const W=680,H=340,PAD={top:20,right:120,bottom:40,left:52};const cW=W-PAD.left-PAD.right,cH=H-PAD.top-PAD.bottom;
    const series=OWNERS.map(o=>({owner:o,pts:getTeamCumulative(o.id)}));
    const maxM=Math.max(...series.map(s=>s.pts.length),1);const maxP=Math.max(...series.flatMap(s=>s.pts),1);
    if(maxM<=1&&maxP<=1)return null;
    const xS=(i:number)=>PAD.left+(i/(maxM-1||1))*cW;const yS=(v:number)=>PAD.top+cH-(v/maxP)*cH;
    const grid=[0,.25,.5,.75,1].map(f=>{const y=PAD.top+cH*(1-f),l=Math.round(maxP*f);return `<line x1="${PAD.left}" y1="${y}" x2="${PAD.left+cW}" y2="${y}" stroke="rgba(42,53,80,0.5)" stroke-width="1"/><text x="${PAD.left-6}" y="${y+4}" fill="#7A8BAA" font-size="9" text-anchor="end" font-family="JetBrains Mono">${l}</text>`;}).join('');
    const xLbl=Array.from({length:maxM},(_,i)=>`<text x="${xS(i)}" y="${PAD.top+cH+16}" fill="#7A8BAA" font-size="9" text-anchor="middle" font-family="JetBrains Mono">M${i+1}</text>`).join('');
    const p2x=xS(Math.min(PHASE2_FROM_MATCH-1,maxM-1));
    const div=maxM>PHASE2_FROM_MATCH-1?`<line x1="${p2x}" y1="${PAD.top}" x2="${p2x}" y2="${PAD.top+cH}" stroke="#7C4DFF" stroke-width="1" stroke-dasharray="4,3" opacity="0.7"/><text x="${p2x+4}" y="${PAD.top+10}" fill="#7C4DFF" font-size="8" font-family="Rajdhani" font-weight="700">PH2</text>`:'';
    const lines=series.map(({owner,pts})=>{if(!pts.length)return'';const path=pts.map((v,i)=>`${xS(i)},${yS(v)}`).join(' ');const lx=xS(pts.length-1),ly=yS(pts[pts.length-1]);return `<polyline points="${path}" fill="none" stroke="${owner.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/><circle cx="${lx}" cy="${ly}" r="4" fill="${owner.color}"/><text x="${lx+10}" y="${ly+4}" fill="${owner.color}" font-size="10" font-weight="700" font-family="Rajdhani">${owner.name}</text>`;}).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;min-width:300px;height:auto;display:block">${grid}${xLbl}${div}${lines}<line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top+cH}" stroke="#2A3550" stroke-width="1"/><line x1="${PAD.left}" y1="${PAD.top+cH}" x2="${PAD.left+cW}" y2="${PAD.top+cH}" stroke="#2A3550" stroke-width="1"/></svg>`;
  },[scores]);

  const allMqTicker=[...OWNERS.flatMap(o=>o.marquee.map(n=>`${n} (${o.name}) ⚡ Ph1`)),...PHASE2_OWNERS.flatMap(o=>o.marquee.map(n=>`${n} (${o.name}) ⚡ Ph2`))];
  const tickerDoubled=[...['IPL Fantasy 2026 · 2 Phases · 8 Teams','⚡ Phase 2 starts M36 — new squads',...allMqTicker],...['IPL Fantasy 2026 · 2 Phases · 8 Teams','⚡ Phase 2 starts M36 — new squads',...allMqTicker]];

  function renderRawStats(){
    const isP2=rawPhase==='phase2';const isP1=rawPhase==='phase1';
    const own=isP2?p2OwnerById(rawTeam)!:ownerById(rawTeam)!;
    const ownerColor=OWNERS.find(o=>o.id===rawTeam)?.color||'#FFD700';
    const squad=(isP2?PHASE2_PLAYERS:PLAYERS).filter(p=>p.owner===rawTeam).sort((a,b)=>{const ap=(scores[a.name]?.matchPts||[]).reduce((x,y)=>x+y,0);const bp=(scores[b.name]?.matchPts||[]).reduce((x,y)=>x+y,0);return bp-ap;});
    const startIdx=isP2?PHASE2_FROM_MATCH-1:0;const endIdx=isP1?PHASE2_FROM_MATCH-1:matchesPlayed;
    const numM=Math.max(endIdx-startIdx,0);const cols=Array.from({length:numM},(_,i)=>i);
    const td=(c:string|number,s='')=>`<td style="padding:5px 8px;border-bottom:1px solid #1e2a3a;border-right:1px solid #1e2a3a;font-size:11px;font-family:'JetBrains Mono',monospace;white-space:nowrap;${s}">${c}</td>`;
    const th=(c:string,s='')=>`<th style="padding:5px 8px;border-bottom:1px solid #1e2a3a;border-right:1px solid #1e2a3a;font-size:10px;font-weight:700;letter-spacing:1px;background:#0a0f18;white-space:nowrap;text-align:center;${s}">${c}</th>`;
    const mTitle=(i:number)=>{const m=matchMetas[startIdx+i];if(!m)return `Match ${startIdx+i+1}`;const teams=m.name.replace(/,.*$/,'').trim();return `${teams} (M${startIdx+i+1})`;};
    let rows='';const teamMP=Array(numM).fill(0);
    for(const p of squad){
      const s=scores[p.name]||{runs:0,wickets:0,catches:0,stumpings:0,matchPts:[]};
      const sl=s.matchPts.slice(startIdx,endIdx);
      const mq=isP2?PHASE2_OWNERS.find(o=>o.id===rawTeam)?.marquee.includes(p.name):OWNERS.find(o=>o.id===rawTeam)?.marquee.includes(p.name);
      const fp=sl.reduce((a,b)=>a+b,0);
      const mc=cols.map(i=>{const mp=sl[i]??0;teamMP[i]=(teamMP[i]||0)+mp;const col=mp>0?'#FFD700':'#3a4a60';return td(mp>0?`+${mp}`:'—',`color:${col};text-align:center;`);}).join('');
      const bg=mq?'rgba(57,255,20,0.04)':'#161D2A';
      const std=(c:string|number,s='')=>`<td style="padding:5px 8px;border-bottom:1px solid #1e2a3a;border-right:1px solid #1e2a3a;font-size:11px;font-family:'JetBrains Mono',monospace;white-space:nowrap;position:sticky;z-index:2;background:${bg};${s}">${c}</td>`;
      rows+=`<tr style="background:${bg}">${std(`<span style="color:${ownerColor};font-weight:700;">${p.name}${mq?' ⚡':''}</span>`,'left:0;min-width:140px;text-align:left;')}${std(p.role,'left:140px;min-width:48px;color:#7A8BAA;text-align:center;')}${std(p.ipl||'—','left:188px;min-width:48px;color:#7A8BAA;text-align:center;')}${std(fp,`left:236px;min-width:64px;color:${mq?'#39FF14':'#FFD700'};font-weight:700;text-align:right;box-shadow:4px 0 8px rgba(0,0,0,0.6);border-right:2px solid #FFD700;`)}${mc}</tr>`;
    }
    const tf=teamMP.reduce((a,b)=>a+b,0);
    const totMC=teamMP.map(v=>td(v>0?`+${v}`:'—',`color:${v>0?'#FFD700':'#3a4a60'};text-align:center;font-weight:700;`)).join('');
    const stot=(c:string|number,s='')=>`<td style="padding:5px 8px;border-bottom:1px solid #1e2a3a;border-right:1px solid #1e2a3a;font-size:11px;font-family:'JetBrains Mono',monospace;white-space:nowrap;position:sticky;z-index:2;background:#0a0f18;${s}">${c}</td>`;
    const totRow=`<tr style="background:#0a0f18;font-weight:700;">${stot('TEAM TOTAL','left:0;min-width:140px;color:#FFD700;font-weight:700;font-size:12px;')}${stot('','left:140px;min-width:48px;')}${stot('','left:188px;min-width:48px;')}${stot(tf,'left:236px;min-width:64px;color:#FFD700;text-align:right;font-weight:700;font-size:13px;box-shadow:4px 0 8px rgba(0,0,0,0.6);border-right:2px solid #FFD700;')}${totMC}</tr>`;
    const mHdrs=cols.map(i=>th(`<span title="${mTitle(i)}" style="cursor:help;display:block">M${startIdx+i+1}</span>`,'min-width:44px;font-size:10px;')).join('');
    // Match index legend
    const legend=cols.map(i=>{const m=matchMetas[startIdx+i];const teams=m?m.name.replace(/,.*$/,'').trim():'Match '+(startIdx+i+1);return `<div style="display:flex;gap:6px;align-items:center;padding:3px 0;border-bottom:1px solid rgba(42,53,80,0.3);font-size:11px;"><span style="font-family:'JetBrains Mono',monospace;color:#FFD700;min-width:36px;font-weight:700">M${startIdx+i+1}</span><span style="color:#7A8BAA">${teams}</span></div>`;}).join('');
    // Sticky cols CSS injected inline via a wrapper trick - use position:sticky on first 4 th/td
    const stickyTh=(c:string,s='')=>`<th style="padding:5px 8px;border-bottom:1px solid #1e2a3a;border-right:1px solid #1e2a3a;font-size:10px;font-weight:700;letter-spacing:1px;background:#0a0f18;white-space:nowrap;text-align:center;position:sticky;z-index:3;${s}">${c}</th>`;
    const hdrs=`${stickyTh('Player','text-align:left;min-width:140px;left:0;')}${stickyTh('Role','min-width:48px;left:140px;')}${stickyTh('IPL','min-width:48px;left:188px;')}${stickyTh('Points','color:#FFD700;min-width:64px;left:236px;box-shadow:4px 0 8px rgba(0,0,0,0.6);border-right:2px solid #FFD700;')}${mHdrs}`;
    return `<details style="margin-bottom:10px;"><summary style="cursor:pointer;font-size:10px;font-weight:700;letter-spacing:2px;color:#7A8BAA;text-transform:uppercase;padding:6px 0;user-select:none">▶ MATCH INDEX (click to expand)</summary><div style="background:#0a0f18;border:1px solid #2A3550;border-radius:6px;padding:8px 12px;margin-top:6px;max-height:200px;overflow-y:auto;">${legend}</div></details><div style="overflow-x:auto;-webkit-overflow-scrolling:touch;"><table style="border-collapse:separate;border-spacing:0;width:100%;"><thead><tr>${hdrs}</tr></thead><tbody>${rows}${totRow}</tbody></table></div>`;
  }

  function PT({value,onChange,showFull=true}:{value:PhaseView,onChange:(v:PhaseView)=>void,showFull?:boolean}){
    const btn=(v:PhaseView,lbl:string,col:string)=><button onClick={()=>onChange(v)} style={{background:value===v?`${col}18`:'#0D1119',border:`1px solid ${value===v?col:'#2A3550'}`,color:value===v?col:'#7A8BAA',borderRadius:5,padding:'5px 12px',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:11,letterSpacing:1,cursor:'pointer',minHeight:32}}>{lbl}</button>;
    return <div style={{display:'flex',gap:6,marginBottom:'1rem',flexWrap:'wrap'}}>
      {showFull&&btn('full','Full Season','#FFD700')}{btn('phase1','Phase 1 (M1–35)','#FF6B00')}{btn('phase2','Phase 2 (M36+)','#7C4DFF')}
    </div>;
  }

  function navTo(v:ActiveView){setActiveView(v);setMobileNavOpen(false);}
  const mvp=getMVP();

  return(
    <div style={{background:'#080B10',color:'#E8EDF5',fontFamily:"'Rajdhani',sans-serif",minHeight:'100vh',overflowX:'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        html{-webkit-text-size-adjust:100%;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes spin-disc{to{transform:rotate(360deg)}}
        @keyframes eq-b{from{height:4px}to{height:12px}}
        @keyframes modalUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
        @keyframes navDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        .live-dot{width:6px;height:6px;background:#E8003D;border-radius:50%;animation:pulse 1.2s ease-in-out infinite;}
        .ticker-track{display:flex;animation:ticker 50s linear infinite;gap:60px;padding-left:20px;}
        .spinner{display:inline-block;width:12px;height:12px;border:2px solid #2A3550;border-top-color:#FFD700;border-radius:50%;animation:spin 0.7s linear infinite;vertical-align:middle;margin-right:5px;}
        .nav-btn{background:none;border:none;color:#7A8BAA;font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:6px 12px;border-radius:4px;cursor:pointer;transition:all 0.2s;position:relative;white-space:nowrap;}
        .nav-btn.active{color:#FFD700;background:rgba(255,215,0,0.08);}
        .nav-btn.active::after{content:'';position:absolute;bottom:0;left:12px;right:12px;height:2px;background:#FFD700;border-radius:2px;}
        .nav-btn:hover:not(.active){color:#E8EDF5;background:rgba(255,255,255,0.05);}
        .hamburger{display:none;background:none;border:1px solid #2A3550;color:#7A8BAA;padding:7px 11px;border-radius:6px;cursor:pointer;font-size:17px;line-height:1;}
        .desktop-nav{display:flex;gap:2px;}
        .mobile-nav{display:none;position:absolute;top:60px;left:0;right:0;background:#0A0F18;border-bottom:2px solid #2A3550;z-index:99;padding:6px 8px 10px;animation:navDown 0.2s ease;}
        .mobile-nav.open{display:block;}
        .mobile-nav-btn{display:flex;align-items:center;gap:10px;width:100%;background:none;border:none;color:#7A8BAA;font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:13px 14px;text-align:left;cursor:pointer;border-radius:8px;transition:background 0.12s;}
        .mobile-nav-btn.active{color:#FFD700;background:rgba(255,215,0,0.08);}
        .mobile-sync-btn{width:100%;margin-top:8px;background:#FFD700;color:#000;border:none;border-radius:8px;padding:13px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:15px;letter-spacing:1px;cursor:pointer;}
        .lb-row{display:grid;grid-template-columns:44px 1fr 72px 72px 80px 100px;align-items:center;padding:0 1.25rem;height:56px;border-bottom:1px solid rgba(42,53,80,0.5);transition:background 0.15s;cursor:pointer;}
        .lb-row:hover,.lb-row:active{background:rgba(255,255,255,0.03);}
        .lb-row:last-child{border-bottom:none;}
        .lb-hdr{background:#0D1119;height:36px;cursor:default;}.lb-hdr:hover{background:#0D1119;}
        .rk1{background:linear-gradient(90deg,rgba(255,215,0,0.06),transparent);}
        .rk2{background:linear-gradient(90deg,rgba(192,192,192,0.04),transparent);}
        .rk3{background:linear-gradient(90deg,rgba(205,127,50,0.04),transparent);}
        .p-role{font-size:8px;font-weight:700;letter-spacing:1.5px;padding:2px 5px;border-radius:3px;margin:0 6px;min-width:28px;text-align:center;}
        .role-BAT{background:rgba(0,212,255,0.12);color:#00D4FF;border:1px solid rgba(0,212,255,0.25);}
        .role-BOWL{background:rgba(232,0,61,0.12);color:#E8003D;border:1px solid rgba(232,0,61,0.25);}
        .role-AR{background:rgba(255,215,0,0.12);color:#FFD700;border:1px solid rgba(255,215,0,0.25);}
        .role-WK{background:rgba(124,77,255,0.12);color:#7C4DFF;border:1px solid rgba(124,77,255,0.25);}
        .role-\?{background:rgba(122,139,170,0.12);color:#7A8BAA;border:1px solid rgba(122,139,170,0.25);}
        .mq-badge{display:inline-flex;align-items:center;background:rgba(57,255,20,0.12);border:1px solid rgba(57,255,20,0.35);border-radius:3px;padding:1px 5px;font-size:8px;font-weight:700;letter-spacing:1.5px;color:#39FF14;margin-left:5px;vertical-align:middle;white-space:nowrap;box-shadow:0 0 8px rgba(57,255,20,0.3);}
        .unsold-badge{display:inline-flex;align-items:center;background:rgba(232,0,61,0.12);border:1px solid rgba(232,0,61,0.3);border-radius:3px;padding:1px 5px;font-size:8px;font-weight:700;letter-spacing:1.5px;color:#E8003D;margin-left:5px;vertical-align:middle;white-space:nowrap;}
        .pt-row{display:grid;grid-template-columns:1fr 55px 110px 75px;align-items:center;padding:0 1.1rem;height:46px;border-bottom:1px solid rgba(42,53,80,0.4);font-size:12px;cursor:pointer;transition:background 0.12s;}
        .pt-row:hover,.pt-row:active{background:rgba(255,255,255,0.03);}
        .pt-row:last-child{border-bottom:none;}
        .pt-row.hdr{background:#0D1119;height:32px;cursor:default;}
        .pt-row.is-marquee{background:rgba(57,255,20,0.04);}
        .pt-row.is-unsold{background:rgba(232,0,61,0.02);}
        .team-card{background:#161D2A;border:1px solid #2A3550;border-radius:12px;overflow:hidden;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;}
        .team-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.5);}
        .team-card:active{transform:scale(0.99);}
        .p-row{display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(42,53,80,0.4);font-size:12px;}
        .p-row:last-child{border-bottom:none;}.p-row.is-marquee{background:rgba(57,255,20,0.04);}
        .filter-btn{background:#0D1119;border:1px solid #2A3550;border-radius:5px;color:#7A8BAA;font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;padding:6px 10px;cursor:pointer;transition:all 0.15s;min-height:36px;}
        .filter-btn.active{border-color:#FFD700;color:#FFD700;background:rgba(255,215,0,0.08);}
        .mvp-card{background:#161D2A;border:1px solid #2A3550;border-radius:10px;padding:.9rem 1rem;display:flex;align-items:center;gap:.75rem;cursor:pointer;transition:background 0.15s;}
        .mvp-card:hover,.mvp-card:active{background:#1C2538;}
        .raw-team-btn{background:#0D1119;border:1px solid #2A3550;border-radius:5px;color:#7A8BAA;font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;padding:6px 12px;cursor:pointer;transition:all 0.15s;min-height:36px;}
        .raw-team-btn.active{border-color:#FFD700;color:#FFD700;background:rgba(255,215,0,0.08);}
        .raw-team-btn:hover:not(.active){color:#E8EDF5;border-color:#3a4a60;}
        .m-stat{display:flex;justify-content:space-between;margin-bottom:.55rem;font-size:13px;}
        .m-lbl{color:#7A8BAA;}.m-val{font-weight:700;font-family:'JetBrains Mono',monospace;}
        .mh-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(42,53,80,0.4);font-size:12px;}
        .mh-pts{font-family:'JetBrains Mono',monospace;font-weight:700;color:#FFD700;}
        .mp-btn{background:none;border:none;color:#7A8BAA;font-size:18px;cursor:pointer;padding:5px;line-height:1;transition:color 0.15s;flex-shrink:0;min-width:34px;min-height:34px;display:flex;align-items:center;justify-content:center;}
        .mp-btn:active{color:#FFD700;}
        .mp-ti{display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:pointer;transition:background 0.12s;font-size:11px;}
        .mp-ti.active{background:rgba(255,215,0,0.06);color:#FFD700;}
        .mp-eq{display:none;gap:2px;align-items:flex-end;height:12px;}
        .mp-ti.active .mp-eq{display:flex;}
        .mp-eq span{display:block;width:3px;background:#FFD700;border-radius:1px;animation:eq-b 0.6s ease-in-out infinite alternate;}
        .mp-eq span:nth-child(2){animation-delay:0.2s;}.mp-eq span:nth-child(3){animation-delay:0.4s;}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:#080B10}::-webkit-scrollbar-thumb{background:#2A3550;border-radius:3px}
        @media(max-width:768px){
          .hamburger{display:block;}.desktop-nav{display:none;}.header-logo-sub{display:none;}
          .lb-row{grid-template-columns:36px 1fr 90px;height:52px;padding:0 .9rem;}.lb-col-hide{display:none!important;}
          .teams-grid{grid-template-columns:1fr!important;}.pt-row{grid-template-columns:1fr 48px 75px;}.pt-col-hide{display:none!important;}
          .stats-strip{grid-template-columns:repeat(2,1fr)!important;gap:.6rem!important;}
          .mvp-grid{grid-template-columns:1fr 1fr!important;}.auction-wrap{grid-template-columns:1fr!important;}.auction-sidebar{display:none!important;}
          main{padding:1rem .75rem!important;padding-bottom:150px!important;}
          .match-banner{flex-direction:column!important;gap:10px!important;align-items:flex-start!important;}
          .section-hdr{flex-wrap:wrap;gap:6px!important;}.raw-team-btn{font-size:11px;padding:5px 9px;}
          #music-player{bottom:.75rem!important;left:.75rem!important;right:.75rem!important;width:auto!important;max-width:320px;}
          .modal-sheet{border-radius:18px 18px 0 0!important;max-height:92vh!important;width:100%!important;max-width:100%!important;}
        }
        @media(max-width:400px){.header-logo{font-size:18px!important;}.stats-strip{grid-template-columns:1fr 1fr!important;}}
      `}</style>

      <header style={{background:'linear-gradient(135deg,#0A0F18,#111827)',borderBottom:'2px solid #FFD700',padding:'0 1rem',position:'sticky',top:0,zIndex:100,boxShadow:'0 4px 40px rgba(255,215,0,0.15)'}}>
        <div style={{maxWidth:1400,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:60,gap:'1rem',position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <div style={{width:34,height:34,background:'linear-gradient(135deg,#FFD700,#FF6B00)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>🏏</div>
            <div>
              <div className="header-logo" style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:3,background:'linear-gradient(90deg,#FFD700,#FF6B00)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>The Auction Room</div>
              <div className="header-logo-sub" style={{fontSize:9,color:'#7A8BAA',letterSpacing:3,textTransform:'uppercase',marginTop:-3}}>IPL Fantasy 2026 · 8 Teams · 2 Phases</div>
            </div>
          </div>
          <nav className="desktop-nav">
            {(['leaderboard','teams','auction','progress','rawstats'] as ActiveView[]).map(v=>(
              <button key={v} className={`nav-btn${activeView===v?' active':''}`} onClick={()=>navTo(v)}>
                {v==='leaderboard'?'Leaderboard':v==='teams'?'Teams':v==='auction'?'Players':v==='progress'?'Progress':'Raw Stats'}
              </button>
            ))}
          </nav>
          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
            <button onClick={toggleAdmin} style={{background:'none',border:`1px solid ${isAdmin?'#00E676':'#2A3550'}`,color:isAdmin?'#00E676':'#7A8BAA',padding:'6px 10px',borderRadius:6,fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:5,minHeight:34}}>
              {isAdmin?'🔓':'🔐'}<span style={{fontSize:11}}>Admin</span>
            </button>
            <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(232,0,61,0.15)',border:'1px solid #E8003D',borderRadius:4,padding:'3px 8px',fontSize:10,letterSpacing:2,color:'#E8003D',fontWeight:700}}>
              <div className="live-dot"></div>LIVE
            </div>
            <div style={{background:'rgba(124,77,255,0.15)',border:'1px solid #7C4DFF',borderRadius:4,padding:'3px 8px',fontSize:9,letterSpacing:1.5,color:'#7C4DFF',fontWeight:700}}>
              {matchesPlayed>=PHASE2_FROM_MATCH?'PH2':'PH1'}
            </div>
            <button className="hamburger" onClick={()=>setMobileNavOpen(o=>!o)}>{mobileNavOpen?'✕':'☰'}</button>
          </div>
          <div className={`mobile-nav${mobileNavOpen?' open':''}`}>
            {(['leaderboard','teams','auction','progress','rawstats'] as ActiveView[]).map(v=>(
              <button key={v} className={`mobile-nav-btn${activeView===v?' active':''}`} onClick={()=>navTo(v)}>
                <span style={{fontSize:18}}>{v==='leaderboard'?'🏆':v==='teams'?'👥':v==='auction'?'🎯':v==='progress'?'📈':'📊'}</span>
                {v==='leaderboard'?'Leaderboard':v==='teams'?'Teams':v==='auction'?'Players':v==='progress'?'Progress':'Raw Stats'}
              </button>
            ))}
            {isAdmin&&<button className="mobile-sync-btn" onClick={()=>{handleRefresh();setMobileNavOpen(false);}}>↻ SYNC SCORES</button>}
          </div>
        </div>
      </header>

      <div style={{background:'linear-gradient(90deg,#E8003D,#B8002E)',overflow:'hidden',height:26,display:'flex',alignItems:'center'}}>
        <div style={{background:'#000',color:'#FFD700',fontFamily:"'Bebas Neue',cursive",letterSpacing:2,fontSize:12,padding:'0 12px',height:'100%',display:'flex',alignItems:'center',whiteSpace:'nowrap',flexShrink:0}}>🔴 IPL 2026</div>
        <div style={{overflow:'hidden',flex:1}}><div className="ticker-track">{tickerDoubled.map((t,i)=><span key={i} style={{whiteSpace:'nowrap',fontSize:11,fontWeight:600,letterSpacing:1,color:'#fff'}}>{t}</span>)}</div></div>
      </div>

      {isAdmin&&(
        <div style={{background:'#0D1119',borderBottom:'1px solid #2A3550'}}>
          <div style={{maxWidth:1400,margin:'0 auto',padding:'7px 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,fontSize:11,flex:1,minWidth:0}}>
              <div style={{width:7,height:7,borderRadius:'50%',flexShrink:0,background:apiStatus.state==='ok'?'#00E676':apiStatus.state==='err'?'#E8003D':apiStatus.state==='loading'?'#FFD700':'#7A8BAA'}}></div>
              <span style={{color:'#7A8BAA',fontFamily:"'JetBrains Mono',monospace",fontSize:10,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} dangerouslySetInnerHTML={{__html:apiStatus.state==='loading'?`<span class="spinner"></span>${apiStatus.msg}`:apiStatus.msg}}></span>
            </div>
            <div style={{display:'flex',gap:8,flexShrink:0}}>
              <button onClick={handleRefresh} disabled={apiStatus.state==='loading'} style={{background:apiStatus.state==='loading'?'#1C2538':'#FFD700',color:apiStatus.state==='loading'?'#7A8BAA':'#000',border:'none',borderRadius:6,padding:'8px 16px',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1.5,cursor:apiStatus.state==='loading'?'not-allowed':'pointer',minHeight:36}}>
                {apiStatus.state==='loading'?'Syncing…':'↻ REFRESH'}
              </button>
              <button onClick={handleFullResync} disabled={apiStatus.state==='loading'} style={{background:'transparent',color:'#7A8BAA',border:'1px solid #2A3550',borderRadius:6,padding:'8px 12px',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:11,letterSpacing:1,cursor:apiStatus.state==='loading'?'not-allowed':'pointer',minHeight:36,whiteSpace:'nowrap'}}>⚠ FORCE RESYNC</button>
            </div>
          </div>
        </div>
      )}

      <main style={{maxWidth:1400,margin:'0 auto',padding:'1.5rem',paddingBottom:140}}>

        {activeView==='leaderboard'&&(
          <div>
            <div className="stats-strip" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.5rem'}}>
              {[{label:'Matches Played',val:matchesPlayed,sub:`Phase ${matchesPlayed>=PHASE2_FROM_MATCH?'2':'1'} active`,col:'linear-gradient(90deg,#FFD700,#FF6B00)'},{label:'Leading Team',val:topTeam.name,sub:`${topPts.toLocaleString()} pts`,col:'#00D4FF'},{label:'Top Player',val:topP?.name.split(' ').slice(0,2).join(' ')||'—',sub:`${(scores[topP?.name||'']?.matchPts||[]).reduce((a,b)=>a+b,0)} pts`,col:'#00E676'},{label:'Season',val:'LIVE',sub:'IPL 2026 · 2 Phases',col:'#E8003D'}].map((box,i)=>(
                <div key={i} style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'1rem 1.1rem',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:box.col}}></div>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textTransform:'uppercase',marginBottom:4}}>{box.label}</div>
                  <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:i===0?30:15,lineHeight:1,paddingTop:i>0?'7px':0}}>{box.val}</div>
                  <div style={{fontSize:10,color:'#7A8BAA',marginTop:2}}>{box.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>STANDINGS</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#FFD700',background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.2)',padding:'3px 8px',borderRadius:3}}>{`8 TEAMS · ${matchesPlayed} MATCHES`}</div>
            </div>
            <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:12,overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>
              <div className="lb-row lb-hdr">
                <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textAlign:'right'}}>#</div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA'}}>TEAM</div>
                <div className="lb-col-hide" style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#FF6B00',textAlign:'right'}}>PH1</div>
                <div className="lb-col-hide" style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7C4DFF',textAlign:'right'}}>PH2</div>
                <div className="lb-col-hide" style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textAlign:'right'}}>Spent</div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textAlign:'right'}}>Total</div>
              </div>
              {ranked.map((owner,i)=>{
                const rank=i+1;const tp=teamPts(owner.id,scores,'full');
                const p1p=teamPts(owner.id,scores,'phase1');const p2p=teamPts(owner.id,scores,'phase2');
                const squad=PLAYERS.filter(p=>p.owner===owner.id);const spent=squad.reduce((s,p)=>s+p.cost,0);
                return(<div key={owner.id} className={`lb-row ${rank<=3?'rk'+rank:''}`} onClick={()=>openTeamModal(owner.id)}>
                  <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,color:rank===1?'#FFD700':rank===2?'#C0C0C0':rank===3?'#CD7F32':'#7A8BAA'}}>{rank}</div>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:30,height:30,borderRadius:6,background:owner.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',cursive",fontSize:13,color:'#000',flexShrink:0}}>{owner.name[0]}</div>
                    <div><div style={{fontSize:14,fontWeight:700}}>{owner.name}</div><div style={{fontSize:10,color:'#7A8BAA'}}>{squad.length} players</div></div>
                  </div>
                  <div className="lb-col-hide" style={{textAlign:'right',fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:'#FF6B00'}}>{p1p.toLocaleString()}</div>
                  <div className="lb-col-hide" style={{textAlign:'right',fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:'#7C4DFF'}}>{p2p.toLocaleString()}</div>
                  <div className="lb-col-hide" style={{textAlign:'right',fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:'#00E676'}}>₹{spent.toFixed(1)}L</div>
                  <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,textAlign:'right',color:rank===1?'#FFD700':undefined}}>{tp.toLocaleString()}</div>
                </div>);
              })}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10,margin:'1.5rem 0 1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>MOST VALUABLE PLAYERS</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#FFD700',background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.2)',padding:'3px 8px',borderRadius:3,flexShrink:0}}>PTS PER ₹1 CR</div>
            </div>
            <div className="mvp-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'.75rem'}}>
              {mvp.map(({p,pts,ratio,owner},i)=>(
                <div key={p.name} className="mvp-card" onClick={()=>openPlayerModal(p.name)}>
                  <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,color:i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':'#7A8BAA',minWidth:24}}>{i+1}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div>
                    <div style={{fontSize:10,color:owner?.color||'#999'}}>{owner?.name||'—'} · ₹{p.cost}L</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,color:'#FFD700',lineHeight:1}}>{ratio.toFixed(1)}</div>
                    <div style={{fontSize:9,color:'#7A8BAA'}}>PTS/CR · {pts} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView==='teams'&&(
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>ALL TEAMS</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
            </div>
            <PT value={teamsPhase} onChange={setTeamsPhase}/>
            <div className="teams-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'1.25rem'}}>
              {[...OWNERS].sort((a,b)=>teamPts(b.id,scores,teamsPhase)-teamPts(a.id,scores,teamsPhase)).map((owner,i)=>{
                const tp=teamPts(owner.id,scores,teamsPhase);
                const p2own=p2OwnerById(owner.id)!;
                const squad=(teamsPhase==='phase2'?PHASE2_PLAYERS:PLAYERS).filter(p=>p.owner===owner.id).sort((a,b)=>{
                  const ap=teamsPhase==='phase2'?(scores[a.name]?.matchPts||[]).slice(PHASE2_FROM_MATCH-1).reduce((x,y)=>x+y,0):(scores[a.name]?.matchPts||[]).slice(0,PHASE2_FROM_MATCH-1).reduce((x,y)=>x+y,0);
                  const bp=teamsPhase==='phase2'?(scores[b.name]?.matchPts||[]).slice(PHASE2_FROM_MATCH-1).reduce((x,y)=>x+y,0):(scores[b.name]?.matchPts||[]).slice(0,PHASE2_FROM_MATCH-1).reduce((x,y)=>x+y,0);
                  return bp-ap;
                });
                const activeOwn=teamsPhase==='phase2'?p2own:owner;
                const maxP=Math.max(...squad.map(p=>{const pts=teamsPhase==='phase2'?(scores[p.name]?.matchPts||[]).slice(PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0):(scores[p.name]?.matchPts||[]).slice(0,PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0);return pts;}),1);
                return(<div key={owner.id} className="team-card" onClick={()=>openTeamModal(owner.id)}>
                  <div style={{padding:'.9rem 1.1rem',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #2A3550'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9}}>
                      <div style={{width:38,height:38,borderRadius:8,background:owner.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',cursive",fontSize:15,color:'#000'}}>{owner.name[0]}</div>
                      <div><div style={{fontSize:15,fontWeight:700}}>{owner.name}</div>
                        <div style={{fontSize:9,color:'#7A8BAA',letterSpacing:1}}>
                          {teamsPhase==='phase2'?<span style={{color:'#7C4DFF'}}>⚡ {p2own.marquee.slice(0,2).join(', ')}</span>:teamsPhase==='phase1'?<span style={{color:'#39FF14'}}>⚡ {owner.marquee.slice(0,2).join(', ')}</span>:`Rank #${i+1}`}
                        </div>
                      </div>
                    </div>
                    <div><div style={{fontFamily:"'Bebas Neue',cursive",fontSize:28,color:'#FFD700',lineHeight:1}}>{tp.toLocaleString()}</div><div style={{fontSize:8,color:'#7A8BAA',letterSpacing:2,textAlign:'right'}}>POINTS</div></div>
                  </div>
                  <div style={{padding:'.6rem 1.1rem'}}>
                    {squad.map(p=>{
                      const pp=teamsPhase==='phase2'?(scores[p.name]?.matchPts||[]).slice(PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0):(scores[p.name]?.matchPts||[]).slice(0,PHASE2_FROM_MATCH-1).reduce((a,b)=>a+b,0);
                      const pct=Math.round((pp/maxP)*100);const mq=activeOwn.marquee.includes(p.name);
                      return(<div key={p.name} className={`p-row${mq?' is-marquee':''}`} onClick={e=>{e.stopPropagation();openPlayerModal(p.name);}}>
                        <span style={{fontWeight:600,flex:1,fontSize:12}} dangerouslySetInnerHTML={{__html:`${p.name}${mq?`<span class="mq-badge">⚡ MARQUEE</span>`:''}`}}></span>
                        <span className={`p-role role-${p.role}`}>{p.role}</span>
                        <div style={{width:36,height:4,background:'#080B10',borderRadius:2,overflow:'hidden',marginLeft:6}}><div style={{height:'100%',borderRadius:2,background:mq?'linear-gradient(90deg,#39FF14,#00ff88)':'linear-gradient(90deg,#FF6B00,#FFD700)',width:`${pct}%`}}></div></div>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,minWidth:42,textAlign:'right',color:pp===maxP&&pp>0?'#FFD700':undefined}}>{pp}</span>
                      </div>);
                    })}
                  </div>
                </div>);
              })}
            </div>
          </div>
        )}

        {activeView==='auction'&&(
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>ALL PLAYERS</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
            </div>
            <PT value={playerPhase} onChange={setPlayerPhase}/>
            <div className="auction-wrap" style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:'1.5rem'}}>
              <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:12,overflow:'hidden'}}>
                <div style={{padding:'.75rem 1rem',borderBottom:'1px solid #2A3550',display:'flex',gap:6,flexWrap:'wrap'}}>
                  <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search player or IPL team…" style={{flex:1,minWidth:100,background:'#0D1119',border:'1px solid #2A3550',borderRadius:6,color:'#E8EDF5',fontFamily:"'Rajdhani',sans-serif",fontSize:13,padding:'8px 10px',outline:'none'}}/>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    {['ALL','BAT','BOWL','AR','WK','MARQUEE','UNSOLD'].map(f=>(
                      <button key={f} className={`filter-btn${activeFilter===f?' active':''}`} onClick={()=>setActiveFilter(f)} style={f==='UNSOLD'&&activeFilter===f?{borderColor:'#E8003D',color:'#E8003D',background:'rgba(232,0,61,0.08)'}:f==='UNSOLD'?{color:'#E8003D',borderColor:'rgba(232,0,61,0.3)'}:{}}>
                        {f==='MARQUEE'?'⚡':f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-row hdr">
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textTransform:'uppercase'}}>Player</div>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textTransform:'uppercase',textAlign:'right'}}>Role</div>
                  <div className="pt-col-hide" style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textTransform:'uppercase',textAlign:'right'}}>Owner</div>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textTransform:'uppercase',textAlign:'right'}}>Points</div>
                </div>
                {filteredPlayers().length>0?filteredPlayers().map(p=>(
                  <div key={p.name} className={`pt-row${p.isMarquee?' is-marquee':''}${p.isUnsold?' is-unsold':''}`} onClick={()=>{if(!p.isUnsold)openPlayerModal(p.name);}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600}} dangerouslySetInnerHTML={{__html:`${p.name}${p.isMarquee?`<span class="mq-badge">⚡ MARQUEE</span>`:''}${p.isUnsold?`<span class="unsold-badge">UNSOLD</span>`:''}`}}></div>
                      <div style={{fontSize:9,color:'#7A8BAA',letterSpacing:1}}>{p.ipl||'—'}{p.cost>0?` · ₹${p.cost}L`:''}</div>
                    </div>
                    <div style={{textAlign:'right'}}><span className={`p-role role-${p.role}`}>{p.role}</span></div>
                    <div className="pt-col-hide" style={{textAlign:'right',fontSize:10,color:p.ownerColor||'#7A8BAA',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.owner}</div>
                    <div style={{textAlign:'right',fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:12,color:p.pts>0?'#FFD700':'#7A8BAA'}}>{p.pts}</div>
                  </div>
                )):<div style={{padding:'2rem',textAlign:'center',color:'#7A8BAA'}}>No players match</div>}
              </div>
              <div className="auction-sidebar">
                <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'1.1rem',marginBottom:'1rem'}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',marginBottom:8}}>POINT SYSTEM</div>
                  {[['1 Run','1 pt','#00D4FF'],['1 Wicket','25 pts','#E8003D'],['1 Catch/St','5 pts','#00E676']].map(([l,v,c])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:'.55rem',fontSize:13}}><span style={{color:'#7A8BAA'}}>{l}</span><span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:c}}>{v}</span></div>
                  ))}
                </div>
                <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'1.1rem',marginBottom:'1rem'}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',marginBottom:6}}>MARQUEE (1.5×)</div>
                  <div style={{fontSize:11,color:'#7A8BAA',lineHeight:1.7}}>3 per team per phase. Multiplier applies within that phase only.</div>
                </div>
                <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'1.1rem'}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',marginBottom:6}}>PHASES</div>
                  <div style={{fontSize:11,color:'#7A8BAA',lineHeight:1.7}}><span style={{color:'#FF6B00'}}>Phase 1:</span> M1–M35<br/><span style={{color:'#7C4DFF'}}>Phase 2:</span> M36+<br/>New squads &amp; marquees from M36.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView==='progress'&&(
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>SEASON PROGRESS</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#FFD700',background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.2)',padding:'3px 8px',borderRadius:3}}>CUMULATIVE POINTS</div>
            </div>
            <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:12,padding:'1.5rem',overflowX:'auto'}}>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px 18px',marginBottom:'1.25rem'}}>
                {OWNERS.map(o=>{const last=getTeamCumulative(o.id).at(-1)||0;return(
                  <div key={o.id} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:700}}>
                    <div style={{width:10,height:10,borderRadius:'50%',background:o.color,flexShrink:0}}></div>
                    {o.name} <span style={{color:'#7A8BAA',fontWeight:400,marginLeft:2}}>{last} pts</span>
                  </div>
                );})}
              </div>
              <div style={{fontSize:10,color:'#7C4DFF',marginBottom:'0.75rem',display:'flex',alignItems:'center',gap:6}}>
                <div style={{width:20,height:1,borderTop:'1px dashed #7C4DFF'}}></div>
                <span>Purple dashed = Phase 2 starts (M{PHASE2_FROM_MATCH})</span>
              </div>
              {progressSVG()?<div dangerouslySetInnerHTML={{__html:progressSVG()!}}></div>:<div style={{textAlign:'center',color:'#7A8BAA',padding:'4rem',fontSize:13}}>Sync scores to see chart</div>}
            </div>
          </div>
        )}

        {activeView==='rawstats'&&(
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>RAW STATS</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',background:'rgba(42,53,80,0.3)',border:'1px solid #2A3550',padding:'3px 8px',borderRadius:3}}>{matchesPlayed} MATCHES</div>
            </div>
            <PT value={rawPhase} onChange={(v)=>{if(v!=='full')setRawPhase(v);}} showFull={false}/>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:'1.25rem'}}>
              {OWNERS.map(o=>(
                <button key={o.id} className={`raw-team-btn${rawTeam===o.id?' active':''}`} onClick={()=>setRawTeam(o.id)} style={{borderColor:rawTeam===o.id?o.color:undefined,color:rawTeam===o.id?o.color:undefined,background:rawTeam===o.id?`${o.color}15`:undefined}}>{o.name}</button>
              ))}
            </div>
            {matchesPlayed===0?<div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'3rem',textAlign:'center',color:'#7A8BAA',fontSize:13}}>No data yet. Enter Admin mode and hit Refresh.</div>:(
              <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'1rem',overflowX:'auto'}}>
                <div dangerouslySetInnerHTML={{__html:renderRawStats()}}></div>
              </div>
            )}
            {matchesPlayed>0&&(
              <div style={{marginTop:'1.5rem'}}>
                <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:16,letterSpacing:2,marginBottom:'0.75rem',color:'#7A8BAA'}}>ALL TEAMS SUMMARY</div>
                <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,overflow:'hidden',overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>
                    <thead><tr style={{background:'#0a0f18'}}>
                      {['Team','Phase 1','Phase 2','Total'].map(h=><th key={h} style={{padding:'8px 12px',border:'1px solid #1e2a3a',fontSize:10,fontWeight:700,letterSpacing:1,textAlign:h==='Team'?'left':'right',color:h==='Phase 1'?'#FF6B00':h==='Phase 2'?'#7C4DFF':'#7A8BAA',whiteSpace:'nowrap'}}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {sortedTeams(scores).map((owner,i)=>(
                        <tr key={owner.id} style={{cursor:'pointer',background:rawTeam===owner.id?`${owner.color}10`:undefined}} onClick={()=>setRawTeam(owner.id)}>
                          <td style={{padding:'7px 12px',border:'1px solid #1e2a3a',color:owner.color,fontWeight:700}}>{i+1}. {owner.name}</td>
                          <td style={{padding:'7px 12px',border:'1px solid #1e2a3a',textAlign:'right',color:'#FF6B00'}}>{teamPts(owner.id,scores,'phase1').toLocaleString()}</td>
                          <td style={{padding:'7px 12px',border:'1px solid #1e2a3a',textAlign:'right',color:'#7C4DFF'}}>{teamPts(owner.id,scores,'phase2').toLocaleString()}</td>
                          <td style={{padding:'7px 12px',border:'1px solid #1e2a3a',textAlign:'right',color:'#FFD700',fontWeight:700,fontSize:13}}>{teamPts(owner.id,scores,'full').toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <div id="music-player" style={{position:'fixed',bottom:'1.25rem',left:'1.25rem',zIndex:400,background:'linear-gradient(135deg,#0D1119,#161D2A)',border:'1px solid #2A3550',borderRadius:14,boxShadow:'0 8px 40px rgba(0,0,0,0.7)',width:musicCollapsed?175:275,overflow:'hidden',transition:'all 0.3s cubic-bezier(0.34,1.2,0.64,1)',userSelect:'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:9,padding:'9px 11px 7px',borderBottom:'1px solid rgba(42,53,80,0.5)'}}>
          <div style={{width:32,height:32,background:'linear-gradient(135deg,#FFD700,#FF6B00)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0,animation:isPlaying?'spin-disc 3s linear infinite':undefined}}>🎵</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',color:'#E8EDF5'}}>{TRACKS[currentTrack].title}</div>
            <div style={{fontSize:9,color:'#7A8BAA',marginTop:1}}>🎶 THE AUCTION ROOM</div>
          </div>
          <button onClick={()=>setMusicCollapsed(c=>!c)} style={{background:'none',border:'none',color:'#7A8BAA',fontSize:13,cursor:'pointer',padding:3,lineHeight:1,flexShrink:0}}>{musicCollapsed?'▴':'▾'}</button>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:5,padding:'7px 10px'}}>
          <button className="mp-btn" onClick={()=>{setCurrentTrack(t=>{const p=(t-1+TRACKS.length)%TRACKS.length;doTrack(p);return p;});}}>⏮</button>
          <button onClick={togglePlay} style={{background:'linear-gradient(135deg,#FFD700,#FF6B00)',color:'#000',width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,border:'none',cursor:'pointer',flexShrink:0}}>{isPlaying?'⏸':'▶'}</button>
          <button className="mp-btn" onClick={()=>{setCurrentTrack(t=>{const n=(t+1)%TRACKS.length;doTrack(n);return n;});}}>⏭</button>
          {!musicCollapsed&&(<div style={{flex:1,display:'flex',alignItems:'center',gap:5}}><span style={{fontSize:12,color:'#7A8BAA'}}>🔊</span><input type="range" min="0" max="100" value={volume} onChange={e=>handleVolumeChange(parseInt(e.target.value))} style={{flex:1,height:3,background:'#2A3550',borderRadius:2,outline:'none',cursor:'pointer',WebkitAppearance:'none'}}/></div>)}
        </div>
        {!musicCollapsed&&(
          <div style={{borderTop:'1px solid rgba(42,53,80,0.5)',padding:'4px 0'}}>
            {TRACKS.map((t,i)=>(
              <div key={i} className={`mp-ti${i===currentTrack?' active':''}`} onClick={()=>{setCurrentTrack(i);doTrack(i);}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:i===currentTrack?'#FFD700':'#7A8BAA',minWidth:14}}>{i+1}</span>
                <span style={{flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:10}}>{t.title}</span>
                <div className="mp-eq"><span style={{height:4}}></span><span style={{height:8}}></span><span style={{height:6}}></span></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{position:'absolute',width:1,height:1,opacity:0,pointerEvents:'none',top:0,left:0,overflow:'hidden'}}><div id="yt-player"></div></div>

      {showPinModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(6px)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
          <div style={{background:'#0D1119',border:'1px solid #2A3550',borderRadius:16,padding:'2rem',width:'100%',maxWidth:300,textAlign:'center'}}>
            <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:3,marginBottom:4}}>ADMIN ACCESS</div>
            <div style={{fontSize:11,color:'#7A8BAA',marginBottom:'1.5rem'}}>Enter PIN to manage scores</div>
            <input type="password" inputMode="numeric" maxLength={8} placeholder="••••" value={pinInput} onChange={e=>setPinInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')checkPin();}} style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:8,color:'#E8EDF5',fontFamily:"'JetBrains Mono',monospace",fontSize:24,letterSpacing:8,textAlign:'center',padding:14,width:'100%',outline:'none',marginBottom:'1rem'}} autoFocus/>
            <div style={{color:'#E8003D',fontSize:11,height:16,marginBottom:'.75rem'}}>{pinError}</div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>setShowPinModal(false)} style={{flex:1,background:'#1C2538',color:'#E8EDF5',border:'1px solid #2A3550',borderRadius:6,padding:'12px',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer'}}>Cancel</button>
              <button onClick={checkPin} style={{flex:1,background:'#FFD700',color:'#000',border:'none',borderRadius:6,padding:'12px',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:'pointer'}}>Unlock</button>
            </div>
          </div>
        </div>
      )}

      {modal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(6px)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div className="modal-sheet" style={{background:'#0D1119',border:'1px solid #2A3550',borderRadius:'16px 16px 0 0',width:'100%',maxWidth:560,maxHeight:'88vh',overflowY:'auto',boxShadow:'0 -8px 60px rgba(0,0,0,0.8)',animation:'modalUp 0.28s cubic-bezier(0.34,1.4,0.64,1)'}}>
            <div style={{width:36,height:4,background:'#2A3550',borderRadius:2,margin:'10px auto 0'}}></div>
            <div style={{padding:'1rem 1.5rem .9rem',borderBottom:'1px solid #2A3550',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:2,flex:1,minWidth:0,overflow:'hidden'}} dangerouslySetInnerHTML={{__html:modal.title}}></div>
              <button onClick={()=>setModal(null)} style={{background:'none',border:'1px solid #2A3550',color:'#7A8BAA',width:32,height:32,borderRadius:6,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginLeft:8}}>✕</button>
            </div>
            <div style={{padding:'1.25rem 1.5rem 2rem'}} dangerouslySetInnerHTML={{__html:modal.body}}></div>
          </div>
        </div>
      )}

      <div style={{position:'fixed',bottom:110,right:'1.5rem',background:'#1C2538',border:'1px solid #FFD700',borderRadius:8,padding:'10px 18px',fontSize:13,fontWeight:600,color:'#E8EDF5',zIndex:500,transform:toast.show?'translateY(0)':'translateY(80px)',opacity:toast.show?1:0,transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',maxWidth:320}}>
        {toast.msg}
      </div>
    </div>
  );
}

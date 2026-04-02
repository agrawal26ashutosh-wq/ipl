import { useEffect, useRef, useState, useCallback } from "react";

const ADMIN_PIN = '1235';
const CRICAPI_KEY = '7b21d228-1705-49c5-a590-08d8a9a49edd';
const COLORS = ['#FFD700','#00BFFF','#FF6B00','#00E676','#7C4DFF','#FF4081','#69F0AE','#EA80FC'];

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

const MARQUEE_SET = new Set(OWNERS.flatMap(o => o.marquee));
const POINTS = { run:1, wicket:25, catch:5 };
const MARQUEE_MULTIPLIER = 1.5;
const IPL_2026_SERIES_ID = '87c62aac-bc3c-4738-ab93-19da0690488f';

const PLAYERS = [
  // ── KAUSTUBH (id 1) ──
  {name:'Yashasvi Jaiswal',    ipl:'RR',   cost:8.6,  owner:1, role:'BAT'},
  {name:'Vaibhav Sooryavanshi', ipl:'RR',   cost:6.6,  owner:1, role:'BAT'},
  {name:'Prabhsimran Singh',   ipl:'PBKS', cost:4.0,  owner:1, role:'WK'},
  {name:'Rohit Sharma',        ipl:'MI',   cost:7.4,  owner:1, role:'BAT'},
  {name:'Shreyas Iyer',        ipl:'PBKS', cost:20.5, owner:1, role:'BAT'},
  {name:'Hardik Pandya',       ipl:'MI',   cost:6.2,  owner:1, role:'AR'},
  {name:'Salil Arora',         ipl:'SRH',  cost:0.2,  owner:1, role:'BOWL'},
  {name:'Vipraj Nigam',        ipl:'DC',   cost:1.8,  owner:1, role:'AR'},
  {name:'Yuzvendra Chahal',    ipl:'PBKS', cost:10.5, owner:1, role:'BOWL'},
  {name:'Mohammed Siraj',           ipl:'GT',   cost:3.0,  owner:1, role:'BOWL'},
  {name:'Ravi Bishnoi',        ipl:'RR',   cost:6.6,  owner:1, role:'BOWL'},
  {name:'Mayank Markande',     ipl:'MI',   cost:5.2,  owner:1, role:'BOWL'},
  {name:'Mayank Yadav',        ipl:'LSG',  cost:4.4,  owner:1, role:'BOWL'},
  {name:'Nandre Burger',       ipl:'RR',   cost:2.0,  owner:1, role:'BOWL'},
  {name:'Arjun Tendulkar',     ipl:'LSG',  cost:0.6,  owner:1, role:'BOWL'},
  {name:'Rasikh Salam Dar',    ipl:'RCB',  cost:6.0,  owner:1, role:'BOWL'},
  // ── MAITREYA (id 2) ──
  {name:'Jos Buttler',         ipl:'GT',   cost:19.5, owner:2, role:'WK'},
  {name:'Ayush Badoni',        ipl:'LSG',  cost:4.8,  owner:2, role:'BAT'},
  {name:'Shubham Dubey',       ipl:'RR',   cost:1.4,  owner:2, role:'AR'},
  {name:'Travis Head',         ipl:'SRH',  cost:20.5, owner:2, role:'BAT'},
  {name:'T Natarajan',         ipl:'DC',   cost:7.8,  owner:2, role:'BOWL'},
  {name:'Cameron Green',       ipl:'KKR',  cost:9.4,  owner:2, role:'AR'},
  {name:'Rashid Khan',         ipl:'GT',   cost:4.6,  owner:2, role:'BOWL'},
  {name:'Kartik Tyagi',        ipl:'KKR',  cost:1.2,  owner:2, role:'BOWL'},
  {name:'Deepak Chahar',       ipl:'MI',   cost:5.2,  owner:2, role:'BOWL'},
  {name:'Sanju Samson',        ipl:'CSK',  cost:17.5, owner:2, role:'WK'},
  {name:'Shahbaz Ahmed',       ipl:'LSG',  cost:0.4,  owner:2, role:'AR'},
  {name:'Marcus Stoinis',      ipl:'PBKS', cost:2.2,  owner:2, role:'AR'},
  {name:'Kartik Sharma',       ipl:'CSK',  cost:0.6,  owner:2, role:'BAT'},
  {name:'Kagiso Rabada',           ipl:'GT',   cost:1.2,  owner:2, role:'BOWL'},
  {name:'Rinku Singh',         ipl:'KKR',  cost:1.0,  owner:2, role:'BAT'},
  {name:'Venkatesh Iyer',      ipl:'RCB',  cost:1.0,  owner:2, role:'AR'},
  // ── MILANJEET (id 3) ──
  {name:'Abhishek Sharma',     ipl:'SRH',  cost:18.5, owner:3, role:'BAT'},
  {name:'Ruturaj Gaikwad',     ipl:'CSK',  cost:4.6,  owner:3, role:'BAT'},
  {name:'Ryan Rickelton',      ipl:'MI',   cost:1.0,  owner:3, role:'WK'}, 
  {name:'Pathum Nissanka',     ipl:'DC',   cost:1.0,  owner:3, role:'BAT'},
  {name:'Naman Dhir',          ipl:'MI',   cost:1.6,  owner:3, role:'BAT'},
  {name:'Tristan Stubbs',      ipl:'DC',   cost:1.0,  owner:3, role:'BAT'},
  {name:'Shimron Hetmyer',     ipl:'RR',   cost:1.0,  owner:3, role:'BAT'},
  {name:'Rajat Patidar',       ipl:'RCB',  cost:2.8,  owner:3, role:'BAT'},
  {name:'Nitish Kumar Reddy',  ipl:'SRH',  cost:4.4,  owner:3, role:'AR'}, 
  {name:'Marco Jansen',        ipl:'PBKS', cost:8.0,  owner:3, role:'AR'},
  {name:'Axar Patel',          ipl:'DC',   cost:1.0,  owner:3, role:'AR'},
  {name:'Pat Cummins',         ipl:'SRH',  cost:5.0,  owner:3, role:'AR'},
  {name:'Arshdeep Singh',      ipl:'PBKS', cost:7.0,  owner:3, role:'BOWL'},
  {name:'Kuldeep Yadav',       ipl:'DC',   cost:11.0, owner:3, role:'BOWL'},
  {name:'Prasidh Krishna',     ipl:'GT',   cost:4.0,  owner:3, role:'BOWL'},
  {name:'Shivang Kumar',       ipl:'SRH',  cost:0.2,  owner:3, role:'BOWL'},
  // ── AAYUSH (id 4) ──
  {name:'Ishant Sharma',       ipl:'GT',   cost:1.0,  owner:4, role:'BOWL'},
  {name:'Harpreet Brar',       ipl:'PBKS', cost:5.0,  owner:4, role:'AR'},
  {name:'Corbin Bosch',        ipl:'MI',   cost:1.0,  owner:4, role:'AR'},
  {name:'Azmatullah Omarzai',  ipl:'PBKS', cost:7.2,  owner:4, role:'AR'},
  {name:'Dewald Brevis',       ipl:'CSK',  cost:9.6,  owner:4, role:'BAT'},
  {name:'Sandeep Sharma',      ipl:'RR',   cost:0.2,  owner:4, role:'BOWL'},
  {name:'Jaydev Unadkat',      ipl:'SRH',  cost:8.2,  owner:4, role:'BOWL'},
  {name:'Tushar Deshpande',    ipl:'RR',   cost:7.2,  owner:4, role:'BOWL'},
  {name:'Jasprit Bumrah',      ipl:'MI',   cost:16.5, owner:4, role:'BOWL'},
  {name:'Shashank Singh',      ipl:'PBKS', cost:5.4,  owner:4, role:'BAT'},
  {name:'Quinton de Kock',     ipl:'MI',   cost:8.2,  owner:4, role:'WK'}, 
  {name:'MS Dhoni',            ipl:'CSK',  cost:5.2,  owner:4, role:'WK'},
  {name:'Vignesh Puthur',      ipl:'RR',   cost:0.2,  owner:4, role:'BOWL'},
  {name:'Mitchell Starc',      ipl:'DC',   cost:5.2,  owner:4, role:'BOWL'},
  {name:'Varun Chakaravarthy',  ipl:'KKR',  cost:19.5, owner:4, role:'BOWL'},
  {name:'Prashant Veer',       ipl:'CSK',  cost:0.4,  owner:4, role:'BOWL'},
  // ── PARE (id 5) ──
  {name:'Aniket Verma',        ipl:'SRH',  cost:4.0,  owner:5, role:'BAT'},
  {name:'Auqib Nabi Dar',           ipl:'DC',   cost:4.0,  owner:5, role:'BOWL'},
  {name:'Sherfane Rutherford', ipl:'MI',   cost:5.0,  owner:5, role:'BAT'},
  {name:'Prince Yadav',        ipl:'LSG',  cost:0.2,  owner:5, role:'BAT'},
  {name:'Zeeshan Ansari',      ipl:'SRH',  cost:4.2,  owner:5, role:'BOWL'},
  {name:'Yudhvir Singh Charak', ipl:'RR',   cost:0.4,  owner:5, role:'BOWL'},
  {name:'KL Rahul',            ipl:'DC',   cost:19.0, owner:5, role:'WK'},
  {name:'Nicholas Pooran',      ipl:'LSG',  cost:10.5, owner:5, role:'WK'},
  {name:'Romario Shepherd',    ipl:'RCB',  cost:6.4,  owner:5, role:'AR'},
  {name:'Josh Hazlewood',      ipl:'RCB',  cost:4.6,  owner:5, role:'BOWL'},
  {name:'Riyan Parag',         ipl:'RR',   cost:3.6,  owner:5, role:'AR'},
  {name:'Matt Henry',          ipl:'CSK',  cost:3.0,  owner:5, role:'BOWL'},
  {name:'Nitish Rana',         ipl:'DC',   cost:3.8,  owner:5, role:'BAT'},
  {name:'Shubman Gill',        ipl:'GT',   cost:22.0, owner:5, role:'BAT'},
  {name:'Lungi Ngidi',         ipl:'DC',   cost:4.8,  owner:5, role:'BOWL'},
  {name:'Ayush Mhatre',        ipl:'CSK',  cost:4.5,  owner:5, role:'BAT'},
  // ── JAYANT (id 6) ──
  {name:'Priyansh Arya',       ipl:'PBKS', cost:10.5, owner:6, role:'BAT'},
  {name:'Sai Sudharsan',       ipl:'GT',   cost:18.5, owner:6, role:'BAT'},
  {name:'Vaibhav Arora',       ipl:'KKR',  cost:6.0,  owner:6, role:'BOWL'},
  {name:'Tilak Varma',         ipl:'MI',   cost:5.8,  owner:6, role:'BAT'},
  {name:'Avesh Khan',          ipl:'LSG',  cost:6.4,  owner:6, role:'BOWL'},
  {name:'Rishabh Pant',        ipl:'LSG',  cost:10.5, owner:6, role:'WK'},
  {name:'Ashutosh Sharma',     ipl:'DC',   cost:1.2,  owner:6, role:'AR'},
  {name:'Krunal Pandya',       ipl:'RCB',  cost:9.2,  owner:6, role:'AR'},
  {name:'Ravindra Jadeja',     ipl:'RR',   cost:4.0,  owner:6, role:'AR'},
  {name:'Rahul Tewatia',       ipl:'GT',   cost:3.2,  owner:6, role:'AR'},
  {name:'Ravisrinivasan Sai Kishore',         ipl:'GT',   cost:6.4,  owner:6, role:'BOWL'},
  {name:'Harshal Patel',       ipl:'SRH',  cost:4.4,  owner:6, role:'BOWL'},
  {name:'Trent Boult',         ipl:'MI',   cost:13.0, owner:6, role:'BOWL'},
  {name:'Digvesh Rathi',       ipl:'LSG',  cost:0.4,  owner:6, role:'BOWL'},
  {name:'Mangesh Yadav',       ipl:'RCB',  cost:0.2,  owner:6, role:'BOWL'},
  // ── KHERA (id 7) ──
  {name:'Suryakumar Yadav',    ipl:'MI',   cost:19.5, owner:7, role:'BAT'},
  {name:'Abishek Porel',      ipl:'DC',   cost:7.0,  owner:7, role:'WK'},
  {name:'Heinrich Klaasen',    ipl:'SRH',  cost:12.0, owner:7, role:'WK'},
  {name:'Shivam Dube',         ipl:'CSK',  cost:11.0, owner:7, role:'AR'},
  {name:'Mukesh Kumar',        ipl:'DC',   cost:2.2,  owner:7, role:'BOWL'},
  {name:'Nehal Wadhera',       ipl:'PBKS', cost:6.8,  owner:7, role:'BAT'},
  {name:'Mitchell Marsh',         ipl:'LSG',  cost:13.5, owner:7, role:'AR'},
  {name:'Bhuvneshwar Kumar',   ipl:'RCB',  cost:5.8,  owner:7, role:'BOWL'},
  {name:'Jitesh Sharma',       ipl:'RCB',  cost:6.2,  owner:7, role:'WK'},
  {name:'Philip Salt',           ipl:'RCB',  cost:8.4,  owner:7, role:'WK'},
  {name:'Devdutt Padikkal',    ipl:'RCB',  cost:4.2,  owner:7, role:'BAT'}, 
  {name:'Abdul Samad',         ipl:'LSG',  cost:0.2,  owner:7, role:'BAT'},
  {name:'Krains Fuletra',      ipl:'SRH',  cost:0.2,  owner:7, role:'BOWL'},
  {name:'Tim Seifert',         ipl:'KKR',  cost:1.0,  owner:7, role:'WK'},
  {name:'Jacob Bethell',       ipl:'RCB',  cost:1.4,  owner:7, role:'AR'},
  {name:'Sameer Rizvi',        ipl:'DC',   cost:0.6,  owner:7, role:'BAT'},
  // ── ASHUTOSH (id 8) ──
  {name:'Virat Kohli',         ipl:'RCB',  cost:22.5, owner:8, role:'BAT'},
  {name:'Aiden Markram',       ipl:'LSG',  cost:16.0, owner:8, role:'BAT'},
  {name:'Ishan Kishan',        ipl:'SRH',  cost:19.5, owner:8, role:'WK'},
  {name:'Angkrish Raghuvanshi',ipl:'KKR',  cost:8.8,  owner:8, role:'BAT'},
  {name:'Mohsin Khan',         ipl:'LSG',  cost:0.6,  owner:8, role:'BOWL'},
  {name:'Ajinkya Rahane',      ipl:'KKR',  cost:8.6,  owner:8, role:'BAT'},
  {name:'Ramandeep Singh',     ipl:'KKR',  cost:1.6,  owner:8, role:'AR'},
  {name:'Finn Allen',          ipl:'KKR',  cost:10.0, owner:8, role:'WK'},
  {name:'Mohammed Shami',            ipl:'LSG',  cost:5.0,  owner:8, role:'BOWL'},
  {name:'Washington Sundar',   ipl:'GT',   cost:2.4,  owner:8, role:'AR'},
  {name:'Suyash Sharma',       ipl:'RCB',  cost:0.4,  owner:8, role:'BOWL'},
  {name:'Sunil Narine',        ipl:'KKR',  cost:2.4,  owner:8, role:'AR'},
  {name:'Dhruv Jurel',         ipl:'RR',   cost:1.0,  owner:8, role:'WK'},
  {name:'Noor Ahmad',          ipl:'CSK',  cost:1.0,  owner:8, role:'BOWL'},  // FIX: Ahmed → Ahmad
  {name:'Harsh Dubey',         ipl:'SRH',  cost:0.2,  owner:8, role:'BOWL'},
];

const EXCLUDED_API_NAMES = new Set([
  'jacob duffy', 'jacob g duffy',       // unsold, not in our pool
  'rahul chahar',                         // CSK bowler — would falsely match Deepak Chahar
  'khaleel ahmed',                        // CSK bowler — would falsely match Shahbaz Ahmed
  'gurnoor brar',                         // GT bowler — would falsely match Harpreet Brar
  'harshit rana',                         // KKR bowler — would falsely match Nitish Rana
]);

type Player = typeof PLAYERS[0];
type Owner = typeof OWNERS[0];
type ScoreEntry = { runs: number; wickets: number; catches: number; stumpings: number; matchPts: number[] };
type Scores = Record<string, ScoreEntry>;
type ActiveView = 'leaderboard' | 'teams' | 'auction' | 'progress' | 'rawstats';

// Match metadata stored alongside scores so raw stats tab can show dates/opponents
type MatchMeta = { id: string; name: string; date: string };

function isMarquee(name: string) { return MARQUEE_SET.has(name); }
function rawPts(name: string, scores: Scores) {
  const s = scores[name] || {runs:0,wickets:0,catches:0,stumpings:0};
  return s.runs*POINTS.run + s.wickets*POINTS.wicket + (s.catches+s.stumpings)*POINTS.catch;
}
function playerPts(name: string, scores: Scores) {
  const base = rawPts(name, scores);
  return isMarquee(name) ? Math.round(base * MARQUEE_MULTIPLIER) : base;
}
function teamPts(ownerId: number, scores: Scores) {
  return PLAYERS.filter(p=>p.owner===ownerId).reduce((sum,p)=>sum+playerPts(p.name,scores),0);
}
function sortedTeams(scores: Scores) { return [...OWNERS].sort((a,b)=>teamPts(b.id,scores)-teamPts(a.id,scores)); }
function ownerById(id: number): Owner | undefined { return OWNERS.find(o=>o.id===id); }

function fuzzyMatch(apiName: string | null | undefined): string | null {
  if (!apiName) return null;
  const apiLower = apiName.toLowerCase().replace(/[^a-z .]/g, '').trim();
  if (EXCLUDED_API_NAMES.has(apiLower)) return null;
  const eligible = PLAYERS.filter(p => p.ipl !== null);

  let f = eligible.find(p => p.name.toLowerCase() === apiLower);
  if (f) return f.name;

  const apiParts = apiLower.split(' ').filter(Boolean);
  if (apiParts.length >= 2) {
    const apiFirst = apiParts[0];
    const apiLast = apiParts[apiParts.length - 1];
    f = eligible.find(p => {
      const parts = p.name.toLowerCase().replace(/[^a-z .]/g,'').split(' ').filter(Boolean);
      if (parts.length < 2) return false;
      return parts[0] === apiFirst && parts[parts.length - 1] === apiLast;
    });
    if (f) return f.name;
  }

  const subMatches = eligible.filter(p => {
    const our = p.name.toLowerCase().replace(/[^a-z .]/g,'');
    return our.includes(apiLower) || apiLower.includes(our);
  });
  if (subMatches.length === 1) return subMatches[0].name;

  if (apiParts.length >= 1) {
    const apiLast = apiParts[apiParts.length - 1];
    const lastMatches = eligible.filter(p => {
      const parts = p.name.toLowerCase().replace(/[^a-z .]/g,'').split(' ').filter(Boolean);
      return parts[parts.length - 1] === apiLast;
    });
    if (lastMatches.length === 1) return lastMatches[0].name;
  }

  return null;
}

const SC_PREFIX = 'ipl26_sc_';
function getCached(id: string): unknown { try { const v = localStorage.getItem(SC_PREFIX+id); return v ? JSON.parse(v) : null; } catch(e) { return null; } }
function setCache(id: string, data: unknown) { try { localStorage.setItem(SC_PREFIX+id, JSON.stringify(data)); } catch(e) {} }

const TRACKS = [
  { id:'o6HZYvPPNGo', title:'Korbo Lorbo Jeetbo Re',   artist:'KKR · Vishal-Shekhar ft. SRK' },
  { id:'Dv_jwKBNMkQ', title:'IPL Anthem — Shor Macha', artist:'TATA IPL · Star Sports' },
  { id:'jLJb1KQLR0Q', title:'Tunna Tunna — Cricket 07',artist:'EA Sports Cricket 07 OST' },
];

declare global {
  interface Window {
    YT: { Player: new (id: string, opts: object) => YTPlayer; PlayerState: { PLAYING:number; PAUSED:number; ENDED:number } };
    onYouTubeIframeAPIReady?: () => void;
  }
}
interface YTPlayer {
  playVideo(): void; pauseVideo(): void; loadVideoById(id: string): void; setVolume(v: number): void; destroy(): void;
}

export default function Home() {
  const [scores, setScores] = useState<Scores>(() => {
    const s: Scores = {};
    PLAYERS.forEach(p => { s[p.name] = {runs:0,wickets:0,catches:0,stumpings:0,matchPts:[]}; });
    return s;
  });
  const [matchMetas, setMatchMetas] = useState<MatchMeta[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('leaderboard');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchesPlayed, setMatchesPlayed] = useState(0);
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('auctionAdmin') === '1');
  const [apiStatus, setApiStatus] = useState<{state:'idle'|'ok'|'err'|'loading', msg:string}>({state:'idle', msg:'Click Refresh to sync latest match data'});
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [modalContent, setModalContent] = useState<{title:string;body:string}|null>(null);
  const [toast, setToast] = useState<{msg:string;show:boolean}>({msg:'',show:false});
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  // Raw stats view state
  const [rawTeam, setRawTeam] = useState<number>(1);

  // Music player
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [musicCollapsed, setMusicCollapsed] = useState(false);
  const ytPlayerRef = useRef<YTPlayer|null>(null);
  const ytReadyRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const skipConsecutiveRef = useRef(0);
  const skipCooldownRef = useRef(false);

  function showToast(msg: string) {
    setToast({msg, show:true});
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(t => ({...t,show:false})), 3500);
  }

  useEffect(() => {
    if (document.getElementById('yt-api-script')) return;
    const tag = document.createElement('script');
    tag.id = 'yt-api-script';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => {
      ytPlayerRef.current = new window.YT.Player('yt-player', {
        height:'1', width:'1', videoId:TRACKS[0].id,
        playerVars:{autoplay:0,controls:0,disablekb:1,fs:0,rel:0,modestbranding:1,origin:window.location.origin},
        events:{
          onReady:(e:{target:YTPlayer}) => { ytReadyRef.current=true; e.target.setVolume(volume); if (pendingPlayRef.current){e.target.playVideo();pendingPlayRef.current=false;} },
          onStateChange:(e:{data:number}) => {
            if (e.data===window.YT.PlayerState.PLAYING){setIsPlaying(true);skipConsecutiveRef.current=0;}
            else if (e.data===window.YT.PlayerState.PAUSED||e.data===window.YT.PlayerState.ENDED) setIsPlaying(false);
            if (e.data===window.YT.PlayerState.ENDED){setCurrentTrack(t=>{const next=(t+1)%TRACKS.length;setTimeout(()=>doSelectTrack(next),100);return next;});}
          },
          onError:(e:{data:number}) => {
            if (e.data!==100&&e.data!==101&&e.data!==150) return;
            if (skipCooldownRef.current) return;
            skipCooldownRef.current=true; skipConsecutiveRef.current+=1; setIsPlaying(false);
            if (skipConsecutiveRef.current>=TRACKS.length){skipConsecutiveRef.current=0;skipCooldownRef.current=false;showToast('Music unavailable in this context');return;}
            showToast('Track unavailable — skipping…');
            setCurrentTrack(t=>{const next=(t+1)%TRACKS.length;setTimeout(()=>{skipCooldownRef.current=false;doSelectTrack(next);},1500);return next;});
          }
        }
      });
    };
  }, []);

  function doSelectTrack(i: number) {
    setCurrentTrack(i);
    if (ytReadyRef.current && ytPlayerRef.current){ytPlayerRef.current.loadVideoById(TRACKS[i].id);ytPlayerRef.current.setVolume(volume);setIsPlaying(true);}
  }
  function togglePlay() {
    if (!ytReadyRef.current){pendingPlayRef.current=true;showToast('Player loading… click play again in a moment');return;}
    if (isPlaying) ytPlayerRef.current?.pauseVideo(); else ytPlayerRef.current?.playVideo();
  }
  function handleVolumeChange(val: number) { setVolumeState(val); if (ytReadyRef.current&&ytPlayerRef.current) ytPlayerRef.current.setVolume(val); }

  const autoPlayDone = useRef(false);
  useEffect(() => {
    function handleFirstClick() {
      if (autoPlayDone.current) return; autoPlayDone.current=true; document.removeEventListener('click',handleFirstClick);
      if (ytReadyRef.current&&ytPlayerRef.current&&!isPlaying) ytPlayerRef.current.playVideo(); else pendingPlayRef.current=true;
    }
    document.addEventListener('click',handleFirstClick);
    return ()=>document.removeEventListener('click',handleFirstClick);
  }, []);

  function toggleAdmin() {
    if (isAdmin){setIsAdmin(false);sessionStorage.removeItem('auctionAdmin');showToast('Admin mode off');}
    else{setPinInput('');setPinError('');setShowPinModal(true);}
  }
  function checkPin() {
    if (pinInput===ADMIN_PIN){setIsAdmin(true);sessionStorage.setItem('auctionAdmin','1');setShowPinModal(false);showToast('✓ Admin mode on');}
    else{setPinError('Incorrect PIN — try again');setPinInput('');}
  }

  function clearScorecardCache() { Object.keys(localStorage).filter(k=>k.startsWith(SC_PREFIX)).forEach(k=>localStorage.removeItem(k)); }
  async function handleRefresh() { clearScorecardCache(); await syncScores(); }

  async function processMatch(matchId: string, matchName: string, currentScores: Scores): Promise<{scores:Scores;isNew:boolean}> {
    try {
      let scorecard = getCached(matchId) as any[] | null;
      let isNew = false;
      if (!scorecard) {
        const r = await fetch(`https://api.cricapi.com/v1/match_scorecard?apikey=${CRICAPI_KEY}&id=${matchId}`);
        const d = await r.json();
        if (d.status !== 'success') return {scores:currentScores,isNew:false};
        scorecard = d.data?.scorecard || [];
        setCache(matchId, scorecard);
        isNew = true;
      }

      const updatedScores = {...currentScores};
      Object.keys(updatedScores).forEach(k => { updatedScores[k]={...updatedScores[k],matchPts:[...updatedScores[k].matchPts]}; });
      const mPts: Record<string,number> = {};

      scorecard!.forEach((innings: any) => {
        (innings.batting||[]).forEach((b: any) => {
          const m = fuzzyMatch(b.batsman?.name);
          if (m && updatedScores[m]) {
            updatedScores[m].runs += (b.r||0);
            mPts[m] = (mPts[m]||0) + (b.r||0)*POINTS.run;
          }

          function fielder(row: any): string|null {
            if (row.catcher?.name) return row.catcher.name;
            const t = (row['dismissal-text']||'').trim();
            if (/^c & b /i.test(t)) return t.replace(/^c & b /i,'').trim();
            if (/^c /i.test(t)&&t.includes(' b ')) return t.substring(2,t.indexOf(' b ')).trim();
            if (/^st /i.test(t)&&t.includes(' b ')) return t.substring(3,t.indexOf(' b ')).trim();
            return null;
          }

          const dt = (b.dismissal||'').toLowerCase();
          // FIX: handle both 'caught' and 'catch' (CricAPI uses 'caught')
          if (dt==='caught'||dt==='catch') {
            const f = fuzzyMatch(fielder(b));
            if (f&&updatedScores[f]){updatedScores[f].catches+=1;mPts[f]=(mPts[f]||0)+POINTS.catch;}
          } else if (dt==='stumped'||dt==='st') {
            const f = fuzzyMatch(fielder(b));
            if (f&&updatedScores[f]){updatedScores[f].stumpings+=1;mPts[f]=(mPts[f]||0)+POINTS.catch;}
          }
        });

        (innings.bowling||[]).forEach((bw: any) => {
          const m = fuzzyMatch(bw.bowler?.name);
          if (m&&updatedScores[m]){updatedScores[m].wickets+=(bw.w||0);mPts[m]=(mPts[m]||0)+(bw.w||0)*POINTS.wicket;}
        });
      });

      Object.keys(updatedScores).forEach(name => { updatedScores[name].matchPts.push(mPts[name]||0); });
      return {scores:updatedScores,isNew};
    } catch(e) { return {scores:currentScores,isNew:false}; }
  }

  async function syncScores() {
    setApiStatus({state:'loading',msg:'Fetching IPL 2026 match list…'});
    try {
      const r = await fetch(`https://api.cricapi.com/v1/series_info?apikey=${CRICAPI_KEY}&id=${IPL_2026_SERIES_ID}`);
      const d = await r.json();
      if (d.status!=='success') throw new Error(d.reason||'API error');
      const completed = (d.data?.matchList||[])
  .filter((m:any) => m.matchStarted && m.matchEnded)
  .sort((a:any, b:any) => {
    const dateA = new Date(a.dateTimeGMT || a.date || 0).getTime();
    const dateB = new Date(b.dateTimeGMT || b.date || 0).getTime();
    return dateA - dateB;
  });
      setMatchesPlayed(completed.length);

      const metas: MatchMeta[] = completed.map((m:any) => ({
        id: m.id,
        name: m.name || m.matchType || `Match`,
        date: m.date || m.dateTimeGMT || '',
      }));
      setMatchMetas(metas);

      let currentScores: Scores = {};
      PLAYERS.forEach(p => { currentScores[p.name]={runs:0,wickets:0,catches:0,stumpings:0,matchPts:[]}; });
      let fetched=0,cached=0;
      setApiStatus({state:'loading',msg:`Processing ${completed.length} matches…`});
      for (const match of completed) {
        const result = await processMatch(match.id, match.name||match.id, currentScores);
        currentScores = result.scores;
        result.isNew ? fetched++ : cached++;
      }
      setScores(currentScores);
      setApiStatus({state:'ok',msg:`✓ Synced · ${completed.length} matches · ${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}`});
      showToast(`✓ ${completed.length} matches · ${fetched} new, ${cached} cached`);
    } catch(err:unknown) {
      const msg = err instanceof Error ? err.message : 'Check key';
      setApiStatus({state:'err',msg:'Sync failed · '+msg});
      showToast('✗ '+msg);
    }
  }

  function marqueeBadge() {
    return `<span style="display:inline-flex;align-items:center;gap:3px;background:rgba(57,255,20,0.12);border:1px solid rgba(57,255,20,0.35);border-radius:3px;padding:1px 5px;font-size:8px;font-weight:700;letter-spacing:1.5px;color:#39FF14;margin-left:5px;vertical-align:middle;white-space:nowrap;box-shadow:0 0 8px rgba(57,255,20,0.3)">⚡ MARQUEE</span>`;
  }
  function esc(s: string) { return s.replace(/'/g,"\\'"); }

  function renderLeaderboard() {
    const ranked = sortedTeams(scores);
    const topTeam = ranked[0];
    const topPts = teamPts(topTeam.id,scores);
    const topP = PLAYERS.reduce((b,p)=>playerPts(p.name,scores)>playerPts(b.name,scores)?p:b,PLAYERS[0]);
    return {ranked,topTeam,topPts,topP};
  }
  function getMVP() {
    return PLAYERS.filter(p=>p.cost>0).map(p=>{
      const pts=playerPts(p.name,scores);const owner=ownerById(p.owner);const ratio=pts>0?(pts/(p.cost/100)):0;return{p,pts,ratio,owner};
    }).sort((a,b)=>b.ratio-a.ratio).slice(0,15);
  }
  function getTeamCumulative(ownerId: number): number[] {
    const squad=PLAYERS.filter(p=>p.owner===ownerId);
    const maxLen=Math.max(...squad.map(p=>(scores[p.name]?.matchPts||[]).length),0);
    if (!maxLen) return [];
    const cum:number[]=[]; let running=0;
    for (let i=0;i<maxLen;i++){
      running+=squad.reduce((s,p)=>{const mp=scores[p.name]?.matchPts||[];const mr=mp[i]||0;return s+(isMarquee(p.name)?Math.round(mr*MARQUEE_MULTIPLIER):mr);},0);
      cum.push(running);
    }
    return cum;
  }

  function openPlayerModal(name: string) {
    const p=PLAYERS.find(x=>x.name===name); if (!p) return;
    const owner=ownerById(p.owner);const s=scores[name]||{runs:0,wickets:0,catches:0,stumpings:0,matchPts:[]};
    const raw=rawPts(name,scores);const pp=playerPts(name,scores);const mq=isMarquee(name);
    const bars=s.matchPts.length?(() => {const mx=Math.max(...s.matchPts,1);return s.matchPts.map(v=>`<div style="flex:1;border-radius:3px 3px 0 0;background:linear-gradient(180deg,#FF6B00,#B8960A);min-height:4px;height:${Math.round((v/mx)*50)+4}px"></div>`).join('');})():`<div style="color:#7A8BAA;font-size:11px;padding:8px 0">No match data yet · sync to update</div>`;
    const body=`
      <div class="m-stat"><span class="m-lbl">IPL Franchise</span><span class="m-val">${p.ipl||'—'}</span></div>
      <div class="m-stat"><span class="m-lbl">Owned by</span><span class="m-val" style="color:${owner?.color||'#E8EDF5'}">${owner?.name||'—'}</span></div>
      <div class="m-stat"><span class="m-lbl">Auction Price</span><span class="m-val" style="color:#00E676">₹${p.cost}L</span></div>
      ${mq?`<div class="m-stat"><span class="m-lbl">Marquee Multiplier</span><span class="m-val" style="color:#39FF14">1.5× all season ⚡</span></div>`:''}
      <div class="m-stat"><span class="m-lbl">Fantasy Points</span><span class="m-val" style="color:#FFD700;font-size:20px">${pp}${mq?`<span style="font-size:11px;color:#7A8BAA;margin-left:4px">(base: ${raw})</span>`:''}</span></div>
      <div style="border-top:1px solid #2A3550;margin:10px 0"></div>
      <div class="m-stat"><span class="m-lbl">Runs</span><span class="m-val">${s.runs} <span style="color:#7A8BAA;font-size:10px">(${s.runs*POINTS.run} pts)</span></span></div>
      <div class="m-stat"><span class="m-lbl">Wickets</span><span class="m-val">${s.wickets} <span style="color:#7A8BAA;font-size:10px">(${s.wickets*POINTS.wicket} pts)</span></span></div>
      <div class="m-stat"><span class="m-lbl">Catches</span><span class="m-val">${s.catches} <span style="color:#7A8BAA;font-size:10px">(${s.catches*POINTS.catch} pts)</span></span></div>
      <div class="m-stat"><span class="m-lbl">Stumpings</span><span class="m-val">${s.stumpings} <span style="color:#7A8BAA;font-size:10px">(${s.stumpings*POINTS.catch} pts)</span></span></div>
      <div style="font-size:9px;font-weight:700;letter-spacing:2px;color:#7A8BAA;text-transform:uppercase;margin:1rem 0 .5rem">Match-by-match breakdown</div>
      <div style="display:flex;align-items:flex-end;gap:4px;height:54px;margin-top:10px">${bars}</div>`;
    setModalContent({title:`${name} <span class="p-role role-${p.role}" style="font-size:12px;vertical-align:middle;margin-left:6px">${p.role}</span>${mq?marqueeBadge():''}`,body});
  }

  function openTeamModal(ownerId: number) {
    const owner=ownerById(ownerId)!;
    const squad=PLAYERS.filter(p=>p.owner===ownerId).sort((a,b)=>playerPts(b.name,scores)-playerPts(a.name,scores));
    const tp=teamPts(ownerId,scores);const rank=sortedTeams(scores).findIndex(o=>o.id===ownerId)+1;
    const spent=squad.reduce((s,p)=>s+p.cost,0);const marqueeNames=owner.marquee.join(', ');
    const body=`
      <div class="m-stat"><span class="m-lbl">Current Rank</span><span class="m-val" style="color:#FFD700">#${rank} of 8</span></div>
      <div class="m-stat"><span class="m-lbl">Total Points</span><span class="m-val" style="font-size:18px">${tp.toLocaleString()}</span></div>
      <div class="m-stat"><span class="m-lbl">Players in Squad</span><span class="m-val">${squad.length}</span></div>
      <div class="m-stat"><span class="m-lbl">Total Auction Spend</span><span class="m-val" style="color:#00E676">₹${spent.toFixed(1)}L</span></div>
      <div class="m-stat"><span class="m-lbl">Marquee Players ⚡</span><span class="m-val" style="color:#39FF14;font-size:11px">${marqueeNames}</span></div>
      <div style="font-size:9px;font-weight:700;letter-spacing:2px;color:#7A8BAA;text-transform:uppercase;margin:1rem 0 .5rem">Full Squad · ${squad.length} players</div>
      ${squad.map(p=>{const mq=isMarquee(p.name);return `<div class="mh-row" onclick="window.__openPlayerModal('${esc(p.name)}')" style="cursor:pointer${mq?' background:rgba(57,255,20,0.04)':''}"><span>${p.name}${mq?marqueeBadge():''} <span class="p-role role-${p.role}" style="font-size:8px;margin-left:4px">${p.role}</span> <span style="font-size:10px;color:#7A8BAA">${p.ipl||''}</span></span><span class="mh-pts">${playerPts(p.name,scores)}</span></div>`;}).join('')}`;
    setModalContent({title:`<span style="color:${owner.color}">${owner.name}'s Squad</span>`,body});
  }

  useEffect(() => {
    (window as any)['__openPlayerModal'] = (name: string) => { setModalContent(null); setTimeout(()=>openPlayerModal(name),180); };
  }, [scores]);

  const {ranked,topTeam,topPts,topP} = renderLeaderboard();
  const mvp = getMVP();

  const filteredPlayers = useCallback(() => {
    return PLAYERS.filter(p=>{
      if (activeFilter==='MARQUEE') return isMarquee(p.name);
      const rm=activeFilter==='ALL'||p.role===activeFilter;
      const qm=!searchQuery||p.name.toLowerCase().includes(searchQuery.toLowerCase())||(p.ipl||'').toLowerCase().includes(searchQuery.toLowerCase())||(ownerById(p.owner)?.name||'').toLowerCase().includes(searchQuery.toLowerCase());
      return rm&&qm;
    }).sort((a,b)=>playerPts(b.name,scores)-playerPts(a.name,scores));
  }, [activeFilter,searchQuery,scores]);

  const progressSVG = useCallback(() => {
    const W=680,H=340,PAD={top:20,right:120,bottom:40,left:52};
    const cW=W-PAD.left-PAD.right,cH=H-PAD.top-PAD.bottom;
    const series=OWNERS.map(o=>({owner:o,pts:getTeamCumulative(o.id)}));
    const maxM=Math.max(...series.map(s=>s.pts.length),1);
    const maxP=Math.max(...series.flatMap(s=>s.pts),1);
    if (maxM<=1&&maxP<=1) return null;
    const xS=(i:number)=>PAD.left+(i/(maxM-1||1))*cW;
    const yS=(v:number)=>PAD.top+cH-(v/maxP)*cH;
    const gridLines=[0,.25,.5,.75,1].map(f=>{const y=PAD.top+cH*(1-f),label=Math.round(maxP*f);return `<line x1="${PAD.left}" y1="${y}" x2="${PAD.left+cW}" y2="${y}" stroke="rgba(42,53,80,0.5)" stroke-width="1"/><text x="${PAD.left-6}" y="${y+4}" fill="#7A8BAA" font-size="9" text-anchor="end" font-family="JetBrains Mono">${label}</text>`;}).join('');
    const xLabels=Array.from({length:maxM},(_,i)=>`<text x="${xS(i)}" y="${PAD.top+cH+16}" fill="#7A8BAA" font-size="9" text-anchor="middle" font-family="JetBrains Mono">M${i+1}</text>`).join('');
    const lines=series.map(({owner,pts})=>{if (!pts.length) return '';const points=pts.map((v,i)=>`${xS(i)},${yS(v)}`).join(' ');const lx=xS(pts.length-1),ly=yS(pts[pts.length-1]);return `<polyline points="${points}" fill="none" stroke="${owner.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/><circle cx="${lx}" cy="${ly}" r="4" fill="${owner.color}"/><text x="${lx+10}" y="${ly+4}" fill="${owner.color}" font-size="10" font-weight="700" font-family="Rajdhani">${owner.name}</text>`;}).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;min-width:400px;height:auto;display:block">${gridLines}${xLabels}${lines}<line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top+cH}" stroke="#2A3550" stroke-width="1"/><line x1="${PAD.left}" y1="${PAD.top+cH}" x2="${PAD.left+cW}" y2="${PAD.top+cH}" stroke="#2A3550" stroke-width="1"/></svg>`;
  }, [scores]);

  // Ticker auto-generated from actual marquee data — names always in sync with CricAPI
  const marqueeTickerItems = OWNERS.flatMap(o =>
    o.marquee.map(name => {
      const p = PLAYERS.find(x => x.name === name);
      return `${name} (${o.name}) ⚡ MARQUEE for ${p?.ipl || ''}`;
    })
  );
  const tickerItems = ['IPL 2026 · Season Underway', '⚡ Marquee system LIVE — 1.5× points for star picks', ...marqueeTickerItems];
  const tickerDoubled = [...tickerItems, ...tickerItems];

  // ── RAW STATS VIEW ──────────────────────────────────────────────────────────
  function renderRawStats() {
    const owner = ownerById(rawTeam)!;
    const squad = PLAYERS.filter(p => p.owner === rawTeam).sort((a,b) => playerPts(b.name,scores)-playerPts(a.name,scores));
    const numMatches = matchesPlayed || Math.max(...squad.map(p => (scores[p.name]?.matchPts||[]).length), 0);

    // Column headers: player info + one column per match + totals
    const matchCols = Array.from({length: numMatches}, (_,i) => i);

    const td = (content: string|number, style='') =>
      `<td style="padding:5px 8px;border:1px solid #1e2a3a;font-size:11px;font-family:'JetBrains Mono',monospace;white-space:nowrap;${style}">${content}</td>`;
    const th = (content: string, style='') =>
      `<th style="padding:5px 8px;border:1px solid #1e2a3a;font-size:10px;font-weight:700;letter-spacing:1px;background:#0a0f18;white-space:nowrap;text-align:center;${style}">${content}</th>`;

    // Build match header labels from metas if available
    const matchLabel = (i: number) => {
      const m = matchMetas[i];
      if (!m) return `M${i+1}`;
      // Extract short team names from match name like "RCB vs SRH, Match 1"
      const short = m.name.replace(/,.*$/, '').trim();
      return `M${i+1}`;
    };
    const matchTitle = (i: number) => {
      const m = matchMetas[i];
      if (!m) return `Match ${i+1}`;
      return `${m.name}${m.date ? ' · '+m.date.slice(0,10) : ''}`;
    };

    let tableRows = '';
    let teamRunsTotal = 0, teamWkTotal = 0, teamCatchTotal = 0, teamStmpTotal = 0;
    const teamMatchPts = Array(numMatches).fill(0);

    for (const p of squad) {
      const s = scores[p.name] || {runs:0,wickets:0,catches:0,stumpings:0,matchPts:[]};
      const mq = isMarquee(p.name);
      const base = rawPts(p.name,scores);
      const final = playerPts(p.name,scores);
      teamRunsTotal += s.runs; teamWkTotal += s.wickets; teamCatchTotal += s.catches; teamStmpTotal += s.stumpings;

      const matchCells = matchCols.map(i => {
        const mp = s.matchPts[i] ?? 0;
        const color = mp > 0 ? '#FFD700' : mp === 0 ? '#3a4a60' : '#E8EDF5';
        teamMatchPts[i] = (teamMatchPts[i]||0) + (mq ? Math.round(mp*MARQUEE_MULTIPLIER) : mp);
        return td(mp > 0 ? `+${mp}` : mp===0 ? '—' : mp, `color:${color};text-align:center;`);
      }).join('');

      const rowBg = mq ? 'background:rgba(57,255,20,0.04);' : '';
      const nameStyle = `color:${owner.color};font-weight:700;font-size:11px;`;
      tableRows += `<tr style="${rowBg}">
        ${td(`<span style="${nameStyle}">${p.name}${mq?' ⚡':''}</span>`, 'min-width:140px;')}
        ${td(p.role, 'color:#7A8BAA;text-align:center;')}
        ${td(p.ipl||'—', 'color:#7A8BAA;text-align:center;')}
        ${td(s.runs, 'color:#00D4FF;text-align:right;')}
        ${td(s.wickets, 'color:#E8003D;text-align:right;')}
        ${td(s.catches+s.stumpings, 'color:#00E676;text-align:right;')}
        ${td(base, 'color:#aaa;text-align:right;')}
        ${td(final, `color:#FFD700;font-weight:700;text-align:right;${mq?'text-decoration:underline dotted;':''}`)}
        ${matchCells}
      </tr>`;
    }

    // Team totals row
    const teamBase = PLAYERS.filter(p=>p.owner===rawTeam).reduce((s,p)=>s+rawPts(p.name,scores),0);
    const teamFinal = teamPts(rawTeam,scores);
    const matchTotalCells = teamMatchPts.map(v => td(v>0?`+${v}`:'—', `color:${v>0?'#FFD700':'#3a4a60'};text-align:center;font-weight:700;`)).join('');

    const totalsRow = `<tr style="background:#0a0f18;font-weight:700;">
      ${td('TEAM TOTAL','color:#FFD700;font-weight:700;font-size:12px;')}
      ${td('','text-align:center;')}
      ${td('','text-align:center;')}
      ${td(teamRunsTotal,'color:#00D4FF;text-align:right;font-weight:700;')}
      ${td(teamWkTotal,'color:#E8003D;text-align:right;font-weight:700;')}
      ${td(teamCatchTotal+teamStmpTotal,'color:#00E676;text-align:right;font-weight:700;')}
      ${td(teamBase,'color:#aaa;text-align:right;font-weight:700;')}
      ${td(teamFinal,`color:#FFD700;text-align:right;font-weight:700;font-size:13px;`)}
      ${matchTotalCells}
    </tr>`;

    const matchHeaders = matchCols.map(i =>
      th(`<span title="${matchTitle(i)}" style="cursor:help">${matchLabel(i)}</span>`, 'min-width:44px;')
    ).join('');

    const table = `
      <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">
      <table style="border-collapse:collapse;width:100%;font-family:'JetBrains Mono',monospace;font-size:11px;">
        <thead>
          <tr>
            ${th('Player','text-align:left;min-width:140px;')}
            ${th('Role')}
            ${th('IPL')}
            ${th('Runs','color:#00D4FF;')}
            ${th('Wkts','color:#E8003D;')}
            ${th('C+St','color:#00E676;')}
            ${th('Base Pts','color:#aaa;')}
            ${th('Final Pts','color:#FFD700;')}
            ${matchHeaders}
          </tr>
        </thead>
        <tbody>${tableRows}${totalsRow}</tbody>
      </table>
      </div>`;

    // Scoring key reminder
    const key = `<div style="margin-top:12px;font-size:10px;color:#7A8BAA;font-family:'JetBrains Mono',monospace;display:flex;gap:16px;flex-wrap:wrap;">
      <span>Run = 1pt</span><span>Wicket = 25pts</span><span>Catch/Stumping = 5pts</span><span style="color:#39FF14;">⚡ Marquee = ×1.5 final pts</span>
      <span style="color:#aaa;">Match cols = raw base pts (pre-multiplier)</span>
    </div>`;

    return table + key;
  }

  return (
    <div style={{background:'#080B10',color:'#E8EDF5',fontFamily:"'Rajdhani',sans-serif",minHeight:'100vh',overflowX:'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        :root{--gold:#FFD700;--gold-dim:#B8960A;--orange:#FF6B00;--red:#E8003D;--bg:#080B10;--bg2:#0D1119;--card:#161D2A;--card2:#1C2538;--border:#2A3550;--text:#E8EDF5;--text-dim:#7A8BAA;--green:#00E676;--cyan:#00D4FF;--purple:#7C4DFF;--marquee:#39FF14;}
        *{margin:0;padding:0;box-sizing:border-box;}
        body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);pointer-events:none;z-index:1000;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes spin-disc{to{transform:rotate(360deg)}}
        @keyframes eq-bounce{from{height:4px}to{height:12px}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .live-dot{width:6px;height:6px;background:#E8003D;border-radius:50%;animation:pulse 1.2s ease-in-out infinite;}
        .ticker-track{display:flex;animation:ticker 40s linear infinite;gap:60px;padding-left:20px;}
        .spinner{display:inline-block;width:12px;height:12px;border:2px solid #2A3550;border-top-color:#FFD700;border-radius:50%;animation:spin 0.7s linear infinite;vertical-align:middle;margin-right:5px;}
        .lb-row{display:grid;grid-template-columns:44px 1fr 70px 80px 80px 100px;align-items:center;padding:0 1.25rem;height:54px;border-bottom:1px solid rgba(42,53,80,0.5);transition:background 0.15s;cursor:pointer;}
        .lb-row:hover{background:rgba(255,255,255,0.03);}
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
        .marquee-badge{display:inline-flex;align-items:center;gap:3px;background:rgba(57,255,20,0.12);border:1px solid rgba(57,255,20,0.35);border-radius:3px;padding:1px 5px;font-size:8px;font-weight:700;letter-spacing:1.5px;color:#39FF14;margin-left:5px;vertical-align:middle;white-space:nowrap;box-shadow:0 0 8px rgba(57,255,20,0.3);}
        .pt-row{display:grid;grid-template-columns:1fr 55px 85px 75px;align-items:center;padding:0 1.1rem;height:46px;border-bottom:1px solid rgba(42,53,80,0.4);font-size:12px;cursor:pointer;transition:background 0.12s;}
        .pt-row:hover{background:rgba(255,255,255,0.03);}
        .pt-row:last-child{border-bottom:none;}
        .pt-row.hdr{background:#0D1119;height:32px;cursor:default;}.pt-row.hdr:hover{background:#0D1119;}
        .pt-row.is-marquee{background:rgba(57,255,20,0.04);}
        .team-card{background:#161D2A;border:1px solid #2A3550;border-radius:12px;overflow:hidden;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;}
        .team-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.5);}
        .p-row{display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(42,53,80,0.4);font-size:12px;}
        .p-row:last-child{border-bottom:none;}
        .p-row.is-marquee{background:rgba(57,255,20,0.04);border-bottom-color:rgba(57,255,20,0.15);}
        .filter-btn{background:#0D1119;border:1px solid #2A3550;border-radius:5px;color:#7A8BAA;font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;padding:5px 9px;cursor:pointer;transition:all 0.15s;}
        .filter-btn.active{border-color:#FFD700;color:#FFD700;background:rgba(255,215,0,0.08);}
        .mvp-card{background:#161D2A;border:1px solid #2A3550;border-radius:10px;padding:.9rem 1rem;display:flex;align-items:center;gap:.75rem;cursor:pointer;transition:background 0.15s;}
        .mvp-card:hover{background:#1C2538;}
        .nav-btn{background:none;border:none;color:#7A8BAA;font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:6px 12px;border-radius:4px;cursor:pointer;transition:all 0.2s;position:relative;}
        .nav-btn.active{color:#FFD700;background:rgba(255,215,0,0.08);}
        .nav-btn.active::after{content:'';position:absolute;bottom:0;left:12px;right:12px;height:2px;background:#FFD700;border-radius:2px;}
        .nav-btn:hover:not(.active){color:#E8EDF5;background:rgba(255,255,255,0.05);}
        .m-stat{display:flex;justify-content:space-between;margin-bottom:.55rem;font-size:13px;}
        .m-lbl{color:#7A8BAA;}.m-val{font-weight:700;font-family:'JetBrains Mono',monospace;}
        .mh-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(42,53,80,0.4);font-size:12px;}
        .mh-pts{font-family:'JetBrains Mono',monospace;font-weight:700;color:#FFD700;}
        .mp-btn{background:none;border:none;color:#7A8BAA;font-size:16px;cursor:pointer;padding:4px;line-height:1;transition:color 0.15s;flex-shrink:0;}
        .mp-btn:hover{color:#FFD700;}
        .mp-track-item{display:flex;align-items:center;gap:8px;padding:6px 12px;cursor:pointer;transition:background 0.12s;font-size:11px;}
        .mp-track-item:hover{background:rgba(255,255,255,0.04);}
        .mp-track-item.active{background:rgba(255,215,0,0.06);color:#FFD700;}
        .mp-eq{display:none;gap:2px;align-items:flex-end;height:12px;}
        .mp-track-item.active .mp-eq{display:flex;}
        .mp-eq span{display:block;width:3px;background:#FFD700;border-radius:1px;animation:eq-bounce 0.6s ease-in-out infinite alternate;}
        .mp-eq span:nth-child(2){animation-delay:0.2s;}.mp-eq span:nth-child(3){animation-delay:0.4s;}
        .raw-team-btn{background:#0D1119;border:1px solid #2A3550;border-radius:5px;color:#7A8BAA;font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;padding:5px 12px;cursor:pointer;transition:all 0.15s;}
        .raw-team-btn.active{border-color:#FFD700;color:#FFD700;background:rgba(255,215,0,0.08);}
        .raw-team-btn:hover:not(.active){color:#E8EDF5;border-color:#3a4a60;}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#080B10}
        ::-webkit-scrollbar-thumb{background:#2A3550;border-radius:3px}
        @media(max-width:640px){
          .lb-row{grid-template-columns:36px 1fr 100px;height:50px;padding:0 .75rem;}
          .lb-col-hide{display:none!important;}
          .teams-grid{grid-template-columns:1fr!important;}
          .pt-row{grid-template-columns:1fr 50px 70px;}
          .pt-col-hide{display:none!important;}
          .stats-strip{grid-template-columns:repeat(2,1fr)!important;}
          .mvp-grid{grid-template-columns:1fr 1fr!important;}
          .auction-wrap{grid-template-columns:1fr!important;}
          #music-player{bottom:.75rem!important;left:.75rem!important;width:220px!important;}
        }
      `}</style>

      {/* HEADER */}
      <header style={{background:'linear-gradient(135deg,#0A0F18,#111827)',borderBottom:'2px solid #FFD700',padding:'0 1.5rem',position:'sticky',top:0,zIndex:100,boxShadow:'0 4px 40px rgba(255,215,0,0.15)'}}>
        <div style={{maxWidth:1400,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:60,gap:'1rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <div style={{width:36,height:36,background:'linear-gradient(135deg,#FFD700,#FF6B00)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,boxShadow:'0 0 20px rgba(255,215,0,0.4)'}}>🏏</div>
            <div>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:3,background:'linear-gradient(90deg,#FFD700,#FF6B00)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>The Auction Room</div>
              <div style={{fontSize:9,color:'#7A8BAA',letterSpacing:3,textTransform:'uppercase',marginTop:-3}}>IPL Fantasy 2026 · 8 Teams</div>
            </div>
          </div>
          <nav style={{display:'flex',gap:2,flexWrap:'wrap'}}>
            {(['leaderboard','teams','auction','progress','rawstats'] as ActiveView[]).map(v=>(
              <button key={v} className={`nav-btn${activeView===v?' active':''}`} onClick={()=>setActiveView(v)}>
                {v==='leaderboard'?'Leaderboard':v==='teams'?'Teams':v==='auction'?'Players':v==='progress'?'Progress':'Raw Stats'}
              </button>
            ))}
          </nav>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button onClick={toggleAdmin} style={{background:'none',border:`1px solid ${isAdmin?'#00E676':'#2A3550'}`,color:isAdmin?'#00E676':'#7A8BAA',padding:'5px 10px',borderRadius:6,fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
              {isAdmin?'🔓':'🔐'} Admin
            </button>
            <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(232,0,61,0.15)',border:'1px solid #E8003D',borderRadius:4,padding:'3px 8px',fontSize:10,letterSpacing:2,color:'#E8003D',fontWeight:700,flexShrink:0}}>
              <div className="live-dot"></div>LIVE
            </div>
          </div>
        </div>
      </header>

      {/* TICKER */}
      <div style={{background:'linear-gradient(90deg,#E8003D,#B8002E)',overflow:'hidden',height:26,display:'flex',alignItems:'center'}}>
        <div style={{background:'#000',color:'#FFD700',fontFamily:"'Bebas Neue',cursive",letterSpacing:2,fontSize:12,padding:'0 14px',height:'100%',display:'flex',alignItems:'center',whiteSpace:'nowrap',flexShrink:0}}>🔴 IPL 2026</div>
        <div style={{overflow:'hidden',flex:1}}>
          <div className="ticker-track">{tickerDoubled.map((t,i)=><span key={i} style={{whiteSpace:'nowrap',fontSize:11,fontWeight:600,letterSpacing:1,color:'#fff'}}>{t}</span>)}</div>
        </div>
      </div>

      {/* ADMIN BAR */}
      {isAdmin&&(
        <div style={{background:'#0D1119',borderBottom:'1px solid #2A3550'}}>
          <div style={{maxWidth:1400,margin:'0 auto',padding:'8px 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <div style={{display:'flex',alignItems:'center',gap:8,fontSize:11}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:apiStatus.state==='ok'?'#00E676':apiStatus.state==='err'?'#E8003D':apiStatus.state==='loading'?'#FFD700':'#7A8BAA',boxShadow:apiStatus.state==='ok'?'0 0 6px #00E676':apiStatus.state==='loading'?'0 0 6px #FFD700':'none'}}></div>
              <span style={{color:'#7A8BAA',fontFamily:"'JetBrains Mono',monospace"}} dangerouslySetInnerHTML={{__html:apiStatus.state==='loading'?`<span class="spinner"></span>${apiStatus.msg}`:apiStatus.msg}}></span>
            </div>
            <button onClick={handleRefresh} disabled={apiStatus.state==='loading'} style={{background:apiStatus.state==='loading'?'#1C2538':'#FFD700',color:apiStatus.state==='loading'?'#7A8BAA':'#000',border:'none',borderRadius:6,padding:'6px 20px',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1.5,cursor:apiStatus.state==='loading'?'not-allowed':'pointer',transition:'all 0.15s'}}>
              {apiStatus.state==='loading'?'Syncing…':'↻ REFRESH'}
            </button>
          </div>
        </div>
      )}

      <main style={{maxWidth:1400,margin:'0 auto',padding:'1.5rem',paddingBottom:120}}>

        {/* LEADERBOARD */}
        {activeView==='leaderboard'&&(
          <div>
            <div style={{background:'linear-gradient(135deg,#161D2A,#1A2235)',border:'1px solid #2A3550',borderTop:'3px solid #FF6B00',borderRadius:12,padding:'1.25rem 1.75rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>
              <div style={{display:'flex',alignItems:'center',gap:16,fontFamily:"'Bebas Neue',cursive"}}>
                <div><div style={{fontSize:26,letterSpacing:2,color:'#FF4D4D'}}>RCB</div><div style={{fontSize:13,color:'#7A8BAA',fontFamily:"'Rajdhani',sans-serif",fontWeight:500,marginTop:2}}>203/4 (15.4 ov)</div></div>
                <div style={{fontSize:13,color:'#FFD700',padding:'3px 8px',border:'1px solid #B8960A',borderRadius:4,letterSpacing:2}}>VS</div>
                <div><div style={{fontSize:26,letterSpacing:2,color:'#FF8C00'}}>SRH</div><div style={{fontSize:13,color:'#7A8BAA',fontFamily:"'Rajdhani',sans-serif",fontWeight:500,marginTop:2}}>201/9 (20 ov)</div></div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:10,letterSpacing:2,color:'#00E676',fontWeight:700,marginBottom:4}}>● MATCH 1 · RESULT</div>
                <div style={{fontSize:12,color:'#7A8BAA'}}>M. Chinnaswamy, Bengaluru · 28 Mar 2026</div>
                <div style={{fontSize:12,color:'#FFD700',marginTop:3}}>RCB won by 6 wkts (26 balls left)</div>
              </div>
            </div>
            <div className="stats-strip" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.5rem'}}>
              {[
                {label:'Matches Played',val:matchesPlayed,sub:'of 74 total · IPL 2026',color:'linear-gradient(90deg,#FFD700,#FF6B00)'},
                {label:'Leading Team',val:topTeam.name,sub:`${topPts.toLocaleString()} pts`,color:'#00D4FF'},
                {label:'Top Player',val:topP.name.split(' ').slice(0,2).join(' '),sub:`${playerPts(topP.name,scores)} pts${isMarquee(topP.name)?' ⚡':''}`,color:'#00E676'},
                {label:'Season',val:'LIVE',sub:'IPL 2026 underway',color:'#E8003D'},
              ].map((box,i)=>(
                <div key={i} style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'1rem 1.25rem',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:box.color}}></div>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textTransform:'uppercase',marginBottom:5}}>{box.label}</div>
                  <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:i===0?32:16,lineHeight:1,paddingTop:i>0?'8px':0,color:i===3?'#00E676':undefined}}>{box.val}</div>
                  <div style={{fontSize:11,color:'#7A8BAA',marginTop:2}}>{box.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>STANDINGS</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#FFD700',background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.2)',padding:'3px 8px',borderRadius:3}}>
                {`8 TEAMS · ${matchesPlayed} MATCH${matchesPlayed!==1?'ES':''} DONE`}
              </div>
            </div>
            <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:12,overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>
              <div className="lb-row lb-hdr">
                <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textAlign:'right'}}>#</div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA'}}>TEAM</div>
                <div className="lb-col-hide" style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textAlign:'right'}}>Count</div>
                <div className="lb-col-hide" style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textAlign:'right'}}>Best</div>
                <div className="lb-col-hide" style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textAlign:'right'}}>Spent</div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textAlign:'right'}}>Points</div>
              </div>
              {ranked.map((owner,i)=>{
                const rank=i+1;const tp=teamPts(owner.id,scores);const squad=PLAYERS.filter(p=>p.owner===owner.id);
                const best=squad.reduce((b,p)=>playerPts(p.name,scores)>playerPts(b.name,scores)?p:b,squad[0]);
                const spent=squad.reduce((s,p)=>s+p.cost,0);
                return(
                  <div key={owner.id} className={`lb-row ${rank<=3?'rk'+rank:''}`} onClick={()=>openTeamModal(owner.id)}>
                    <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,color:rank===1?'#FFD700':rank===2?'#C0C0C0':rank===3?'#CD7F32':'#7A8BAA'}}>{rank}</div>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:30,height:30,borderRadius:6,background:owner.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',cursive",fontSize:13,color:'#000',flexShrink:0}}>{owner.name[0]}</div>
                      <div><div style={{fontSize:14,fontWeight:700}}>{owner.name}</div><div style={{fontSize:10,color:'#7A8BAA'}}>{squad.length} players</div></div>
                    </div>
                    <div className="lb-col-hide" style={{textAlign:'right',fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:'#7A8BAA'}}>{squad.length}</div>
                    <div className="lb-col-hide" style={{textAlign:'right',fontSize:10,color:'#E8EDF5'}}>{best?.name.split(' ')[0]||'—'}</div>
                    <div className="lb-col-hide" style={{textAlign:'right',fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:'#00E676'}}>₹{spent.toFixed(1)}L</div>
                    <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,textAlign:'right',color:rank===1?'#FFD700':undefined}}>{tp.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10,margin:'1.5rem 0 1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>MOST VALUABLE PLAYERS</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#FFD700',background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.2)',padding:'3px 8px',borderRadius:3}}>PTS PER ₹1 CR SPENT</div>
            </div>
            <div className="mvp-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'.75rem'}}>
              {mvp.map(({p,pts,ratio,owner},i)=>(
                <div key={p.name} className="mvp-card" onClick={()=>openPlayerModal(p.name)}>
                  <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,color:i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':'#7A8BAA',minWidth:24}}>{i+1}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}{isMarquee(p.name)?' ⚡':''}</div>
                    <div style={{fontSize:10,color:owner?.color||'#999'}}>{owner?.name||'—'} · ₹{p.cost}L</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,color:'#FFD700',lineHeight:1}}>{ratio.toFixed(1)}</div>
                    <div style={{fontSize:9,color:'#7A8BAA',letterSpacing:1}}>PTS/CR · {pts} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEAMS */}
        {activeView==='teams'&&(
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>ALL TEAMS</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#FFD700',background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.2)',padding:'3px 8px',borderRadius:3}}>TAP TEAM OR PLAYER FOR DETAILS</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:'1rem',fontSize:11,color:'#7A8BAA'}}>
              <span className="marquee-badge">⚡ MARQUEE</span><span>= 1.5× points multiplier · 3 per team</span>
            </div>
            <div className="teams-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'1.25rem'}}>
              {sortedTeams(scores).map((owner,i)=>{
                const tp=teamPts(owner.id,scores);const squad=PLAYERS.filter(p=>p.owner===owner.id).sort((a,b)=>playerPts(b.name,scores)-playerPts(a.name,scores));
                const maxP=playerPts(squad[0]?.name,scores)||1;
                return(
                  <div key={owner.id} className="team-card" onClick={()=>openTeamModal(owner.id)}>
                    <div style={{padding:'.9rem 1.1rem',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #2A3550'}}>
                      <div style={{display:'flex',alignItems:'center',gap:9}}>
                        <div style={{width:38,height:38,borderRadius:8,background:owner.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',cursive",fontSize:15,color:'#000'}}>{owner.name[0]}</div>
                        <div><div style={{fontSize:15,fontWeight:700}}>{owner.name}</div><div style={{fontSize:10,color:'#7A8BAA',letterSpacing:1}}>Rank #{i+1}</div></div>
                      </div>
                      <div><div style={{fontFamily:"'Bebas Neue',cursive",fontSize:30,color:'#FFD700',lineHeight:1}}>{tp.toLocaleString()}</div><div style={{fontSize:8,color:'#7A8BAA',letterSpacing:2,textAlign:'right'}}>POINTS</div></div>
                    </div>
                    <div style={{padding:'.6rem 1.1rem'}}>
                      {squad.map(p=>{const pp=playerPts(p.name,scores);const pct=Math.round((pp/maxP)*100);const mq=isMarquee(p.name);return(
                        <div key={p.name} className={`p-row${mq?' is-marquee':''}`} onClick={e=>{e.stopPropagation();openPlayerModal(p.name);}}>
                          <span style={{fontWeight:600,flex:1,fontSize:12}} dangerouslySetInnerHTML={{__html:`${p.name}${mq?marqueeBadge():''}`}}></span>
                          <span className={`p-role role-${p.role}`}>{p.role}</span>
                          <div style={{width:36,height:4,background:'#080B10',borderRadius:2,overflow:'hidden',marginLeft:6}}>
                            <div style={{height:'100%',borderRadius:2,background:mq?'linear-gradient(90deg,#39FF14,#00ff88)':'linear-gradient(90deg,#FF6B00,#FFD700)',width:`${pct}%`}}></div>
                          </div>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,minWidth:42,textAlign:'right',color:pp===maxP&&pp>0?'#FFD700':undefined}}>{pp}</span>
                        </div>
                      );})}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ALL PLAYERS */}
        {activeView==='auction'&&(
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>PLAYER POOL</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#FFD700',background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.2)',padding:'3px 8px',borderRadius:3}}>{PLAYERS.length} PLAYERS</div>
            </div>
            <div className="auction-wrap" style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:'1.5rem'}}>
              <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:12,overflow:'hidden'}}>
                <div style={{padding:'.75rem 1.1rem',borderBottom:'1px solid #2A3550',display:'flex',gap:6,flexWrap:'wrap'}}>
                  <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search player, IPL team or owner…" style={{flex:1,minWidth:120,background:'#0D1119',border:'1px solid #2A3550',borderRadius:6,color:'#E8EDF5',fontFamily:"'Rajdhani',sans-serif",fontSize:13,padding:'5px 10px',outline:'none'}}/>
                  {['ALL','BAT','BOWL','AR','WK','MARQUEE'].map(f=>(
                    <button key={f} className={`filter-btn${activeFilter===f?' active':''}`} onClick={()=>setActiveFilter(f)}>{f==='MARQUEE'?'⚡':f}</button>
                  ))}
                </div>
                <div className="pt-row hdr">
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textTransform:'uppercase'}}>Player</div>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textTransform:'uppercase',textAlign:'right'}}>Role</div>
                  <div className="pt-col-hide" style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textTransform:'uppercase',textAlign:'right'}}>Owner</div>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',textTransform:'uppercase',textAlign:'right'}}>Points</div>
                </div>
                {filteredPlayers().length>0?filteredPlayers().map(p=>{
                  const owner=ownerById(p.owner);const pp=playerPts(p.name,scores);const mq=isMarquee(p.name);
                  return(<div key={p.name} className={`pt-row${mq?' is-marquee':''}`} onClick={()=>openPlayerModal(p.name)}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600}} dangerouslySetInnerHTML={{__html:`${p.name}${mq?marqueeBadge():''}`}}></div>
                      <div style={{fontSize:9,color:'#7A8BAA',letterSpacing:1}}>{p.ipl||'UNSOLD'} · ₹{p.cost}L</div>
                    </div>
                    <div style={{textAlign:'right'}}><span className={`p-role role-${p.role}`}>{p.role}</span></div>
                    <div className="pt-col-hide" style={{textAlign:'right',fontSize:11,color:'#7A8BAA'}}>{owner?.name||'—'}</div>
                    <div style={{textAlign:'right',fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:12,color:pp>0?'#FFD700':'#7A8BAA'}}>{pp}</div>
                  </div>);
                }):<div style={{padding:'2rem',textAlign:'center',color:'#7A8BAA'}}>No players match</div>}
              </div>
              <div>
                {[{label:'Total Players',val:PLAYERS.length.toString(),sub:'across 8 teams',valColor:'#00D4FF'},{label:'Highest Bid',val:'₹22.5L',sub:'Virat Kohli → Ashutosh',valColor:'#FFD700'}].map((sc,i)=>(
                  <div key={i} style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'1.1rem',marginBottom:'1rem'}}>
                    <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',marginBottom:6}}>{sc.label}</div>
                    <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:34,lineHeight:1,color:sc.valColor}}>{sc.val}</div>
                    <div style={{fontSize:11,color:'#7A8BAA',marginTop:3}}>{sc.sub}</div>
                  </div>
                ))}
                <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'1.1rem',marginBottom:'1rem'}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',marginBottom:8}}>POINT SYSTEM</div>
                  {[['1 Run scored','1 pt','#00D4FF'],['1 Wicket taken','25 pts','#E8003D'],['1 Catch / stumping','5 pts','#00E676']].map(([lbl,val,col])=>(
                    <div key={lbl} style={{display:'flex',justifyContent:'space-between',marginBottom:'.55rem',fontSize:13}}><span style={{color:'#7A8BAA'}}>{lbl}</span><span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:col}}>{val}</span></div>
                  ))}
                </div>
                <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'1.1rem'}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',marginBottom:6}}>MARQUEE (1.5×)</div>
                  <div style={{fontSize:11,color:'#7A8BAA',marginTop:6,lineHeight:1.7}}>Each team has 3 fixed <span className="marquee-badge">⚡ MARQUEE</span> players who earn <strong style={{color:'#39FF14'}}>1.5×</strong> points all season.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS */}
        {activeView==='progress'&&(
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>SEASON PROGRESS</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#FFD700',background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.2)',padding:'3px 8px',borderRadius:3}}>CUMULATIVE POINTS · MATCH BY MATCH</div>
            </div>
            <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:12,padding:'1.5rem',overflowX:'auto'}}>
              <div style={{display:'flex',flexWrap:'wrap',gap:'10px 20px',marginBottom:'1.25rem'}}>
                {OWNERS.map(o=>{const last=getTeamCumulative(o.id).at(-1)||0;return(
                  <div key={o.id} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:700,letterSpacing:1}}>
                    <div style={{width:10,height:10,borderRadius:'50%',background:o.color,flexShrink:0}}></div>
                    {o.name} <span style={{color:'#7A8BAA',fontWeight:400,marginLeft:2}}>{last} pts</span>
                  </div>
                );})}
              </div>
              {progressSVG()?<div dangerouslySetInnerHTML={{__html:progressSVG()!}}></div>:<div style={{textAlign:'center',color:'#7A8BAA',padding:'4rem',fontSize:13}}>No match data yet — sync scores to see the progression chart</div>}
            </div>
          </div>
        )}

        {/* RAW STATS */}
        {activeView==='rawstats'&&(
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:3}}>RAW STATS</div>
              <div style={{flex:1,height:1,background:'linear-gradient(90deg,#2A3550,transparent)'}}></div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#7A8BAA',background:'rgba(42,53,80,0.3)',border:'1px solid #2A3550',padding:'3px 8px',borderRadius:3}}>
                {matchesPlayed} MATCHES · ALL SCORES BROKEN DOWN
              </div>
            </div>

            {/* Team selector */}
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:'1.25rem'}}>
              {OWNERS.map(o=>(
                <button key={o.id} className={`raw-team-btn${rawTeam===o.id?' active':''}`} onClick={()=>setRawTeam(o.id)}
                  style={{borderColor:rawTeam===o.id?o.color:undefined,color:rawTeam===o.id?o.color:undefined,background:rawTeam===o.id?`${o.color}15`:undefined}}>
                  {o.name}
                </button>
              ))}
            </div>

            {matchesPlayed===0?(
              <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'3rem',textAlign:'center',color:'#7A8BAA',fontSize:13}}>
                No data synced yet. Enter Admin mode and hit Refresh to load match data.
              </div>
            ):(
              <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,padding:'1rem',overflowX:'auto'}}>
                {/* Match date legend */}
                {matchMetas.length>0&&(
                  <div style={{marginBottom:'12px',display:'flex',flexWrap:'wrap',gap:'6px 16px'}}>
                    {matchMetas.map((m,i)=>(
                      <span key={m.id} style={{fontSize:10,color:'#7A8BAA',fontFamily:"'JetBrains Mono',monospace"}}>
                        <span style={{color:'#FFD700'}}>M{i+1}</span> {m.name.replace(/,.*$/,'').trim()}{m.date?' · '+m.date.slice(0,10):''}
                      </span>
                    ))}
                  </div>
                )}
                <div dangerouslySetInnerHTML={{__html:renderRawStats()}}></div>
              </div>
            )}

            {/* Cross-team summary */}
            {matchesPlayed>0&&(
              <div style={{marginTop:'1.5rem'}}>
                <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:16,letterSpacing:2,marginBottom:'0.75rem',color:'#7A8BAA'}}>ALL TEAMS SUMMARY</div>
                <div style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:10,overflow:'hidden'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>
                    <thead>
                      <tr style={{background:'#0a0f18'}}>
                        {['Team','Runs','Wickets','Catches+St','Base Pts','Final Pts'].map(h=>(
                          <th key={h} style={{padding:'8px 12px',border:'1px solid #1e2a3a',fontSize:10,fontWeight:700,letterSpacing:1,textAlign:h==='Team'?'left':'right',color:'#7A8BAA'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTeams(scores).map((owner,i)=>{
                        const squad=PLAYERS.filter(p=>p.owner===owner.id);
                        const runs=squad.reduce((s,p)=>s+(scores[p.name]?.runs||0),0);
                        const wkts=squad.reduce((s,p)=>s+(scores[p.name]?.wickets||0),0);
                        const catches=squad.reduce((s,p)=>s+(scores[p.name]?.catches||0)+(scores[p.name]?.stumpings||0),0);
                        const base=squad.reduce((s,p)=>s+rawPts(p.name,scores),0);
                        const final=teamPts(owner.id,scores);
                        return(
                          <tr key={owner.id} style={{cursor:'pointer',background:rawTeam===owner.id?`${owner.color}10`:undefined}} onClick={()=>setRawTeam(owner.id)}>
                            <td style={{padding:'7px 12px',border:'1px solid #1e2a3a',color:owner.color,fontWeight:700}}>{i+1}. {owner.name}</td>
                            <td style={{padding:'7px 12px',border:'1px solid #1e2a3a',textAlign:'right',color:'#00D4FF'}}>{runs}</td>
                            <td style={{padding:'7px 12px',border:'1px solid #1e2a3a',textAlign:'right',color:'#E8003D'}}>{wkts}</td>
                            <td style={{padding:'7px 12px',border:'1px solid #1e2a3a',textAlign:'right',color:'#00E676'}}>{catches}</td>
                            <td style={{padding:'7px 12px',border:'1px solid #1e2a3a',textAlign:'right',color:'#aaa'}}>{base}</td>
                            <td style={{padding:'7px 12px',border:'1px solid #1e2a3a',textAlign:'right',color:'#FFD700',fontWeight:700,fontSize:13}}>{final.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MUSIC PLAYER */}
      <div id="music-player" style={{position:'fixed',bottom:'1.25rem',left:'1.25rem',zIndex:400,background:'linear-gradient(135deg,#0D1119,#161D2A)',border:'1px solid #2A3550',borderRadius:14,boxShadow:'0 8px 40px rgba(0,0,0,0.7),0 0 0 1px rgba(255,215,0,0.08)',width:musicCollapsed?180:280,overflow:'hidden',transition:'all 0.3s cubic-bezier(0.34,1.2,0.64,1)',userSelect:'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px 8px',borderBottom:'1px solid rgba(42,53,80,0.5)'}}>
          <div style={{width:36,height:36,background:'linear-gradient(135deg,#FFD700,#FF6B00)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0,animation:isPlaying?'spin-disc 3s linear infinite':undefined,boxShadow:'0 0 12px rgba(255,215,0,0.3)'}}>🎵</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:0.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',color:'#E8EDF5'}}>{TRACKS[currentTrack].title}</div>
            <div style={{fontSize:9,color:'#7A8BAA',letterSpacing:1,marginTop:1}}>🎶 THE AUCTION ROOM</div>
          </div>
          <button onClick={()=>setMusicCollapsed(c=>!c)} style={{background:'none',border:'none',color:'#7A8BAA',fontSize:14,cursor:'pointer',padding:2,lineHeight:1}}>{musicCollapsed?'▴':'▾'}</button>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,padding:musicCollapsed?'6px 10px':'8px 12px'}}>
          <button className="mp-btn" onClick={()=>{setCurrentTrack(t=>{const prev=(t-1+TRACKS.length)%TRACKS.length;doSelectTrack(prev);return prev;});}}>⏮</button>
          <button onClick={togglePlay} style={{background:'linear-gradient(135deg,#FFD700,#FF6B00)',color:'#000',width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,boxShadow:'0 0 12px rgba(255,215,0,0.3)',border:'none',cursor:'pointer'}}>{isPlaying?'⏸':'▶'}</button>
          <button className="mp-btn" onClick={()=>{setCurrentTrack(t=>{const next=(t+1)%TRACKS.length;doSelectTrack(next);return next;});}}>⏭</button>
          {!musicCollapsed&&(<div style={{flex:1,display:'flex',alignItems:'center',gap:5}}><span style={{fontSize:12,color:'#7A8BAA'}}>🔊</span><input type="range" min="0" max="100" value={volume} onChange={e=>handleVolumeChange(parseInt(e.target.value))} style={{flex:1,height:3,background:'#2A3550',borderRadius:2,outline:'none',cursor:'pointer',WebkitAppearance:'none'}}/></div>)}
        </div>
        {!musicCollapsed&&(
          <div style={{borderTop:'1px solid rgba(42,53,80,0.5)',padding:'6px 0'}}>
            {TRACKS.map((t,i)=>(
              <div key={i} className={`mp-track-item${i===currentTrack?' active':''}`} onClick={()=>{setCurrentTrack(i);doSelectTrack(i);}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:i===currentTrack?'#FFD700':'#7A8BAA',minWidth:14}}>{i+1}</span>
                <span style={{flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.title}</span>
                <div className="mp-eq"><span style={{height:4}}></span><span style={{height:8}}></span><span style={{height:6}}></span></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{position:'absolute',width:1,height:1,opacity:0,pointerEvents:'none',top:0,left:0,overflow:'hidden'}}><div id="yt-player"></div></div>

      {/* PIN MODAL */}
      {showPinModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(6px)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#0D1119',border:'1px solid #2A3550',borderRadius:16,padding:'2rem',width:300,textAlign:'center',boxShadow:'0 24px 80px rgba(0,0,0,0.8)'}}>
            <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:3,marginBottom:4}}>ADMIN ACCESS</div>
            <div style={{fontSize:11,color:'#7A8BAA',marginBottom:'1.5rem'}}>Enter your PIN to manage scores</div>
            <input type="password" maxLength={8} placeholder="••••" value={pinInput} onChange={e=>setPinInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')checkPin();}} style={{background:'#161D2A',border:'1px solid #2A3550',borderRadius:8,color:'#E8EDF5',fontFamily:"'JetBrains Mono',monospace",fontSize:24,letterSpacing:8,textAlign:'center',padding:12,width:'100%',outline:'none',marginBottom:'1rem'}} autoFocus/>
            <div style={{color:'#E8003D',fontSize:11,height:16,marginBottom:'.75rem'}}>{pinError}</div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>setShowPinModal(false)} style={{flex:1,background:'#1C2538',color:'#E8EDF5',border:'1px solid #2A3550',borderRadius:4,padding:'4px 12px',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:11,cursor:'pointer'}}>Cancel</button>
              <button onClick={checkPin} style={{flex:1,background:'#FFD700',color:'#000',border:'none',borderRadius:4,padding:'4px 12px',fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:11,cursor:'pointer'}}>Unlock</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {modalContent&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(6px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem'}} onClick={e=>{if(e.target===e.currentTarget)setModalContent(null);}}>
          <div style={{background:'#0D1119',border:'1px solid #2A3550',borderRadius:16,width:'100%',maxWidth:540,maxHeight:'88vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.8)',animation:'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)'}}>
            <div style={{padding:'1.25rem 1.5rem .9rem',borderBottom:'1px solid #2A3550',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:2}} dangerouslySetInnerHTML={{__html:modalContent.title}}></div>
              <button onClick={()=>setModalContent(null)} style={{background:'none',border:'1px solid #2A3550',color:'#7A8BAA',width:30,height:30,borderRadius:6,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
            </div>
            <div style={{padding:'1.25rem 1.5rem'}} dangerouslySetInnerHTML={{__html:modalContent.body}}></div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div style={{position:'fixed',bottom:100,right:'1.5rem',background:'#1C2538',border:'1px solid #FFD700',borderRadius:8,padding:'10px 18px',fontSize:13,fontWeight:600,color:'#E8EDF5',zIndex:500,transform:toast.show?'translateY(0)':'translateY(80px)',opacity:toast.show?1:0,transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',maxWidth:320}}>
        {toast.msg}
      </div>
    </div>
  );
}

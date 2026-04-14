// ── Supabase ──
const SUPABASE_URL = 'https://rokkkpmomfzovpugefcc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJva2trcG1vbWZ6b3ZwdWdlZmNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTY1ODUsImV4cCI6MjA5MTc3MjU4NX0.d7Y9SUU6h3sdzefs5dEMFwbco-WVWKxGF6KcvbDutEw';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Constants ──
const DEFAULT_HABITS = [
  {id:'h1',text:'Wash face morning & night',cat:'skin',done:false},
  {id:'h2',text:'Moisturize with SPF',cat:'skin',done:false},
  {id:'h3',text:'8+ glasses of water',cat:'hydration',done:false},
  {id:'h4',text:'Brush & floss teeth',cat:'grooming',done:false},
  {id:'h5',text:'Style hair',cat:'grooming',done:false},
  {id:'h6',text:'7-9 hours sleep',cat:'sleep',done:false},
  {id:'h7',text:'Take vitamins',cat:'skin',done:false},
  {id:'h8',text:'Cold shower',cat:'skin',done:false},
];

const MEALS = ['Breakfast','Lunch','Dinner','Snack'];
const MEAL_COLORS = {Breakfast:'#f0b429',Lunch:'#00c805',Dinner:'#3d85f5',Snack:'#a855f7'};

// ── Shared State ──
let USER = null;   // {id, username, name, goals}
let DATA = null;   // {diet, training, habits, finance, content, data_id}
let currentDate = new Date().toISOString().slice(0, 10);

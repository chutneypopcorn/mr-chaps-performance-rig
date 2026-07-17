export interface ShowSection {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  bpm: number;
  defaultTimestamp: number;
  script: ScriptLine[];
  song?: string;
  songNote?: string;
  backingTrack: string;
  triggerColor: string;
}

export interface ScriptLine {
  speaker: string;
  text: string;
  style: 'dialogue' | 'action' | 'music' | 'note';
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mediaCaption?: string;
}

export const SHOW_TITLE = "DANCE MASTERCLASS";
export const SHOW_SUBTITLE = "SHOW 3 // BAR BOMBAY // SYDNEY";

// Official default timestamps for each section (in seconds).
// These are the locked-in defaults that ship with the show.
// Update these values to match your actual pre-mixed track timing,
// then commit and push so everyone gets the same defaults.
export const DEFAULT_SECTION_TIMESTAMPS: number[] = [
  0,    // 00 - INTRO           (00:00)
  45,   // 01 - BACKUP          (00:45)
  72,   // 02 - SHAVA SHAVA     (01:12)
  108,  // 03 - KALA CHASHMA    (01:48)
  165,  // 04 - WHAT JHUMKA     (02:45)
  229,  // 05 - EK PAL KA JEENA (03:49)
  195,  // 06 - PIYA PIYA       (03:15)
  215,  // 07 - THE RETIREMENT  (03:35)
  230,  // 08 - THE FRENZY      (03:50)
  260,  // 09 - AKASH NUMBER    (04:20)
  285,  // 10 - ASHA BHOSLE FINALE (04:45)
];

export const showSections: ShowSection[] = [
  {
    id: 'intro',
    number: '00',
    title: 'INTRO',
    subtitle: 'The Disgusted Entrance',
    bpm: 106,
    defaultTimestamp: DEFAULT_SECTION_TIMESTAMPS[0],
    backingTrack: 'Instrumental Music',
    triggerColor: 'from-pink-600 to-rose-700',
    script: [
      { speaker: 'STAGE', text: 'Lights down. Instrumental musi begins pumping at 106 BPM. Mr Chaps struts onto stage already dancing. He freezes. Looks out at the audience with visible disgust.', style: 'action' },
      { speaker: 'MR CHAPS', text: 'Stop. Stop! Oh, Sydney, no. I am SHOOK, and not in a good way. I see sequins, I see mesh, I see leather, but I don\'t see any ACTION! Unacceptable. Is this a dance floor or a queue for the last bus to Harris Park? Darling, the bus is HERE. And I\'m the driver.', style: 'dialogue' },
    ]
  },
  {
    id: 'backup',
    number: '01',
    title: 'ASSISTANT DANCERS',
    subtitle: 'The Dancer Introduction',
    bpm: 106,
    defaultTimestamp: DEFAULT_SECTION_TIMESTAMPS[1],
    backingTrack: 'Instrumental Music',
    triggerColor: 'from-violet-600 to-purple-700',
    script: [
      { speaker: 'MR CHAPS', text: "So here's what's gonna happen. I'm gonna teach you some moves so you can dance along. But I can't do this alone. Where's my assistant?", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Backup dancers enter one at a time - striking a pose mid-stage.', style: 'action' },
      { speaker: 'DANCER 1', text: "Hi, dar ling. I want to dance with you.", style: 'dialogue' },
      { speaker: 'DANCER 2', text: "Dance. Dance of love. Dance on the moon.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "Your first lesson, arms out.", style: 'dialogue' },
    ]
  },
  {
    id: 'shava',
    number: '02',
    title: 'SHAVA SHAVA',
    subtitle: 'The Wedding Classic',
    bpm: 106,
    defaultTimestamp: DEFAULT_SECTION_TIMESTAMPS[2],
    backingTrack: 'Zindagi Meri Dance → Shava Shava blend',
    song: 'Shava Shava',
    songNote: 'Chorus x1 — audience dances along',
    triggerColor: 'from-amber-500 to-orange-600',
    script: [
      { speaker: 'MR CHAPS', text: "One more time. Cross your arms, pump your fist. Slash, slash. Toot, toot. Five, six, seven, eight.'", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Dancers and audience perform one chorus of Shava Shava.', style: 'music' },
      { speaker: 'MR CHAPS', text: "Stunning. Some of you have main character energy. Now, who wants to learn to actually SLAY a hook step?", style: 'dialogue' },
    ]
  },
  {
    id: 'kalachashma',
    number: '03',
    title: 'KALA CHASHMA',
    subtitle: 'Slay The Hook Step',
    bpm: 106,
    defaultTimestamp: DEFAULT_SECTION_TIMESTAMPS[3],
    backingTrack: 'Zindagi Meri Dance → Kala Chashma blend',
    song: 'What Jhumka',
    songNote: 'Chorus x2 — audience dances along',
    triggerColor: 'from-emerald-500 to-teal-600',
    script: [
      { speaker: 'STAGE', text: 'Dancers teach the hook step over Zindagi Meri Dance.', style: 'music' },
      { speaker: 'MR CHAPS', text: "One more time.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "Now let's see if you can handle the real thing. DJ, drop it!", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Dancers and audience perform two choruses of Kala Chashma.', style: 'music' },
    ]
  },
  {
    id: 'jhumka',
    number: '04',
    title: 'WHAT JHUMKA',
    subtitle: 'The Rich Aunty Energy',
    bpm: 106,
    defaultTimestamp: DEFAULT_SECTION_TIMESTAMPS[4],
    backingTrack: 'Zindagi Meri Dance → What Jhumka blend',
    song: 'What Jhumka',
    songNote: 'Chorus x2 — audience dances along',
    triggerColor: 'from-sky-500 to-blue-600',
    script: [
      { speaker: 'MR CHAPS', text: "Now, for this next song, I'm gonna need you to give me that rich auntie energy. The kind of auntie who arrives in a Mercedes to a shaadi and still complains about the catering. And I'm not teaching you this because you know it. And I know you know it. But remember, the move is not, “I have an earring.” The move is, “I have an earring, and you cannot afford it.", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Assistants lead audience with a countdown towards the dance.', style: 'action' },
      { speaker: 'STAGE', text: 'What Jhumka chorus kicks in. The dancers lead the moves.', style: 'music' },
    ]
  },
  {
    id: 'ekpal',
    number: '05',
    title: 'EK PAL KA JEENA',
    subtitle: 'The Hrithik Classic',
    bpm: 106,
    defaultTimestamp: DEFAULT_SECTION_TIMESTAMPS[5],
    backingTrack: 'Zindagi Meri Dance → Ek Pal Ka Jeena blend',
    song: 'Ek Pal Ka Jeena',
    songNote: 'Chorus x2 — audience dances along',
    triggerColor: 'from-rose-500 to-red-600',
    script: [
      { speaker: 'MR CHAPS', text: "{Dialogue for Hrithik – TBC}", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "Lesson Four: Shava Shava. This is not a dance. This is a CULTURAL OBLIGATION. If this song plays and you're not moving, your aunties are legally allowed to gossip about you for six months.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "Arms up — like you're welcoming the baraat even though they're two hours late. Step touch — left, right, like you're squashing cockroaches in style. And then... the shoulder. THE SHOULDER. Give it some Punjabi energy!", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Demonstrates with full commitment. Backup dancers go hard.', style: 'action' },
      { speaker: 'MR CHAPS', text: "Now I need FULL PARTICIPATION on this one. No wallflowers. No 'I'm just here for the food.' Everyone. Arms. Up. NOW.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "DJ — make them say it!", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Shava Shava drops. The entire room should be dancing. Maximum chaos.', style: 'music' },
    ]
  },
  {
    id: 'piyapiya',
    number: '06',
    title: 'PIYA PIYA',
    subtitle: 'The South Indian Surprise',
    bpm: 106,
    defaultTimestamp: DEFAULT_SECTION_TIMESTAMPS[6],
    backingTrack: 'Zindagi Meri Dance → Piya Piya blend',
    song: 'Piya Piya O Piya',
    songNote: 'Chorus x2 — audience dances along',
    triggerColor: 'from-yellow-500 to-amber-600',
    script: [
      { speaker: 'STAGE', text: 'Music transitions. Mr Chaps suddenly strikes a very different pose — hands in a classical position.', style: 'action' },
      { speaker: 'MR CHAPS', text: "Wait. Wait. We're going somewhere different now. You thought we were done? No no no. I have DEPTH. I have RANGE.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "Lesson Five: The South Indian Special. Piya Piya. The shoulder shimmy that launched a thousand memes. The song that made every 90s kid think they could do classical dance.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "This isn't just movement. This is storytelling. The hands say 'I am a delicate flower.' The shoulders say 'BUT I AM ALSO A PARTY.'", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "Watch the hands — elegant. Graceful. Like you're accepting a samosa from your nani. Now the shoulders — ATTACK. Like you found out the samosa is actually from last week.", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Demonstrates the classical-to-funny contrast. Backup dancers add their own flair.', style: 'action' },
      { speaker: 'MR CHAPS', text: "Beautiful. Chaotic. Just like my love life. DJ — bring the Piya!", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Piya Piya chorus drops. Audience joins in with the shoulder shimmy.', style: 'music' },
    ]
  },
  {
    id: 'retire',
    number: '07',
    title: 'THE RETIREMENT',
    subtitle: 'Passing The Torch',
    bpm: 106,
    defaultTimestamp: DEFAULT_SECTION_TIMESTAMPS[7],
    backingTrack: 'Zindagi Meri Dance (Instrumental)',
    triggerColor: 'from-slate-500 to-gray-600',
    script: [
      { speaker: 'STAGE', text: 'Music dips back to the instrumental. Mr Chaps looks around the room with exaggerated shock.', style: 'action' },
      { speaker: 'MR CHAPS', text: "Stop. Stop the music. Just... stop.", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Music cuts.', style: 'action' },
      { speaker: 'MR CHAPS', text: "What is HAPPENING out there? You people... you people are GOOD. Like, actually good. That person in the corner? flawless hip action. That group near the front? synchronized! I didn't even teach you synchronization!", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "I'm looking at this room and I'm thinking... why am I even here? You're all already professionals. Yash Raj should be scouting this room RIGHT NOW.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "You know what? I'm retiring. Right now. Effective immediately. I'm going to the bar. I deserve a drink. I EARNED a drink. The way I taught you? Masterclass. Literal masterclass.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "But before I go — one last thing. You don't need me anymore. You know the moves. You have the energy. So DJ? Just... play the hits. All of them. Fast. Furious. No breaks. Let's see what this city is REALLY made of.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "Lights down! Floor up! GO!", style: 'dialogue' },
    ]
  },
  {
    id: 'frenzy',
    number: '08',
    title: 'THE FRENZY',
    subtitle: 'Maximum Overdrive',
    bpm: 140,
    defaultTimestamp: DEFAULT_SECTION_TIMESTAMPS[8],
    backingTrack: 'Fast medley at 1.5x speed',
    triggerColor: 'from-red-600 to-rose-700',
    script: [
      { speaker: 'STAGE', text: 'The medley kicks into high gear — songs play at rapid-fire pace, 30-45 seconds each.', style: 'action' },
      { speaker: 'STAGE', text: 'Mr Chaps runs around the stage reacting to each song with comedic panic.', style: 'action' },
      { speaker: 'MR CHAPS', text: "(screaming over Muqabla) MY KNEES! Someone call an ambulance!", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Song: Muqabla — iconic Prabhu Deva moves', style: 'music' },
      { speaker: 'MR CHAPS', text: "(during Chikni Chameli) WHERE DID THIS COME FROM?! I wasn't ready!", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Song: Chikni Chameli — high energy', style: 'music' },
      { speaker: 'MR CHAPS', text: "(during Munni Badnam) THE AUNTIES ARE TAKING OVER! RUN!", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Song: Munni Badnam Hui — crowd favorite', style: 'music' },
      { speaker: 'MR CHAPS', text: "(during Aankh Marey) I can't feel my feet! But I also can't stop!", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Song: Aankh Marey — everyone knows this one', style: 'music' },
      { speaker: 'MR CHAPS', text: "(during Sheila Ki Jawani) SHEILA! MY QUEEN! I DANCE FOR YOU!", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Song: Sheila Ki Jawani — iconic Katrina moves', style: 'music' },
      { speaker: 'STAGE', text: 'The frenzy continues — O Saki Saki, Dilbar, Fevicol Se, and more rapid-fire hits.', style: 'action' },
      { speaker: 'NOTE', text: 'This section should be 3-4 minutes of pure chaos. Mr Chaps can interact with audience members, pretend to collapse, and generally lose his mind comically.', style: 'note' },
    ]
  },
  {
    id: 'akash',
    number: '09',
    title: 'AKASH NUMBER',
    subtitle: 'Special Guest Performance',
    bpm: 120,
    defaultTimestamp: DEFAULT_SECTION_TIMESTAMPS[9],
    backingTrack: 'TBD — Akash to choose',
    triggerColor: 'from-indigo-500 to-blue-600',
    script: [
      { speaker: 'STAGE', text: 'Music winds down. Mr Chaps is on the floor, dramatically exhausted.', style: 'action' },
      { speaker: 'MR CHAPS', text: "(gasping) I can't... I physically cannot... my body is eighty percent biryani at this point...", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "But wait. I have a surprise. You thought I was the only talent here? No no no. I brought a RINGER.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "Put your hands together for... AKASH!", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Akash enters to perform his number. Mr Chaps recovers at the side, acting as hype man.', style: 'action' },
      { speaker: 'NOTE', text: 'Akash performs his prepared number. Duration and song TBD with Akash.', style: 'note' },
      { speaker: 'MR CHAPS', text: "(during Akash's performance, to audience) Look at him! The talent! The commitment! And he does this WITHOUT my skincare routine!", style: 'dialogue' },
    ]
  },
  {
    id: 'ashafinale',
    number: '10',
    title: 'ASHA BHOSLE FINALE',
    subtitle: 'The Celebration Continues',
    bpm: 106,
    defaultTimestamp: DEFAULT_SECTION_TIMESTAMPS[10],
    backingTrack: 'Asha Bhosle medley mix',
    triggerColor: 'from-fuchsia-600 to-pink-700',
    script: [
      { speaker: 'STAGE', text: 'Akash finishes his number. Mr Chaps returns to center stage, visibly emotional.', style: 'action' },
      { speaker: 'MR CHAPS', text: "That was... that was beautiful. I'm not crying. It's just... confetti in my eye. Even though there's no confetti.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "But you know what? We're not done. We can't be done. Not yet. Because tonight... tonight we're celebrating a legend. A voice that has been the soundtrack to more weddings, more road trips, more heartbreaks, and more dance floors than any other.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "Asha Bhosle. The queen. The OG. The reason half of you exist — because your parents danced to her songs at THEIR wedding.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "So here's what's going to happen. I'm going to step back. The DJ is going to take over. And we're going to play the hits. ALL the hits. The ones you know by heart. The ones your mother sings in the kitchen. The ones that make you text your ex at 2 AM.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "Chura Liya. Piya Tu. Dum Maro Dum. Yeh Mera Dil. In Ankhon Ki Masti. ALL OF THEM.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "So find someone. Anyone. Dance with them. Dance near them. Dance AT them. I don't care. Just dance.", style: 'dialogue' },
      { speaker: 'MR CHAPS', text: "This is Bar Bombay. This is Sydney. This is US. DJ — take us home.", style: 'dialogue' },
      { speaker: 'STAGE', text: 'Mr Chaps exits stage as the Asha Bhosle medley begins. The DJ takes over seamlessly.', style: 'action' },
      { speaker: 'NOTE', text: 'Asha Bhosle medley should include: Chura Liya Hai Tumne, Piya Tu Ab To Aaja, Dum Maro Dum, Yeh Mera Dil, In Ankhon Ki Masti Ke, and other iconic hits. 5-7 minutes of continuous Asha.', style: 'note' },
    ]
  }
];

export const frenzySongs = [
  { title: 'Muqabla', artist: 'A.R. Rahman', note: 'Iconic Prabhu Deva moves' },
  { title: 'Chikni Chameli', artist: 'Shreya Ghoshal', note: 'High energy Katrina' },
  { title: 'Munni Badnam Hui', artist: 'Mamta Sharma', note: 'Crowd goes wild' },
  { title: 'Aankh Marey', artist: 'Neha Kakkar', note: 'Everyone knows this' },
  { title: 'Sheila Ki Jawani', artist: 'Sunidhi Chauhan', note: 'Iconic Katrina' },
  { title: 'O Saki Saki', artist: 'Neha Kakkar', note: 'Nora Fatehi energy' },
  { title: 'Dilbar', artist: 'Neha Kakkar', note: 'Middle Eastern vibes' },
  { title: 'Fevicol Se', artist: 'Mamta Sharma', note: 'Dabangg chaos' },
];

export const ashaSongs = [
  { title: 'Chura Liya Hai Tumne Jo Dil Ko', film: 'Yaadon Ki Baaraat (1973)' },
  { title: 'Piya Tu Ab To Aaja', film: 'Caravan (1971)' },
  { title: 'Dum Maro Dum', film: 'Hare Rama Hare Krishna (1971)' },
  { title: 'Yeh Mera Dil', film: 'Don (1978)' },
  { title: 'In Ankhon Ki Masti Ke', film: 'Umrao Jaan (1981)' },
  { title: 'O Mere Sona Re', film: 'Teesri Manzil (1966)' },
  { title: 'Aaiye Meherbaan', film: 'Howrah Bridge (1958)' },
  { title: 'Jaaiye Aap Kahan Jaayenge', film: 'Mere Sanam (1965)' },
];

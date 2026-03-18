// ============================================
// SAKE BAR NATUR - 90s/2000s Edition
// "JavaScript is for lovers"
// ============================================

// ============================================
// CURSOR TRAIL EFFECT
// ============================================
const trailColors = ['#00ff00', '#ff00ff', '#00ffff', '#ffff00', '#ff0000'];
const trail = [];
const TRAIL_LENGTH = 15;

for (let i = 0; i < TRAIL_LENGTH; i++) {
  const dot = document.createElement('div');
  dot.className = 'cursor-trail';
  dot.style.background = trailColors[i % trailColors.length];
  document.body.appendChild(dot);
  trail.push({ element: dot, x: 0, y: 0, delay: i * 30 });
}

let mouseX = 0,
  mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.pageX;
  mouseY = e.pageY;
});

function updateTrail() {
  trail.forEach((dot, index) => {
    setTimeout(() => {
      dot.element.style.left = mouseX + 'px';
      dot.element.style.top = mouseY + 'px';
      dot.element.style.transform = `scale(${1 - index / TRAIL_LENGTH})`;
      dot.element.style.opacity = 1 - index / TRAIL_LENGTH;
    }, dot.delay);
  });
  requestAnimationFrame(updateTrail);
}
updateTrail();

// ============================================
// STARS BACKGROUND
// ============================================
function createStars() {
  const starsContainer = document.getElementById('stars');
  if (!starsContainer) return;

  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = Math.random() * 3 + 1 + 'px';
    star.style.height = star.style.width;
    star.style.animationDelay = Math.random() * 2 + 's';
    star.style.animationDuration = Math.random() * 2 + 1 + 's';
    starsContainer.appendChild(star);
  }
}

// ============================================
// KONAMI CODE EASTER EGG
// ============================================
const konamiCode = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      triggerSecret();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function triggerSecret() {
  const secret = document.getElementById('secret-message');
  if (secret) {
    secret.classList.add('show');
    // Create explosion of colors
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.background =
          trailColors[Math.floor(Math.random() * trailColors.length)];
        dot.style.left = Math.random() * window.innerWidth + 'px';
        dot.style.top = Math.random() * window.innerHeight + 'px';
        dot.style.width = Math.random() * 20 + 10 + 'px';
        dot.style.height = dot.style.width;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 1000);
      }, i * 50);
    }
  }
}

// ============================================
// HIT COUNTER
// ============================================
function updateHitCounter() {
  const counter = document.getElementById('hit-counter');
  if (!counter) return;

  // Get or initialize counter from localStorage
  let count = parseInt(localStorage.getItem('hitCounter') || '1');
  count++;
  localStorage.setItem('hitCounter', count);

  // Format with leading zeros
  counter.textContent = String(count).padStart(6, '0');
}

// ============================================
// SUPABASE SETUP
// ============================================
const SUPABASE_URL = 'https://ufuiyaciaapslhaatshp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_C_xH30NDNF3HVWITXc3buw_KBOoCKHs';
let supabaseClient;

try {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.error('Supabase init error:', e);
}

// ============================================
// VOTING BOARD
// ============================================
let votingOptions = [];

async function loadVotingOptions() {
  const board = document.getElementById('voting-board');
  if (!board) return;

  if (!supabaseClient) {
    // Fallback demo data if Supabase isn't available
    votingOptions = [
      { id: 1, name: 'Kubota Manju', votes: 42 },
      { id: 2, name: 'Dassai 45', votes: 38 },
      { id: 3, name: 'Hakkaisan', votes: 29 },
      { id: 4, name: 'Momokawa Organic', votes: 21 },
    ];
    renderVotingBoard();
    return;
  }

  try {
    const { data, error } = await supabaseClient.from('sake_votes').select('*');
    if (error) throw error;
    votingOptions = data || [];

    if (votingOptions.length === 0) {
      // Initialize with default options if empty
      votingOptions = [
        { id: 1, name: 'Kubota Manju', votes: 42 },
        { id: 2, name: 'Dassai 45', votes: 38 },
        { id: 3, name: 'Hakkaisan', votes: 29 },
        { id: 4, name: 'Momokawa Organic', votes: 21 },
      ];
    }
    renderVotingBoard();
  } catch (error) {
    console.error('Error loading votes:', error);
    // Use fallback data
    votingOptions = [
      { id: 1, name: 'Kubota Manju', votes: 42 },
      { id: 2, name: 'Dassai 45', votes: 38 },
      { id: 3, name: 'Hakkaisan', votes: 29 },
      { id: 4, name: 'Momokawa Organic', votes: 21 },
    ];
    renderVotingBoard();
  }
}

function renderVotingBoard() {
  const board = document.getElementById('voting-board');
  if (!board) return;

  board.innerHTML = votingOptions
    .map(
      (option) => `
    <div class="vote-item">
      <span>🍶 ${option.name}</span>
      <span style="color: #00ff00; font-family: 'Impact'; font-size: 1.3rem;">Votes: ${option.votes}</span>
      <button onclick="vote(${option.id})">👍 VOTE</button>
    </div>
  `
    )
    .join('');
}

async function vote(id) {
  const option = votingOptions.find((o) => o.id === id);
  if (!option) return;

  try {
    if (supabaseClient) {
      const { error } = await supabaseClient
        .from('sake_votes')
        .update({ votes: option.votes + 1 })
        .eq('id', id);
      if (error) throw error;
    }
    option.votes++;
    await loadVotingOptions();
  } catch (error) {
    console.error('Error voting:', error);
    // Local fallback
    option.votes++;
    renderVotingBoard();
  }
}

// Make vote function global
window.vote = vote;

// ============================================
// MESSAGE BOARD / GUESTBOOK
// ============================================
let messages = [];

async function loadMessages() {
  const board = document.getElementById('message-board');
  if (!board) return;

  if (!supabaseClient) {
    // Fallback demo data
    messages = [
      {
        id: 1,
        name: 'Cool90sKid',
        message: 'This site is RADICAL! Love the vibes! 🤘',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'SakeLover42',
        message: 'Best sake bar in cyberspace! The Ginjo is 🔥',
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'WebMaster',
        message: 'Thanks for visiting! Sign the guestbook! ✎',
        created_at: new Date().toISOString(),
      },
    ];
    renderMessageBoard();
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    messages = data || [];

    if (messages.length === 0) {
      messages = [
        {
          id: 1,
          name: 'Cool90sKid',
          message: 'This site is RADICAL! Love the vibes! 🤘',
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'SakeLover42',
          message: 'Best sake bar in cyberspace! The Ginjo is 🔥',
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          name: 'WebMaster',
          message: 'Thanks for visiting! Sign the guestbook! ✎',
          created_at: new Date().toISOString(),
        },
      ];
    }
    renderMessageBoard();
  } catch (error) {
    console.error('Error loading messages:', error);
    // Use fallback
    messages = [
      {
        id: 1,
        name: 'Cool90sKid',
        message: 'This site is RADICAL! Love the vibes! 🤘',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'SakeLover42',
        message: 'Best sake bar in cyberspace! The Ginjo is 🔥',
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'WebMaster',
        message: 'Thanks for visiting! Sign the guestbook! ✎',
        created_at: new Date().toISOString(),
      },
    ];
    renderMessageBoard();
  }
}

function renderMessageBoard() {
  const board = document.getElementById('message-board');
  if (!board) return;

  board.innerHTML = messages
    .map(
      (msg) => `
    <div class="message">
      <strong>✎ ${escapeHtml(msg.name)}</strong>
      <p style="color: #00ffff; margin: 0.5rem 0;">${escapeHtml(msg.message)}</p>
      <small>${new Date(msg.created_at).toLocaleString()}</small>
    </div>
  `
    )
    .join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('message-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) return;

    try {
      if (supabaseClient) {
        const { error } = await supabaseClient
          .from('messages')
          .insert([{ name, message }]);
        if (error) throw error;
      }
      // Add locally for immediate feedback
      messages.unshift({
        id: Date.now(),
        name,
        message,
        created_at: new Date().toISOString(),
      });
      renderMessageBoard();
      form.reset();
    } catch (error) {
      console.error('Error posting message:', error);
      // Still add locally even if Supabase fails
      messages.unshift({
        id: Date.now(),
        name,
        message,
        created_at: new Date().toISOString(),
      });
      renderMessageBoard();
      form.reset();
    }
  });
});

// ============================================
// POLL FUNCTIONALITY
// ============================================
let pollData = { yes: 0, no: 0, maybe: 0 };

function loadPoll() {
  const stored = localStorage.getItem('sakePoll');
  if (stored) {
    pollData = JSON.parse(stored);
  } else {
    // Initial demo data
    pollData = { yes: 42, no: 8, maybe: 15 };
  }
  updatePollDisplay();
}

function updatePollDisplay() {
  const total = pollData.yes + pollData.no + pollData.maybe;
  if (total === 0) return;

  const yesPercent = Math.round((pollData.yes / total) * 100);
  const noPercent = Math.round((pollData.no / total) * 100);
  const maybePercent = Math.round((pollData.maybe / total) * 100);

  document.getElementById('poll-bar-yes').style.width = yesPercent + '%';
  document.getElementById('poll-yes').textContent = yesPercent;

  document.getElementById('poll-bar-no').style.width = noPercent + '%';
  document.getElementById('poll-no').textContent = noPercent;

  document.getElementById('poll-bar-maybe').style.width = maybePercent + '%';
  document.getElementById('poll-maybe').textContent = maybePercent;

  document.getElementById('poll-total').textContent = total;
}

async function votePoll(option) {
  pollData[option]++;
  localStorage.setItem('sakePoll', JSON.stringify(pollData));
  updatePollDisplay();

  // Visual feedback
  const optionEl = event.target.closest('.poll-option');
  if (optionEl) {
    optionEl.style.transform = 'scale(1.05)';
    setTimeout(() => {
      optionEl.style.transform = 'scale(1)';
    }, 200);
  }
}

// Make poll function global
window.votePoll = votePoll;

// ============================================
// WINAMP-STYLE MUSIC PLAYER
// ============================================
class WinampPlayer {
  constructor() {
    this.tracks = [
      { title: '🎵 Demo Track 1 - 90s Vibes', src: '' },
      { title: '🎵 Demo Track 2 - Sake Dreams', src: '' },
      { title: '🎵 Demo Track 3 - Neon Nights', src: '' },
      { title: '🎵 Demo Track 4 - Cyber Sake', src: '' },
      { title: '🎵 Demo Track 5 - Tokyo Drift', src: '' },
    ];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.isRepeat = false;
    this.audio = new Audio();
    this.visualizerBars = [];
    this.animationFrame = null;

    this.init();
  }

  init() {
    this.createVisualizerBars();
    this.renderPlaylist();
    this.updateTrackInfo();
    this.setVolume(70);

    this.audio.addEventListener('ended', () => {
      if (this.isRepeat) {
        this.play();
      } else {
        this.next();
      }
    });

    this.audio.addEventListener('play', () => {
      this.startVisualizer();
    });

    this.audio.addEventListener('pause', () => {
      this.stopVisualizer();
    });
  }

  createVisualizerBars() {
    const visualizer = document.getElementById('visualizer');
    if (!visualizer) return;

    for (let i = 0; i < 16; i++) {
      const bar = document.createElement('div');
      bar.className = 'visualizer-bar';
      bar.style.height = '5px';
      visualizer.appendChild(bar);
      this.visualizerBars.push(bar);
    }
  }

  startVisualizer() {
    const animate = () => {
      this.visualizerBars.forEach((bar) => {
        const height = Math.random() * 50 + 5;
        bar.style.height = height + 'px';
      });
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  stopVisualizer() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.visualizerBars.forEach((bar) => {
      bar.style.height = '5px';
    });
  }

  renderPlaylist() {
    const playlist = document.getElementById('playlist');
    if (!playlist) return;

    playlist.innerHTML = this.tracks
      .map(
        (track, index) => `
      <div class="playlist-item ${index === this.currentIndex ? 'playing' : ''}" 
           onclick="player.playTrack(${index})">
        ${index === this.currentIndex ? '▶ ' : '  '} ${track.title}
      </div>
    `
      )
      .join('');
  }

  updateTrackInfo() {
    const trackInfo = document.getElementById('track-info');
    if (!trackInfo) return;

    const track = this.tracks[this.currentIndex];
    trackInfo.textContent = this.isPlaying
      ? `▶ ${track.title}`
      : `⏸ ${track.title}`;
  }

  play() {
    const track = this.tracks[this.currentIndex];
    if (track.src) {
      this.audio.src = track.src;
      this.audio.play().catch(() => {
        // If audio fails, still show UI as playing
        console.log('Audio playback not available - demo mode');
      });
    }
    this.isPlaying = true;
    this.updateTrackInfo();
    this.renderPlaylist();
    this.startVisualizer();
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateTrackInfo();
    this.stopVisualizer();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    this.updateTrackInfo();
    this.stopVisualizer();
  }

  next() {
    if (this.isShuffle) {
      this.currentIndex = Math.floor(Math.random() * this.tracks.length);
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
    }
    this.updateTrackInfo();
    this.renderPlaylist();
    if (this.isPlaying) {
      this.play();
    }
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
    this.updateTrackInfo();
    this.renderPlaylist();
    if (this.isPlaying) {
      this.play();
    }
  }

  playTrack(index) {
    this.currentIndex = index;
    this.isPlaying = true;
    this.updateTrackInfo();
    this.renderPlaylist();
    this.play();
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    const btn = document.getElementById('shuffle-btn');
    if (btn) {
      btn.classList.toggle('active', this.isShuffle);
    }
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    const btn = document.getElementById('repeat-btn');
    if (btn) {
      btn.classList.toggle('active', this.isRepeat);
    }
  }

  setVolume(value) {
    this.audio.volume = value / 100;
    const display = document.getElementById('volume-display');
    if (display) {
      display.textContent = value;
    }
  }
}

// Initialize player

let player;

// ============================================
// SMOOTH SCROLLING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('nav a').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// ============================================
// STICKY NAVIGATION EFFECT
// ============================================

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const nav = document.getElementById('sticky-nav');
  if (!nav) return;

  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    nav.style.background = 'linear-gradient(180deg, #000066, #000033)';
    nav.style.boxShadow = '0 2px 20px rgba(0, 255, 0, 0.5)';
  } else {
    nav.style.background = 'linear-gradient(180deg, #000066, #000033)';
    nav.style.boxShadow = 'none';
  }

  lastScroll = currentScroll;
});

// ============================================
// GLITCH TEXT EFFECT ON HOVER
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.glitch').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      el.style.animation = 'glitch 0.3s infinite';
    });
    el.addEventListener('mouseleave', () => {
      el.style.animation = '';
    });
  });
});

// ============================================
// RANDOM QUOTE GENERATOR
// ============================================
const quotes = [
  "🍶 Sake is life's greatest pleasure",
  '✨ The 90s called, they want their website back',
  '🎵 Music + Sake = Happiness',
  "💫 You're browsing the best sake bar in cyberspace",
  "🌟 Keep on truckin'!",
  '🎮 Game on!',
  '💖 Made with love and nostalgia',
];

function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  console.log(
    '%c' + quote,
    'color: #00ff00; font-size: 16px; text-shadow: 0 0 10px #00ff00;'
  );
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  updateHitCounter();
  loadVotingOptions();
  loadMessages();
  loadPoll();
  player = new WinampPlayer();
  showRandomQuote();

  console.log(
    '%c🍶 SAKE BAR NATUR 🍶',
    'color: #ff00ff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #ff00ff;'
  );
  console.log(
    '%cWelcome to the ultimate 90s experience!',
    'color: #00ffff; font-size: 14px;'
  );
  console.log(
    '%cPsst... try the Konami code! ↑↑↓↓←→←→BA',
    'color: #ffff00; font-size: 12px;'
  );
});

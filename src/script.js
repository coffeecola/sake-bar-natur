// script.js - 90's Sake Bar Website

// Supabase setup
const SUPABASE_URL = 'https://ufuiyaciaapslhaatshp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_C_xH30NDNF3HVWITXc3buw_KBOoCKHs';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sticky navigation
window.addEventListener('scroll', () => {
  const nav = document.getElementById('sticky-nav');
  if (window.scrollY > 100) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});

// Smooth scrolling for nav links
document.querySelectorAll('nav a').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth',
    });
  });
});

// Voting board
let votingOptions = [];

async function loadVotingOptions() {
  const { data, error } = await supabaseClient.from('sake_votes').select('*');
  if (error) {
    console.error('Error loading votes:', error);
    return;
  }
  votingOptions = data;
  renderVotingBoard();
}

function renderVotingBoard() {
  const board = document.getElementById('voting-board');
  board.innerHTML = votingOptions
    .map(
      (option) => `
    <div class="vote-item">
      <span>${option.name}</span>
      <span>Votes: ${option.votes}</span>
      <button onclick="vote(${option.id})">Vote</button>
    </div>
  `
    )
    .join('');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function vote(id) {
  const option = votingOptions.find((o) => o.id === id);
  if (option) {
    const { error } = await supabaseClient
      .from('sake_votes')
      .update({ votes: option.votes + 1 })
      .eq('id', id);
    if (error) {
      console.error('Error voting:', error);
      return;
    }
    await loadVotingOptions(); // Reload to show updated votes
  }
}

// Message board
let messages = [];

async function loadMessages() {
  const { data, error } = await supabaseClient
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error loading messages:', error);
    return;
  }
  messages = data;
  renderMessageBoard();
}

function renderMessageBoard() {
  const board = document.getElementById('message-board');
  board.innerHTML = messages
    .map(
      (msg) => `
    <div class="message">
      <strong>${msg.name}</strong>: ${msg.message}
      <small>${new Date(msg.created_at).toLocaleString()}</small>
    </div>
  `
    )
    .join('');
}

document
  .getElementById('message-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    const { error } = await supabaseClient
      .from('messages')
      .insert([{ name, message }]);
    if (error) {
      console.error('Error posting message:', error);
      return;
    }
    await loadMessages(); // Reload messages
    e.target.reset();
  });

// Initialize
loadVotingOptions();
loadMessages();

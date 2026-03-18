// script.js - 90's Sake Bar Website

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

// Voting board - mock data for now
const votingOptions = [
  { id: 1, name: 'Yamada Sake', votes: 5 },
  { id: 2, name: 'Sakura Ginjo', votes: 3 },
  { id: 3, name: 'Mountain Dew Sake', votes: 7 },
];

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
function vote(id) {
  const option = votingOptions.find((o) => o.id === id);
  if (option) {
    option.votes++;
    renderVotingBoard();
  }
}

// Message board - mock data
let messages = [
  { name: 'Anon', message: 'Great sake selection!', date: new Date() },
];

function renderMessageBoard() {
  const board = document.getElementById('message-board');
  board.innerHTML = messages
    .map(
      (msg) => `
    <div class="message">
      <strong>${msg.name}</strong>: ${msg.message}
      <small>${msg.date.toLocaleString()}</small>
    </div>
  `
    )
    .join('');
}

document.getElementById('message-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  messages.push({ name, message, date: new Date() });
  renderMessageBoard();
  e.target.reset();
});

// Initialize
renderVotingBoard();
renderMessageBoard();

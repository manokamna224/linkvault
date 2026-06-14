/* ===== vote.js — WebSocket listener for real-time vote updates ===== */

(function initVoteSocket() {
  // socket.io client is loaded via <script src="/socket.io/socket.io.js">
  if (typeof io === 'undefined') return;

  const socket = io(); // auto-connects to current host

  socket.on('connect', () => {
    console.log('LinkVault: WebSocket connected', socket.id);
  });

  socket.on('vote_update', ({ linkId, score }) => {
    // Update every matching score element on the page
    const scoreEl = document.querySelector(
      `[data-link-id='${linkId}'] .vote-score`
    );
    if (scoreEl) {
      scoreEl.textContent = score;
      scoreEl.classList.add('flash');
      setTimeout(() => scoreEl.classList.remove('flash'), 600);
    }
  });

  socket.on('disconnect', () => {
    console.log('LinkVault: WebSocket disconnected');
  });
})();

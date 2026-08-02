// Ambient drifting background blobs
function spawnBlobs() {
  const wrap = document.createElement('div');
  wrap.className = 'bg-blobs';
  wrap.innerHTML = '<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>';
  document.body.insertBefore(wrap, document.body.firstChild);
}

// Background music: looks for audio/song.mp3. Drop your own mp3 there
// (named exactly "song.mp3") for this to play. If the file is missing,
// the toggle button simply does nothing when clicked.
function initMusic() {
  const audio = document.createElement('audio');
  audio.id = 'bgMusic';
  audio.src = 'audio/song.mp3';
  audio.loop = true;
  audio.volume = 0.5;
  audio.preload = 'auto';
  document.body.appendChild(audio);

  const toggle = document.createElement('button');
  toggle.className = 'music-toggle';
  toggle.setAttribute('aria-label', 'Toggle background music');
  toggle.textContent = '♪';
  document.body.appendChild(toggle);

  let playing = false;
  function setState(isPlaying) {
    playing = isPlaying;
    toggle.classList.toggle('playing', isPlaying);
    toggle.textContent = isPlaying ? '♫' : '♪';
  }

  toggle.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      setState(false);
    } else {
      audio.play().then(() => setState(true)).catch(() => {});
    }
  });

  // Browsers block autoplay until the visitor interacts with the page.
  // Start music quietly on the first click/tap anywhere (e.g. the Yes
  // or Continue buttons), so it feels automatic without breaking browser rules.
  function tryAutoStart() {
    if (!playing) {
      audio.play().then(() => setState(true)).catch(() => {});
    }
    document.removeEventListener('click', tryAutoStart);
    document.removeEventListener('touchstart', tryAutoStart);
  }
  document.addEventListener('click', tryAutoStart);
  document.addEventListener('touchstart', tryAutoStart);
}

// Floating hearts background
function spawnHearts(count = 18) {
  const wrap = document.createElement('div');
  wrap.className = 'hearts';
  document.body.appendChild(wrap);
  const symbols = ['♥', '♡'];
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = symbols[Math.random() > 0.5 ? 0 : 1];
    const size = 14 + Math.random() * 26;
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = size + 'px';
    h.style.animationDuration = (8 + Math.random() * 10) + 's';
    h.style.animationDelay = (Math.random() * 10) + 's';
    wrap.appendChild(h);
  }
}

// Runaway "No" button behavior.
// Pass the button element and (optionally) a caption element that shows
// a new teasing line each time the button dodges.
function makeRunaway(btn, captionEl) {
  const messages = [
    "nice try 😏",
    "nope, not that one",
    "keep trying...",
    "almost! (not really)",
    "you can't catch this button",
    "wrong answer, try again",
    "hehe missed me",
    "come on, be honest 🥺"
  ];
  let msgIndex = 0;
  let dodges = 0;

  function dodge() {
    const btnRect = btn.getBoundingClientRect();
    const w = btnRect.width;
    const h = btnRect.height;
    const margin = 16;
    const maxX = window.innerWidth - w - margin;
    const maxY = window.innerHeight - h - margin;

    btn.classList.add('runaway');
    const newX = Math.max(margin, Math.random() * maxX);
    const newY = Math.max(margin, Math.random() * maxY);
    btn.style.left = newX + 'px';
    btn.style.top = newY + 'px';

    dodges += 1;
    if (captionEl) {
      captionEl.textContent = messages[msgIndex % messages.length];
      msgIndex++;
    }

    // Slightly shrink after many dodges, just for fun, with a floor size.
    const scale = Math.max(0.65, 1 - dodges * 0.03);
    btn.style.transform = `scale(${scale})`;
  }

  btn.addEventListener('mouseenter', dodge);
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodge();
  }, { passive: false });
  btn.addEventListener('click', (e) => {
    // If somehow clicked, still dodge instead of navigating.
    e.preventDefault();
    dodge();
  });
  }

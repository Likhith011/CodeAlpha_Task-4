
const songs = [
  { title: "Brahmamurari", file: "Musics/Brahmamurari-SenSongsMp3.Co.mp3" },
  { title: "Mayavi", file: "Musics/Mayavi - DjPunjab.Com.Se.mp3" },
  { title: "Ninna Raja Nannu Nanna Rani", file: "Musics/Ninna Raja Nannu Nanna Rani - SenSongsMp3.Co.mp3" },
  { title: "Ninna Snehadinda", file: "Musics/Ninna-Snehadinda.mp3" },
  { title: "Om Mahaprana Deepam", file: "Musics/Om Mahaprana Deepam-SenSongsMp3.Co.mp3" },
  { title: "Onde Usiranthe", file: "Musics/Onde-Usiranthe.mp3" },
  { title: "Saaluthillave", file: "Musics/02_Saaluthillave_[CoolMusicZ.NeT].mp3" },
  { title: "Usire Usire", file: "Musics/Usire-Usire-Kannada.mp3" }
];

let currentSong = 0;

// DOM elements
const audio = document.getElementById("audio");
const title = document.getElementById("song-title");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");


// Load song
function loadSong(index, autoplay = false) {
  audio.src = songs[index].file;
  title.textContent = songs[index].title;

  // Wait until audio is ready, then optionally play
  audio.addEventListener("canplaythrough", () => {
    if (autoplay) {
      audio.play().then(() => {
        playBtn.textContent = "⏸️";
      }).catch(err => console.warn("Playback blocked:", err));
    }
  }, { once: true });
}

// Toggle play/pause
function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸️";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
}

// Button event listeners
playBtn.addEventListener("click", togglePlayPause);

prevBtn.addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong, true);
});

nextBtn.addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong, true);
});

// Update progress bar
audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.value = percent || 0;
});

progress.addEventListener("input", () => {
  const seekTime = (progress.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "Space":
      e.preventDefault();
      togglePlayPause();
      break;
    case "ArrowRight":
      currentSong = (currentSong + 1) % songs.length;
      loadSong(currentSong, true);
      break;
    case "ArrowLeft":
      currentSong = (currentSong - 1 + songs.length) % songs.length;
      loadSong(currentSong, true);
      break;
    case "ArrowUp":
      audio.volume = Math.min(audio.volume + 0.1, 1);
      console.log(`Volume: ${(audio.volume * 100).toFixed(0)}%`);
      break;
    case "ArrowDown":
      audio.volume = Math.max(audio.volume - 0.1, 0);
      console.log(`Volume: ${(audio.volume * 100).toFixed(0)}%`);
      break;
    case "KeyM":
      audio.muted = !audio.muted;
      console.log(audio.muted ? "Muted" : "Unmuted");
      break;
  }
});

// Initial load
loadSong(currentSong);
renderPlaylist();

function renderPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.classList.toggle("active", index === currentSong);
    li.addEventListener("click", () => {
      currentSong = index;
      loadSong(currentSong, true);
    });
    playlistEl.appendChild(li);
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.value = percent || 0;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

audio.addEventListener("ended", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong, true);
});

volumeSlider.addEventListener("input", () => {
  audio.volume = parseFloat(volumeSlider.value);
});

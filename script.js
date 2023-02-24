const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');
const likeButton = document.getElementById('like');

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;

const theTime = {
    songName: 'The Time',
    artist: 'Pink Floyd',
    file: 'pink-floyd-time',
    liked: false,
};
const cantHoldUs = {
    songName: 'Can\'t Hold Us',
    artist: 'MACKLEMORE & RYAN LEWIS',
    file: 'cant-hold-us',
    liked: false,
};
const countingStars = {
    songName: 'Counting Stars',
    artist: 'One Republic',
    file: 'counting-stars',
    liked: false,
};

const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [theTime, cantHoldUs, countingStars];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playSong() {
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlaying = true;
}

function pauseSong() {
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    song.pause();
    isPlaying = false;
}

function previousSong() {
    if (index === 0){
        index = sortedPlaylist.length - 1;
    } 
    else {
        index -= 1;
    }
    startSong();
    playSong();
}

function nextSong() {
    if (index === sortedPlaylist.length - 1){
        index = 0;
    } 
    else {
        index += 1;
    }
    startSong();
    playSong();
}

function playPauseDecider() {
    if ((isPlaying) === true) {
        pauseSong();
    }
    else {
        playSong();
    }
}

function startSong() {
    cover.src = `./images/${sortedPlaylist[index].file}.jpg`;
    song.src = `./songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function updateProgress() {
    const bardWidth = (song.currentTime/song.duration) * 100 + '%';
    currentProgress.style.setProperty('--progress', bardWidth);
    updateCurrentTime();
}

function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width) * song.duration;
    song.currentTime = jumpToTime;
    console.log(jumpToTime);
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    } 
}

function shuffleButtonClicked() {
    if (isShuffled === false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    } else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active');
    }
}

function repeatButtonClicked() {
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add('button-active');
    } else {
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

function nextOrRepeat() {
    if (repeatOn === false) {
        nextSong();
    } else {
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let horas = Math.floor(originalNumber/3600);
    let minutos = Math.floor((originalNumber - horas * 3600) / 60);
    let segundos = Math.floor(originalNumber - horas * 3600 - minutos * 60);
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
}

function updateTotalTime() {
    totalTime.innerText =   toHHMMSS(song.duration);
}

function updateCurrentTime() {
    songTime.innerText = toHHMMSS(song.currentTime);
}

function likeButtonRender() {
    if (sortedPlaylist[index].liked === true) {
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    } else {
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.classList.remove('button-active');
    }
}

function likeButtonClicked() {
    if (sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;
    } else {
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}

startSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong)
next.addEventListener('click', nextSong)
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);

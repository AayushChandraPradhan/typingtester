const words = "in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so face order school good not most run problem group run she late other problem real form what just high no man do under would to each too end point give number child through so this large see get form also all those course to work during about he plan still so like down he look down where course at who plan way so since come against he all who at world because while so few last these mean take house who old way large no first too now off would in this course present order home public school back own little about he develop of do over help day house stand present another by few come that down last or use say take would each even govern play around back under some line think she even when from do real problem between long as there school do as mean to all on other good may from might call world thing life turn of he look last problem after get show want need thing old other during be again develop come from consider the now number say life interest to system only group world same state school one problem between for turn run at very against eye must go both still all a as so after play eye little be those should out after which these both much house become both school this he real and may mean time by real number other as feel at end ask plan come turn by all head increase he present increase use stand after see order lead than system here ask in of look point little too without each for both but right we come world much own set we right off long those stand go both but under now must real general then before with much those at no of we only back these person plan from run new as own take early just increase only look open follow get that on system the mean plan man over it possible if most late line would first without real hand say turn point small set at in system however to be home show new again come under because about show face child know person large program how over could thing from out world while nation stand part run have look what many system order some one program you great could write day do he any also where child late face eye run still again on by as call high the must by late little mean never another seem to leave because for day against public long number word about after much need open change also".split(' ');
const wordsCount = words.length;
const gameTime = 30 * 1000;
let timer = null;
let gameStart = null;
let totalMistakes = 0;

function addClass(el, ...names) {
  el.classList.add(...names);
}

function removeClass(el, ...names) {
  el.classList.remove(...names);
}

function randomWord() {
  const randomIndex = Math.floor(Math.random() * wordsCount);
  return words[randomIndex];
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  clearInterval(timer);
  totalMistakes = 0;
  const wordsContainer = document.getElementById('words');
  wordsContainer.innerHTML = '';
  for (let i = 0; i < 200; i++) {
    wordsContainer.innerHTML += formatWord(randomWord());
  }
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.getElementById('info').textContent = (gameTime / 1000).toString();
  removeClass(document.getElementById('game'), 'over');
  timer = null;
  updateWordColors();
  updateCursor();
  
  // Hide end screen
  document.getElementById('end-screen').style.display = 'none';
  document.getElementById('game').style.display = 'block';
}

function getWpm() {
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord);
  const typedWords = words.slice(0, lastTypedWordIndex);
  const correctWords = typedWords.filter(word => {
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.classList.contains('incorrect'));
    const correctLetters = letters.filter(letter => letter.classList.contains('correct'));
    return incorrectLetters.length === 0 && correctLetters.length === letters.length;
  });
  return (correctWords.length / (gameTime / 1000)) * 60;
}

function gameOver() {
  clearInterval(timer);
  addClass(document.getElementById('game'), 'over');
  const wpm = getWpm();
  
  // Update end screen
  document.getElementById('final-wpm').textContent = wpm.toFixed(2);
  document.getElementById('total-mistakes').textContent = totalMistakes;
  
  // Show end screen
  document.getElementById('game').style.display = 'none';
  document.getElementById('end-screen').style.display = 'block';
}

function updateWordColors() {
  const words = document.querySelectorAll('.word');
  let foundCurrent = false;
  let wordCount = 0;

  words.forEach((word) => {
    if (word.classList.contains('current')) {
      foundCurrent = true;
      word.classList.add('current');
      word.classList.remove('typed', 'upcoming');
    } else if (foundCurrent) {
      if (wordCount >= 1) {  // Only add 'upcoming' class after the first word
        word.classList.add('upcoming');
      }
      word.classList.remove('typed', 'current');
    } else {
      word.classList.add('typed');
      word.classList.remove('current', 'upcoming');
    }
    wordCount++;
  });
}

function updateCursor() {
  const currentWord = document.querySelector('.word.current');
  const currentLetter = currentWord.querySelector('.letter.current');
  const cursor = document.getElementById('cursor');
  
  if (currentLetter) {
    const rect = currentLetter.getBoundingClientRect();
    cursor.style.top = `${rect.top + 2}px`;
    cursor.style.left = `${rect.left}px`;
  } else {
    // If there's no current letter, place the cursor at the end of the current word
    const lastLetter = currentWord.querySelector('.letter:last-child');
    if (lastLetter) {
      const rect = lastLetter.getBoundingClientRect();
      cursor.style.top = `${rect.top + 2}px`;
      cursor.style.left = `${rect.right}px`;
    }
  }
}

function handleKeyUp(ev) {
  const key = ev.key;
  const currentWord = document.querySelector('.word.current');
  const currentLetter = currentWord.querySelector('.letter.current');
  const expected = currentLetter?.textContent || ' ';
  const isLetter = key.length === 1 && key !== ' ';
  const isSpace = key === ' ';
  const isBackspace = key === 'Backspace';
  const isFirstLetter = currentLetter === currentWord.firstChild;

  if (document.querySelector('#game.over')) {
    return;
  }

  if (!timer && isLetter) {
    startTimer();
  }

  if (isLetter) {
    if (currentLetter) {
      if (key !== expected) {
        totalMistakes++;
      }
      addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
      removeClass(currentLetter, 'current');
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, 'current');
      }
    }
  }

  if (isSpace) {
    if (expected !== ' ') {
      const lettersToInvalidate = [...currentWord.querySelectorAll('.letter:not(.correct)')];
      lettersToInvalidate.forEach((letter) => {
        addClass(letter, 'incorrect');
        totalMistakes++;
      });
    }
    removeClass(currentWord, 'current');
    addClass(currentWord.nextSibling, 'current');
    if (currentLetter) {
      removeClass(currentLetter, 'current');
    }
    addClass(currentWord.nextSibling.firstChild, 'current');
  }

  if (isBackspace) {
    if (currentLetter && isFirstLetter) {
      // Move to previous word
      removeClass(currentWord, 'current');
      addClass(currentWord.previousSibling, 'current');
      removeClass(currentLetter, 'current');
      const lastLetter = currentWord.previousSibling.lastChild;
      if (lastLetter) {
        addClass(lastLetter, 'current');
        removeClass(lastLetter, 'incorrect', 'correct');
      }
    } else if (currentLetter && !isFirstLetter) {
      // Move to previous letter
      removeClass(currentLetter, 'current');
      addClass(currentLetter.previousSibling, 'current');
      removeClass(currentLetter.previousSibling, 'incorrect', 'correct');
    } else if (!currentLetter) {
      // If at the end of a word, move to the last letter
      const lastLetter = currentWord.lastChild;
      if (lastLetter) {
        addClass(lastLetter, 'current');
        removeClass(lastLetter, 'incorrect', 'correct');
      }
    }
  }

  if (currentWord.getBoundingClientRect().top > 250) {
    const wordsContainer = document.getElementById('words');
    const margin = parseInt(wordsContainer.style.marginTop || '0px', 10);
    wordsContainer.style.marginTop = (margin - 35) + 'px';
  }

  updateWordColors();
  updateCursor();
}

function startTimer() {
  gameStart = Date.now();
  timer = setInterval(() => {
    const currentTime = Date.now();
    const msPassed = currentTime - gameStart;
    const sPassed = Math.round(msPassed / 1000);
    const sLeft = Math.round((gameTime / 1000) - sPassed);
    if (sLeft <= 0) {
      gameOver();
      return;
    }
    document.getElementById('info').textContent = sLeft.toString();
  }, 1000);
}

function setTheme(theme) {
  const root = document.documentElement;
  root.className = ''; // Reset any existing theme class
  if (theme !== 'default') {
      root.classList.add(`theme-${theme}`);
  }
}

document.getElementById('newGameBtn').addEventListener('click', newGame);
document.getElementById('restart-btn').addEventListener('click', newGame);

document.getElementById('theme').addEventListener('change', (event) => {
  const selectedTheme = event.target.value;
  setTheme(selectedTheme);
});

document.getElementById('game').addEventListener('keyup', handleKeyUp);

// Initialize the game
newGame();
document.getElementById('game').focus();
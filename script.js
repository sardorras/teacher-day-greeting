// Праздничный сайт ко Дню учителя
// Чистый JavaScript без библиотек.
// Все анимации держатся на transform и opacity.

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  currentQuiz: 0,
  score: 0,
  music: false,
  audioCtx: null,
};

document.addEventListener("DOMContentLoaded", () => {
  initBookIntro();
  initFloatingLetters();
  initReveals();
  initSlider();
  initDictionary();
  initQuiz();
  initTypoFix();
  initWishWall();
  initProgress();
  initFinalConfetti();
  initMusicToggle();
  initScrollButtons();
});

/* ----------------------------------------------------------- */
/* Вступительная анимация "Открытая книга" */
/* ----------------------------------------------------------- */
function initBookIntro() {
  const intro = document.getElementById("bookIntro");
  const button = intro ? intro.querySelector(".book-open-button") : null;

  if (!intro || !button) return;

  const openBook = () => {
    intro.classList.add("open");
    setTimeout(() => {
      intro.classList.add("hidden");
    }, 1000);
  };

  setTimeout(() => {
    if (!prefersReducedMotion) {
      intro.classList.add("open");
      setTimeout(() => {
        intro.classList.add("hidden");
      }, 1200);
    } else {
      intro.classList.add("hidden");
    }
  }, 1600);

  button.addEventListener("click", openBook);
}

/* ----------------------------------------------------------- */
/* Парящие буквы на фоне */
/* ----------------------------------------------------------- */
function initFloatingLetters() {
  const root = document.querySelector(".floating-letters");
  if (!root) return;

  const letters = ["А", "Б", "Ж", "Я", "Ё", "Ъ", "И", "С", "Л", "Р", "П", "Т"];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 18; i += 1) {
    const span = document.createElement("span");
    span.className = "floating-letter";
    span.textContent = letters[i % letters.length];
    span.style.left = `${Math.random() * 100}%`;
    span.style.top = `${Math.random() * 100}%`;
    span.style.fontSize = `${(Math.random() * 2 + 1.2).toFixed(2)}rem`;
    span.style.animationDelay = `${(Math.random() * 8).toFixed(2)}s`;
    span.style.animationDuration = `${(Math.random() * 10 + 12).toFixed(2)}s`;
    fragment.appendChild(span);
  }

  root.appendChild(fragment);
}

/* ----------------------------------------------------------- */
/* Появление блоков при скролле */
/* ----------------------------------------------------------- */
function initReveals() {
  const revealNodes = document.querySelectorAll(".reveal");
  if (!revealNodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

/* ----------------------------------------------------------- */
/* Карточки цитат: перелистывание */
/* ----------------------------------------------------------- */
function initSlider() {
  const cards = Array.from(document.querySelectorAll(".quote-card"));
  const prev = document.querySelector(".slider-nav.prev");
  const next = document.querySelector(".slider-nav.next");
  let index = 0;

  function showCard(nextIndex) {
    index = (nextIndex + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
  }

  if (prev) {
    prev.addEventListener("click", () => showCard(index - 1));
  }

  if (next) {
    next.addEventListener("click", () => showCard(index + 1));
  }

  if (cards.length) {
    showCard(0);
  }
}

/* ----------------------------------------------------------- */
/* Словарь благодарности */
/* ----------------------------------------------------------- */
function initDictionary() {
  const cards = Array.from(document.querySelectorAll(".word-card"));
  const dictionary = {
    терпение: {
      title: "Терпение",
      text:
        "Терпение — это не пассивное ожидание, а способность длительно и внимательно расти в слове, мысли и характере. Именно оно делает учителя сильным и человечным: он не спешит сдаваться ни в детях, ни в себе.",
    },
    мудрость: {
      title: "Мудрость",
      text:
        "Мудрость — это способность видеть не только факт, но и смысл. Она приходит не от знания ради знания, а от зрелого и заботливого отношения к человеку, его сомнениям, слабостям и росту.",
    },
    вдохновение: {
      title: "Вдохновение",
      text:
        "Вдохновение — это состояние, когда мы вдруг ясно видим, что любая работа становится не обязанностью, а внутренним разговором с искусством и жизнью. Учитель умеет не только передать знания, но и разбудить в другом человеке интерес.",
    },
    строгость: {
      title: "Строгость",
      text:
        "Строгость — не насилие, а форма уважения. Она помогает удержать границу, сделать труд честным и научить замечать, что качество мысли и слова имеет значение.",
    },
    доброта: {
      title: "Доброта",
      text:
        "Доброта — это не мягкость без меры, а точное, бережное и зрелое отношение к людям. Она слышится в тоне, в выборе слов и в способности не подавить, а поддержать.",
    },
  };

  const articleWord = document.getElementById("dictionary-word");
  const articleText = document.getElementById("dictionary-text");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      cards.forEach((item) => item.classList.remove("active"));
      card.classList.add("active");

      const key = card.dataset.word;
      const entry = dictionary[key];
      if (!entry) return;

      articleWord.textContent = entry.title;
      articleText.textContent = entry.text;
    });
  });
}

/* ----------------------------------------------------------- */
/* Мини-игра "Угадай классика" */
/* ----------------------------------------------------------- */
function initQuiz() {
  const questions = [
    {
      question: "Кто написал строки: «Вдохновение нужно в геометрии, как и в поэзии»?",
      options: ["А. С. Пушкин", "М. Ю. Лермонтов", "Ф. М. Достоевский", "И. А. Бунин"],
      correct: 0,
    },
    {
      question: "Кому принадлежит тезис: «Слово — это жизнь»?",
      options: [
        "А. П. Чехову",
        "Л. Н. Толстому",
        "А. Н. Островскому",
        "Н. А. Некрасову",
      ],
      correct: 1,
    },
    {
      question: "Какой писатель известен фразой: «Человек — это звучит гордо»?",
      options: ["И. С. Тургенев", "А. П. Чехов", "Ф. И. Тютчев", "А. Н. Толстой"],
      correct: 2,
    },
    {
      question: "Кто создал образ «воспитателя человеческих душ» в литературе?",
      options: ["Гоголь", "Тютчев", "Пушкин", "Грин"],
      correct: 2,
    },
    {
      question: "Кто из писателей много писал о русском языке и его красоте?",
      options: ["А. С. Пушкин", "С. А. Есенин", "И. А. Крылов", "М. В. Ломоносов"],
      correct: 0,
    },
  ];

  const progress = document.getElementById("quizProgress");
  const questionEl = document.getElementById("quizQuestion");
  const optionsEl = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");

  function renderQuestion() {
    const q = questions[state.currentQuiz];
    questionEl.textContent = q.question;
    progress.textContent = `Вопрос ${state.currentQuiz + 1}/${questions.length}`;

    optionsEl.innerHTML = "";
    q.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;
      button.setAttribute("aria-label", `Вариант ответа ${index + 1}: ${option}`);

      button.addEventListener("click", () => {
        const isCorrect = index === q.correct;
        const optionButtons = [...optionsEl.querySelectorAll(".quiz-option")];

        optionButtons.forEach((item) => {
          item.disabled = true;
          item.classList.remove("correct", "wrong");
        });

        if (isCorrect) {
          state.score += 1;
          button.classList.add("correct");
          feedbackEl.textContent = "Верно. Слова живут не только в тексте, но и в уме.";
        } else {
          button.classList.add("wrong");
          const correctButton = optionButtons[q.correct];
          correctButton.classList.add("correct");
          feedbackEl.textContent = `Немного не так. Правильно: ${q.options[q.correct]}`;
        }

        setTimeout(() => {
          state.currentQuiz += 1;
          if (state.currentQuiz < questions.length) {
            renderQuestion();
            feedbackEl.textContent = "";
          } else {
            questionEl.textContent = "Итог: вы уже почти на шаг ближе к литературной культуре.";
            optionsEl.innerHTML = "";
            progress.textContent = `Результат ${state.score}/${questions.length}`;
            feedbackEl.textContent =
              state.score >= 4
                ? "Отлично! Вы хорошо знакомы с русской словесностью."
                : "Неплохо. Важно не только читать, но и слышать язык.";
          }
        }, 1100);
      });

      optionsEl.appendChild(button);
    });
  }

  renderQuestion();
}

/* ----------------------------------------------------------- */
/* Орфографический сюрприз с исправлением ошибок */
/* ----------------------------------------------------------- */
function initTypoFix() {
  const typoWords = document.querySelectorAll(".typo-word");
  const button = document.querySelector(".typo-check");

  typoWords.forEach((word) => {
    word.addEventListener("click", () => {
      const correct = word.dataset.correct;
      const current = word.textContent.trim();
      if (current !== correct) {
        word.textContent = correct;
        word.classList.remove("wrong");
        word.classList.add("correct");
      }
    });
  });

  if (button) {
    button.addEventListener("click", () => {
      const wrongWords = [...typoWords].filter((w) => w.dataset.correct !== w.textContent.trim());
      if (wrongWords.length === 0) {
        button.textContent = "Текст прекрасен!";
        button.classList.add("success");
        return;
      }

      wrongWords.forEach((word) => {
        word.textContent = word.dataset.correct;
        word.classList.remove("wrong");
        word.classList.add("correct");
      });

      button.textContent = "Исправлено — спасибо, что не спешите!";
    });
  }
}

/* ----------------------------------------------------------- */
/* Стена пожеланий */
/* ----------------------------------------------------------- */
function initWishWall() {
  const form = document.getElementById("wishForm");
  const wall = document.getElementById("wishesWall");
  const nameInput = document.getElementById("wishName");
  const textInput = document.getElementById("wishText");

  if (!form || !wall) return;

  const exampleWishes = [
    { name: "Студент", text: "Спасибо за точность, с которой вы учите нас слышать себя и других." },
    { name: "Родитель", text: "Ваши уроки учат не только анализировать, но и уважать слово." },
    { name: "Выпускник", text: "Вы сделали так, чтобы чтение стало не обязанностью, а удовольствием." },
    { name: "Коллега", text: "Ваши строгие и добрые уроки не теряют силы даже спустя годы." },
    { name: "Друзья", text: "Вы научили нас думать глубже и говорить яснее." },
    { name: "Ученик", text: "Спасибо за терпение, которое вы вкладывали в каждое слово." },
  ];

  function renderWish(item) {
    const card = document.createElement("article");
    card.className = "wish-letter";
    card.innerHTML = `
      <p class="wish-name">${item.name}</p>
      <p class="wish-text">${item.text}</p>
    `;
    wall.prepend(card);
  }

  const stored = localStorage.getItem("teacherWishes");
  const wishes = stored ? JSON.parse(stored) : exampleWishes;

  wishes.forEach(renderWish);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) return;

    const newWish = { name, text };
    const current = JSON.parse(localStorage.getItem("teacherWishes") || "[]");
    current.unshift(newWish);
    localStorage.setItem("teacherWishes", JSON.stringify(current));

    renderWish(newWish);

    form.reset();
    nameInput.focus();
  });
}

/* ----------------------------------------------------------- */
/* Прогресс чтения */
/* ----------------------------------------------------------- */
function initProgress() {
  const progressDot = document.querySelector(".progress-dot");
  if (!progressDot) return;

  const update = () => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    const translate = ratio * 100;
    progressDot.style.transform = `translateY(${translate}%)`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ----------------------------------------------------------- */
/* Финальный салют: конфетти */
/* ----------------------------------------------------------- */
function initFinalConfetti() {
  const button = document.getElementById("celebrateButton");
  if (!button) return;

  button.addEventListener("click", () => {
    const canvas = document.getElementById("leafCanvas");
    const ctx = canvas.getContext("2d");
    const particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 145; i += 1) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.7,
        r: Math.random() * 5 + 3,
        dx: (Math.random() - 0.5) * 11,
        dy: (Math.random() - 0.7) * 9 - 1,
        color: i % 2 ? "#b8893b" : "#7a1f2b",
        letter: ["Т", "С", "Л", "Ж", "Я", "Р", "Б", "А"][i % 8],
        spin: (Math.random() - 0.5) * 0.18,
      });
    }

    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.03;
        p.spin += 0.04;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.fillStyle = p.color;
        ctx.font = `${p.r * 3.4}px serif`;
        ctx.fillText(p.letter, 0, 0);
        ctx.restore();
      });

      frame += 1;
      if (frame < 110) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    requestAnimationFrame(tick);
  });
}

/* ----------------------------------------------------------- */
/* Кнопка фоновой музыки: по умолчанию выключена */
/* ----------------------------------------------------------- */
function initMusicToggle() {
  const button = document.querySelector(".music-toggle");
  if (!button) return;

  const setState = (isOn) => {
    state.music = isOn;
    button.classList.toggle("is-on", isOn);
    button.setAttribute("aria-pressed", String(isOn));
    button.setAttribute("aria-label", isOn ? "Выключить фоновую музыку" : "Включить фоновую музыку");
    if (isOn) {
      startSoftMusic();
    } else {
      stopSoftMusic();
    }
  };

  setState(false);

  button.addEventListener("click", () => {
    setState(!state.music);
  });
}

function startSoftMusic() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  if (!state.audioCtx) {
    state.audioCtx = new AudioCtx();
  }

  if (state.audioCtx.state === "suspended") {
    state.audioCtx.resume();
  }

  const notes = [261.63, 329.63, 392.0, 329.63, 293.66, 329.63, 392.0, 440.0];
  let i = 0;

  const playNote = () => {
    if (!state.music || !state.audioCtx) return;

    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = notes[i % notes.length];
    gain.gain.value = 0.03;

    osc.connect(gain);
    gain.connect(state.audioCtx.destination);

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + 1.2);
    osc.stop(state.audioCtx.currentTime + 1.2);

    i += 1;
    setTimeout(playNote, 520);
  };

  playNote();
}

function stopSoftMusic() {
  if (state.audioCtx && state.audioCtx.state === "running") {
    state.audioCtx.suspend();
  }
}

/* ----------------------------------------------------------- */
/* Кнопка "Вниз" и плавная прокрутка */
/* ----------------------------------------------------------- */
function initScrollButtons() {
  const buttons = document.querySelectorAll(".scroll-to-next");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target || "#quotes";
      const node = document.querySelector(target);
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

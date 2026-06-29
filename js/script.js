
const lessons = a0Lessons;

let state = JSON.parse(localStorage.getItem("englishStarState")) || {
  studentName: "",
  profile: "",
  xp: 0,
  completed: [],
  medals: [],
  streak: 1,
  lastLogin: new Date().toDateString()
};

const lessonList = document.getElementById("lessonList");
const lessonView = document.getElementById("lessonView");
let currentLessonIndex = 0;
let currentLessonStep = 0;

const lessonSteps = [
  "Objective",
  "Theory",
  "Vocabulary",
  "Grammar",
  "Dialogue",
  "Listening",
  "Speaking",
  "Reading",
  "Writing",
  "Common Mistakes",
  "Summary",
  "Mastery Check",
  "Quiz"
];

function saveState() {
  localStorage.setItem("englishStarState", JSON.stringify(state));
}

function createProfile(profile) {
  const nameInput = document.getElementById("studentName");
  const name = nameInput.value.trim();

  if (name === "") {
    alert("Escribe tu nombre para crear tu perfil.");
    return;
  }

  state.studentName = name;
  state.profile = profile;
  saveState();
  showApp();
}

function showApp() {
  if (state.studentName && state.profile) {
    document.getElementById("welcomeCard").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("mainContent").classList.remove("hidden");
    document.getElementById("mainNav").classList.remove("hidden");
    document.getElementById("vocabularySection").classList.remove("hidden");
    document.getElementById("listeningSection").classList.remove("hidden");
    document.getElementById("speakingSection").classList.remove("hidden");
    document.getElementById("certificateSection").classList.remove("hidden");
    document.getElementById("grammarSection").classList.remove("hidden");
    document.getElementById("readingSection").classList.remove("hidden");
    document.getElementById("writingSection").classList.remove("hidden");
    document.getElementById("examSection").classList.remove("hidden");

    const achievements = document.getElementById("achievementsSection");
    if (achievements) {
      achievements.classList.remove("hidden");
    }

    const roadmap = document.getElementById("roadmapSection");
    if (roadmap) {
      roadmap.classList.remove("hidden");
    }

    const welcomeText = document.getElementById("welcomeText");
    const profileText = document.getElementById("profileText");

    if (welcomeText) {
      welcomeText.textContent = `Welcome, ${state.studentName}`;
    }

    if (profileText) {
      profileText.textContent = `Profile: ${state.profile}`;
    }

    updateDailyStreak();
    updateStats();
    renderLessons();
    renderFlashcard();
    renderCertificate();
    renderMidtermExam();
  }
}

function updateStats() {
  const progress = Math.round(
    (state.completed.length / lessons.length) * 100
  );

  document.getElementById("xp").textContent = state.xp;
  const streakElement =
    document.getElementById("streak");

  if (streakElement) {
    streakElement.textContent =
      state.streak;
  }
  const studentLevel = Math.floor(state.xp / 100) + 1;

  const studentLevelElement =
    document.getElementById("studentLevel");

  if (studentLevelElement) {
    studentLevelElement.textContent = studentLevel;
  }

  const xpInCurrentLevel = state.xp % 100;

  const xpToNextElement =
    document.getElementById("xpToNext");

  const miniXpFill =
    document.getElementById("miniXpFill");

  if (xpToNextElement && miniXpFill) {
    xpToNextElement.textContent =
      `${xpInCurrentLevel} / 100`;

    miniXpFill.style.width =
      xpInCurrentLevel + "%";
  }
  document.getElementById("progress").textContent = progress + "%";
  document.getElementById("medals").textContent = state.medals.length;
  const progressFill = document.getElementById("progressFill");

  if (progressFill) {
    progressFill.style.width = progress + "%";
  }

  const lessonCounter = document.getElementById("lessonCounter");

  if (lessonCounter) {
    lessonCounter.textContent =
      `${state.completed.length} de ${lessons.length} lecciones completadas`;
  }
  updateRoadmap();
  renderMedals();
  const topProfileName = document.getElementById("topProfileName");
  const topStudentLevel = document.getElementById("topStudentLevel");
  const topXp = document.getElementById("topXp");

  if (topProfileName) {
    topProfileName.textContent = state.studentName || "Student";
  }

  if (topStudentLevel) {
    topStudentLevel.textContent =
      Math.floor(state.xp / 100) + 1;
  }

  if (topXp) {
    topXp.textContent = state.xp;
  }
  const headerName = document.getElementById("headerName");
  const headerLevel = document.getElementById("headerLevel");
  const headerXp = document.getElementById("headerXp");
  const headerStreak = document.getElementById("headerStreak");

  if (headerName) {
    headerName.textContent = state.studentName || "Student";
  }

  if (headerLevel) {
    headerLevel.textContent = Math.floor(state.xp / 100) + 1;
  }

  if (headerXp) {
    headerXp.textContent = state.xp;
  }

  if (headerStreak) {
    headerStreak.textContent = state.streak || 1;
  }
  const heroStudentName =
    document.getElementById(
      "heroStudentName"
    );

  if (heroStudentName) {
    heroStudentName.textContent =
      state.studentName;
  }
  const courseProgress =
    document.getElementById("courseProgress");

  const courseBarFill =
    document.getElementById("courseBarFill");

  if (courseProgress) {
    courseProgress.textContent =
      progress + "%";
  }

  if (courseBarFill) {
    courseBarFill.style.width =
      progress + "%";
  }
  const nextIndex = state.completed.length;
  const nextLesson = lessons[nextIndex] || lessons[lessons.length - 1];

  const nextLessonTitle = document.getElementById("nextLessonTitle");
  const nextLessonObjective = document.getElementById("nextLessonObjective");

  if (nextLessonTitle && nextLesson) {
    nextLessonTitle.textContent =
      `${nextLesson.unit}: ${nextLesson.title}`;
  }

  if (nextLessonObjective && nextLesson) {
    nextLessonObjective.textContent = nextLesson.objective;
  }
  const titleCard = document.getElementById("nextLessonTitleCard");
const objectiveCard = document.getElementById("nextLessonObjectiveCard");

if (nextLesson && titleCard && objectiveCard) {
  titleCard.textContent =
    `${nextLesson.unit}: ${nextLesson.title}`;

  objectiveCard.textContent =
    nextLesson.objective;
}

  const activityTitle = document.getElementById("activityTitle");
  const activityText = document.getElementById("activityText");

  if (activityTitle && activityText) {
    if (state.completed.length === 0) {
      activityTitle.textContent = "No activity yet";
      activityText.textContent =
        "Complete your first lesson to see your progress here.";
    } else {
      activityTitle.textContent = "Latest progress";
      activityText.textContent =
        `${state.completed.length} of ${lessons.length} A0 lessons completed.`;
    }
  }
  const sidebarStudentName =
    document.getElementById(
      "sidebarStudentName"
    );

  const sidebarLevel =
    document.getElementById(
      "sidebarLevel"
    );

  const sidebarXp =
    document.getElementById(
      "sidebarXp"
    );

  if (sidebarStudentName) {
    sidebarStudentName.textContent =
      state.studentName;
  }

  if (sidebarLevel) {
    sidebarLevel.textContent =
      Math.floor(state.xp / 100) + 1;
  }

  if (sidebarXp) {
    sidebarXp.textContent =
      state.xp;
  }
}

function renderLessons() {
  lessonList.innerHTML = `
    <h2>📚 Nivel A0</h2>
    <p>4 módulos · ${lessons.length} unidades</p>
    <br>
  `;

  const modules = {};

  lessons.forEach((lesson, index) => {
    if (!modules[lesson.module]) {
      modules[lesson.module] = [];
    }

    modules[lesson.module].push({
      ...lesson,
      index: index
    });
  });

  Object.keys(modules).forEach((moduleName, moduleIndex) => {
    const moduleBox = document.createElement("div");
    moduleBox.className = "module-box accordion-module";

    const unitCount = modules[moduleName].length;

    const completedInModule = modules[moduleName].filter(lesson =>
      state.completed.includes(lesson.index)
    ).length;

    const moduleProgress = Math.round(
      (completedInModule / unitCount) * 100
    );

    const isOpen = moduleIndex === 0 ? "open" : "";

    moduleBox.innerHTML = `
      <button class="accordion-header" onclick="toggleModule(this)">
        <div>
          <span class="module-label">Course Module</span>
          <h3>${moduleName}</h3>
          <p>${unitCount} units · ${completedInModule} completed · ${moduleProgress}%</p>

          <div class="module-progress">
            <div style="width: ${moduleProgress}%"></div>
          </div>
        </div>

        <div class="accordion-right">
          <span class="module-number">${unitCount}</span>
          <span class="accordion-icon">⌄</span>
        </div>
      </button>

      <div class="accordion-content ${isOpen}">
      </div>
    `;

    const content = moduleBox.querySelector(".accordion-content");

    modules[moduleName].forEach(lesson => {
      const isCompleted = state.completed.includes(lesson.index);
      const isLocked =
        lesson.index > 0 && !state.completed.includes(lesson.index - 1);

      const button = document.createElement("button");
      button.className = "lesson-btn";

      if (isCompleted) button.classList.add("completed");
      if (isLocked) button.classList.add("locked");

      let statusClass = "available";
      let statusText = "Available";

      if (isCompleted) {
        statusClass = "completed";
        statusText = "Completed";
      }

      if (isLocked) {
        statusClass = "locked";
        statusText = "Locked";
      }

      button.innerHTML = `
        <div class="lesson-card-content">
          <div>
            <strong>${lesson.unit}: ${lesson.title}</strong>
            <p>${lesson.objective}</p>
          </div>

          <span class="status-pill ${statusClass}">
            ${statusText}
          </span>
        </div>
      `;

      button.onclick = () => {
        if (!isLocked) {
          openLesson(lesson.index);
        } else {
          alert("Primero completa la unidad anterior.");
        }
      };

      content.appendChild(button);
    });

    lessonList.appendChild(moduleBox);
  });
}
function toggleModule(header) {
  const moduleBox = header.closest(".accordion-module");
  const content = moduleBox.querySelector(".accordion-content");

  content.classList.toggle("open");
  moduleBox.classList.toggle("active");
}
function openLesson(index) {
  currentLessonIndex = index;
  currentLessonStep = 0;
  renderLessonStep();
}

function renderLessonStep() {
  const lesson = lessons[currentLessonIndex];
  const step = lessonSteps[currentLessonStep];

  let stepContent = "";

  if (step === "Objective") {
    stepContent = `
      <div class="lesson-step-card">
        <span class="section-label">Learning Objective</span>
        <h3>${lesson.objective}</h3>
        <p>
          In this unit, you will learn the key words, phrases and practice
          activities for this topic.
        </p>
      </div>
    `;
  }
  if (step === "Theory") {
  stepContent = `
    <div class="lesson-step-card">
      <span class="section-label">Theory</span>

      <h3>Lesson Explanation</h3>

      <div class="theory-box">
        ${lesson.theory || "Theory coming soon."}
      </div>
    </div>
  `;
}

  if (step === "Vocabulary") {
  const vocabularySource = lesson.vocabularyDetails || lesson.words.map(item => {
    const parts = item.split("=");
    return {
      english: parts[0].trim(),
      spanish: parts[1] ? parts[1].trim() : "",
      pronunciation: "",
      example: ""
    };
  });

  stepContent = `
    <div class="lesson-step-card">
      <span class="section-label">Vocabulary</span>
      <h3>Study the words</h3>

      <div class="vocabulary-grid">
        ${vocabularySource.map(item => `
          <div class="vocabulary-card">
            <h3>${item.english}</h3>

            <p>${item.spanish}</p>

            ${
              item.pronunciation
                ? `<small class="pronunciation-text">Pronunciation: ${item.pronunciation}</small>`
                : ""
            }

            ${
              item.example
                ? `
                  <div class="vocab-example">
                    <span>Example</span>
                    <p>${item.example}</p>

                    <div class="audio-actions">
  <button
    class="mini-audio-btn"
    onclick="speak('${item.example}')">
    Listen example
  </button>

  <button
    class="mini-audio-btn slow-btn"
    onclick="speakSlow('${item.example}')">
    Slow
  </button>
</div>
                  </div>
                `
                : ""
            }

            <div class="audio-actions">
  <button
    class="mini-audio-btn"
    onclick="speak('${item.english}')">
    Listen word
  </button>

  <button
    class="mini-audio-btn slow-btn"
    onclick="speakSlow('${item.english}')">
    Slow
  </button>
</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

  if (step === "Grammar") {
  stepContent = `
    <div class="lesson-step-card">
      <span class="section-label">Grammar</span>

      <h3>Grammar Explanation</h3>

      <div class="theory-box">
        ${lesson.grammarExplanation || "Grammar explanation coming soon."}
      </div>

      <h3>Useful Examples</h3>

      <div class="grammar-audio-list">
        ${lesson.grammar.map(item => `
          <div class="grammar-audio-item">
            <p>${item}</p>

            <button
              class="mini-audio-btn"
              onclick="speak('${item}')">
              Listen
            </button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
  if (step === "Dialogue") {
  stepContent = `
    <div class="lesson-step-card">
      <span class="section-label">Real Conversation</span>

      <h3>Practice Dialogue</h3>

      <div class="dialogue-box">
        ${
          lesson.dialogue
            ? lesson.dialogue.map(line => `
              <div class="dialogue-line">
                <p>${line}</p>

                <button
                  class="mini-audio-btn"
                  onclick="speak('${line.replace("A:", "").replace("B:", "").trim()}')">
                  Listen
                </button>
              </div>
            `).join("")
            : "<p>Dialogue coming soon.</p>"
        }
      </div>

      <button
        class="audio-btn"
        onclick="speak('${lesson.dialogue ? lesson.dialogue.join(". ") : lesson.phrase}')">
        Listen Full Dialogue
      </button>
    </div>
  `;
}

  if (step === "Listening") {
  stepContent = `
    <div class="lesson-step-card">
      <span class="section-label">Listening Practice</span>
      <h3>Listen and answer</h3>

      <p class="listening-script">${lesson.phrase}</p>

      <button class="audio-btn" onclick="speak('${lesson.phrase}')">
        Listen
      </button>

      <div class="reading-question-box">
        <h3>${lesson.question}</h3>

        ${lesson.options.map(option => `
          <button
            class="option listening-practice-option"
            onclick="checkLessonListening('${option}', '${lesson.answer}')">
            ${option}
          </button>
        `).join("")}

        <p id="lessonListeningResult" class="result"></p>
      </div>
    </div>
  `;
}

  if (step === "Speaking") {
  stepContent = `
    <div class="lesson-step-card">
      <span class="section-label">Speaking Practice</span>

      <h3>Pronunciation Practice</h3>

      <p>
        Listen carefully and repeat each phrase clearly.
      </p>

      <div class="speaking-practice-list">
        ${
          lesson.speaking
            ? lesson.speaking.map(phrase => `
              <div class="speaking-practice-item">
                <p>${phrase}</p>

                <button
                  class="audio-btn"
                  onclick="speak('${phrase}')">
                  Listen
                </button>
              </div>
            `).join("")
            : `<p>${lesson.phrase}</p>`
        }
      </div>

      <div class="speaking-tips">
        <h4>Practice tips</h4>

        <ul>
          <li>Listen first.</li>
          <li>Repeat slowly.</li>
          <li>Practice each phrase three times.</li>
          <li>Focus on clear pronunciation.</li>
        </ul>
      </div>
    </div>
  `;
}

  if (step === "Reading") {
  const readingContent =
    lesson.readingTranslation || [];

  stepContent = `
    <div class="lesson-step-card">
      <span class="section-label">
        Reading Practice
      </span>

      <h3>
        Read, listen and understand
      </h3>

      <div class="reading-audio-box">

        ${
          readingContent.length > 0
            ? readingContent.map(item => `
              <div class="reading-line">

                <div class="reading-text-group">
                  <p class="reading-english">
                    ${item.english}
                  </p>

                  <p class="reading-spanish">
                    ${item.spanish}
                  </p>
                </div>

                <button
                  class="mini-audio-btn"
                  onclick="speak('${item.english}')">
                  Listen
                </button>

              </div>
            `).join("")
            : `
              <p>${lesson.reading}</p>
            `
        }

      </div>

      <div class="reading-question-box">

        <h3>${lesson.question}</h3>

        ${lesson.options.map(option => `
          <button
            class="option reading-practice-option"
            onclick="checkLessonReading('${option}', '${lesson.answer}')">
            ${option}
          </button>
        `).join("")}

        <p id="lessonReadingResult" class="result"></p>

      </div>
    </div>
  `;
}

  if (step === "Writing") {
  stepContent = `
    <div class="lesson-step-card">
      <span class="section-label">Writing Practice</span>
      <h3>Complete the sentence</h3>

      <p class="writing-task">${lesson.writing}</p>

      <input
        type="text"
        id="lessonWritingInput"
        class="lesson-writing-input"
        placeholder="Write your answer here"
      >

      <button
        class="lesson-writing-btn"
        onclick="checkLessonWriting()">
        Check answer
      </button>
      

      <p id="lessonWritingResult" class="result"></p>
      <div class="guided-writing-box">
  <h3>Guided Writing</h3>

  ${
    lesson.guidedWriting
      ? lesson.guidedWriting.map(item => `
        <div class="guided-writing-item">
          <strong>${item.label}</strong>
          <p>${item.prompt}</p>
          <small>Example: ${item.example}</small>
        </div>
      `).join("")
      : ""
  }
</div>
    </div>
  `;
}
if (step === "Common Mistakes") {
  stepContent = `
    <div class="lesson-step-card">
      <span class="section-label">Common Mistakes</span>

      <h3>Learn from mistakes</h3>

      <div class="mistakes-list">
        ${
          lesson.commonMistakes
            ? lesson.commonMistakes.map(item => `
              <div class="mistake-card">
                <p><strong>Incorrect:</strong> ${item.wrong}</p>
                <p><strong>Correct:</strong> ${item.correct}</p>
                <small>${item.explanation}</small>
              </div>
            `).join("")
            : "<p>No common mistakes for this lesson yet.</p>"
        }
      </div>
    </div>
  `;
}
if (step === "Summary") {
  stepContent = `
    <div class="lesson-step-card">
      <span class="section-label">Lesson Summary</span>

      <h3>What did you learn?</h3>

      <div class="summary-box">
        ${
          lesson.summary
            ? lesson.summary.map(item => `
              <p>${item}</p>
            `).join("")
            : `
              <p>${lesson.title}</p>
              <p>Key vocabulary</p>
              <p>Grammar structures</p>
              <p>Listening practice</p>
              <p>Reading practice</p>
              <p>Writing practice</p>
            `
        }
      </div>
    </div>
  `;
}
if (step === "Mastery Check") {
  stepContent = `
    <div class="lesson-step-card">

      <span class="section-label">
        Mastery Check
      </span>

      <h3>
        Can you do these things?
      </h3>

      <div class="mastery-list">

        ${
          lesson.masteryCheck
            ? lesson.masteryCheck.map(item => `
              <div class="mastery-item">
                ✓ ${item}
              </div>
            `).join("")
            : ""
        }

      </div>

      <p class="mastery-message">
        If you can confidently complete all of these tasks,
        you are ready for the Unit Quiz.
      </p>

    </div>
  `;
}
  if (step === "Quiz") {
    stepContent = `
      <div class="lesson-step-card">
        <span class="section-label">Quiz</span>
        <h3>${lesson.question}</h3>

        ${lesson.options.map(option => `
          <button class="option" onclick="checkAnswer('${option}', '${lesson.answer}', ${currentLessonIndex})">
            ${option}
          </button>
        `).join("")}

        <p class="result" id="result"></p>
      </div>
    `;
  }

  lessonView.innerHTML = `
    <div class="lesson-player">
      <div class="lesson-player-header">
        <div>
  <span class="tag">${lesson.module}</span>
  <span class="tag">${lesson.unit}</span>

  <h2>
    ${lesson.title}
  </h2>

  <p class="step-label">
    Step ${currentLessonStep + 1}
    of
    ${lessonSteps.length}
  </p>

  <p class="completion-label">
    ${Math.round(
      ((currentLessonStep + 1) /
      lessonSteps.length) * 100
    )}% Complete
  </p>
</div>

        <div class="lesson-step-number">
          ${currentLessonStep + 1}/${lessonSteps.length}
        </div>
      </div>

      <div class="lesson-step-progress">
        <div style="width: ${((currentLessonStep + 1) / lessonSteps.length) * 100}%"></div>
      </div>
      <div class="lesson-step-tabs">
  ${lessonSteps.map((item, index) => `
    <div class="lesson-step-tab ${index <= currentLessonStep ? "active" : ""}">
      ${index + 1}
    </div>
  `).join("")}
</div>

      ${stepContent}

      <div class="lesson-player-actions">
        <button onclick="previousLessonStep()" ${currentLessonStep === 0 ? "disabled" : ""}>
          Back
        </button>

        <button onclick="nextLessonStep()">
          ${currentLessonStep === lessonSteps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  `;
}
function checkLessonListening(option, answer) {
  const result = document.getElementById("lessonListeningResult");
  const options = document.querySelectorAll(".listening-practice-option");

  options.forEach(button => {
    button.disabled = true;

    if (button.textContent.trim() === answer) {
      button.classList.add("correct-option");
    }

    if (button.textContent.trim() === option && option !== answer) {
      button.classList.add("wrong-option");
    }
  });

  if (option === answer) {
    result.textContent = "Correct. Good listening practice.";
    result.style.color = "#16a34a";
  } else {
    result.textContent = "Incorrect. Listen again and review.";
    result.style.color = "#dc2626";
  }
}
function checkLessonReading(option, answer) {
  const result = document.getElementById("lessonReadingResult");
  const options = document.querySelectorAll(".reading-practice-option");

  options.forEach(button => {
    button.disabled = true;

    if (button.textContent.trim() === answer) {
      button.classList.add("correct-option");
    }

    if (button.textContent.trim() === option && option !== answer) {
      button.classList.add("wrong-option");
    }
  });

  if (option === answer) {
    result.textContent = "Correct. Good reading comprehension.";
    result.style.color = "#16a34a";
  } else {
    result.textContent = "Incorrect. Read the text again.";
    result.style.color = "#dc2626";
  }
}
function checkLessonWriting() {
  const lesson = lessons[currentLessonIndex];

  const input = document
    .getElementById("lessonWritingInput")
    .value
    .trim()
    .toLowerCase();

  const result = document.getElementById("lessonWritingResult");
  const correctAnswer = lesson.writingAnswer.toLowerCase();

  if (input === correctAnswer || input.includes(correctAnswer)) {
    result.textContent = "Correct. Good writing practice.";
    result.style.color = "#16a34a";
  } else {
    result.textContent = "Review the sentence and try again.";
    result.style.color = "#dc2626";
  }
}
function nextLessonStep() {
  if (currentLessonStep < lessonSteps.length - 1) {
    currentLessonStep++;
    renderLessonStep();
    return;
  }

  const result = document.getElementById("result");

  if (!result || result.textContent === "") {
    alert("Complete the quiz before finishing this unit.");
    return;
  }

  if (result.textContent.includes("Correct")) {
    showUnitCompleted();
  } else {
    alert("Answer the quiz correctly to finish this unit.");
  }
}

function showUnitCompleted() {
  const lesson = lessons[currentLessonIndex];
  const nextIndex = currentLessonIndex + 1;
  const hasNextLesson = nextIndex < lessons.length;

  const buttonAction = hasNextLesson
    ? `openLesson(${nextIndex})`
    : `showTab('dashboard')`;

  const buttonText = hasNextLesson
    ? "Continue to Next Unit"
    : "Back to Dashboard";

  lessonView.innerHTML = `
    <div class="unit-completed-card">
      <span class="section-label">Unit Completed</span>

      <h2>${lesson.unit}: ${lesson.title}</h2>

      <p>
        Great work. Your progress has been saved and the next unit is ready.
      </p>

      <div class="unit-completed-stats">
        <div>
          <strong>+50</strong>
          <span>XP Earned</span>
        </div>

        <div>
          <strong>${state.completed.length}/${lessons.length}</strong>
          <span>Units Completed</span>
        </div>
      </div>

      <button onclick="${buttonAction}">
        ${buttonText}
      </button>
    </div>
  `;
}

function previousLessonStep() {
  if (currentLessonStep > 0) {
    currentLessonStep--;
    renderLessonStep();
  }
}

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 0.85;
  speechSynthesis.speak(speech);
}
function speakSlow(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 0.6;
  speechSynthesis.speak(speech);
}

function checkAnswer(option, answer, index) {
  const result = document.getElementById("result");
  const options = document.querySelectorAll(".option");

  options.forEach(button => {
    button.disabled = true;

    if (button.textContent.trim() === answer) {
      button.classList.add("correct-option");
    }

    if (button.textContent.trim() === option && option !== answer) {
      button.classList.add("wrong-option");
    }
  });

  if (option === answer) {
    result.textContent = "Correct. Unit completed. +50 XP";
    result.style.color = "#16a34a";

    if (!state.completed.includes(index)) {
      state.completed.push(index);
      state.xp += 50;
      checkLevelMedals();

      if (state.completed.length === 1 && !state.medals.includes("First Lesson")) {
        state.medals.push("First Lesson");
      }

      if (state.xp >= 100 && !state.medals.includes("100 XP")) {
        state.medals.push("100 XP");
      }

      if (state.completed.length === lessons.length && !state.medals.includes("Welcome Graduate")) {
        state.medals.push("Welcome Graduate");
      }

      saveState();
      updateStats();
      renderLessons();
    }
  } else {
    result.textContent = "Incorrect. Review the lesson and try again.";
    result.style.color = "#dc2626";
  }
}
function renderMedals() {
  const medalList = document.getElementById("medalList");

  if (!medalList) return;

  if (state.medals.length === 0) {
    medalList.innerHTML = `
      <div class="empty-medals">
        Todavía no tienes medallas. Completa tu primera lección ⭐
      </div>
    `;
    return;
  }

  medalList.innerHTML =
    state.medals.map(medal => `
  <div class="medal-item">

    <div class="medal-icon">
      🏆
    </div>

    <h3>${medal}</h3>

    <p>
      Achievement unlocked
    </p>

  </div>
`).join("");
}

function openNextLesson() {
  const nextIndex = state.completed.length;

  if (nextIndex < lessons.length) {
    openLesson(nextIndex);
  } else {
    openLesson(lessons.length - 1);
    alert("Ya completaste todas las unidades del A0 ⭐");
  }
}

function resetProgress() {
  const confirmReset = confirm("¿Seguro que quieres reiniciar tu progreso?");

  if (confirmReset) {
    localStorage.removeItem("englishStarState");
    location.reload();
  }
}

/* VOCABULARY BUILDER */

let currentWordIndex = 0;
let currentWord = a0Vocabulary[currentWordIndex];

function renderVocabularyCategories() {
  const container =
    document.getElementById(
      "vocabularyCategories"
    );

  if (!container) return;

  const categories = {};

  a0Vocabulary.forEach(word => {

    if (!categories[word.category]) {
      categories[word.category] = [];
    }

    categories[word.category].push(word);

  });

  container.innerHTML =
    Object.keys(categories)
      .map(category => `

    <div
      class="vocabulary-category-card"
      onclick="filterVocabulary('${category}')">

      <h3>${category}</h3>

      <p>
        ${categories[category].length}
        words
      </p>

    </div>

  `).join("");

}

function filterVocabulary(category) {

  const index =
    a0Vocabulary.findIndex(
      word => word.category === category
    );

  if (index !== -1) {

    currentWordIndex = index;

    renderFlashcard();

  }

}

function renderFlashcard() {
  currentWord = a0Vocabulary[currentWordIndex];

  document.getElementById("flashEnglish").textContent = currentWord.english;
  document.getElementById("flashSpanish").textContent = currentWord.spanish;
  document.getElementById("flashSpanish").classList.add("hidden");
}

function showMeaning() {
  document.getElementById("flashSpanish").classList.remove("hidden");
}

function nextWord() {
  currentWordIndex++;

  if (currentWordIndex >= a0Vocabulary.length) {
    currentWordIndex = 0;
  }

  renderFlashcard();
}
/* LISTENING LAB */

let currentListeningIndex = state.currentListeningIndex || 0;

function renderListening() {
  const item = a0Listening[currentListeningIndex];

  document.getElementById("listeningTitle").textContent = item.title;
  document.getElementById("listeningProgress").textContent =
    `${currentListeningIndex + 1} / ${a0Listening.length}`;
  document.getElementById("listeningText").textContent = item.text;
  document.getElementById("listeningQuestion").textContent = item.question;

  document.getElementById("listeningOptions").innerHTML =
    item.options.map(option => `
      <button class="listening-option" onclick="checkListeningAnswer('${option}')">
        ${option}
      </button>
    `).join("");

  document.getElementById("listeningResult").textContent = "";
}

function playListening() {
  const item = a0Listening[currentListeningIndex];
  speak(item.text);
}
function nextListening() {
  currentListeningIndex++;

  if (currentListeningIndex >= a0Listening.length) {
    currentListeningIndex = 0;
  }

  state.currentListeningIndex = currentListeningIndex;

  saveState();
  renderListening();
}

function checkListeningAnswer(option) {
  const item = a0Listening[currentListeningIndex];
  const result = document.getElementById("listeningResult");

  if (option === item.answer) {
    result.textContent = "Correcto 🎧 +30 XP. Pasando al siguiente...";
    result.style.color = "green";

    state.xp += 30;
    checkLevelMedals();

    if (!state.medals.includes("Listening Beginner")) {
      state.medals.push("Listening Beginner");
    }

    currentListeningIndex++;

    if (currentListeningIndex >= a0Listening.length) {
      currentListeningIndex = 0;
    }

    state.currentListeningIndex = currentListeningIndex;

    saveState();
    updateStats();

    setTimeout(function () {
      renderListening();
    }, 1200);

  } else {
    result.textContent = "Inténtalo otra vez.";
    result.style.color = "red";
  }
}
/* GRAMMAR LAB */

let currentGrammarIndex = state.currentGrammarIndex || 0;

function renderGrammar() {
  const item = a0Grammar[currentGrammarIndex];

  document.getElementById("grammarUnit").textContent = item.unit;
  document.getElementById("grammarTopic").textContent = item.topic;

  document.getElementById("grammarExamples").innerHTML =
    item.examples.map(example => `
      <div class="grammar-example">${example}</div>
    `).join("");
}

function playGrammarExample() {
  const item = a0Grammar[currentGrammarIndex];

  if (item.examples.length > 0) {
    speak(item.examples[0]);
  }
}

function nextGrammar() {
  currentGrammarIndex++;

  if (currentGrammarIndex >= a0Grammar.length) {
    currentGrammarIndex = 0;
  }

  state.currentGrammarIndex = currentGrammarIndex;
  saveState();
  renderGrammar();
}

/* SPEAKING LAB */

function startSpeaking() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Tu navegador no soporta reconocimiento de voz.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  document.getElementById("speechResult").textContent = "🎤 Escuchando...";

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.toLowerCase();

    const target = document
      .getElementById("speakingPhrase")
      .textContent
      .toLowerCase();

    let score = 50;

    const spokenWords = transcript.split(" ");
    const targetWords = target.split(" ");

    spokenWords.forEach(word => {
      if (targetWords.includes(word)) {
        score += 10;
      }
    });

    if (score > 100) {
      score = 100;
    }

    let message = "Good!";

    if (score >= 90) {
      message = "Excellent ⭐";
    } else if (score >= 70) {
      message = "Very Good 🔥";
    }

    document.getElementById("speechResult").innerHTML = `
      <strong>You said:</strong><br>
      ${transcript}
      <br><br>
      ⭐ Score: ${score}/100
      <br>
      ${message}
    `;
  };

  recognition.onerror = function (event) {
    document.getElementById("speechResult").textContent =
      "Error al escuchar: " + event.error;
  };
}

/* CERTIFICATE */

function renderCertificate() {
  const certificateName = document.getElementById("certificateName");
  const certificateDate = document.getElementById("certificateDate");

  if (!certificateName || !certificateDate) return;

  certificateName.textContent = state.studentName;

  const today = new Date().toLocaleDateString();
  certificateDate.textContent = "Date: " + today;
  const certificateId = document.getElementById("certificateId");

if (certificateId) {
  certificateId.textContent =
    "ESA-A0-" + Date.now().toString().slice(-6);
}
}

function downloadCertificate() {
  if (state.completed.length < lessons.length) {
    alert("Primero debes completar todas las unidades del Nivel A0.");
    return;
  }

  renderCertificate();
  window.print();
}

/* ROADMAP */

function updateRoadmap() {
  const roadmapCards = document.querySelectorAll(".roadmap-card");
  const a0Completed = state.completed.length === lessons.length;

  roadmapCards.forEach((card) => {
    const title = card.querySelector("h3");
    const status = card.querySelector("span");

    if (!title || !status) return;

    if (title.textContent.includes("A0")) {
      if (a0Completed) {
        title.textContent = "✅ A0";
        status.textContent = "Completado";
        card.classList.remove("locked");
        card.classList.add("active");
      }
    }

    if (title.textContent.includes("A1")) {
      if (a0Completed) {
        title.textContent = "⭐ A1";
        status.textContent = "Desbloqueado";
        card.classList.remove("locked");
        card.classList.add("active");
      }
    }
  });
}

/* LEVELS AND STREAK */

function checkLevelMedals() {
  const studentLevel = Math.floor(state.xp / 100) + 1;

  if (studentLevel >= 2 && !state.medals.includes("Level 2 Student")) {
    state.medals.push("Level 2 Student");
  }

  if (studentLevel >= 5 && !state.medals.includes("Level 5 Star")) {
    state.medals.push("Level 5 Star");
  }

  if (studentLevel >= 10 && !state.medals.includes("Level 10 Hero")) {
    state.medals.push("Level 10 Hero");
  }
}

function updateDailyStreak() {
  const today = new Date().toDateString();

  if (state.lastLogin !== today) {
    state.streak++;
    state.lastLogin = today;

    if (state.streak >= 7 && !state.medals.includes("7 Day Streak")) {
      state.medals.push("7 Day Streak");
    }

    saveState();
  }
}
/* READING LAB */

let currentReadingIndex = state.currentReadingIndex || 0;

function renderReading() {
  const item = lessons[currentReadingIndex];

  document.getElementById("readingTitle").textContent =
    `${item.unit}: ${item.title}`;

  document.getElementById("readingText").textContent =
    item.reading;

  document.getElementById("readingQuestion").textContent =
    item.question;

  document.getElementById("readingOptions").innerHTML =
    item.options.map(option => `
      <button class="reading-option" onclick="checkReadingAnswer('${option}')">
        ${option}
      </button>
    `).join("");

  document.getElementById("readingResult").textContent = "";
}

function checkReadingAnswer(option) {
  const item = lessons[currentReadingIndex];
  const result = document.getElementById("readingResult");

  if (option === item.answer) {
    result.textContent = "Correcto 📖 +30 XP";
    result.style.color = "green";

    state.xp += 30;
    checkLevelMedals();

    if (!state.medals.includes("Reading Beginner")) {
      state.medals.push("Reading Beginner");
    }

    currentReadingIndex++;

    if (currentReadingIndex >= lessons.length) {
      currentReadingIndex = 0;
    }

    state.currentReadingIndex = currentReadingIndex;

    saveState();
    updateStats();

    setTimeout(() => {
      renderReading();
    }, 1000);

  } else {
    result.textContent = "Inténtalo otra vez.";
    result.style.color = "red";
  }
}
/* WRITING LAB */

let currentWritingIndex = state.currentWritingIndex || 0;

function renderWriting() {
  const item = lessons[currentWritingIndex];

  document.getElementById("writingTitle").textContent =
    `${item.unit}: ${item.title}`;

  document.getElementById("writingPrompt").textContent =
    item.writing;

  document.getElementById("writingInput").value = "";
  document.getElementById("writingResult").textContent = "";
}

function checkWritingAnswer() {
  const item = lessons[currentWritingIndex];
  const input = document
    .getElementById("writingInput")
    .value
    .trim()
    .toLowerCase();

  const correctAnswer = item.writingAnswer.toLowerCase();

  const result = document.getElementById("writingResult");

  if (input === correctAnswer || input.includes(correctAnswer)) {
    result.textContent = "Correcto ✍️ +30 XP";
    result.style.color = "green";

    state.xp += 30;
    checkLevelMedals();

    if (!state.medals.includes("Writing Beginner")) {
      state.medals.push("Writing Beginner");
    }

    currentWritingIndex++;

    if (currentWritingIndex >= lessons.length) {
      currentWritingIndex = 0;
    }

    state.currentWritingIndex = currentWritingIndex;

    saveState();
    updateStats();

    setTimeout(() => {
      renderWriting();
    }, 1000);

  } else {
    result.textContent = "Inténtalo otra vez.";
    result.style.color = "red";
  }
}

const a0MidtermExam = [
  {
    skill: "Vocabulary",
    type: "choice",
    question: "What does 'Good morning' mean?",
    options: ["Buenas noches", "Buenos días", "Adiós"],
    answer: "Buenos días"
  },
  {
    skill: "Grammar",
    type: "choice",
    question: "Complete: My name ___ Dany.",
    options: ["am", "is", "are"],
    answer: "is"
  },
  {
    skill: "Numbers",
    type: "choice",
    question: "What number is 'Twenty'?",
    options: ["10", "12", "20"],
    answer: "20"
  },
  {
    skill: "Countries",
    type: "choice",
    question: "Translate: I am from Peru.",
    options: ["Soy de Perú", "Vivo en Perú", "Me gusta Perú"],
    answer: "Soy de Perú"
  },
  {
    skill: "Family",
    type: "choice",
    question: "What does 'Father' mean?",
    options: ["Madre", "Padre", "Hermano"],
    answer: "Padre"
  },
  {
    skill: "Colors",
    type: "choice",
    question: "What does 'Blue' mean?",
    options: ["Azul", "Rojo", "Verde"],
    answer: "Azul"
  },
  {
    skill: "Objects",
    type: "input",
    question: "Complete: This is my _____.",
    answer: "book"
  }
];
let midtermScore = 0;
let midtermAnswered = [];

function renderMidtermExam() {
  const container = document.getElementById("midtermContainer");

  if (!container) return;

  container.innerHTML = a0MidtermExam.map((question, index) => `
    <div class="exam-card">
      <span class="section-label">${question.skill}</span>

      <h3>Question ${index + 1}</h3>

      <p>${question.question}</p>

      ${question.type === "choice"
      ? question.options.map(option => `
            <button
              class="exam-option"
              onclick="checkMidtermAnswer(${index}, '${option}')">
              ${option}
            </button>
          `).join("")
      : `
            <input
              type="text"
              id="midtermInput${index}"
              placeholder="Write your answer here"
            >

            <button
              class="exam-btn"
              onclick="checkMidtermInput(${index})">
              Check
            </button>
          `
    }

      <p class="result" id="midtermResult${index}"></p>
    </div>
  `).join("");
}

function finishMidterm() {

  const result =
    document.getElementById(
      "midtermFinalResult"
    );

  const total =
    a0MidtermExam.length;

  const percentage =
    Math.round(
      (midtermScore / total) * 100
    );

  if (percentage >= 70) {

    state.xp += 100;

    saveState();

    updateStats();

    result.textContent =
      `PASSED - ${midtermScore}/${total} (${percentage}%) | +100 XP`;

    result.style.color = "green";

  } else {

    result.textContent =
      `TRY AGAIN - ${midtermScore}/${total} (${percentage}%)`;

    result.style.color = "red";

  }

}

function checkMidtermAnswer(index, option) {
  const question = a0MidtermExam[index];
  const result = document.getElementById(`midtermResult${index}`);

  if (!midtermAnswered[index]) {

    if (option === question.answer) {

      midtermScore++;

      result.textContent = "Correct";
      result.style.color = "green";

    } else {

      result.textContent =
        "Incorrect. Answer: " +
        question.answer;

      result.style.color = "red";

    }

    midtermAnswered[index] = true;

  }
}

function checkMidtermInput(index) {
  const question = a0MidtermExam[index];
  const input = document
    .getElementById(`midtermInput${index}`)
    .value
    .trim()
    .toLowerCase();

  const result = document.getElementById(`midtermResult${index}`);

  if (!midtermAnswered[index]) {

    if (
      input ===
      question.answer.toLowerCase()
    ) {

      midtermScore++;

      result.textContent = "Correct";
      result.style.color = "green";

    } else {

      result.textContent =
        "Incorrect. Answer: " +
        question.answer;

      result.style.color = "red";

    }

    midtermAnswered[index] = true;

  }
}
function finishMidterm() {
  const result = document.getElementById("midtermFinalResult");
  const total = a0MidtermExam.length;

  const percentage = Math.round((midtermScore / total) * 100);

  if (percentage >= 70) {
    result.textContent = `PASSED - ${midtermScore}/${total} (${percentage}%)`;
    result.style.color = "green";
  } else {
    result.textContent = `TRY AGAIN - ${midtermScore}/${total} (${percentage}%)`;
    result.style.color = "red";
  }
}
/* FINAL EXAM A0 */

const a0FinalExam = [
  {
    skill: "Vocabulary",
    type: "choice",
    question: "What does 'Hello' mean?",
    options: ["Gracias", "Hola", "Adiós"],
    answer: "Hola"
  },
  {
    skill: "Vocabulary",
    type: "choice",
    question: "What does 'Mother' mean?",
    options: ["Madre", "Padre", "Hermana"],
    answer: "Madre"
  },
  {
    skill: "Vocabulary",
    type: "choice",
    question: "What does 'Book' mean?",
    options: ["Libro", "Mesa", "Teléfono"],
    answer: "Libro"
  },
  {
    skill: "Grammar",
    type: "choice",
    question: "Complete: My name ___ Dany.",
    options: ["am", "is", "are"],
    answer: "is"
  },
  {
    skill: "Grammar",
    type: "choice",
    question: "Complete: I ___ from Peru.",
    options: ["am", "is", "are"],
    answer: "am"
  },
  {
    skill: "Grammar",
    type: "choice",
    question: "Choose the correct sentence.",
    options: [
      "I am a student.",
      "I is a student.",
      "I are a student."
    ],
    answer: "I am a student."
  },
  {
    skill: "Reading",
    type: "choice",
    question: "Read: My name is Anna. I am from Canada. Where is Anna from?",
    options: ["Peru", "Canada", "France"],
    answer: "Canada"
  },
  {
    skill: "Reading",
    type: "choice",
    question: "Read: I drink water. I eat rice and chicken. What does the person drink?",
    options: ["Water", "Coffee", "Juice"],
    answer: "Water"
  },
  {
    skill: "Listening",
    type: "choice",
    question: "Listen: Hello. My name is Tom. What is his name?",
    options: ["Tom", "Anna", "John"],
    answer: "Tom",
    audioText: "Hello. My name is Tom."
  },
  {
    skill: "Listening",
    type: "choice",
    question: "Listen: I am from Peru. I am Peruvian. Where is the person from?",
    options: ["Peru", "France", "Canada"],
    answer: "Peru",
    audioText: "I am from Peru. I am Peruvian."
  },
  {
    skill: "Writing",
    type: "input",
    question: "Complete: I am from _____.",
    answer: "Peru"
  },
  {
    skill: "Writing",
    type: "input",
    question: "Complete: My favorite color is _____.",
    answer: "blue"
  },
  {
    skill: "Speaking",
    type: "choice",
    question: "Choose the best phrase to introduce yourself.",
    options: [
      "My name is Dany.",
      "Goodbye.",
      "I eat rice."
    ],
    answer: "My name is Dany."
  },
  {
    skill: "Speaking",
    type: "choice",
    question: "Choose the best response: Nice to meet you.",
    options: [
      "Nice to meet you too.",
      "I am water.",
      "Blue."
    ],
    answer: "Nice to meet you too."
  }
];

let currentExamIndex = state.currentExamIndex || 0;
let examScore = state.examScore || 0;

function renderExam() {
  const item = a0FinalExam[currentExamIndex];

  document.getElementById("examSkill").textContent = item.skill;
  document.getElementById("examQuestion").textContent = item.question;
  document.getElementById("examResult").textContent = "";

  const examOptions = document.getElementById("examOptions");
  const examInput = document.getElementById("examInput");
  const examCheckBtn = document.getElementById("examCheckBtn");

  if (item.type === "choice") {
    examInput.classList.add("hidden");
    examCheckBtn.classList.add("hidden");

    examOptions.innerHTML = item.options.map(option => `
      <button class="exam-option" onclick="checkExamChoice('${option}')">
        ${option}
      </button>
    `).join("");

  } else {
    examOptions.innerHTML = "";
    examInput.classList.remove("hidden");
    examCheckBtn.classList.remove("hidden");
    examInput.value = "";
  }

  if (item.audioText) {
    speak(item.audioText);
  }

  updateExamScoreBox();
}

function checkExamChoice(option) {
  const item = a0FinalExam[currentExamIndex];
  const result = document.getElementById("examResult");

  if (option === item.answer) {
    result.textContent = "Correcto ✅";
    result.style.color = "green";
    examScore++;
  } else {
    result.textContent = `Incorrecto ❌ Respuesta: ${item.answer}`;
    result.style.color = "red";
  }

  state.examScore = examScore;
  saveState();
  updateExamScoreBox();
}

function checkExamInput() {
  const item = a0FinalExam[currentExamIndex];
  const input = document
    .getElementById("examInput")
    .value
    .trim()
    .toLowerCase();

  const result = document.getElementById("examResult");

  if (input === item.answer.toLowerCase()) {
    result.textContent = "Correcto ✅";
    result.style.color = "green";
    examScore++;
  } else {
    result.textContent = `Incorrecto ❌ Respuesta: ${item.answer}`;
    result.style.color = "red";
  }

  state.examScore = examScore;
  saveState();
  updateExamScoreBox();
}

function nextExamQuestion() {
  currentExamIndex++;

  if (currentExamIndex >= a0FinalExam.length) {
    finishExam();
    return;
  }

  state.currentExamIndex = currentExamIndex;
  saveState();
  renderExam();
}

function finishExam() {
  const percentage = Math.round((examScore / a0FinalExam.length) * 100);

  if (percentage >= 70) {
    document.getElementById("examResult").innerHTML =
      `🏆 A0 Passed! Score: ${percentage}%`;

    if (!state.medals.includes("A0 Passed")) {
      state.medals.push("A0 Passed");
    }

    state.xp += 200;
    checkLevelMedals();
    saveState();
    updateStats();

  } else {
    document.getElementById("examResult").innerHTML =
      `❌ Try again. Score: ${percentage}%`;
  }

  currentExamIndex = 0;
  examScore = 0;
  state.currentExamIndex = 0;
  state.examScore = 0;
  saveState();
}

function updateExamScoreBox() {
  document.getElementById("examScoreBox").textContent =
    `Score: ${examScore} / ${a0FinalExam.length}`;
}
/* START APP */

updateDailyStreak();
updateStats();
renderLessons();

renderVocabularyCategories();
renderFlashcard();

renderCertificate();
showApp();
function showTab(sectionId, buttonElement = null) {
  const sections = document.querySelectorAll(".tab-section");

  sections.forEach(section => {
    section.classList.remove("active");
  });

  const selectedSection = document.getElementById(sectionId);

  if (selectedSection) {
    selectedSection.classList.add("active");
  }

  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(item => {
    item.classList.remove("active");
  });

  if (buttonElement) {
    buttonElement.classList.add("active");
  }
  const bottomItems = document.querySelectorAll(".bottom-item");

  bottomItems.forEach(item => {
    item.classList.remove("active");
  });

  if (buttonElement && buttonElement.classList.contains("bottom-item")) {
    buttonElement.classList.add("active");
  }
}
function toggleMobileMenu() {
  const menu = document.querySelector(".sidebar-menu");
  const moreBtn = document.querySelector(".more-btn");
  const buttons = menu.querySelectorAll("button");

  menu.classList.toggle("expanded");

  const expanded = menu.classList.contains("expanded");

  buttons.forEach((button, index) => {
    if (index >= 5 && !button.classList.contains("more-btn")) {
      button.style.setProperty(
        "display",
        expanded ? "block" : "none",
        "important"
      );
    }
  });

  moreBtn.textContent = expanded ? "More ▲" : "More ▼";
}
function closeWelcome() {
  const welcomeOverlay = document.getElementById("welcomeOverlay");

  if (welcomeOverlay) {
    welcomeOverlay.classList.add("hide");
    localStorage.setItem("welcomeSeen", "true");
  }
}
window.addEventListener("DOMContentLoaded", function () {
  const welcomeOverlay = document.getElementById("welcomeOverlay");
  const welcomeSeen = localStorage.getItem("welcomeSeen");

  if (welcomeOverlay && welcomeSeen === "true") {
    welcomeOverlay.classList.add("hide");
  }
});
const platformPassword = "DYBROX2026";

function checkAccessPassword() {
  const input = document.getElementById("accessPassword");
  const message = document.getElementById("accessMessage");
  const accessScreen = document.getElementById("accessScreen");

  if (!input || !message || !accessScreen) return;

  if (input.value.trim() === platformPassword) {
    localStorage.setItem("platformAccess", "granted");
    accessScreen.classList.add("hide");
  } else {
    message.textContent = "Access denied. Please check your password.";
    message.style.color = "#dc2626";
  }
}

window.addEventListener("DOMContentLoaded", function () {
  const accessScreen = document.getElementById("accessScreen");
  const accessGranted = localStorage.getItem("platformAccess");

  if (accessScreen && accessGranted === "granted") {
    accessScreen.classList.add("hide");
  }
});
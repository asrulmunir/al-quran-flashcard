// Al-Quran Flashcard App
class QuranFlashcardApp {
    constructor() {
        this.apiBaseUrl = 'https://quran-api.asrulmunir.workers.dev';
        this.chapters = [];
        this.translations = [];
        this.currentSession = {
            verses: [],
            currentIndex: 0,
            studyMode: 'arabic-to-translation',
            selectedTranslation: '',
            stats: {
                correct: 0,
                difficult: 0,
                incorrect: 0
            },
            reviewCards: []
        };
        
        this.init();
    }

    async init() {
        await this.loadChapters();
        await this.loadTranslations();
        this.setupEventListeners();
        this.hideLoading();
    }

    async loadChapters() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/chapters?_=${Date.now()}`);
            this.chapters = await response.json();
            this.populateChapterSelect();
        } catch (error) {
            console.error('Error loading chapters:', error);
            this.showError('Gagal memuatkan bab-bab. Sila periksa sambungan internet anda.');
        }
    }

    async loadTranslations() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/translations?_=${Date.now()}`);
            this.translations = await response.json();
            this.populateTranslationSelect();
        } catch (error) {
            console.error('Error loading translations:', error);
            this.showError('Gagal memuatkan terjemahan. Sila periksa sambungan internet anda.');
        }
    }

    populateChapterSelect() {
        const select = document.getElementById('chapterSelect');
        select.innerHTML = '<option value="">Pilih surah...</option>';
        
        this.chapters.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter.number;
            option.textContent = `${chapter.number}. ${chapter.name} (${chapter.verseCount} ayat)`;
            select.appendChild(option);
        });
    }

    populateTranslationSelect() {
        const select = document.getElementById('translationSelect');
        select.innerHTML = '<option value="">Pilih terjemahan...</option>';
        
        this.translations.forEach(translation => {
            const option = document.createElement('option');
            option.value = translation.key;
            option.textContent = `${translation.language_name} - ${translation.name}`;
            select.appendChild(option);
        });

        // Set default to Malay translation if available, otherwise English
        const malayTranslation = this.translations.find(t => t.language === 'ms');
        const englishTranslation = this.translations.find(t => t.language === 'en');
        if (malayTranslation) {
            select.value = malayTranslation.key;
        } else if (englishTranslation) {
            select.value = englishTranslation.key;
        }
    }

    setupEventListeners() {
        // Setup form listeners
        document.getElementById('chapterSelect').addEventListener('change', this.updateVerseRange.bind(this));
        document.getElementById('startStudyBtn').addEventListener('click', this.startStudySession.bind(this));
        
        // Flashcard listeners
        document.getElementById('revealBtn').addEventListener('click', this.revealAnswer.bind(this));
        document.getElementById('correctBtn').addEventListener('click', () => this.recordAnswer('correct'));
        document.getElementById('difficultBtn').addEventListener('click', () => this.recordAnswer('difficult'));
        document.getElementById('incorrectBtn').addEventListener('click', () => this.recordAnswer('incorrect'));
        
        // Navigation listeners
        document.getElementById('prevBtn').addEventListener('click', this.previousCard.bind(this));
        document.getElementById('nextBtn').addEventListener('click', this.nextCard.bind(this));
        document.getElementById('resetBtn').addEventListener('click', this.resetSession.bind(this));
        document.getElementById('backToSetupBtn').addEventListener('click', this.backToSetup.bind(this));
        
        // Results listeners
        document.getElementById('reviewDifficultBtn').addEventListener('click', this.reviewDifficultCards.bind(this));
        document.getElementById('newSessionBtn').addEventListener('click', this.startNewSession.bind(this));

        // Keyboard guide toggle
        document.getElementById('guideToggle').addEventListener('click', this.toggleKeyboardGuide.bind(this));

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    updateVerseRange() {
        const chapterSelect = document.getElementById('chapterSelect');
        const endVerseInput = document.getElementById('endVerse');
        
        if (chapterSelect.value) {
            const selectedChapter = this.chapters.find(c => c.number == chapterSelect.value);
            if (selectedChapter) {
                endVerseInput.max = selectedChapter.verseCount;
                endVerseInput.value = Math.min(5, selectedChapter.verseCount);
            }
        }
    }

    async startStudySession() {
        const chapterNum = document.getElementById('chapterSelect').value;
        const translationKey = document.getElementById('translationSelect').value;
        const startVerse = parseInt(document.getElementById('startVerse').value);
        const endVerse = parseInt(document.getElementById('endVerse').value);
        const studyMode = document.getElementById('studyMode').value;

        if (!chapterNum || !translationKey || !startVerse || !endVerse) {
            this.showError('Sila lengkapkan semua medan sebelum memulakan.');
            return;
        }

        if (startVerse > endVerse) {
            this.showError('Ayat mula mestilah kurang daripada atau sama dengan ayat akhir.');
            return;
        }

        this.showLoading('Memuatkan ayat-ayat...');

        try {
            await this.loadVerses(chapterNum, translationKey, startVerse, endVerse, studyMode);
            this.showFlashcardContainer();
            this.displayCurrentCard();
        } catch (error) {
            console.error('Error starting study session:', error);
            this.showError('Gagal memuatkan ayat-ayat. Sila cuba lagi.');
        }

        this.hideLoading();
    }

    // Helper function to decode HTML entities
    decodeHtmlEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    async loadVerses(chapterNum, translationKey, startVerse, endVerse, studyMode) {
        const verses = [];
        const selectedChapter = this.chapters.find(c => c.number == chapterNum);
        
        for (let verseNum = startVerse; verseNum <= endVerse; verseNum++) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/api/compare/${chapterNum}/${verseNum}?_=${Date.now()}`);
                const verseData = await response.json();
                
                if (verseData.arabic && verseData.translations[translationKey]) {
                    verses.push({
                        chapterNumber: chapterNum,
                        chapterName: selectedChapter.name,
                        verseNumber: verseNum,
                        arabic: verseData.arabic.text,
                        translation: this.decodeHtmlEntities(verseData.translations[translationKey].text),
                        answered: false,
                        result: null
                    });
                }
            } catch (error) {
                console.error(`Error loading verse ${chapterNum}:${verseNum}:`, error);
            }
        }

        this.currentSession = {
            verses: verses,
            currentIndex: 0,
            studyMode: studyMode,
            selectedTranslation: translationKey,
            stats: { correct: 0, difficult: 0, incorrect: 0 },
            reviewCards: []
        };
    }

    showFlashcardContainer() {
        document.getElementById('setupPanel').style.display = 'none';
        document.getElementById('flashcardContainer').style.display = 'block';
        document.getElementById('resultsPanel').style.display = 'none';
    }

    displayCurrentCard() {
        const verse = this.currentSession.verses[this.currentSession.currentIndex];
        if (!verse) return;

        const flashcard = document.getElementById('flashcard');
        flashcard.classList.remove('flipped');

        // Update progress
        this.updateProgress();

        // Determine question and answer based on study mode
        let questionText, answerArabic, answerTranslation, cardType;
        
        if (this.currentSession.studyMode === 'arabic-to-translation') {
            questionText = verse.arabic;
            answerArabic = verse.arabic;
            answerTranslation = verse.translation;
            cardType = 'Arab → Terjemahan';
        } else if (this.currentSession.studyMode === 'translation-to-arabic') {
            questionText = verse.translation;
            answerArabic = verse.arabic;
            answerTranslation = verse.translation;
            cardType = 'Terjemahan → Arab';
        } else { // mixed mode
            const isArabicFirst = Math.random() > 0.5;
            if (isArabicFirst) {
                questionText = verse.arabic;
                cardType = 'Arab → Terjemahan';
            } else {
                questionText = verse.translation;
                cardType = 'Terjemahan → Arab';
            }
            answerArabic = verse.arabic;
            answerTranslation = verse.translation;
        }

        // Update front of card
        document.getElementById('verseLocation').textContent = `${verse.chapterName} ${verse.chapterNumber}:${verse.verseNumber}`;
        document.getElementById('cardType').textContent = cardType;
        const questionElement = document.getElementById('questionText');
        questionElement.textContent = this.decodeHtmlEntities(questionText);
        
        // Apply Arabic font class if question is in Arabic
        if (this.currentSession.studyMode === 'arabic-to-translation' || 
            (this.currentSession.studyMode === 'mixed' && questionText === verse.arabic)) {
            questionElement.classList.add('arabic');
        } else {
            questionElement.classList.remove('arabic');
        }

        // Update back of card
        document.getElementById('verseLocationBack').textContent = `${verse.chapterName} ${verse.chapterNumber}:${verse.verseNumber}`;
        document.getElementById('cardTypeBack').textContent = cardType;
        document.getElementById('arabicAnswer').textContent = answerArabic;
        document.getElementById('translationAnswer').textContent = this.decodeHtmlEntities(answerTranslation);

        // Update navigation buttons
        document.getElementById('prevBtn').disabled = this.currentSession.currentIndex === 0;
        document.getElementById('nextBtn').disabled = this.currentSession.currentIndex === this.currentSession.verses.length - 1;

        // Adjust flashcard container height after content is loaded
        setTimeout(() => {
            this.adjustFlashcardHeight();
        }, 100);
    }

    adjustFlashcardHeight() {
        const flashcard = document.getElementById('flashcard');
        const flashcardInner = flashcard.querySelector('.flashcard-inner');
        const frontCard = flashcard.querySelector('.flashcard-front');
        const backCard = flashcard.querySelector('.flashcard-back');
        
        // Get the height of both cards
        const frontHeight = frontCard.scrollHeight;
        const backHeight = backCard.scrollHeight;
        
        // Set the container height to the maximum of both cards
        const maxHeight = Math.max(frontHeight, backHeight);
        flashcard.style.minHeight = `${maxHeight}px`;
        flashcardInner.style.minHeight = `${maxHeight}px`;
    }

    updateProgress() {
        const current = this.currentSession.currentIndex + 1;
        const total = this.currentSession.verses.length;
        const percentage = (current / total) * 100;

        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('progressText').textContent = `${current} / ${total}`;
    }

    revealAnswer() {
        document.getElementById('flashcard').classList.add('flipped');
    }

    recordAnswer(result) {
        const verse = this.currentSession.verses[this.currentSession.currentIndex];
        verse.answered = true;
        verse.result = result;

        this.currentSession.stats[result]++;

        if (result === 'difficult' || result === 'incorrect') {
            if (!this.currentSession.reviewCards.includes(this.currentSession.currentIndex)) {
                this.currentSession.reviewCards.push(this.currentSession.currentIndex);
            }
        }

        // Auto-advance to next card
        setTimeout(() => {
            if (this.currentSession.currentIndex < this.currentSession.verses.length - 1) {
                this.nextCard();
            } else {
                this.showResults();
            }
        }, 500);
    }

    nextCard() {
        if (this.currentSession.currentIndex < this.currentSession.verses.length - 1) {
            this.currentSession.currentIndex++;
            this.displayCurrentCard();
        }
    }

    previousCard() {
        if (this.currentSession.currentIndex > 0) {
            this.currentSession.currentIndex--;
            this.displayCurrentCard();
        }
    }

    resetSession() {
        // Reset all answers and stats
        this.currentSession.verses.forEach(verse => {
            verse.answered = false;
            verse.result = null;
        });
        
        this.currentSession.currentIndex = 0;
        this.currentSession.stats = { correct: 0, difficult: 0, incorrect: 0 };
        this.currentSession.reviewCards = [];
        
        this.displayCurrentCard();
    }

    showResults() {
        document.getElementById('flashcardContainer').style.display = 'none';
        document.getElementById('resultsPanel').style.display = 'block';

        // Update stats
        document.getElementById('correctCount').textContent = this.currentSession.stats.correct;
        document.getElementById('difficultCount').textContent = this.currentSession.stats.difficult;
        document.getElementById('incorrectCount').textContent = this.currentSession.stats.incorrect;

        // Show/hide review button based on whether there are difficult cards
        const reviewBtn = document.getElementById('reviewDifficultBtn');
        reviewBtn.style.display = this.currentSession.reviewCards.length > 0 ? 'inline-block' : 'none';
    }

    reviewDifficultCards() {
        // Create a new session with only difficult cards
        const difficultVerses = this.currentSession.reviewCards.map(index => {
            const verse = { ...this.currentSession.verses[index] };
            verse.answered = false;
            verse.result = null;
            return verse;
        });

        this.currentSession.verses = difficultVerses;
        this.currentSession.currentIndex = 0;
        this.currentSession.stats = { correct: 0, difficult: 0, incorrect: 0 };
        this.currentSession.reviewCards = [];

        this.showFlashcardContainer();
        this.displayCurrentCard();
    }

    backToSetup() {
        // Confirm if user wants to leave current session
        if (this.currentSession.verses.length > 0) {
            const hasAnsweredCards = this.currentSession.verses.some(verse => verse.answered);
            if (hasAnsweredCards) {
                const confirmLeave = confirm('Adakah anda pasti mahu kembali ke tetapan? Kemajuan semasa anda akan hilang.');
                if (!confirmLeave) {
                    return;
                }
            }
        }
        
        // Reset session data
        this.currentSession = {
            verses: [],
            currentIndex: 0,
            studyMode: 'arabic-to-translation',
            selectedTranslation: '',
            stats: { correct: 0, difficult: 0, incorrect: 0 },
            reviewCards: []
        };
        
        // Show setup panel
        this.startNewSession();
    }

    startNewSession() {
        document.getElementById('setupPanel').style.display = 'block';
        document.getElementById('flashcardContainer').style.display = 'none';
        document.getElementById('resultsPanel').style.display = 'none';
    }

    toggleKeyboardGuide() {
        const guide = document.querySelector('.keyboard-guide');
        guide.classList.toggle('expanded');
    }

    handleKeyPress(event) {
        if (document.getElementById('flashcardContainer').style.display === 'block') {
            switch (event.key) {
                case ' ':
                case 'Enter':
                    event.preventDefault();
                    if (!document.getElementById('flashcard').classList.contains('flipped')) {
                        this.revealAnswer();
                    }
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.previousCard();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.nextCard();
                    break;
                case '1':
                    if (document.getElementById('flashcard').classList.contains('flipped')) {
                        this.recordAnswer('correct');
                    }
                    break;
                case '2':
                    if (document.getElementById('flashcard').classList.contains('flipped')) {
                        this.recordAnswer('difficult');
                    }
                    break;
                case '3':
                    if (document.getElementById('flashcard').classList.contains('flipped')) {
                        this.recordAnswer('incorrect');
                    }
                    break;
            }
        }
    }

    showLoading(message = 'Memuatkan...') {
        const overlay = document.getElementById('loadingOverlay');
        overlay.querySelector('p').textContent = message;
        overlay.style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    showError(message) {
        alert(message); // In a production app, you'd want a better error display
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuranFlashcardApp();
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

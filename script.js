(function () {
    'use strict';

    const SUGGEST_TEMPLATE = 'https://quran.ksu.edu.sa/tafseer/saadi/sura{S}-aya{A}.html#saadi';

    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    let currentSurahNum = null;
    const suraInput = document.getElementById('suraInput');
    const suraSuggest = document.getElementById('suraSuggest');
    const ayaInput = document.getElementById('ayaInput');
    const results = document.getElementById('results');
    const surahLinksContainerId = 'surahLinks';

    function clearResults() { if (results) results.innerHTML = ''; }

    // ---- Surah list (names only). Verses not loaded locally for most surahs. ----
    const SURAHS = [
        { num: 1, name: 'الفاتحة', verses: [] },
        { num: 2, name: 'البقرة', verses: [] },
        { num: 3, name: 'آل عمران', verses: [] },
        { num: 4, name: 'النساء', verses: [] },
        { num: 5, name: 'المائدة', verses: [] },
        { num: 6, name: 'الأنعام', verses: [] },
        { num: 7, name: 'الأعراف', verses: [] },
        { num: 8, name: 'الأنفال', verses: [] },
        { num: 9, name: 'التوبة', verses: [] },
        { num: 10, name: 'يونس', verses: [] },
        { num: 11, name: 'هود', verses: [] },
        { num: 12, name: 'يوسف', verses: [] },
        { num: 13, name: 'الرعد', verses: [] },
        { num: 14, name: 'إبراهيم', verses: [] },
        { num: 15, name: 'الحجر', verses: [] },
        { num: 16, name: 'النحل', verses: [] },
        { num: 17, name: 'الإسراء', verses: [] },
        { num: 18, name: 'الكهف', verses: [] },
        { num: 19, name: 'مريم', verses: [] },
        { num: 20, name: 'طه', verses: [] },
        { num: 21, name: 'الأنبياء', verses: [] },
        { num: 22, name: 'الحج', verses: [] },
        { num: 23, name: 'المؤمنون', verses: [] },
        { num: 24, name: 'النور', verses: [] },
        { num: 25, name: 'الفرقان', verses: [] },
        { num: 26, name: 'الشعراء', verses: [] },
        { num: 27, name: 'النمل', verses: [] },
        { num: 28, name: 'القصص', verses: [] },
        { num: 29, name: 'العنكبوت', verses: [] },
        { num: 30, name: 'الروم', verses: [] },
        { num: 31, name: 'لقمان', verses: [] },
        { num: 32, name: 'السجدة', verses: [] },
        { num: 33, name: 'الأحزاب', verses: [] },
        { num: 34, name: 'سبأ', verses: [] },
        { num: 35, name: 'فاطر', verses: [] },
        { num: 36, name: 'يس', verses: [] },
        { num: 37, name: 'الصافات', verses: [] },
        { num: 38, name: 'ص', verses: [] },
        { num: 39, name: 'الزمر', verses: [] },
        { num: 40, name: 'غافر', verses: [] },
        { num: 41, name: 'فصلت', verses: [] },
        { num: 42, name: 'الشورى', verses: [] },
        { num: 43, name: 'الزخرف', verses: [] },
        { num: 44, name: 'الدخان', verses: [] },
        { num: 45, name: 'الجاثية', verses: [] },
        { num: 46, name: 'الأحقاف', verses: [] },
        { num: 47, name: 'محمد', verses: [] },
        { num: 48, name: 'الفتح', verses: [] },
        { num: 49, name: 'الحجرات', verses: [] },
        { num: 50, name: 'ق', verses: [] },
        { num: 51, name: 'الذاريات', verses: [] },
        { num: 52, name: 'الطور', verses: [] },
        { num: 53, name: 'النجم', verses: [] },
        { num: 54, name: 'القمر', verses: [] },
        { num: 55, name: 'الرحمن', verses: [] },
        { num: 56, name: 'الواقعة', verses: [] },
        { num: 57, name: 'الحديد', verses: [] },
        { num: 58, name: 'المجادلة', verses: [] },
        { num: 59, name: 'الحشر', verses: [] },
        { num: 60, name: 'الممتحنة', verses: [] },
        { num: 61, name: 'الصف', verses: [] },
        { num: 62, name: 'الجمعة', verses: [] },
        { num: 63, name: 'المنافقون', verses: [] },
        { num: 64, name: 'التغابن', verses: [] },
        { num: 65, name: 'الطلاق', verses: [] },
        { num: 66, name: 'التحريم', verses: [] },
        { num: 67, name: 'الملك', verses: [] },
        { num: 68, name: 'القلم', verses: [] },
        { num: 69, name: 'الحاقة', verses: [] },
        { num: 70, name: 'المعارج', verses: [] },
        { num: 71, name: 'نوح', verses: [] },
        { num: 72, name: 'الجن', verses: [] },
        { num: 73, name: 'المزمل', verses: [] },
        { num: 74, name: 'المدثر', verses: [] },
        { num: 75, name: 'القيامة', verses: [] },
        { num: 76, name: 'الإنسان', verses: [] },
        { num: 77, name: 'المرسلات', verses: [] },
        { num: 78, name: 'النبأ', verses: [] },
        { num: 79, name: 'النازعات', verses: [] },
        { num: 80, name: 'عبس', verses: [] },
        { num: 81, name: 'التكوير', verses: [] },
        { num: 82, name: 'الانفطار', verses: [] },
        { num: 83, name: 'المطففين', verses: [] },
        { num: 84, name: 'الانشقاق', verses: [] },
        { num: 85, name: 'البروج', verses: [] },
        { num: 86, name: 'الطارق', verses: [] },
        { num: 87, name: 'الأعلى', verses: [] },
        { num: 88, name: 'الغاشية', verses: [] },
        { num: 89, name: 'الفجر', verses: [] },
        { num: 90, name: 'البلد', verses: [] },
        { num: 91, name: 'الشمس', verses: [] },
        { num: 92, name: 'الليل', verses: [] },
        { num: 93, name: 'الضحى', verses: [] },
        { num: 94, name: 'الشرح', verses: [] },
        { num: 95, name: 'التين', verses: [] },
        { num: 96, name: 'العلق', verses: [] },
        { num: 97, name: 'القدر', verses: [] },
        { num: 98, name: 'البينة', verses: [] },
        { num: 99, name: 'الزلزلة', verses: [] },
        { num: 100, name: 'العاديات', verses: [] },
        { num: 101, name: 'القارعة', verses: [] },
        { num: 102, name: 'التكاثر', verses: [] },
        { num: 103, name: 'العصر', verses: [] },
        { num: 104, name: 'الهمزة', verses: [] },
        { num: 105, name: 'الفيل', verses: [] },
        { num: 106, name: 'قريش', verses: [] },
        { num: 107, name: 'الماعون', verses: [] },
        { num: 108, name: 'الكوثر', verses: [] },
        { num: 109, name: 'الكافرون', verses: [] },
        { num: 110, name: 'النصر', verses: [] },
        { num: 111, name: 'المسد', verses: [] },
        { num: 112, name: 'الإخلاص', verses: [] },
        { num: 113, name: 'الفلق', verses: [] },
        { num: 114, name: 'الناس', verses: [] }
    ];

    // (select removed) currentSurahNum will hold the clicked surah number

    // render list of surah names in the main text area (RTL)
    function renderSurahList() {
        if (!results) return;
        results.innerHTML = '';
        const list = document.createElement('div');
        list.className = 'surah-list';
        SURAHS.forEach(s => {
            const item = document.createElement('div');
            item.className = 'surah-name';
            item.dataset.num = String(s.num);
            item.textContent = `${s.name}`;
            item.addEventListener('click', () => {
                // set current surah (user clicked a surah)
                currentSurahNum = item.dataset.num;
                console.debug('surah list clicked, set currentSurahNum=', currentSurahNum);
                // visual feedback
                document.querySelectorAll('.surah-name.selected').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
            });
            list.appendChild(item);
        });
        results.appendChild(list);
    }

    // --- Suggestions for suraInput ---
    function clearSuraSuggestions() {
        if (!suraSuggest) return;
        suraSuggest.innerHTML = '';
        suraSuggest.setAttribute('aria-hidden', 'true');
    }

    function showSuraSuggestions(q) {
        if (!suraSuggest) return;
        const v = (q || '').trim();
        if (!v) { clearSuraSuggestions(); return; }
        const matched = SURAHS.filter(s => s.name.indexOf(v) !== -1 || String(s.num) === v).slice(0, 12);
        suraSuggest.innerHTML = '';
        matched.forEach(s => {
            const el = document.createElement('div');
            el.className = 'sura-suggestion-item';
            el.dataset.num = String(s.num);
            el.textContent = `${s.name}`;
            el.addEventListener('click', (ev) => {
                ev.preventDefault();
                currentSurahNum = el.dataset.num;
                // put the selected surah name into the input
                if (suraInput) suraInput.value = s.name;
                clearSuraSuggestions();
                // focus aya input so user can type the aya
                if (ayaInput) ayaInput.focus();
            });
            suraSuggest.appendChild(el);
        });
        suraSuggest.setAttribute('aria-hidden', matched.length ? 'false' : 'true');
    }

    if (suraInput) {
        let suraTimer = null;
        suraInput.addEventListener('input', e => {
            clearTimeout(suraTimer);
            const val = e.target.value;
            suraTimer = setTimeout(() => showSuraSuggestions(val), 120);
        });
        // hide suggestions when clicking outside
        document.addEventListener('click', e => {
            if (!suraSuggest) return;
            if (e.target === suraInput || suraSuggest.contains(e.target)) return;
            clearSuraSuggestions();
        });
    }

    // Render clickable anchor list in the #surahLinks container (if present)
    function renderSurahLinks() {
        const container = document.getElementById(surahLinksContainerId);
        if (!container) return;
        container.innerHTML = '';
        // If container already has anchors (static HTML), attach handlers to them
        const existingAnchors = Array.from(container.querySelectorAll('a'));
        if (existingAnchors.length) {
            existingAnchors.forEach((a, idx) => {
                // try to infer surah number from position or text
                const ds = a.dataset.num || (SURAHS[idx] && String(SURAHS[idx].num));
                a.dataset.num = ds;
                a.classList.add('surah-link');
                a.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    currentSurahNum = a.dataset.num;
                    console.debug('existing anchor clicked, set currentSurahNum=', currentSurahNum);
                    document.querySelectorAll('#surahLinks a.selected').forEach(el => el.classList.remove('selected'));
                    a.classList.add('selected');
                });
            });
            return;
        }

        SURAHS.forEach(s => {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'surah-link';
            a.dataset.num = String(s.num);
            a.textContent = `${s.num} - ${s.name}`;
            a.addEventListener('click', (ev) => {
                ev.preventDefault();
                currentSurahNum = a.dataset.num;
                console.debug('generated anchor clicked, set currentSurahNum=', currentSurahNum);
                document.querySelectorAll('.surah-link.selected').forEach(el => el.classList.remove('selected'));
                a.classList.add('selected');
            });
            container.appendChild(a);
        });
    }

    function getSurahByNum(num) {
        return SURAHS.find(s => s.num === Number(num));
    }

    function renderSurah(num) {
        if (!results) return;
        const surah = getSurahByNum(num);
        const verses = (surah && surah.verses) || [];
        results.innerHTML = '';
        if (!verses.length) {
            // show placeholder message
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = `نص السورة غير محمّل محلياً: ${surah ? surah.name : num}`;
            results.appendChild(card);
            return;
        }
        const container = document.createElement('div');
        container.className = 'surah';
        verses.forEach((text, i) => {
            const p = document.createElement('p');
            p.dataset.aya = String(i + 1);
            p.className = 'aya';
            p.innerHTML = `<span class="aya-num">${i + 1}</span> ${text}`;
            container.appendChild(p);
        });
        results.appendChild(container);
    }

    function gotoAya(n) {
        if (!results) return;
        const ayaEl = results.querySelector(`.aya[data-aya="${n}"]`);
        if (!ayaEl) return;
        // remove previous highlights
        results.querySelectorAll('.aya.highlight').forEach(el => el.classList.remove('highlight'));
        ayaEl.classList.add('highlight');
        ayaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function handleAyaInput(value, surahNumParam) {
        const v = (value || '').trim();
        if (!/^[0-9]+$/.test(v)) return;
        const ayaNum = Number(v);
        gotoAya(ayaNum);
        const surahNumToUse = surahNumParam || currentSurahNum;
        if (!surahNumToUse) {
            console.debug('handleAyaInput: no surah selected yet, currentSurahNum=', currentSurahNum);
            return;
        }
        const url = SUGGEST_TEMPLATE.replace('{S}', surahNumToUse).replace('{A}', ayaNum);
        // navigate to tafsir page (same tab)
        window.location.href = url;
    }

    // Event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            root.dataset.theme = root.dataset.theme === 'dark' ? '' : 'dark';
        });
    }

    // initialize (don't render the long surah list in the center)
    // renderSurahList(); // removed per UI: search is centered
    // renderSurahLinks(); // no static links area
    // navigate to tafsir URL when user types the aya (debounced)
    let ayaTimer = null;
    const DEBOUNCE_MS = 700;
    if (ayaInput) {
        ayaInput.addEventListener('input', e => {
            clearTimeout(ayaTimer);
            console.debug('aya input changed:', e.target.value);
            ayaTimer = setTimeout(() => handleAyaInput(e.target.value), DEBOUNCE_MS);
        });

        // also allow immediate Enter to navigate now
        ayaInput.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            handleAyaInput(ayaInput.value);
        });
    }

})();

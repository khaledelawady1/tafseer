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

    // ---- Surah list with verse counts ----
    const SURAHS = [
        { num: 1, name: 'الفاتحة', verses: [], count: 7 },
        { num: 2, name: 'البقرة', verses: [], count: 286 },
        { num: 3, name: 'آل عمران', verses: [], count: 200 },
        { num: 4, name: 'النساء', verses: [], count: 176 },
        { num: 5, name: 'المائدة', verses: [], count: 120 },
        { num: 6, name: 'الأنعام', verses: [], count: 165 },
        { num: 7, name: 'الأعراف', verses: [], count: 206 },
        { num: 8, name: 'الأنفال', verses: [], count: 75 },
        { num: 9, name: 'التوبة', verses: [], count: 129 },
        { num: 10, name: 'يونس', verses: [], count: 109 },
        { num: 11, name: 'هود', verses: [], count: 123 },
        { num: 12, name: 'يوسف', verses: [], count: 111 },
        { num: 13, name: 'الرعد', verses: [], count: 43 },
        { num: 14, name: 'إبراهيم', verses: [], count: 52 },
        { num: 15, name: 'الحجر', verses: [], count: 99 },
        { num: 16, name: 'النحل', verses: [], count: 128 },
        { num: 17, name: 'الإسراء', verses: [], count: 111 },
        { num: 18, name: 'الكهف', verses: [], count: 110 },
        { num: 19, name: 'مريم', verses: [], count: 98 },
        { num: 20, name: 'طه', verses: [], count: 135 },
        { num: 21, name: 'الأنبياء', verses: [], count: 112 },
        { num: 22, name: 'الحج', verses: [], count: 78 },
        { num: 23, name: 'المؤمنون', verses: [], count: 118 },
        { num: 24, name: 'النور', verses: [], count: 64 },
        { num: 25, name: 'الفرقان', verses: [], count: 77 },
        { num: 26, name: 'الشعراء', verses: [], count: 227 },
        { num: 27, name: 'النمل', verses: [], count: 93 },
        { num: 28, name: 'القصص', verses: [], count: 88 },
        { num: 29, name: 'العنكبوت', verses: [], count: 69 },
        { num: 30, name: 'الروم', verses: [], count: 60 },
        { num: 31, name: 'لقمان', verses: [], count: 34 },
        { num: 32, name: 'السجدة', verses: [], count: 30 },
        { num: 33, name: 'الأحزاب', verses: [], count: 73 },
        { num: 34, name: 'سبأ', verses: [], count: 54 },
        { num: 35, name: 'فاطر', verses: [], count: 45 },
        { num: 36, name: 'يس', verses: [], count: 83 },
        { num: 37, name: 'الصافات', verses: [], count: 182 },
        { num: 38, name: 'ص', verses: [], count: 88 },
        { num: 39, name: 'الزمر', verses: [], count: 75 },
        { num: 40, name: 'غافر', verses: [], count: 85 },
        { num: 41, name: 'فصلت', verses: [], count: 54 },
        { num: 42, name: 'الشورى', verses: [], count: 53 },
        { num: 43, name: 'الزخرف', verses: [], count: 89 },
        { num: 44, name: 'الدخان', verses: [], count: 59 },
        { num: 45, name: 'الجاثية', verses: [], count: 37 },
        { num: 46, name: 'الأحقاف', verses: [], count: 35 },
        { num: 47, name: 'محمد', verses: [], count: 38 },
        { num: 48, name: 'الفتح', verses: [], count: 29 },
        { num: 49, name: 'الحجرات', verses: [], count: 18 },
        { num: 50, name: 'ق', verses: [], count: 45 },
        { num: 51, name: 'الذاريات', verses: [], count: 60 },
        { num: 52, name: 'الطور', verses: [], count: 49 },
        { num: 53, name: 'النجم', verses: [], count: 62 },
        { num: 54, name: 'القمر', verses: [], count: 55 },
        { num: 55, name: 'الرحمن', verses: [], count: 78 },
        { num: 56, name: 'الواقعة', verses: [], count: 96 },
        { num: 57, name: 'الحديد', verses: [], count: 29 },
        { num: 58, name: 'المجادلة', verses: [], count: 22 },
        { num: 59, name: 'الحشر', verses: [], count: 24 },
        { num: 60, name: 'الممتحنة', verses: [], count: 13 },
        { num: 61, name: 'الصف', verses: [], count: 14 },
        { num: 62, name: 'الجمعة', verses: [], count: 11 },
        { num: 63, name: 'المنافقون', verses: [], count: 11 },
        { num: 64, name: 'التغابن', verses: [], count: 18 },
        { num: 65, name: 'الطلاق', verses: [], count: 12 },
        { num: 66, name: 'التحريم', verses: [], count: 12 },
        { num: 67, name: 'الملك', verses: [], count: 30 },
        { num: 68, name: 'القلم', verses: [], count: 52 },
        { num: 69, name: 'الحاقة', verses: [], count: 52 },
        { num: 70, name: 'المعارج', verses: [], count: 44 },
        { num: 71, name: 'نوح', verses: [], count: 28 },
        { num: 72, name: 'الجن', verses: [], count: 28 },
        { num: 73, name: 'المزمل', verses: [], count: 20 },
        { num: 74, name: 'المدثر', verses: [], count: 56 },
        { num: 75, name: 'القيامة', verses: [], count: 40 },
        { num: 76, name: 'الإنسان', verses: [], count: 31 },
        { num: 77, name: 'المرسلات', verses: [], count: 50 },
        { num: 78, name: 'النبأ', verses: [], count: 40 },
        { num: 79, name: 'النازعات', verses: [], count: 46 },
        { num: 80, name: 'عبس', verses: [], count: 42 },
        { num: 81, name: 'التكوير', verses: [], count: 29 },
        { num: 82, name: 'الانفطار', verses: [], count: 19 },
        { num: 83, name: 'المطففين', verses: [], count: 36 },
        { num: 84, name: 'الانشقاق', verses: [], count: 25 },
        { num: 85, name: 'البروج', verses: [], count: 22 },
        { num: 86, name: 'الطارق', verses: [], count: 17 },
        { num: 87, name: 'الأعلى', verses: [], count: 19 },
        { num: 88, name: 'الغاشية', verses: [], count: 26 },
        { num: 89, name: 'الفجر', verses: [], count: 30 },
        { num: 90, name: 'البلد', verses: [], count: 20 },
        { num: 91, name: 'الشمس', verses: [], count: 15 },
        { num: 92, name: 'الليل', verses: [], count: 21 },
        { num: 93, name: 'الضحى', verses: [], count: 11 },
        { num: 94, name: 'الشرح', verses: [], count: 8 },
        { num: 95, name: 'التين', verses: [], count: 8 },
        { num: 96, name: 'العلق', verses: [], count: 19 },
        { num: 97, name: 'القدر', verses: [], count: 5 },
        { num: 98, name: 'البينة', verses: [], count: 8 },
        { num: 99, name: 'الزلزلة', verses: [], count: 8 },
        { num: 100, name: 'العاديات', verses: [], count: 11 },
        { num: 101, name: 'القارعة', verses: [], count: 11 },
        { num: 102, name: 'التكاثر', verses: [], count: 8 },
        { num: 103, name: 'العصر', verses: [], count: 3 },
        { num: 104, name: 'الهمزة', verses: [], count: 9 },
        { num: 105, name: 'الفيل', verses: [], count: 5 },
        { num: 106, name: 'قريش', verses: [], count: 4 },
        { num: 107, name: 'الماعون', verses: [], count: 7 },
        { num: 108, name: 'الكوثر', verses: [], count: 3 },
        { num: 109, name: 'الكافرون', verses: [], count: 6 },
        { num: 110, name: 'النصر', verses: [], count: 3 },
        { num: 111, name: 'المسد', verses: [], count: 5 },
        { num: 112, name: 'الإخلاص', verses: [], count: 4 },
        { num: 113, name: 'الفلق', verses: [], count: 5 },
        { num: 114, name: 'الناس', verses: [], count: 6 }
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
        let surahNumToUse = surahNumParam || currentSurahNum;

        // If no surah selected yet, try to find from suraInput
        if (!surahNumToUse && suraInput && suraInput.value.trim()) {
            const inputVal = suraInput.value.trim();
            const foundSurah = SURAHS.find(s => s.name === inputVal || String(s.num) === inputVal);
            if (foundSurah) {
                surahNumToUse = String(foundSurah.num);
                currentSurahNum = surahNumToUse;
            }
        }

        if (!surahNumToUse) {
            console.debug('handleAyaInput: no surah selected yet, currentSurahNum=', currentSurahNum);
            return;
        }

        // Check if verse number is valid for this surah
        const surah = getSurahByNum(surahNumToUse);
        if (surah && surah.count && ayaNum > surah.count) {
            // Show error message
            if (results) {
                results.innerHTML = '';
                const card = document.createElement('div');
                card.className = 'card';
                card.style.color = '#d32f2f';
                card.textContent = `سورة "${surah.name}" فيها ${surah.count} آية فقط`;
                results.appendChild(card);
            }
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

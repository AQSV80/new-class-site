/* TK-121 — Google Sheets integration */
(() => {
    "use strict";

    const $ = (id) => document.getElementById(id);

    const PYTHON_CSV_URL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXUmmYLn7BXltUTcsK8BWaVlYdoBuPzBgb6Lhy73H-UvHqsdMRjVpQ11fEQsHTh5VvQkTJRAsjEYXI/pub?output=csv";

    const state = {
        data: null,
        sheet: "python",
        language: safeStorageGet("lang") || "az",
        theme: safeStorageGet("theme") || "dark",
        selectedStudent: ""
    };

    function safeStorageGet(key) {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    }

    function safeStorageSet(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch {}
    }

    const translations = {
        az: {
            siteTitle: "Qrup reytinqi TK-121",
            siteSubtitle: "Gecə gündüz çalışaq – Birbirimizlə yarışaq",
            teacher: "Müəllim",
            teacherRole: "Bakı Dövlət Universitetinin müəllimi",
            teacherMore: "Ətraflı məlumat →",
            admins: "Münsiflər",
            head: "✨Starshi✨",
            admin: "😎",
            compiler: "Kompilyator",
            compilerHint: "C++ və Python-da kod yazın",
            common: "Ümumi",
            win: "Həftənin qalibləri",
            out: "Həftənin autsayderləri",
            total: "Cəmi tələbə",
            avg: "Orta bal",
            upd: "Yeniləndi",
            profileLaunchHint: "Öz reytinqini və nəticələrini gör",
            myProgress: "Mənim nəticələrim",
            profileTitle: "Şagird profili",
            chooseStudent: "Şagird seç",
            choosePlaceholder: "Adını seç…",
            currentScore: "Cari bal",
            scoreGrowth: "Artım",
            classRank: "Ümumi yer",
            courseScores: "Fənlər üzrə nəticə",
            achievements: "Nailiyyətlər",
            topBadge: "Liderlər üçlüyü",
            growthBadge: "Bu həftə irəliləyiş",
            dualBadge: "Python + C++",
            streakBadge: "Ardıcıl lider",
            updatedNotice: "Reytinq yeniləndi",
            teacherBirthplace: "Bakı şəhəri",
            teacherGender: "👤 Cins: Kişi",
            teacherEducation: "TƏHSİLİ, ELMİ DƏRƏCƏSİ VƏ ADLARI",
            teacherEdu1: "1980-ci ildə M.V. Lomonosov adına Moskva Dövlət Universitetinin Hesablama riyaziyyatı və kibernetika fakültəsini bitirib.",
            teacherEdu2: "1981–1983-cü illərdə həmin fakültənin aspiranturasında təhsil alıb.",
            teacherEdu3: "«Qeyri-səlis xüsusi qiymətlər və onların hesablanması üsulları» mövzusunda namizədlik dissertasiyası müdafiəyə hazırlanıb.",
            teacherWork: "ƏMƏK FƏALİYYƏTİ",
            teacherWork1: "1984-cü ildən Bakı Dövlət Universitetində çalışır.",
            teacherWork2: "1984–1989 — Tətbiqi riyaziyyat kafedrası.",
            teacherWork3: "1989–1996 — Kibernetika kafedrası.",
            teacherWork4: "1997-ci ildən — İnformasiya texnologiyaları və proqramlaşdırma kafedrası."
        },

        ru: {
            siteTitle: "Рейтинг группы TK-121",
            siteSubtitle: "Работаем день и ночь — соревнуемся друг с другом",
            teacher: "Преподаватель",
            teacherRole: "Преподаватель Бакинского государственного университета",
            teacherMore: "Подробнее →",
            admins: "Жюри",
            head: "Главный админ",
            admin: "Админ",
            compiler: "Компилятор",
            compilerHint: "Пишите код на C++ и Python",
            common: "Общий",
            win: "Победители недели",
            out: "Аутсайдеры недели",
            total: "Всего учеников",
            avg: "Средний балл",
            upd: "Обновлено",
            profileLaunchHint: "Посмотри своё место, баллы и достижения",
            myProgress: "Мой прогресс",
            profileTitle: "Профиль ученика",
            chooseStudent: "Выбери своё имя",
            choosePlaceholder: "Выбрать имя…",
            currentScore: "Текущий балл",
            scoreGrowth: "Прогресс",
            classRank: "Место в общем рейтинге",
            courseScores: "Результаты по предметам",
            achievements: "Достижения",
            topBadge: "Тройка лидеров",
            growthBadge: "Рост за неделю",
            dualBadge: "Python + C++",
            streakBadge: "Серия в топе",
            updatedNotice: "Рейтинг обновился",
            teacherBirthplace: "город Баку",
            teacherGender: "👤 Пол: мужской",
            teacherEducation: "ОБРАЗОВАНИЕ, УЧЁНАЯ СТЕПЕНЬ И ЗВАНИЯ",
            teacherEdu1: "В 1980 году окончил факультет вычислительной математики и кибернетики Московского государственного университета им. М. В. Ломоносова.",
            teacherEdu2: "В 1981–1983 годах окончил аспирантуру факультета ВМК МГУ им. М. В. Ломоносова.",
            teacherEdu3: "Подготовлена к защите кандидатская диссертация на тему «Нечеткие собственные значения и методы их вычисления».",
            teacherWork: "ТРУДОВАЯ ДЕЯТЕЛЬНОСТЬ",
            teacherWork1: "С 1984 года работает в Бакинском государственном университете.",
            teacherWork2: "1984–1989 — кафедра «Прикладная математика».",
            teacherWork3: "1989–1996 — кафедра «Кибернетика».",
            teacherWork4: "С 1997 года — кафедра «Информационные технологии и программирование»."
        },

        en: {
            siteTitle: "Group rating TK-121",
            siteSubtitle: "Work hard — compete with each other",
            teacher: "Teacher",
            teacherRole: "Lecturer at Baku State University",
            teacherMore: "View details →",
            admins: "Jury",
            head: "Head admin",
            admin: "Admin",
            compiler: "Compiler",
            compilerHint: "Write code in C++ and Python",
            common: "Overall",
            win: "Winners of the week",
            out: "Outsiders of the week",
            total: "Total students",
            avg: "Average score",
            upd: "Updated",
            profileLaunchHint: "See your rank, scores, and achievements",
            myProgress: "My progress",
            profileTitle: "Student profile",
            chooseStudent: "Choose your name",
            choosePlaceholder: "Select a name…",
            currentScore: "Current score",
            scoreGrowth: "Progress",
            classRank: "Overall rank",
            courseScores: "Subject scores",
            achievements: "Achievements",
            topBadge: "Top three",
            growthBadge: "Weekly growth",
            dualBadge: "Python + C++",
            streakBadge: "Top streak",
            updatedNotice: "Ratings updated",
            teacherBirthplace: "Baku",
            teacherGender: "👤 Gender: Male",
            teacherEducation: "EDUCATION AND ACADEMIC QUALIFICATIONS",
            teacherEdu1: "Graduated in 1980 from the Faculty of Computational Mathematics and Cybernetics at Lomonosov Moscow State University.",
            teacherEdu2: "Completed postgraduate studies at the same faculty from 1981 to 1983.",
            teacherEdu3: "A candidate dissertation on fuzzy eigenvalues and methods of their computation was prepared for defense.",
            teacherWork: "PROFESSIONAL EXPERIENCE",
            teacherWork1: "Has worked at Baku State University since 1984.",
            teacherWork2: "1984–1989 — Department of Applied Mathematics.",
            teacherWork3: "1989–1996 — Department of Cybernetics.",
            teacherWork4: "Since 1997 — Department of Information Technology and Programming."
        },

        tr: {
            siteTitle: "Grup sıralaması TK-121",
            siteSubtitle: "Çalışalım ve birbirimizle yarışalım",
            teacher: "Öğretmen",
            teacherRole: "Bakü Devlet Üniversitesi öğretim görevlisi",
            teacherMore: "Detayları gör →",
            admins: "Jüri",
            head: "Baş yönetici",
            admin: "Yönetici",
            compiler: "Derleyici",
            compilerHint: "C++ ve Python kodu yazın",
            common: "Genel",
            win: "Haftanın kazananları",
            out: "Haftanın sonuncuları",
            total: "Toplam öğrenci",
            avg: "Ortalama puan",
            upd: "Güncellendi",
            profileLaunchHint: "Sıralamanı, puanlarını ve başarılarını gör",
            myProgress: "İlerlemem",
            profileTitle: "Öğrenci profili",
            chooseStudent: "İsim seç",
            choosePlaceholder: "İsim seç…",
            currentScore: "Güncel puan",
            scoreGrowth: "İlerleme",
            classRank: "Genel sıralama",
            courseScores: "Ders sonuçları",
            achievements: "Başarılar",
            topBadge: "İlk üç",
            growthBadge: "Haftalık yükseliş",
            dualBadge: "Python + C++",
            streakBadge: "İlk sıralarda seri",
            updatedNotice: "Sıralama güncellendi",
            teacherBirthplace: "Bakü",
            teacherGender: "👤 Cinsiyet: Erkek",
            teacherEducation: "EĞİTİM VE AKADEMİK DERECELER",
            teacherEdu1: "1980'de Lomonosov Moskova Devlet Üniversitesi Hesaplamalı Matematik ve Sibernetik Fakültesinden mezun oldu.",
            teacherEdu2: "1981–1983 yıllarında aynı fakültede lisansüstü eğitim aldı.",
            teacherEdu3: "Bulanık özdeğerler ve hesaplama yöntemleri üzerine doktora tezi savunmaya hazırlandı.",
            teacherWork: "MESLEKİ FAALİYET",
            teacherWork1: "1984'ten beri Bakü Devlet Üniversitesinde çalışmaktadır.",
            teacherWork2: "1984–1989 — Uygulamalı Matematik Bölümü.",
            teacherWork3: "1989–1996 — Sibernetik Bölümü.",
            teacherWork4: "1997'den beri — Bilgi Teknolojileri ve Programlama Bölümü."
        }
    };

    const translationsExtra = {
        az: {
            up: "irəli", down: "geri",
            noData: "Məlumat yoxdur",
            lastWeek: "Keçən həftə",
            thisWeek: "Bu həftə"
        },
        ru: {
            up: "вперёд", down: "назад",
            noData: "Нет данных",
            lastWeek: "Прошлая неделя",
            thisWeek: "Эта неделя"
        },
        en: {
            up: "up", down: "down",
            noData: "No data",
            lastWeek: "Last week",
            thisWeek: "This week"
        },
        tr: {
            up: "yukarı", down: "aşağı",
            noData: "Veri yok",
            lastWeek: "Geçen hafta",
            thisWeek: "Bu hafta"
        }
    };

    const t = (key) =>
        translations[state.language]?.[key] ??
        translations.az[key] ??
        key;

    const extra = (key) =>
        translationsExtra[state.language]?.[key] ?? key;

    const escapeHTML = (value) =>
        String(value ?? "").replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);

    const number = (value) =>
        Number(value || 0).toLocaleString(
            state.language === "en" ? "en-US" : "ru-RU"
        );

    const normalize = (name) =>
        String(name ?? "").trim().toLocaleLowerCase();

    function applyLanguage() {
        document.documentElement.lang = state.language;

        document.querySelectorAll("[data-i]").forEach((element) => {
            const value = t(element.dataset.i);
            if (value !== element.dataset.i) {
                element.textContent = value;
            }
        });

        const title = $("siteTitle");
        if (title) title.textContent = t("siteTitle");

        document.title = t("siteTitle");

        const subtitle = $("siteSubtitle");
        if (subtitle) subtitle.textContent = t("siteSubtitle");

        const adminNames = state.language === "ru"
            ? ["Memmed-Aga", "Afghan pull ups", "Gemini"]
            : ["Memmed-Aga", "Afghan  pull ups", "ClaudeCode"];

        adminNames.forEach((name, index) => {
            const element = $("adminName" + (index + 1));
            if (element) element.textContent = name;
        });

        document.querySelectorAll("[data-language]").forEach((button) => {
            const active = button.dataset.language === state.language;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    function applyTheme() {
        document.documentElement.dataset.theme = state.theme;
        safeStorageSet("theme", state.theme);
    }

    function renderRating() {
        if (!state.data) return;

        const sheet = state.data.sheets?.[state.sheet];
        const students = sheet?.students ?? [];
        const board = $("ratingBoard");

        if (!board) return;

        $("statTotal").textContent = String(students.length);

        const average = students.length
            ? students.reduce(
                (sum, student) => sum + Number(student.tr || 0), 0
            ) / students.length
            : 0;

        $("statAverage").textContent = students.length
            ? number(Math.round(average))
            : "—";

        const updated = new Date(state.data.updatedAt);

        $("statUpdated").textContent =
            Number.isNaN(updated.getTime())
                ? "—"
                : updated.toLocaleTimeString(state.language, {
                    hour: "2-digit",
                    minute: "2-digit"
                });

        document.querySelectorAll("[data-sheet]").forEach((button) => {
            const active = button.dataset.sheet === state.sheet;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        if (!students.length) {
            board.innerHTML =
                `<p class="empty-state">${escapeHTML(extra("noData"))}</p>`;
            return;
        }

        const isCommon = state.sheet === "common";
        const platforms = isCommon ? [] : (sheet.platforms ?? []);

        const heading = `
            <div class="rating-row rating-heading">
                <span>#</span>
                <span>${escapeHTML(
                    state.language === "ru" ? "Студент" : "Student"
                )}</span>
                ${platforms.map((platform) =>
                    `<span>${escapeHTML(platform)}</span>`
                ).join("")}
                <span>${escapeHTML(
                    state.language === "ru" ? "Баллы" : "Score"
                )}</span>
            </div>`;

        const rows = students.map((student) => {
            const scores = Array.isArray(student.scores)
                ? student.scores
                : [];

            return `
                <div class="rating-row"
                     data-student="${escapeHTML(student.name)}">
                    <span class="rank">
                        ${Number(student.place) || "—"}
                    </span>

                    <button type="button"
                            class="student-name profile-student"
                            data-student="${escapeHTML(student.name)}">
                        ${escapeHTML(student.name)}
                    </button>

                    ${platforms.map((_, index) =>
                        `<span class="student-score">${number(scores[index])}</span>`
                    ).join("")}

                    <span class="student-score">${number(student.tr)}</span>
                </div>`;
        }).join("");

        board.innerHTML = heading + rows;

        board.querySelectorAll(".rating-row").forEach((row) => {
            row.style.gridTemplateColumns =
                `45px minmax(150px, 2fr) repeat(${platforms.length}, minmax(65px, 1fr)) minmax(75px, 1fr)`;
        });
    }

    function getStudent(name, sheetName) {
        const rows = state.data?.sheets?.[sheetName]?.students ?? [];

        return rows.find(
            (student) => normalize(student.name) === normalize(name)
        );
    }

    function getAchievements(name, overall, python, cpp) {
        const badges = [];

        if (overall.place <= 3) {
            badges.push("🏆 " + t("topBadge"));
        }

        const pythonRows =
            state.data?.sheets?.python?.students ?? [];

        const bestGrowth = Math.max(
            0,
            ...pythonRows.map(
                (student) => Number(student.progress) || 0
            )
        );

        if (
            bestGrowth > 0 &&
            Number(overall.progress) === bestGrowth
        ) {
            badges.push("🚀 " + t("growthBadge"));
        }

        if (python?.tr > 0 && cpp?.tr > 0) {
            badges.push("🧠 " + t("dualBadge"));
        }

        return badges;
    }
      function renderProfile(name) {
        const content = $("profileContent");
        if (!content) return;

        if (!name) {
            content.replaceChildren();
            return;
        }

        const overall =
            getStudent(name, "common") ||
            getStudent(name, "python") ||
            getStudent(name, "cpp");

        if (!overall) {
            content.textContent = extra("noData");
            return;
        }

        const python = getStudent(name, "python");
        const cpp = getStudent(name, "cpp");

        const progress = (student) => {
            if (!student || student.progress == null) return "—";

            const value = Number(student.progress);

            return `${value > 0 ? "▲" : value < 0 ? "▼" : ""} ${number(Math.abs(value))}`;
        };

        const course = (label, student) => `
            <div class="course-result">
                <span>${label}</span>
                <strong>${student ? number(student.tr) : "—"}</strong>
                <small>${escapeHTML(t("scoreGrowth"))}: ${progress(student)}</small>
            </div>`;

        content.innerHTML = `
            <h2>${escapeHTML(overall.name)}</h2>

            <div class="profile-kpis">
                <div>
                    <small>${escapeHTML(t("classRank"))}</small>
                    <strong>#${Number(overall.place) || "—"}</strong>
                </div>

                <div>
                    <small>${escapeHTML(t("currentScore"))}</small>
                    <strong>${number(overall.tr)}</strong>
                </div>

                <div>
                    <small>${escapeHTML(t("scoreGrowth"))}</small>
                    <strong>${progress(overall)}</strong>
                </div>
            </div>

            <h3>${escapeHTML(t("courseScores"))}</h3>

            <div class="course-results">
                ${course("Python", python)}
                ${course("C++", cpp)}
            </div>

            <h3>${escapeHTML(t("achievements"))}</h3>

            <div class="badges">
                ${getAchievements(name, overall, python, cpp)
                    .map((badge) =>
                        `<span class="badge">${escapeHTML(badge)}</span>`
                    ).join("") || "—"}
            </div>`;
    }

    function openProfile(name = "") {
        if (!state.data) return;

        state.selectedStudent = name;

        const select = $("profileSelect");
        if (!select) return;

        const students =
            state.data.sheets.common?.students ??
            state.data.sheets.python?.students ??
            [];

        select.innerHTML =
            `<option value="">${escapeHTML(t("choosePlaceholder"))}</option>` +
            students.map((student) => `
                <option value="${escapeHTML(student.name)}">
                    ${escapeHTML(student.name)}
                </option>
            `).join("");

        select.value = name;

        $("profileModal").hidden = false;
        $("modalOverlay").hidden = false;

        renderProfile(name);

        if (!name) select.focus();

        $("profileModal").setAttribute("tabindex", "-1");
    }

    function closeModal(modal) {
        if ($(modal)) $(modal).hidden = true;
        if ($("modalOverlay")) $("modalOverlay").hidden = true;

        if (modal === "profileModal") {
            state.selectedStudent = "";
        }
    }

    function openWeekly(kind) {
        const weekly = state.data?.weekly?.[state.sheet];
        const period = weekly?.now;

        const winners = kind === "win";
        const people = winners
            ? (period?.top ?? [])
            : (period?.bottom ?? []);

        const title = winners ? t("win") : t("out");

        const rows = people.map((student, index) => `
            <div class="weekly-result">
                <span>
                    ${winners
                        ? ["🥇", "🥈", "🥉"][index] ?? "•"
                        : "•"}
                </span>
                <strong>${escapeHTML(student.name)}</strong>
                <span>${number(student.tr)}</span>
            </div>
        `).join("");

        const overlay = $("modalOverlay");

        overlay.innerHTML = `
            <section class="modal weekly-dialog"
                     role="dialog"
                     aria-modal="true"
                     aria-labelledby="weeklyTitle">

                <button type="button"
                        class="modal-close"
                        id="weeklyClose"
                        aria-label="Close">×</button>

                <h2 id="weeklyTitle">${escapeHTML(title)}</h2>

                ${rows || `<p>${escapeHTML(extra("noData"))}</p>`}
            </section>`;

        overlay.hidden = false;

        $("weeklyClose").addEventListener("click", () => {
            overlay.replaceChildren();
            overlay.hidden = true;
        }, { once: true });
    }

    // CSV parser: supports quoted cells and commas inside names.
    function parseCSV(text) {
        const rows = [];

        let row = [];
        let cell = "";
        let quoted = false;

        for (let i = 0; i < text.length; i++) {
            const ch = text[i];

            if (ch === '"') {
                if (quoted && text[i + 1] === '"') {
                    cell += '"';
                    i++;
                } else {
                    quoted = !quoted;
                }
            } else if (ch === "," && !quoted) {
                row.push(cell);
                cell = "";
            } else if (
                (ch === "\n" || ch === "\r") &&
                !quoted
            ) {
                if (ch === "\r" && text[i + 1] === "\n") {
                    i++;
                }

                row.push(cell);

                if (row.some(value => value.trim() !== "")) {
                    rows.push(row);
                }

                row = [];
                cell = "";
            } else {
                cell += ch;
            }
        }

        row.push(cell);

        if (row.some(value => value.trim() !== "")) {
            rows.push(row);
        }

        return rows;
    }

    function csvToPythonSheet(csvText) {
        const rows = parseCSV(csvText);

        if (rows.length < 2) {
            throw new Error("CSV is empty or has no student rows");
        }

        const headers = rows[0].map(value =>
            value.replace(/^\uFEFF/, "").trim().toLowerCase()
        );

        const column = (...names) =>
            headers.findIndex(header => names.includes(header));

        let nameCol = column(
            "unnamed: 0",
            "name",
            "student",
            "фио",
            "имя"
        );

        if (nameCol < 0 && headers[0] === "") {
            nameCol = 0;
        }

        const trCol = column("tr", "current", "current rating");
        const oldCol = column("sr", "old", "old rating");
        const progressCol = column("progress", "growth");

        if (nameCol < 0 || trCol < 0) {
            throw new Error(
                "CSV must contain student name and TR columns"
            );
        }

        const platformNames = [
            "FM",
            "HackerRank",
            "E-Olymp",
            "CodeForces",
            "LeetCode"
        ];

        const platformCols = platformNames.map(name =>
            headers.indexOf(name.toLowerCase())
        );

        const students = rows.slice(1).map((cells) => {
            const get = (col) => {
                if (col < 0) return 0;

                const value = String(cells[col] ?? "")
                    .trim()
                    .replace(",", ".");

                return Number(value) || 0;
            };

            const name = String(cells[nameCol] ?? "").trim();

            if (!name) return null;

            return {
                name,
                place: 0,
                tr: get(trCol),
                old: get(oldCol),
                progress: get(progressCol),
                scores: platformCols.map(get)
            };
        }).filter(Boolean);

        students.sort((a, b) => b.tr - a.tr);

        students.forEach((student, index) => {
            student.place = index + 1;
        });

        return {
            students,
            platforms: platformNames
        };
    }

    let requestInProgress = false;
    let lastDataSnapshot = "";

    async function loadRating() {
        if (requestInProgress) return;

        requestInProgress = true;

        try {
            const response = await fetch(PYTHON_CSV_URL, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error(
                    `Google Sheets HTTP ${response.status}`
                );
            }

            const csv = await response.text();
            const pythonSheet = csvToPythonSheet(csv);

            const snapshot = JSON.stringify(pythonSheet);
            const changed =
                lastDataSnapshot !== "" &&
                lastDataSnapshot !== snapshot;

            state.data = {
                sheets: {
                    common: {
                        students: [],
                        platforms: []
                    },

                    python: pythonSheet,

                    cpp: {
                        students: [],
                        platforms: []
                    }
                },

                weekly: {},
                history: [],
                updatedAt: new Date().toISOString()
            };

            lastDataSnapshot = snapshot;

            // Пока доступны только данные Python.
            // Остальные вкладки будут подключены после получения их CSV.
            document.querySelectorAll("[data-sheet]").forEach((button) => {
                if (button.dataset.sheet !== "python") {
                    button.disabled = true;
                    button.title = "CSV для этой вкладки ещё не подключён";
                } else {
                    button.disabled = false;
                    button.title = "";
                }
            });

            if (state.sheet !== "python") {
                state.sheet = "python";
            }

            renderRating();

            if (state.selectedStudent) {
                renderProfile(state.selectedStudent);
            }

            if (changed) {
                const toast = $("updateToast");

                if (toast) {
                    toast.textContent = t("updatedNotice");
                    toast.hidden = false;

                    window.setTimeout(() => {
                        toast.hidden = true;
                    }, 2500);
                }
            }

        } catch (error) {
            console.error("Google Sheets load failed:", error);

            if (!state.data) {
                const board = $("ratingBoard");

                if (board) {
                    board.textContent =
                        state.language === "ru"
                            ? "Не удалось загрузить CSV из Google Sheets. Проверь публикацию таблицы и подключение к интернету."
                            : "Could not load Google Sheets CSV. Check that the sheet is published and you are online.";
                }
            }

        } finally {
            requestInProgress = false;
        }
    }

    function bindEvents() {
        document
            .querySelector(".language-switcher")
            ?.addEventListener("click", (event) => {

                const button = event.target.closest("[data-language]");
                if (!button) return;

                state.language = button.dataset.language;

                safeStorageSet("lang", state.language);

                applyLanguage();
                renderRating();

                if (state.selectedStudent) {
                    renderProfile(state.selectedStudent);
                }
            });

        $("themeButton")?.addEventListener("click", () => {
            state.theme =
                state.theme === "dark" ? "light" : "dark";

            applyTheme();
        });

        document
            .querySelector(".rating-tabs")
            ?.addEventListener("click", (event) => {

                const button = event.target.closest("[data-sheet]");

                if (
                    !button ||
                    !state.data ||
                    button.disabled
                ) {
                    return;
                }

                state.sheet = button.dataset.sheet;
                renderRating();
            });

        document
            .querySelector(".weekly-tabs")
            ?.addEventListener("click", (event) => {

                const button = event.target.closest("[data-weekly]");

                if (button) {
                    openWeekly(button.dataset.weekly);
                }
            });

        $("compilerToggle")?.addEventListener("click", () => {
            const button = $("compilerToggle");

            const expanded =
                button.getAttribute("aria-expanded") === "true";

            button.setAttribute(
                "aria-expanded",
                String(!expanded)
            );

            $("compilerLinks").hidden = expanded;
        });

        $("profileOpen")?.addEventListener("click", () => {
            openProfile();
        });

        $("profileSelect")?.addEventListener("change", (event) => {
            state.selectedStudent = event.target.value;
            renderProfile(state.selectedStudent);
        });

        $("ratingBoard")?.addEventListener("click", (event) => {
            const button = event.target.closest(".profile-student");

            if (button) {
                openProfile(button.dataset.student);
            }
        });

        $("profileClose")?.addEventListener("click", () => {
            closeModal("profileModal");
        });

        $("teacherOpen")?.addEventListener("click", () => {
            $("teacherModal").hidden = false;
            $("modalOverlay").hidden = false;
            $("teacherClose").focus();
        });

        $("teacherClose")?.addEventListener("click", () => {
            closeModal("teacherModal");
        });

        $("modalOverlay")?.addEventListener("click", (event) => {
            if (event.target === $("modalOverlay")) {
                $("modalOverlay").replaceChildren();
                $("modalOverlay").hidden = true;

                $("profileModal").hidden = true;
                $("teacherModal").hidden = true;

                state.selectedStudent = "";
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;

            $("modalOverlay").replaceChildren();
            $("modalOverlay").hidden = true;

            $("profileModal").hidden = true;
            $("teacherModal").hidden = true;

            state.selectedStudent = "";
        });
    }

    function init() {
        applyTheme();
        applyLanguage();
        bindEvents();

        loadRating();

        // Проверяем Google Sheets раз в минуту.
        window.setInterval(loadRating, 60000);
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            init,
            { once: true }
        );
    } else {
        init();
    }
})();

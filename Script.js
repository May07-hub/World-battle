/*
    WORLD BATTLE
    MVP ENGINE
*/


/* ================================
   BATTLE DATA
================================ */

const battles = [

    {
        id: 1,

        category: "FOOD",

        question: "Does pineapple belong on pizza?",

        sideA: "YES",

        sideB: "NO",

        description:
            "The legendary pizza debate. Sweet pineapple or classic pizza tradition?",

        votesA: 634,

        votesB: 412,

        durationDays: 7,

        createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000)
    },


    {
        id: 2,

        category: "TECHNOLOGY",

        question: "Should artificial intelligence be used in everyday life?",

        sideA: "YES",

        sideB: "NO",

        description:
            "AI is becoming part of everyday life. Should society embrace it or limit its role?",

        votesA: 782,

        votesB: 691,

        durationDays: 7,

        createdAt: Date.now() - (1 * 24 * 60 * 60 * 1000)
    },


    {
        id: 3,

        category: "ENTERTAINMENT",

        question: "Are movies better than TV series?",

        sideA: "MOVIES",

        sideB: "SERIES",

        description:
            "One story. Two formats. Which deserves the crown?",

        votesA: 421,

        votesB: 508,

        durationDays: 7,

        createdAt: Date.now() - (4 * 60 * 60 * 1000)
    },


    {
        id: 4,

        category: "EVERYDAY LIFE",

        question: "Is waking up early better than staying up late?",

        sideA: "EARLY",

        sideB: "LATE",

        description:
            "The eternal battle between morning people and night owls.",

        votesA: 331,

        votesB: 287,

        durationDays: 7,

        createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000)
    },


    {
        id: 5,

        category: "GAMES",

        question: "Are single-player games better than multiplayer games?",

        sideA: "SINGLE-PLAYER",

        sideB: "MULTIPLAYER",

        description:
            "Adventure alone or compete with the world?",

        votesA: 542,

        votesB: 613,

        durationDays: 7,

        createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000)
    },


    {
        id: 6,

        category: "LIFESTYLE",

        question: "Should people read more physical books?",

        sideA: "YES",

        sideB: "NO",

        description:
            "Paper, pages and shelves — or digital convenience?",

        votesA: 719,

        votesB: 256,

        durationDays: 7,

        createdAt: Date.now() - (6 * 24 * 60 * 60 * 1000)
    }

];


/* ================================
   STORAGE
================================ */

let userVotes =
    JSON.parse(localStorage.getItem("worldBattleVotes")) || {};

let completedBattles =
    JSON.parse(localStorage.getItem("worldBattleCompleted")) || [];


/* ================================
   PAGE NAVIGATION
================================ */

function showPage(page) {

    document.querySelectorAll(".page").forEach(element => {
        element.classList.remove("active-page");
    });


    if (page === "home") {
        document
            .getElementById("homePage")
            .classList.add("active-page");

        renderBattles();
    }


    if (page === "archive") {
        document
            .getElementById("archivePage")
            .classList.add("active-page");

        renderArchive();
    }


    if (page === "about") {
        document
            .getElementById("aboutPage")
            .classList.add("active-page");
    }


    if (page === "battle") {
        document
            .getElementById("battlePage")
            .classList.add("active-page");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ================================
   HOME
================================ */

function renderBattles() {

    const grid =
        document.getElementById("battleGrid");

    grid.innerHTML = "";


    battles.forEach(battle => {

        const card =
            document.createElement("article");

        card.className = "battle-card";


        const total =
            battle.votesA + battle.votesB;


        card.innerHTML = `

            <div class="card-top">

                <span class="category">
                    ${battle.category}
                </span>

                <span class="status">
                    ● LIVE
                </span>

            </div>


            <h3>
                ${battle.question}
            </h3>


            <div class="sides-preview">

                <div class="side-preview">
                    ${battle.sideA}
                </div>

                <div class="side-preview">
                    ${battle.sideB}
                </div>

            </div>


            <div class="card-footer">

                <span>
                    ${formatNumber(total)} votes
                </span>

                <span>
                    VIEW CASE →
                </span>

            </div>

        `;


        card.onclick = () => {
            openBattle(battle.id);
        };


        grid.appendChild(card);

    });


    document.getElementById("battleCount")
        .textContent = battles.length;


    updateGlobalStats();
}


/* ================================
   OPEN BATTLE
================================ */

function openBattle(id) {

    const battle =
        battles.find(item => item.id === id);


    if (!battle) return;


    showPage("battle");


    const container =
        document.getElementById("battleDetails");


    const total =
        battle.votesA + battle.votesB;


    const percentA =
        total === 0
            ? 50
            : Math.round((battle.votesA / total) * 100);


    const percentB =
        100 - percentA;


    const alreadyVoted =
        userVotes[battle.id];


    container.innerHTML = `

        <div class="battle-container">

            <header>

                <div class="eyebrow">
                    ${battle.category} • WORLD BATTLE
                </div>

                <h1>
                    ${battle.question}
                </h1>

                <div class="battle-meta">

                    <span>
                        ⚖ PUBLIC CASE
                    </span>

                    <span>
                        🌎 WORLDWIDE
                    </span>

                    <span>
                        7 DAY BATTLE
                    </span>

                </div>

            </header>


            <div class="countdown">

                <div class="verdict-label">
                    VOTING CLOSES IN
                </div>

                <strong id="countdown-${battle.id}">
                    Calculating...
                </strong>

            </div>


            <p style="
                text-align:center;
                color:var(--muted);
                max-width:650px;
                margin:0 auto 35px;
                line-height:1.7;
            ">
                ${battle.description}
            </p>


            <div class="vote-grid">

                <div class="vote-side side-a">

                    <div class="side-label">
                        SIDE A
                    </div>

                    <h2>
                        ${battle.sideA}
                    </h2>

                    <button
                        class="vote-button"
                        onclick="castVote(${battle.id}, 'A')"
                        ${alreadyVoted ? "disabled" : ""}
                    >
                        ${alreadyVoted === "A"
                            ? "YOUR VOTE"
                            : alreadyVoted
                                ? "VOTE CAST"
                                : "VOTE ${battle.sideA}"}
                    </button>

                </div>


                <div class="vote-side side-b">

                    <div class="side-label">
                        SIDE B
                    </div>

                    <h2>
                        ${battle.sideB}
                    </h2>

                    <button
                        class="vote-button"
                        onclick="castVote(${battle.id}, 'B')"
                        ${alreadyVoted ? "disabled" : ""}
                    >
                        ${alreadyVoted === "B"
                            ? "YOUR VOTE"
                            : alreadyVoted
                                ? "VOTE CAST"
                                : "VOTE ${battle.sideB}"}
                    </button>

                </div>

            </div>


            <div class="results-box">

                <div class="results-title">

                    <strong>
                        LIVE WORLD VOTE
                    </strong>

                    <span>
                        ${formatNumber(total)} votes
                    </span>

                </div>


                <div class="results-bar">

                    <div
                        class="result-a"
                        style="width:${percentA}%">
                    </div>

                    <div
                        class="result-b"
                        style="width:${percentB}%">
                    </div>

                </div>


                <div class="result-percent">

                    <span>
                        ${battle.sideA}: ${percentA}%
                    </span>

                    <span>
                        ${battle.sideB}: ${percentB}%
                    </span>

                </div>

            </div>


            <div id="verdictArea-${battle.id}"></div>

        </div>

    `;


    startCountdown(battle);


    if (alreadyVoted) {
        showVerdictPreview(battle);
    }

}


/* ================================
   VOTING
================================ */

function castVote(id, side) {

    if (userVotes[id]) {
        alert("You have already voted in this battle.");
        return;
    }


    const battle =
        battles.find(item => item.id === id);


    if (!battle) return;


    if (side === "A") {
        battle.votesA++;
    }


    if (side === "B") {
        battle.votesB++;
    }


    userVotes[id] = side;


    localStorage.setItem(
        "worldBattleVotes",
        JSON.stringify(userVotes)
    );


    if (!completedBattles.includes(id)) {

        completedBattles.push(id);

        localStorage.setItem(
            "worldBattleCompleted",
            JSON.stringify(completedBattles)
        );

    }


    openBattle(id);


    alert("Your vote has been recorded.");

}


/* ================================
   VERDICT
================================ */

function getVerdictStrength(percentA, percentB) {

    const margin =
        Math.abs(percentA - percentB);


    if (margin <= 5) {
        return "CONTESTED VERDICT";
    }


    if (margin <= 20) {
        return "CLEAR VERDICT";
    }


    if (margin <= 40) {
        return "STRONG VERDICT";
    }


    return "OVERWHELMING VERDICT";
}


function showVerdictPreview(battle) {

    const total =
        battle.votesA + battle.votesB;


    if (total === 0) return;


    const percentA =
        Math.round((battle.votesA / total) * 100);


    const percentB =
        100 - percentA;


    const winner =
        percentA >= percentB
            ? battle.sideA
            : battle.sideB;


    const strength =
        getVerdictStrength(percentA, percentB);


    const area =
        document.getElementById(
            `verdictArea-${battle.id}`
        );


    area.innerHTML = `

        <div class="verdict">

            <div class="verdict-label">
                CURRENT WORLD VERDICT
            </div>

            <h2>
                ${winner}
            </h2>

            <p>
                ${strength}
            </p>

            <p style="
                margin-top:12px;
                color:var(--muted);
                font-size:12px;
            ">
                ${percentA}% — ${percentB}%
            </p>

        </div>

    `;

}


/* ================================
   COUNTDOWN
================================ */

function startCountdown(battle) {

    const endTime =
        battle.createdAt +
        (battle.durationDays * 24 * 60 * 60 * 1000);


    function update() {

        const element =
            document.getElementById(
                `countdown-${battle.id}`
            );


        if (!element) return;


        const remaining =
            endTime - Date.now();


        if (remaining <= 0) {

            element.textContent =
                "VOTING CLOSED";

            return;

        }


        const days =
            Math.floor(
                remaining / (1000 * 60 * 60 * 24)
            );


        const hours =
            Math.floor(
                (remaining / (1000 * 60 * 60)) % 24
            );


        const minutes =
            Math.floor(
                (remaining / (1000 * 60)) % 60
            );


        const seconds =
            Math.floor(
                (remaining / 1000) % 60
            );


        element.textContent =
            `${days}d ${hours}h ${minutes}m ${seconds}s`;

    }


    update();

    setInterval(update, 1000);

}


/* ================================
   ARCHIVE
================================ */

function renderArchive() {

    const list =
        document.getElementById("archiveList");


    list.innerHTML = "";


    const completed =
        battles.filter(
            battle => isBattleFinished(battle)
        );


    if (completed.length === 0) {

        list.innerHTML = `

            <div class="archive-item">

                <div>

                    <h3>
                        No sealed verdicts yet.
                    </h3>

                    <p style="
                        color:var(--muted);
                        margin-top:8px;
                    ">
                        Completed World Battles will
                        appear here.
                    </p>

                </div>

            </div>

        `;

        return;
    }


    completed.forEach(battle => {

        const total =
            battle.votesA + battle.votesB;


        const percentA =
            Math.round(
                (battle.votesA / total) * 100
            );


        const percentB =
            100 - percentA;


        const winner =
            percentA >= percentB
                ? battle.sideA
                : battle.sideB;


        const item =
            document.createElement("div");


        item.className =
            "archive-item";


        item.innerHTML = `

            <div>

                <div class="eyebrow">
                    ${battle.category}
                </div>

                <h3>
                    ${battle.question}
                </h3>

            </div>


            <div class="archive-result">

                ${winner}

                <small>
                    ${percentA}% — ${percentB}%
                </small>

            </div>

        `;


        list.appendChild(item);

    });

}


/* ================================
   BATTLE STATUS
================================ */

function isBattleFinished(battle) {

    const endTime =
        battle.createdAt +
        (battle.durationDays * 24 * 60 * 60 * 1000);


    return Date.now() >= endTime;

}


/* ================================
   GLOBAL STATISTICS
================================ */

function updateGlobalStats() {

    let total = 0;


    battles.forEach(battle => {

        total +=
            battle.votesA +
            battle.votesB;

    });


    document.getElementById("totalVotes")
        .textContent = formatNumber(total);

}


/* ================================
   PROFILE
================================ */

function showProfile() {

    const modal =
        document.getElementById("profileModal");


    const voteCount =
        Object.keys(userVotes).length;


    document.getElementById("profileVotes")
        .textContent = voteCount;


    document.getElementById("profileBattles")
        .textContent = voteCount;


    modal.classList.remove("hidden");

}


function closeProfile() {

    document
        .getElementById("profileModal")
        .classList.add("hidden");

}


/* ================================
   HELPERS
================================ */

function formatNumber(number) {

    return new Intl.NumberFormat().format(number);

}


function scrollToBattles() {

    document
        .getElementById("battlesSection")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ================================
   START APP
================================ */

renderBattles();

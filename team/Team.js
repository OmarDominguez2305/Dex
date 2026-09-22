const state = {
    cards: cards,
    selected: [],
    currentPage: 1,
    cardsPerPage: 20
};

const $ = function(id) {
    return document.getElementById(id);
};

const cardsGrid = $("cardsGrid");
const cardCount = $("cardCount");
const selectedTeam = $("selectedTeam");
const teamCount = $("teamCount");
const statusMessage = $("statusMessage");

const searchInput = $("searchInput");
const elementFilter = $("elementFilter");
const roleFilter = $("roleFilter");
const iconicFilter = $("iconicFilter");

const previousPage = $("previousPage");
const nextPage = $("nextPage");
const pageNumber = $("pageNumber");

const commandGrades = $("commandGrades");
const commandRarity = $("commandRarity");
const commandRaids = $("commandRaids");


// ========================================
// VOLVER
// ========================================

$("backButton").addEventListener("click", function() {

    if (typeof dexNavigate === "function") {
        dexNavigate("../inicio.html");
    } else {
        window.location.href = "../inicio.html";
    }

});


// ========================================
// CARGAR FILTROS
// ========================================

function loadFilters() {

    const elements = [];
    const roles = [];

    state.cards.forEach(function(card) {

        if (
            card.element &&
            !elements.includes(card.element)
        ) {
            elements.push(card.element);
        }

        if (
            card.role &&
            !roles.includes(card.role)
        ) {
            roles.push(card.role);
        }

    });

    elements.sort();
    roles.sort();

    elements.forEach(function(element) {

        const option =
            document.createElement("option");

        option.value = element;
        option.textContent = element;

        elementFilter.appendChild(option);

    });

    roles.forEach(function(role) {

        const option =
            document.createElement("option");

        option.value = role;
        option.textContent = role;

        roleFilter.appendChild(option);

    });

}


// ========================================
// FILTRAR CARTAS
// ========================================

function getFilteredCards() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const element =
        elementFilter.value;

    const role =
        roleFilter.value;

    const iconic =
        iconicFilter.value;

    return state.cards.filter(function(card) {

        const matchesSearch =
            !search ||
            String(card.name || "")
                .toLowerCase()
                .includes(search);

        const matchesElement =
            element === "all" ||
            card.element === element;

        const matchesRole =
            role === "all" ||
            card.role === role;

        const matchesIconic =
            iconic === "all" ||
            String(Boolean(card.iconic)) === iconic;

        return (
            matchesSearch &&
            matchesElement &&
            matchesRole &&
            matchesIconic
        );

    });

}


// ========================================
// MOSTRAR CARTAS
// ========================================

function renderCards() {

    if (statusMessage) {
        statusMessage.style.display = "none";
    }

    const filtered =
        getFilteredCards();

    const totalCards =
        filtered.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalCards /
                state.cardsPerPage
            )
        );


    if (state.currentPage > totalPages) {
        state.currentPage = totalPages;
    }


    const start =
        (state.currentPage - 1) *
        state.cardsPerPage;

    const end =
        start +
        state.cardsPerPage;

    const pageCards =
        filtered.slice(start, end);


    cardsGrid.innerHTML = "";


    cardCount.textContent =
        totalCards +
        (
            totalCards === 1
                ? " carta"
                : " cartas"
        );


    pageNumber.textContent =
        "Página " +
        state.currentPage +
        " de " +
        totalPages;


    previousPage.disabled =
        state.currentPage <= 1;

    nextPage.disabled =
        state.currentPage >= totalPages;


    if (pageCards.length === 0) {

        cardsGrid.innerHTML = `
            <div class="empty-team">
                No se encontraron cartas.
            </div>
        `;

        return;
    }


    pageCards.forEach(function(card) {

        cardsGrid.appendChild(
            createCard(card)
        );

    });

}


// ========================================
// CREAR CARTA
// ========================================

function createCard(card) {

    const article =
        document.createElement("article");

    article.className =
        "card";


    const selected =
        state.selected.some(function(item) {

            return (
                getCardKey(item) ===
                getCardKey(card)
            );

        });


    if (selected) {
        article.classList.add("selected");
    }


    const imageContainer =
        document.createElement("div");

    imageContainer.className =
        "card-image";


    if (card.image) {

        const image =
            document.createElement("img");

        image.src =
            card.image;

        image.alt =
            card.name || "Carta";

        image.loading =
            "lazy";

        imageContainer.appendChild(
            image
        );

    } else {

        const placeholder =
            document.createElement("div");

        placeholder.className =
            "image-placeholder";

        placeholder.textContent =
            "Sin imagen";

        imageContainer.appendChild(
            placeholder
        );

    }


    const content =
        document.createElement("div");

    content.className =
        "card-content";


    const name =
        document.createElement("div");

    name.className =
        "card-name";

    name.textContent =
        card.name || "Sin nombre";


    const tags =
        document.createElement("div");

    tags.className =
        "card-tags";


    if (card.element) {

        tags.appendChild(
            createTag(card.element)
        );

    }


    if (card.role) {

        tags.appendChild(
            createTag(card.role)
        );

    }


    if (card.iconic) {

        const tag =
            createTag("Iconic");

        tag.classList.add(
            "iconic-tag"
        );

        tags.appendChild(tag);

    }


    content.appendChild(name);
    content.appendChild(tags);


    article.appendChild(
        imageContainer
    );

    article.appendChild(
        content
    );


    if (selected) {

        const mark =
            document.createElement("div");

        mark.className =
            "selected-mark";

        mark.textContent =
            "✓";

        article.appendChild(mark);

    }


    article.addEventListener(
        "click",
        function() {

            toggleCard(card);

        }
    );


    return article;
}


// ========================================
// TAG
// ========================================

function createTag(text) {

    const tag =
        document.createElement("span");

    tag.className =
        "card-tag";

    tag.textContent =
        text;

    return tag;
}


// ========================================
// SELECCIONAR CARTA
// ========================================

function toggleCard(card) {

    const key =
        getCardKey(card);


    const index =
        state.selected.findIndex(
            function(item) {

                return (
                    getCardKey(item) === key
                );

            }
        );


    if (index !== -1) {

        state.selected.splice(
            index,
            1
        );

    } else {

        if (
            state.selected.length >= 5
        ) {

            alert(
                "El equipo puede tener hasta 5 cartas."
            );

            return;
        }


        state.selected.push(card);

    }


    renderCards();
    renderTeam();
    updateCommands();

}


// ========================================
// EQUIPO
// ========================================

function renderTeam() {

    selectedTeam.innerHTML = "";


    teamCount.textContent =
        state.selected.length +
        " / 5";


    if (
        state.selected.length === 0
    ) {

        selectedTeam.innerHTML = `
            <div class="empty-team">
                Selecciona cartas para construir tu equipo.
            </div>
        `;

        return;
    }


    state.selected.forEach(function(card) {

        const item =
            document.createElement("article");

        item.className =
            "team-card";


        const image =
            document.createElement("div");

        image.className =
            "team-card-image";


        if (card.image) {

            const img =
                document.createElement("img");

            img.src =
                card.image;

            img.alt =
                card.name || "Carta";

            image.appendChild(img);

        } else {

            const placeholder =
                document.createElement("div");

            placeholder.className =
                "image-placeholder";

            placeholder.textContent =
                "Sin imagen";

            image.appendChild(
                placeholder
            );

        }


        const name =
            document.createElement("div");

        name.className =
            "team-card-name";

        name.textContent =
            card.name || "Sin nombre";


        const remove =
            document.createElement("button");

        remove.className =
            "remove-team";

        remove.textContent =
            "×";

        remove.type =
            "button";


        remove.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                toggleCard(card);

            }
        );


        item.appendChild(image);
        item.appendChild(name);
        item.appendChild(remove);


        selectedTeam.appendChild(item);

    });

}


// ========================================
// COMANDOS
// ========================================

function updateCommands() {

    const names =
        state.selected
            .map(function(card) {
                return card.name;
            })
            .filter(Boolean);


    const nameText =
        names.join(", ");


    commandGrades.textContent =
        "@luvi#1792 inv -n " +
        nameText +
        " -g b,a,s";


    commandRarity.textContent =
        "@luvi#1792 inv -n " +
        nameText +
        " -r e,l";


    const element =
        state.selected.length > 0
            ? state.selected[0].element
            : "Fire";


    commandRaids.textContent =
        "@luvi#1792 raids -n " +
        nameText +
        " -e " +
        element;

}


// ========================================
// CAMBIAR PÁGINA
// ========================================

previousPage.addEventListener(
    "click",
    function() {

        if (
            state.currentPage <= 1
        ) {
            return;
        }

        state.currentPage--;

        renderCards();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


nextPage.addEventListener(
    "click",
    function() {

        const filtered =
            getFilteredCards();

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    filtered.length /
                    state.cardsPerPage
                )
            );


        if (
            state.currentPage >= totalPages
        ) {
            return;
        }

        state.currentPage++;

        renderCards();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


// ========================================
// FILTROS
// ========================================

function resetPage() {

    state.currentPage = 1;

    renderCards();

}


searchInput.addEventListener(
    "input",
    resetPage
);


elementFilter.addEventListener(
    "change",
    resetPage
);


roleFilter.addEventListener(
    "change",
    resetPage
);


iconicFilter.addEventListener(
    "change",
    resetPage
);


// ========================================
// COPIAR COMANDOS
// ========================================

document
    .querySelectorAll(".copy-button")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            async function() {

                const id =
                    button.getAttribute(
                        "data-command"
                    );


                const command =
                    $(id)
                        .textContent
                        .trim();


                try {

                    await navigator.clipboard.writeText(
                        command
                    );


                    const old =
                        button.textContent;


                    button.textContent =
                        "¡Copiado!";


                    setTimeout(
                        function() {

                            button.textContent =
                                old;

                        },
                        1200
                    );


                } catch (error) {

                    alert(
                        "No se pudo copiar. " +
                        "Copia el comando manualmente."
                    );

                }

            }
        );

    });


// ========================================
// UTILIDAD
// ========================================

function getCardKey(card) {

    return (
        String(card.name || "") +
        "|" +
        String(card.element || "") +
        "|" +
        String(card.role || "")
    );

}


// ========================================
// INICIAR
// ========================================

loadFilters();

renderCards();

renderTeam();

updateCommands();
const $ = id => document.getElementById(id);


/* =====================================
   ELEMENTOS
===================================== */

const back = $("backButton");
const search = $("searchInput");
const element = $("elementFilter");
const role = $("roleFilter");
const series = $("seriesFilter");
const iconic = $("iconicFilter");
const favoriteFilter = $("favoriteFilter");

const grid = $("cardsGrid");
const count = $("cardCount");
const status = $("statusMessage");

const prev = $("previousPage");
const next = $("nextPage");
const page = $("pageNumber");


/* =====================================
   CONFIGURACIÓN
===================================== */

const perPage = 20;
let currentPage = 1;

const FAVORITES_KEY = "dex-favorite-cards";

let favorites = new Set(
    JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]")
);

let allCards =
    typeof cards !== "undefined" && Array.isArray(cards)
        ? cards
        : [];


/* =====================================
   HABILIDADES
===================================== */

const abilities = {

    Frontline: [
        ["🛡️","Opening Guard","Reduce el daño recibido durante los primeros turnos."],
        ["❤️","Last Stand","Al llegar a 0 PS, recupera vida y reduce el siguiente daño."],
        ["⚔️","Provoke","Provoca a todos los enemigos durante 2 turnos."],
        ["🪽","Guardian Angel","Recibe un golpe letal destinado a un aliado."]
    ],

    Support: [
        ["💚","Mending Light","Restaura los PS del equipo periódicamente."],
        ["📯","War Chant","Aumenta el ATQ de todos los aliados."],
        ["✨","Remembrance","Cuando muere un aliado, cura a los demás."]
    ],

    Mastermind: [
        ["♟️","Checkmate","Inflige más daño contra enemigos con poca vida."],
        ["🧠","Mind Games","Puede confundir al enemigo y reducir su daño."],
        ["🔇","Blackmail","Puede silenciar al enemigo cuando intenta usar una habilidad."],
        ["♟️","Pieces in Play","Mientras estés vivo, aumenta el daño de los aliados."]
    ],

    Duelist: [
        ["⚔️","Riposte","Puede contraatacar inmediatamente al recibir un ataque."],
        ["🩸","Bloodlust","Cada tercer golpe recupera PS según el daño causado."],
        ["☠️","Mortal Wound","Reduce la curación recibida por el objetivo."],
        ["🎯","True Strike","Los ataques no pueden ser esquivados."]
    ],

    Phantom: [
        ["🌑","Shadowstep","Probabilidad de esquivar completamente los ataques."],
        ["💥","Phantom Rebound","Con poca vida puede anular daño y aumentar el ATQ."],
        ["🥷","From the Shadows","Permite realizar una emboscada con daño aumentado."],
        ["☠️","Lingering Venom","Aplica veneno y aumenta progresivamente el ATQ."]
    ]

};


/* =====================================
   VOLVER
===================================== */

back.onclick = function(){

    if(typeof dexNavigate === "function"){
        dexNavigate("../inicio.html");
    }else{
        window.location.href = "../inicio.html";
    }

};


/* =====================================
   DATOS
===================================== */

const nameOf = card =>
    String(card.name || "");

const elementOf = card =>
    String(card.element || "");

const roleOf = card =>
    String(card.role || "");

const seriesOf = card =>
    String(card.series || "");

const isIconic = card =>
    card.iconic === true ||
    card.is_iconic === true;


/* =====================================
   FAVORITOS
===================================== */

function cardId(card){

    return String(
        card.luviId ||
        card.id ||
        card.name ||
        ""
    );

}


function isFavorite(card){
    return favorites.has(cardId(card));
}


function saveFavorites(){

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify([...favorites])
    );

}


function toggleFavorite(card){

    const id = cardId(card);

    if(favorites.has(id)){
        favorites.delete(id);
    }else{
        favorites.add(id);
    }

    saveFavorites();
    render();

}


/* =====================================
   FILTROS
===================================== */

function loadFilters(){

    const elements = new Set();
    const roles = new Set();
    const seriesList = new Set();

    allCards.forEach(function(card){

        if(elementOf(card)){
            elements.add(elementOf(card));
        }

        if(roleOf(card)){
            roles.add(roleOf(card));
        }

        if(seriesOf(card)){
            seriesList.add(seriesOf(card));
        }

    });


    [...elements]
        .sort()
        .forEach(function(value){
            element.add(new Option(value,value));
        });


    [...roles]
        .sort()
        .forEach(function(value){
            role.add(new Option(value,value));
        });


    [...seriesList]
        .sort()
        .forEach(function(value){
            series.add(new Option(value,value));
        });

}


function filtered(){

    const text =
        search.value
            .trim()
            .toLowerCase();

    return allCards.filter(function(card){

        if(
            text &&
            !nameOf(card)
                .toLowerCase()
                .includes(text)
        ){
            return false;
        }


        if(
            element.value !== "all" &&
            elementOf(card) !== element.value
        ){
            return false;
        }


        if(
            role.value !== "all" &&
            roleOf(card) !== role.value
        ){
            return false;
        }


        if(
            series.value !== "all" &&
            seriesOf(card) !== series.value
        ){
            return false;
        }


        if(
            iconic.value !== "all" &&
            String(isIconic(card)) !== iconic.value
        ){
            return false;
        }


        if(
            favoriteFilter.value === "favorites" &&
            !isFavorite(card)
        ){
            return false;
        }


        return true;

    });

}


/* =====================================
   IMAGEN
===================================== */

function imageBox(card,preview=false){

    const box = document.createElement("div");

    box.className =
        preview
            ? "preview-image"
            : "card-image";

    if(!card.image){

        box.innerHTML =
            '<span class="image-placeholder">Imagen no disponible</span>';

        return box;

    }


    const img = document.createElement("img");

    img.src = card.image;
    img.alt = nameOf(card) || "Carta";
    img.loading = "lazy";

    img.onerror = function(){

        box.innerHTML =
            '<span class="image-placeholder">Imagen no disponible</span>';

    };

    box.appendChild(img);

    return box;

}


/* =====================================
   CREAR CARTA
===================================== */

function createCard(card){

    const article = document.createElement("article");

    article.className =
        "card" +
        (isIconic(card) ? " iconic" : "");


    /* IMAGEN */

    article.appendChild(imageBox(card));


    /* CONTENIDO */

    const content = document.createElement("div");
    content.className = "card-content";


    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = nameOf(card);


    const tags = document.createElement("div");
    tags.className = "card-tags";


    [
        elementOf(card),
        roleOf(card),
        seriesOf(card)
    ].forEach(function(value){

        const tag = document.createElement("span");

        tag.className = "card-tag";
        tag.textContent = value || "—";

        tags.appendChild(tag);

    });


    if(isIconic(card)){

        const tag = document.createElement("span");

        tag.className = "card-tag iconic-tag";
        tag.textContent = "Iconic";

        tags.appendChild(tag);

    }


    content.appendChild(name);
    content.appendChild(tags);
    article.appendChild(content);


    /* =================================
       BOTÓN FAVORITO
    ================================= */

    const favoriteButton = document.createElement("button");

    favoriteButton.className = "favorite-button";
    favoriteButton.type = "button";

    favoriteButton.textContent =
        isFavorite(card)
            ? "★"
            : "☆";

    favoriteButton.setAttribute(
        "aria-label",
        isFavorite(card)
            ? "Quitar de favoritos"
            : "Agregar a favoritos"
    );

    favoriteButton.classList.toggle(
        "active",
        isFavorite(card)
    );


    favoriteButton.onclick = function(event){

        event.stopPropagation();
        toggleFavorite(card);

    };


    article.appendChild(favoriteButton);


    /* =================================
       ABRIR PREVIEW
    ================================= */

    article.onclick = function(){
        openPreview(card);
    };


    return article;

}


/* =====================================
   CREAR PREVIEW
===================================== */

function createPreview(){

    if($("cardPreview")){
        return;
    }


    const modal = document.createElement("div");

    modal.id = "cardPreview";
    modal.className = "card-preview";


    modal.innerHTML = `

        <div class="preview-overlay"></div>

        <div class="preview-window">

            <button class="preview-close" id="previewClose" type="button" aria-label="Cerrar">
                ×
            </button>

            <div id="previewImage"></div>

            <div class="preview-content">

                <span id="previewIconic" class="preview-badge">
                    Iconic
                </span>

                <h2 id="previewName"></h2>

                <div class="preview-info">

                    <div>
                        <small>Elemento</small>
                        <strong id="previewElement"></strong>
                    </div>

                    <div>
                        <small>Rol</small>
                        <strong id="previewRole"></strong>
                    </div>

                    <div>
                        <small>Serie</small>
                        <strong id="previewSeries"></strong>
                    </div>

                </div>

                <h3>✨ Habilidades</h3>

                <p class="abilities-subtitle">
                    Habilidades que puede conseguir por su Role.
                </p>

                <div id="abilitiesList"></div>

            </div>

        </div>

    `;


    document.body.appendChild(modal);

    $("previewClose").onclick = closePreview;

    modal
        .querySelector(".preview-overlay")
        .onclick = closePreview;

}


/* =====================================
   ABRIR PREVIEW
===================================== */

function openPreview(card){

    document.body.classList.remove(
        "page-enter",
        "page-exit"
    );

    document.documentElement.classList.remove(
        "page-enter",
        "page-exit"
    );


    createPreview();


    const modal = $("cardPreview");
    const oldImage = $("previewImage");

    const newImage = imageBox(card,true);

    newImage.id = "previewImage";

    oldImage.replaceWith(newImage);


    $("previewName").textContent =
        nameOf(card);

    $("previewElement").textContent =
        elementOf(card) || "—";

    $("previewRole").textContent =
        roleOf(card) || "—";

    $("previewSeries").textContent =
        seriesOf(card) || "—";


    $("previewIconic").style.display =
        isIconic(card)
            ? "inline-flex"
            : "none";


    modal.classList.toggle(
        "preview-iconic",
        isIconic(card)
    );


    const list = $("abilitiesList");

    list.innerHTML = "";


    (
        abilities[roleOf(card)] ||
        []
    ).forEach(function(ability){

        const item = document.createElement("div");
        item.className = "preview-ability";


        const icon = document.createElement("span");

        icon.className = "preview-ability-icon";
        icon.textContent = ability[0];


        const content = document.createElement("div");


        const title = document.createElement("strong");

        title.textContent = ability[1];


        const description = document.createElement("p");

        description.textContent = ability[2];


        content.appendChild(title);
        content.appendChild(description);

        item.appendChild(icon);
        item.appendChild(content);

        list.appendChild(item);

    });


    modal.classList.add("active");
    document.body.classList.add("preview-open");

}


/* =====================================
   CERRAR PREVIEW
===================================== */

function closePreview(){

    const modal = $("cardPreview");

    if(!modal){
        return;
    }

    modal.classList.remove("active");
    document.body.classList.remove("preview-open");

}


document.addEventListener("keydown",function(event){

    if(event.key === "Escape"){
        closePreview();
    }

});


/* =====================================
   MOSTRAR
===================================== */

function render(){

    const list = filtered();


    const totalPages =
        Math.max(
            1,
            Math.ceil(list.length / perPage)
        );


    if(currentPage > totalPages){
        currentPage = totalPages;
    }


    const start =
        (currentPage - 1) * perPage;


    const pageCards =
        list.slice(
            start,
            start + perPage
        );


    grid.innerHTML = "";


    pageCards.forEach(function(card){
        grid.appendChild(createCard(card));
    });


    count.textContent =
        `${list.length} ${
            list.length === 1
                ? "carta"
                : "cartas"
        }`;


    page.textContent =
        `Página ${currentPage} / ${totalPages}`;


    prev.disabled = currentPage <= 1;
    next.disabled = currentPage >= totalPages;


    status.textContent =
        `Mostrando ${pageCards.length} de ${list.length} cartas.`;


    if(!list.length){

        grid.innerHTML =
            '<div class="image-placeholder" style="grid-column:1/-1;padding:30px;">' +
            'No se encontraron cartas.' +
            '</div>';

    }

}


/* =====================================
   EVENTOS DE FILTROS
===================================== */

[
    search,
    element,
    role,
    series,
    iconic,
    favoriteFilter
]
.forEach(function(input){

    input.addEventListener("input",function(){

        currentPage = 1;
        render();

    });


    input.addEventListener("change",function(){

        currentPage = 1;
        render();

    });

});


/* =====================================
   PAGINACIÓN
===================================== */

prev.onclick = function(){

    if(currentPage <= 1){
        return;
    }

    currentPage--;
    render();

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

};


next.onclick = function(){

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filtered().length /
                perPage
            )
        );


    if(currentPage >= totalPages){
        return;
    }

    currentPage++;
    render();

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

};


/* =====================================
   INICIAR
===================================== */

if(!allCards.length){

    status.textContent =
        "No se encontró el catálogo de cartas.";

    status.classList.add("error");

}else{

    loadFilters();
    render();

}

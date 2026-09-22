// IMPORTADOR AUTOMÁTICO DE DEX
// Ejecutar con Node.js / Termux.
// NO ejecutar desde la vista previa de Acode.

const fs = require("fs");
const path = require("path");

const API = "https://luvi-game.com/api/cards/browse";
const IMAGE_API = "https://luvi-game.com/api/catalog-images/resolve";

const PAGE_LIMIT = 12;
const IMAGE_BATCH = 10;

async function getJson(url, options = {}) {

    const maxRetries = 6;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {

        const response = await fetch(url, options);

        if (response.ok) {
            return response.json();
        }

        if (response.status === 429) {

            const waitSeconds =
                Math.min(30, 3 * Math.pow(2, attempt));

            console.log(
                `Límite de solicitudes. Esperando ${waitSeconds} segundos...`
            );

            await new Promise(resolve =>
                setTimeout(resolve, waitSeconds * 1000)
            );

            continue;
        }

        throw new Error(`HTTP ${response.status}`);
    }

    throw new Error(
        "La API sigue limitando las solicitudes después de varios intentos."
    );
}
async function getAllCards() {
    const cards = [];

    let page = 1;
    let totalPages = 1;

    do {
        console.log(`Descargando página ${page}/${totalPages}...`);

        const url =
            `${API}?page=${page}&limit=${PAGE_LIMIT}`;

        const data = await getJson(url);

        if (!Array.isArray(data.cards)) {
            throw new Error("La API no devolvió las cartas.");
        }

        cards.push(...data.cards);

        totalPages =
            Number(data.pagination?.totalPages || 1);

        page++;

    } while (page <= totalPages);

    return cards;
}

async function resolveImages(cards) {

    const images = new Map();

    for (
        let start = 0;
        start < cards.length;
        start += IMAGE_BATCH
    ) {

        const batch =
            cards.slice(start, start + IMAGE_BATCH);

        console.log(
            `Imágenes: ${Math.min(
                start + batch.length,
                cards.length
            )}/${cards.length}`
        );

        const items = batch.map(card => ({
            kind: "card",
            entity_id: card._id,
            rendition: "poster"
        }));

        const data = await getJson(
            IMAGE_API,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    items: items
                })
            }
        );

        for (const card of batch) {

            const key =
                `card:${card._id}`;

            const result =
                data.results?.[key];

            if (
                result &&
                result.status === "ready" &&
                result.url
            ) {

                images.set(
                    card._id,
                    result.url
                );

            } else {

                images.set(
                    card._id,
                    ""
                );

                console.log(
                    `Sin imagen: ${card.name}`
                );
            }
        }
    }

    return images;
}

function createCardsFile(cards, images) {

    let output =
`// DEX - BASE DE CARTAS
// Generado automáticamente desde Luvi.
// No editar manualmente.

const cards = [
`;

    cards.forEach((card, index) => {

        const item = {

            name: card.name || "",

            element: card.element || "",

            role: card.role || "",

            iconic:
                Boolean(card.is_iconic),

            series:
                card.series || "",

            luviId:
                card._id || "",

            artworkId:
                card.image_identity?.artwork_id || "",

            artworkRevision:
                card.image_identity?.artwork_revision || 1,

            image:
                images.get(card._id) || ""
        };

        output +=
            "    " +
            JSON.stringify(item);

        if (index < cards.length - 1) {
            output += ",";
        }

        output += "\n";
    });

    output +=
`];

`;

    return output;
}

async function main() {

    console.log("");
    console.log("================================");
    console.log("       IMPORTADOR DEX");
    console.log("================================");
    console.log("");

    console.log("1. Obteniendo cartas...");

    const cards =
        await getAllCards();

    console.log("");
    console.log(
        `Cartas encontradas: ${cards.length}`
    );

    console.log("");
    console.log("2. Obteniendo imágenes...");

    const images =
        await resolveImages(cards);

    console.log("");
    console.log("3. Generando cards.js...");

    const content =
        createCardsFile(cards, images);

    const teamFolder =
        path.join(process.cwd(), "team");

    if (!fs.existsSync(teamFolder)) {
        fs.mkdirSync(teamFolder);
    }

    const output =
        path.join(
            teamFolder,
            "cards.js"
        );

    fs.writeFileSync(
        output,
        content,
        "utf8"
    );

    let ready = 0;

    for (const url of images.values()) {
        if (url) {
            ready++;
        }
    }

    console.log("");
    console.log("================================");
    console.log("          TERMINADO");
    console.log("================================");
    console.log("");
    console.log(
        `Cartas: ${cards.length}`
    );
    console.log(
        `Imágenes: ${ready}`
    );
    console.log(
        `Sin imagen: ${cards.length - ready}`
    );
    console.log("");
    console.log(
        `Archivo generado: ${output}`
    );
    console.log("");
}

main().catch(error => {

    console.log("");
    console.log("================================");
    console.log("             ERROR");
    console.log("================================");
    console.log("");

    console.log(error);

    console.log("");
});
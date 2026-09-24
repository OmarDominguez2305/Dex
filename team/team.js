const $=id=>document.getElementById(id);
const cardsData=typeof cards!=="undefined"&&Array.isArray(cards)?cards:[];
let selected=[],currentPage=1;
const perPage=20;
const FAVORITES_KEY="dex-favorite-cards";

const back=$("backButton");
const search=$("searchInput"),element=$("elementFilter"),role=$("roleFilter"),series=$("seriesFilter"),iconic=$("iconicFilter");
const grid=$("cardsGrid"),count=$("cardCount"),status=$("statusMessage");
const team=$("selectedTeam"),teamCount=$("teamCount"),prev=$("previousPage"),next=$("nextPage"),page=$("pageNumber");
const printButton=$("printTeam"),downloadButton=$("downloadTeam");
const commandGrades=$("commandGrades"),commandRarity=$("commandRarity"),commandRaids=$("commandRaids");

let favorites=new Set();
try{
    favorites=new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY)||"[]"));
}catch(e){}


/* =========================
   VOLVER
========================= */

if(back){
    back.onclick=()=>{
        if(typeof dexNavigate==="function") dexNavigate("../inicio.html");
        else window.location.href="../inicio.html";
    };
}


/* =========================
   FAVORITOS
========================= */

function cardId(c){
    return String(c.luviId||c.id||c.name||"");
}

function isFavorite(c){
    return favorites.has(cardId(c));
}


/* =========================
   FILTROS
========================= */

function filters(){
    [...new Set(cardsData.map(c=>c.element).filter(Boolean))]
        .sort()
        .forEach(x=>element.add(new Option(x,x)));

    [...new Set(cardsData.map(c=>c.role).filter(Boolean))]
        .sort()
        .forEach(x=>role.add(new Option(x,x)));

    [...new Set(cardsData.map(c=>c.series).filter(Boolean))]
        .sort()
        .forEach(x=>series.add(new Option(x,x)));
}


/* =========================
   FILTRADO
========================= */

function filtered(){
    const s=search.value.toLowerCase().trim();

    return cardsData.filter(c=>
        (!s||String(c.name||"").toLowerCase().includes(s))&&
        (element.value==="all"||c.element===element.value)&&
        (role.value==="all"||c.role===role.value)&&
        (series.value==="all"||c.series===series.value)&&
        (iconic.value==="all"||String(c.iconic===true||c.is_iconic===true)===iconic.value)
    );
}


/* =========================
   IMAGEN
========================= */

function img(c,cls){
    const d=document.createElement("div");
    d.className=cls;

    if(!c.image){
        d.innerHTML='<span class="image-placeholder">Imagen no disponible</span>';
        return d;
    }

    const i=document.createElement("img");
    i.src=c.image;
    i.alt=c.name||"Carta";
    i.loading="lazy";
    i.crossOrigin="anonymous";
    i.onerror=()=>d.innerHTML='<span class="image-placeholder">Imagen no disponible</span>';

    d.appendChild(i);
    return d;
}


/* =========================
   CARTAS
========================= */

function render(){
    const list=filtered();
    const pages=Math.max(1,Math.ceil(list.length/perPage));

    if(currentPage>pages) currentPage=pages;

    grid.innerHTML="";

    list.slice((currentPage-1)*perPage,currentPage*perPage).forEach(c=>{
        const a=document.createElement("article");
        a.className="card"+(selected.includes(c)?" selected":"");
        a.appendChild(img(c,"card-image"));

        const content=document.createElement("div");
        content.className="card-content";

        const n=document.createElement("div");
        n.className="card-name";
        n.textContent=c.name||"Sin nombre";

        const tags=document.createElement("div");
        tags.className="card-tags";

        [c.element,c.role,c.series].filter(Boolean).forEach(x=>{
            const t=document.createElement("span");
            t.className="card-tag";
            t.textContent=x;
            tags.appendChild(t);
        });

        if(c.iconic===true||c.is_iconic===true){
            const t=document.createElement("span");
            t.className="card-tag iconic-tag";
            t.textContent="Iconic";
            tags.appendChild(t);
        }

        if(isFavorite(c)){
            const t=document.createElement("span");
            t.className="card-tag";
            t.textContent="⭐ Favorito";
            tags.appendChild(t);
        }

        content.append(n,tags);
        a.appendChild(content);

        if(selected.includes(c)){
            const mark=document.createElement("div");
            mark.className="selected-mark";
            mark.textContent="✓";
            a.appendChild(mark);
        }

        a.onclick=()=>toggle(c);
        grid.appendChild(a);
    });

    count.textContent=`${list.length} ${list.length===1?"carta":"cartas"}`;
    page.textContent=`Página ${currentPage} / ${pages}`;
    prev.disabled=currentPage<=1;
    next.disabled=currentPage>=pages;

    const shown=Math.min(perPage,Math.max(0,list.length-(currentPage-1)*perPage));
    status.textContent=list.length?`Mostrando ${shown} de ${list.length} cartas.`:"No se encontraron cartas.";
}


/* =========================
   EQUIPO
========================= */

function toggle(c){
    const i=selected.indexOf(c);

    if(i>=0){
        selected.splice(i,1);
    }else{
        if(selected.length>=5){
            alert("El equipo solo puede tener 5 cartas.");
            return;
        }
        selected.push(c);
    }

    render();
    renderTeam();
}

function renderTeam(){
    teamCount.textContent=`${selected.length} / 5`;

    if(!selected.length){
        team.innerHTML='<div class="empty-team">Selecciona cartas para construir tu equipo.</div>';
        updateCommands();
        return;
    }

    team.innerHTML="";

    selected.forEach((c,i)=>{
        const d=document.createElement("div");
        d.className="team-card";

        const im=img(c,"team-card-image");

        const b=document.createElement("button");
        b.className="remove-team";
        b.type="button";
        b.textContent="×";

        b.onclick=e=>{
            e.stopPropagation();
            selected.splice(i,1);
            render();
            renderTeam();
        };

        im.appendChild(b);
        d.appendChild(im);

        const n=document.createElement("div");
        n.className="team-card-name";
        n.textContent=c.name||"Sin nombre";

        d.appendChild(n);
        team.appendChild(d);
    });

    updateCommands();
}


/* =========================
   COMANDOS
========================= */

function updateCommands(){
    if(!commandGrades||!commandRarity||!commandRaids) return;

    const names=selected.map(c=>c.name).filter(Boolean).join(", ");
    const e=selected[0]?.element||"Fire";

    commandGrades.textContent="@luvi#1792 inv -n "+names+" -g b,a,s";
    commandRarity.textContent="@luvi#1792 inv -n "+names+" -r e,l";
    commandRaids.textContent="@luvi#1792 raids -n "+names+" -e "+e;
}


/* =========================
   PAGINACIÓN
========================= */

prev.onclick=()=>{
    if(currentPage>1){
        currentPage--;
        render();
        window.scrollTo({top:0,behavior:"smooth"});
    }
};

next.onclick=()=>{
    const p=Math.max(1,Math.ceil(filtered().length/perPage));

    if(currentPage<p){
        currentPage++;
        render();
        window.scrollTo({top:0,behavior:"smooth"});
    }
};


/* =========================
   EVENTOS
========================= */

[search,element,role,series,iconic].forEach(x=>{
    x.addEventListener("input",()=>{
        currentPage=1;
        render();
    });

    x.addEventListener("change",()=>{
        currentPage=1;
        render();
    });
});


/* =========================
   COPIAR COMANDOS
========================= */

document.querySelectorAll(".copy-button").forEach(b=>{
    b.onclick=async()=>{
        const x=$(b.dataset.command).textContent.trim();

        try{
            await navigator.clipboard.writeText(x);

            const old=b.textContent;
            b.textContent="¡Copiado!";
            setTimeout(()=>b.textContent=old,1200);
        }catch(e){
            alert("No se pudo copiar. Copia el comando manualmente.");
        }
    };
});


/* =========================
   IMPRIMIR
========================= */

function escapeHTML(value){
    return String(value)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

function printTeam(){
    if(!selected.length){
        alert("Selecciona al menos una carta antes de imprimir.");
        return;
    }

    const cardsHTML=selected.map(c=>`
        <div class="print-card">
            <img src="${escapeHTML(c.image||"")}" alt="${escapeHTML(c.name||"Carta")}">
            <div>${escapeHTML(c.name||"Sin nombre")}</div>
        </div>
    `).join("");

    const printWindow=window.open("","_blank","width=900,height=700");

    if(!printWindow){
        alert("El navegador bloqueó la ventana de impresión. Permite ventanas emergentes para este sitio.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Dex - Mi Equipo</title>
            <style>
                *{box-sizing:border-box}
                body{margin:0;padding:30px;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif}
                h1{margin:0 0 8px;font-size:24px}
                p{margin:0 0 22px;color:#555}
                .print-team{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
                .print-card{overflow:hidden;border:1px solid #ccc;border-radius:10px;background:#fff;text-align:center}
                .print-card img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover}
                .print-card div{padding:9px 6px;font-size:12px;font-weight:bold}
                @media print{body{padding:0}}
                @media(max-width:700px){.print-team{grid-template-columns:repeat(2,1fr)}}
            </style>
        </head>
        <body>
            <h1>Mi equipo - Dex</h1>
            <p>${selected.length} / 5 cartas</p>
            <div class="print-team">${cardsHTML}</div>
            <script>
                window.addEventListener("load",()=>{
                    setTimeout(()=>window.print(),500);
                });
            <\/script>
        </body>
        </html>
    `);

    printWindow.document.close();
}


/* =========================
   DESCARGAR
========================= */

async function downloadTeam(){
    if(!selected.length){
        alert("Selecciona al menos una carta antes de descargar.");
        return;
    }

    if(typeof html2canvas==="undefined"){
        alert("No se pudo cargar el sistema de descarga.");
        return;
    }

    const exportBox=document.createElement("div");

    exportBox.style.position="fixed";
    exportBox.style.left="-100000px";
    exportBox.style.top="0";
    exportBox.style.width="1000px";
    exportBox.style.padding="30px";
    exportBox.style.background="#080808";
    exportBox.style.color="#fff";
    exportBox.style.fontFamily="Arial,Helvetica,sans-serif";

    const title=document.createElement("h1");
    title.textContent="Mi equipo - Dex";
    title.style.margin="0 0 20px";
    title.style.fontSize="28px";

    const exportGrid=document.createElement("div");
    exportGrid.style.display="grid";
    exportGrid.style.gridTemplateColumns="repeat(5,1fr)";
    exportGrid.style.gap="14px";

    selected.forEach(c=>{
        const card=document.createElement("div");

        card.style.background="#160d0f";
        card.style.border="1px solid #32171b";
        card.style.borderRadius="12px";
        card.style.overflow="hidden";

        const image=document.createElement("img");
        image.src=c.image||"";
        image.alt=c.name||"Carta";
        image.crossOrigin="anonymous";
        image.style.display="block";
        image.style.width="100%";
        image.style.aspectRatio="3/4";
        image.style.objectFit="cover";

        const name=document.createElement("div");
        name.textContent=c.name||"Sin nombre";
        name.style.padding="10px 7px";
        name.style.textAlign="center";
        name.style.fontSize="13px";
        name.style.fontWeight="bold";

        card.append(image,name);
        exportGrid.appendChild(card);
    });

    exportBox.append(title,exportGrid);
    document.body.appendChild(exportBox);

    try{
        await Promise.all([...exportBox.querySelectorAll("img")].map(image=>{
            if(image.complete) return Promise.resolve();

            return new Promise(resolve=>{
                image.onload=resolve;
                image.onerror=resolve;
            });
        }));

        const canvas=await html2canvas(exportBox,{
            backgroundColor:"#080808",
            scale:2,
            useCORS:true,
            allowTaint:false,
            logging:false
        });

        const link=document.createElement("a");
        link.download="dex-equipo.png";
        link.href=canvas.toDataURL("image/png");
        link.click();

    }catch(error){
        console.error("Error al generar la imagen:",error);
        alert("No se pudo generar la imagen. Es posible que alguna imagen externa no permita ser capturada.");
    }finally{
        exportBox.remove();
    }
}


/* =========================
   BOTONES
========================= */

if(printButton) printButton.onclick=printTeam;
if(downloadButton) downloadButton.onclick=downloadTeam;


/* =========================
   FAVORITOS EN TIEMPO REAL
========================= */

window.addEventListener("storage",event=>{
    if(event.key!==FAVORITES_KEY) return;

    try{
        favorites=new Set(JSON.parse(event.newValue||"[]"));
    }catch(e){
        favorites=new Set();
    }

    render();
});


/* =========================
   INICIAR
========================= */

if(!cardsData.length){
    status.textContent="No se encontró el catálogo de cartas.";
}else{
    filters();
    render();
    renderTeam();
}

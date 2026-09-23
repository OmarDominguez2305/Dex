const state={cards:typeof cards!=="undefined"?cards:[],selected:[],currentPage:1,cardsPerPage:20};
const $=id=>document.getElementById(id);
const searchInput=$("searchInput"),elementFilter=$("elementFilter"),roleFilter=$("roleFilter"),iconicFilter=$("iconicFilter"),cardsGrid=$("cardsGrid"),cardCount=$("cardCount"),statusMessage=$("statusMessage"),selectedTeam=$("selectedTeam"),teamCount=$("teamCount"),previousPage=$("previousPage"),nextPage=$("nextPage"),pageNumber=$("pageNumber"),commandGrades=$("commandGrades"),commandRarity=$("commandRarity"),commandRaids=$("commandRaids");

const key=c=>`${c.name||""}|${c.element||""}|${c.role||""}`;
const esc=v=>String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

function populateFilters(){
[...new Set(state.cards.map(c=>c.element).filter(Boolean))].sort().forEach(v=>elementFilter.add(new Option(v,v)));
[...new Set(state.cards.map(c=>c.role).filter(Boolean))].sort().forEach(v=>roleFilter.add(new Option(v,v)));
}

function filtered(){
const s=searchInput.value.trim().toLowerCase(),e=elementFilter.value,r=roleFilter.value,i=iconicFilter.value;
return state.cards.filter(c=>(!s||String(c.name||"").toLowerCase().includes(s))&&(e==="all"||c.element===e)&&(r==="all"||c.role===r)&&(i==="all"||String(Boolean(c.iconic))===i));
}

function imageBox(c,cls){
const box=document.createElement("div");box.className=cls;
if(!c.image){box.innerHTML='<span class="image-placeholder">Imagen no disponible</span>';return box}
const img=document.createElement("img");img.src=c.image;img.alt=c.name||"Carta";img.loading="lazy";img.onerror=()=>box.innerHTML='<span class="image-placeholder">Imagen no disponible</span>';box.appendChild(img);return box;
}

function renderCards(){
const f=filtered(),pages=Math.max(1,Math.ceil(f.length/state.cardsPerPage));if(state.currentPage>pages)state.currentPage=pages;
cardsGrid.innerHTML="";
f.slice((state.currentPage-1)*state.cardsPerPage,state.currentPage*state.cardsPerPage).forEach(c=>{
const sel=state.selected.some(x=>key(x)===key(c)),el=document.createElement("article");el.className="card"+(sel?" selected":"");
el.appendChild(imageBox(c,"card-image"));
const content=document.createElement("div");content.className="card-content";
const name=document.createElement("div");name.className="card-name";name.textContent=c.name||"Sin nombre";
const tags=document.createElement("div");tags.className="card-tags";
[c.element,c.role].filter(Boolean).forEach(v=>{const t=document.createElement("span");t.className="card-tag";t.textContent=v;tags.appendChild(t)});
content.append(name,tags);el.appendChild(content);
if(sel){const mark=document.createElement("div");mark.className="selected-mark";mark.textContent="✓";el.appendChild(mark)}
el.onclick=()=>toggle(c);cardsGrid.appendChild(el);
});
cardCount.textContent=`${f.length} ${f.length===1?"carta":"cartas"}`;
pageNumber.textContent=`Página ${state.currentPage} / ${pages}`;
previousPage.disabled=state.currentPage<=1;nextPage.disabled=state.currentPage>=pages;
statusMessage.textContent=f.length?`Mostrando ${Math.min(state.cardsPerPage,f.length-(state.currentPage-1)*state.cardsPerPage)} de ${f.length} cartas.`:"No se encontraron cartas.";
}

function toggle(c){
const i=state.selected.findIndex(x=>key(x)===key(c));
if(i>=0)state.selected.splice(i,1);else{if(state.selected.length>=5)return alert("El equipo solo puede tener 5 cartas.");state.selected.push(c)}
renderCards();renderTeam();updateCommands();
}

function renderTeam(){
teamCount.textContent=`${state.selected.length} / 5`;
if(!state.selected.length){selectedTeam.innerHTML='<div class="empty-team">Selecciona cartas para construir tu equipo.</div>';return}
selectedTeam.innerHTML="";
state.selected.forEach((c,i)=>{
const d=document.createElement("div");d.className="team-card";
const img=imageBox(c,"team-card-image");
const b=document.createElement("button");b.className="remove-team";b.type="button";b.textContent="×";
b.onclick=e=>{e.stopPropagation();state.selected.splice(i,1);renderCards();renderTeam();updateCommands()};
img.appendChild(b);d.appendChild(img);
const n=document.createElement("div");n.className="team-card-name";n.textContent=c.name||"Sin nombre";d.appendChild(n);selectedTeam.appendChild(d);
});
}

function updateCommands(){
const n=state.selected.map(c=>c.name).filter(Boolean).join(", ");
commandGrades.textContent="@luvi#1792 inv -n "+n+" -g b,a,s";
commandRarity.textContent="@luvi#1792 inv -n "+n+" -r e,l";
commandRaids.textContent="@luvi#1792 raids -n "+n+" -e "+(state.selected[0]?.element||"Fire");
}

previousPage.onclick=()=>{if(state.currentPage>1){state.currentPage--;renderCards();scrollTo({top:0,behavior:"smooth"})}};
nextPage.onclick=()=>{const p=Math.max(1,Math.ceil(filtered().length/state.cardsPerPage));if(state.currentPage<p){state.currentPage++;renderCards();scrollTo({top:0,behavior:"smooth"})}};

[searchInput,elementFilter,roleFilter,iconicFilter].forEach(x=>x.addEventListener(x===searchInput?"input":"change",()=>{state.currentPage=1;renderCards()}));

document.querySelectorAll(".copy-button").forEach(b=>b.onclick=async()=>{
try{await navigator.clipboard.writeText($(b.dataset.command).textContent);const t=b.textContent;b.textContent="¡Copiado!";setTimeout(()=>b.textContent=t,1200)}catch(e){alert("No se pudo copiar el comando.")}
});

function exportTeam(){
if(!state.selected.length)return alert("Selecciona al menos una carta.");
if(typeof html2canvas==="undefined")return alert("Falta cargar html2canvas.");
const o=document.createElement("div");o.id="dex-export-preview";
Object.assign(o.style,{position:"fixed",inset:"0",zIndex:"999999",background:"#050505",overflow:"auto",padding:"18px",boxSizing:"border-box"});
const html=state.selected.map(c=>`<div style="background:#0b0b0d;border:1px solid #35171c;border-radius:14px;overflow:hidden"><img src="${esc(c.image||"")}" style="display:block;width:100%;aspect-ratio:3/4;object-fit:cover;background:#111"><div style="padding:11px 6px;text-align:center;color:#fff;font:600 14px Arial">${esc(c.name||"Sin nombre")}</div></div>`).join("");
o.innerHTML=`<div id="dex-export-card" style="width:min(1250px,100%);margin:auto;padding:28px;box-sizing:border-box;background:#050505;border:1px solid #35171c;border-radius:18px;color:white;font-family:Arial"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px"><div style="display:flex;align-items:center;gap:12px"><img src="../assets/dex-logo.png" style="width:55px;height:55px;object-fit:contain"><div><div style="font-size:12px;letter-spacing:3px">DEX</div><div style="font-size:25px;font-weight:700">Team Builder</div></div></div><div style="padding:8px 13px;border:1px solid #4b2026;border-radius:9px">${state.selected.length}/5</div></div><div style="height:1px;background:#35171c;margin-bottom:24px"></div><div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px">${html}</div></div><div style="width:min(1250px,100%);margin:15px auto;display:flex;gap:10px"><button id="saveExport" style="flex:1;padding:13px;background:#35171c;border:1px solid #693039;border-radius:10px;color:white">💾 Guardar PNG</button><button id="closeExport" style="flex:1;padding:13px;background:#111;border:1px solid #333;border-radius:10px;color:white">Cerrar</button></div>`;
document.body.appendChild(o);
$("closeExport").onclick=()=>o.remove();
$("saveExport").onclick=async function(){
const b=this;b.disabled=true;b.textContent="Generando PNG...";
try{
const box=$("dex-export-card");
await Promise.all([...box.querySelectorAll("img")].map(i=>i.complete?Promise.resolve():new Promise(r=>{i.onload=r;i.onerror=r})));
const canvas=await html2canvas(box,{backgroundColor:"#050505",scale:2,useCORS:true,allowTaint:false,logging:false});
const a=document.createElement("a");a.href=canvas.toDataURL("image/png");a.download="dex-team-"+Date.now()+".png";document.body.appendChild(a);a.click();a.remove();
b.textContent="✓ PNG descargado";setTimeout(()=>{b.textContent="💾 Guardar PNG";b.disabled=false},1800);
}catch(e){console.error(e);b.disabled=false;b.textContent="💾 Guardar PNG";alert("No se pudo generar la imagen.")}
};
}

$("downloadTeam").onclick=exportTeam;
$("printTeam").onclick=exportTeam;

populateFilters();
renderCards();
renderTeam();
updateCommands();

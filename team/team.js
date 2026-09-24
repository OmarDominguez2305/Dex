const state={cards:cards,selected:[],currentPage:1,cardsPerPage:20};
const $=id=>document.getElementById(id);
const cardsGrid=$("cardsGrid"),cardCount=$("cardCount"),selectedTeam=$("selectedTeam"),teamCount=$("teamCount"),statusMessage=$("statusMessage");
const searchInput=$("searchInput"),elementFilter=$("elementFilter"),roleFilter=$("roleFilter"),iconicFilter=$("iconicFilter");
const previousPage=$("previousPage"),nextPage=$("nextPage"),pageNumber=$("pageNumber");
const commandGrades=$("commandGrades"),commandRarity=$("commandRarity"),commandRaids=$("commandRaids");

$("backButton").onclick=()=>typeof dexNavigate=="function"?dexNavigate("../inicio.html"):location.href="../inicio.html";

function loadFilters(){
 let e=[],r=[];
 state.cards.forEach(c=>{
  if(c.element&&!e.includes(c.element))e.push(c.element);
  if(c.role&&!r.includes(c.role))r.push(c.role);
 });
 e.sort();r.sort();
 e.forEach(x=>elementFilter.append(new Option(x,x)));
 r.forEach(x=>roleFilter.append(new Option(x,x)));
}

function getFilteredCards(){
 let s=searchInput.value.trim().toLowerCase(),e=elementFilter.value,r=roleFilter.value,i=iconicFilter.value;
 return state.cards.filter(c=>
  (!s||String(c.name||"").toLowerCase().includes(s))&&
  (e=="all"||c.element==e)&&
  (r=="all"||c.role==r)&&
  (i=="all"||String(!!c.iconic)==i)
 );
}

function renderCards(){
 statusMessage.style.display="none";
 let f=getFilteredCards(),pages=Math.max(1,Math.ceil(f.length/state.cardsPerPage));
 if(state.currentPage>pages)state.currentPage=pages;
 let start=(state.currentPage-1)*state.cardsPerPage;
 cardsGrid.innerHTML="";
 cardCount.textContent=f.length+(f.length==1?" carta":" cartas");
 pageNumber.textContent=`Página ${state.currentPage} de ${pages}`;
 previousPage.disabled=state.currentPage<=1;
 nextPage.disabled=state.currentPage>=pages;
 f.slice(start,start+state.cardsPerPage).forEach(c=>cardsGrid.append(createCard(c)));
 if(!f.length)cardsGrid.innerHTML='<div class="empty-team">No se encontraron cartas.</div>';
}

function createCard(c){
 let a=document.createElement("article");a.className="card";
 let selected=state.selected.some(x=>getCardKey(x)==getCardKey(c));
 if(selected)a.classList.add("selected");
 let im=document.createElement("div");im.className="card-image";
 if(c.image){let x=document.createElement("img");x.src=c.image;x.alt=c.name||"Carta";x.loading="lazy";im.append(x)}
 else im.innerHTML='<div class="image-placeholder">Sin imagen</div>';
 let co=document.createElement("div");co.className="card-content";
 let n=document.createElement("div");n.className="card-name";n.textContent=c.name||"Sin nombre";
 let t=document.createElement("div");t.className="card-tags";
 if(c.element)t.append(createTag(c.element));
 if(c.role)t.append(createTag(c.role));
 if(c.iconic){let x=createTag("Iconic");x.classList.add("iconic-tag");t.append(x)}
 co.append(n,t);a.append(im,co);
 if(selected){let m=document.createElement("div");m.className="selected-mark";m.textContent="✓";a.append(m)}
 a.onclick=()=>toggleCard(c);
 return a;
}

function createTag(x){
 let t=document.createElement("span");t.className="card-tag";t.textContent=x;return t;
}

function toggleCard(c){
 let k=getCardKey(c),i=state.selected.findIndex(x=>getCardKey(x)==k);
 if(i>-1)state.selected.splice(i,1);
 else{
  if(state.selected.length>=5)return alert("El equipo puede tener hasta 5 cartas.");
  state.selected.push(c);
 }
 renderCards();renderTeam();updateCommands();
}

function renderTeam(){
 selectedTeam.innerHTML="";teamCount.textContent=state.selected.length+" / 5";
 if(!state.selected.length){
  selectedTeam.innerHTML='<div class="empty-team">Selecciona cartas para construir tu equipo.</div>';return;
 }
 state.selected.forEach(c=>{
  let a=document.createElement("article");a.className="team-card";
  let im=document.createElement("div");im.className="team-card-image";
  if(c.image){let x=document.createElement("img");x.src=c.image;x.alt=c.name||"Carta";im.append(x)}
  else im.innerHTML='<div class="image-placeholder">Sin imagen</div>';
  let n=document.createElement("div");n.className="team-card-name";n.textContent=c.name||"Sin nombre";
  let b=document.createElement("button");b.className="remove-team";b.textContent="×";b.type="button";
  b.onclick=e=>{e.stopPropagation();toggleCard(c)};
  a.append(im,n,b);selectedTeam.append(a);
 });
}

function updateCommands(){
 let n=state.selected.map(c=>c.name).filter(Boolean).join(", "),e=state.selected[0]?.element||"Fire";
 commandGrades.textContent="@luvi#1792 inv -n "+n+" -g b,a,s";
 commandRarity.textContent="@luvi#1792 inv -n "+n+" -r e,l";
 commandRaids.textContent="@luvi#1792 raids -n "+n+" -e "+e;
}

previousPage.onclick=()=>{
 if(state.currentPage>1){state.currentPage--;renderCards();scrollTo({top:0,behavior:"smooth"})}
};

nextPage.onclick=()=>{
 let p=Math.max(1,Math.ceil(getFilteredCards().length/state.cardsPerPage));
 if(state.currentPage<p){state.currentPage++;renderCards();scrollTo({top:0,behavior:"smooth"})}
};

function resetPage(){state.currentPage=1;renderCards()}
searchInput.oninput=resetPage;
elementFilter.onchange=resetPage;
roleFilter.onchange=resetPage;
iconicFilter.onchange=resetPage;

document.querySelectorAll(".copy-button").forEach(b=>b.onclick=async()=>{
 let x=$(b.dataset.command).textContent.trim();
 try{
  await navigator.clipboard.writeText(x);
  let o=b.textContent;b.textContent="¡Copiado!";
  setTimeout(()=>b.textContent=o,1200);
 }catch(e){alert("No se pudo copiar. Copia el comando manualmente.")}
});

function getCardKey(c){
 return String(c.name||"")+"|"+String(c.element||"")+"|"+String(c.role||"");
}


/* EXPORTAR */

function exportTeam(){
 if(!state.selected.length)return alert("Selecciona al menos una carta.");

 let o=document.createElement("div");
 o.id="dex-export-preview";
 Object.assign(o.style,{
  position:"fixed",inset:"0",zIndex:"999999",
  background:"#050505",overflow:"auto",padding:"18px"
 });

 let cards=state.selected.map(c=>`
  <div style="
   background:#0b0b0d;
   border:1px solid #35171c;
   border-radius:14px;
   overflow:hidden;
   box-shadow:0 8px 25px #000;
  ">
   <img src="${c.image||""}" style="
    display:block;width:100%;
    aspect-ratio:3/4;
    object-fit:cover;
   ">
   <div style="
    padding:11px 6px;
    text-align:center;
    color:#fff;
    font:600 14px Arial;
   ">${c.name||"Sin nombre"}</div>
  </div>
 `).join("");

 o.innerHTML=`
 <div id="dex-export-card" style="
  max-width:1250px;
  margin:auto;
  padding:28px;
  background:
   radial-gradient(circle at top,#241014 0,#0b0809 35%,#050505 75%);
  border:1px solid #35171c;
  border-radius:18px;
  box-shadow:0 15px 50px #000;
  color:white;
  font-family:Arial,sans-serif;
 ">

  <div style="
   display:flex;
   align-items:center;
   justify-content:space-between;
   margin-bottom:24px;
  ">
   <div style="display:flex;align-items:center;gap:12px">
    <img src="../assets/dex-logo.png"
     style="width:55px;height:55px;object-fit:contain">
    <div>
     <div style="font-size:12px;color:#a66a72;letter-spacing:3px">
      DEX
     </div>
     <div style="font-size:25px;font-weight:700">
      Team Builder
     </div>
    </div>
   </div>

   <div style="
    padding:8px 13px;
    border:1px solid #4b2026;
    border-radius:9px;
    color:#c98991;
    font-size:12px;
   ">
    ${state.selected.length}/5
   </div>
  </div>

  <div style="
   height:1px;
   background:#35171c;
   margin-bottom:24px;
  "></div>

  <div style="
   display:grid;
   grid-template-columns:repeat(5,1fr);
   gap:14px;
  ">
   ${cards}
  </div>

  <div style="
   margin-top:25px;
   padding-top:15px;
   border-top:1px solid #35171c;
   display:flex;
   justify-content:space-between;
   color:#777;
   font-size:11px;
  ">
   <span>DEX • TEAM BUILDER</span>
   <span>Luvi Database</span>
  </div>

 </div>

 <div style="
  max-width:1250px;
  margin:15px auto 0;
  display:flex;
  gap:10px;
 ">
  <button id="saveExport" style="
   flex:1;padding:13px;
   background:#35171c;
   border:1px solid #693039;
   border-radius:10px;
   color:white;font:600 14px Arial;
  ">
   💾 Guardar
  </button>

  <button id="closeExport" style="
   flex:1;padding:13px;
   background:#111;
   border:1px solid #333;
   border-radius:10px;
   color:white;font:600 14px Arial;
  ">
   Cerrar
  </button>
 </div>

 <p style="
  text-align:center;
  color:#777;
  font:12px Arial;
 ">
  Mantén pulsada la imagen para guardarla si Android no muestra la opción Guardar.
 </p>
 `;

 document.body.append(o);

 $("closeExport").onclick=()=>o.remove();

 $("saveExport").onclick=async()=>{
  let img=o.querySelector("#dex-export-card");

  try{
   if(navigator.share){
    let text="Mi equipo en Dex";
    await navigator.share({title:"Dex Team",text:text});
    return;
   }
  }catch(e){}

  alert("Mantén pulsada la imagen para guardarla.");
 };

}

$("downloadTeam").onclick=exportTeam;
$("printTeam").onclick=exportTeam;

loadFilters();
renderCards();
renderTeam();
updateCommands();

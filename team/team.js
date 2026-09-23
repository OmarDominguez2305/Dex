const state={cards:cards,selected:[],currentPage:1,cardsPerPage:20};
const $=id=>document.getElementById(id);
const searchInput=$("searchInput"),elementFilter=$("elementFilter"),roleFilter=$("roleFilter"),iconicFilter=$("iconicFilter"),cardsGrid=$("cardsGrid"),cardCount=$("cardCount"),statusMessage=$("statusMessage"),selectedTeam=$("selectedTeam"),teamCount=$("teamCount"),previousPage=$("previousPage"),nextPage=$("nextPage"),pageNumber=$("pageNumber"),commandGrades=$("commandGrades"),commandRarity=$("commandRarity"),commandRaids=$("commandRaids");

const key=c=>`${c.name||""}|${c.element||""}|${c.role||""}`;
const esc=v=>String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

function populateFilters(){
 [...new Set(cards.map(c=>c.element).filter(Boolean))].sort().forEach(v=>elementFilter.innerHTML+=`<option value="${esc(v)}">${esc(v)}</option>`);
 [...new Set(cards.map(c=>c.role).filter(Boolean))].sort().forEach(v=>roleFilter.innerHTML+=`<option value="${esc(v)}">${esc(v)}</option>`);
}

function filtered(){
 const s=searchInput.value.trim().toLowerCase(),e=elementFilter.value,r=roleFilter.value,i=iconicFilter.value;
 return state.cards.filter(c=>
  (!s||String(c.name||"").toLowerCase().includes(s))&&
  (e=="all"||c.element==e)&&
  (r=="all"||c.role==r)&&
  (i=="all"||String(Boolean(c.iconic))==i)
 );
}

function renderCards(){
 const f=filtered(),pages=Math.max(1,Math.ceil(f.length/state.cardsPerPage));
 if(state.currentPage>pages)state.currentPage=pages;
 const start=(state.currentPage-1)*state.cardsPerPage;
 cardsGrid.innerHTML="";
 f.slice(start,start+state.cardsPerPage).forEach(c=>{
  const sel=state.selected.some(x=>key(x)==key(c)),el=document.createElement("article");
  el.className="card-item"+(sel?" selected":"");
  el.innerHTML=`<div class="card-image-wrap"><img class="card-image" src="${esc(c.image||"")}" alt="${esc(c.name)}">${sel?'<div class="selected-badge">✓</div>':""}</div><div class="card-info"><div class="card-name">${esc(c.name||"Sin nombre")}</div><div class="card-meta">${c.element?`<span>${esc(c.element)}</span>`:""}${c.role?`<span>${esc(c.role)}</span>`:""}</div></div>`;
  el.onclick=()=>toggle(c);
  cardsGrid.appendChild(el);
 });
 cardCount.textContent=f.length+(f.length==1?" carta":" cartas");
 pageNumber.textContent="Página "+state.currentPage;
 previousPage.disabled=state.currentPage<=1;
 nextPage.disabled=state.currentPage>=pages;
 statusMessage.textContent=f.length?"":"No se encontraron cartas.";
}

function toggle(c){
 const i=state.selected.findIndex(x=>key(x)==key(c));
 if(i>=0)state.selected.splice(i,1);
 else{
  if(state.selected.length>=5)return alert("El equipo solo puede tener 5 cartas.");
  state.selected.push(c);
 }
 renderCards();renderTeam();updateCommands();
}

function renderTeam(){
 teamCount.textContent=state.selected.length+" / 5";
 if(!state.selected.length){
  selectedTeam.innerHTML='<div class="empty-team">Selecciona cartas para construir tu equipo.</div>';
  return;
 }
 selectedTeam.innerHTML="";
 state.selected.forEach((c,i)=>{
  const d=document.createElement("div");
  d.className="team-card";
  d.innerHTML=`<div class="team-card-image"><img src="${esc(c.image||"")}" alt="${esc(c.name)}"><button class="remove-team" type="button">×</button></div><div class="team-card-name">${esc(c.name||"Sin nombre")}</div>`;
  d.querySelector(".remove-team").onclick=e=>{
   e.stopPropagation();state.selected.splice(i,1);renderCards();renderTeam();updateCommands();
  };
  selectedTeam.appendChild(d);
 });
}

function updateCommands(){
 const n=state.selected.map(c=>c.name).filter(Boolean).join(", ");
 commandGrades.textContent="@luvi#1792 inv -n "+n+" -g b,a,s";
 commandRarity.textContent="@luvi#1792 inv -n "+n+" -r e,l";
 commandRaids.textContent="@luvi#1792 raids -n "+n+" -e "+(state.selected[0]?.element||"Fire");
}

function exportTeam(){
 if(!state.selected.length)return alert("Selecciona al menos una carta.");
 if(typeof html2canvas=="undefined")return alert("Falta cargar html2canvas.");

 const o=document.createElement("div");
 o.id="dex-export-preview";
 Object.assign(o.style,{position:"fixed",inset:"0",zIndex:"999999",background:"#050505",overflow:"auto",padding:"18px",boxSizing:"border-box"});

 const html=state.selected.map(c=>`<div style="background:#0b0b0d;border:1px solid #35171c;border-radius:14px;overflow:hidden;box-shadow:0 8px 25px #000"><img src="${esc(c.image||"")}" style="display:block;width:100%;aspect-ratio:3/4;object-fit:cover;background:#111"><div style="padding:11px 6px;text-align:center;color:#fff;font:600 14px Arial">${esc(c.name||"Sin nombre")}</div></div>`).join("");

 o.innerHTML=`<div id="dex-export-card" style="width:min(1250px,100%);margin:auto;padding:28px;box-sizing:border-box;background:radial-gradient(circle at top,#241014 0,#0b0809 35%,#050505 75%);border:1px solid #35171c;border-radius:18px;color:white;font-family:Arial"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px"><div style="display:flex;align-items:center;gap:12px"><img src="../assets/dex-logo.png" style="width:55px;height:55px;object-fit:contain"><div><div style="font-size:12px;color:#a66a72;letter-spacing:3px">DEX</div><div style="font-size:25px;font-weight:700">Team Builder</div></div></div><div style="padding:8px 13px;border:1px solid #4b2026;border-radius:9px;color:#c98991">${state.selected.length}/5</div></div><div style="height:1px;background:#35171c;margin-bottom:24px"></div><div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px">${html}</div><div style="margin-top:25px;padding-top:15px;border-top:1px solid #35171c;display:flex;justify-content:space-between;color:#777;font-size:11px"><span>DEX • TEAM BUILDER</span><span>Team</span></div></div><div style="width:min(1250px,100%);margin:15px auto;display:flex;gap:10px"><button id="saveExport" style="flex:1;padding:13px;background:#35171c;border:1px solid #693039;border-radius:10px;color:white">💾 Guardar PNG</button><button id="closeExport" style="flex:1;padding:13px;background:#111;border:1px solid #333;border-radius:10px;color:white">Cerrar</button></div>`;

 document.body.appendChild(o);

 $("closeExport").onclick=()=>o.remove();

 $("saveExport").onclick=async function(){
  const b=this;b.disabled=true;b.textContent="Generando PNG...";
  try{
   const box=$("dex-export-card");
   await Promise.all([...box.querySelectorAll("img")].map(i=>i.complete?Promise.resolve():new Promise(r=>{i.onload=r;i.onerror=r}));
   await new Promise(r=>setTimeout(r,300));
   const canvas=await html2canvas(box,{backgroundColor:"#050505",scale:2,useCORS:true,allowTaint:false,logging:false});
   const a=document.createElement("a");
   a.href=canvas.toDataURL("image/png");
   a.download="dex-team-"+Date.now()+".png";
   document.body.appendChild(a);
   a.click();
   a.remove();
   b.textContent="✓ PNG descargado";
   setTimeout(()=>{b.textContent="💾 Guardar PNG";b.disabled=false},1800);
  }catch(e){
   console.error(e);
   b.disabled=false;b.textContent="💾 Guardar PNG";
   alert("No se pudo generar la imagen.");
  }
 };
}

previousPage.onclick=()=>{
 if(state.currentPage>1){state.currentPage--;renderCards();scrollTo({top:0,behavior:"smooth"});}
};

nextPage.onclick=()=>{
 const p=Math.max(1,Math.ceil(filtered().length/state.cardsPerPage));
 if(state.currentPage<p){state.currentPage++;renderCards();scrollTo({top:0,behavior:"smooth"});}
};

[searchInput,elementFilter,roleFilter,iconicFilter].forEach(x=>x.addEventListener(x==searchInput?"input":"change",()=>{state.currentPage=1;renderCards()}));

document.querySelectorAll(".copy-button").forEach(b=>b.onclick=async()=>{
 try{
  await navigator.clipboard.writeText($(b.dataset.command).textContent);
  const t=b.textContent;b.textContent="¡Copiado!";
  setTimeout(()=>b.textContent=t,1200);
 }catch(e){alert("No se pudo copiar el comando.")}
});

$("downloadTeam").onclick=exportTeam;
$("printTeam").onclick=exportTeam;

populateFilters();
renderCards();
renderTeam();
updateCommands();

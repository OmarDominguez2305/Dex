const state={
cards:cards,
selected:[],
currentPage:1,
cardsPerPage:20
};

const $=function(id){
return document.getElementById(id);
};

const cardsGrid=$("cardsGrid");
const cardCount=$("cardCount");
const selectedTeam=$("selectedTeam");
const teamCount=$("teamCount");
const statusMessage=$("statusMessage");

const searchInput=$("searchInput");
const elementFilter=$("elementFilter");
const roleFilter=$("roleFilter");
const iconicFilter=$("iconicFilter");

const previousPage=$("previousPage");
const nextPage=$("nextPage");
const pageNumber=$("pageNumber");

const commandGrades=$("commandGrades");
const commandRarity=$("commandRarity");
const commandRaids=$("commandRaids");


$("backButton").addEventListener("click",function(){

if(typeof dexNavigate==="function"){
dexNavigate("../inicio.html");
}else{
window.location.href="../inicio.html";
}

});


function loadFilters(){

const elements=[];
const roles=[];

state.cards.forEach(function(card){

if(card.element&&!elements.includes(card.element)){
elements.push(card.element);
}

if(card.role&&!roles.includes(card.role)){
roles.push(card.role);
}

});

elements.sort();
roles.sort();

elements.forEach(function(element){

const option=document.createElement("option");

option.value=element;
option.textContent=element;

elementFilter.appendChild(option);

});

roles.forEach(function(role){

const option=document.createElement("option");

option.value=role;
option.textContent=role;

roleFilter.appendChild(option);

});

}


function getFilteredCards(){

const search=searchInput.value.trim().toLowerCase();
const element=elementFilter.value;
const role=roleFilter.value;
const iconic=iconicFilter.value;

return state.cards.filter(function(card){

const matchesSearch=
!search||
String(card.name||"").toLowerCase().includes(search);

const matchesElement=
element==="all"||card.element===element;

const matchesRole=
role==="all"||card.role===role;

const matchesIconic=
iconic==="all"||
String(Boolean(card.iconic))===iconic;

return matchesSearch&&matchesElement&&matchesRole&&matchesIconic;

});

}


function renderCards(){

if(statusMessage){
statusMessage.style.display="none";
}

const filtered=getFilteredCards();

const totalCards=filtered.length;

const totalPages=Math.max(
1,
Math.ceil(totalCards/state.cardsPerPage)
);

if(state.currentPage>totalPages){
state.currentPage=totalPages;
}

const start=(state.currentPage-1)*state.cardsPerPage;
const end=start+state.cardsPerPage;

const pageCards=filtered.slice(start,end);

cardsGrid.innerHTML="";

cardCount.textContent=
totalCards+(totalCards===1?" carta":" cartas");

pageNumber.textContent=
"Página "+state.currentPage+" de "+totalPages;

previousPage.disabled=state.currentPage<=1;
nextPage.disabled=state.currentPage>=totalPages;

if(pageCards.length===0){

cardsGrid.innerHTML=
'<div class="empty-team">No se encontraron cartas.</div>';

return;
}

pageCards.forEach(function(card){
cardsGrid.appendChild(createCard(card));
});

}


function createCard(card){

const article=document.createElement("article");

article.className="card";

const selected=state.selected.some(function(item){

return getCardKey(item)===getCardKey(card);

});

if(selected){
article.classList.add("selected");
}

const imageContainer=document.createElement("div");

imageContainer.className="card-image";

if(card.image){

const image=document.createElement("img");

image.src=card.image;
image.alt=card.name||"Carta";
image.loading="lazy";

imageContainer.appendChild(image);

}else{

const placeholder=document.createElement("div");

placeholder.className="image-placeholder";
placeholder.textContent="Sin imagen";

imageContainer.appendChild(placeholder);

}


const content=document.createElement("div");

content.className="card-content";


const name=document.createElement("div");

name.className="card-name";
name.textContent=card.name||"Sin nombre";


const tags=document.createElement("div");

tags.className="card-tags";

if(card.element){
tags.appendChild(createTag(card.element));
}

if(card.role){
tags.appendChild(createTag(card.role));
}

if(card.iconic){

const tag=createTag("Iconic");

tag.classList.add("iconic-tag");

tags.appendChild(tag);

}

content.appendChild(name);
content.appendChild(tags);

article.appendChild(imageContainer);
article.appendChild(content);


if(selected){

const mark=document.createElement("div");

mark.className="selected-mark";
mark.textContent="✓";

article.appendChild(mark);

}


article.addEventListener("click",function(){
toggleCard(card);
});

return article;

}


function createTag(text){

const tag=document.createElement("span");

tag.className="card-tag";
tag.textContent=text;

return tag;

}


function toggleCard(card){

const key=getCardKey(card);

const index=state.selected.findIndex(function(item){

return getCardKey(item)===key;

});

if(index!==-1){

state.selected.splice(index,1);

}else{

if(state.selected.length>=5){

alert("El equipo puede tener hasta 5 cartas.");
return;

}

state.selected.push(card);

}

renderCards();
renderTeam();
updateCommands();

}


function renderTeam(){

selectedTeam.innerHTML="";

teamCount.textContent=
state.selected.length+" / 5";

if(state.selected.length===0){

selectedTeam.innerHTML=
'<div class="empty-team">Selecciona cartas para construir tu equipo.</div>';

return;

}


state.selected.forEach(function(card){

const item=document.createElement("article");

item.className="team-card";


const image=document.createElement("div");

image.className="team-card-image";


if(card.image){

const img=document.createElement("img");

img.src=card.image;
img.alt=card.name||"Carta";

image.appendChild(img);

}else{

const placeholder=document.createElement("div");

placeholder.className="image-placeholder";
placeholder.textContent="Sin imagen";

image.appendChild(placeholder);

}


const name=document.createElement("div");

name.className="team-card-name";
name.textContent=card.name||"Sin nombre";


const remove=document.createElement("button");

remove.className="remove-team";
remove.textContent="×";
remove.type="button";

remove.addEventListener("click",function(event){

event.stopPropagation();
toggleCard(card);

});


item.appendChild(image);
item.appendChild(name);
item.appendChild(remove);

selectedTeam.appendChild(item);

});

}


function updateCommands(){

const names=state.selected
.map(function(card){
return card.name;
})
.filter(Boolean);

const nameText=names.join(", ");

commandGrades.textContent=
"@luvi#1792 inv -n "+nameText+" -g b,a,s";

commandRarity.textContent=
"@luvi#1792 inv -n "+nameText+" -r e,l";

const element=
state.selected.length>0
?state.selected[0].element
:"Fire";

commandRaids.textContent=
"@luvi#1792 raids -n "+nameText+" -e "+element;

}


previousPage.addEventListener("click",function(){

if(state.currentPage<=1){
return;
}

state.currentPage--;

renderCards();

window.scrollTo({
top:0,
behavior:"smooth"
});

});


nextPage.addEventListener("click",function(){

const filtered=getFilteredCards();

const totalPages=Math.max(
1,
Math.ceil(filtered.length/state.cardsPerPage)
);

if(state.currentPage>=totalPages){
return;
}

state.currentPage++;

renderCards();

window.scrollTo({
top:0,
behavior:"smooth"
});

});


function resetPage(){

state.currentPage=1;
renderCards();

}

searchInput.addEventListener("input",resetPage);
elementFilter.addEventListener("change",resetPage);
roleFilter.addEventListener("change",resetPage);
iconicFilter.addEventListener("change",resetPage);


document
.querySelectorAll(".copy-button")
.forEach(function(button){

button.addEventListener("click",async function(){

const id=button.getAttribute("data-command");

const command=$(id).textContent.trim();

try{

await navigator.clipboard.writeText(command);

const old=button.textContent;

button.textContent="¡Copiado!";

setTimeout(function(){
button.textContent=old;
},1200);

}catch(error){

alert(
"No se pudo copiar. Copia el comando manualmente."
);

}

});

});


function getCardKey(card){

return String(card.name||"")+
"|"+
String(card.element||"")+
"|"+
String(card.role||"");

}


/* ========================================
   EXPORTAR EQUIPO
======================================== */

function exportTeam(){

if(!state.selected.length){

alert("Selecciona al menos una carta.");

return;

}


const overlay=document.createElement("div");

overlay.id="dex-export-preview";

Object.assign(overlay.style,{
position:"fixed",
inset:"0",
zIndex:"999999",
background:"#050505",
overflow:"auto",
padding:"18px"
});


const cardsHTML=state.selected.map(function(card){

return `
<div style="
background:#0b0b0d;
border:1px solid #35171c;
border-radius:14px;
overflow:hidden;
box-shadow:0 8px 25px #000;
">

<img
src="${card.image||""}"
alt=""
style="
display:block;
width:100%;
aspect-ratio:3/4;
object-fit:cover;
">

<div style="
padding:11px 6px;
text-align:center;
color:#fff;
font:600 14px Arial,sans-serif;
">
${card.name||"Sin nombre"}
</div>

</div>
`;

}).join("");


overlay.innerHTML=`

<div id="dex-export-card" style="
max-width:1250px;
margin:auto;
padding:28px;
background:radial-gradient(
circle at top,
#241014 0,
#0b0809 35%,
#050505 75%
);
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

<div style="
display:flex;
align-items:center;
gap:12px;
">

<img
src="../assets/dex-logo.png"
alt="Dex"
style="
width:55px;
height:55px;
object-fit:contain;
">

<div>

<div style="
font-size:12px;
color:#a66a72;
letter-spacing:3px;
">
DEX
</div>

<div style="
font-size:25px;
font-weight:700;
">
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
">
</div>


<div style="
display:grid;
grid-template-columns:repeat(5,1fr);
gap:14px;
">

${cardsHTML}

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

<button
id="saveExport"
style="
flex:1;
padding:13px;
background:#35171c;
border:1px solid #693039;
border-radius:10px;
color:white;
font:600 14px Arial;
"
>
💾 Guardar
</button>


<button
id="closeExport"
style="
flex:1;
padding:13px;
background:#111;
border:1px solid #333;
border-radius:10px;
color:white;
font:600 14px Arial;
"
>
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


document.body.appendChild(overlay);


$("closeExport").onclick=function(){

overlay.remove();

};


$("saveExport").onclick=async function(){

try{

if(navigator.share){

await navigator.share({
title:"Dex Team",
text:"Mi equipo en Dex"
});

return;

}

}catch(error){}


alert(
"Mantén pulsada la imagen para guardarla."
);

};

}


$("downloadTeam").onclick=exportTeam;

$("printTeam").onclick=exportTeam;


loadFilters();
renderCards();
renderTeam();
updateCommands();

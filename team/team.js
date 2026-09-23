const $=id=>document.getElementById(id);
const cardsData=typeof cards!=="undefined"?cards:[];
let selected=[],currentPage=1;
const perPage=20;

const search=$("searchInput"),element=$("elementFilter"),role=$("roleFilter"),iconic=$("iconicFilter");
const grid=$("cardsGrid"),count=$("cardCount"),status=$("statusMessage");
const team=$("selectedTeam"),teamCount=$("teamCount"),prev=$("previousPage"),next=$("nextPage"),page=$("pageNumber");

function filters(){
[...new Set(cardsData.map(c=>c.element).filter(Boolean))].sort().forEach(x=>element.add(new Option(x,x)));
[...new Set(cardsData.map(c=>c.role).filter(Boolean))].sort().forEach(x=>role.add(new Option(x,x)));
}

function filtered(){
let s=search.value.toLowerCase().trim();
return cardsData.filter(c=>
(!s||String(c.name||"").toLowerCase().includes(s))&&
(element.value==="all"||c.element===element.value)&&
(role.value==="all"||c.role===role.value)&&
(iconic.value==="all"||String(!!c.iconic)===iconic.value)
);
}

function img(c,cls){
let d=document.createElement("div");
d.className=cls;
if(!c.image){
d.innerHTML='<span class="image-placeholder">Imagen no disponible</span>';
return d;
}
let i=document.createElement("img");
i.src=c.image;
i.alt=c.name||"Carta";
i.loading="lazy";
i.onerror=()=>d.innerHTML='<span class="image-placeholder">Imagen no disponible</span>';
d.appendChild(i);
return d;
}

function render(){
let list=filtered();
let pages=Math.max(1,Math.ceil(list.length/perPage));
if(currentPage>pages)currentPage=pages;
grid.innerHTML="";
list.slice((currentPage-1)*perPage,currentPage*perPage).forEach(c=>{
let a=document.createElement("article");
a.className="card"+(selected.includes(c)?" selected":"");
a.appendChild(img(c,"card-image"));
let content=document.createElement("div");
content.className="card-content";
let n=document.createElement("div");
n.className="card-name";
n.textContent=c.name||"Sin nombre";
let tags=document.createElement("div");
tags.className="card-tags";
[c.element,c.role].filter(Boolean).forEach(x=>{
let t=document.createElement("span");
t.className="card-tag";
t.textContent=x;
tags.appendChild(t);
});
content.append(n,tags);
a.appendChild(content);
if(selected.includes(c)){
let mark=document.createElement("div");
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
status.textContent=`Mostrando ${Math.min(perPage,list.length-(currentPage-1)*perPage)} de ${list.length} cartas.`;
if(!list.length)status.textContent="No se encontraron cartas.";
}

function toggle(c){
let i=selected.indexOf(c);
if(i>=0)selected.splice(i,1);
else{
if(selected.length>=5)return alert("El equipo solo puede tener 5 cartas.");
selected.push(c);
}
render();
renderTeam();
}

function renderTeam(){
teamCount.textContent=`${selected.length} / 5`;
if(!selected.length){
team.innerHTML='<div class="empty-team">Selecciona cartas para construir tu equipo.</div>';
return;
}
team.innerHTML="";
selected.forEach((c,i)=>{
let d=document.createElement("div");
d.className="team-card";
let im=img(c,"team-card-image");
let b=document.createElement("button");
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
let n=document.createElement("div");
n.className="team-card-name";
n.textContent=c.name||"Sin nombre";
d.appendChild(n);
team.appendChild(d);
});
}

prev.onclick=()=>{
if(currentPage>1){
currentPage--;
render();
scrollTo({top:0,behavior:"smooth"});
}
};

next.onclick=()=>{
let p=Math.max(1,Math.ceil(filtered().length/perPage));
if(currentPage<p){
currentPage++;
render();
scrollTo({top:0,behavior:"smooth"});
}
};

[search,element,role,iconic].forEach(x=>x.addEventListener("input",()=>{currentPage=1;render()}));
[ element,role,iconic].forEach(x=>x.addEventListener("change",()=>{currentPage=1;render()}));

filters();
render();
renderTeam();

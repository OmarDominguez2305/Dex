const $=id=>document.getElementById(id);

$("backButton").onclick=()=>{
window.location.href="../inicio.html";
};

const rarities=["Common","Uncommon","Rare","Exotic","Legendary","Mythical"];

const evolve={
"Common-Uncommon":[25000,500,1,1],
"Uncommon-Rare":[50000,750,2,1],
"Rare-Exotic":[100000,1000,3,1],
"Exotic-Legendary":[200000,2000,4,1],
"Legendary-Mythical":[250000,2500,5,1]
};

const awaken={
1:[200000,2500,5,1,1],
2:[250000,3000,5,2,1],
3:[300000,3500,5,3,1],
4:[350000,4000,5,4,1],
5:[400000,4500,5,5,1]
};

const overdrive=[2500000,10000,25,10];

const fields=[
"baseRarity","targetRarity","level","grade",
"currentAwakening","awakening","overdrive",
"gold","essence","cores","ethereal","sacs"
];

const num=id=>Math.max(0,Number($(id).value)||0);
const fmt=n=>new Intl.NumberFormat("en-US").format(n);

function calculate(){

const base=$("baseRarity").value;
const target=$("targetRarity").value;
const level=num("level");
const currentAwakening=Number($("currentAwakening").value);
const targetAwakening=Number($("awakening").value);
const od=$("overdrive").checked;

let start=rarities.indexOf(base);
let end=rarities.indexOf(target);
let need=[0,0,0,0,0];
let warnings=[];

if(end<start)
warnings.push("La rareza objetivo no puede ser inferior a la rareza actual.");

for(let i=start;i<end;i++){

const data=evolve[rarities[i]+"-"+rarities[i+1]];
if(!data)continue;

need[0]+=data[0];
need[1]+=data[1];
need[2]+=data[2];
need[4]+=data[3];

if(rarities[i]==="Legendary"&&level<100)
warnings.push("Legendary → Mythical requiere nivel 100.");
}

if(targetAwakening<currentAwakening){
warnings.push("El Awakening objetivo no puede ser inferior al Awakening actual.");
}

if(targetAwakening>currentAwakening){

if(target!=="Mythical"){
warnings.push("Awakening requiere una carta Mythical.");
}else{

for(let i=currentAwakening+1;i<=targetAwakening;i++){

const a=awaken[i];

need[0]+=a[0];
need[1]+=a[1];
need[2]+=a[2];
need[3]+=a[3];
need[4]+=a[4];

}

}
}

if(od){

if(target!=="Mythical")
warnings.push("Overdrive requiere Mythical.");

if(targetAwakening<5)
warnings.push("Overdrive requiere Awakening 5.");

if(level<150)
warnings.push("Overdrive requiere nivel 150.");

if(target==="Mythical"&&targetAwakening>=5&&level>=150){
need[0]+=overdrive[0];
need[1]+=overdrive[1];
need[2]+=overdrive[2];
need[3]+=overdrive[3];
}

}

const have=[
num("gold"),
num("essence"),
num("cores"),
num("ethereal"),
num("sacs")
];

const missing=need.map((v,i)=>Math.max(0,v-have[i]));

$("result").hidden=false;

$("path").textContent=
base+" → "+target+
(targetAwakening>currentAwakening
?" → Awakening "+currentAwakening+" → "+targetAwakening:"")+
(od?" → Overdrive":"");

const rows=[
["gn","go","gm"],
["en","eo","em"],
["cn","co","cm"],
["tn","to","tm"],
["sn","so","sm"]
];

need.forEach((v,i)=>{
$(rows[i][0]).textContent=fmt(v);
$(rows[i][1]).textContent=fmt(have[i]);
$(rows[i][2]).textContent=fmt(missing[i]);
});

$("message").className=warnings.length?"warning":"";

$("message").innerHTML=warnings.length
?warnings.map(x=>"• "+x).join("<br>")
:"Los requisitos seleccionados son válidos.";

const names=["oro","esencia","cores","Ethereal Cores","Sac"];
let missingText=[];

missing.forEach((v,i)=>{
if(v)missingText.push(fmt(v)+" "+names[i]);
});

$("summary").textContent=missingText.length
?"Te falta: "+missingText.join(", ")+"."
:"Tienes todos los recursos y Sacs necesarios.";

save();
}

function save(){

const data={};

fields.forEach(id=>{
const e=$(id);
data[id]=e.type==="checkbox"?e.checked:e.value;
});

localStorage.setItem("dex_evolve",JSON.stringify(data));
}

function load(){

const raw=localStorage.getItem("dex_evolve");
if(!raw)return;

try{

const data=JSON.parse(raw);

fields.forEach(id=>{
if(data[id]===undefined)return;

const e=$(id);

if(e.type==="checkbox")
e.checked=data[id];
else
e.value=data[id];
});

}catch(e){}

}

function clearAll(){

$("baseRarity").value="Common";
$("targetRarity").value="Legendary";
$("level").value=1;
$("grade").value="A";
$("currentAwakening").value=0;
$("awakening").value=5;
$("overdrive").checked=false;
$("gold").value=0;
$("essence").value=0;
$("cores").value=0;
$("ethereal").value=0;
$("sacs").value=0;

$("result").hidden=true;

localStorage.removeItem("dex_evolve");
}

$("calculate").onclick=calculate;
$("clear").onclick=clearAll;

fields.forEach(id=>{
$(id).addEventListener("input",calculate);
$(id).addEventListener("change",calculate);
});

load();
calculate();
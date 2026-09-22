(function(){

    const abilities = [

        {
            name:"Retaliating Armor",
            icon:"🛡️",
            type:"Defensa",
            description:
                "Cada vez que le haces daño al boss, devuelve parte de ese daño al atacante.",
            effect:
                "Refleja 25% del daño recibido a todos los atacantes.",
            counters:[
                "Opening Guard",
                "Phantom Rebound"
            ]
        },

        {
            name:"Necrotic Touch",
            icon:"💀",
            type:"Control",
            description:
                "Anula toda la curación que pueda recibir tu equipo durante la batalla.",
            effect:
                "Reduce 100% la curación recibida por el equipo.",
            counters:[
                "Remembrance"
            ]
        },

        {
            name:"Smoke Screen",
            icon:"🌫️",
            type:"Defensa",
            description:
                "El boss puede esquivar completamente tus ataques.",
            effect:
                "30% de probabilidad de evitar el daño entrante cada turno.",
            counters:[
                "True Strike"
            ]
        },

        {
            name:"Blood Harvest",
            icon:"🩸",
            type:"Supervivencia",
            description:
                "El boss se cura según el daño que inflige con cada ataque.",
            effect:
                "Cura al boss 65% del daño infligido.",
            counters:[
                "Opening Guard"
            ]
        },

        {
            name:"Overcharged Strike",
            icon:"⚡",
            type:"Ataque",
            description:
                "Cada cuatro turnos el boss realiza un ataque mucho más poderoso.",
            effect:
                "Cada 4.º turno inflige el doble de daño.",
            counters:[
                "Opening Guard",
                "Phantom Rebound"
            ]
        },

        {
            name:"Weakness Exploit",
            icon:"🎯",
            type:"Ataque",
            description:
                "El boss concentra su ataque en la carta con menos PS.",
            effect:
                "Inflige 50% más daño a la carta con menos PS.",
            counters:[
                "Guardian Angel"
            ]
        },

        {
            name:"Disruption",
            icon:"💫",
            type:"Control",
            description:
                "Una carta aleatoria queda incapacitada durante varios turnos.",
            effect:
                "Aturde una carta aleatoria durante 5 turnos cada 4 turnos.",
            counters:[]
        }

    ];

    const listView =
        document.getElementById("raidListView");

    const detailView =
        document.getElementById("raidDetailView");

    const grid =
        document.getElementById("raidAbilities");

    const count =
        document.getElementById("abilityCount");

    const detailBack =
        document.getElementById("detailBack");

    const detailIcon =
        document.getElementById("detailIcon");

    const detailName =
        document.getElementById("detailName");

    const detailDescription =
        document.getElementById("detailDescription");

    const detailEffect =
        document.getElementById("detailEffect");

    const detailCounters =
        document.getElementById("detailCounters");


    if(!grid) return;


    function showList(){

        if(listView){
            listView.style.display = "block";
        }

        if(detailView){
            detailView.style.display = "none";
        }

        window.scrollTo({
            top:0,
            behavior:"auto"
        });
    }


    function showDetail(index){

        const ability = abilities[index];

        if(!ability) return;

        if(listView){
            listView.style.display = "none";
        }

        if(detailView){
            detailView.style.display = "block";
        }

        detailIcon.textContent =
            ability.icon;

        detailName.textContent =
            ability.name;

        detailDescription.textContent =
            ability.description;

        detailEffect.textContent =
            ability.effect;

        detailCounters.innerHTML = "";


        if(ability.counters.length){

            ability.counters.forEach(function(counter){

                const item =
                    document.createElement("span");

                item.className =
                    "counter-item";

                item.textContent =
                    counter;

                detailCounters.appendChild(item);

            });

        }else{

            const empty =
                document.createElement("span");

            empty.className =
                "counter-empty";

            empty.textContent =
                "No hay una habilidad específica registrada.";

            detailCounters.appendChild(empty);
        }


        window.scrollTo({
            top:0,
            behavior:"auto"
        });
    }


    abilities.forEach(function(ability,index){

        const card =
            document.createElement("button");

        card.type = "button";

        card.className =
            "raid-list-card";


        card.innerHTML =
            '<span class="raid-list-icon">' +
                ability.icon +
            '</span>' +

            '<span class="raid-list-info">' +

                '<strong>' +
                    ability.name +
                '</strong>' +

                '<small>' +
                    ability.type +
                '</small>' +

            '</span>' +

            '<span class="raid-list-arrow">›</span>';


        card.addEventListener(
            "click",
            function(){
                showDetail(index);
            }
        );


        grid.appendChild(card);

    });


    if(count){

        count.textContent =
            abilities.length +
            " habilidades";

    }


    if(detailBack){

        detailBack.addEventListener(
            "click",
            function(){
                showList();
            }
        );

    }


    const backButton =
        document.getElementById("backButton");


    if(backButton){

        backButton.addEventListener(
            "click",
            function(){

                if(typeof dexNavigate === "function"){

                    dexNavigate("../inicio.html");

                }else{

                    window.location.href =
                        "../inicio.html";

                }

            }
        );

    }


    showList();

})();
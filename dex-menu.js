(function(){

    const button = document.getElementById("dexMenuButton");
    const topBar = document.querySelector(".top-bar");

    if(!button || !topBar) return;

    const menu = document.createElement("nav");

    menu.className = "dex-menu";

    const sections = [
        ["cartas","🃏","Cartas","cartas/cartas.html"],
        ["elementos","⚡","Elementos","elementos.html"],
        ["habilidades","✨","Habilidades","habilidades.html"],
        ["raids","⚔️","Raids","raids/raids.html"],
        ["team","👥","Team","team/team.html"],
        ["evolve","🔄","Evolve","evolve/evolve.html"],
        ["ayuda","📖","Ayuda","ayuda/ayuda.html"]
    ];

    const path = window.location.pathname.toLowerCase();

    let current = "";

    if(path.includes("/cartas/")) current = "cartas";
    else if(path.includes("/raids/")) current = "raids";
    else if(path.includes("/team/")) current = "team";
    else if(path.includes("/evolve/")) current = "evolve";
    else if(path.includes("/ayuda/")) current = "ayuda";
    else if(path.includes("elementos.html")) current = "elementos";
    else if(path.includes("habilidades.html")) current = "habilidades";

    sections.forEach(function(section){

        const link = document.createElement("a");

        link.href = getPath(section[3]);

        link.dataset.section = section[0];

        link.innerHTML =
            '<span class="dex-menu-icon">' +
            section[1] +
            '</span>' +
            '<span>' +
            section[2] +
            '</span>';

        if(current === section[0]){
            link.classList.add("active");
        }

        menu.appendChild(link);

    });

    topBar.appendChild(menu);

    button.addEventListener("click",function(event){

        event.stopPropagation();

        menu.classList.toggle("open");
        button.classList.toggle("open");

    });

    menu.addEventListener("click",function(event){
        event.stopPropagation();
    });

    document.addEventListener("click",function(){
        menu.classList.remove("open");
        button.classList.remove("open");
    });

    function getPath(target){

        const path = window.location.pathname;

        const nested =
            /\/(cartas|raids|team|evolve|ayuda)\//i.test(path);

        return nested ? "../" + target : target;

    }

})();

/* ========================================
   NAVEGACIÓN
======================================== */

function goTo(url){

    if(typeof dexNavigate === "function"){
        dexNavigate(url);
    }else{
        window.location.href = url;
    }

}



/* ========================================
   PERFIL
======================================== */

const profileButton =
    document.getElementById("profileButton");


profileButton?.addEventListener(
    "click",
    function(){

        alert(
            "El perfil estará disponible próximamente."
        );

    }
);



/* ========================================
   TARJETAS DEL MENÚ
======================================== */

const menuCards =
    document.querySelectorAll(".menu-card");


menuCards.forEach(function(card){

    card.addEventListener(
        "click",
        function(){

            const section =
                card.getAttribute("data-section");


            switch(section){

                case "cartas":

                    goTo("Cartas/cartas.html");

                    break;


                case "elementos":

                    goTo("elementos.html");

                    break;


                case "habilidades":

                    goTo("habilidades.html");

                    break;


                case "raids":

                    goTo("raids/raids.html");

                    break;


                case "team":

                    goTo("team/team.html");

                    break;


                case "evolve":

                    goTo("evolve/evolve.html");

                    break;


                case "ayuda":

                    goTo("ayuda/ayuda.html");

                    break;

            }

        }
    );

});
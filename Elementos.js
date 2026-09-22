const backButton =
    document.getElementById("backButton");


if(backButton){

    backButton.addEventListener(
        "click",
        function(){

            if(typeof dexNavigate === "function"){

                dexNavigate("inicio.html");

            }else{

                window.location.href = "inicio.html";

            }

        }
    );

}
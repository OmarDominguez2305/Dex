/* ========================================
   TRANSICIÓN GLOBAL DE PÁGINAS
======================================== */

(function(){

    const body = document.body;

    if(!body) return;


    /* ========================================
       ENTRADA
    ======================================== */

    body.classList.add("page-enter");

    requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
            body.classList.remove("page-enter");
        });
    });


    /* ========================================
       SALIDA
    ======================================== */

    function navigate(url){

        if(!url) return;

        if(
            url.startsWith("#") ||
            url.startsWith("javascript:") ||
            url.startsWith("mailto:") ||
            url.startsWith("tel:")
        ){
            return;
        }

        body.classList.add("page-exit");

        setTimeout(()=>{
            window.location.href = url;
        },250);

    }


    /* ========================================
       ENLACES
    ======================================== */

    document.addEventListener("click",function(event){

        const link = event.target.closest("a");

        if(!link) return;

        const href = link.getAttribute("href");

        if(!href) return;

        if(
            link.target === "_blank" ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
        ){
            return;
        }

        event.preventDefault();

        navigate(href);

    });


    /* ========================================
       NAVEGACIÓN GLOBAL
    ======================================== */

    window.dexNavigate = navigate;

})();

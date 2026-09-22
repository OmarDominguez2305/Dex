(function(){

    const roles = document.querySelectorAll(".role-card");
    const roleViews = document.querySelectorAll(".role-view");
    const abilityDetails = document.querySelectorAll(".ability-detail");
    const rolesSection = document.querySelector(".roles-container");
    const pageHeader = document.querySelector(".page-header");

    function hideAll(){

        roleViews.forEach(function(view){
            view.style.display = "none";
        });

        abilityDetails.forEach(function(detail){
            detail.style.display = "none";
        });

        if(rolesSection){
            rolesSection.style.display = "none";
        }

        if(pageHeader){
            pageHeader.style.display = "none";
        }
    }

    function showRoles(){

        hideAll();

        if(rolesSection){
            rolesSection.style.display = "flex";
        }

        if(pageHeader){
            pageHeader.style.display = "block";
        }

        window.scrollTo(0,0);
    }

    function showRole(roleId){

        hideAll();

        const role = document.getElementById(roleId);

        if(!role) return;

        role.style.display = "block";

        window.scrollTo(0,0);
    }

    function showAbility(abilityId){

        hideAll();

        const detail = document.getElementById(abilityId);

        if(!detail) return;

        const roleView = detail.closest(".role-view");

        if(roleView){
            roleView.style.display = "block";
        }

        detail.style.display = "block";

        window.scrollTo(0,0);
    }

    function navigate(){

        const hash = window.location.hash.replace("#","");

        if(!hash){
            showRoles();
            return;
        }

        if(hash.startsWith("role-")){
            showRole(hash);
            return;
        }

        if(hash.startsWith("ability-")){
            showAbility(hash);
            return;
        }

        showRoles();
    }

    roles.forEach(function(card){

        card.addEventListener("click",function(event){

            event.preventDefault();

            const target = card.getAttribute("href");

            if(!target) return;

            window.location.hash = target.replace("#","");

        });

    });

    document.querySelectorAll(".ability-list-card").forEach(function(card){

        card.addEventListener("click",function(event){

            event.preventDefault();

            const target = card.getAttribute("href");

            if(!target) return;

            window.location.hash = target.replace("#","");

        });

    });

    document.querySelectorAll(".inner-back").forEach(function(button){

        button.addEventListener("click",function(event){

            event.preventDefault();

            const target = button.getAttribute("href");

            if(!target) return;

            window.location.hash = target.replace("#","");

        });

    });

    window.addEventListener("hashchange",navigate);

    navigate();

})();
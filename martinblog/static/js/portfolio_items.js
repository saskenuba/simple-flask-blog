var navigationBar=document.getElementById("navigationBar");window.onload=function(){},window.addEventListener("load",function(){navigationBar.addEventListener("click",function(t){Array.from(navigationBar.children,function(t){return t.classList.remove("active")}),toggleClasses(t.target,"active"),getElementbyTagNameWithDataAttribute("div","page",t.target.dataset.page).scrollIntoView({behavior:"smooth"})})});
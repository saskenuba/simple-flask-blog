"use strict";function appendPosts(e,t){var i=[];return e.forEach(function(n){i.push("post"+n.id);var e='<article id="post'+n.id+'" class="ui basic attached segment hidden blog-post">\n        <div class="ui red ribbon label">Tags:\n        '+Object.keys(n.tags).map(function(e){return"<a href="+Flask.url_for("tags",{string:n.tags[e]})+">"+n.tags[e]+"</a>"})+'\n    </div>\n        <h2 class="ui header"> '+n.title+'\n        <div class="sub header">Postado '+n.timestamp[3].toLowerCase()+", "+n.timestamp[0]+" de "+n.timestamp[1]+", "+n.timestamp[2]+'</div>\n        </h2>\n        <img class="ui fluid image" src="'+n.imagelink+'" />\n        <p>'+n.content.substring(0,600)+'...</p>\n        <!-- Keep reading button-->\n        <a href="/post/'+n.id+"/"+n.slug+'">\n        <div class="ui darkgreen animated button" tabindex="0">\n        <div class="visible content">Continuar Lendo</div>\n        <div class="hidden content">\n        <i class="right arrow icon"></i>\n        </div>\n        </div>\n        </a>\n        <!-- End of button-->\n        </article>';t.insertAdjacentHTML("beforeend",e)}),i}function findPos(e){var n=0;if(e.offsetParent){for(;n+=e.offsetTop,e==e.offsetParent;);return[n]}}window.addEventListener("load",function(){var n=0,i=document.getElementById("main"),a=document.getElementById("showMore"),s=document.getElementById("showMoreContainer");a.addEventListener("click",function(e){toggleClasses(a,"loading"),postGetJson(void 0,3*++n,3).then(function(e){toggleClasses(a,"loading");var n=appendPosts(e,i),t=n[0];i.appendChild(s),delay(200).then(function(){document.getElementById(t).scrollIntoView({behavior:"smooth"})}),delay(1e3).then(function(){n.forEach(function(e){var n=document.getElementById(e);toggleClasses(n,"hidden","animated","fadeIn")})})})})});
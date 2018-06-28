"use strict";function appendPosts(entriesArray,elementToAppend){var idSaver=[];return entriesArray.forEach(function(elem){idSaver.push("post"+elem.id);var template='<article id="post'+elem.id+'" class="ui basic attached segment hidden blog-post">\n        <div class="ui red ribbon label">Tags:\n        '+Object.keys(elem.tags).map(function(key){return"<a href="+Flask.url_for("tags",{string:elem.tags[key]})+">"+elem.tags[key]+"</a>"})+'\n    </div>\n        <h2 class="ui header"> '+elem.title+'\n        <div class="sub header">Postado '+elem.timestamp[3].toLowerCase()+", "+elem.timestamp[0]+" de "+elem.timestamp[1]+", "+elem.timestamp[2]+'</div>\n        </h2>\n        <img class="ui fluid image" src="'+elem.imagelink+'" />\n        <p>'+elem.content.substring(0,600)+'...</p>\n        <!-- Keep reading button-->\n        <a href="/post/'+elem.id+"/"+elem.slug+'">\n        <div class="ui darkgreen animated button" tabindex="0">\n        <div class="visible content">Continuar Lendo</div>\n        <div class="hidden content">\n        <i class="right arrow icon"></i>\n        </div>\n        </div>\n        </a>\n        <!-- End of button-->\n        </article>';elementToAppend.insertAdjacentHTML("beforeend",template)}),idSaver}function findPos(obj){var curtop=0;if(obj.offsetParent){for(;curtop+=obj.offsetTop,obj==obj.offsetParent;);return[curtop]}}window.addEventListener("load",function(){var internalCounter=0,articleParent=document.getElementById("main"),buttonShowMore=document.getElementById("showMore"),buttonShowMoreContainer=document.getElementById("showMoreContainer");buttonShowMore.addEventListener("click",function(el){toggleClasses(buttonShowMore,"loading"),postGetJson("all",3*++internalCounter,3).then(function(response){toggleClasses(buttonShowMore,"loading");var appendedIDs=appendPosts(response,articleParent),firstAppendedID=appendedIDs[0];articleParent.appendChild(buttonShowMoreContainer),delay(200).then(function(){window.scroll(0,findPos(document.getElementById(firstAppendedID)))}),delay(1e3).then(function(){appendedIDs.forEach(function(elem){var currentPost=document.getElementById(elem);toggleClasses(currentPost,"hidden","animated","fadeIn")})})})})});
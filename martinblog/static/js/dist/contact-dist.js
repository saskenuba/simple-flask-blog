"use strict";function formatTelephone(e){var n=e.replace(/\W/g,"");return 11==n.length?n=n.replace(/\b(\d{2})(\d{5})-?(\d{4})/,"($1) $2-$3"):7<n.length?n=n.replace(/\b(\d{2})(\d{4})-?(\d)/,"($1) $2-$3"):6<=n.length?n=n.replace(/\b(\d{2})(\d{4})/,"($1) $2-"):n.length&&(n=n.replace(/\b(\d{2})/,"($1) ")),n}var formTelephoneInput=document.getElementById("formTelefone");window.addEventListener("load",function(){formTelephoneInput.addEventListener("input",function(t){this.addEventListener("keyup",function(e){if(8!=e.keyCode){var n=formatTelephone(t.target.value);formTelephoneInput.value=n}})});var r=document.getElementById("formSubmitButton");r.addEventListener("click",function(e){var n=document.getElementById("formNome").value,t=document.getElementById("formEmail").value,o=document.getElementById("formTelefone").value,l=document.getElementById("formMensagem").value,a={method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({formNome:n,formEmail:t,formTelefone:o,formMensagem:l})};console.log(a.body);var d=sendJson("contact",a),s=document.getElementById("messageEmailLoading");toggleClasses(s,"hidden","visible","animated","fadeIn"),toggleClasses(r,"disabled");var i=document.getElementById("messageEmailSuccess"),m=document.getElementById("messageEmailError");return delay(2e3).then(function(){d.then(function(e){return console.log(e),200==e.status?(toggleClasses(s,"fadeOut","visible","fadeIn"),delay(2e3).then(function(){toggleClasses(s,"hidden"),toggleClasses(i,"hidden","visible","animated","fadeIn")})):(toggleClasses(s,"fadeOut","visible","fadeIn"),delay(2e3).then(function(){toggleClasses(r,"disabled"),toggleClasses(s,"hidden"),toggleClasses(m,"hidden","visible","animated","fadeIn")}))})})})});
//# sourceMappingURL=contact-dist.js.map
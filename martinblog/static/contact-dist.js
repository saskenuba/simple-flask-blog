'use strict';

var formTelephoneInput = document.getElementById('formTelefone');

window.addEventListener('load', function () {
    formTelephoneInput.addEventListener('input', function (event) {
        this.addEventListener('keyup', function (key) {

            // backspace needs to be checked or content can't be erased
            if (key.keyCode != 8) {
                var result = formatTelephone(event.target.value);
                formTelephoneInput.value = result;
            }
        });
    });

    // form ajax
    var formButton = document.getElementById('formSubmitButton');
    formButton.addEventListener('click', function (event) {

        // all values from form
        var formName = document.getElementById('formNome').value;
        var formEmail = document.getElementById('formEmail').value;
        var formTelefone = document.getElementById('formTelefone').value;
        var formMensagem = document.getElementById('formMensagem').value;

        // json request
        var settings = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formName,
                email: formEmail,
                phone: formTelefone,
                message: formMensagem
            })
        };

        var serverResponse = sendJson('contact', settings);
        var messageLoading = document.getElementById('messageEmailLoading');

        // pops info up
        toggleClasses(messageLoading, 'hidden', 'visible', 'animated', 'fadeIn');

        // on success, fades info message
        var messageSuccess = document.getElementById('messageEmailSuccess');
        var messageError = document.getElementById('messageEmailError');
        return delay(2000).then(function () {

            serverResponse.then(function (response) {
                console.log(response);
                if (response.status == 200) {
                    toggleClasses(messageLoading, 'fadeOut', 'visible', 'fadeIn');
                    return delay(2000).then(function () {

                        // finally hides info, and pops success
                        toggleClasses(messageLoading, 'hidden');
                        toggleClasses(messageSuccess, 'hidden', 'visible', 'animated', 'fadeIn');
                    });
                } else {
                    toggleClasses(messageLoading, 'fadeOut', 'visible', 'fadeIn');
                    return delay(2000).then(function () {

                        // finally hides info, and pops success
                        toggleClasses(messageLoading, 'hidden');
                        toggleClasses(messageError, 'hidden', 'visible', 'animated', 'fadeIn');
                    });
                };
            });
        });
    });
});

function formatTelephone(arg) {
    var found = arg.replace(/\W/g, '');
    var escape = found;

    if (found.length == 11) {
        found = found.replace(/\b(\d{2})(\d{5})-?(\d{4})/, '($1) $2-$3');
    } else if (found.length > 7) {
        found = found.replace(/\b(\d{2})(\d{4})-?(\d)/, '($1) $2-$3');
    } else if (found.length >= 6) {
        found = found.replace(/\b(\d{2})(\d{4})/, '($1) $2-');
    } else if (found.length) found = found.replace(/\b(\d{2})/, '($1) ');
    return found;
}
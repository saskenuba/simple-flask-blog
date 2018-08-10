/// <reference path="./helper.ts" />

const formTelephoneInput = document.getElementById('formTelefone');

window.addEventListener('load', function() {
    formTelephoneInput.addEventListener('input', function(event) {
        this.addEventListener('keyup', function(key) {

            // backspace needs to be checked or content can't be erased
            if (key.keyCode != 8) {
                let result = formatTelephone(event.target.value);
                formTelephoneInput.value = result;
            }
        });
    });

    // form ajax
    const formButton = document.getElementById('formSubmitButton');
    formButton.addEventListener('click', function(event) {

        // all values from form
        const formName = document.getElementById('formNome').value;
        const formEmail = document.getElementById('formEmail').value;
        const formTelefone = document.getElementById('formTelefone').value;
        const formMensagem = document.getElementById('formMensagem').value;

        // json request
        const settings = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "formNome": formName,
                "formEmail": formEmail,
                "formTelefone": formTelefone,
                "formMensagem": formMensagem
            })
        };

        console.log(settings.body);

        const serverResponse = sendJson('contact', settings);
        const messageLoading = document.getElementById('messageEmailLoading');

        // pops info up
        toggleClasses(messageLoading, 'hidden', 'visible', 'animated', 'fadeIn');
        toggleClasses(formButton, 'disabled');

        // on success, fades info message
        const messageSuccess = document.getElementById('messageEmailSuccess');
        const messageError = document.getElementById('messageEmailError');
        return delay(2000).then(function() {

            serverResponse.then(function(response) {
                console.log(response);
                if (response.status == 200) {
                    toggleClasses(messageLoading, 'fadeOut', 'visible', 'fadeIn');
                    return delay(2000).then(function() {

                        // finally hides info, and pops success
                        toggleClasses(messageLoading, 'hidden');
                        toggleClasses(messageSuccess, 'hidden', 'visible', 'animated', 'fadeIn');
                    });
                } else {
                    toggleClasses(messageLoading, 'fadeOut', 'visible', 'fadeIn');
                    return delay(2000).then(function() {

                        // finally hides info, and pops success
                        toggleClasses(formButton, 'disabled');
                        toggleClasses(messageLoading, 'hidden');
                        toggleClasses(messageError, 'hidden', 'visible', 'animated', 'fadeIn');
                    });
                };
            });
        });
    });
});

function formatTelephone(arg) {
    let found = arg.replace(/\W/g, '');
    const escape = found;

    if (found.length == 11) {
        found = found.replace(/\b(\d{2})(\d{5})-?(\d{4})/, '($1) $2-$3');
    } else if (found.length > 7) {
        found = found.replace(/\b(\d{2})(\d{4})-?(\d)/, '($1) $2-$3');
    } else if (found.length >= 6) {
        found = found.replace(/\b(\d{2})(\d{4})/, '($1) $2-');
    } else if (found.length)
        found = found.replace(/\b(\d{2})/, '($1) ');
    return found;
}

const formTelephoneInput = document.getElementById('formTelefone');

window.addEventListener('load', function() {
    formTelephoneInput.addEventListener('input', function(event) {
        this.addEventListener('keyup', function(key) {
            if (key.keyCode != 8) {
                let result = formatTelephone(event.target.value);
                formTelephoneInput.value = result;
            }
        });
    });
});

function formatTelephone(arg) {
    let found = arg.replace(/\W/g, '');
    const escape = found;

    if (found.length == 11) {
        found = found.replace(/\b(\d{2})(\d{5})-?(\d{4})/, '($1) $2-$3');
    }
    else if (found.length > 7) {
        found = found.replace(/\b(\d{2})(\d{4})-?(\d)/, '($1) $2-$3');
    }
    else if (found.length >= 6) {
        found = found.replace(/\b(\d{2})(\d{4})/, '($1) $2-');
    }
    else if (found.length)
        found = found.replace(/\b(\d{2})/, '($1) ');

    return found;
}

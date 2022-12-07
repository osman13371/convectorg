function fixAmount(val) {
    let tmp = val.split(' ').join('');

    tmp = tmp.replace(/[^0-9\,\.]/g, '');
    tmp = tmp.replace(/\,/g, '.');
    tmp = tmp.replace(/(\..*)\./g, '$1');
    tmp = tmp.split('.');
    
    let match = tmp[0].split('').reverse().join('').match(/.{1,3}/g);
    if (match != null) {
        tmp[0] = match.join(' ').split('').reverse().join('');
    }

    if (tmp[1] != undefined) {
        tmp[1] = tmp[1].slice(0, 4);
    }
    
    if (tmp[1] != undefined && tmp[1] != '0000') {
        tmp = tmp.join('.');
    } else {
        tmp = tmp[0];
    }

    return tmp.trim();
}

function getRate(from, to) {
    return fetch(`https://api.exchangerate.host/latest?base=${ from }&symbols=${ to }`)
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            let rate = json['rates'][to];
            return rate;
        });
}

window.onload = function() {
    let conv_inputs = document.getElementsByClassName('converter-input');

    for (const inp of conv_inputs) {
        inp.addEventListener('input', function(e) {
            this.value = fixAmount(this.value);

            let from = document.getElementById('currency-from').querySelector('.currency-active');
            let to = document.getElementById('currency-to').querySelector('.currency-active');

            let from_val = from.innerText;
            let to_val = to.innerText;

            let amount = this.value.replaceAll(' ', '');
            amount = Number(amount);

            if (this.id == 'converter-from') {
                let converter_to = document.getElementById('converter-to');

                getRate(from_val, to_val)
                .then((data) => {
                    converter_to.value = fixAmount(String(amount * data));
                });
            } else if (this.id == 'converter-to') {
                let converter_from = document.getElementById('converter-from');

                getRate(to_val, from_val)
                .then((data) => {
                    converter_from.value = fixAmount(String(amount * data));
                });
            }
        });
    }

    let currencies = document.getElementsByClassName('currency');
    for (const currency of currencies) {
        currency.addEventListener('click', function(e) {
            let active_currency = this.parentNode.querySelector('.currency-active');
            active_currency.classList.remove('currency-active');
            this.classList.add('currency-active')

            let currency_info_from = document.getElementById('currency-info-from');
            let currency_info_to = document.getElementById('currency-info-to');

            let from = document.getElementById('currency-from').querySelector('.currency-active');
            let to = document.getElementById('currency-to').querySelector('.currency-active');

            let from_val = from.innerText;
            let to_val = to.innerText;

            let amount = document.getElementById('converter-from').value.replaceAll(' ', '');
            amount = Number(amount);

            let converter_to = document.getElementById('converter-to');

            getRate(from_val, to_val)
            .then((data) => {
                currency_info_from.innerText = `1 ${ from_val } = ${ fixAmount(String(data)) } ${ to_val }`;
                currency_info_to.innerText = `1 ${ to_val } = ${ fixAmount(String(1 / data)) } ${ from_val }`;
                converter_to.value = fixAmount(String(amount * data));
            });
        });        
    }
    
    let from = document.getElementById('currency-from').querySelector('.currency-active');
    from.click();
};

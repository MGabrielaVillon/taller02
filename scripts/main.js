/**
 * @file main.js
 * @description Main JavaScript file for the Coffee Sales Dashboard.
 */

// Formateador de moneda USD
const fmtUSD = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

let loadData = () => {

    try {
        fetch('https://raw.githubusercontent.com/DATA-DAWM/Datos/refs/heads/main/Coffee/Coffe_sales.xml')
            .then(response => response.text())
            .then(xml => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xml.trim(), 'application/xml');
                return doc;
            })
            .then(doc => {

                const tbody = document.getElementById('transacciones');
                if (!tbody) return console.warn('Elemento #transacciones no encontrado');
                tbody.innerHTML = '';

                let sales = doc.getElementsByTagName('sale');
                if (sales.length === 0) sales = doc.getElementsByTagName('Sale');


                if (sales.length === 0) {
                    const all = doc.getElementsByTagName('*');
                    const matches = [];
                    for (let i = 0; i < all.length; i++) {
                        const el = all[i];
                        if (el.tagName && el.tagName.toLowerCase() === 'sale') matches.push(el);
                    }
                    sales = matches;
                }

                const limit = Math.min(20, sales.length);

                const safeGet = (node, name) => {
                    if (!node) return '';

                    const variants = [name, name.charAt(0).toUpperCase() + name.slice(1)];
                    for (const v of variants) {
                        const q = node.querySelector ? node.querySelector(v) : null;
                        if (q && q.textContent) return q.textContent.trim();
                        const byTag = node.getElementsByTagName ? node.getElementsByTagName(v)[0] : null;
                        if (byTag && byTag.textContent) return byTag.textContent.trim();
                    }
                    return '';
                };

                for (let i = 0; i < limit; i++) {
                    const sale = sales[i];

                    const date = safeGet(sale, 'date');
                    const coffeeName = safeGet(sale, 'coffee_name') || safeGet(sale, 'coffeeName') || safeGet(sale, 'coffee-name');
                    let money = safeGet(sale, 'money') || safeGet(sale, 'amount') || safeGet(sale, 'value');

                    const moneyNum = parseFloat((money || '').replace(/[^0-9.-]+/g, ''));
                    const moneyText = Number.isFinite(moneyNum) ? fmtUSD.format(moneyNum) : (money || '');

                    const row = document.createElement('tr');

                    const colDate = document.createElement('td');
                    colDate.textContent = date;

                    const colCoffee = document.createElement('td');
                    colCoffee.textContent = coffeeName;

                    const colMoney = document.createElement('td');
                    colMoney.textContent = moneyText;

                    row.appendChild(colDate);
                    row.appendChild(colCoffee);
                    row.appendChild(colMoney);

                    tbody.appendChild(row);
                }

                console.log(`Se cargaron ${limit} transacciones en la tabla`);

            })
            .catch(err => console.error(err));

    } catch (err) {
        console.error(err);
    }

}

window.addEventListener('DOMContentLoaded', loadData);



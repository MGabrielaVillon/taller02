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
                console.log(doc);                
            })

    } catch (err) {
        console.error(err);
    }

}

window.addEventListener('DOMContentLoaded', loadData);
fetch('/api/entry')
.then(response => response.json())
.then(data => {
    entries = data;
    doBalance();
    doLedger();
});

document.querySelector("#submit").addEventListener("click", function(event) {
    // event.preventDefault();
    submitEntry();
});

function submitEntry() {
    const descEl = document.querySelector("#description");
    const amountEl = document.querySelector("#amount");
    const error = "";

    if (descEl.value === "" || amountEl.value === "") {
        console.log('Error: Form field missing data');
        return;
    }
    
    console.log(descEl.value / amountEl.value);

    const entry = {
        date: new Date().toISOString(),
        desc: descEl.value,
        amount: amountEl.value
    };

    // Stack onto our existing ledger
    entries.unshift(entry);

    // Update views
    doBalance();
    doLedger();

    // Update persistent database
    fetch("/api/entry", {
        method: "POST",
        body: JSON.stringify(entry),
        headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
        if (data.errors) {
            console.log("Error: invalid data ---" + JSON.stringify(data.errors));
        } else {
            descEl.value = "";
            amountEl.value = "";
        }
        })
        .catch(err => {
        // If server is unavailable, store in cache
        saveRecord(entry);

        descEl.value = "";
        amountEl.value = "";
    });    
}

function doBalance() {
    const balance = entries.reduce((total, e) => {
    return total + parseInt(e.amount);
    }, 0);

    const balanceEl = document.querySelector("#balance");
    balanceEl.textContent = '$' + balance;
}

function doLedger() {
    const descList = document.querySelector("#desc-list");
    const amountList = document.querySelector("#amount-list");

    descList.innerHTML = "";
    amountList.innerHTML = "";

    entries.forEach(entry => {
        // create and populate a table row
        const ditem = document.createElement("li");
        const aitem = document.createElement("li");

        ditem.innerHTML = `<li>${entry.desc}</li>`;
        aitem.innerHTML = `<li>${entry.amount}</li>`;

        descList.appendChild(ditem);
        amountList.appendChild(aitem);

    });
}
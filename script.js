let inputs = document.querySelectorAll("input");
let input1 = document.getElementById("inp1");
let input2 = document.getElementById("inp2");

let btngrp = document.querySelectorAll(".btngroup");

let btngrs1 = document.querySelectorAll(".btngroup1 button");
let btngrs2 = document.querySelectorAll(".btngroup2 button");
let btngrs3 = document.querySelectorAll(".btngroup3 button");

let rightp = document.getElementById("rightp");
let leftp = document.getElementById("leftp");

let error = document.getElementById("error")
let qiyb = document.querySelector(".qiyb p");
let qiys = document.querySelector(".qiys p");

let activeteref = 1
let secim1 = "AUD";
let secim2 = "USD";
let secim3 = "NEW";

let inp1;
let inp2;

exchange(input1.value, secim1, secim2, secim3, 1)

const banks = {
    ABC: {
        buy: 0.01,
        sell: -0.005,
    },

    NEW: {
        buy: 0.02,
        sell: -0.01,
    },

    AME: {
        buy: 0.015,
        sell: -0.015,
    },

    RED: {
        buy: 0.005,
        sell: -0.005,
    },
};

inputs.forEach((a) => {
    a.addEventListener("input", () => {
        let ind = a.value.indexOf('.')
        if (ind != -1) {
            let decimal = a.value.slice(ind + 1);
            if (decimal.length > 4) {
                a.value = a.value.slice(0, ind + 5);
            }
        }
        if (+a.value > 10000) {
            a.value = 10000;
        }
    });
});

btngrs1.forEach((a) => {
    a.addEventListener("click", () => {
        btngrs1.forEach((b) => {
            b.classList.remove("active");
        });
        activeteref = 1
        a.classList.add("active");
        secim1 = a.innerHTML;
        exchange(input2.value, secim2, secim1, secim3, 2)
    });
});

btngrs2.forEach((a) => {
    a.addEventListener("click", () => {
        btngrs2.forEach((b) => {
            b.classList.remove("active");
        });
        a.classList.add("active");
        secim2 = a.innerHTML;
        activeteref = 2
        exchange(input1.value, secim1, secim2, secim3, 1)
    });
});

btngrs3.forEach((a) => {
    a.addEventListener("click", () => {
        btngrs3.forEach((b) => {
            b.classList.remove("active");
        });
        a.classList.add("active");
        secim3 = a.innerHTML;
        if (activeteref == 1) {
            exchange(input1.value, secim1, secim2, secim3, 1);
        } else {
            exchange(input2.value, secim2, secim1, secim3, 2);
        }
    });
});

input1.addEventListener("input", () => {
    exchange(input1.value, secim1, secim2, secim3, 1)
    activeteref = 1
});

input2.addEventListener("input", () => {
    exchange(input2.value, secim2, secim1, secim3, 2)
    activeteref = 2
});

function exchange(qiymet, hardan, hara, bank, teref) {
    if (hardan != hara && qiymet != 0 && qiymet != "") {
        fetch(
            `https://api.frankfurter.dev/v1/latest?amount=${qiymet}&base=${hardan}&symbols=${hara}`
        )
            .then((resp) => 
                resp.json())
            .then((data) => {
                error.style.display = "none"
                qiyb.innerHTML = (qiymet - qiymet * banks[bank].buy).toFixed(2);
                qiys.innerHTML = (qiymet - qiymet * banks[bank].sell).toFixed(2);
                let rate = (data.rates[hara] / qiymet).toFixed(4);
                if (teref == 1) {
                    leftp.innerHTML = `1 ${hara} = ${rate} ${hardan}`;
                    rightp.innerHTML = `1 ${hardan} = ${rate} ${hara}`;
                    input2.value = data.rates[hara].toFixed(4);
                } else {
                    leftp.innerHTML = `1 ${hara} = ${rate} ${hardan}`;
                    rightp.innerHTML = `1 ${hardan} = ${rate} ${hara}`;
                    input1.value = data.rates[hara].toFixed(4);
                }

                localStorage.setItem(`${hardan}_${hara}`, rate);
            }).catch(() => {
                error.style.display = "inline";
                let savedRate = localStorage.getItem(`${hardan}_${hara}`);
                if (savedRate && !isNaN(savedRate)) {
                    let currentRate = Number(savedRate);
                    qiyb.innerHTML = (
                        qiymet - qiymet * banks[bank].buy
                    ).toFixed(2);
                    qiys.innerHTML = (
                        qiymet - qiymet * banks[bank].sell
                    ).toFixed(2);
                    leftp.innerHTML =
                        `1 ${hardan} = ${currentRate.toFixed(4)} ${hara}`;
                    rightp.innerHTML =
                        `1 ${hara} = ${(1 / currentRate).toFixed(4)} ${hardan}`;
                    let result = Number(qiymet) * currentRate;
                    if (teref == 1) {
                        input2.value = result.toFixed(4);
                    } else {
                        input1.value = result.toFixed(4);
                    }
                } else {
                    if (teref == 1) {
                        error.innerHTML = "Data tapılmadı";
                    } else {
                        error.innerHTML = "Data tapılmadı";
                    }
                    leftp.innerHTML = "localStorage-da məlumat yoxdur";
                    rightp.innerHTML = "localStorage-da məlumat yoxdur";
                    qiyb.innerHTML = "Data tapılmadı";
                    qiys.innerHTML = "Data tapılmadı";
                }
            })
    } else if (qiymet == "") {
        qiyb.innerHTML = "";
        qiys.innerHTML = "";
        if (teref == 1) {
            input2.value = "";
        } else {
            input1.value = "";
        }
    }

    else if (qiymet == 0) {
        qiyb.innerHTML = 0;
        qiys.innerHTML = 0;
        if (teref == 1) {
            input2.value = 0;
        } else {
            input1.value = 0;
        }
    } else {
        qiyb.innerHTML = (qiymet - qiymet * banks[bank].buy).toFixed(2);
        qiys.innerHTML = (qiymet - qiymet * banks[bank].sell).toFixed(2);
        if (teref == 1) {
            input2.value = qiymet;
        } else {
            input1.value = qiymet;
        }
    }
}
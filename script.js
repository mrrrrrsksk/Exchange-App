let inputs = document.querySelectorAll("input");
let input1 = document.getElementById("inp1");
let input2 = document.getElementById("inp2");
let btngrp = document.querySelectorAll(".btngroup");
let btngrs1 = document.querySelectorAll(".btngroup1 button");
let btngrs2 = document.querySelectorAll(".btngroup2 button");
let btngrs3 = document.querySelectorAll(".btngroup3 button");
let rightp = document.getElementById("rightp");
let leftp = document.getElementById("leftp");
let qiyb = document.querySelector(".qiyb p");
let qiys = document.querySelector(".qiys p");
let salam = document.querySelector(".salam");
let secim1 = "AUD";
let secim2 = "USD";
let secim3 = "NEW";
let inp1 = 100;
let inp2;

exchange(secim1, secim2, secim3, 100, 0);

const banks = {
    "ABC": {
        buy: 0.01,
        sell: -0.005
    },
    "NEW": {
        buy: 0.02,
        sell: -0.01
    },
    "AME": {
        buy: 0.015,
        sell: -0.015
    },
    "RED": {
        buy: 0.005,
        sell: -0.005
    }
};

inputs.forEach(a => {
    a.addEventListener("input", () => {
        a.value = a.value > 10000 ? 10000 : +a.value;
    });
});

btngrs1.forEach(a => {
    a.addEventListener("click", () => {
        btngrs1.forEach(b => {
            b.classList.remove("active");
        });
        a.classList.add("active");
        secim1 = a.innerHTML;
        exchange(secim2, secim1, secim3, input2.value, 1);
    });
});

btngrs2.forEach(a => {
    a.addEventListener("click", () => {
        btngrs2.forEach(b => {
            b.classList.remove("active");
        });
        a.classList.add("active");
        secim2 = a.innerHTML;
        exchange(secim1, secim2, secim3, input1.value, 0);
    });
});

btngrs3.forEach(a => {
    a.addEventListener("click", () => {
        btngrs3.forEach(b => {
            b.classList.remove("active");
        });
        a.classList.add("active");
        secim3 = a.innerHTML;
        exchange(secim2, secim1, secim3, input2.value, 1);
    });
});

input1.addEventListener("input", () => {
    exchange(secim1, secim2, secim3, input1.value, 0);
});

input2.addEventListener("input", () => {
    exchange(secim2, secim1, secim3, input2.value, 1);
});

function exchange(secim1, secim2, secim3, input, h) {
    if (secim1 == secim2) {
        if (h == 0) {
            input2.value = input1.value;
        } else {
            input1.value = input2.value;
        }
        rightp.innerHTML = `1 ${secim1} = 1 ${secim2}`;
        leftp.innerHTML = `1 ${secim1} = 1 ${secim2}`;
        qiyb.innerHTML =
            (input - (input * banks[secim3].buy)).toFixed(2);
        qiys.innerHTML =
            (input - (input * banks[secim3].sell)).toFixed(2);
        return;
    }
    let key = `${secim1}_${secim2}`;
    let url =
        `https://api.frankfurter.dev/v1/latest?amount=${input}&base=${secim1}&symbols=${secim2}`;
    fetch(url)
        .then((resp) => {
            if (!resp.ok) {
                throw new Error("API xətası");
            }
            return resp.json();
        })
        .then((data) => {
            salam.innerHTML = "";
            let result = data.rates[secim2];
            let rate = (result / input).toFixed(4);
            localStorage.setItem(key, JSON.stringify({
                result,
                rate
            }));
            if (h == 0) {
                input2.value = result.toFixed(4);
                rightp.innerHTML =
                    `1 ${secim1} = ${rate} ${secim2}`;
                leftp.innerHTML =
                    `1 ${secim2} = ${(1 / rate).toFixed(4)} ${secim1}`;
            } else {
                input1.value = result.toFixed(4);
                leftp.innerHTML =
                    `1 ${secim1} = ${rate} ${secim2}`;
                rightp.innerHTML =
                    `1 ${secim2} = ${(1 / rate).toFixed(4)} ${secim1}`;
            }
            qiyb.innerHTML =
                (input - (input * banks[secim3].buy)).toFixed(2);
            qiys.innerHTML =
                (input - (input * banks[secim3].sell)).toFixed(2);
        })
        .catch(() => {
            let saved = localStorage.getItem(key);
            if (saved) {
                saved = JSON.parse(saved);
                let result = saved.rate * input;
                if (h == 0) {
                    input2.value = result.toFixed(4);
                } else {
                    input1.value = result.toFixed(4);
                }
                salam.innerHTML =
                    "Offline məlumat istifadə olunur";
            }
            else {
                salam.innerHTML =
                    "API əlçatmazdır və ya xəta baş verdi";
            }
        });
}
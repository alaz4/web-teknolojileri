import { events } from "./data.js";

const listContainer = document.querySelector("#etkinlik-listesi");

function tarihFormatla(tarihStr) {
    if (!tarihStr) return "";
    const parcalar = tarihStr.split("-");
    if (parcalar.length === 3) {
        const gun = parcalar[0];
        const ay = parcalar[1] - 1;
        const yil = parcalar[2];
        const tarihObj = new Date(yil, ay, gun);
        
        return tarihObj.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }
    return tarihStr;
}

function createCard(event) {
    const okunabilirTarih = tarihFormatla(event.date);

    return `
        <article class="card">
            <h2>${event.title}</h2>
            <p><strong>Kategori:</strong> ${event.category}</p>
            <p><strong>Tarih:</strong> ${okunabilirTarih} - ${event.time}</p>
            <p><strong>Mekan:</strong> ${event.location}</p>
            <p>${event.description}</p>
            <a href="etkinlikdetay1.html?id=${event.id}" class="btn-detail">Detayları Gör</a>
        </article>
    `;
}

function render(dizi) {
    if (!listContainer) return;
    listContainer.innerHTML = dizi.map(createCard).join("");
}

// Sayfa yüklendiğinde çalışacak ana kontrol
if (listContainer) {
    if (listContainer.dataset && listContainer.dataset.limit) {
        // Ana Sayfa için (data-limit var ise)
        const limit = Number(listContainer.dataset.limit);
        const yaklasan = [...events]
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, limit);
        
        render(yaklasan);
    } else {
        // Etkinlikler Sayfası için (data-limit yok ise)
        render(events);
    }
}
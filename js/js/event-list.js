// 1. data.js'den etkinlik verilerini alıyoruz
import { events } from "./data.js";

// 2. Sayfadaki container'ı (section) buluyoruz
const listContainer = document.querySelector("#etkinlik-listesi");

// 3. Tarihi "12 Ekim 2026" formatına dönüştüren yardımcı fonksiyon
function tarihFormatla(tarihStr) {
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

// 4. Tek bir etkinlik nesnesinden HTML kartı üreten fonksiyon
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

// 5. Dizideki etkinlikleri ekrana çizen fonksiyon
function render(dizi) {
    if (!listContainer) return;
    listContainer.innerHTML = dizi.map(createCard).join("");
}

// 6. ADIM 5 AKIŞI: Sayfa yüklendiğinde çalışacak mantık
if (listContainer) {
    if (listContainer.dataset.limit) {
        // Eğer data-limit="2" varsa (Ana Sayfa)
        const yaklasan = [...events]
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, Number(listContainer.dataset.limit));
        
        render(yaklasan);
    } else {
        // Limit yoksa tüm liste gösterilsin (Etkinlikler Sayfası)
        render(events);
    }
}
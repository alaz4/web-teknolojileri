import { events } from "./data.js";

const listContainer = document.querySelector("#etkinlik-listesi");
const aramaInput = document.querySelector("#arama");
const kategoriSelect = document.querySelector("#kategori-filtre");
const sonucSatiri = document.querySelector("#sonuc");
const filtreFormu = document.querySelector("#filtre-formu");

// 1. Tarihi "12 Ekim 2026" formatına dönüştüren fonksiyon
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

// 2. Tek bir etkinlik nesnesinden HTML kartı üreten fonksiyon
function createCard(event) {
    const okunabilirTarih = tarihFormatla(event.date);

    return `
        <article class="card">
            2. ${event.title}</h2>
            <p><strong>Kategori:</strong> ${event.category}</p>
            <p><strong>Tarih:</strong> ${okunabilirTarih} - ${event.time}</p>
            <p><strong>Mekan:</strong> ${event.location}</p>
            <p>${event.description}</p>
            <a href="etkinlikdetay1.html?id=${event.id}" class="btn-detail">Detayları Gör</a>
        </article>
    `;
}

// 3. Kartları ekrana basan fonksiyon
function render(dizi) {
    if (!listContainer) return;

    if (dizi.length === 0) {
        listContainer.innerHTML = "<p>Aramanızla eşleşen etkinlik bulunamadı.</p>";
    } else {
        listContainer.innerHTML = dizi.map(createCard).join("");
    }
}

// 4. Kategori seçeneklerini veriden üret (new Set)
function kategorileriYukle() {
    if (!kategoriSelect) return;

    const kategoriler = [...new Set(events.map(e => e.category))];

    kategoriler.forEach(kategori => {
        const option = document.createElement("option");
        option.value = kategori;
        option.textContent = kategori;
        kategoriSelect.appendChild(option);
    });
}

// 5. Canlı Filtreleme Fonksiyonu
function filtrele() {
    // Türkçe karakter duyarlı küçük harf dönüşümü
    const aranan = aramaInput ? aramaInput.value.toLocaleLowerCase("tr-TR").trim() : "";
    const secilenKategori = kategoriSelect ? kategoriSelect.value : "";

    const sonuc = events.filter(e => {
        const metinUyuyor = 
            e.title.toLocaleLowerCase("tr-TR").includes(aranan) ||
            e.description.toLocaleLowerCase("tr-TR").includes(aranan) ||
            e.location.toLocaleLowerCase("tr-TR").includes(aranan);

        const kategoriUyuyor = secilenKategori === "" || e.category === secilenKategori;

        return metinUyuyor && kategoriUyuyor;
    });

    render(sonuc);

    // Sonuç sayısını yazdır
    if (sonucSatiri) {
        if (sonuc.length === 0) {
            sonucSatiri.textContent = "Hiç etkinlik bulunamadı.";
        } else {
            sonucSatiri.textContent = `${sonuc.length} etkinlik listeleniyor.`;
        }
    }
}

// 6. Başlatıcı ve Olay Dinleyicileri (Event Listeners)
if (listContainer) {
    if (listContainer.dataset && listContainer.dataset.limit) {
        // Ana Sayfa (sadece data-limit kadar göster)
        const limit = Number(listContainer.dataset.limit);
        const yaklasan = [...events]
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, limit);
        
        render(yaklasan);
    } else {
        // Etkinlikler Sayfası (Filtreleme Aktif)
        kategorileriYukle();
        render(events);

        if (sonucSatiri) {
            sonucSatiri.textContent = `${events.length} etkinlik listeleniyor.`;
        }

        // Enter'a basıldığında formun sayfayı yenilemesini engelle
        if (filtreFormu) {
            filtreFormu.addEventListener("submit", (e) => e.preventDefault());
        }

        // Olay Dinleyicileri
        if (aramaInput) aramaInput.addEventListener("input", filtrele);
        if (kategoriSelect) kategoriSelect.addEventListener("change", filtrele);
    }
}
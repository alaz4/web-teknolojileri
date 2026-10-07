import { events } from "./data.js";

const listContainer = document.querySelector("#etkinlik-listesi");
const aramaInput = document.querySelector("#arama");
const kategoriSelect = document.querySelector("#kategori-filtre");
const sonucText = document.querySelector("#sonuc");

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
            <h2>${event.title}</h2>
            <p><strong>Kategori:</strong> ${event.category}</p>
            <p><strong>Tarih:</strong> ${okunabilirTarih} - ${event.time}</p>
            <p><strong>Mekan:</strong> ${event.location}</p>
            <p>${event.description}</p>
            <a href="etkinlikdetay1.html?id=${event.id}" class="btn-detail">Detayları Gör</a>
        </article>
    `;
}

// 3. Kartları ekrana basan ve sonuç sayısını yazdıran fonksiyon
function render(dizi) {
    if (!listContainer) return;

    if (dizi.length === 0) {
        listContainer.innerHTML = "<p>Aramanızla eşleşen etkinlik bulunamadı.</p>";
    } else {
        listContainer.innerHTML = dizi.map(createCard).join("");
    }

    // Sonuc metnini güncelle (örneğin: "6 etkinlik listeleniyor.")
    if (sonucText) {
        sonucText.innerText = `${dizi.length} etkinlik listeleniyor.`;
    }
}

// 4. Kategori Seçim Kutusu İçi Dinamik Doldurma (Set Kullanımı)
function kategorileriDoldur() {
    if (!kategoriSelect) return;
    
    // data.js içindeki benzersiz kategorileri alıyoruz
    const kategoriler = [...new Set(events.map(e => e.category))];
    
    kategoriler.forEach(kategori => {
        const option = document.createElement("option");
        option.value = kategori;
        option.textContent = kategori;
        kategoriSelect.appendChild(option);
    });
}

// 5. Canlı Filtreleme Fonksiyonu (Arama + Kategori)
function filtrele() {
    const aramaMetni = aramaInput ? aramaInput.value.toLowerCase().trim() : "";
    const secilenKategori = kategoriSelect ? kategoriSelect.value : "";

    const filtrelenmis = events.filter(event => {
        // Arama metni başlıkta, açıklamada veya mekanda geçiyor mu?
        const metineUyuyor = 
            event.title.toLowerCase().includes(aramaMetni) ||
            event.description.toLowerCase().includes(aramaMetni) ||
            event.location.toLowerCase().includes(aramaMetni);

        // Kategori seçimi uyuyor mu?
        const kategoriyeUyuyor = secilenKategori === "" || event.category === secilenKategori;

        return metineUyuyor && kategoriyeUyuyor;
    });

    render(filtrelenmis);
}

// 6. Sayfa Yüklendiğinde Olay Dinleyicilerini Bağlama
if (listContainer) {
    if (listContainer.dataset && listContainer.dataset.limit) {
        // Ana Sayfa için (sadece yaklasan 2 etkinlik)
        const limit = Number(listContainer.dataset.limit);
        const yaklasan = [...events]
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, limit);
        
        render(yaklasan);
    } else {
        // Etkinlikler Sayfası için (Filtreleme Aktif)
        kategorileriDoldur();
        render(events);

        // Arama kutusuna her harf yazıldığında veya silindiğinde filtrelersin
        if (aramaInput) aramaInput.addEventListener("input", filtrele);
        if (kategoriSelect) kategoriSelect.addEventListener("change", filtrele);
    }
}
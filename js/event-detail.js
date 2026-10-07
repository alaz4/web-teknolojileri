import { events } from "./data.js";

const container = document.querySelector("#detay");

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

if (container) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    const event = events.find(e => e.id === id);

    if (!event) {
        document.title = "Etkinlik Bulunamadı";
        container.innerHTML = `
            <div style="background-color: #fee2e2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; color: #991b1b; margin-top: 20px;">
                <h2>⚠️ Etkinlik Bulunamadı</h2>
                <p>Aradığınız etkinlik sistemde mevcut değil veya kaldırılmış olabilir.</p>
                <a href="etkinlikler.html" style="color: #b91c1c; font-weight: bold; text-decoration: underline;">← Tüm Etkinlikler Listesine Dön</a>
            </div>
        `;
    } else {
        document.title = event.title;
        const okunabilirTarih = tarihFormatla(event.date);

        container.innerHTML = `
            <article class="card">
                <h1>🎉 ${event.title}</h1>
                <hr style="margin: 15px 0;">
                
                <dl style="display: grid; grid-template-columns: auto 1fr; gap: 10px 20px; align-items: center;">
                    <dt><strong>Kategori:</strong></dt>
                    <dd>${event.category}</dd>

                    <dt><strong>Tarih & Saat:</strong></dt>
                    <dd>${okunabilirTarih} - ${event.time}</dd>

                    <dt><strong>Mekan:</strong></dt>
                    <dd>${event.location}</dd>

                    <dt><strong>Kontenjan:</strong></dt>
                    <dd>${event.capacity} Kişi</dd>

                    <dt><strong>Açıklama:</strong></dt>
                    <dd>${event.description}</dd>
                </dl>

                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <a href="etkinlikler.html" class="btn-detail">← Listeye Dön</a>
                    <!-- ADIM 11: Güncelleme Sayfası Linki -->
                    <a href="etkinlikdegisiklik.html?id=${event.id}" class="btn-detail" style="background-color: #d97706;">✏️ Bu Etkinliği Güncelle</a>
                </div>
            </article>
        `;
    }
}
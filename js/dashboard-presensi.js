document.addEventListener('DOMContentLoaded', () => {
    const kehadiranTbody = document.getElementById('kehadiran-tbody');
    const summaryTbody = document.getElementById('summary-tbody');
    const API_URL = 'https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/kehadiran';

    // Fetch data from the API and populate the table
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            data.forEach(record => {
                const date = new Date(record.CreatedAt).toLocaleDateString();
                const name = record.Lokasi.nama;
                const status = record.IsMasuk ? 'Hadir' : 'Tidak Hadir';
                addKehadiranRecord(date, name, status);
            });
            updateSummary();
        })
        .catch(error => console.error('Error fetching data:', error));

    function addKehadiranRecord(date, name, status) {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td class="py-2 px-4 border">${date}</td>
                <td class="py-2 px-4 border">${name}</td>
                <td class="py-2 px-4 border">${status}</td>
                <td class="py-2 px-4 border">
                    <button class="edit-btn py-1 px-3 bg-yellow-500 text-white rounded mr-2">Edit</button>
                    <button class="delete-btn py-1 px-3 bg-red-500 text-white rounded">Delete</button>
                </td>
            `;
        kehadiranTbody.appendChild(row);
    }

    function updateSummary() {
        const summary = {};
        Array.from(kehadiranTbody.children).forEach(row => {
            const date = row.children[0].textContent;
            const name = row.children[1].textContent;
            const status = row.children[2].textContent;

            if (!summary[date]) {
                summary[date] = {};
            }
            if (!summary[date][name]) {
                summary[date][name] = status;
            }
        });

        for (const [date, names] of Object.entries(summary)) {
            for (const [name, status] of Object.entries(names)) {
                const summaryRow = document.createElement('tr');
                summaryRow.innerHTML = `
                        <td class="py-2 px-4 border">${date}</td>
                        <td class="py-2 px-4 border">${name}</td>
                        <td class="py-2 px-4 border">${status}</td>
                    `;
                summaryTbody.appendChild(summaryRow);
            }
        }
    }
});
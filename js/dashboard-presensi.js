document.addEventListener('DOMContentLoaded', () => {
    const kehadiranForm = document.getElementById('kehadiran-form');
    const kehadiranTbody = document.getElementById('kehadiran-tbody');
    const summaryTbody = document.getElementById('summary-tbody');
    const API_URL = 'https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/kehadiran';

    let editingRow = null;

    // Fetch kehadiran data dari backend dan untuk ditampilkan
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            data.forEach(record => {
                addKehadiranRecord(record.date, record.name, record.subject, record.status);
            });
            updateSummary();
        })
        .catch(error => console.error('Error fetching kehadiran data:', error));

    kehadiranForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const date = document.getElementById('date').value;
        const name = document.getElementById('name').value;
        const subject = document.getElementById('subject').value;
        const status = document.getElementById('status').value;

        if (date && name && subject && status) {
            const record = { date, name, subject, status };

            if (editingRow) {
                updateKehadiranRecord(editingRow, record);
                editingRow = null;
            } else {
                addKehadiranRecord(date, name, subject, status);
            }

            // Send the new record to the backend
            fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(record)
            }).catch(error => console.error('Error sending kehadiran data:', error));

            updateSummary();
            kehadiranForm.reset();
        }
    });

    function addKehadiranRecord(date, name, subject, status) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4 border">${date}</td>
            <td class="py-2 px-4 border">${name}</td>
            <td class="py-2 px-4 border">${subject}</td>
            <td class="py-2 px-4 border">${status}</td>
            <td class="py-2 px-4 border">
                <button class="edit-btn py-1 px-3 bg-blue-500 text-white rounded mr-2">Edit</button>
                <button class="delete-btn py-1 px-3 bg-red-500 text-white rounded">Delete</button>
            </td>
        `;
        row.querySelector('.edit-btn').addEventListener('click', () => editKehadiranRecord(row));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteKehadiranRecord(row));
        kehadiranTbody.appendChild(row);
    }

    function updateKehadiranRecord(row, record) {
        row.children[0].textContent = record.date;
        row.children[1].textContent = record.name;
        row.children[2].textContent = record.subject;
        row.children[3].textContent = record.status;

        // Send the updated record to the backend
        fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        }).catch(error => console.error('Error updating kehadiran data:', error));
    }

    function editKehadiranRecord(row) {
        const date = row.children[0].textContent;
        const name = row.children[1].textContent;
        const subject = row.children[2].textContent;
        const status = row.children[3].textContent;

        document.getElementById('date').value = date;
        document.getElementById('name').value = name;
        document.getElementById('subject').value = subject;
        document.getElementById('status').value = status;

        editingRow = row;
    }

    function deleteKehadiranRecord(row) {
        const date = row.children[0].textContent;
        const name = row.children[1].textContent;
        const subject = row.children[2].textContent;

        // Send the delete request to the backend
        fetch(`${API_URL}?date=${date}&name=${name}&subject=${subject}`, {
            method: 'DELETE',
        }).catch(error => console.error('Error deleting kehadiran data:', error));

        row.remove();
        updateSummary();
    }

    function updateSummary() {
        const summary = {};
        Array.from(kehadiranTbody.children).forEach(row => {
            const date = row.children[0].textContent;
            const name = row.children[1].textContent;
            const subject = row.children[2].textContent;
            const status = row.children[3].textContent;

            if (!summary[date]) {
                summary[date] = {};
            }
            if (!summary[date][name]) {
                summary[date][name] = {};
            }
            if (!summary[date][name][subject]) {
                summary[date][name][subject] = { hadir: 0, telat: 0, alpa: 0, izin: 0, sakit: 0 };
            }
            summary[date][name][subject][status.toLowerCase()]++;
        });

        summaryTbody.innerHTML = '';
        for (const date in summary) {
            for (const name in summary[date]) {
                for (const subject in summary[date][name]) {
                    const summaryRow = document.createElement('tr');
                    summaryRow.innerHTML = `
                        <td class="py-2 px-4 border">${date}</td>
                        <td class="py-2 px-4 border">${name}</td>
                        <td class="py-2 px-4 border">${subject}</td>
                        <td class="py-2 px-4 border">
                            Hadir: ${summary[date][name][subject].hadir}, Terlambat: ${summary[date][name][subject].telat}, Alpa: ${summary[date][name][subject].alpa}, Izin: ${summary[date][name][subject].izin}, Sakit: ${summary[date][name][subject].sakit}
                        </td>
                        <td class="py-2 px-4 border">
                            <button class="edit-btn py-1 px-3 bg-blue-500 text-white rounded mr-2">Edit</button>
                            <button class="delete-btn py-1 px-3 bg-red-500 text-white rounded">Delete</button>
                        </td>
                    `;
                    summaryRow.querySelector('.edit-btn').addEventListener('click', () => editKehadiranRecord(summaryRow));
                    summaryRow.querySelector('.delete-btn').addEventListener('click', () => deleteKehadiranRecord(summaryRow));
                    summaryTbody.appendChild(summaryRow);
                }
            }
        }
    }
});

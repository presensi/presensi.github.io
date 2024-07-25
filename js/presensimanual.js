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
            console.log(data); // Tambahkan log untuk memeriksa data
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
                <button class="edit-button py-1 px-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Edit</button>
                <button class="delete-button py-1 px-2 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
            </td>
        `;
        kehadiranTbody.appendChild(row);

        row.querySelector('.edit-button').addEventListener('click', () => {
            document.getElementById('date').value = date;
            document.getElementById('name').value = name;
            document.getElementById('subject').value = subject;
            document.getElementById('status').value = status;
            editingRow = row;
        });

        row.querySelector('.delete-button').addEventListener('click', () => {
            row.remove();
            deleteKehadiranRecord({ date, name, subject, status });
            updateSummary();
        });
    }

    function updateKehadiranRecord(row, record) {
        row.innerHTML = `
            <td class="py-2 px-4 border">${record.date}</td>
            <td class="py-2 px-4 border">${record.name}</td>
            <td class="py-2 px-4 border">${record.subject}</td>
            <td class="py-2 px-4 border">${record.status}</td>
            <td class="py-2 px-4 border">
                <button class="edit-button py-1 px-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Edit</button>
                <button class="delete-button py-1 px-2 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
            </td>
        `;

        row.querySelector('.edit-button').addEventListener('click', () => {
            document.getElementById('date').value = record.date;
            document.getElementById('name').value = record.name;
            document.getElementById('subject').value = record.subject;
            document.getElementById('status').value = record.status;
            editingRow = row;
        });

        row.querySelector('.delete-button').addEventListener('click', () => {
            row.remove();
            deleteKehadiranRecord(record);
            updateSummary();
        });
    }

    function deleteKehadiranRecord(record) {
        fetch(`${API_URL}/${record.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        }).catch(error => console.error('Error deleting kehadiran data:', error));
    }

    function updateSummary() {
        const summary = {};
        const rows = kehadiranTbody.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const date = cells[0].textContent.trim();
            const name = cells[1].textContent.trim();
            const subject = cells[2].textContent.trim();
            const status = cells[3].textContent.trim();

            if (!summary[date]) {
                summary[date] = {};
            }

            if (!summary[date][subject]) {
                summary[date][subject] = { hadir: 0, telat: 0, alpa: 0, izin: 0, sakit: 0 };
            }

            summary[date][subject][status]++;
        });

        summaryTbody.innerHTML = '';

        Object.keys(summary).forEach(date => {
            Object.keys(summary[date]).forEach(subject => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-2 px-4 border">${date}</td>
                    <td class="py-2 px-4 border">${subject}</td>
                    <td class="py-2 px-4 border">Hadir: ${summary[date][subject].hadir}, Terlambat: ${summary[date][subject].telat}, Alpa: ${summary[date][subject].alpa}, Izin: ${summary[date][subject].izin}, Sakit: ${summary[date][subject].sakit}</td>
                `;
                summaryTbody.appendChild(row);
            });
        });
    }
});

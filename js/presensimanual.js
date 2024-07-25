document.addEventListener('DOMContentLoaded', () => {
    const API_URL ='https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/kehadiran';
    const form = document.getElementById('kehadiran-form');
    const kehadiranTbody = document.getElementById('kehadiran-tbody');
    const summaryTbody = document.getElementById('summary-tbody');
    let editingRow = null;

    // Fetch initial data
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            data.forEach(record => addKehadiranRecord(record));
            updateSummary();
        })
        .catch(error => console.error('Error fetching kehadiran data:', error));

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const date = document.getElementById('date').value;
        const name = document.getElementById('name').value;
        const subject = document.getElementById('subject').value;
        const status = document.getElementById('status').value;

        const kehadiranRecord = { date, name, subject, status };

        if (editingRow) {
            // Update record
            const recordId = editingRow.dataset.id;
            kehadiranRecord.id = recordId;
            fetch(`${API_URL}/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(kehadiranRecord)
            })
            .then(response => response.json())
            .then(updatedRecord => {
                updateKehadiranRecord(editingRow, updatedRecord);
                editingRow = null;
                form.reset();
                updateSummary();
            })
            .catch(error => console.error('Error updating kehadiran record:', error));
        } else {
            // Create new record
            fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(kehadiranRecord)
            })
            .then(response => response.json())
            .then(newRecord => {
                addKehadiranRecord(newRecord);
                form.reset();
                updateSummary();
            })
            .catch(error => console.error('Error creating kehadiran record:', error));
        }
    });

    function addKehadiranRecord({ id, date, name, subject, status }) {
        const row = document.createElement('tr');
        row.dataset.id = id;
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
            fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                row.remove();
                updateSummary();
            })
            .catch(error => console.error('Error deleting kehadiran record:', error));
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
            fetch(`${API_URL}/${record.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                row.remove();
                updateSummary();
            })
            .catch(error => console.error('Error deleting kehadiran record:', error));
        });
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
                summary[date][subject] = { hadir: 0, terlambat: 0, alpa: 0, izin: 0, sakit: 0 };
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
                    <td class="py-2 px-4 border">Hadir: ${summary[date][subject].hadir}, Terlambat: ${summary[date][subject].terlambat}, Alpa: ${summary[date][subject].alpa}, Izin: ${summary[date][subject].izin}, Sakit: ${summary[date][subject].sakit}</td>
                `;
                summaryTbody.appendChild(row);
            });
        });
    }
});

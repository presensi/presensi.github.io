document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/kehadiran';
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
            kehadiranRecord._id = recordId;
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

    function addKehadiranRecord({ _id, date, name, subject, status }) {
        const row = document.createElement('tr');
        row.dataset.id = _id;
        row.innerHTML = `
            <td class="py-2 px-4 border">${date}</td>
            <td class="py-2 px-4 border">${name}</td>
            <td class="py-2 px-4 border">${subject}</td>
            <td class="py-2 px-4 border">${status}</td>
            <td class="py-2 px-4 border">
                <button class="edit-button py-1 px-2 bg-blue-900 text-white rounded hover:bg-blue-600">Edit</button>
                <button class="delete-button py-1 px-2 bg-red-900 text-white rounded hover:bg-red-600">Delete</button>
            </td>
        `;
        kehadiranTbody.appendChild(row);
    }

    function updateKehadiranRecord(row, { date, name, subject, status }) {
        row.innerHTML = `
            <td class="py-2 px-4 border">${date}</td>
            <td class="py-2 px-4 border">${name}</td>
            <td class="py-2 px-4 border">${subject}</td>
            <td class="py-2 px-4 border">${status}</td>
            <td class="py-2 px-4 border">
                <button class="edit-button py-1 px-2 bg-blue-900 text-white rounded hover:bg-blue-600">Edit</button>
                <button class="delete-button py-1 px-2 bg-red-900 text-white rounded hover:bg-red-600">Delete</button>
            </td>
        `;
    }

    kehadiranTbody.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-button')) {
            editingRow = event.target.closest('tr');
            const recordId = editingRow.dataset.id;
            fetch(`${API_URL}/${recordId}`)
                .then(response => response.json())
                .then(record => {
                    document.getElementById('date').value = record.date;
                    document.getElementById('name').value = record.name;
                    document.getElementById('subject').value = record.subject;
                    document.getElementById('status').value = record.status;
                })
                .catch(error => console.error('Error fetching kehadiran record:', error));
        } else if (event.target.classList.contains('delete-button')) {
            const row = event.target.closest('tr');
            const recordId = row.dataset.id;
            fetch(`${API_URL}/${recordId}`, {
                method: 'DELETE'
            })
            .then(() => {
                row.remove();
                updateSummary();
            })
            .catch(error => console.error('Error deleting kehadiran record:', error));
        }
    });

    function updateSummary() {
        summaryTbody.innerHTML = ''; // Clear previous summary

        const summary = {};

        kehadiranTbody.querySelectorAll('tr').forEach(row => {
            const date = row.cells[0].textContent;
            const name = row.cells[1].textContent;
            const subject = row.cells[2].textContent;
            const status = row.cells[3].textContent;

            if (!summary[date]) {
                summary[date] = {};
            }

            if (!summary[date][name]) {
                summary[date][name] = { subject, status };
            } else {
                summary[date][name] = { ...summary[date][name], subject, status };
            }
        });

        Object.keys(summary).forEach(date => {
            Object.keys(summary[date]).forEach(name => {
                const record = summary[date][name];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-2 px-4 border">${date}</td>
                    <td class="py-2 px-4 border">${name}</td>
                    <td class="py-2 px-4 border">${record.subject}</td>
                    <td class="py-2 px-4 border">${record.status}</td>
                `;
                summaryTbody.appendChild(row);
            });
        });
    }
});

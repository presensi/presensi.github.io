document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '/cekin/data/kehadiran';
    const kehadiranForm = document.getElementById('kehadiran-form');
    const kehadiranTbody = document.getElementById('kehadiran-tbody');
    const summaryTbody = document.getElementById('summary-tbody');
    let editingRow = null;

    // Fetch and display kehadiran records
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data); // Debugging statement
            data.forEach(record => {
                addKehadiranRecord(record);
            });
            updateSummary();
        })
        .catch(error => console.error('Error fetching kehadiran records:', error));

    // Handle form submission
    kehadiranForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(kehadiranForm);
        const record = {
            date: formData.get('date'),
            name: formData.get('name'),
            subject: formData.get('subject'),
            status: formData.get('status')
        };

        console.log('Form data:', record); // Debugging statement

        if (editingRow) {
            const recordId = editingRow.dataset.id;
            fetch(`${API_URL}/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(record)
            })
            .then(response => response.json())
            .then(updatedRecord => {
                console.log('Updated record:', updatedRecord); // Debugging statement
                updateKehadiranRecord(editingRow, updatedRecord);
                editingRow = null;
                kehadiranForm.reset();
                updateSummary();
            })
            .catch(error => console.error('Error updating kehadiran record:', error));
        } else {
            fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(record)
            })
            .then(response => response.json())
            .then(newRecord => {
                console.log('New record:', newRecord); // Debugging statement
                addKehadiranRecord(newRecord);
                kehadiranForm.reset();
                updateSummary();
            })
            .catch(error => console.error('Error adding kehadiran record:', error));
        }
    });

    function addKehadiranRecord(record) {
        const row = document.createElement('tr');
        row.dataset.id = record.id;
        row.innerHTML = `
            <td class="py-2 px-4 border">${record.date || 'undefined'}</td>
            <td class="py-2 px-4 border">${record.name || 'undefined'}</td>
            <td class="py-2 px-4 border">${record.subject || 'undefined'}</td>
            <td class="py-2 px-4 border">${record.status || 'undefined'}</td>
            <td class="py-2 px-4 border">
                <button class="edit-button py-1 px-2 bg-blue-900 text-white rounded hover:bg-blue-600">Edit</button>
                <button class="delete-button py-1 px-2 bg-red-900 text-white rounded hover:bg-red-600">Delete</button>
            </td>
        `;
        kehadiranTbody.appendChild(row);
    }

    function updateKehadiranRecord(row, { date, name, subject, status }) {
        row.innerHTML = `
            <td class="py-2 px-4 border">${date || 'undefined'}</td>
            <td class="py-2 px-4 border">${name || 'undefined'}</td>
            <td class="py-2 px-4 border">${subject || 'undefined'}</td>
            <td class="py-2 px-4 border">${status || 'undefined'}</td>
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
                    console.log('Editing record:', record); // Debugging statement
                    document.getElementById('date').value = record.date || '';
                    document.getElementById('name').value = record.name || '';
                    document.getElementById('subject').value = record.subject || '';
                    document.getElementById('status').value = record.status || '';
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

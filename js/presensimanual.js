document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/kehadiran';
    const kehadiranForm = document.getElementById('kehadiran-form');
    const kehadiranTbody = document.getElementById('kehadiran-tbody');
    const submitBtn = document.getElementById('submitBtn');
    const updateBtn = document.getElementById('updateBtn');

    let editingRow = null;

    // Fetch all kehadiran records
    function fetchAllKehadiran() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    data.forEach(kehadiran => {
                        const row = createKehadiranRow(kehadiran);
                        kehadiranTbody.appendChild(row);
                    });
                } else {
                    console.error('Failed to fetch kehadiran', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Create a table row for kehadiran record
    function createKehadiranRow(kehadiran) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4 border">${kehadiran.name}</td>
            <td class="py-2 px-4 border">${kehadiran.date}</td>
            <td class="py-2 px-4 border">${kehadiran.subject}</td>
            <td class="py-2 px-4 border">${kehadiran.status}</td>
            <td class="py-2 px-4 border">
                <button class="edit-btn py-1 px-2 bg-green-500 text-white rounded">Edit</button>
                <button class="delete-btn py-1 px-2 bg-red-500 text-white rounded">Delete</button>
            </td>
        `;
        row.querySelector('.edit-btn').addEventListener('click', () => editKehadiranRecord(row));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteKehadiranRecord(row));
        return row;
    }

    // Handle form submission for new or updated kehadiran
    kehadiranForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const subject = document.getElementById('subject').value;
        const status = document.getElementById('status').value;

        if (name && date && subject && status) {
            const kehadiran = { name, date, subject, status };
            if (editingRow) {
                updateKehadiranRecord(kehadiran);
            } else {
                addKehadiranRecord(kehadiran);
            }
            kehadiranForm.reset();
            resetForm();
        }
    });

    // Add a new kehadiran record
    function addKehadiranRecord(kehadiran) {
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(kehadiran)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Data kehadiran berhasil disimpan') {
                const row = createKehadiranRow(kehadiran);
                kehadiranTbody.appendChild(row);
            } else {
                console.error('Failed to add kehadiran', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Update an existing kehadiran record
    function updateKehadiranRecord(kehadiran) {
        if (!kehadiran || !kehadiran.name || !kehadiran.date || !kehadiran.subject || !kehadiran.status) {
            console.error('Invalid kehadiran data:', kehadiran);
            return;
        }

        fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(kehadiran)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Failed to update kehadiran');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'Data kehadiran berhasil diperbarui') {
                if (editingRow) {
                    editingRow.children[0].textContent = kehadiran.name;
                    editingRow.children[1].textContent = kehadiran.date;
                    editingRow.children[2].textContent = kehadiran.subject;
                    editingRow.children[3].textContent = kehadiran.status;
                    editingRow = null;
                }
            } else {
                console.error('Failed to update kehadiran', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Edit a kehadiran record
    function editKehadiranRecord(row) {
        const name = row.children[0].textContent;
        const date = row.children[1].textContent;
        const subject = row.children[2].textContent;
        const status = row.children[3].textContent;

        document.getElementById('name').value = name;
        document.getElementById('date').value = date;
        document.getElementById('subject').value = subject;
        document.getElementById('status').value = status;

        editingRow = row;
        updateBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }

    // Delete a kehadiran record
    function deleteKehadiranRecord(row) {
        const name = row.children[0].textContent;
        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Data kehadiran berhasil dihapus') {
                row.remove();
            } else {
                console.error('Failed to delete kehadiran', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Reset form and buttons
    function resetForm() {
        document.getElementById('name').value = '';
        document.getElementById('date').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('status').value = '';

        updateBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        editingRow = null;
    }

    fetchAllKehadiran();
});

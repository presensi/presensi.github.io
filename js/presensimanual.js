document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://asia-southeast2-kehadiran-423310.cloudfunctions.net/cekin/data/kehadiran';
    const kehadiranTbody = document.querySelector('#kehadiran-tbody');
    const kehadiranForm = document.getElementById('kehadiran-form');

    function fetchAllKehadiran() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                console.log('Response from fetchAllKehadiran:', data);
                if (Array.isArray(data)) {
                    data.forEach(kehadiran => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td class="py-2 px-4 border">${kehadiran.name}</td>
                            <td class="py-2 px-4 border">${kehadiran.date}</td>
                            <td class="py-2 px-4 border">${kehadiran.subject}</td>
                            <td class="py-2 px-4 border">${kehadiran.status}</td>
                            <td class="py-2 px-4 border">
                                <button class="edit-btn btn btn-warning btn-sm">Edit</button>
                                <button class="delete-btn btn btn-danger btn-sm">Delete</button>
                            </td>
                        `;
                        row.querySelector('.edit-btn').addEventListener('click', () => editkehadiranRecord(row));
                        row.querySelector('.delete-btn').addEventListener('click', () => deletekehadiranRecord(row));
                        kehadiranTbody.appendChild(row);
                    });
                } else {
                    console.error('Failed to fetch kehadiran', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function addkehadiranRecord(kehadiran) {
        console.log('Adding kehadiran:', kehadiran);
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(kehadiran)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from add:', data);
            if (data.message === 'Data kehadiran berhasil disimpan') {
                const row = document.createElement('tr');
                row.innerHTML = `
                            <td class="py-2 px-4 border">${kehadiran.name}</td>
                            <td class="py-2 px-4 border">${kehadiran.date}</td>
                            <td class="py-2 px-4 border">${kehadiran.subject}</td>
                            <td class="py-2 px-4 border">${kehadiran.status}</td>
                    <td class="py-2 px-4 border">
                        <button class="edit-btn btn btn-warning btn-sm">Edit</button>
                        <button class="delete-btn btn btn-danger btn-sm">Delete</button>
                    </td>
                `;
                row.querySelector('.edit-btn').addEventListener('click', () => editkehadiranRecord(row));
                row.querySelector('.delete-btn').addEventListener('click', () => deletekehadiranRecord(row));
                kehadiranTbody.appendChild(row);
            } else {
                console.error('Failed to add kehadiran', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function updatekehadiranRecord(kehadiran) {
        if (!kehadiran || !kehadiran.Tanggal || !kehadiran.Nama || !kehadiran.MataPelajaran || !kehadiran.Status) {
            console.error('Data kehadiran Invalid:', kehadiran);
            return;
        }

        console.log('Updating kehadiran:', kehadiran);
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
            console.log('Response from update:', data);
            if (data.message === 'Data kehadiran berhasil diperbarui') {
                if (editingRow) {
                    editingRow.children[0].textContent = kehadiran.name;
                    editingRow.children[1].textContent = kehadiran.date;
                    editingRow.children[2].textContent = kehadiran.subject;
                    editingRow.children[3].textContent = kehadiran.status;
                    editingRow = null;
                }
                resetForm();
            } else {
                console.error('Failed to update kehadiran', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function deletekehadiranRecord(row) {
        const name = row.children[1].textContent;
        console.log('Deleting kehadiran:', name);
        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Name: name })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from delete:', data);
            if (data.message === 'Data kehadiran berhasil dihapus') {
                row.remove();
            } else {
                console.error('Failed to delete kehadiran', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function editkehadiranRecord(row) {
        const kehadiran = {
            name: row.children[1].textContent,
            date: row.children[0].textContent,
            subject: row.children[2].textContent,
            status: row.children[3].textContent
        };
        document.getElementById('name').value = kehadiran.name;
        document.getElementById('date').value = kehadiran.date;
        document.getElementById('subject').value = kehadiran.subject;
        document.getElementById('status').value = kehadiran.status;
        editingRow = row;
    }

    function resetForm() {
        kehadiranForm.reset();
        editingRow = null;
    }

    let editingRow = null;

    kehadiranForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const kehadiran = {
            tanggal: document.getElementById('tanggal').value,
            name: document.getElementById('name').value,
            subject: document.getElementById('subject').value,
            status: document.getElementById('status').value
        };
        if (editingRow) {
            updatekehadiranRecord(kehadiran);
        } else {
            addkehadiranRecord(kehadiran);
        }
        resetForm();
    });

    fetchAllKehadiran();
});

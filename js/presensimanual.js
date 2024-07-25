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
                            <td class="py-2 px-4 border">${kehadiran.Tanggal}</td>
                            <td class="py-2 px-4 border">${kehadiran.Nama}</td>
                            <td class="py-2 px-4 border">${kehadiran.MataPelajaran}</td>
                            <td class="py-2 px-4 border">${kehadiran.Status}</td>
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
                    <td class="py-2 px-4 border">${kehadiran.Tanggal}</td>
                    <td class="py-2 px-4 border">${kehadiran.Nama}</td>
                    <td class="py-2 px-4 border">${kehadiran.MataPelajaran}</td>
                    <td class="py-2 px-4 border">${kehadiran.Status}</td>
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
                    editingRow.children[0].textContent = kehadiran.Tanggal;
                    editingRow.children[1].textContent = kehadiran.Nama;
                    editingRow.children[2].textContent = kehadiran.MataPelajaran;
                    editingRow.children[3].textContent = kehadiran.Status;
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
        const nama = row.children[1].textContent;
        console.log('Deleting kehadiran:', nama);
        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Nama: nama })
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
            Tanggal: row.children[0].textContent,
            Nama: row.children[1].textContent,
            MataPelajaran: row.children[2].textContent,
            Status: row.children[3].textContent
        };
        document.getElementById('tanggal').value = kehadiran.Tanggal;
        document.getElementById('nama').value = kehadiran.Nama;
        document.getElementById('matapelajaran').value = kehadiran.MataPelajaran;
        document.getElementById('status').value = kehadiran.Status;
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
            Tanggal: document.getElementById('tanggal').value,
            Nama: document.getElementById('nama').value,
            MataPelajaran: document.getElementById('matapelajaran').value,
            Status: document.getElementById('status').value
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

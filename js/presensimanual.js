document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/presensi';
    const kehadiranTbody = document.querySelector('#kehadiran-tbody');
    const kehadiranForm = document.getElementById('kehadiran-form');

    function fetchAllPresensi() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                console.log('Response from fetchAllPresensi:', data);
                if (Array.isArray(data)) {
                    data.forEach(presensi => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td class="py-2 px-4 border">${presensi.Tanggal}</td>
                            <td class="py-2 px-4 border">${presensi.Nama}</td>
                            <td class="py-2 px-4 border">${presensi.MataPelajaran}</td>
                            <td class="py-2 px-4 border">${presensi.Status}</td>
                            <td class="py-2 px-4 border">
                                <button class="edit-btn btn btn-warning btn-sm">Edit</button>
                                <button class="delete-btn btn btn-danger btn-sm">Delete</button>
                            </td>
                        `;
                        row.querySelector('.edit-btn').addEventListener('click', () => editPresensiRecord(row));
                        row.querySelector('.delete-btn').addEventListener('click', () => deletePresensiRecord(row));
                        kehadiranTbody.appendChild(row);
                    });
                } else {
                    console.error('Failed to fetch presensi', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function addPresensiRecord(presensi) {
        console.log('Adding presensi:', presensi);
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(presensi)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from add:', data);
            if (data.message === 'Data presensi berhasil disimpan') {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-2 px-4 border">${presensi.Tanggal}</td>
                    <td class="py-2 px-4 border">${presensi.Nama}</td>
                    <td class="py-2 px-4 border">${presensi.MataPelajaran}</td>
                    <td class="py-2 px-4 border">${presensi.Status}</td>
                    <td class="py-2 px-4 border">
                        <button class="edit-btn btn btn-warning btn-sm">Edit</button>
                        <button class="delete-btn btn btn-danger btn-sm">Delete</button>
                    </td>
                `;
                row.querySelector('.edit-btn').addEventListener('click', () => editPresensiRecord(row));
                row.querySelector('.delete-btn').addEventListener('click', () => deletePresensiRecord(row));
                kehadiranTbody.appendChild(row);
            } else {
                console.error('Failed to add presensi', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function updatePresensiRecord(presensi) {
        if (!presensi || !presensi.Tanggal || !presensi.Nama || !presensi.MataPelajaran || !presensi.Status) {
            console.error('Data Presensi Invalid:', presensi);
            return;
        }

        console.log('Updating presensi:', presensi);
        fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(presensi)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Failed to update presensi');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from update:', data);
            if (data.message === 'Data presensi berhasil diperbarui') {
                if (editingRow) {
                    editingRow.children[0].textContent = presensi.Tanggal;
                    editingRow.children[1].textContent = presensi.Nama;
                    editingRow.children[2].textContent = presensi.MataPelajaran;
                    editingRow.children[3].textContent = presensi.Status;
                    editingRow = null;
                }
                resetForm();
            } else {
                console.error('Failed to update presensi', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function deletePresensiRecord(row) {
        const nama = row.children[1].textContent;
        console.log('Deleting presensi:', nama);
        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Nama: nama })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from delete:', data);
            if (data.message === 'Data presensi berhasil dihapus') {
                row.remove();
            } else {
                console.error('Failed to delete presensi', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function editPresensiRecord(row) {
        const presensi = {
            Tanggal: row.children[0].textContent,
            Nama: row.children[1].textContent,
            MataPelajaran: row.children[2].textContent,
            Status: row.children[3].textContent
        };
        document.getElementById('tanggal').value = presensi.Tanggal;
        document.getElementById('nama').value = presensi.Nama;
        document.getElementById('matapelajaran').value = presensi.MataPelajaran;
        document.getElementById('status').value = presensi.Status;
        editingRow = row;
    }

    function resetForm() {
        kehadiranForm.reset();
        editingRow = null;
    }

    let editingRow = null;

    kehadiranForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const presensi = {
            Tanggal: document.getElementById('tanggal').value,
            Nama: document.getElementById('nama').value,
            MataPelajaran: document.getElementById('matapelajaran').value,
            Status: document.getElementById('status').value
        };
        if (editingRow) {
            updatePresensiRecord(presensi);
        } else {
            addPresensiRecord(presensi);
        }
        resetForm();
    });

    fetchAllPresensi();
});

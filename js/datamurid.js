document.addEventListener('DOMContentLoaded', () => {
    const siswaForm = document.getElementById('siswaForm');
    const siswaTbody = document.getElementById('siswaTbody');
    const submitBtn = document.getElementById('submitBtn');
    const updateBtn = document.getElementById('updateBtn');
    const API_URL = 'https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/siswa';

    let editingRow = null;

    siswaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = editingRow ? editingRow.dataset.id : null;
        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        const umur = document.getElementById('umur').value;
        const phonenumber = document.getElementById('phonenumber').value;

        if (nama && kelas && umur && phonenumber) {
            const siswa = { id, nama, kelas, umur: parseInt(umur), phonenumber };
            if (editingRow) {
                updateSiswaRecord(siswa);
                editingRow = null;
            } else {
                addSiswaRecord(siswa);
            }
            siswaForm.reset();
        }
    });

    function addSiswaRecord(siswa) {
        console.log('Adding siswa:', siswa);
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siswa)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from add:', data);
            if (data.message === 'Data siswa berhasil disimpan') {
                const row = createTableRow(siswa, data.insertedId);
                siswaTbody.appendChild(row);
            } else {
                console.error('Failed to add siswa', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function updateSiswaRecord(siswa) {
        console.log('Updating siswa:', siswa);
        fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siswa)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from update:', data);
            if (data.message === 'Data siswa berhasil diperbarui') {
                updateTableRow(editingRow, siswa);
                resetForm();
            } else {
                console.error('Failed to update siswa', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function deleteSiswaRecord(row) {
        const id = row.dataset.id;
        console.log('Deleting siswa:', id);
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from delete:', data);
            if (data.message === 'Data siswa berhasil dihapus') {
                row.remove();
            } else {
                console.error('Failed to delete siswa', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function editSiswaRecord(row) {
        const id = row.dataset.id;
        const nama = row.children[0].textContent;
        const kelas = row.children[1].textContent;
        const umur = row.children[2].textContent;
        const phonenumber = row.children[3].textContent;

        document.getElementById('nama').value = nama;
        document.getElementById('kelas').value = kelas;
        document.getElementById('umur').value = umur;
        document.getElementById('phonenumber').value = phonenumber;

        editingRow = row;
        updateBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }

    function createTableRow(siswa, id) {
        const row = document.createElement('tr');
        row.dataset.id = id;
        row.innerHTML = `
            <td>${siswa.nama}</td>
            <td>${siswa.kelas}</td>
            <td>${siswa.umur}</td>
            <td>${siswa.phonenumber}</td>
            <td>
                <button class="edit-btn btn btn-warning btn-sm">Edit</button>
                <button class="delete-btn btn btn-danger btn-sm">Delete</button>
            </td>
        `;
        row.querySelector('.edit-btn').addEventListener('click', () => editSiswaRecord(row));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteSiswaRecord(row));
        return row;
    }

    function updateTableRow(row, siswa) {
        row.children[0].textContent = siswa.nama;
        row.children[1].textContent = siswa.kelas;
        row.children[2].textContent = siswa.umur;
        row.children[3].textContent = siswa.phonenumber;
    }

    function fetchAllSiswa() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                console.log('Response from fetchAllSiswa:', data);
                if (Array.isArray(data)) {
                    data.forEach(siswa => {
                        const row = createTableRow(siswa, siswa.id);
                        siswaTbody.appendChild(row);
                    });
                } else {
                    console.error('Failed to fetch siswa', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function resetForm() {
        siswaForm.reset();
        submitBtn.style.display = 'block';
        updateBtn.style.display = 'none';
        editingRow = null;
    }

    fetchAllSiswa();
});

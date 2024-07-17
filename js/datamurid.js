document.addEventListener('DOMContentLoaded', () => {
    const siswaForm = document.getElementById('siswaForm');
    const siswaTbody = document.getElementById('siswaTbody');
    const API_URL = 'https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/siswa';
    
    let editingRow = null;

    siswaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        const umur = document.getElementById('umur').value;

        if (nama && kelas && umur) {
            const siswa = { nama, kelas, umur: parseInt(umur) };
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
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${siswa.nama}</td>
                    <td>${siswa.kelas}</td>
                    <td>${siswa.umur}</td>
                    <td>
                        <button class="edit-btn btn btn-warning btn-sm">Edit</button>
                        <button class="delete-btn btn btn-danger btn-sm">Delete</button>
                    </td>
                `;
                row.querySelector('.edit-btn').addEventListener('click', () => editSiswaRecord(row));
                row.querySelector('.delete-btn').addEventListener('click', () => deleteSiswaRecord(row));
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
                editingRow.children[0].textContent = siswa.nama;
                editingRow.children[1].textContent = siswa.kelas;
                editingRow.children[2].textContent = siswa.umur;
            } else {
                console.error('Failed to update siswa', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function editSiswaRecord(row) {
        const nama = row.children[0].textContent;
        const kelas = row.children[1].textContent;
        const umur = row.children[2].textContent;

        document.getElementById('nama').value = nama;
        document.getElementById('kelas').value = kelas;
        document.getElementById('umur').value = umur;

        editingRow = row;
        document.getElementById('updateBtn').style.display = 'block';
        document.querySelector('button[type="submit"]').style.display = 'none';
    }

    function deleteSiswaRecord(row) {
        const nama = row.children[0].textContent;
        console.log('Deleting siswa:', nama);
        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama })
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

    document.getElementById('updateBtn').addEventListener('click', (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        const umur = document.getElementById('umur').value;

        if (editingRow) {
            updateSiswaRecord({ nama, kelas, umur: parseInt(umur) });
            editingRow = null;
        }

        document.getElementById('updateBtn').style.display = 'none';
        document.querySelector('button[type="submit"]').style.display = 'block';
        siswaForm.reset();
    });

    function fetchAllSiswa() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                console.log('Response from fetchAllSiswa:', data);
                if (Array.isArray(data)) {
                    data.forEach(siswa => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${siswa.nama}</td>
                            <td>${siswa.kelas}</td>
                            <td>${siswa.umur}</td>
                            <td>
                                <button class="edit-btn btn btn-warning btn-sm">Edit</button>
                                <button class="delete-btn btn btn-danger btn-sm">Delete</button>
                            </td>
                        `;
                        row.querySelector('.edit-btn').addEventListener('click', () => editSiswaRecord(row));
                        row.querySelector('.delete-btn').addEventListener('click', () => deleteSiswaRecord(row));
                        siswaTbody.appendChild(row);
                    });
                } else {
                    console.error('Failed to fetch siswa', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    fetchAllSiswa();
});

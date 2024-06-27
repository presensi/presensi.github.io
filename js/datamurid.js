document.addEventListener('DOMContentLoaded', () => {
    const siswaForm = document.getElementById('siswaForm');
    const siswaTbody = document.getElementById('siswaTbody');
    const API_URL = 'https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/kehadiran';
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
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siswa)
        })
        .then(response => response.json())
        .then(data => {
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
    }

    function updateSiswaRecord(siswa) {
        fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siswa)
        })
        .then(response => response.json())
        .then(data => {
            editingRow.children[0].textContent = siswa.nama;
            editingRow.children[1].textContent = siswa.kelas;
            editingRow.children[2].textContent = siswa.umur;
        });
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
        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama })
        })
        .then(response => response.json())
        .then(data => row.remove());
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
            });
    }

    fetchAllSiswa();
});

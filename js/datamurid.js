document.addEventListener('DOMContentLoaded', () => {
    const siswaForm = document.getElementById('siswaForm');
    const siswaTbody = document.getElementById('siswaTbody');
    const submitBtn = document.getElementById('submitBtn');
    const updateBtn = document.getElementById('updateBtn');
    const API_URL = 'https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/siswa';
    
    let editingRow = null;

    siswaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        const jeniskelamin = document.getElementById('jeniskelamin').value;
        const phonenumber = document.getElementById('phonenumber').value;

        if (nama && kelas && jeniskelamin && phonenumber) {
            const siswa = { nama, kelas, jeniskelamin, phonenumber };
            if (editingRow) {
                updateSiswaRecord(siswa);
            } else {
                addSiswaRecord(siswa);
            }
            siswaForm.reset();
            resetForm();
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
                    <td>${siswa.jeniskelamin}</td>
                    <td>${siswa.phonenumber}</td>
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
        if (!siswa || !siswa.nama || !siswa.kelas || !siswa.jeniskelamin || !siswa.phonenumber) {
            console.error('Data Siswa Invalid:', siswa);
            return;
        }

        console.log('Updating siswa:', siswa);
        fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siswa)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Failed to update siswa');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from update:', data);
            if (data.message === 'Data siswa berhasil diperbarui') {
                if (editingRow) {
                    editingRow.children[0].textContent = siswa.nama;
                    editingRow.children[1].textContent = siswa.kelas;
                    editingRow.children[2].textContent = siswa.jeniskelamin;
                    editingRow.children[3].textContent = siswa.phonenumber;
                    editingRow = null;
                }
                resetForm();
            } else {
                console.error('Failed to update siswa', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function editSiswaRecord(row) {
        const nama = row.children[0].textContent;
        const kelas = row.children[1].textContent;
        const jeniskelamin = row.children[2].textContent;
        const phonenumber = row.children[3].textContent;

        document.getElementById('nama').value = nama;
        document.getElementById('kelas').value = kelas;
        document.getElementById('jeniskelamin').value = jeniskelamin;
        document.getElementById('phonenumber').value = phonenumber;

        editingRow = row;
        updateBtn.style.display = 'block';
        submitBtn.style.display = 'none';
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

    updateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        const jeniskelamin = document.getElementById('jeniskelamin').value;
        const phonenumber = document.getElementById('phonenumber').value;

        if (editingRow) {
            updateSiswaRecord({ nama, kelas, jeniskelamin, phonenumber });
        }

        resetForm();
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
                            <td>${siswa.jeniskelamin}</td>
                            <td>${siswa.phonenumber}</td>
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

    function resetForm() {
        document.getElementById('nama').value = '';
        document.getElementById('kelas').value = '';
        document.getElementById('jeniskelamin').value = '';
        document.getElementById('phonenumber').value = '';
    
        updateBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        editingRow = null;
    }

    fetchAllSiswa();
});

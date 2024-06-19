document.addEventListener('DOMContentLoaded', () => {
    const siswaForm = document.getElementById('siswaForm');
    const siswaTbody = document.getElementById('siswaTbody');
    let editingRow = null;

    siswaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        const umur = document.getElementById('umur').value;

        if (nama && kelas && umur) {
            if (editingRow) {
                updateSiswaRecord(editingRow, nama, kelas, umur);
                editingRow = null;
            } else {
                addSiswaRecord(nama, kelas, umur);
            }
            siswaForm.reset();
        }
    });

    function addSiswaRecord(nama, kelas, umur) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${nama}</td>
            <td>${kelas}</td>
            <td>${umur}</td>
            <td>
                <button class="edit-btn btn btn-warning btn-sm">Edit</button>
                <button class="delete-btn btn btn-danger btn-sm">Delete</button>
            </td>
        `;
        row.querySelector('.edit-btn').addEventListener('click', () => editSiswaRecord(row));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteSiswaRecord(row));
        siswaTbody.appendChild(row);
    }

    function updateSiswaRecord(row, nama, kelas, umur) {
        row.children[0].textContent = nama;
        row.children[1].textContent = kelas;
        row.children[2].textContent = umur;
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
        row.remove();
    }

    document.getElementById('updateBtn').addEventListener('click', (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        const umur = document.getElementById('umur').value;

        if (editingRow) {
            updateSiswaRecord(editingRow, nama, kelas, umur);
            editingRow = null;
        }

        document.getElementById('updateBtn').style.display = 'none';
        document.querySelector('button[type="submit"]').style.display = 'block';
        siswaForm.reset();
    });
});

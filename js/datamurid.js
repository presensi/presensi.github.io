let siswaData = [];
let editIndex = -1;

document.getElementById('siswaForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;
    const umur = document.getElementById('umur').value;

    if (editIndex === -1) {
        siswaData.push({ nama, kelas, umur });
    } else {
        siswaData[editIndex] = { nama, kelas, umur };
        editIndex = -1;
        document.getElementById('updateBtn').style.display = 'none';
        document.querySelector('button[type="submit"]').style.display = 'block';
    }

    document.getElementById('siswaForm').reset();
    renderTable();
});

document.getElementById('updateBtn').addEventListener('click', function () {
    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;
    const umur = document.getElementById('umur').value;

    siswaData[editIndex] = { nama, kelas, umur };
    editIndex = -1;

    document.getElementById('updateBtn').style.display = 'none';
    document.querySelector('button[type="submit"]').style.display = 'block';
    document.getElementById('siswaForm').reset();
    renderTable();
});

function renderTable() {
    const tbody = document.querySelector('#siswaTable tbody');
    tbody.innerHTML = '';
    siswaData.forEach((siswa, index) => {
        const row = `<tr>
            <td>${siswa.nama}</td>
            <td>${siswa.kelas}</td>
            <td>${siswa.umur}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editSiswa(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSiswa(${index})">Delete</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function editSiswa(index) {
    editIndex = index;
    const siswa = siswaData[index];
    document.getElementById('nama').value = siswa.nama;
    document.getElementById('kelas').value = siswa.kelas;
    document.getElementById('umur').value = siswa.umur;
    document.getElementById('updateBtn').style.display = 'block';
    document.querySelector('button[type="submit"]').style.display = 'none';
}

function deleteSiswa(index) {
    siswaData.splice(index, 1);
    renderTable();
}

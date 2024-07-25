document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://asia-southeast2-kehadiran-423310.cloudfunctions.net/cekin/data/kehadiran';
    const siswaTbody = document.getElementById('siswaTbody');
    const siswaForm = document.getElementById('siswaForm');
    const submitBtn = document.getElementById('submitBtn');
    const updateBtn = document.getElementById('updateBtn');

    let siswaList = [];
    let editIndex = null;

    // Fetch data from API
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            siswaList = data;
            displaySiswa();
        })
        .catch(error => console.error('Error:', error));

    // Display siswa data
    function displaySiswa() {
        siswaTbody.innerHTML = '';
        siswaList.forEach((siswa, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${siswa.nama}</td>
                <td>${siswa.kelas}</td>
                <td>${siswa.jeniskelamin}</td>
                <td>${siswa.phonenumber}</td>
                <td>
                    <button class="btn btn-sm btn-info editBtn" data-index="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger deleteBtn" data-index="${index}">Delete</button>
                </td>
            `;
            siswaTbody.appendChild(row);
        });

        // Attach event listeners to edit buttons
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', function() {
                editIndex = this.getAttribute('data-index');
                const siswa = siswaList[editIndex];
                siswaForm.nama.value = siswa.nama;
                siswaForm.kelas.value = siswa.kelas;
                siswaForm.jeniskelamin.value = siswa.jeniskelamin;
                siswaForm.phonenumber.value = siswa.phonenumber;

                submitBtn.style.display = 'none';
                updateBtn.style.display = 'block';
            });
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                siswaList.splice(index, 1);
                displaySiswa();
            });
        });
    }

    // Handle form submission for new siswa
    siswaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newSiswa = {
            nama: siswaForm.nama.value,
            kelas: siswaForm.kelas.value,
            jeniskelamin: siswaForm.jeniskelamin.value,
            phonenumber: siswaForm.phonenumber.value
        };
        siswaList.push(newSiswa);
        displaySiswa();
        siswaForm.reset();
    });

    // Handle form submission for updating siswa
    updateBtn.addEventListener('click', function() {
        siswaList[editIndex] = {
            nama: siswaForm.nama.value,
            kelas: siswaForm.kelas.value,
            jeniskelamin: siswaForm.jeniskelamin.value,
            phonenumber: siswaForm.phonenumber.value
        };
        displaySiswa();
        siswaForm.reset();
        submitBtn.style.display = 'block';
        updateBtn.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/kehadiran';
    const kehadiranTbody = document.querySelector('#kehadiran-tbody');
    const kehadiranForm = document.getElementById('kehadiran-form');

    function fetchAllKehadiran() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
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
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(kehadiran)
        })
        .then(response => response.json())
        .then(data => {
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

    kehadiranForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const kehadiran = {
            name: document.getElementById('nama').value,
            date: document.getElementById('tanggal').value,
            subject: document.getElementById('matapelajaran').value,
            status: document.getElementById('status').value,
        };
        addkehadiranRecord(kehadiran);
    });

    fetchAllKehadiran();
});

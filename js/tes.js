document.addEventListener('DOMContentLoaded', function() {
    fetch('https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/presensi')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#presensi-table tbody');
            data.forEach(presensi => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${presensi.PhoneNumber}</td>
                    <td>${presensi.Lokasi.Nama}</td>
                    <td>${new Date(presensi.CreatedAt).toLocaleString()}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
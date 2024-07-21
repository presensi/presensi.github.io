document.addEventListener('DOMContentLoaded', function() {
    fetch('https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/presensi')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#kehadiran-tbody');
            data.forEach(presensi => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${presensi.Lokasi.Nama}</td>
                    <td class="long-lat-column">${presensi.Lokasi.Batas.coordinates[0]}</td>
                    <td class="long-lat-column">${presensi.Lokasi.Batas.coordinates[1]}</td>
                    <td>${presensi.PhoneNumber}</td>
                    <td>${new Date(presensi.CreatedAt).toLocaleString()}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    const toggleButton = document.getElementById('toggle-long-lat');
    toggleButton.addEventListener('click', function() {
        const longLatColumns = document.querySelectorAll('.long-lat-column');
        longLatColumns.forEach(column => {
            if (column.style.display === 'none') {
                column.style.display = '';
                toggleButton.textContent = 'Hide Longitude and Latitude';
            } else {
                column.style.display = 'none';
                toggleButton.textContent = 'Show Longitude and Latitude';
            }
        });
    });
});

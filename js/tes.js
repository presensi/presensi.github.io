document.addEventListener('DOMContentLoaded', function() {
    fetch('/data/presensi')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#presensi-table tbody');
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

    const toggleCheckbox = document.getElementById('toggle-long-lat');
    toggleCheckbox.addEventListener('change', function() {
        const longLatColumns = document.querySelectorAll('.long-lat-column');
        longLatColumns.forEach(column => {
            if (toggleCheckbox.checked) {
                column.classList.remove('hide');
            } else {
                column.classList.add('hide');
            }
        });
    });

    // Trigger the initial change event to set the correct visibility on load
    toggleCheckbox.dispatchEvent(new Event('change'));
});

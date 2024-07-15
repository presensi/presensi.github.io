document.addEventListener('DOMContentLoaded', () => {
    const kehadiranForm = document.getElementById('kehadiran-form');
    const kehadiranTbody = document.getElementById('kehadiran-tbody');
    const summaryTbody = document.getElementById('summary-tbody');
    const API_URL = 'https://asia-southeast2-presensi-423310.cloudfunctions.net/cekin/data/kehadiran';

    let editingRow = null;

    // Fetch kehadiran data dari backend dan untuk ditampilkan
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            data.forEach(record => {
                addKehadiranRecord(record.date, record.name, record.subject, record.status);
            });
            updateSummary();
        })
        .catch(error => console.error('Error fetching kehadiran data:', error));

    kehadiranForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const date = document.getElementById('date').value;
        const name = document.getElementById('name').value;
        const subject = document.getElementById('subject').value;
        const status = document.getElementById('status').value;

        if (date && name && subject && status) {
            const record = { date, name, subject, status };

            if (editingRow) {
                updateKehadiranRecord(editingRow, record);
                editingRow = null;
            } else {
                addKehadiranRecord(date, name, subject, status);
            }

            // Send the new record to the backend
            fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(record)
            }).catch(error => console.error('Error sending kehadiran data:', error));

            updateSummary();
            kehadiranForm.reset();
        }
    });

    function addKehadiranRecord(date, name, subject, status) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4 border">${date}</td>
            <td class="py-2 px-4 border">${name}</td>
            <td class="py-2 px-4 border">${subject}</td>
            <td class="py-2 px-4 border">${status}</td>
            <td class="py-2 px-4 border">
                <button class="bg-blue-900 text-white px-4 py-1 rounded edit-btn mr-2">Edit</button>
                <button class="bg-red-500 text-white px-4 py-1 rounded delete-btn">Delete</button>
            </td>
        `;
        kehadiranTbody.appendChild(row);

        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => editKehadiranRecord(row));
        deleteBtn.addEventListener('click', () => deleteKehadiranRecord(row));
    }

    function editKehadiranRecord(row) {
        const [date, name, subject, status] = row.children;

        document.getElementById('date').value = date.textContent;
        document.getElementById('name').value = name.textContent;
        document.getElementById('subject').value = subject.textContent;
        document.getElementById('status').value = status.textContent;

        editingRow = row;
    }

    function updateKehadiranRecord(row, record) {
        const [date, name, subject, status] = row.children;

        date.textContent = record.date;
        name.textContent = record.name;
        subject.textContent = record.subject;
        status.textContent = record.status;
    }

    function deleteKehadiranRecord(row) {
        const index = Array.from(kehadiranTbody.children).indexOf(row);
        row.remove();
        
        // Send delete request to backend here
        fetch(`${API_URL}/${index}`, {
            method: 'DELETE'
        }).catch(error => console.error('Error deleting kehadiran record:', error));
    
        updateSummary();
    }
    

    function updateSummary() {
        const summaryData = {};

        kehadiranTbody.querySelectorAll('tr').forEach(row => {
            const date = row.children[0].textContent;
            const status = row.children[3].textContent;

            if (!summaryData[date]) {
                summaryData[date] = { hadir: 0, telat: 0, alpa: 0, izin: 0, sakit: 0 };
            }
            summaryData[date][status]++;
        });

        summaryTbody.innerHTML = '';

        Object.keys(summaryData).forEach(date => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border">${date}</td>
                <td class="py-2 px-4 border">${summaryData[date].hadir}</td>
                <td class="py-2 px-4 border">${summaryData[date].telat}</td>
                <td class="py-2 px-4 border">${summaryData[date].alpa}</td>
                <td class="py-2 px-4 border">${summaryData[date].izin}</td>
                <td class="py-2 px-4 border">${summaryData[date].sakit}</td>
            `;
            summaryTbody.appendChild(row);
        });
    }
});

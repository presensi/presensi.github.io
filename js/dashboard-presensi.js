// Add a scroll event listener to change the navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const attendanceForm = document.getElementById('attendance-form');
    const attendanceTbody = document.getElementById('attendance-tbody');
    const summaryTbody = document.getElementById('summary-tbody');

    let editingRow = null;

    attendanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const date = document.getElementById('date').value;
        const name = document.getElementById('name').value;
        const subject = document.getElementById('subject').value;
        const status = document.getElementById('status').value;

        if (date && name && subject && status) {
            if (editingRow) {
                updateAttendanceRecord(editingRow, date, name, subject, status);
                editingRow = null;
            } else {
                addAttendanceRecord(date, name, subject, status);
            }
            updateSummary();
            attendanceForm.reset();
        }
    });

    function addAttendanceRecord(date, name, subject, status) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-2 px-4 border">${date}</td>
            <td class="py-2 px-4 border">${name}</td>
            <td class="py-2 px-4 border">${subject}</td>
            <td class="py-2 px-4 border">${status}</td>
            <td class="py-2 px-4 border">
                <button class="edit-btn py-1 px-3 bg-yellow-500 text-white rounded mr-2">Edit</button>
                <button class="delete-btn py-1 px-3 bg-red-500 text-white rounded">Delete</button>
            </td>
        `;
        row.querySelector('.edit-btn').addEventListener('click', () => editAttendanceRecord(row));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteAttendanceRecord(row));
        attendanceTbody.appendChild(row);
    }

    function updateAttendanceRecord(row, date, name, subject, status) {
        row.children[0].textContent = date;
        row.children[1].textContent = name;
        row.children[2].textContent = subject;
        row.children[3].textContent = status;
    }

    function editAttendanceRecord(row) {
        const date = row.children[0].textContent;
        const name = row.children[1].textContent;
        const subject = row.children[2].textContent;
        const status = row.children[3].textContent;

        document.getElementById('date').value = date;
        document.getElementById('name').value = name;
        document.getElementById('subject').value = subject;
        document.getElementById('status').value = status;

        editingRow = row;
    }

    function deleteAttendanceRecord(row) {
        row.remove();
        updateSummary();
    }

    function updateSummary() {
        const summary = {};
        Array.from(attendanceTbody.children).forEach(row => {
            const date = row.children[0].textContent;
            const name = row.children[1].textContent;
            const subject = row.children[2].textContent;
            const status = row.children[3].textContent;

            if (!summary[date]) {
                summary[date] = {};
            }
            if (!summary[date][name]) {
                summary[date][name] = {};
            }
            if (!summary[date][name][subject]) {
                summary[date][name][subject] = { hadir: 0, telat: 0, alpa: 0, izin: 0, sakit: 0 };
            }
            summary[date][name][subject][status.toLowerCase()]++;
        });

        summaryTbody.innerHTML = '';
        for (const date in summary) {
            for (const name in summary[date]) {
                for (const subject in summary[date][name]) {
                    const summaryRow = document.createElement('tr');
                    summaryRow.innerHTML = `
                        <td class="py-2 px-4 border">${date}</td>
                        <td class="py-2 px-4 border">${name}</td>
                        <td class="py-2 px-4 border">${subject}</td>
                        <td class="py-2 px-4 border">
                            Hadir: ${summary[date][name][subject].hadir}, Terlambat: ${summary[date][name][subject].telat}, Alpa: ${summary[date][name][subject].alpa}, Izin: ${summary[date][name][subject].izin}, Sakit: ${summary[date][name][subject].sakit}
                        </td>
                        <td class="py-2 px-4 border">
                            <button class="edit-btn py-1 px-3 bg-yellow-500 text-white rounded mr-2">Edit</button>
                            <button class="delete-btn py-1 px-3 bg-red-500 text-white rounded">Delete</button>
                        </td>
                    `;
                    summaryRow.querySelector('.edit-btn').addEventListener('click', () => editAttendanceRecord(summaryRow));
                    summaryRow.querySelector('.delete-btn').addEventListener('click', () => deleteAttendanceRecord(summaryRow));
                    summaryTbody.appendChild(summaryRow);
                }
            }
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://asia-southeast2-kehadiran-423310.cloudfunctions.net/cekin/data/kehadiran';
    const kehadiranTable = document.getElementById('kehadiran-tbody');
    const form = document.getElementById('kehadiran-form');
    const submitBtn = document.getElementById('submitBtn');
    const updateBtn = document.getElementById('updateBtn');

    let kehadiranList = [];
    let editIndex = null;

    // Fetch data from API
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            kehadiranList = data;
            displayKehadiran();
        })
        .catch(error => console.error('Error:', error));

    // Display kehadiran data
    function displayKehadiran() {
        kehadiranTable.innerHTML = '';
        kehadiranList.forEach((kehadiran, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border">${kehadiran.name}</td>
                <td class="py-2 px-4 border">${kehadiran.date}</td>
                <td class="py-2 px-4 border">${kehadiran.subject}</td>
                <td class="py-2 px-4 border">${kehadiran.status}</td>
                <td class="py-2 px-4 border">
                    <button class="py-1 px-2 bg-green-500 text-white rounded editBtn" data-index="${index}">Edit</button>
                    <button class="py-1 px-2 bg-red-500 text-white rounded deleteBtn" data-index="${index}">Delete</button>
                </td>
            `;
            kehadiranTable.appendChild(row);
        });

        // Attach event listeners to edit buttons
        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', function() {
                editIndex = this.getAttribute('data-index');
                const kehadiran = kehadiranList[editIndex];
                form.name.value = kehadiran.name;
                form.date.value = kehadiran.date;
                form.subject.value = kehadiran.subject;
                form.status.value = kehadiran.status;

                submitBtn.style.display = 'none';
                updateBtn.style.display = 'block';
            });
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                kehadiranList.splice(index, 1);
                displayKehadiran();
            });
        });
    }

    // Handle form submission for new kehadiran
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const newKehadiran = {
            name: form.name.value,
            date: form.date.value,
            subject: form.subject.value,
            status: form.status.value
        };
        kehadiranList.push(newKehadiran);
        displayKehadiran();
        form.reset();
    });

    // Handle form submission for updating kehadiran
    updateBtn.addEventListener('click', function() {
        kehadiranList[editIndex] = {
            name: form.name.value,
            date: form.date.value,
            subject: form.subject.value,
            status: form.status.value
        };
        displayKehadiran();
        form.reset();
        submitBtn.style.display = 'block';
        updateBtn.style.display = 'none';
    });
});

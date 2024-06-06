document.getElementById('attendance-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const name = document.getElementById('name').value;
    const status = document.getElementById('status').value;
    
    const table = document.querySelector('table tbody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td class="py-2 px-4 border">${date}</td>
        <td class="py-2 px-4 border">${name}</td>
        <td class="py-2 px-4 border">${status}</td>
        <td class="py-2 px-4 border"><button class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button></td>
    `;
    
    table.appendChild(newRow);
    
    // Reset form
    document.getElementById('attendance-form').reset();
});
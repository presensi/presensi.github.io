// presensimanual.js

$(document).ready(function() {
    // Fungsi untuk mendapatkan semua catatan kehadiran dan menampilkannya di tabel
    function fetchKehadiran() {
        $.ajax({
            url: '/api/kehadiran',
            method: 'GET',
            success: function(response) {
                $('#kehadiran-tbody').empty();
                response.forEach(function(kehadiran) {
                    $('#kehadiran-tbody').append(`
                        <tr>
                            <td class="py-2 px-4 border">${kehadiran.date}</td>
                            <td class="py-2 px-4 border">${kehadiran.name}</td>
                            <td class="py-2 px-4 border">${kehadiran.subject}</td>
                            <td class="py-2 px-4 border">${kehadiran.status}</td>
                            <td class="py-2 px-4 border">
                                <button class="delete-btn py-1 px-2 bg-red-500 text-white rounded" data-id="${kehadiran.id}">Delete</button>
                                <button class="edit-btn py-1 px-2 bg-yellow-500 text-white rounded" data-id="${kehadiran.id}">Edit</button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function(error) {
                console.error('Error fetching kehadiran:', error);
            }
        });
    }

    // Panggil fungsi untuk mengambil catatan kehadiran saat halaman dimuat
    fetchKehadiran();

    // Fungsi untuk menambahkan catatan kehadiran baru
    $('#kehadiran-form').submit(function(e) {
        e.preventDefault();

        const newKehadiran = {
            date: $('#date').val(),
            name: $('#name').val(),
            subject: $('#subject').val(),
            status: $('#status').val()
        };

        $.ajax({
            url: '/api/kehadiran',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newKehadiran),
            success: function(response) {
                alert(response.message);
                fetchKehadiran();
                $('#kehadiran-form')[0].reset();
            },
            error: function(error) {
                console.error('Error adding kehadiran:', error);
            }
        });
    });

    // Fungsi untuk menghapus catatan kehadiran
    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');

        $.ajax({
            url: `/api/kehadiran?id=${id}`,
            method: 'DELETE',
            success: function(response) {
                alert(response.message);
                fetchKehadiran();
            },
            error: function(error) {
                console.error('Error deleting kehadiran:', error);
            }
        });
    });

    // Fungsi untuk mengedit catatan kehadiran
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        const row = $(this).closest('tr');
        const date = row.find('td:eq(0)').text();
        const name = row.find('td:eq(1)').text();
        const subject = row.find('td:eq(2)').text();
        const status = row.find('td:eq(3)').text();

        $('#date').val(date);
        $('#name').val(name);
        $('#subject').val(subject);
        $('#status').val(status);

        $('#kehadiran-form').off('submit').submit(function(e) {
            e.preventDefault();

            const updatedKehadiran = {
                date: $('#date').val(),
                name: $('#name').val(),
                subject: $('#subject').val(),
                status: $('#status').val()
            };

            $.ajax({
                url: `/api/kehadiran?id=${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updatedKehadiran),
                success: function(response) {
                    alert(response.message);
                    fetchKehadiran();
                    $('#kehadiran-form')[0].reset();
                    $('#kehadiran-form').off('submit').submit(function(e) {
                        e.preventDefault();
                        addKehadiran();
                    });
                },
                error: function(error) {
                    console.error('Error updating kehadiran:', error);
                }
            });
        });
    });
});

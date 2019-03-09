function deleteStudent(id) {
    console.log('test');
    $.ajax({
        url: '/students/' + id,
        type: 'DELETE',
        success: function(result) {
            window.location.reload(true);
        }
    })
};
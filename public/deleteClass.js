function deleteClass(id) {
    $.ajax({
        url: '/classes/' + id,
        type: 'DELETE',
        success: function(result) {
            window.location.reload(true);
        }
    })
};
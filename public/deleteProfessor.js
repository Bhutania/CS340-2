function deleteProfessor(id) {
    $.ajax({
        url: '/professors/' + id,
        type: 'DELETE',
        success: function(result) {
            window.location.reload(true);
        }
    })
};
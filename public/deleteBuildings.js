function deleteBuildings(Name) {
    $.ajax({
        url: '/buildings/' + Name,
        type: 'DELETE',
        success: function(result) {
            window.location.reload(true);
        }
    })
};

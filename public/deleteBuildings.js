function deleteBuildings(name) {	
   $.ajax({
        url: '/buildings/' + name,
        type: 'DELETE',
        success: function(result) {
            window.location.reload(true);
        }
    })
};

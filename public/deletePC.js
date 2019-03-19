function deleteClass(pid, cid) {
    $.ajax({
        url: '/professors/' + cid + '/' + pid,
        type: 'DELETE',
        success: function(result) {
            window.location.reload(true);
        }
    })
};
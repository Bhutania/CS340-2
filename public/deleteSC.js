function deleteClass(cid, sid) {
    console.log('test');
    $.ajax({
        url: '/students/login/' + sid + '/' + cid,
        type: 'DELETE',
        success: function(result) {
            window.location.reload(true);
        }
    })
};
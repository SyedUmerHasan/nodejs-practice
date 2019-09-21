$(document).ready(function(){
    // $(".deleteUser").on('click',deleteUser());
    $('.deleteUser').on('click',deleteUser);

});
function deleteUser() {
    var data_id = $(this).data('id');
    // alert(data_id);
    $.ajax({
        type : 'DELETE',
        url : "/users/deleteUser/"+data_id,
        success: function () {
            console.log("Successfully Deleted") ;
        }
    }).done(function (response) {
        window.location.replace("/");
    });
    window.location.replace("/");

}

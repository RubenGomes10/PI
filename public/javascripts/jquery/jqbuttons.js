
/* Show or hide comments from advertisements*/
var collapse = false;
$('button#comment').on('click', function(){
    if($(this).attr('collapsed') === 'false'){
        $(this).attr('collapsed', true);
        $(this).parent().parent().find('div#comments').collapse('show');
    }else{
        $(this).attr('collapsed', false);
        $(this).parent().parent().find('div#comments').collapse('hide');
    }
});


$('button#follow').on('click', function () {
    var $btn = $(this);
    $.get('/adds/'+$btn.attr('advertisementid')+'/follow/', function (data) {
        if (data.message !== undefined) {
            window.location = '/adds/'+$btn.attr('advertisementid');
            return;
        }
        $btn.tooltip('show');
        if(data.following !== undefined)
            $btn.find('span#following').text(data.following);
    });
});




$('div.alert').hide();
$('div#response').hide();
$('div#password').hide();

$("button#verifyUsername").on('click', function() {
    var username = $('input#username').val();
    $.get('/forgotPass/user/'+username, function(data){
        if(data.question == null)
            $('div#username.alert-danger    ').slideDown();
        else {
            $('h3#question').text(data.question);
            $('div#username.container').slideUp(1000, function () {
                $('div#response.container').slideDown(1000);
            });
        }
    });
});

$("button#verifyResponse").on('click', function() {
    var username = $('input#username').val(),
        response = $('input#response').val();
    $.get('/forgotPass/response/'+username+'/'+response,
        function(data) {
            if (data.response) {
                $('div#response.container').slideUp(1000, function () {
                    $('div#password.container').slideDown(1000);
                });
            } else
                $('div#response.alert-danger').slideDown();
        }
    );
});

$("button#verifyPassword").on('click', function() {
    var username = $('input#username').val(),
        password = $('input#password').val(),
        password2 = $('input#password2').val();
    if(password != password2){
        $('div#password.alert-danger').slideDown();
        return;
    }
    $.get('/forgotPass/password/'+username+'/'+password,
        function(data) {
            if (data.passwordChanged)
                $('p#resultContent').text('A password foi alterada com sucesso');
            else
                $('p#resultContent').text('Não foi possivel alterar a password, tente mais tarde');
            $('div#result').modal('show');
        }
    );
});

$('div#result').on('hidden.bs.modal', function() {
    window.location.replace('/login');
});
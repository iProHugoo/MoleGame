// Função para Login
var $login = function () {
    let $user = $("#user").val();
    let $pwd = $("#pwd").val();
    if ($user && $pwd) {
        $.getJSON("https://molegamecoelho.herokuapp.com/usuario", function ($registros) {
            let usr = $registros.find($usuario => $usuario.user == $user && $usuario.pwd == $pwd)
            if (usr) {
                localStorage.setItem("usr", JSON.stringify(usr));
                window.open("game.html", "_self");
            } else alert("Usuário ou senha estão incorretos!")
        });
    }
    else alert("Erro: Por favor, informe o usuário e a senha!")
};

// Função para Cadastro
var $cadastro = function () {
    let $user = $("#userc").val();
    let $pwd = $("#pwdc").val();
    if ($user && $pwd) {
        $.getJSON("https://molegamecoelho.herokuapp.com/usuario", function ($registros) {
            if ($registros.find($usuario => $usuario.user == $user)) {
                alert(`Usuário "${$user}" já está em uso!`)
                $("input").val('');
            }
            else {
                let data = { user: $user, pwd: $pwd };
                axios.post("https://molegamecoelho.herokuapp.com/usuario", data);
                $("input").val('');
                alert("Usuário Cadastrado com Êxito!");
                window.open("index.html", "_self");
            }
        });
    }
    else alert("Erro: Por favor, informe o usuário e a senha!")
};

// Controle de Botões
$(document).ready(function () {
    $("#btnLogin").click($login)
    $("#user").keypress((e) => { if (e.which == 13) $login() });
    $("#pwd").keypress((e) => { if (e.which == 13) $login() });
    $("#btnCadastro").click($cadastro);
    $("#userc").keypress((e) => { if (e.which == 13) $cadastro() });
    $("#pwdc").keypress((e) => { if (e.which == 13) $cadastro() });
});
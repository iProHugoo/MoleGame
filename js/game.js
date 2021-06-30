const $levels = { "easy": 3, "medium": 5, "hard": 8 }; // Níveis
const $imgWidth = 72; // Largura da Toupeira
const $imgHeight = 56; // Altura da Toupeira
const $imgsTheme = { "default": "buraco.gif", "active": "toupeira.gif", "dead": "morreu.gif" }; // Img de Toupeiras
const $initialTime = 10; // Tempo de Jogo (Independente de Nível)
var $timeGame = $initialTime;
var $idChronoGame; // Controle de setInterval
var $idChronoStartGame; // Controle de setInterval

// Controle Geral e Botões
$(document).ready(function () {
    fillBoard();
    $("#chrono").text($initialTime);
    if (localStorage.getItem("usr")) $("#userLogado").text(JSON.parse(localStorage.getItem("usr")).user);
    $("#level").change(() => {
        if (getLevel()) $("#btnPlay").prop('disabled', false)
        else $("#btnPlay").prop('disabled', true);
    })
    $("#btnPlay").click(() => {
        btnCtrl();
        $idChronoStartGame = setInterval(startGame, 1180);
        $idChronoGame = setInterval(startChronoGame, 1000);
    });
    $("#btnPause").click(function () {
        clearInterval($idChronoGame);
        clearInterval($idChronoStartGame);
        $("#board").html("<p class='msgLevel'>Jogo Pausado</p>");
        $("#btnPlay").prop('disabled', false);
        $("#btnPause").prop('disabled', true);
    });
    $("#btnStop").click(() => endGame());
    $("#btnExit").click(() => logout());
});

// Sair do Jogo
function logout() {
    localStorage.clear();
    window.open("index.html", "_self")
}

// Iniciar o Cronômetro
function startChronoGame() {
    let $secondsFormat = (--$timeGame).toLocaleString("pt-br", { minimumIntegerDigits: 2 });
    ($timeGame >= 0) ? $("#chrono").text($secondsFormat) : endGame();
}

// Fim de Jogo
function endGame() {
    clearInterval($idChronoGame);
    clearInterval($idChronoStartGame);
    var $score = $("#score").text();
    alertWifi(`Fim de Jogo! Sua Pontuação: ${$score}`, false, 0, `img/${$imgsTheme.default}`, "50");
    fillBoard();
    saveScore($score);
}

// Salvar Pontuação
function saveScore($score) {
    let $usr = JSON.parse(localStorage.getItem("usr"));
    let $data = { "pontuacao": parseInt($score), "nivel": $("#level").val(), "usuario": $usr };

    axios.post("https://molegamecoelho.herokuapp.com/ranking", $data);
    $("#fecha").click(() => {
        location.reload();
    });
    $("#ranking").click(() => {
        window.open(`ranking.html?level=${$("#level").val()}`, "_self")
    });
    $("#logout").click(() => logout());
}

// Jogo
function startGame() {
    fillBoard();
    $randNumber = getRandNumber(1, Math.pow(getLevel(), 2));
    $(`#mole_${$randNumber}`).attr("src", `img/${$imgsTheme.active}`);

}

// Cria o Jogo de Acordo com a Dificuldade Selecionada
function fillBoard() {
    $level = getLevel();
    if ($level) {
        $boardWidth = $imgWidth * $level;
        $boardHeight = $imgHeight * $level;
        $("#board").css({ "width": $boardWidth, "height": $boardHeight });
        placeHolesBoard($level);
    } else {
        $("#board").html("<p class='msgLevel'>Escolha um Nível de Dificuldade</p>");
    }
}

// Insere os Buracos das Toupeiras
function placeHolesBoard($level) {
    $("#board").empty();
    for ($i = 0; $i < Math.pow($level, 2); $i++) {
        $div = $("<div></div>");
        $img = $("<img>").attr({ "src": `img/${$imgsTheme.default}`, "id": `mole_${$i + 1}` });
        $img.addClass("figura");
        $($img).click(function () { updateScore(this) });
        $($div).append($img);
        $("#board").append($div);
    }
}

// Atualiza Pontuação
function updateScore($img) {
    if ($($img).attr("src").includes($imgsTheme.active)) {
        $("#score").text(Number($("#score").text()) + 1);
        $($img).attr("src", `img/${$imgsTheme.dead}`);
    }
}

// Gera um Número Aleatório
function getRandNumber(min, max) {
    return Math.round((Math.random() * Math.abs(max - min)) + min);
}

// Puxa o Nível de Dificuldade
function getLevel() {
    return $levels[$("#level").val()];
}

// Propriedade dos Botões
function btnCtrl() {
    $("#btnPause").prop('disabled', false);
    $("#btnStop").prop('disabled', false);
    $("#btnPlay").prop('disabled', true);
    $("#level").prop('disabled', true);
}
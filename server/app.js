// importação de dependência(s)
const express = require("express");
const fs = require("fs");

// variáveis globais deste módulo
const PORT = 3000;
const db = {};
const app = express();


// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 1-4 linhas de código (você deve usar o módulo de filesystem (fs))
db.jogadores = JSON.parse(fs.readFileSync("server/data/jogadores.json"));
db.jogosPorJogador = JSON.parse(fs.readFileSync("server/data/jogosPorJogador.json"));


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???qual-templating-engine???');
//app.set('views', '???caminho-ate-pasta???');
// dica: 2 linhas
app.set("view engine", "hbs");
app.set("views", "server/views");


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json (~3 linhas)
app.get("/", (req, res) => {
    res.render("index", db.jogadores);
});


// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter ~15 linhas de código
app.get("/jogador/:numero_identificador/", (req, res) => {
    const numeroIdentificador = req.params.numero_identificador.replace(":", "");
    const perfilJogador = db.jogadores.players.filter(jogador => jogador.steamid === numeroIdentificador)[0];

    const jogosJogadorOrdenados = db.jogosPorJogador[numeroIdentificador].games.sort((a, b) => {
        if(a.playtime_forever < b.playtime_forever){
            return 1;
        }
        else if(a.playtime_forever === b.playtime_forever){
            return 0;
        }
        else{
            return -1;
        }
    }).slice(0, 5);
    console.log(jogosJogadorOrdenados);
    jogosJogadorOrdenados.forEach(jogo => {
        jogo.playtime_forever = parseInt(jogo.playtime_forever / 60);
    });
    const numJogosNaoJogados = jogosJogadorOrdenados.filter(jogo => jogo.playtime_forever === 0).length;

    res.render("jogador", {
        perfil: perfilJogador,
        idJogador: numeroIdentificador,
        totalJogos: db.jogosPorJogador[numeroIdentificador].game_count,
        naoJogados: numJogosNaoJogados,
        jogoMaisJogado: jogosJogadorOrdenados[0],
        jogos: jogosJogadorOrdenados
    });
});


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static("client"));


// abrir servidor na porta 3000 (constante PORT)
// dica: 1-3 linhas de código
app.listen(PORT, () => {
    console.log(`Servidor escutando na porta ${PORT}`);
});
// JavaScript Document
$(document).ready(function(){
  $('#iniciar').click(function(){
    $('#novoJogoContainer').hide();
    alterarNomes();
    iniciarJogo();
  });
  /**
   * #############################################################################
   * ### VARIAVEIS GLOBAIS
   * #############################################################################
   */
  const root = document.querySelector(':root');
  const rootStyles = getComputedStyle(root);
  const larguraBoneco = parseInt(rootStyles.getPropertyValue('--boneco--width'));
  const alturaBoneco = parseInt(rootStyles.getPropertyValue('--boneco--height'));
  const alturaCampo = parseInt(rootStyles.getPropertyValue('--campo--height'));
  const larguraCampo = parseInt(rootStyles.getPropertyValue('--campo--width'));
  const bolaSize = parseInt(rootStyles.getPropertyValue('--bola--size'));
  const grPadding = parseInt(rootStyles.getPropertyValue('--gr--padding'));
  const maxScore = 2;
  var nomeEquipaA = "A";
  var nomeEquipaB = "B";

  const campo = {
    xMin: -300,
    xMax: 300,
    yMin: -216.5,
    yMax: 216.5
  };

  const baliza = {
    xEsq: campo.xMin,
    xDta: campo.xMax,
    yMin: -70,
    yMax: 60
  };

  const TECLA = {
    Q: 81,
    W: 87,
    E: 69,
    R: 82,
    A: 65,
    S: 83,
    D: 68,
    F: 70,
    U: 85,
    I: 73,
    O: 79,
    P: 80,
    J: 74,
    K: 75,
    L: 76,
    Ç: 192

  };

  var marcador = {
    scoreA: 0,
    scoreB: 0
  };

  var matrecos = {
    teclasPressionadas: [],
    bola: {
      velocidade: 3, //quantos pixeis move a bola de cada vez
      x: 0,
      y: 0,
      direcX: 1, //quando a direcção é 1 a bola move-se no sentido positivo do eixo
      direcY: 1
    }
  };

  /**
   * Actualiza nomes das equipas
   */
  function alterarNomes (){
    nomeEquipaA = $("#nomeEquipaA").val() === '' ? nomeEquipaA : $("#nomeEquipaA").val();
    nomeEquipaB = $('#nomeEquipaB').val() === '' ? nomeEquipaB : $("#nomeEquipaB").val();

      $('#equipaA').text("Equipa " + nomeEquipaA + ": ");
      $('#equipaB').text("Equipa " + nomeEquipaB + ": ");
  }

  /**
   * Inicia um novo jogo
   */
  function iniciarJogo () {
    matrecos.timer = setInterval(gameloop, 30);

    $(document).keydown(function (e) {
      matrecos.teclasPressionadas[e.which] = true;
    });

    $(document).keyup(function (e) {
      matrecos.teclasPressionadas[e.which] = false;
    });
  };

  /**
   * Loop do jogo
   */
  function gameloop() {
    moveBola();
    moveJogadores();
  }

  function pararJogo(){
    var bola = matrecos.bola;
    

   bola= {
    velocidade: 0,
    x: 0,
    y: 0,
    direcX: 0, 
    direcY: 0
   }
   clearInterval(matrecos.timer);
  }
  /**
   * #############################################################################
   * ### MOVE BOLA
   * #############################################################################
   */

  /**
   * Move a bola
   */
  function moveBola() {

    var bola = matrecos.bola;

    /** Equacao responsavel pelo movimento lógico da bola */
    bola.x += bola.velocidade * bola.direcX;
    bola.y += bola.velocidade * bola.direcY;
    $('.bola').css({
      'left': bola.x,
      'top': bola.y
    });

    /**
     * #######################################################
     * ### CHOQUE DA BOLA NOS LIMITES DO CAMPO
     * #######################################################
     */
    bateLimitesCampo();

    /**
     * #######################################################
     * ### CHOQUE DA BOLA NOS JOGADORES
     * #######################################################
     */
    bateJogadores();

  }

  /**
   * Mudanca de direcao ao bater nos limites do campo
   */
  function bateLimitesCampo() {
    var bola = matrecos.bola;

    //verifica limite inferior do campo
    if (movBolaY() >= campo.yMax) {
      bola.direcY = -1;
    }

    //verifica limite superior do campo
    if (movBolaY() <= campo.yMin) {
      bola.direcY = 1;
    }

    //verifica limite direito do campo
    if (movBolaX() >= campo.xMax) {
      if (movBolaY() >= baliza.yMin && movBolaY() <= baliza.yMax) {
        goloA();
      } else {
        bola.direcX = -1;
      }
    }

    //verifica limite esquerdo do campo
    if (movBolaX() <= campo.xMin) {
      if (movBolaY() >= baliza.yMin && movBolaY() <= baliza.yMax) {
        goloB();
      } else {
        bola.direcX = 1;
      }
    }
  }

  /**
   * Golo equipa A
   */
  function goloA() {
    resetBola(-1);
    marcador.scoreA++;
    setMarcador(marcador.scoreA, marcador.scoreB);

    vencedor(marcador.scoreA, nomeEquipaA);
  }

  /**
   * Golo equipa B
   */
  function goloB() {
    resetBola(1);
    marcador.scoreB++;
    setMarcador(marcador.scoreA, marcador.scoreB);

    vencedor(marcador.scoreB, nomeEquipaB);
  }

  /**
   * Reset da posição da bola
   * @param direccao
   */
  function resetBola(direccao) {
    var bola = matrecos.bola;

    bola.x = 0;
    bola.y = 0;

    $('.bola').css({
      'left': bola.x,
      'top': bola.y
    });

    bola.direcX = direccao;
  }

  /**
   * Verifica se ha um vencedor
   * @param score
   * @param equipa
   */
  function vencedor(score, equipa) {
    if (score === maxScore) {
      resetMarcador();
      $('#winnerContainer').show();
      $('#vencedor').text("A equipa " + equipa + " ganhou.");
      pararJogo();
    }
  }

  /**
   * Reset do marcador
   */
  function resetMarcador() {
    marcador.scoreA = 0;
    marcador.scoreB = 0;
    setMarcador(marcador.scoreA, marcador.scoreB);
  }

  /**
   * Set do marcador
   * @param scoreA pontuacao equipa A
   * @param scoreB pontuacao equipa B
   */
  function setMarcador(scoreA, scoreB) {
    $('#scoreA').html(scoreA);
    $('#scoreB').html(scoreB);
  }

  /**
   * Mudança de direccao da bola ao bater nos jogadores
   */
  function bateJogadores(){
    /** Nº de divs no campo */
    const n = 9;
    /** Espaçamento entre divs */
    const divSpacing = (larguraCampo - (n * larguraBoneco) - (2 * grPadding)) / (n - 1);
    /** Espaçamento entre defesas */
    const defSpacing = calculaSpacing('.defesaEquipaA', 2);
    /** Espaçamento entre medios */
    const mediosSpacing = calculaSpacing('.mediosEquipaA', 5);
    /** Espaçamento entre avançados */
    const avancadosSpacing = calculaSpacing('.avancadosEquipaA', 3);

    /**
     * Calcula espaçamento vertical entre bonecos de um grupo
     *
     * @param el elemento
     * @param n Nº de bonecos na div
     */
    function calculaSpacing(el, n) {
      return (parseInt($(el).css('height')) - n * alturaBoneco) / (n - 1);
    }

    /**
     * #######################
     * ### EQUIPA A
     * #######################
     */
    /** GR */
    const grADir = campo.xMin + larguraBoneco + grPadding;
    const grACima = calculaCimaJogador1('.grEquipaA');
    const grABaixo = grACima + alturaBoneco;
    mudaDirecaoPositiva(grADir, grACima, grABaixo);

    /** DEFESAS */
    const defADir = grADir + larguraBoneco + divSpacing;
    // Defesa 1
    const def1ACima = calculaCimaJogador1('.defesaEquipaA');
    const def1ABaixo = def1ACima + alturaBoneco;
    mudaDirecaoPositiva(defADir, def1ACima, def1ABaixo);
    // Defesa 2
    const def2ACima = def1ABaixo + defSpacing;
    const def2ABaixo = def2ACima + alturaBoneco;
    mudaDirecaoPositiva(defADir, def2ACima, def2ABaixo);

    /** MEDIOS */
    const medADir = defADir + 2 * (larguraBoneco + divSpacing);
    // Medio 1
    const med1ACima = calculaCimaJogador1('.mediosEquipaA');
    const med1ABaixo = med1ACima + alturaBoneco;
    mudaDirecaoPositiva(medADir, med1ACima, med1ABaixo);
    // Medio 2
    const med2ACima = med1ABaixo + mediosSpacing;
    const med2ABaixo = med2ACima + alturaBoneco;
    mudaDirecaoPositiva(medADir, med2ACima, med2ABaixo);
    // Medio 3
    const med3ACima = med2ABaixo + mediosSpacing;
    const med3ABaixo = med3ACima + alturaBoneco;
    mudaDirecaoPositiva(medADir, med3ACima, med3ABaixo);
    // Medio 4
    const med4ACima = med3ABaixo + mediosSpacing;
    const med4ABaixo = med4ACima + alturaBoneco;
    mudaDirecaoPositiva(medADir, med4ACima, med4ABaixo);
    // Medio 5
    const med5ACima = med4ABaixo + mediosSpacing;
    const med5ABaixo = med5ACima + alturaBoneco;
    mudaDirecaoPositiva(medADir, med5ACima, med5ABaixo);

    /** AVANÇADOS */
    const avADir = medADir + 2 * larguraBoneco + bolaSize + 3 * divSpacing;
    // Avancado 1
    const av1ACima = calculaCimaJogador1('.avancadosEquipaA');
    const av1ABaixo = av1ACima + alturaBoneco;
    mudaDirecaoPositiva(avADir, av1ACima, av1ABaixo);
    // Avancado 2
    const av2ACima = av1ABaixo + avancadosSpacing;
    const av2ABaixo = av2ACima + alturaBoneco;
    mudaDirecaoPositiva(avADir, av2ACima, av2ABaixo);
    // Avancado 3
    const av3ACima = av2ABaixo + avancadosSpacing;
    const av3ABaixo = av3ACima + alturaBoneco;
    mudaDirecaoPositiva(avADir, av3ACima, av3ABaixo);

    /**
     * #######################
     * ### EQUIPA B
     * #######################
     */
    /** GR */
    const grBEsq = campo.xMax - larguraBoneco - grPadding;
    const grBCima = calculaCimaJogador1('.grEquipaB');
    const grBBaixo = grBCima + alturaBoneco;
    mudaDirecaoNegativa(grBEsq, grBCima, grBBaixo);

    /** DEFESAS */
    const defBEsq = grBEsq - larguraBoneco - divSpacing;
    // Defesa 1
    const def1BCima = calculaCimaJogador1('.defesaEquipaB');
    const def1BBaixo = def1BCima + alturaBoneco;
    mudaDirecaoNegativa(defBEsq, def1BCima, def1BBaixo);
    // Defesa 2
    const def2BCima = def1BBaixo + defSpacing;
    const def2BBaixo = def2BCima + alturaBoneco;
    mudaDirecaoNegativa(defBEsq, def2BCima, def2BBaixo);

    /** MEDIOS */
    const medBEsq = defBEsq - 2 * (larguraBoneco + divSpacing);
    // Medio 1
    const med1BCima = calculaCimaJogador1('.mediosEquipaB');
    const med1BBaixo = med1BCima + alturaBoneco;
    mudaDirecaoNegativa(medBEsq, med1BCima, med1BBaixo);
    // Medio 2
    const med2BCima = med1BBaixo + mediosSpacing;
    var med2BBaixo = med2BCima + alturaBoneco;
    mudaDirecaoNegativa(medBEsq, med2BCima, med2BBaixo);
    // Medio 3
    const med3BCima = med2BBaixo + mediosSpacing;
    const med3BBaixo = med3BCima + alturaBoneco;
    mudaDirecaoNegativa(medBEsq, med3BCima, med3BBaixo);
    // Medio 4
    const med4BCima = med3BBaixo + mediosSpacing;
    const med4BBaixo = med4BCima + alturaBoneco;
    mudaDirecaoNegativa(medBEsq, med4BCima, med4BBaixo);
    // Medio 5
    const med5BCima = med4BBaixo + mediosSpacing;
    const med5BBaixo = med5BCima + alturaBoneco;
    mudaDirecaoNegativa(medBEsq, med5BCima, med5BBaixo);

    /** AVANÇADOS */
    const avBEsq = medBEsq - 2 * larguraBoneco - bolaSize - 3 * divSpacing;
    // Avancado 1
    const av1BCima = calculaCimaJogador1('.avancadosEquipaB');
    const av1BBaixo = av1BCima + alturaBoneco;
    mudaDirecaoNegativa(avBEsq, av1BCima, av1BBaixo);
    // Avancado 2
    const av2BCima = av1BBaixo + avancadosSpacing;
    const av2BBaixo = av2BCima + alturaBoneco;
    mudaDirecaoNegativa(avBEsq, av2BCima, av2BBaixo);
    // Avancado 3
    const av3BCima = av2BBaixo + avancadosSpacing;
    const av3BBaixo = av3BCima + alturaBoneco;
    mudaDirecaoNegativa(avBEsq, av3BCima, av3BBaixo);

    /**
     * Mudança de direcao da bola ao bater nos jogadores da Equipa A
     *
     * @param limDireita limite direito do jogador A
     * @param limCima limite superior do jogador A
     * @param limBaixo limite inferior do jogador A
     */
    function mudaDirecaoPositiva(limDireita, limCima, limBaixo) {
      var bola = matrecos.bola;
      if (bola.direcX === -1) {
        if (movBolaX() <= limDireita && movBolaX() >= limDireita - larguraBoneco) {
          if (movBolaY() >= limCima && movBolaY() <= limBaixo) {
            bola.direcX = 1;
          }
        }
      }
    }

    /**
     * Mudança de direcao da bola ao bater nos jogadores da Equipa B
     *
     * @param limEsquerda limite esquerdo do jogador B
     * @param limCima limite superior do jogador B
     * @param limBaixo limite inferior do jogador B
     */
    function mudaDirecaoNegativa(limEsquerda, limCima, limBaixo) {
      var bola = matrecos.bola;
      if (bola.direcX === 1) {
        if (movBolaX() >= limEsquerda && movBolaX() <= limEsquerda
            + larguraBoneco) {
          if (movBolaY() >= limCima && movBolaY() <= limBaixo) {
            bola.direcX = -1;
          }
        }
      }
    }
  }

  /**
   * Movimento da bola na direcao Y
   * @returns posicao Y da bola após movimento
   */
  function movBolaY() {
    var bola = matrecos.bola;
    return bola.y + bola.velocidade * bola.direcY;
  }

  /**
   * Movimento da bola na direcao X
   * @returns posicao X da bola após movimento
   */
  function movBolaX() {
    var bola = matrecos.bola;
    return bola.x + bola.velocidade * bola.direcX;
  }

  /**
   * Calcula o topo do jogador 1 de cada grupo
   * @param el elemento
   */
  function calculaCimaJogador1(el) {
    return campo.yMin + (alturaCampo - parseInt($(el).css('height'))) / 2
        + parseInt($(el).css('top'));
  }

  /**
   * Calcula o topo real da div grupo
   * @param el elemento
   */
  function calculaTopoDiv(el, limSup) {
    return limSup - campo.yMin - (alturaCampo - parseInt($(el).css('height'))) / 2;
  }

  /**
   * Move jogadores verticalmente
   */
  function moveJogadores() {

    // console.log(matrecos.teclasPressionadas[TECLA.Ç]);

    var movimento = 5;
    /**
     * #######################
     * ### EQUIPA A
     * #######################
     */
    deslocacao('.grEquipaA', TECLA.Q, -movimento);
    deslocacao('.grEquipaA', TECLA.A, movimento);
    limiteCampoJogador('.grEquipaA', baliza.yMin, baliza.yMax);
    deslocacao('.defesaEquipaA', TECLA.W, -movimento);
    deslocacao('.defesaEquipaA', TECLA.S, movimento);
    limiteCampoJogador('.defesaEquipaA', campo.yMin, campo.yMax);
    deslocacao('.mediosEquipaA', TECLA.E, -movimento);
    deslocacao('.mediosEquipaA', TECLA.D, movimento);
    limiteCampoJogador('.mediosEquipaA', campo.yMin, campo.yMax);
    deslocacao('.avancadosEquipaA', TECLA.R, -movimento);
    deslocacao('.avancadosEquipaA', TECLA.F, movimento);
    limiteCampoJogador('.avancadosEquipaA', campo.yMin, campo.yMax);

    /**
     * #######################
     * ### EQUIPA B
     * #######################
     */
    deslocacao('.grEquipaB', TECLA.P, -movimento);
    deslocacao('.grEquipaB', TECLA.Ç, movimento);
    limiteCampoJogador('.grEquipaB', baliza.yMin, baliza.yMax);
    deslocacao('.defesaEquipaB', TECLA.O, -movimento);
    deslocacao('.defesaEquipaB', TECLA.L, movimento);
    limiteCampoJogador('.defesaEquipaB', campo.yMin, campo.yMax);
    deslocacao('.mediosEquipaB', TECLA.I, -movimento);
    deslocacao('.mediosEquipaB', TECLA.K, movimento);
    limiteCampoJogador('.mediosEquipaB', campo.yMin, campo.yMax);
    deslocacao('.avancadosEquipaB', TECLA.U, -movimento);
    deslocacao('.avancadosEquipaB', TECLA.J, movimento);
    limiteCampoJogador('.avancadosEquipaB', campo.yMin, campo.yMax);

    /**
     * Deslocaçao dos jogadores
     * @param el elemento a deslocar
     * @param tecla tecla pressionada
     * @param mov distancia a deslocar
     */
    function deslocacao(el, tecla, mov) {
      if (matrecos.teclasPressionadas[tecla]) {
        var topo = parseInt($(el).css('top'));
        $(el).css('top', topo + mov);
      }
    }

    /**
     * Limita o movimento dos jogadores aos limites do campo
     * @param el elemento a limitar
     * @param limSup limite superior
     * @param limInf limite inferior
     */
    function limiteCampoJogador(el, limSup, limInf) {
      const topo = calculaCimaJogador1(el);
      const altura = parseInt($(el).css('height'));
      const baixo = topo + altura;
      if (topo <= limSup) {
        $(el).css('top', calculaTopoDiv(el, limSup));
      }
      if (baixo >= limInf) {
        $(el).css('top', calculaTopoDiv(el, limInf - altura));
      }
    }
  }
});

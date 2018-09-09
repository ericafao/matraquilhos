// JavaScript Document

var root = document.querySelector(':root');
var rootStyles = getComputedStyle(root);
var larguraBoneco = parseInt(rootStyles.getPropertyValue('--boneco--width'));
var alturaBoneco = parseInt(rootStyles.getPropertyValue('--boneco--height'));
var alturaCampo = parseInt(rootStyles.getPropertyValue('--campo--height'));
var larguraCampo = parseInt(rootStyles.getPropertyValue('--campo--width'));
var bolaSize = parseInt(rootStyles.getPropertyValue('--bola--size'));
var grPadding = parseInt(rootStyles.getPropertyValue('--gr--padding'));

var campo = {
  xMin: -300,
  xMax: 300,
  yMin: -216.5,
  yMax: 216.5
};
var baliza = {
  xEsq: campo.xMin,
  xDta: campo.xMax,
  yMin: -70,
  yMax: 65
};

var TECLA = {
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
  Ç: 186

}

var marcador = {
  scoreA: 0,
  scoreB: 0
};

var matrecos = {};
matrecos.teclasPressionadas = [];
matrecos.bola = {
  velocidade: 3, //quantos pixeis move a bola de cada vez
  x: 0,
  y: 0,
  direcX: 1, //quando a direcção é 1 a bola move-se no sentido positivo do eixo
  direcY: 1
};

$(function () {

  matrecos.timer = setInterval(gameloop, 30);

  $(document).keydown(function (e) {
    matrecos.teclasPressionadas[e.which] = true;
  });

  $(document).keyup(function (e) {
    matrecos.teclasPressionadas[e.which] = false;
  });
});

/**
 * Loop de jogo
 */
function gameloop() {
  moveBola();
  moveBonecos();
}

/**
 * Movimento da bola na direcao Y
 * @returns posicao Y da bola após movimento
 */
function movBolaY(){
  var bola = matrecos.bola;
  return bola.y + bola.velocidade * bola.direcY;
}

/**
 * Movimento da bola na direcao X
 * @returns posicao X da bola após movimento
 */
function movBolaX(){
  var bola = matrecos.bola;
  return bola.x + bola.velocidade * bola.direcX;
}

/**
 * Mudanca de direcao ao bater nos limites do campo
 */
function bateLimitesCampo(){
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
    if (movBolaY()>= baliza.yMin && movBolaY()<= baliza.yMax) {
      goloA();
    } else {
      bola.direcX = -1;
    }
  }

  //verifica limite esquerdo do campo
  if (movBolaX() <= campo.xMin) {
    if (movBolaY()>= baliza.yMin && movBolaY()<= baliza.yMax) {
      goloB();
    } else {
      bola.direcX = 1;
    }
  }
}

/**
 * Mudança de direcao da bola ao bater nos jogadores da Equipa A
 *
 * @param limDireita limite direito do jogador A
 * @param limCima limite superior do jogador A
 * @param limBaixo limite inferior do jogador A
 */
function mudaDirecaoPositiva(limDireita, limCima, limBaixo){
  var bola = matrecos.bola;
  if(bola.direcX === -1){
    if (movBolaX()<= limDireita && movBolaX()>= limDireita - larguraBoneco) {
      if (movBolaY()>= limCima && movBolaY()<= limBaixo) {
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
function mudaDirecaoNegativa(limEsquerda, limCima, limBaixo){
  var bola = matrecos.bola;
  if(bola.direcX === 1){
    if (movBolaX()>= limEsquerda && movBolaX()<= limEsquerda + larguraBoneco) {
      if (movBolaY()>= limCima && movBolaY()<= limBaixo) {
        bola.direcX = -1;
      }
    }
  }
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

  /**
   * #######################################################
   * ### CHOQUE DA BOLA NOS JOGADORES
   * #######################################################
   */
  // Nº de divs no campo
  var n = 9;
  // Espaçamento entre divs
  var divSpacing = (larguraCampo-(n*larguraBoneco)-(2*grPadding))/(n-1);
  // Espaçamento entre defesas
  var defSpacing = calculaSpacing('.defesaEquipa1', 2);
  // Espaçamento entre medios
  var mediosSpacing = calculaSpacing('.mediosEquipa1', 5);;
  // Espaçamento entre avançados
  var avancadosSpacing = calculaSpacing('.avancadosEquipa1', 3);

  /**
   * Calcula espaçamento vertical entre bonecos de um grupo
   * 
   * @param el elemento
   * @param n Nº de bonecos na div
   */
  function calculaSpacing(el, n){
    return (parseInt($(el).css('height')) - n*alturaBoneco)/(n-1);
  }

  /**
   * #######################
   * ### EQUIPA A
   * #######################
   */

  /** GR */
  var grADir = campo.xMin + larguraBoneco + grPadding;
  var grACima = calculaCimaJogador1('.grEquipa1'); 
  var grABaixo = grACima + alturaBoneco;
  mudaDirecaoPositiva(grADir, grACima, grABaixo);

  /** DEFESAS */
  var defADir = grADir + larguraBoneco + divSpacing;
  // Defesa 1
  var def1ACima = calculaCimaJogador1('.defesaEquipa1'); 
  var def1ABaixo = def1ACima + alturaBoneco;
  mudaDirecaoPositiva(defADir, def1ACima, def1ABaixo);
  // Defesa 2
  var def2ACima = def1ABaixo + defSpacing;
  var def2ABaixo = def2ACima + alturaBoneco;
  mudaDirecaoPositiva(defADir, def2ACima, def2ABaixo);

  /** MEDIOS */
  var medADir = defADir + 2*(larguraBoneco + divSpacing);
  // Medio 1
  var med1ACima = calculaCimaJogador1('.mediosEquipa1');
  var med1ABaixo = med1ACima + alturaBoneco;
  mudaDirecaoPositiva(medADir, med1ACima, med1ABaixo);
  // Medio 2
  var med2ACima = med1ABaixo + mediosSpacing;
  var med2ABaixo = med2ACima + alturaBoneco;
  mudaDirecaoPositiva(medADir, med2ACima, med2ABaixo);
  // Medio 3
  var med3ACima = med2ABaixo + mediosSpacing;
  var med3ABaixo = med3ACima + alturaBoneco;
  mudaDirecaoPositiva(medADir, med3ACima, med3ABaixo);
  // Medio 4
  var med4ACima = med3ABaixo + mediosSpacing;
  var med4ABaixo = med4ACima + alturaBoneco;
  mudaDirecaoPositiva(medADir, med4ACima, med4ABaixo);
  // Medio 5
  var med5ACima = med4ABaixo + mediosSpacing;
  var med5ABaixo = med5ACima + alturaBoneco;
  mudaDirecaoPositiva(medADir, med5ACima, med5ABaixo);

  /** AVANÇADOS */
  var avADir = medADir + 2*larguraBoneco + bolaSize + 3*divSpacing;
  // Avançado 1
  var av1ACima = calculaCimaJogador1('.avancadosEquipa1');
  var av1ABaixo = av1ACima + alturaBoneco;
  mudaDirecaoPositiva(avADir, av1ACima, av1ABaixo);
  // Avançado 2
  var av2ACima = av1ABaixo + avancadosSpacing;
  var av2ABaixo = av2ACima + alturaBoneco;
  mudaDirecaoPositiva(avADir, av2ACima, av2ABaixo);
  // Avançado 3
  var av3ACima = av2ABaixo + avancadosSpacing;
  var av3ABaixo = av3ACima + alturaBoneco;
  mudaDirecaoPositiva(avADir, av3ACima, av3ABaixo);

   /**
   * #######################
   * ### EQUIPA B
   * #######################
   */

  /** GR */
  var grBEsq = campo.xMax - larguraBoneco - grPadding;
  var grBCima = calculaCimaJogador1('.grEquipa2'); 
  var grBBaixo = grBCima + alturaBoneco;
  mudaDirecaoNegativa(grBEsq, grBCima, grBBaixo);

  /** DEFESAS */
  var defBEsq = grBEsq - larguraBoneco - divSpacing;
  // Defesa 1
  var def1BCima = calculaCimaJogador1('.defesaEquipa2'); 
  var def1BBaixo = def1BCima + alturaBoneco;
  mudaDirecaoNegativa(defBEsq, def1BCima, def1BBaixo);
  // Defesa 2
  var def2BCima = def1BBaixo + defSpacing;
  var def2BBaixo = def2BCima + alturaBoneco;
  mudaDirecaoNegativa(defBEsq, def2BCima, def2BBaixo);

  /** MEDIOS */
  var medBEsq = defBEsq - 2*(larguraBoneco + divSpacing);
  // Médio 1
  var med1BCima = calculaCimaJogador1('.mediosEquipa2'); 
  var med1BBaixo = med1BCima + alturaBoneco;
  mudaDirecaoNegativa(medBEsq, med1BCima, med1BBaixo);
  // Médio 2
  var med2BCima = med1BBaixo + mediosSpacing;
  var med2BBaixo = med2BCima + alturaBoneco;
  mudaDirecaoNegativa(medBEsq, med2BCima, med2BBaixo);
  // Médio 3
  var med3BCima = med2BBaixo + mediosSpacing;
  var med3BBaixo = med3BCima + alturaBoneco;
  mudaDirecaoNegativa(medBEsq, med3BCima, med3BBaixo);
  // Médio 4
  var med4BCima = med3BBaixo + mediosSpacing;
  var med4BBaixo = med4BCima + alturaBoneco;
  mudaDirecaoNegativa(medBEsq, med4BCima, med4BBaixo);
  // Médio 5
  var med5BCima = med4BBaixo + mediosSpacing;
  var med5BBaixo = med5BCima + alturaBoneco;
  mudaDirecaoNegativa(medBEsq, med5BCima, med5BBaixo);

  /** AVANÇADOS */
  var avBEsq = medBEsq - 2*larguraBoneco - bolaSize - 3*divSpacing;
  // Avançado 1
  var av1BCima = calculaCimaJogador1('.avancadosEquipa2'); 
  var av1BBaixo = av1BCima + alturaBoneco;
  mudaDirecaoNegativa(avBEsq, av1BCima, av1BBaixo);
  // Avançado 2
  var av2BCima = av1BBaixo + avancadosSpacing;
  var av2BBaixo = av2BCima + alturaBoneco;
  mudaDirecaoNegativa(avBEsq, av2BCima, av2BBaixo);
  // Avançado 3
  var av3BCima = av2BBaixo + avancadosSpacing;
  var av3BBaixo = av3BCima + alturaBoneco;
  mudaDirecaoNegativa(avBEsq, av3BCima, av3BBaixo);  

  //equação responsavel pelo movimento logico da bola

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
}

  /**
   * Calcula o topo do jogador 1 de cada grupo
   * @param el elemento
   */
  function calculaCimaJogador1(el){
    return campo.yMin + (alturaCampo - parseInt($(el).css('height')))/2 + parseInt($(el).css('top'));
  }

  /**
   * Calcula o topo real da div grupo
   * @param el elemento
   */
  function calculaTopoDiv(el, limSup){
    return limSup - campo.yMin - (alturaCampo - parseInt($(el).css('height')))/2 ;
  }

/**
 * Golo equipa B
 */
function goloB(){
  resetBola(1);
  marcador.scoreB++;
  alert(marcador.scoreB);
  $('#scoreB').html(marcador.scoreB);

  vencedor(marcador.scoreB, "B");
}

/**
 * Golo equipa A
 */
function goloA(){
  resetBola(-1);
  marcador.scoreA++;
  alert(marcador.scoreA);
  $('#scoreA').html(marcador.scoreA);

  vencedor(marcador.scoreA, "A");
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
function vencedor(score, equipa){
  if(score === 10){
    alert("A equipa " + equipa + " ganhou.");
    resetMarcador();
    setScore(marcador.scoreA, marcador.scoreB);
  }
}

/**
 * Reset do marcador
 */
function resetMarcador(){
  marcador.scoreA = 0;
  marcador.scoreB = 0;
}

function setScore(scoreA,scoreB) {
  $('#scoreA').html(scoreA);
  $('#scoreB').html(scoreB);
}

/**
 * Move bonecos verticalmente
 */
function moveBonecos() {

  console.log(matrecos.teclasPressionadas[TECLA.Ç]);

  var movimento = 5;
  /** EQUIPA A */
  deslocacao('.grEquipa1', TECLA.Q, -movimento);
  deslocacao('.grEquipa1', TECLA.A, movimento);
  limiteCampoJogador('.grEquipa1', baliza.yMin, baliza.yMax);
  deslocacao('.defesaEquipa1', TECLA.W, -movimento);
  deslocacao('.defesaEquipa1', TECLA.S, movimento);
  limiteCampoJogador('.defesaEquipa1', campo.yMin, campo.yMax);
  deslocacao('.mediosEquipa1', TECLA.E, -movimento);
  deslocacao('.mediosEquipa1', TECLA.D, movimento);
  limiteCampoJogador('.mediosEquipa1', campo.yMin, campo.yMax);
  deslocacao('.avancadosEquipa1', TECLA.R, -movimento);
  deslocacao('.avancadosEquipa1', TECLA.F, movimento);
  limiteCampoJogador('.avancadosEquipa1', campo.yMin, campo.yMax);

  /** EQUIPA B */
  deslocacao('.grEquipa2', TECLA.P, -movimento);
  deslocacao('.grEquipa2', TECLA.Ç, movimento);
  limiteCampoJogador('.grEquipa2', baliza.yMin, baliza.yMax);
  deslocacao('.defesaEquipa2', TECLA.O, -movimento);
  deslocacao('.defesaEquipa2', TECLA.L, movimento);
  limiteCampoJogador('.defesaEquipa2', campo.yMin, campo.yMax);
  deslocacao('.mediosEquipa2', TECLA.I, -movimento);
  deslocacao('.mediosEquipa2', TECLA.K, movimento);
  limiteCampoJogador('.mediosEquipa2', campo.yMin, campo.yMax);
  deslocacao('.avancadosEquipa2', TECLA.U, -movimento);
  deslocacao('.avancadosEquipa2', TECLA.J, movimento);
  limiteCampoJogador('.avancadosEquipa2', campo.yMin, campo.yMax);

  function deslocacao(el, tecla, mov){
    if(matrecos.teclasPressionadas[tecla]){
      var topo = parseInt($(el).css('top'));
      $(el).css('top', topo + mov);
    }
  }
  function limiteCampoJogador(el, limSup, limInf){
    var topo = calculaCimaJogador1(el);
    var altura = parseInt($(el).css('height'));
    var baixo = topo + altura;
      if(topo <= limSup){
        $(el).css('top', calculaTopoDiv(el, limSup));
      }
      if(baixo >= limInf){
        $(el).css('top', calculaTopoDiv(el, limInf-altura));
      }
    }
}


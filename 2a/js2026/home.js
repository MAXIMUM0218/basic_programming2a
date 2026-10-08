var beforePos = 0;//スクロールの値の比較用の設定

//スクロール途中でヘッダーが消え、上にスクロールすると復活する設定を関数にまとめる
function ScrollAnime() {
    var elemTop = $('#area-1').offset().top;//#area-1の位置まできたら
  var scroll = $(window).scrollTop();
    //ヘッダーの出し入れをする
    // if(scroll == beforePos) {
    // //IE11対策で処理を入れない
    // }else if(elemTop > scroll || 0 > scroll - beforePos){
    // //ヘッダーが上から出現する
    // $('#header').removeClass('UpMove'); //#headerにUpMoveというクラス名を除き
    // $('#header').addClass('DownMove');//#headerにDownMoveのクラス名を追加
    // }else {
    // //ヘッダーが上に消える
    //     $('#header').removeClass('DownMove');//#headerにDownMoveというクラス名を除き
    // $('#header').addClass('UpMove');//#headerにUpMoveのクラス名を追加
    // }
    
    beforePos = scroll;//現在のスクロール値を比較用のbeforePosに格納
}


// 画面をスクロールをしたら動かしたい場合の記述
$(window).scroll(function () {
  ScrollAnime();//スクロール途中でヘッダーが消え、上にスクロールすると復活する関数を呼ぶ
});

// ページが読み込まれたらすぐに動かしたい場合の記述
$(window).on('load', function () {
  ScrollAnime();//スクロール途中でヘッダーが消え、上にスクロールすると復活する関数を呼ぶ
});




    var headerH = $("#header").outerHeight(true);//headerの高さを取得    
    $('#g-navi li a').click(function () {
  var elmHash = $(this).attr('href'); 
  var pos = $(elmHash).offset().top-headerH;//header分の高さを引いた高さまでスクロール
  $('body,html').animate({scrollTop: pos}, 1000);
  return false;
});

    function mediaQueriesWin(){
  var width = $(window).width();
  if(width <= 768) {//横幅が768px以下の場合
    $(".has-child>a").off('click'); //has-childクラスがついたaタグのonイベントを複数登録を避ける為offにして一旦初期状態へ
    $(".has-child>a").on('click', function() {//has-childクラスがついたaタグをクリックしたら
      var parentElem =  $(this).parent();// aタグから見た親要素の<li>を取得し
      $(parentElem).toggleClass('active');//矢印方向を変えるためのクラス名を付与して
      $(parentElem).children('ul').stop().slideToggle(100);//liの子要素のスライドを開閉させる※数字が大きくなるほどゆっくり開く
      return false;//リンクの無効化
    });
  }else{//横幅が768px以上の場合
    $(".has-child>a").off('click');//has-childクラスがついたaタグのonイベントをoff(無効)にし
    $(".has-child").removeClass('active');//activeクラスを削除
    $('.has-child').children('ul').css("display","");//スライドトグルで動作したdisplayも無効化にする
  }
}

// ページがリサイズされたら動かしたい場合の記述
$(window).resize(function() {
  mediaQueriesWin();/* ドロップダウンの関数を呼ぶ*/
});

// ページが読み込まれたらすぐに動かしたい場合の記述
$(window).on('load',function(){
  mediaQueriesWin();/* ドロップダウンの関数を呼ぶ*/
});

function conversationAnime() {
  $('.conversation').each(function() {
    var elemPos = $(this).offset().top - 50;
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    var thisChild = "";
    if (scroll >= elemPos - windowHeight) {
      thisChild = $(this).children();

      thisChild.each(function(i) {
        var time = 100;
            
        
        $(this).delay(time * i).fadeIn(time);
      });
    } else {
      thisChild = $(this).children();
      thisChild.each(function() {
        $(this).stop();
        $(this).css("display", "none");
      });
    }
  });
}

$(window).scroll(function() {
  conversationAnime();
});

$(window).on('load', function() {

  var element = $(".conversation");
  element.each(function() {
    var text = $(this).html();
    var textbox = "";
    text.split('').forEach(function (t) {
      if (t !== " ") {
        textbox += '<span>' + t + '</span>';
      } else {
        textbox += t;
      }
    });
    $(this).html(textbox);

  });

  conversationAnime();
})

//画面の高さ
const screenHeight = window.innerHeight;

const apperPoint = screenHeight * 0.6;

window.addEventListener("scroll", ()=> {
  const box =document.querySelectorAll(".box");

  for(let i = 0; i < box.length; i++) {
    const element= box[i];

    const elementHeightTotop = element.getBoundingClientRect().top;

    if(elementHeightTotop < apperPoint){
      element.classList.add("active");
    }else {
      element.classList.remove("active");
    }
  }
})

function fadeAnime() {
$('.fadeUpTrigger').each(function() {
  var elemPos = $(this).offset().top - 50;
  var scroll = $(window).scrollTop();
  var windowHeight = $(window).height();
  if (scroll >= elemPos - windowHeight){
    $(this).addClass('fadeUp');
  } 
  });
}

$(window).scroll(function() {
  fadeAnime();
});

$(window).on('load', function() {
  fadeAnime();
});

$(function(){
  $(".inview").on("inview", function(event, isInview) {
    if (isInview) {
      $(this).stop().addClass("is-show")
    }
  })
})

$(function(){
    $(window).scroll(function (){
        $('.left-to-right, .right-to-left').each(function(){
            var elemPos = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            if (scroll > elemPos - windowHeight + 200){
                $(this).addClass('scrollin');
            }
        });
    });
});

// &(window).on('load', function(){
//   %("#splash").fadeIn('');
//   $("#splash_logo").hide().fadeIn('');
// });

// $(window).on('load', function(){
//   $("#splash").delay(500).fadeOut('slow');
//   $("#splash_logo").delay(1500).fadeOut('slow');
// });

// $(window).on('load', function(){
//   $("#display").animate({
//     right:'200px'
//   }, 1500, 'fadeIn').delay(2000).queue(function(){
//     $("#display").fadeOut('slow').dequeue();
//   })
// });
// window.onload = function(){
//   $("#display").hide().fadeIn('');
//   $("#display_logo").hide().fadeIn('');
// }
// window.addEventListener('load', function(){
//   $("#splash").hide().fadeIn('');
//   $("#splash_logo").hide().fadeIn('');
//   $("#splash").delay(1500).fadeOut('slow');
//   $("#splash_logo").delay(1500).fadeOut('slow');
// });

// window.addEventListener('load', function(){
//   $("#display").hide().fadeIn( 1500, '');
//   $("#display_logo").hide().fadeIn(1500, '');
//   $("#display").delay(2500).fadeOut('slow');
//   $("#display_logo").delay(2500).fadeOut('slow');
// });

const keyName = 'loadingviewed';
const keyValue = true;

if(!sessionStorage.getItem(keyName)){
  sessionStorage.setItem(keyName, keyValue);
  //初回
  window.addEventListener('load', function(){
  $("#splash").hide().fadeIn('');
  $("#splash_logo").hide().fadeIn('');
  $("#splash").delay(1500).fadeOut('slow');
  $("#splash_logo").delay(1500).fadeOut('slow');
});
  window.addEventListener('load', function(){
  $("#display").hide().fadeIn( 1500, '');
  $("#display_logo").hide().fadeIn(1500, '');
  $("#display").delay(2500).fadeOut('slow');
  $("#display_logo").delay(2500).fadeOut('slow');
});
  
}





// window.addEventListener('load', function(){
//   $("#globeBlock").delay(5000).fadeAnime('slow')
// });

// const webStorage = function() {
//   if (sessionStorage.getItem('visit')){
//     $("#splash").css("display", "none");
//   }else {
//   //   $("#splash").hide().fadeIn('');
//   // $("#splash_logo").hide().fadeIn('');
//   // $("#splash").delay(1500).fadeOut('slow');
//   // $("#splash_logo").delay(1500).fadeOut('slow');
//   $("#display").hide().fadeIn( 1500, '');
//   $("#display_logo").hide().fadeIn(1500, '');
//   $("#display").delay(2500).fadeOut('slow');
//   $("#display_logo").delay(2500).fadeOut('slow');
//   }
// }





$(window).on('load', function(){
  $('body').removeClass('fade');
});
$(function() {
  $('a:not([href^="#"]):not([target])').on('click', function(e){
    e.preventDefault();
    url = $(this).attr('href');
    if (url !== '') {
      $('body').addClass('fade');
      setTimeout(function(){
        window.location = url;
      }, 800);
    }
    return false;
  }); 
});


// const rand = function(min, max) {
//   return Math.random() * ( max - min ) + min;
// }

// let canvas = document.getElementById('canvas');
// let ctx = canvas.getContext('2d');

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// window.addEventListener('resize', function() {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   ctx = canvas.getContext('2d');
//   ctx.globalCompositeOperation = 'lighter';
// });
// let backgroundColors = [ '#000', '#000' ];
// let colors = [
//   [ '#002aff', "#009ff2" ],
//   [ '#0054ff', '#27e49b' ], 
//   [ '#202bc5' ,'#873dcc' ]
// ];
// let count = 70;
// let blur = [ 12, 70 ];
// let radius = [ 1, 120 ];

// ctx.clearRect( 0, 0, canvas.width, canvas.height );
// ctx.globalCompositeOperation = 'lighter';

// let grd = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
// grd.addColorStop(0, backgroundColors[0]);
// grd.addColorStop(1, backgroundColors[1]);
// ctx.fillStyle = grd;
// ctx.fillRect(0, 0, canvas.width, canvas.height);

// let items = [];

// while(count--) {
//     let thisRadius = rand( radius[0], radius[1] );
//     let thisBlur = rand( blur[0], blur[1] );
//     let x = rand( -100, canvas.width + 100 );
//     let y = rand( -100, canvas.height + 100 );
//     let colorIndex = Math.floor(rand(0, 299) / 100);
//     let colorOne = colors[colorIndex][0];
//     let colorTwo = colors[colorIndex][1];
    
//     ctx.beginPath();
//     ctx.filter = `blur(${thisBlur}px)`;
//     let grd = ctx.createLinearGradient(x - thisRadius / 2, y - thisRadius / 2, x + thisRadius, y + thisRadius);
  
//     grd.addColorStop(0, colorOne);
//     grd.addColorStop(1, colorTwo);
//     ctx.fillStyle = grd;
//     ctx.fill();
//     ctx.arc( x, y, thisRadius, 0, Math.PI * 2 );
//     ctx.closePath();
    
//     let directionX = Math.round(rand(-99, 99) / 100);
//     let directionY = Math.round(rand(-99, 99) / 100);
  
//     items.push({
//       x: x,
//       y: y,
//       blur: thisBlur,
//       radius: thisRadius,
//       initialXDirection: directionX,
//       initialYDirection: directionY,
//       initialBlurDirection: directionX,
//       colorOne: colorOne,
//       colorTwo: colorTwo,
//       gradient: [ x - thisRadius / 2, y - thisRadius / 2, x + thisRadius, y + thisRadius ],
//     });
// }


// function changeCanvas(timestamp) {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   let adjX = 2;
//   let adjY = 2;
//   let adjBlur = 1;
//   items.forEach(function(item) {
    
//       if(item.x + (item.initialXDirection * adjX) >= canvas.width && item.initialXDirection !== 0 || item.x + (item.initialXDirection * adjX) <= 0 && item.initialXDirection !== 0) {
//         item.initialXDirection = item.initialXDirection * -1;
//       }
//       if(item.y + (item.initialYDirection * adjY) >= canvas.height && item.initialYDirection !== 0 || item.y + (item.initialYDirection * adjY) <= 0 && item.initialYDirection !== 0) {
//         item.initialYDirection = item.initialYDirection * -1;
//       }
      
//       if(item.blur + (item.initialBlurDirection * adjBlur) >= radius[1] && item.initialBlurDirection !== 0 || item.blur + (item.initialBlurDirection * adjBlur) <= radius[0] && item.initialBlurDirection !== 0) {
//         item.initialBlurDirection *= -1;
//       }
    
//       item.x += (item.initialXDirection * adjX);
//       item.y += (item.initialYDirection * adjY);
//       item.blur += (item.initialBlurDirection * adjBlur);
//       ctx.beginPath();
//       ctx.filter = `blur(${item.blur}px)`;
//       let grd = ctx.createLinearGradient(item.gradient[0], item.gradient[1], item.gradient[2], item.gradient[3]);
//       grd.addColorStop(0, item.colorOne);
//       grd.addColorStop(1, item.colorTwo);
//       ctx.fillStyle = grd;
//       ctx.arc( item.x, item.y, item.radius, 0, Math.PI * 2 );
//       ctx.fill();s
//       ctx.closePath();
    
//   });
//   window.requestAnimationFrame(changeCanvas);
  
// }

// window.requestAnimationFrame(changeCanvas);


// $(function() {
//   $('a[href*=#]').on('click', function(e) {
//     e.preventDefault();
//     $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
//   });
// });



function check(){
  const output = document.getElementById("Text");
  if (document.form.answer.value=="!="){ 
    output.textContent = "正解!"}
  else {output.textContent = "不正解!:ヒント 全角と半角、等号の間違い"}
}




window.addEventListener('load', function() {
    let hoge = document.getElementById("A");
    // 選択した際のイベント取得
    if (hoge) {
      hoge.addEventListener('input', (e) => {
        document.getElementsByClassName('numberA')[0].textContent = hoge.value;
      });
    }
  });

  

window.onload = function () {

    let digital = document.getElementById("B");
    // 選択した際のイベント取得
    if (digital) {
      digital.addEventListener('input', (e) => {
        document.getElementsByClassName('numberB')[0].textContent = digital.value;
      });
    }
}    

window.addEventListener('load', function(){
  const ro = document.getElementById("A2");
  if (ro) {
    ro.addEventListener('input', (e) => {
       document.getElementsByClassName('number3')[0].textContent = ro.value;
    });
  }
})

function andcheck(){
  const out = document.getElementById("Out");
  const a = document.getElementById("A");
  const b = document.getElementById("B");

  if ((a.value == 1)&&(b.value == 1)){
    out.value = 1}
    else {
    out.value = 0}
}

function orcheck(){
  const or = document.getElementById("Or");
  const a = document.getElementById("A2");
  const b = document.getElementById("B2");

  if ((a.value == 0)&&(b.value == 0)){
    or.value = 0}
    else {
    or.value = 1}
}

function notcheck(){
  const not = document.getElementById("Not");
  const a = document.getElementById("A3");

  if (a.value == 0){
    not.value = 1}
    else {
    not.value = 0}
}

jQuery(document).ready(function($){
$('.toggle-btn').on('click',function(){
    $('.toggle-btn__line').toggleClass('active');
    $("span").toggleClass('add');
    $('.global-nav').fadeToggle();

});
});


function PageTopAnime() {
  var scroll = $(window).scrollTop();
  if (scroll >= 200){//上から200pxスクロールしたら
    $('#page-top').removeClass('DownMove');//#page-topについているDownMoveというクラス名を除く
    $('#page-top').addClass('UpMove');//#page-topについているUpMoveというクラス名を付与
  }else{
    if($('#page-top').hasClass('UpMove')){//すでに#page-topにUpMoveというクラス名がついていたら
      $('#page-top').removeClass('UpMove');//UpMoveというクラス名を除き
      $('#page-top').addClass('DownMove');//DownMoveというクラス名を#page-topに付与
    }
  }
}

$(window).scroll(function () {
  PageTopAnime();/* スクロールした際の動きの関数を呼ぶ*/
});

// ページが読み込まれたらすぐに動かしたい場合の記述
$(window).on('load', function () {
  PageTopAnime();/* スクロールした際の動きの関数を呼ぶ*/
});

// #page-topをクリックした際の設定
$('#page-top').click(function () {
    $('body,html').animate({
        scrollTop: 0//ページトップまでスクロール
    }, 500);//ページトップスクロールの速さ。数字が大きいほど遅くなる
    return false;//リンク自体の無効化
});


// $(function() {
//   var Accordion = function(el, multiple) {
//     this.el = el || {};
//     this.multiple = multiple || false;

//     // Variables privadas
//     var links = this.el.find('.link');
//     // Evento
//     links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
//   }

//   Accordion.prototype.dropdown = function(e) {
//     var $el = e.data.el;
//       $this = $(this),
//       $next = $this.next();

//     $next.slideToggle();
//     $this.parent().toggleClass('open');

//     if (!e.data.multiple) {
//       $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
//     };
//   } 

//   var accordion = new Accordion($('#accordion'), false);
// });


(function($) {
// 読み込んだら開始
$(function() {

// アコーディオン
$(".accordion").each(function() {
var accordion = $(this);
$(this).find(".switch").click(function() {
//$("> .switch", this).click(function() { // 上段の別の書き方
var targetContentWrap = $(this).next(".contentWrap");
if ( targetContentWrap.css("display") === "none" ) {
accordion.find(".contentWrap").slideUp();
accordion.find(".switch.open").removeClass("open");
}
targetContentWrap.slideToggle();
$(this).toggleClass("open");
});
});

});
})(jQuery);


function checkAnswer(){
  var selectedAnswer = document.querySelector('input[name="radio"]:checked');

  if (selectedAnswer === null){
    document.getElementById('result').innerHTML = '<p>回答を選んでください。</p>';
    return;
  }

  var userAnswer = selectedAnswer.value;
  var correctAnswer = '4';

  var resultDiv = document.getElementById('result');

  if (userAnswer===correctAnswer){
    $('.Quiz-answer').addClass('is-correct');
    $('.Quiz-answer').removeClass('is-incorrect');
    // $('.Quiz-answer').toggleClass('is-correct');
  }else{
    $('.Quiz-answer').addClass('is-incorrect');
    $('.Quiz-answer').removeClass('is-correct');
    // $('.Quiz-answer').toggleClass('is-incorrect');
  }
}

function check(){

  const output = document.getElementById("Text");
  if (document.form.answer.value=="!="){ 
    $('.Quiz-answer').addClass('is-correct');
    $('.Quiz-answer').removeClass('is-incorrect');
    output.innerHTML = "";
  }else {
    $('.Quiz-answer').addClass('is-incorrect');
    $('.Quiz-answer').removeClass('is-correct');
    output.textContent = "ヒント 全角と半角、等号の間違い"}

   
}

function easy(){
  var esAnswer = document.querySelector('input[name="radio"]:checked');
  var userAnswer = esAnswer.value;
  var correctAnswer = '2';

  if (userAnswer===correctAnswer){
    $('.Quiz-answer').addClass('is-correct');
    $('.Quiz-answer').removeClass('is-incorrect');
    // $('.Quiz-answer').toggleClass('is-correct');
  }else{
    $('.Quiz-answer').addClass('is-incorrect');
    $('.Quiz-answer').removeClass('is-correct');
    // $('.Quiz-answer').toggleClass('is-incorrect');
  } 
}

function q3(){
  var qAnswer = document.querySelector('input[name="radio"]:checked');
  var userAnswer = qAnswer.value;
  var correctAnswer = '1';

  if(userAnswer===correctAnswer){
    $('.Quiz-answer').addClass('is-correct');
    $('.Quiz-answer').removeClass('is-incorrect');
    // $('.Quiz-answer').toggleClass('is-correct');
  }else{
    $('.Quiz-answer').addClass('is-incorrect');
    $('.Quiz-answer').removeClass('is-correct');
    // $('.Quiz-answer').toggleClass('is-incorrect');
  } 
}

function q4(){
  var qAnswer = document.querySelector('input[name="radio"]:checked');
  var userAnswer = qAnswer.value;
  var correctAnswer = '2';

  if(userAnswer===correctAnswer){
    $('.Quiz-answer').addClass('is-correct');
    $('.Quiz-answer').removeClass('is-incorrect');
    // $('.Quiz-answer').toggleClass('is-correct');
  }else{
    $('.Quiz-answer').addClass('is-incorrect');
    $('.Quiz-answer').removeClass('is-correct');
    // $('.Quiz-answer').toggleClass('is-incorrect');
  } 
}

function q5(){
  var qAnswer = document.querySelector('input[name="radio"]:checked');
  var userAnswer = qAnswer.value;
  var correctAnswer = '4';

  if(userAnswer===correctAnswer){
    $('.Quiz-answer').addClass('is-correct');
    $('.Quiz-answer').removeClass('is-incorrect');
    // $('.Quiz-answer').toggleClass('is-correct');
  }else{
    $('.Quiz-answer').addClass('is-incorrect');
    $('.Quiz-answer').removeClass('is-correct');
    // $('.Quiz-answer').toggleClass('is-incorrect');
  } 
}

function q6(){
  var qAnswer = document.querySelector('input[name="r"]:checked');
  var userAnswer = qAnswer.value;
  var correctAnswer = '1';

  if(userAnswer===correctAnswer){
    $('.quiz-answer').addClass('is-correct');
    $('.quiz-answer').removeClass('is-incorrect');
    // $('.Quiz-answer').toggleClass('is-correct');
  }else{
    $('.quiz-answer').addClass('is-incorrect');
    $('.quiz-answer').removeClass('is-correct');
    // $('.Quiz-answer').toggleClass('is-incorrect');
  } 
}
// function onecli(){
//   const rgclick = document.getElementById('A');

//   if (rgclick.value == 0){
//      rgclick.value = 1
//   }
//   else{
//     rgclick.value = 0
//   }
// }

function inlineIframe(iframe) {
  if (!iframe) return;
  var onLoad = function () {
    iframe.insertAdjacentHTML(
      "afterend",
      iframe.contentDocument.body.innerHTML,
    );
    iframe.parentNode.removeChild(iframe);
    iframe.onload = null;
  };
  if (
    iframe.contentWindow.location.href === "about:blank" ||
    iframe.contentDocument.readyState === "loading"
  ) {
    iframe.onload = onLoad;
  } else {
    onLoad();
  }
}

$(document).ready(function() {
  var headerIframe = document.getElementById('HeaderIframe');
  inlineIframe(headerIframe);
});
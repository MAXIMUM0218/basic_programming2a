// 課題1-1: HTMLで見出しと箇条書きを作る（JavaScript処理なし）。

// 課題1-2: 入力した名前を使って挨拶をアラート表示する。
function greetUser() {
  let name = document.getElementById("nameInput_prob13").value;
  alert("こんにちは" + name + "さん");
}
document.getElementById("greetButton_prob12").addEventListener("click", greetUser);

// 課題1-3: 乱数の範囲に応じたおみくじ結果をアラート表示する。
function drawOmikuji() {
  let rand = Math.random();
  if (rand < 0.3) {
    alert("大吉");
  } else if (rand >= 0.3 && rand < 0.6) {
    alert("中吉");
  } else if (rand >= 0.6 && rand < 0.9) {
    alert("小吉");
  } else {
    alert("凶");
  }
}
document.getElementById("drawOmikujiButton_prob13").addEventListener("click", drawOmikuji);

// 課題2-1: id属性を使ったCSS指定（JavaScript処理なし）。
// 課題2-2: class属性を使ったCSS指定（JavaScript処理なし）。
// 課題2-3: img要素のwidth属性を指定（JavaScript処理なし）。

// 課題2-4: ボタンを押すたびに画像の幅を10px増やす。
function growDemoImage() {
  let image = document.getElementById("demo_img1");
  let width = Number(image.getAttribute("width"));
  image.setAttribute("width", width + 10);
}
document.getElementById("growImageButton_prob24").addEventListener("click", growDemoImage);

// 課題2-5: 画像の幅が300pxを超えない範囲で10pxずつ拡大する。
function growDemoImageWithLimit() {
  let image = document.getElementById("demo_img2");
  let width = Number(image.getAttribute("width"));
  if (width + 10 <= 300) {
    image.setAttribute("width", width + 10);
  } else {
    alert("これ以上大きくできません！");
  }
}
document.getElementById("growLimitImageButton_prob25").addEventListener("click", growDemoImageWithLimit);

// 課題2-6: CSSで画像幅を指定（JavaScript処理なし）。

// 課題3-1: 表示色と文字サイズの現在値を保持する。
let demoSize31 = 16;
let demoColor31 = "black";

// 課題3-1: クリックごとに文字色を切り替え、文字サイズを1px大きくする。
function changeDemoText31() {
  demoColor31 = demoColor31 === "black" ? "red" : "black";
  let text = document.getElementById("demo_text31");
  text.style.color = demoColor31;
  demoSize31 += 1;
  text.style.fontSize = demoSize31 + "px";
}
document.getElementById("changeTextButton_prob31").addEventListener("click", changeDemoText31);

// 課題3-2: 入力された色を指定要素の背景色に設定する。
function changeDemoBackground(inputId, targetId) {
  let color = document.getElementById(inputId).value;
  let target = document.getElementById(targetId);
  target.style.backgroundColor = color;
}
document.getElementById("changeBgButton_prob32").addEventListener("click", function () {
  changeDemoBackground("demo_color_input", "demo_bg32");
});

// 課題3-3: 背景色を変更し、ボタンで初期色に戻す。
function resetDemoBackground() {
  document.getElementById("demo_bg33").style.backgroundColor = "lightgray";
}
document.getElementById("changeBgButton_prob33").addEventListener("click", function () {
  changeDemoBackground("demo_color_input3", "demo_bg33");
});
document.getElementById("resetBgButton_prob33").addEventListener("click", resetDemoBackground);

// 課題3-4: クリックごとに取り消し線の表示を切り替える。
function toggleDemoStrike() {
  let text = document.getElementById("demo_strike34");
  text.style.textDecoration = text.style.textDecoration === "" ? "line-through" : "";
}
document.getElementById("demo_strike34").addEventListener("click", toggleDemoStrike);
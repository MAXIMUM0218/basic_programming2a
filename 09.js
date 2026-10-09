function greetUser() {
  var name = document.getElementById("nameInput_prob13").value;
  alert("こんにちは" + name + "さん");
}

function drawOmikuji() {
  var rand = Math.random();
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
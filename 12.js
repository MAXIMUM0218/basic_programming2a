// 占い用の関数
function fortune(){
    // nameの値が'gender'のタグを配列の形で取ってきて変数に入れる
    let x = document.getElementsByName('gender');
    // 性別を記憶する変数 最初は'不明'
    let g = '不明'; 

    // 性別のラジオボタンを繰り返しを使って確認
    for(let i = 0; i < x.length; i++){
        if(x[i].checked == true){ // x[i]のボタンがチェックされていたら
            g = x[i].value; // valueの値をgに入れる
            break; // チェックされていた場合、繰り返しを抜ける
        }
    }

    // nameの値が'blood'のタグを配列の形で取ってきて変数に入れる
    let y = document.getElementsByName('blood');
    // 血液型を記憶する変数 最初は'不明'
    let b = '不明'; 

    // 血液型のラジオボタンを繰り返しを使って確認
    for(let j = 0; j < y.length; j++){
        if(y[j].checked == true){ // y[j]のボタンがチェックされていたら
            b = y[j].value; // valueの値をbに入れる
            break; // チェックされていた場合、繰り返しを抜ける
        }
    }

    // nameの値が'zodiac'のタグを配列の形で取ってきて変数に入れる
    let z_elems = document.getElementsByName('zodiac');
    // 星座を記憶する変数 最初は'不明'
    let z = '不明'; 

    // 星座のラジオボタンを繰り返しを使って確認
    for(let k = 0; k < z_elems.length; k++){
        if(z_elems[k].checked == true){ // z_elems[k]のボタンがチェックされていたら
            z = z_elems[k].value; // valueの値をzに入れる
            break; // チェックされていた場合、繰り返しを抜ける
        }
    }

    // チェックした性別と血液型と星座をアラートする
    alert('あなたの性別は' + g + 'で、血液型は' + b + '型、星座は' + z + 'ですね');
}

function buy(){
    let x = document.getElementsByName('fruits'); // nameの値が'fruits'のチェックボックスを配列として取ってきて変数に入れる
    let sum = 0; // 合計金額を記憶する変数

    // 繰り返しを使って書く
    for(let i = 0; i < x.length; i++){
        if(x[i].checked == true){ // チェックされていたら
            // valueの値は文字列なので、整数に変換してから足す
            sum = sum + parseInt(x[i].value); 
        }
    }

    // if文を使って場合わけ
    if(sum == 0){
        alert("何も購入されていません。");
    } else {
        alert("合計金額は" + sum + "円になります。");
    }
}

// =============================================
// ブロック崩しゲーム（Neon Breakout）
// スマホ対応・スコア賞品判定付き
// =============================================

document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('breakoutCanvas');
  if (!canvas) return; // このページにcanvasがない場合は何もしない

  const ctx = canvas.getContext('2d');
  const CW = canvas.width;   // キャンバスの論理幅（480）
  const CH = canvas.height;  // キャンバスの論理高さ（560）

  // HUD・UI要素の取得
  const scoreEl   = document.getElementById('bo-score');
  const levelEl   = document.getElementById('bo-level');
  const livesEl   = document.getElementById('bo-lives');
  const overlay   = document.getElementById('bo-overlay');
  const titleEl   = document.getElementById('bo-overlay-title');
  const msgEl     = document.getElementById('bo-overlay-msg');
  const prizeEl   = document.getElementById('bo-prize');
  const startBtn  = document.getElementById('bo-start-btn');
  const touchCtrl = document.getElementById('touch-controls');
  const btnLeft   = document.getElementById('btn-left');
  const btnRight  = document.getElementById('btn-right');

  // ===== ゲーム定数 =====
  const PADDLE_W   = 100;
  const PADDLE_H   = 12;
  const BALL_R     = 8;
  const BRICK_ROWS = 5;
  const BRICK_COLS = 8;
  const BRICK_H    = 22;
  const BRICK_GAP  = 6;
  const BRICK_PAD  = 30;
  const BRICK_TOP  = 60;
  const PADDLE_SPD = 7; // ボタン操作時のパドル移動速度

  // 行ごとのネオンカラー
  const ROW_COLORS = ['#ff2d78', '#ff6b35', '#ffe233', '#00e676', '#00e5ff'];

  // ===== ゲーム変数 =====
  let score, lives, level, paused, gameRunning;
  let ball, paddle, bricks, particles;
  let animId;
  // ボタン押下状態（スマホ用）
  let keyLeft = false, keyRight = false;

  // ===== スコアに応じた賞品判定 =====
  // 〜500点未満：ポイント表示、500〜999点：パン割引券、1000点以上：学食割引券
  function getPrize(s) {
    if (s >= 1000) {
      return { text: '🍱 学食割引券ゲット！', bg: 'rgba(255,215,0,0.15)', color: '#ffd700' };
    } else if (s >= 500) {
      return { text: '🍞 パン割引券ゲット！', bg: 'rgba(255,180,50,0.15)', color: '#ffb432' };
    } else {
      return { text: '⭐ ' + s + 'pt 獲得！', bg: 'rgba(0,229,255,0.1)', color: '#00e5ff' };
    }
  }

  // ===== 初期化 =====
  function init() {
    score = 0; lives = 3; level = 1;
    paused = false; gameRunning = false;
    particles = [];
    updateHUD();
    paddle = { x: CW / 2 - PADDLE_W / 2, y: CH - 40, w: PADDLE_W, h: PADDLE_H };
    resetBall();
    createBricks();
  }

  // ボールをパドル上にリセット
  function resetBall() {
    const angle = (-Math.PI / 2) + (Math.random() - 0.5) * (Math.PI / 3);
    const spd = 4 + level * 0.5; // レベルが上がるごとに速くなる
    ball = {
      x: paddle.x + paddle.w / 2,
      y: paddle.y - BALL_R - 2,
      vx: spd * Math.cos(angle),
      vy: spd * Math.sin(angle),
      trail: [] // 残像用
    };
  }

  // ブロックグリッドを生成
  function createBricks() {
    bricks = [];
    const bw = (CW - BRICK_PAD * 2 - BRICK_GAP * (BRICK_COLS - 1)) / BRICK_COLS;
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: BRICK_PAD + c * (bw + BRICK_GAP),
          y: BRICK_TOP + r * (BRICK_H + BRICK_GAP),
          w: bw, h: BRICK_H,
          color: ROW_COLORS[r],
          hp: (r === 0) ? 2 : 1, // 最上段だけ2発必要（★表示）
          alive: true
        });
      }
    }
  }

  // HUD更新
  function updateHUD() {
    scoreEl.textContent = score;
    levelEl.textContent = level;
    // 絵文字はrepeat()より配列+joinの方が確実（変体選択子の問題を回避）
    let hearts = '';
    for (let i = 0; i < lives; i++) { hearts += '❤️'; }
    livesEl.textContent = hearts;
  }

  // ===== パーティクルエフェクト =====
  function spawnParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * 3;
      particles.push({
        x: x, y: y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        r: 2 + Math.random() * 3,
        color: color, life: 1.0,
        decay: 0.04 + Math.random() * 0.03
      });
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.1; // 重力
      p.life -= p.decay;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.shadowColor = p.color; ctx.shadowBlur = 8;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  // ===== 描画関数 =====

  // サイバーグリッド背景
  function drawBackground() {
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, CW, CH);
    ctx.strokeStyle = 'rgba(0,229,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= CW; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke();
    }
    for (let y = 0; y <= CH; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke();
    }
  }

  // ブロック描画（ネオングロー付き）
  function drawBricks() {
    for (const b of bricks) {
      if (!b.alive) continue;
      ctx.save();
      ctx.shadowColor = b.color; ctx.shadowBlur = 12;
      const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, b.color + '88');
      ctx.fillStyle = grad;
      roundRect(ctx, b.x, b.y, b.w, b.h, 4); ctx.fill();
      if (b.hp === 2) { // 2発必要ブロックに★
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('★', b.x + b.w / 2, b.y + b.h / 2);
      }
      ctx.restore();
    }
  }

  // パドル描画（グラデーション）
  function drawPaddle() {
    ctx.save();
    ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 20;
    const grad = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.w, 0);
    grad.addColorStop(0, '#7b2fff');
    grad.addColorStop(0.5, '#00e5ff');
    grad.addColorStop(1, '#7b2fff');
    ctx.fillStyle = grad;
    roundRect(ctx, paddle.x, paddle.y, paddle.w, paddle.h, 6); ctx.fill();
    ctx.restore();
  }

  // ボール描画（残像トレイル付き）
  function drawBall() {
    for (let i = 0; i < ball.trail.length; i++) {
      const t = ball.trail[i];
      ctx.save();
      ctx.globalAlpha = (i + 1) / ball.trail.length * 0.35;
      ctx.fillStyle = '#00e5ff';
      ctx.beginPath(); ctx.arc(t.x, t.y, BALL_R * 0.6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 25;
    const grad = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 1, ball.x, ball.y, BALL_R);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#00e5ff');
    grad.addColorStop(1, '#7b2fff');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // ===== ゲームロジック =====

  // パドルのボタン入力による移動
  function updatePaddle() {
    if (keyLeft)  paddle.x = Math.max(0, paddle.x - PADDLE_SPD);
    if (keyRight) paddle.x = Math.min(CW - paddle.w, paddle.x + PADDLE_SPD);
  }

  // ボール更新（物理・衝突判定）
  function updateBall() {
    // 残像を記録
    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > 6) ball.trail.shift();

    ball.x += ball.vx;
    ball.y += ball.vy;

    // 左右の壁反射
    if (ball.x - BALL_R < 0) {
      ball.x = BALL_R; ball.vx = Math.abs(ball.vx);
      spawnParticles(ball.x, ball.y, '#00e5ff');
    }
    if (ball.x + BALL_R > CW) {
      ball.x = CW - BALL_R; ball.vx = -Math.abs(ball.vx);
      spawnParticles(ball.x, ball.y, '#00e5ff');
    }

    // 上の壁反射
    if (ball.y - BALL_R < 0) {
      ball.y = BALL_R; ball.vy = Math.abs(ball.vy);
      spawnParticles(ball.x, ball.y, '#00e5ff');
    }

    // 下に落ちた → ライフ減少
    if (ball.y - BALL_R > CH) {
      lives--;
      updateHUD();
      if (lives <= 0) { gameOver(); } else { resetBall(); }
      return;
    }

    // パドルとの衝突判定
    if (
      ball.y + BALL_R > paddle.y &&
      ball.y - BALL_R < paddle.y + paddle.h &&
      ball.x > paddle.x && ball.x < paddle.x + paddle.w &&
      ball.vy > 0
    ) {
      ball.vy = -Math.abs(ball.vy);
      // パドルのどこに当たったかで反射角を変える（左端→左、右端→右）
      ball.vx = ((ball.x - paddle.x) / paddle.w - 0.5) * 8;
      spawnParticles(ball.x, ball.y, '#7b2fff');
    }

    // ブロックとの衝突判定（AABB + 円）
    for (const b of bricks) {
      if (!b.alive) continue;
      const dx = ball.x - Math.max(b.x, Math.min(ball.x, b.x + b.w));
      const dy = ball.y - Math.max(b.y, Math.min(ball.y, b.y + b.h));
      if (dx * dx + dy * dy < BALL_R * BALL_R) {
        b.hp--;
        if (b.hp <= 0) {
          b.alive = false;
          score += 10; // ブロック1個につき10点
        }
        spawnParticles(b.x + b.w / 2, b.y + b.h / 2, b.color);
        updateHUD();

        // 反射方向を判定（左右 or 上下）
        const overlapX = (ball.x < b.x || ball.x > b.x + b.w) ? Math.abs(dx) : Infinity;
        const overlapY = (ball.y < b.y || ball.y > b.y + b.h) ? Math.abs(dy) : Infinity;
        if (overlapX < overlapY) ball.vx *= -1; else ball.vy *= -1;

        // 全ブロック破壊でレベルアップ
        if (bricks.every(function (br) { return !br.alive; })) levelUp();
        break;
      }
    }
  }

  // レベルアップ
  function levelUp() {
    level++;
    updateHUD();
    createBricks();
    resetBall();
  }

  // ゲームオーバー → 賞品判定して表示
  function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animId);

    const prize = getPrize(score);

    titleEl.textContent      = 'GAME OVER';
    msgEl.textContent        = '最終スコア：' + score + ' 点';

    // 賞品バナーを表示・スタイル適用
    prizeEl.textContent      = prize.text;
    prizeEl.style.display    = 'block';
    prizeEl.style.background = prize.bg;
    prizeEl.style.color      = prize.color;
    prizeEl.style.border     = '1px solid ' + prize.color;

    startBtn.textContent     = '▶ もう一度';
    overlay.style.display    = 'flex';
  }

  // ===== メインゲームループ =====
  function gameLoop() {
    if (!paused) {
      updatePaddle();
      updateBall();
      updateParticles();
    }
    drawBackground();
    drawBricks();
    drawPaddle();
    drawBall();
    drawParticles();
    animId = requestAnimationFrame(gameLoop);
  }

  // ===== イベントリスナー =====

  // マウス操作（PC）
  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    // CSSサイズと論理サイズの比率でスケーリング補正
    const scaleX = CW / rect.width;
    const mx = (e.clientX - rect.left) * scaleX;
    paddle.x = Math.max(0, Math.min(CW - paddle.w, mx - paddle.w / 2));
  });

  // タッチスワイプ操作（スマホ）
  let lastTouchX = null;
  canvas.addEventListener('touchmove', function (e) {
    e.preventDefault(); // ページのスクロールを止める
    const rect   = canvas.getBoundingClientRect();
    const scaleX = CW / rect.width;
    const tx     = (e.touches[0].clientX - rect.left) * scaleX;
    if (lastTouchX !== null) {
      const dx = tx - lastTouchX;
      paddle.x = Math.max(0, Math.min(CW - paddle.w, paddle.x + dx));
    }
    lastTouchX = tx;
  }, { passive: false });

  canvas.addEventListener('touchend', function () { lastTouchX = null; });

  // ボタン長押し操作（スマホ用左右ボタン）
  function setupBtn(el, setKey) {
    el.addEventListener('touchstart',  function (e) { e.preventDefault(); setKey(true);  }, { passive: false });
    el.addEventListener('touchend',    function () { setKey(false); });
    el.addEventListener('touchcancel', function () { setKey(false); });
    el.addEventListener('mousedown',   function () { setKey(true);  });
    el.addEventListener('mouseup',     function () { setKey(false); });
    el.addEventListener('mouseleave',  function () { setKey(false); });
  }

  if (btnLeft && btnRight) {
    setupBtn(btnLeft,  function (v) { keyLeft  = v; });
    setupBtn(btnRight, function (v) { keyRight = v; });
  }

  // スペースキーで一時停止
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && gameRunning) {
      e.preventDefault();
      paused = !paused;
    }
  });

  // スタートボタン
  startBtn.addEventListener('click', function () {
    init();
    prizeEl.style.display = 'none'; // 賞品バナーを隠す
    overlay.style.display = 'none';
    gameRunning = true;
    gameLoop();
  });

  // ===== タッチデバイス判定（スマホ用ボタンを表示） =====
  function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }

  if (isTouchDevice() && touchCtrl) {
    touchCtrl.style.display = 'flex';
  }

  // ===== ユーティリティ：角丸矩形パス =====
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // 初期描画（PLAYボタン押下前に画面を表示）
  init();
  drawBackground();
  drawBricks();
  drawPaddle();
  drawBall();
});

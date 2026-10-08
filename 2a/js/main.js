//===============================================================
// メニュー制御用の関数とイベント設定（※バージョン2026-4｜オーバーレイ対応版）
//===============================================================
$(function(){
  //-------------------------------------------------
  // 変数の宣言
  //-------------------------------------------------
  const $menubar = $('#menubar');
  const $menubarHdr = $('#menubar_hdr');
  const $overlay = $('#menubar-overlay');
  const breakPoint = 900;	// ここがブレイクポイント指定箇所です

  // ▼ここを切り替えるだけで 2パターンを使い分け！
  //   false → “従来どおり”
  //   true  → “ハンバーガーが非表示の間は #menubar も非表示”
  const HIDE_MENUBAR_IF_HDR_HIDDEN = false;

  // タッチデバイスかどうかの判定
  const isTouchDevice = ('ontouchstart' in window) ||
                       (navigator.maxTouchPoints > 0) ||
                       (navigator.msMaxTouchPoints > 0);

  //-------------------------------------------------
  // debounce(処理の呼び出し頻度を抑制) 関数
  //-------------------------------------------------
  function debounce(fn, wait) {
    let timerId;
    return function(...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, wait);
    };
  }

  //-------------------------------------------------
  // メニューを閉じる共通関数
  // ※ハンバーガー解除・メニュー非表示・オーバーレイ非表示・
  //   noscroll解除・ドロップダウン閉じ を一括で行う
  //-------------------------------------------------
  function closeMenu() {
    $menubarHdr.removeClass('ham');
    $menubar.hide();
    $overlay.hide();
    $menubar.find('.ddmenu_parent ul').hide();
    $('body').removeClass('noscroll');
  }

  //-------------------------------------------------
  // メニューを開く共通関数
  //-------------------------------------------------
  function openMenu() {
    $menubarHdr.addClass('ham');
    $menubar.show();
    $overlay.show();
    $menubar.find('.ddmenu_parent ul').hide();
    if ($(window).width() < breakPoint) {
      $('body').addClass('noscroll');
    }
  }

  //-------------------------------------------------
  // ドロップダウン用の初期化関数
  //-------------------------------------------------
  function initDropdown($menu, isTouch) {
    // ドロップダウンメニューが存在するliにクラス追加
    $menu.find('ul li').each(function() {
      if ($(this).find('ul').length) {
        $(this).addClass('ddmenu_parent');
        $(this).children('a').addClass('ddmenu');
      }
    });

    // 子メニューは初期状態で閉じる（ちらつき防止）
    $menu.find('.ddmenu_parent ul').hide();

    // 万一の再初期化に備えてイベントを解除（多重バインド防止）
    $menu.find('.ddmenu').off('click.ddmenu');
    $menu.find('.ddmenu_parent').off('mouseenter.ddmenu mouseleave.ddmenu');

    //---------------------------------------------
    // ▼ブレイクポイント未満（開閉メニュー時）は
    //   PCでも「クリックで開閉」に統一（hover無効）
    //---------------------------------------------
    $menu.find('.ddmenu').on('click.ddmenu', function(e) {
      if (!isTouch && $(window).width() >= breakPoint) return; // PC大画面はhover運用

      e.preventDefault();
      e.stopPropagation();

      const $dropdownMenu = $(this).siblings('ul');
      if ($dropdownMenu.is(':visible')) {
        $dropdownMenu.hide();
      } else {
        $menu.find('.ddmenu_parent ul').hide(); // 他を閉じる
        $dropdownMenu.show();
      }
    });

    //---------------------------------------------
    // ▼PC大画面（breakPoint以上）のみ hover で開閉
    //---------------------------------------------
    $menu.find('.ddmenu_parent').on('mouseenter.ddmenu', function() {
      if (isTouch) return;
      if ($(window).width() < breakPoint) return; // 開閉メニュー時はhover無効
      $(this).children('ul').show();
    }).on('mouseleave.ddmenu', function() {
      if (isTouch) return;
      if ($(window).width() < breakPoint) return; // 開閉メニュー時はhover無効
      $(this).children('ul').hide();
    });
  }

  //-------------------------------------------------
  // ハンバーガーメニューでの開閉制御関数
  //-------------------------------------------------
  function initHamburger($hamburger) {
    let isAnimating = false;	// 連打防止用フラグ
    $hamburger.on('click', function() {
      if (isAnimating) return;	// アニメーション中は何もしない
      isAnimating = true;

      if ($(this).hasClass('ham')) {
        // 開いている → 閉じる
        closeMenu();
      } else {
        // 閉じている → 開く
        openMenu();
      }

      // メニューのCSSアニメーション(0.2s)完了後にロック解除
      setTimeout(function() { isAnimating = false; }, 300);
    });
  }

  //-------------------------------------------------
  // オーバーレイクリックでメニューを閉じる
  //-------------------------------------------------
  $overlay.on('click', function() {
    closeMenu();
  });

  //-------------------------------------------------
  // レスポンシブ時の表示制御 (リサイズ時)
  //-------------------------------------------------
  const handleResize = debounce(function() {
    const windowWidth = $(window).width();

    // bodyクラスの制御 (small-screen / large-screen)
    if (windowWidth < breakPoint) {
      $('body').removeClass('large-screen').addClass('small-screen');
    } else {
      $('body').removeClass('small-screen').addClass('large-screen');
      // PC表示になったら、ハンバーガー解除 + メニュー・オーバーレイを閉じる
      $menubarHdr.removeClass('ham');
      $menubar.find('.ddmenu_parent ul').hide();
      $overlay.hide();
      $('body').removeClass('noscroll');

      // ▼ #menubar を表示するか/しないかの切り替え
      if (HIDE_MENUBAR_IF_HDR_HIDDEN) {
        $menubarHdr.hide();
        $menubar.hide();
      } else {
        $menubarHdr.hide();
        $menubar.show();
      }
    }

    // スマホ(ブレイクポイント未満)のとき
    if (windowWidth < breakPoint) {
      $menubarHdr.show();
      if (!$menubarHdr.hasClass('ham')) {
        $menubar.hide();
        $overlay.hide();
        $('body').removeClass('noscroll');
      }
    }
  }, 200);

  //-------------------------------------------------
  // 初期化
  //-------------------------------------------------
  // 1) ドロップダウン初期化 (#menubar)
  initDropdown($menubar, isTouchDevice);

  // 2) ハンバーガーメニュー初期化 (#menubar_hdr)
  initHamburger($menubarHdr);

  // 3) レスポンシブ表示の初期処理 & リサイズイベント
  handleResize();
  $(window).on('resize', handleResize);

  //-------------------------------------------------
  // アンカーリンク(#)のクリックイベント
  //-------------------------------------------------
  $menubar.find('a[href^="#"]').on('click', function() {
    // ドロップダウンメニューの親(a.ddmenu)のリンクはメニューを閉じない
    if ($(this).hasClass('ddmenu')) return;

    // スマホ表示＆ハンバーガーが開いている状態なら閉じる
    if ($menubarHdr.is(':visible') && $menubarHdr.hasClass('ham')) {
      closeMenu();
    }
  });

  //-------------------------------------------------
  // 「header nav」など別メニューにドロップダウンだけ適用したい場合
  //-------------------------------------------------
  // 例：header nav へドロップダウンだけ適用（ハンバーガー連動なし）
  //initDropdown($('header nav'), isTouchDevice);
});


//===============================================================
// スムーススクロール（※バージョン2025-3）
// 通常タイプ / fixedヘッダー対応 切り替え版
//===============================================================
$(function() {

    //===========================================================
    // 設定
    //===========================================================
    // 'normal' ＝ 通常タイプ（固定ヘッダーなし）
    // 'fixed' ＝ fixedヘッダー対応
    var scrollType = 'normal';

    // fixedヘッダー時に位置計算に使う要素（※fixed版を使う際は必ずチェック。画面上部に貼り付くブロックを指定する。）
    // 例：'header' / '#header' / '.site-header'
    var fixedHeaderSelector = '#menubar';

    // ページ上部へ戻るボタンのセレクター
    var topButton = $('.pagetop');

    // ページトップボタン表示用のクラス名
    var scrollShow = 'pagetop-show';


    //===========================================================
    // fixedヘッダーぶんの補正値を取得
    //===========================================================
    function getHeaderOffset() {

        // 通常タイプなら補正なし
        if(scrollType !== 'fixed') {
            return 0;
        }

        // 指定要素を取得
        var $header = $(fixedHeaderSelector);

        // 要素がなければ補正なし
        if(!$header.length) {
            return 0;
        }

        // 画面上でのヘッダー下端位置を取得
        // 高さ + 上部の余白(topやmarginで見た目上ずれている分)も含めて見られる
        var rect = $header.get(0).getBoundingClientRect();

        // 念のためマイナスは0にする
        return Math.max(0, rect.bottom);
    }


    //===========================================================
    // スムーススクロール本体
    //===========================================================
    function smoothScroll(target) {

        var scrollTo = 0;

        // '#' の場合はページ最上部へ
        if(target === '#') {
            scrollTo = 0;

        } else {

            // スクロール先の要素を取得
            var $target = $(target);

            // 対象が存在しない場合は何もしない
            if(!$target.length) {
                return;
            }

            // 通常位置から、fixedヘッダー分を引く
            scrollTo = $target.offset().top - getHeaderOffset();

            // 0未満にならないように補正
            if(scrollTo < 0) {
                scrollTo = 0;
            }
        }

        // アニメーションでスムーススクロール
        $('html, body').animate({scrollTop: scrollTo}, 500);
    }

	//===========================================================
	// ページ内リンク / ページトップボタン
	//===========================================================
	$('a[href^="#"], .pagetop').click(function(e) {

		// hrefが無い.pagtopでも '#' 扱いにする
		var id = $(this).attr('href') || '#';

		// .pagetop 以外の href="#" は無視（その場に止める）
		if(id === '#' && !$(this).hasClass('pagetop')) {
			e.preventDefault();
			return;
		}

		e.preventDefault();
		smoothScroll(id);
	});

    //===========================================================
    // ページトップボタンの表示切り替え
    //===========================================================
    $(topButton).hide();

    $(window).scroll(function() {
        if($(this).scrollTop() >= 300) {
            $(topButton).fadeIn().addClass(scrollShow);
        } else {
            $(topButton).fadeOut().removeClass(scrollShow);
        }
    });


    //===========================================================
    // ハッシュ付きURLで開いた時
    //===========================================================
    if(window.location.hash) {
        $('html, body').scrollTop(0);

        setTimeout(function() {
            smoothScroll(window.location.hash);
        }, 500);
    }

});

//===============================================================
// 汎用開閉処理
//===============================================================
$(function() {
	$('.openclose').next().hide();
	$('.openclose').click(function() {
		$(this).toggleClass('active');
		$(this).next().slideToggle();
		$('.openclose').not(this).removeClass('active').next().slideUp();
	});
});



//===============================================================
// form-simple
//===============================================================
(function() {
    "use strict";

    function initAjaxForm(form) {
        var actionUrl = form.getAttribute("action") || "form.php";
        var submitButton = form.querySelector('button[type="submit"]');
        var globalErrorBox = findSiblingBox(form, ".form-global-error");
        var successBox = findSiblingBox(form, ".form-success-box");
        var privacyRow = form.querySelector(".js-privacy-row");
        var attachmentRow = form.querySelector(".js-attachment-row");
        var attachmentInput = attachmentRow ? attachmentRow.querySelector('input[type="file"]') : null;
        var csrfInput = form.querySelector('input[name="csrf_token"]');

        if (!submitButton || !csrfInput) {
            return;
        }

        initDateSelectGroups(form);

        function applyPreviewFallback() {
            var previewPrivacy = form.getAttribute("data-preview-privacy") === "true";
            var previewAttachment = form.getAttribute("data-preview-attachment") === "true";

            togglePrivacyRow(previewPrivacy);
            toggleAttachmentRow(previewAttachment);
        }

        fetchInitData();

        form.addEventListener("submit", function(event) {
            event.preventDefault();

            /* ローカルの通常プレビュー（file://）では送信しない */
            if (window.location.protocol === "file:") {
                return;
            }

            clearErrors();
            hideGlobalError();

            submitButton.disabled = true;

            var hadSelectedFile = attachmentInput && attachmentInput.files && attachmentInput.files.length > 0;
            var formData = new FormData(form);

            fetch(actionUrl, {
                method: "POST",
                body: formData,
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                if (json && json.csrfToken) {
                    csrfInput.value = json.csrfToken;
                }

                if (json && json.ok) {
                    showSuccess();
                    return;
                }

                resetAttachmentOnError(hadSelectedFile);

                if (json && json.fieldErrors) {
                    applyFieldErrors(json.fieldErrors);
                }

                if (json && json.formError) {
                    showGlobalError(json.formError);
                }
            })
            .catch(function() {
                resetAttachmentOnError(false);
                showGlobalError("送信に失敗しました。時間をおいて再度お試しください。");
            })
            .finally(function() {
                submitButton.disabled = false;
            });
        });

        function fetchInitData() {
            /* ローカルの通常プレビュー（file://）では初期化通信を行わず、HTML側のプレビュー設定を使う */
            if (window.location.protocol === "file:") {
                applyPreviewFallback();
                return;
            }

            fetch(actionUrl + "?action=init", {
                method: "GET",
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            })
            .then(function(response) {
                /* form.php が存在しない（404等）場合はプレビューモードにフォールバック */
                if (!response.ok) {
                    applyPreviewFallback();
                    return;
                }
                return response.json();
            })
            .then(function(json) {
                if (!json) {
                    return;
                }

                if (!json.ok) {
                    showGlobalError("フォームの初期化に失敗しました。ページを再読み込みしてください。", false);
                    return;
                }

                if (json.csrfToken) {
                    csrfInput.value = json.csrfToken;
                }

                togglePrivacyRow(json.privacyConsentEnabled !== false);
                toggleAttachmentRow(json.attachmentEnabled !== false);
            })
            .catch(function() {
                /* ネットワークエラーやJSONパース失敗時もプレビューモードにフォールバック */
                applyPreviewFallback();
            });
        }

        function togglePrivacyRow(isEnabled) {
            if (!privacyRow) {
                return;
            }

            privacyRow.hidden = !isEnabled;

            var privacyInput = privacyRow.querySelector('input[name="privacy_consent"]');
            if (!privacyInput) {
                return;
            }

            if (!isEnabled) {
                privacyInput.checked = false;
            }

            privacyInput.disabled = !isEnabled;
        }

        function toggleAttachmentRow(isEnabled) {
            if (!attachmentRow) {
                return;
            }

            attachmentRow.hidden = !isEnabled;

            if (!attachmentInput) {
                return;
            }

            if (!isEnabled) {
                attachmentInput.value = "";
            }

            attachmentInput.disabled = !isEnabled;
        }

        function clearErrors() {
            var rows = form.querySelectorAll(".form-row");
            rows.forEach(function(row) {
                row.classList.remove("is-error");

                row.querySelectorAll(".form-error-text, .form-file-reset-text").forEach(function(message) {
                    message.remove();
                });
            });
        }

        function applyFieldErrors(fieldErrors) {
            var firstRow = null;
            var firstInput = null;

            Object.keys(fieldErrors).forEach(function(fieldName) {
                var input = form.querySelector('[name="' + cssEscape(fieldName) + '"]') ||
                            form.querySelector('[name="' + cssEscape(fieldName) + '[]"]');
                var row = input ? input.closest(".form-row") : null;

                if (!row) {
                    row = form.querySelector('.js-date-select-group[data-field-name="' + cssEscape(fieldName) + '"]');
                    if (row) {
                        input = row.querySelector("select, input, textarea");
                    }
                }

                if (!row) {
                    return;
                }

                row.classList.add("is-error");

                var error = document.createElement("p");
                error.className = "form-error-text";
                error.textContent = fieldErrors[fieldName];
                row.appendChild(error);

                if (!firstRow) {
                    firstRow = row;
                    firstInput = input || null;
                }
            });

            if (firstInput && typeof firstInput.focus === "function") {
                try {
                    firstInput.focus({ preventScroll: true });
                } catch (error) {
                    firstInput.focus();
                }
            }

            if (firstRow) {
                firstRow.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }

        function resetAttachmentOnError(hadSelectedFile) {
            if (!attachmentRow || !attachmentInput) {
                return;
            }

            if (attachmentInput.value !== "") {
                attachmentInput.value = "";
            }

            if (!hadSelectedFile) {
                return;
            }

            var note = document.createElement("p");
            note.className = "form-file-reset-text";
            note.textContent = "安全のため、添付ファイルは再選択してください。";
            attachmentRow.appendChild(note);
        }

        function showGlobalError(message, shouldScroll) {
            if (!globalErrorBox) {
                return;
            }

            if (typeof shouldScroll === "undefined") {
                shouldScroll = true;
            }

            globalErrorBox.textContent = message;
            globalErrorBox.hidden = false;

            if (shouldScroll) {
                globalErrorBox.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }

        function hideGlobalError() {
            if (!globalErrorBox) {
                return;
            }

            globalErrorBox.hidden = true;
            globalErrorBox.textContent = "";
        }

        function showSuccess() {
            form.hidden = true;
            hideGlobalError();

            if (successBox) {
                successBox.hidden = false;
                successBox.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }
    }

    function initDateSelectGroups(scope) {
        var groups = scope.querySelectorAll(".js-date-select-group");

        groups.forEach(function(group) {
            var mode = group.getAttribute("data-date-mode");
            var yearSelect = group.querySelector('[data-date-part="year"]');
            var monthSelect = group.querySelector('[data-date-part="month"]');
            var daySelect = group.querySelector('[data-date-part="day"]');
            var startYear = parseInt(group.getAttribute("data-year-start"), 10);
            var endYear = parseInt(group.getAttribute("data-year-end"), 10);

            if (monthSelect) {
                populateNumberSelect(monthSelect, 1, 12, "月を選択", "月");
            }

            if (yearSelect) {
                if (isNaN(startYear)) {
                    startYear = 1900;
                }
                if (isNaN(endYear)) {
                    endYear = new Date().getFullYear();
                }

                populateNumberSelect(yearSelect, startYear, endYear, "年を選択", "年", true);
            }

            if (daySelect) {
                updateDayOptions();
            }

            if (monthSelect) {
                monthSelect.addEventListener("change", updateDayOptions);
            }

            if (yearSelect && mode === "ymd") {
                yearSelect.addEventListener("change", updateDayOptions);
            }

            function updateDayOptions() {
                if (!daySelect) {
                    return;
                }

                var maxDay = 31;
                var month = monthSelect ? parseInt(monthSelect.value, 10) : NaN;
                var year = yearSelect ? parseInt(yearSelect.value, 10) : new Date().getFullYear();

                if (!isNaN(month)) {
                    if (isNaN(year)) {
                        year = new Date().getFullYear();
                    }
                    maxDay = new Date(year, month, 0).getDate();
                }

                populateNumberSelect(daySelect, 1, maxDay, "日を選択", "日");
            }
        });
    }

    function populateNumberSelect(select, start, end, placeholder, suffix, descending) {
        if (!select) {
            return;
        }

        var currentValue = select.value;
        var numbers = [];
        var i;

        if (descending) {
            for (i = end; i >= start; i -= 1) {
                numbers.push(i);
            }
        } else {
            for (i = start; i <= end; i += 1) {
                numbers.push(i);
            }
        }

        select.innerHTML = "";

        var placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.textContent = placeholder;
        select.appendChild(placeholderOption);

        numbers.forEach(function(number) {
            var option = document.createElement("option");
            option.value = String(number);
            option.textContent = String(number) + suffix;
            select.appendChild(option);
        });

        if (currentValue !== "" && hasOptionValue(select, currentValue)) {
            select.value = currentValue;
        } else {
            select.value = "";
        }
    }

    function hasOptionValue(select, value) {
        var options = Array.prototype.slice.call(select.options);
        return options.some(function(option) {
            return option.value === value;
        });
    }

    function findSiblingBox(form, selector) {
        var parent = form.parentElement;
        if (!parent) {
            return null;
        }
        return parent.querySelector(selector);
    }

    function cssEscape(value) {
        if (window.CSS && typeof window.CSS.escape === "function") {
            return window.CSS.escape(value);
        }
        return String(value).replace(/"/g, '\\"');
    }

    document.addEventListener("DOMContentLoaded", function() {
        var forms = document.querySelectorAll(".js-ajax-form");
        forms.forEach(initAjaxForm);
    });
})();

/* Banco MM2H — refinement behaviour. Loaded after site.js / upgrade.js.
   Removes the bespoke cursor the base engine installs and keeps native cursors. */
(function () {
  function killCursor() {
    document.body.classList.remove('cursor-on');
    document.querySelectorAll('.cursor').forEach(function (n) { n.remove(); });
  }
  function heroVideo() {
    var v = document.querySelector('.vhero__bg');
    if (!v) return;
    var kick = function () {
      if (document.hidden) return;
      if (v.readyState === 0 && v.networkState !== 1) v.load();
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    };
    // browsers defer decode while the page is hidden; retry when it becomes visible
    document.addEventListener('visibilitychange', kick);
    ['pointerdown', 'wheel', 'keydown', 'touchstart'].forEach(function (e) {
      window.addEventListener(e, kick, { once: true, passive: true });
    });
    setTimeout(kick, 400);
    setTimeout(kick, 2000);
  }

  function run() {
    killCursor();
    heroVideo();
    // site.js installs the cursor on its own boot tick; sweep once more after it.
    setTimeout(killCursor, 120);
    setTimeout(killCursor, 600);
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        for (var j = 0; j < muts[i].addedNodes.length; j++) {
          var n = muts[i].addedNodes[j];
          if (n.nodeType === 1 && n.classList && n.classList.contains('cursor')) { killCursor(); return; }
        }
      }
    });
    mo.observe(document.body, { childList: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();

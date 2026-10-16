(function () {
  "use strict";

  function initDhol() {
    const btn = document.getElementById("dholBeatBtn");
    const count = document.getElementById("dholCount");
    const percent = document.getElementById("dholPercent");
    const fill = document.getElementById("dholProgressFill");
    const message = document.getElementById("dholMessage");
    const unlocked = document.getElementById("dholUnlocked");

    if (!btn || !count || !percent || !fill || !message || !unlocked) return;

    const beats = [
      "🎵 Beat 1 — Warm up those celebration feet!",
      "🔥 Beat 2 — The dhol has your attention!",
      "💃 Beat 3 — Add a little wedding swag!",
      "🕺 Beat 4 — No one is allowed to stand still!",
      "🥁 Beat 5 — Celebration energy is rising!",
      "✨ Beat 6 — One last beat before the celebration!",
      "🎉 Beat 7 — LET THE CELEBRATION BEGIN!"
    ];

    let taps = 0;
    let locked = false;
    let lastTap = 0;

    function confetti() {
      const symbols = ["🎉", "✨", "💛", "🌸", "🪷", "🥁"];
      for (let i = 0; i < 42; i++) {
        const el = document.createElement("span");
        el.className = "dhol-confetti";
        el.textContent = symbols[i % symbols.length];
        el.style.left = (Math.random() * 100) + "vw";
        el.style.setProperty("--dx", ((Math.random() - 0.5) * 180) + "px");
        el.style.animationDelay = (Math.random() * 0.35) + "s";
        el.style.fontSize = (12 + Math.random() * 10) + "px";
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2400);
      }
    }

    // Generate a short dhol-style hit locally with Web Audio (no extra audio file required).
    // Audio starts only in response to the guest's tap, satisfying browser autoplay rules.
    let audioContext = null;
    function playDholSound() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioContext) audioContext = new AudioCtx();
        if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
        const ctx = audioContext;
        const t = ctx.currentTime;

        // Deep, resonant drum body.
        const body = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        body.type = "sine";
        body.frequency.setValueAtTime(125, t);
        body.frequency.exponentialRampToValueAtTime(48, t + 0.16);
        bodyGain.gain.setValueAtTime(0.0001, t);
        bodyGain.gain.exponentialRampToValueAtTime(0.75, t + 0.008);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.23);
        body.connect(bodyGain);
        bodyGain.connect(ctx.destination);
        body.start(t);
        body.stop(t + 0.24);

        // Bright, short skin slap layered over the bass hit.
        const length = Math.max(1, Math.floor(ctx.sampleRate * 0.085));
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
          const decay = 1 - i / length;
          data[i] = (Math.random() * 2 - 1) * decay * decay;
        }
        const noise = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const slapGain = ctx.createGain();
        noise.buffer = buffer;
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1500, t);
        filter.Q.setValueAtTime(0.8, t);
        slapGain.gain.setValueAtTime(0.0001, t);
        slapGain.gain.exponentialRampToValueAtTime(0.32, t + 0.004);
        slapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
        noise.connect(filter);
        filter.connect(slapGain);
        slapGain.connect(ctx.destination);
        noise.start(t);
        noise.stop(t + 0.09);
      } catch (_) {
        // Keep the tap interaction functional if Web Audio is unavailable.
      }
    }

    function beat() {
      const now = Date.now();
      if (locked || now - lastTap < 90) return;
      lastTap = now;
      playDholSound();

      taps = Math.min(taps + 1, 7);
      const pct = Math.round((taps / 7) * 100);
      count.textContent = String(taps);
      percent.textContent = pct + "%";
      fill.style.width = pct + "%";
      message.textContent = beats[taps - 1];

      btn.classList.remove("dhol-hit");
      void btn.offsetWidth;
      btn.classList.add("dhol-hit");

      if (taps === 7) {
        locked = true;
        unlocked.hidden = false;
        message.textContent = "🎊 The marriage celebration is ready!";
        confetti();
      }
    }

    // One handler on the actual button; works with mouse, touch and pen.
    btn.addEventListener("pointerup", function (e) {
      e.preventDefault();
      beat();
    }, { passive: false });

    // Fallback for browsers/devices that do not expose PointerEvent.
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      beat();
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        beat();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDhol, { once: true });
  } else {
    initDhol();
  }
})();

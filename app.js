(() => {
  const d = window.weddingDetails || {};
  const intro = document.getElementById('intro');
  const main = document.getElementById('main');
  const openBtn = document.getElementById('openBtn');

  // Wedding background music: starts from the invitation's
  // existing "Open Our Invitation" user gesture and continues while the
  // guest scrolls through the invitation. It loops seamlessly until the
  // page is left/reloaded.
  const weddingMusic = new Audio('./asset/leberch-wedding-584474.mp3');
  weddingMusic.loop = true;
  weddingMusic.preload = 'auto';
  weddingMusic.volume = 0.28;

  function startWeddingMusic(){
    const playPromise = weddingMusic.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Mobile browsers can still block playback in some cases. Retry on
        // the next direct user interaction without changing the invitation.
        const retry = () => {
          weddingMusic.play().catch(() => {});
          document.removeEventListener('pointerdown', retry, true);
          document.removeEventListener('touchstart', retry, true);
        };
        document.addEventListener('pointerdown', retry, true);
        document.addEventListener('touchstart', retry, true);
      });
    }
  }

  openBtn.addEventListener('click', () => {
    intro.classList.add('hide');
    main.setAttribute('aria-hidden','false');
    window.scrollTo({top:0, behavior:'smooth'});
    burstPetals();
    startWeddingMusic();
  });

  // Dense celebratory flower shower
  const petals = document.getElementById('petals');
  const flowerColors = ['#d94b68','#e98a3a','#f2bd45','#e95f83','#c94f9d','#f08b9c','#d8a52d'];
  function petal(){
    const el=document.createElement('i');
    el.className='petal';
    el.style.left=Math.random()*100+'%';
    el.style.setProperty('--drift',(Math.random()*180-90)+'px');
    el.style.setProperty('--drift2',(Math.random()*140-70)+'px');
    el.style.setProperty('--size',(0.55+Math.random()*0.9).toFixed(2));
    el.style.background=flowerColors[Math.floor(Math.random()*flowerColors.length)];
    el.style.animationDuration=(5+Math.random()*5)+'s';
    el.style.animationDelay=(Math.random()*1.2)+'s';
    petals.appendChild(el);
    setTimeout(()=>el.remove(),12000);
  }
  for(let i=0;i<24;i++) petal();
  setInterval(petal,420);
  function burstPetals(){ for(let i=0;i<75;i++) setTimeout(petal,i*28); }


})();

// Minimal mobile UI controller. Desktop unaffected (CSS only loads <=768px)
(function(){
  if(!matchMedia('(max-width: 768px)').matches) return; // only mobile
  const nav = document.getElementById('mobile_nav');
  if(!nav) return;
  const panelIds = ['input_form','scenario_info','ehime_panel','burst-calc-wrapper'];
  const panels = panelIds.reduce((acc,id)=>{ const el=document.getElementById(id); if(el) acc[id]=el; return acc;},{});

  function closeAll(){
    Object.values(panels).forEach(p=>p.classList.remove('mobile-panel-open'));
    nav.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    document.body.classList.remove('mobile-active-panel-open');
  }
  function toggle(id,btn){
    const panel = panels[id];
    if(!panel) return;
    const isOpen = panel.classList.contains('mobile-panel-open');
    closeAll();
    if(!isOpen){
      panel.classList.add('mobile-panel-open');
      btn.classList.add('active');
      document.body.classList.add('mobile-active-panel-open');
    }
  }
  nav.addEventListener('click', e => {
    const btn = e.target.closest('button[data-target]');
    if(!btn) return;
    toggle(btn.getAttribute('data-target'), btn);
  });

  // Auto-show main launch form on first load for guidance
  const initialBtn = nav.querySelector('button[data-target="input_form"]');
  if(initialBtn) initialBtn.click();

  // Expose API for other scripts to show Ehime panel when available
  window.__mobileUI = {
    showEhimePanel: function(){
      const ehimeBtn = document.getElementById('mobile_nav_ehime');
      if(ehimeBtn){ ehimeBtn.style.display='block'; }
    },
    openPanel: function(id){
      const btn = nav.querySelector(`button[data-target="${id}"]`);
      if(btn) btn.click();
    },
    closeAll
  };
})();

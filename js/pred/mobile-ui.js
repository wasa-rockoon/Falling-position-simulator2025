// Responsive mobile UI controller. Re-inits when crossing breakpoint so buttons always work.
(function(){
  var BREAKPOINT = 768;
  var mm = window.matchMedia('(max-width: '+BREAKPOINT+'px)');
  var inited = false;
  var nav, panels = {};

  // Safe closest polyfill (very old browsers)
  if(!Element.prototype.closest){
    Element.prototype.closest = function(sel){
      var el = this; while(el){ if(el.matches && el.matches(sel)) return el; el = el.parentElement; } return null;
    };
  }

  function buildPanels(){
    const panelIds = ['input_form','scenario_info','ehime_panel','burst-calc-wrapper'];
    panels = panelIds.reduce((acc,id)=>{ const el=document.getElementById(id); if(el) acc[id]=el; return acc;},{});
  }
  function closeAll(){
    Object.values(panels).forEach(p=>p.classList.remove('mobile-panel-open'));
    if(nav) nav.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    document.body.classList.remove('mobile-active-panel-open');
  }
  function toggle(id,btn){
    const panel = panels[id];
    if(!panel) return;
    const isOpen = panel.classList.contains('mobile-panel-open');
    closeAll();
    if(!isOpen){
      panel.classList.add('mobile-panel-open');
      if(btn) btn.classList.add('active');
      document.body.classList.add('mobile-active-panel-open');
    }
  }
  function init(){
    if(inited) return; // one-time DOM binding
    nav = document.getElementById('mobile_nav');
    if(!nav) return;
    buildPanels();
    nav.addEventListener('click', function(e){
      var btn = e.target.closest && e.target.closest('button[data-target]');
      if(!btn) return;
      toggle(btn.getAttribute('data-target'), btn);
    });
    // Auto-show launch form panel only when in mobile mode
    if(mm.matches){
      var initialBtn = nav.querySelector('button[data-target="input_form"]');
      if(initialBtn) initialBtn.click();
    }
    inited = true;
  }

  // Re-evaluate on resize: if entering mobile mode ensure panels mapping fresh
  function handleChange(){
    if(!nav) nav = document.getElementById('mobile_nav');
    if(!nav) return;
    buildPanels();
    if(mm.matches){
      // If no panel currently open, auto open launch form for guidance
      var anyOpen = Object.values(panels).some(p=>p.classList && p.classList.contains('mobile-panel-open'));
      if(!anyOpen){
        var btn = nav.querySelector('button[data-target="input_form"]');
        if(btn) btn.click();
      }
    } else {
      // Leaving mobile mode: close overlays to restore desktop draggable windows visibility
      closeAll();
      // Ensure underlying boxes are visible again (desktop CSS expects block)
      ['input_form','scenario_info'].forEach(function(id){
        var el = panels[id]; if(el){ el.style.display='block'; el.classList.remove('mobile-panel-open'); }
      });
    }
  }

  // Public API (idempotent)
  window.__mobileUI = {
    showEhimePanel: function(){ var ehimeBtn = document.getElementById('mobile_nav_ehime'); if(ehimeBtn){ ehimeBtn.style.display='block'; } },
    openPanel: function(id){ var btn = nav && nav.querySelector('button[data-target="'+id+'"]'); if(btn) btn.click(); },
    closeAll: closeAll,
    _rebind: function(){ buildPanels(); }
  };

  // Init now (even on desktop so that later resize works)
  document.addEventListener('DOMContentLoaded', init);
  // Fallback if script loads after DOM
  if(document.readyState === 'complete' || document.readyState === 'interactive') init();
  // Listen to breakpoint changes
  if(mm.addEventListener){ mm.addEventListener('change', handleChange); } else if(mm.addListener){ mm.addListener(handleChange); }
  window.addEventListener('resize', handleChange);
})();



console.log('[debug] scripts loading... might work?');

// selector thingies - $ is easier to type
window.$ = function(sel) {
  return document.querySelector(sel);
};
window.$$ = function(sel) {
  return document.querySelectorAll(sel);
};

// grab stuff from the page
var journeyBoard = $('#journeyBoard');  
var openBtn = $('#jbOpenBtn');         
var closeBtn = $('#jbCloseBtn');        

// JOURNEY PANEL 


function openJourney() {
  if (!journeyBoard) {
    console.warn('cant find journey board, check html');
    return;
  }
  
  journeyBoard.classList.add('is-open');
  console.log('opened journey thing');
  
  
  document.body.style.overflowY = 'hidden';
  
  
  // setTimeout(() => $('#jbCloseBtn')?.focus(), 10);
}

function closeJourney() {
  if (!journeyBoard) return;
  
  journeyBoard.classList.remove('is-open');
  document.body.style.overflowY = '';
}

// hook up the buttons
if (openBtn) {
  openBtn.onclick = function(e) {
    e?.stopPropagation();
    openJourney();
  };
} else {
  console.error('no open button found???');
}

if (closeBtn) {
  closeBtn.onclick = closeJourney;
}

// click outside to close 
if (journeyBoard) {
  journeyBoard.onclick = function(e) {
    if (e.target === this) {
      closeJourney();
    }
  };
}

// escape key 
document.onkeydown = function(e) {
  if (e.key === 'Escape' && journeyBoard && journeyBoard.classList.contains('is-open')) {
    closeJourney();
  }
};

// ACCORDIONS 


var accordions = $$('.accord-head');
var currentOpen = null;  

function handleAccordionClick(header) {
  var content = header.nextElementSibling;
  if (!content || !content.classList.contains('accord-body')) {
    console.warn('weird accordion structure');
    return;
  }
  
  var opening = content.style.display === 'none' || getComputedStyle(content).display === 'none';
  
  // close other one if opening new
  if (opening && currentOpen && currentOpen !== content) {
    currentOpen.style.display = 'none';
    // reset icon 
    var prevToggle = currentOpen.previousElementSibling?.querySelector('.accord-toggle');
    if (prevToggle) prevToggle.textContent = '˅';
  }
  
  // toggle this one
  if (opening) {
    content.style.display = 'block';
    currentOpen = content;
  } else {
    content.style.display = 'none';
    currentOpen = null;
  }
  
  // update the little arrow
  var toggle = header.querySelector('.accord-toggle');
  if (toggle) {
    toggle.textContent = opening ? '˄' : '˅';
  }
}

// set them up
if (accordions.length) {
  accordions.forEach(function(header, i) {
    var content = header.nextElementSibling;
    
    // open first one by default
    if (i === 0) {
      content.style.display = 'block';
      currentOpen = content;
      var toggle = header.querySelector('.accord-toggle');
      if (toggle) toggle.textContent = '˄';
    } else {
      content.style.display = 'none';
    }
    
    // click handler
    header.onclick = function() {
      handleAccordionClick(this);
    };
    
    // keyboard 
    header.setAttribute('tabindex', '0');
    header.onkeydown = function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAccordionClick(this);
      }
    };
  });
} else {
  console.log('no accordions on this page');
}

//  TEXTAREA STUFF 


var allTextareas = $$('textarea');
allTextareas.forEach(function(ta) {
  // initial size
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 'px';
  
  ta.oninput = function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  };
  
  // word counter for article box
  if (ta.classList.contains('editor-area')) {
    // add counter 
    if (!ta.nextElementSibling || !ta.nextElementSibling.classList.contains('word-counter')) {
      var counter = document.createElement('div');
      counter.className = 'word-counter';
      counter.style = 'font-size:12px;color:#777;text-align:right;margin-top:4px;';
      counter.innerHTML = 'words: <b class="word-count">0</b>/500';
      
      ta.parentNode.insertBefore(counter, ta.nextSibling);
      
      ta.oninput = function() {
        // update height
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
        
        // count words
        var words = this.value.trim().split(/\s+/).filter(function(w) {
          return w.length > 0;
        });
        var countEl = this.nextElementSibling?.querySelector('.word-count');
        if (countEl) {
          countEl.textContent = words.length;
          countEl.style.color = words.length > 500 ? 'red' : '';
        }
      };
    }
  }
});

//  SUBMIT BUTTON 


var submitButton = $('.submit-btn');
if (submitButton) {
  submitButton.onclick = function(e) {
    e.preventDefault();
    
    var oldText = this.innerHTML;
    var oldWidth = this.offsetWidth;
    
    // show loading
    this.innerHTML = '<span class="spinner">⌛</span> Submitting...';
    this.disabled = true;
    this.style.width = oldWidth + 'px';  
    
    // fake delay
    setTimeout(function() {
      alert('Submitted! (Successfully)');
      submitButton.innerHTML = oldText;
      submitButton.disabled = false;
      submitButton.style.width = '';
    }, 1200 + Math.random() * 800); 
  };
}

//  MOBILE CRAP 


function setupMobileMenu() {
  if (window.innerWidth < 800) {
    var leftNav = $('.left-rail');
    if (leftNav && !$('.mobile-menu-btn')) {
      var btn = document.createElement('button');
      btn.className = 'mobile-menu-btn';
      btn.textContent = '☰';
      btn.style.cssText = 'position:fixed;top:12px;left:12px;z-index:999;background:#0056ff;color:white;border:none;width:36px;height:36px;border-radius:50%;font-size:18px;';
      
      document.body.appendChild(btn);
      
      btn.onclick = function() {
        leftNav.classList.toggle('show-mobile');
      };
    }
  }
}

setupMobileMenu();
window.addEventListener('resize', setupMobileMenu);

// FORM VALIDATION 


var inputs = $$('input, textarea');
inputs.forEach(function(input) {
  input.onblur = function() {
    if (this.value.trim() === '' && this.hasAttribute('data-required')) {
      this.style.borderColor = 'red';
    } else {
      this.style.borderColor = '';
    }
  };
});

//  TOAST NOTIFICATIONS 


function toast(msg, type) {
  var colors = {
    success: '#28a745',
    error: '#dc3545',
    info: '#17a2b8'
  };
  
  var toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 16px;
    background: ${colors[type] || colors.info};
    color: white;
    border-radius: 6px;
    z-index: 99999;
    opacity: 0;
    transform: translateX(100px);
    transition: all 0.3s;
  `;
  
  document.body.appendChild(toast);
  
  // animate in
  setTimeout(function() {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  // remove after delay
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(function() {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

//  INIT 


document.addEventListener('DOMContentLoaded', function() {
  console.log('[debug] dashboard ready');
  
  // test toast on dev
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('dev mode - adding debug helpers');
    window._debug = {
      openJourney: openJourney,
      toast: toast,
      version: '0.9.2-beta'
    };
    
    // show welcome toast after a sec
    setTimeout(function() {
      toast('Dashboard loaded', 'success');
    }, 500);
  }
  
  // fix safari thing
  if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
    console.log('safari detected, applying hacks');
    // some safari-specific fix
    document.documentElement.style.setProperty('--safari-hack', '1px');
  }
});

// old browser fallback (
if (!window.addEventListener) {
  console.warn('ancient browser detected');
  window.alert = function(msg) { console.log('alert polyfill:', msg); };
}

console.log('[debug] script loaded, fingers crossed');
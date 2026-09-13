/**
 * المنظومة البرمجية التفاعلية للبوابة المركزية الموحدة لمشاريع خلدون عكرمة
 * متوافقة تماماً مع دستور مشاريع خلدون عكرمة الإصدار 3.8
 * خالية تماماً من الشَّخْطات والمحرمات الترقيمية (المادة 4.12)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursorHalo();
  initProjectFiltering();
  initStatsCounter();
  initContactForm();
});

/**
 * هالة التفاعل الذكية التي تتبع مؤشر الفأرة على الأجهزة المكتبية
 */
function initCursorHalo() {
  const halo = document.querySelector('.custom-halo');
  if (!halo) return;

  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouchDevice || prefersReduced) {
    halo.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      halo.style.opacity = '1';
      isMoving = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    halo.style.opacity = '0';
    isMoving = false;
  });

  function renderHalo() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    halo.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(renderHalo);
  }

  requestAnimationFrame(renderHalo);
}

/**
 * نظام تصفية المشاريع حسب التصنيف والبحث المباشر
 */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('projectSearchInput');
  const noResultsState = document.getElementById('noResultsMessage');
  const projectsCountBadge = document.getElementById('visibleProjectsCount');

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const category = card.getAttribute('data-category') || '';
      const title = (card.querySelector('.project-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.project-description')?.textContent || '').toLowerCase();
      const tags = (card.getAttribute('data-keywords') || '').toLowerCase();

      const matchesCategory = currentCategory === 'all' || category === currentCategory;
      const matchesSearch = searchQuery === '' || 
        title.includes(searchQuery) || 
        desc.includes(searchQuery) || 
        tags.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });

    if (projectsCountBadge) {
      projectsCountBadge.textContent = visibleCount;
    }

    if (noResultsState) {
      if (visibleCount === 0) {
        noResultsState.classList.add('active');
      } else {
        noResultsState.classList.remove('active');
      }
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/**
 * عداد إحصائيات المنصة التفاعلي
 */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.portal-stat-number[data-target]');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  statNumbers.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target') || '0', 10);
    const suffix = counter.getAttribute('data-suffix') || '';

    if (prefersReduced) {
      counter.textContent = target.toLocaleString('ar-EG') + suffix;
      return;
    }

    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = current.toLocaleString('ar-EG') + suffix;
    }, 25);
  });
}

/**
 * معالج نموذج المراسلة الرسمي المربوط مع Web3Forms
 */
function initContactForm() {
  const form = document.getElementById('sovereignContactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>جارٍ الإرسال...</span>';

    feedback.className = 'form-feedback';
    feedback.textContent = '';

    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        feedback.className = 'form-feedback success';
        feedback.textContent = 'تم استلام رسالتكم بنجاح وسنقوم بالرد في أقرب وقت.';
        form.reset();
      } else {
        feedback.className = 'form-feedback error';
        feedback.textContent = data.message || 'تعذر إرسال الرسالة حالياً، يرجى المحاولة لاحقاً.';
      }
    } catch (err) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'حدث خطأ في الاتصال، يرجى التحقق من الشبكة أو مراسلتنا مباشرة عبر واتساب.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

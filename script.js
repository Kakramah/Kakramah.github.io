// بوابة خلدون عكرمة: الظهور، والبحث والفلترة، والمشاركة، والنموذج
(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // الظهور من الأسفل مرة واحدة؛ المحتوى ظاهر أصلاً إن لم يعمل السكربت
  if (!reduce && "IntersectionObserver" in window) {
    root.classList.add("js");
    const items = document.querySelectorAll(".intro-text, .lead-work, .feat, .month, .aside, .tail-in > *");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    // ما في الشاشة الأولى يظهر فوراً؛ الحركة لما تحتها وحده
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add("rise");
      io.observe(el);
    });
  }

  // البحث والفلترة
  const q = document.getElementById("q");
  const chips = [...document.querySelectorAll(".chip")];
  const rows = [...document.querySelectorAll(".row")];
  const months = [...document.querySelectorAll(".month")];
  const shown = document.getElementById("shown");
  const empty = document.getElementById("empty");
  const total = rows.length;
  let type = "all";

  const norm = (s) => s
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
    .toLowerCase();

  const apply = () => {
    const terms = norm(q.value.trim()).split(/\s+/).filter(Boolean);
    let n = 0;
    rows.forEach((r) => {
      const hay = norm(r.dataset.hay);
      const ok = (type === "all" || r.dataset.type === type) && terms.every((t) => hay.includes(t));
      r.hidden = !ok;
      if (ok) n++;
    });
    months.forEach((m) => { m.hidden = !m.querySelector(".row:not([hidden])"); });
    shown.textContent = `يظهر ${n} من ${total} عملاً`;
    empty.hidden = n !== 0;
  };

  chips.forEach((c) => c.addEventListener("click", () => {
    type = c.dataset.type;
    chips.forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
    apply();
  }));
  q.addEventListener("input", apply);
  document.getElementById("reset").addEventListener("click", () => {
    q.value = "";
    type = "all";
    chips.forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.type === "all")));
    apply();
    q.focus();
  });

  // المشاركة
  const url = "https://kakramah.github.io/";
  const title = "خلدون عكرمة: الأعمال المنشورة";
  const copied = document.getElementById("copied");
  const native = document.getElementById("share-native");
  if (navigator.share) {
    native.hidden = false;
    native.addEventListener("click", () => navigator.share({ title, url }).catch(() => {}));
  }
  document.getElementById("share-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      copied.textContent = "نُسخ الرابط. الصقه حيث تريد.";
    } catch {
      copied.textContent = `انسخ الرابط يدوياً: ${url}`;
    }
  });

  // النموذج: إرسال حقيقي إلى Web3Forms، والرد داخل الصفحة
  const form = document.getElementById("mail");
  const note = document.getElementById("form-note");
  const sent = document.getElementById("sent");
  const send = form.querySelector(".send");
  let last = 0;

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (!form.checkValidity()) {
      note.textContent = "اكتب اسمك وبريدك ورسالتك، ثم أرسل.";
      form.reportValidity();
      return;
    }
    const wait = 30 - Math.round((Date.now() - last) / 1000);
    if (last && wait > 0) {
      note.textContent = `أرسلتَ للتو. انتظر ${wait} ثانية قبل رسالة أخرى.`;
      return;
    }
    send.disabled = true;
    send.textContent = "يُرسل…";
    note.textContent = "";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || res.status);
      last = Date.now();
      form.reset();
      form.hidden = true;
      sent.hidden = false;
      sent.classList.add("in");
      sent.focus();
    } catch {
      note.textContent = "لم تصل الرسالة. تحقّق من اتصالك وأعد الإرسال، أو راسلني على واتساب.";
    } finally {
      send.disabled = false;
      send.textContent = "أرسل الرسالة";
    }
  });
})();

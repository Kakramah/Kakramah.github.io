# kakramah.github.io

البوابة الرئيسية لأعمال خلدون عكرمة المنشورة: https://kakramah.github.io/

## إضافة عمل

1. أضف العمل إلى `projects.json` (في `works` أو `clients` أو `tools`)، ولقطةً له في `images/thumb-<repo>.webp` بمقاس 640×360.
2. شغّل `python3 build.py`. يبني `index.html` ويحسب العدد والشهور بنفسه.
3. شغّل بوابة الويب من جذر المستودع: `bash ~/khaldoun-library/wiki/_tools/بوابة-الويب.sh`.

لا تعدّل `index.html` يدوياً؛ التعديل مكانه `index.template.html` أو `projects.json`.

## المرجعية

المشروع مبني وفق دستور الويب 4.1 في مكتبة خلدون (`قاعدة_العمل_لمشاريع_خلدون_وأنتي_جرافيتي.md`)، والبوابة الآلية `wiki/_tools/بوابة-الويب.sh`. الهوية والتوكنات في `DESIGN.md`.

## الخطوط

| الخط | الترخيص | المصدر |
|---|---|---|
| Tajawal (400 · 500 · 700) | SIL Open Font License 1.1، `fonts/OFL-Tajawal.txt` | `google/fonts/ofl/tajawal` |
| Noto Naskh Arabic (متغيّر 400 إلى 700) | SIL Open Font License 1.1، `fonts/OFL-NotoNaskhArabic.txt` | `google/fonts/ofl/notonaskharabic` |

الخطوط مقلّمة على العربية واللاتينية الأساسية والأرقام والترقيم، ومستضافة محلياً.

## النموذج

يرسل إلى Web3Forms بمفتاح علني بطبعه (دستور الويب §4.10.3)، مع حقل مصيدة ومهلة 30 ثانية بين إرسالين.

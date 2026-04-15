# Faraid Khilaf Research — De 3 skillnaderna mellan madhahib
### Sammanställning för verifiering med lärda
*April 2026*

---

## Bakgrund

Vid implementering av islamisk arvsrätt (علم الفرائض) i Sista Resan har vi identifierat att de fyra sunni-rättskolorna (Hanafi, Maliki, Shafi'i, Hanbali) i stort sett är eniga om grundreglerna. Av de klassiska skillnaderna är det i praktiken **bara 2 punkter** som faktiskt påverkar beräkningen i moderna fall. Den tredje (zakat/skulder) är alla eniga om.

---

## Punkt 1: الجد مع الإخوة — Farfar med syskon

**Fråga:** Om den avlidne lämnar en farfar (جد) och syskon (إخوة) — ärver syskonen, eller utesluter farfadern dem helt?

### Position A: Farfar UTESLUTER syskon (som om han vore fadern)
**Företrädare:** Abu Bakr al-Siddiq, Ibn Abbas, Abu Musa al-Ash'ari, 14 sahaba, **Abu Hanifa**

**Dalil:**
- القياس على الأب — farfadern är "أب" (far) i Koranens språk: *"ملة أبيكم إبراهيم"* (al-Hajj 22:78)
- Ingen explicit koranvers eller hadith om farfar med syskon — Abu Bakr sa att farfadern tar faderns plats
- أثر أبي بكر: att farfadern ärver som fadern, vilket exkluderar syskon

**Moderna salafi-lärda som valde denna position:**
- **Ibn Taymiyyah** (d. 728 H)
- **Ibn al-Qayyim** (d. 751 H)
- **Ibn Baz** (d. 1420 H / 1999) — valde uttryckligen Abu Bakrs åsikt
- **Ibn Uthaymeen** (d. 1421 H / 2001) — valde uttryckligen Abu Bakrs åsikt
- **Salih al-Fawzan** — valde uttryckligen Abu Bakrs åsikt

### Position B: Farfar DELAR MED syskon (muqasama / المقاسمة)
**Företrädare:** Zaid ibn Thabit → **Maliki, Shafi'i, Hanbali (officiell position)**

**Dalil:**
- Farfadern är inte identisk med fadern — fadern utesluter syskon explicit, men farfadern gör det inte
- Zaid ibn Thabits ijtihad följdes av flertalet sahaba (Ali, Ibn Mas'ud med viss variation)
- Farfadern får det **bästa av**: muqasama (lika delning med syskon), 1/3 av återstoden, eller 1/6 av hela kvarlåtenskapen

**Viktigt:** 🇸🇦 **Det saudiska rättssystemet (نظام الأحوال الشخصية) följer Position B** — farfar delar med syskon enligt jumhur. Trots att Ibn Baz och Ibn Uthaymeen personligen föredrog Position A, tillämpar de saudiska domstolarna den hanbalitiska officiella positionen.

### Rekommendation för appen:
Implementera **BÅDA positionerna** och låt användaren välja. Standardval: Position B (jumhur/saudiskt system). Alternativ: Position A (Abu Bakr/Abu Hanifa).

---

## Punkt 2: الجدة مع الأب — Farmor med fadern

**Fråga:** Om den avlidne lämnar en farmor (أم الأب, paternal grandmother) och fadern lever — ärver farmodern?

### Position A: Farmodern UTESLUTS av sin son (fadern)
**Företrädare:** **Hanafi, Maliki, Shafi'i (zahir al-madhhab)**

**Dalil:**
- القاعدة: من أدلى بشخص حجبه ذلك الشخص — den som härleder sitt arv genom en person utesluts av den personen
- Farmodern (أم الأب) härleder genom fadern → fadern utesluter henne

**OBS:** أم الأم (mormor) utesluts ALDRIG av fadern — hon härleder inte genom honom. Denna punkt gäller BARA أم الأب (farmor).

### Position B: Farmodern ÄRVER trots att fadern lever
**Företrädare:** **Hanbali** (en av två rivayat/berättelser)

**Dalil:**
- حديث ابن مسعود: *"أول جدة أطعمها رسول الله ﷺ السدس: أم أب مع ابنها، وابنها حي"*
  (Den första farmor som Profeten ﷺ gav en sjättedel var en farmor vars son levde)
- القاعدة: من أدلت بوارث فهي وارثة — den som härleder genom en arvinge, ärver själv

**Ibn Uthaymeens val:** Valde Position B — farmodern ärver med fadern, baserat på principen "من أدلت بوارث فهي وارثة".

**Viktigt:** 🇸🇦 **Det saudiska rättssystemet följer Position A** — farmodern utesluts av fadern. Trots Ibn Uthaymeens personliga val tillämpar saudiska domstolar jumhur-positionen.

### Rekommendation för appen:
Standardval: **Position A** (jumhur/saudiskt system). Alternativ: Position B (Hanbali/Ibn Uthaymeen). Visa alltid vilken position som används.

---

## Punkt 3: الديون والزكاة من التركة — Skulder och zakat före fördelning

**Fråga:** Ska den avlidnes skulder (inklusive obetalad zakat) betalas före arvsfördelning?

### ENHÄLLIGT — Alla fyra skolor är eniga ✅

**Dalil (Koran):**
سورة النساء 4:11-12:
*"مِن بَعْدِ وَصِيَّةٍ يُوصِي بِهَا أَوْ دَيْنٍ"*
(Efter testamente som gjorts eller skuld)

**Ordning:**
1. Begravningskostnader (تجهيز الميت)
2. Skulder — inklusive obetalad zakat, löften (نذر), försoningar (كفارات)
3. Testamente (وصية) — max 1/3 av kvarlåtenskapen
4. Arvsfördelning enligt fara'id

**Ingen khilaf** — detta behöver inte vara valbart i appen.

---

## Sammanfattning av lärdas positioner

| Punkt | Abu Hanifa | Maliki | Shafi'i | Hanbali | Ibn Baz | Ibn Uthaymeen | al-Fawzan | 🇸🇦 Saudiskt system |
|-------|-----------|--------|---------|---------|---------|---------------|-----------|-------------------|
| Farfar/syskon | Utesluter | Delar | Delar | Delar | Utesluter | Utesluter | Utesluter | Delar (jumhur) |
| Farmor/far | Utesluts | Utesluts | Utesluts | Ärver* | — | Ärver | — | Utesluts (jumhur) |
| Skulder först | Ja ✅ | Ja ✅ | Ja ✅ | Ja ✅ | Ja ✅ | Ja ✅ | Ja ✅ | Ja ✅ |

*Hanbali har två rivayat — den ena ärver, den andra utesluts.

---

## Nyckelinsikter för Sista Resan

1. **Saudiarabiens system är den säkraste basen** — det följer jumhur (majoriteten) på båda punkterna och är redan implementerat i lag.

2. **De stora salafi-lärda avviker från saudiskt system på punkt 1** — Ibn Baz, Ibn Uthaymeen och al-Fawzan föredrar att farfar utesluter syskon (Abu Bakrs åsikt), men saudiska domstolar tillämpar inte detta.

3. **Praktisk lösning:** Implementera jumhur som standard + låt användaren välja madhab. Vid val av "Hanafi" → farfar utesluter syskon. Vid val av "Hanbali" → farmor ärver med far (om Ibn Uthaymeens riwaya väljs).

4. **Punkt 3 kräver ingen valbarhet** — alla är eniga.

5. **Radd (الرد):** Klassiskt sett sa Shafi'i och Maliki att radd inte sker (överskott går till Bayt al-Mal). Men samtida lärda inom ALLA fyra skolor tillåter radd i avsaknad av fungerande Bayt al-Mal — vilket gäller i praktiken idag. Implementera radd som standard.

---

## Lärda att konsultera för verifiering

### Salafi-lärda med rötter i respektive skola:

**Hanafi-bakgrund:**
- Shaykh Shu'ayb al-Arna'ut (d. 2016) — hanbali/hanafi muhaddith, verifierade hadith-samlingar
- Deoband-traditionen (Indien/Pakistan) — Mufti Taqi Usmani m.fl. (hanafi fiqh med hadith-fokus)

**Shafi'i-bakgrund:**
- Shaykh Muqbil ibn Hadi al-Wadi'i (d. 2001) — yemenitisk, shafi'i-bakgrund, salafi-metodik, grundade Dar al-Hadith i Dammaj
- Lärda från Yemen, Indonesien, Östafrika (shafi'i-dominerade regioner)

**Maliki-bakgrund:**
- Shaykh Muhammad al-Amin al-Shanqiti (d. 1973) — mauritansk, maliki-utbildad, författare till Adwa' al-Bayan, undervisade i Medina
- Lärda från Mauritanien, Marocko, Västafrika (maliki-dominerade regioner)

**Hanbali (bas):**
- Ibn Baz, Ibn Uthaymeen, al-Fawzan — alla välkända, alla har detaljerade fatawa om fara'id

---

## Arabiska nyckelsatser (للمرجعة مع العلماء)

### Punkt 1 — Farfar med syskon:
> هل الجد يحجب الإخوة أم يقاسمهم؟
> قول أبي بكر: الجد كالأب يحجب الإخوة
> قول زيد بن ثابت: الجد يقاسم الإخوة (وعليه الجمهور)

### Punkt 2 — Farmor med far:
> هل الجدة (أم الأب) ترث مع وجود الأب؟
> الجمهور: لا ترث لأنها أدلت به
> رواية حنبلية: ترث لحديث ابن مسعود "أول جدة أطعمها رسول الله السدس أم أب مع ابنها"

### Punkt 3 — Skulder:
> الديون (بما فيها الزكاة) تُقضى من التركة قبل القسمة — بالإجماع
> الدليل: "من بعد وصية يوصي بها أو دين" (النساء ١١-١٢)

---

## Källor

- [IslamQA — ميراث الجد مع الإخوة](https://islamqa.info/ar/answers/240582)
- [IslamWeb — ميراث الجد والجدة مع الإخوة](https://www.islamweb.net/ar/fatwa/66473)
- [IslamWeb — أحوال الجد في الميراث](https://www.islamweb.net/ar/fatwa/10173)
- [Alukah — ميراث الجد مع الإخوة](https://www.alukah.net/sharia/0/111283)
- [Ibn Baz — شرح الفرائض](https://binbaz.org.sa/audios/2207)
- [Ibn Baz — الجد محجوب عن الميراث](https://binbaz.org.sa/audios/2206)
- [Almerja — المذاهب في ميراث الجد](https://almerja.com/reading.php?idm=126700)
- [Wikipedia AR — إرث الجد والإخوة](https://ar.wikipedia.org/wiki/إرث_الجد_والإخوة)
- [Wikipedia AR — إرث الجدات](https://ar.wikipedia.org/wiki/إرث_الجدات)
- [Heyat al-Khubara — نظام الأحوال الشخصية](https://laws.boe.gov.sa/BoeLaws/Laws/LawDetails/4d72d829-947b-45d5-b9b5-ae5800d6bac2/1)
- [Wikipedia EN — Islamic inheritance jurisprudence](https://en.wikipedia.org/wiki/Islamic_inheritance_jurisprudence)
- [WASSIYYAH — Islamic Inheritance Law](https://wassiyyah.com/blog/islamic-inheritance-questions)
- [SunnahOnline — Islamic Laws of Inheritance](https://sunnahonline.com/library/fiqh-and-sunnah/780-the-islamic-laws-of-inheritance)

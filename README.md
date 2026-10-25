# Pan-Min-Nan POJ diasystem auto-deriver
## 泛閩南語白話字綜合音系自動推導器

[中文說明 (Traditional Chinese)](README.zh-Hant.md)

Give it a Chinese character and it gives you the literary (文讀) Hokkien reading in Pe̍h-ōe-jī (POJ), worked out from how the character sounded in Middle Chinese.

```
學而時習之，不亦說乎      ha̍k jî sî si̍p chi, put e̍k ia̍t hô͘
床前明月光，疑是地上霜    chhông chiân bêng goa̍t kong, gî sǐ tē siāng song
關關雎鳩，在河之洲        koan koan chhir kiu, chǎi hô chi chiu
```

## What it is for

Most characters have two readings in Hokkien. The everyday (白讀) reading is the spoken word: 大 is *tōa* in "big". The literary (文讀) reading is the one used to read classical texts and poetry aloud: 大 is *tāi* in 大學. Dictionaries give literary readings for only some characters, and they often disagree, because Amoy, Taiwan, Zhangzhou, Quanzhou and Penang each read things a little differently.

This script gives every character one consistent literary reading. You can use it to read a classical text aloud in Hokkien, to fill a dictionary gap, or as the reading layer of a study tool. It works the way the old rime books did. It starts from the character's Middle Chinese sound (its 反切 in the 廣韻), applies rules for how each Middle Chinese sound comes out in literary Hokkien, and then checks a short list of exceptions for the words where Hokkien doesn't follow its own pattern.

It is a script for [NK2028's tshet-uinh-deriver](https://nk2028.shn.hk/tshet-uinh-deriver/), a tool that derives readings from Middle Chinese.

## Why a "mosaic"

No single Hokkien variety keeps every distinction Middle Chinese had, but between them they keep a lot. The script follows one rule: **if any reference variety keeps a distinction, keep it; if none does, don't invent it.** The reference varieties are Amoy, Taiwanese, Zhangzhou, Quanzhou and Penang, plus Lukang for tone 6.

| Distinction kept | Kept by | Example |
|---|---|---|
| 陽韻 *iang* vs 東三/鍾 *iong* | Zhangzhou | 良 liâng ≠ 龍 liông |
| 魚韻 *ir* vs 虞韻 *u* | Quanzhou (Zhangzhou also keeps it, as *i*) | 居 kir ≠ 拘 ku |
| 侯韻 *io* vs 模韻 *o͘* | Quanzhou | 樓 liô ≠ 盧 lô͘ |
| 痕/殷韻 *irn* vs 魂 *un* and 真 *in* | Quanzhou (Zhangzhou and Amoy each keep one side) | 恩 irn ≠ 溫 un ≠ 因 in |
| 日母 *j* vs 來母 *l* | Zhangzhou, Penang | 人 jîn ≠ 鄰 lîn |
| 全濁上 tone 6 vs tone 7 | Lukang, Quanzhou, Nan'an, Hui'an | 是 sǐ ≠ 示 sī |
| 灰韻 *oe* vs 微韻 *ui* | Zhangzhou, Quanzhou | 灰 hoe ≠ 揮 hui |
| 侵韻 莊組 *om* vs 侵韻 *im* | both rime books (箴 字母) | 森 som ≠ 心 sim |

Across the 3,804 小韻 this gives 1,759 distinct syllables. An earlier, Amoy-based version of the script gave 1,396. The result is not any one real dialect, and it is not a reconstruction of a single historical layer, since the varieties did not borrow their literary readings as one system (楊秀芳 1982). Still, every distinction it makes is one that real speakers make somewhere.

## How good is it?

For the characters you will actually meet, it gives a reading that Hokkien really has almost every time.

| | In running classical text | 1,000 most common | 3,000 most common | All 7,683 characters |
|---|---|---|---|---|
| Rules only | 98.4% | 98.0% | 95.0% | 86.5% |
| Rules + exception list | **99.8%** | **100%** | **98.1%** | 88.5% |

A reading counts as a match when both its initial and its final occur in some recorded Hokkien reading of that character. Tone isn't scored, because the tone is the Middle Chinese class by design. The test set is the 7,683 characters that have a single 廣韻 reading and appear in the dictionaries or survey tables.

The last column looks bad, but it counts a character like 蠆 "scorpion" the same as 之. The first column weights each character by how often it occurs in the Chinese Text Project corpus (about 5.7 million characters). The 1,000 most common characters make up 88% of that text, and the 3,000 most common make up 98%. 882 characters still don't match. None of them is among the 1,000 most common, 824 (93%) are outside the 3,000 most common, and 357 never occur in the corpus at all.

Notes:
- "Most common" means by classical-Chinese frequency.
- Characters with more than one 廣韻 reading (不, 大, 長, 行) aren't scored, because which reading is right depends on context. The single-reading characters that are scored make up 71% of running text.
- The exception list was chosen from the same data, so the second row is in-sample. To test the rules on characters they had not seen, the generated finals table was rebuilt from half the characters and scored on the other half. It scored 86.1% (all), 96.1% (1,000 most common) and 89.0% (3,000 most common), against 85.6% on the half it was built from, so the generated table isn't overfitted.

## What the exception list fixes

The rules describe the regular pattern, but a couple of hundred characters, many of them common words, don't follow it. With the option **例外** on (the default), about 216 such characters (244 readings, plus 56 variant forms) get the syllable Hokkien really uses. An exception replaces only the initial and the final; the tone always stays the Middle Chinese class. Turn the option off to see the plain rule output.

| Character | 反切 | Rules give | With 例外 | Why the rules miss |
|---|---|---|---|---|
| 不 | 分勿切 | hut | **put** | 非母 normally becomes h- (分 hun, 法 hoat, 風 hong), but this, the second most common character, kept the old p- in every Hokkien source. |
| 大 | 唐佐切 | tō | **tāi** | Hokkien reads this 大 by its other 反切 (徒蓋切), tāi. No source has tō; the everyday word is tōa. |
| 萬 | 無販切 | boān | **bān** | After 微母, 元韻 合口 is normally oan (晚 boán), but 萬 is bān in every Hokkien source. |
| 乃 | 奴亥切 | lái | **nái** | 泥母 normally merges with 來母 as l- (奴 lô͘, 能 lêng), but 乃 kept n-. |
| 馬 | 莫下切 | bá | **má** | 明母 is normally b- (麻 bâ), but 馬 kept m-. |
| 鳥 | 都了切 | tiáu | **niáu** | The sources read niáu (or jiáu), not the t- of the 反切. |
| 頭 | 度侯切 | tiô | **thiô** | 定母 is normally unaspirated (豆 tiō, 徒 tô͘), but 頭 is aspirated everywhere (thiô, thô͘, thâu). |
| 內 | 奴對切 | lūi | **lōe** | 灰韻 after 端組 and 來母 is ui (對 tùi, 雷 lûi), but 內, 退 and 罪 are oe. |
| 米 | 莫禮切 | bé | **bí** | 齊韻 after labials is kept as e (迷 bê, 謎 bē, 陛 pě), but 米 and 閉 are bí and pì. |
| 某 | 莫厚切 | bió | **bó͘** | Quanzhou's io for 侯韻 (口 khió, 母 bió) doesn't reach 某, 畝, 牡 or 戊, which are bó͘ everywhere. |
| 謹 | 居隱切 | kírn | **kín** | Quanzhou's irn for 痕/殷韻 (根 kirn, 斤 kirn) is irregular even in Quanzhou: 謹 is kín and 隱 is ún. |
| 雄 | 羽弓切 | iông | **hiông** | 云母 normally has no initial (王 ông, 雲 ûn), but 雄 and 熊 have h-. |
| 貞 | 陟盈切 | teng | **cheng** | 知母 is normally t- (知 ti, 中 tiong), but 貞 is cheng. |
| 完 | 胡官切 | hoân | **oân** | 匣母 is normally h- (寒 hân, 換 hoān), but 完 has no initial. |

An exception is used only when the rule output isn't a syllable that any Hokkien variety has for that character. The replacement is the recorded syllable nearest to the rule output (fewest of initial and final changed), and a reading a dictionary marks as literary is preferred. If you don't pass the character itself (字頭), the rules decide.

## Why rare characters miss, and why the rule reading is often the better guess

Almost all of the remaining misses are rare characters. Part of that is the rules: they were tuned on characters with plenty of data, so a rare 小韻 can come out wrong. But for a rare character, the recorded reading is often weaker evidence than the 反切:

- **Read by its phonetic component (有邊讀邊).** 蠆 "scorpion" (丑犗切, so thài) is recorded as bān and māi, the readings of 萬 and 邁, which share its phonetic, and as chhài. 痏 "bruise" (榮美切, so úi) is recorded only as iū, after its phonetic 有 (iú), and only in one dictionary.
- **Confused with a look-alike character.** 茍 (紀力切, so kek) is recorded as kó͘, the reading of 苟 (古厚切).
- **Read as the character it stands in for.** 寔 "truly" (常職切, so se̍k) is recorded as si̍t, the reading of 實. 寘 "to place" (支義切, so chì) is recorded as tì, the reading of 置. 沖 (直弓切, so tiông) is recorded as chhiong, the reading of 衝, with which it is often interchanged.
- **Mosaic finals that no source records for that character.** 152 of the 882 misses use one of the mosaic finals (ir, irn, iang, io, om) on a character recorded only in varieties that merge it. For example, 姤 gives kiò, and the sources record kò͘.

The evidence for rare characters is also thin. Among rare characters that miss, 72% are attested only in the rime-book tradition: 雅俗通, Medhurst (which is arranged on the 十五音), and 甘字典 and Wiktionary, which largely follow them. Among rare characters that match, the figure is 51%. And 45% of the rare misses have just one source, against 23% of the rare matches.

That is why the exception list is strict for rare characters. Outside the 3,000 most common, a character gets an exception only if its reading is attested outside the rime-book tradition: in the MOE dictionary, 臺日大辭典, Douglas, Macgowan, the 1604 Manila record or a modern survey. Every row was then reviewed by hand. Colloquial words written with a rare character (尪 ang), Mandarin-shaped readings (傻 sa) and variants of characters the rules already handle (猪 = 豬) were dropped. Otherwise the 反切 reading stands. For a character you will rarely hear read aloud, a reading that fits the system is a better guess than one a rime book may itself have guessed.

## Using it

**In the browser.** Open the [tshet-uinh-deriver](https://nk2028.shn.hk/tshet-uinh-deriver/), add a custom script, and paste in `hokkien-wendu-poj.js`.

**In Node** (tshet-uinh 0.15.x):

```js
import TshetUinh from 'tshet-uinh';            // npm install tshet-uinh@0.15.4
import fs from 'fs';

const code = fs.readFileSync('hokkien-wendu-poj.js', 'utf8');
const derive = new Function('TshetUinh', '選項 = {}', '音韻地位', '字頭 = null', code);

for (const { 音韻地位 } of TshetUinh.資料.query字頭('頭'))
  console.log(derive(TshetUinh, { 例外: true }, 音韻地位, '頭'));   // thiô
```

**Output.** The output is POJ with the usual extensions: o͘, ir, irn, and eng/ek. Tones are 1 unmarked, 2 á, 3 à, 4 unmarked with -p/-t/-k/-h, 5 â, 6 ǎ, 7 ā, 8 a̍. The tone is always the Middle Chinese class (清/濁 × 平上去入), with 全濁上 as tone 6, so a word whose tone moved in a given variety keeps the Middle Chinese tone here (係 hè, where most varieties have hē).

## Sources, and what each one contributed

The figures in brackets are how many characters a source has readings for, and how many of the 244 exception readings it confirms. Entries marked [unchecked] give publication details from memory; the rest were checked against a title page, a library record or the project page.

### Middle Chinese

- **nk2028. 2021-. tshet-uinh-js** (npm: tshet-uinh 0.15.4) and the NK2028 deriver framework. https://github.com/nk2028/tshet-uinh-js . The 3,804 小韻 positions every rule is written over, with their 反切.

### Hokkien dictionaries (via the [ChhoeTaigi database](https://github.com/ChhoeTaigi/ChhoeTaigiDatabase))

- **Campbell, William (甘為霖). 1913. 廈門音新字典 ("甘字典").** Digitized and edited by 林俊育 (Lîm Chùn-io̍k). [11,163 characters; confirms 219 exception readings] This is the backbone. The generated finals table (177 rows) is the most common literary final in 甘字典 for each combination of 韻, 呼, 等 and 類. Its capitalized and 文 entries mark the literary readings. It draws heavily on the rime-book tradition, so it doesn't count as independent support for a rare character.
- **小川尚義. 1931-32. 臺日大辭典.** 臺北: 臺灣總督府 [unchecked]. Taigi translation and editing by 林俊育, as distributed by ChhoeTaigi ("台日大辭典 台譯版"). [3,481; 90] Taiwanese readings as recorded in the 1930s, and independent support for rare characters.
- **教育部. 2011-. 臺灣閩南語常用詞辭典.** 臺北: 教育部. https://sutian.moe.edu.tw/ . [3,744; 117] Present-day Taiwanese readings. Its (文) marks tell literary from colloquial, and it is independent support for rare characters.
- **Wiktionary contributors. Hokkien and Teochew pronunciation sections**, single-character entries (Wiktextract JSON extract of the dump). https://en.wiktionary.org/ ; extractor: https://github.com/tatuylonen/wiktextract . [6,171 Hokkien; 151] Fills gaps and supplies most of the Teochew evidence. It often copies 甘字典, so it is counted with the rime-book tradition.

### Historic Hokkien

- **謝秀嵐. 1818. 彙集雅俗通十五音.** (Zhangzhou rime book) [unchecked]. Digitization used: AlanJui, ho-lok-ue-tools, https://github.com/AlanJui/ho-lok-ue-tools . [9,646; 179] The Zhangzhou literary finals: its 姜 字母 is the source of 陽韻 *iang*, and its 箴 字母 of 侵韻 莊組 *om*.
- **Douglas, Carstairs. 1873. Chinese-English Dictionary of the Vernacular or Spoken Language of Amoy.** London: Trübner & Co. (checked: HathiTrust https://catalog.hathitrust.org/Record/001774286 ). Supplement by Thomas Barclay, Shanghai: Commercial Press, 1923. Facsimile reprints: 臺北: 南天書局, 1990, ISBN 957-9482-32-2; 臺北: 古亭書屋, 1970. Digitization used: Community-Min-Language-Rime, Hokkien/Dictionary/Amoy.csv, https://github.com/Language-Preservation-Community/Community-Min-Language-Rime . [3,815, of which 2,699 have readings marked "R."; 83] Amoy reading pronunciations, marked "R.", which tell literary from colloquial. With 雅俗通 and Medhurst, it shows that 灰韻 after 端組, 精組 and 來母 is *ui* (對 tùi, 推 thui, 雷 lûi).
- **Medhurst, Walter Henry. 1832. A Dictionary of the Hok-këèn Dialect of the Chinese Language, according to the Reading and Colloquial Idioms.** Macao: Honorable East India Company's Press, by G. J. Steyn and Brother. Catalogues give 1832 on the title page; one record's text says 1837, the date MCPDict uses. https://china-bibliographie.univie.ac.at/2010/04/17/medhurst-dictionary/ . Used through the MCPDict table "1837漳浦". [9,262, of which 1,115 are marked literary; 173] Zhangpu readings, evidence for *iang*. It is arranged on the 十五音, so it is counted with the rime-book tradition.
- **Chirino, Pedro. 1604. Dictionarium Sino-Hispanicum.** Manila; manuscript, Biblioteca Angelica, Rome, Ms. 60 (see Klöter's survey of the Manila sources: https://www.benjamins.com/online/hl/articles/hl.00170.doh ). Used through the MCPDict table "1604馬尼拉漳州", identified with this work by its date. This is not the later anonymous Dictionario Hispanico Sinicum (c. 1626-46, University of Santo Tomas). [3,392; 79] The oldest record, Zhangzhou speech in Manila. It is independent of the rime books and is evidence for *iang*.
- **Macgowan, John. 1883. English and Chinese Dictionary of the Amoy Dialect.** Amoy: London Missionary Society [publisher: unchecked; author and year: SOAS record https://library.soas.ac.uk/Record/PCE.FMC.3.03.01 ]. Used through the MCPDict table "1883厦門（英厦辭典）". [2,896; 65] Nineteenth-century Amoy, independent of the rime books.
- **黃謙. 1800. 彙音妙悟.** (Quanzhou rime book) [unchecked]. No machine-readable copy was used; it was read through 洪 1996 below. It is the Quanzhou side of the design. It puts 母 某 謀 牟 in the 鉤 rime with 侯韻, which supports giving 明母 侯韻 the same *io*, and it keeps 登/庚二/耕 apart as *irng*. An option for *irng* was tried and removed, because almost no one reads it that way and it cost 2 points of agreement.

### Modern survey tables

- **osfans (編). 2016-. 漢字音典 (MCPDict).** https://github.com/osfans/MCPDict , tools/tables/output/ . There are 24 modern Hokkien tables: Quanzhou group 泉州, 晉江, 南安, 永春, 德化, 惠安, 安溪, 金門 and 石獅; Amoy 厦門; Zhangzhou group 漳州, 長泰, 華安, 南靖, 漳浦, 雲霄, 東山, 詔安 and 平和; Taiwan 臺北, 嘉義, 澎湖 and 高雄; and 檳城 (Penang). Each table has 1,578 to 5,972 characters and its own 文/白 marks. A survey reading counts as literary when its table marks it 文, when it is historic, or when two tables agree. The surveys are what show which variety keeps which contrast: *io* in 泉州, 晉江, 南安 and 惠安; tone 6 in 泉州, 南安 and 惠安; *irn* in 南安, 惠安, 永春 and 德化; *iang* in 漳州, 漳浦, 東山, 華安, 南靖, 長泰, 雲霄 and 平和; *j* in Penang and Zhangzhou. The four Teochew tables (潮州, 汕頭, 揭陽, 潮陽) are used as evidence only: a syllable that Teochew has is never counted as wrong.
- **mogher.com.** https://www.mogher.com/ . Teochew readings for 850 characters found nowhere else; one Teochew reading, 萬 buāng, was added by hand. Evidence only.

### Studies

- **洪惟仁. 1996. 《彙音妙悟》與古代泉州音.** 臺北: 國立中央圖書館臺灣分館 (審議: 何大安, 張光宇). ISBN 957-9067-99-6. The 文/白/正音 analysis of the 妙悟 rimes, and the page references in the script's comments (106, 116 and 127 for 登/庚/耕 *irng*; 127 for Lukang teachers still reading 侵韻 莊組 as *tsirm / sirm*). The Lukang tone 6 follows 洪惟仁's work on Lukang and was not re-derived from a table.
- **杜佳倫 (Tu, Chia-lun). 2011. 閩語歷史層次分析與相關音變探討 (The Diachronic Strata Analysis of Min Phonology).** 國立臺灣大學中國文學研究所博士論文 (advisor: 楊秀芳). https://tdr.lib.ntu.edu.tw/handle/123456789/9993 . The layer analysis behind the mosaic finals: it treats Zhangzhou *-iaŋ/-iak*, Quanzhou 侯韻 *-io* and 痕/殷 as literary-layer readings. Its finding that 一、二等 merge as 洪音 in the literary layer is why 山韻 二等 見組 reads *an* (間 kan), not *ian*.
- **楊秀芳. 1982. 閩南語文白系統的研究.** 國立臺灣大學博士論文 [unchecked: later published, 臺北: 臺灣學生書局, 1991]. The 文白 system. Its point that the literary layers were not borrowed as one system is why this is called a diasystem. Its Quanzhou chapter is criticized in 洪 1996.
- **羅常培. 1930. 廈門音系.** 中央研究院歷史語言研究所單刊甲種之二 [unchecked]; the 1956 reprint (北京: 科學出版社) was used. Chapter V, the 廣韻 comparison, was used to check the Amoy backbone.

### Other data

- **樺修朙 (Maxim Klyashtornyy) (編). 2024. 文言頻率詞典** (revision 2024-12-30). Built from a frequency count of the Chinese Text Project corpus (https://ctext.org ) by Reddit user LeatherButterfly4098, with help from justsilvestrein (CEAL Discord). It supplies the classical-Chinese frequency ranks and the text weights above; a character it doesn't list counts as rare. It replaced 泛亞漢文詞頻詞典 (汐洛思, https://github.com/ShiraTheMogul/fanyahanwen-corpus ), which ranks later, Buddhist, Japanese and simplified forms high (這 is 949th there and 8,218th here; 了 381st against 3,819th).
- **教育部. 異體字字典 (variant groups).** https://dict.variants.moe.edu.tw/ . This supplies the 56 variant forms in the exception table (頭 头, 歲 岁), with Unicode Unihan simplified/traditional links (https://www.unicode.org/charts/unihan.html ). The file was obtained by 樺修朙 from the Ministry of Education for research. It is for personal use only and is not part of this repository.

## Details, for readers who know the 廣韻

**Initials** (聲母表), hand-written, first match wins.
- 非敷奉 become h- (風 hong, 法 hoat), while 微 stays b- (無 bû, 文 bûn).
- 幫滂並 are p/ph/p, with ph- for 並母 宵韻 A類 (瓢 phiâu).
- 明 is b-, except m- in 豪韻 (毛 mô͘) and 蟹攝 一/二等 去聲 (賣 māi).
- 端透定 and 知徹澄 are t/th/t, and 泥孃來 are all l-.
- 精組, 莊組 and 章組 are ch/chh/s, with these exceptions: 崇母 平聲 is chh (柴 chhâi), 崇母 止攝 is s (士 sǔ), 精母 東三 and 從母 陽韻 平聲 are chh, and 船/常 are s.
- 日 is j-.
- 見溪羣疑 are k/kh/k/g, with ng- before o and o͘. kh- appears for 魂韻 見母 平聲 (昆 khun), 元韻 見母 入聲 (厥 khoat), and 羣母 深/咸攝 平/上 (琴 khîm, 儉 khiǎm).
- 曉匣 are h-.
- 影云以 have no initial, with these exceptions: 云母 蒸韻 is h- (域 he̍k), and 以母 虞韻 and 祭韻 合口 are j- (愉 jû, 銳 jōe).

**Finals** (韻母表), first match wins:
1. 鑲嵌 (mosaic): 陽韻 開口 not 莊組 → *iang/iak*; 侯韻 and 尤韻 莊組/明母 → *io*, except 心/生母 (叟 só͘) and 侯韻 幫滂並 (部 pǒ͘); 痕/殷 → *irn/irt*. These rules are unconditional.
2. 手動 (manual): hand rules that keep a contrast. 魚韻 → *ir*, except 莊組 → *o͘* (初 chho͘). 灰韻 → *oe*, except 端組, 精組 and 來母 → *ui* (but 頹 tôe). 侵韻 莊組 舒聲 → *om*. 豪韻 明母 → *o͘*. 江韻 莊組 → *ong*. 齊韻 幫組 → *e*. Smaller ones: 江韻 and 登韻 幫組 入聲 → *ok* (剝 pok, 北 pok), 微韻 明母 → *i* (微 bî), 夬韻 合口 → *oai* (快 khoài).
3. 補充: four hand overrides of the generated table.
4. 自動: the modal 甘字典 literary final per 韻/呼/等/類, generated by script, not hand-edited.
5. 後備: a fallback per 韻.

Entering-tone syllables carry the same 韻/等/呼 as their level-tone partners, so one table serves all four tones and the coda is converted afterwards.

**Tones**: 清平 1, 濁平 5, 全濁上 6, other 上 2 (次濁上 joins 清上, as in every reference variety), 清去 3, 濁去 7, 清入 4, 濁入 8.

**What each mosaic feature adds** (distinct syllables, out of 3,804 小韻): tone 6 +106; 陽 *iang* +61; 日 *j* +53; 魚 *ir* +47; 侯 *io* +43; 痕殷 *irn* +23; 灰 *oe* +10; 齊 幫組 *e* +8; 侵 莊組 *om* +8. The total is 1,759, or 1,631 without iang/io/irn. Scored against Amoy 甘字典 finals alone (held out), the finals match 91.7% without iang/io/irn and 87.1% with them. That 4.6-point drop is the price of keeping contrasts Amoy doesn't have.

**Still merged**, because no reference variety separates them in literary readings or POJ can't write the difference: 支/脂/之 (*i*), 歌/豪 (*o*), 清/青/蒸/庚三 and 登/庚二/耕 (*eng/ek*), 仙/先 (*ian*), 覃/談 (*am*), 知 = 端 (*t*), 精 = 章 = 莊 (*ch*), 邪 = 心 (*s*), 侯 幫滂並 = 模 (*o͘*), 真韻 B類 見組 = A類 (*in*), and 止攝 精莊 = 虞 精莊 (*u*).

**Known limits.**
- The tone is always the Middle Chinese class, so readings that moved to another tone keep the old one: 係 hè (usually hē), 踏 thap (ta̍p), 站 chàm (chām), 懈 hài (hāi).
- Characters whose dictionary reading belongs to a variant or another word at a different 音韻地位 are deliberately left to the rules (粗, 唇, 玆, 庄, 鎗).

**Notes for anyone editing the script** (tshet-uinh 0.15.4):
- In `音韻地位.判斷(rules, throws)` the second argument is `throws`, not a default value. Pass an error string so an uncovered 音韻地位 fails loudly.
- A rule's result must not be an array; it would be read as a nested rule list.
- Labels must be in traditional characters: 羣母, not 群母; 常母, not 禪母; 全濁/清音/濁音.
- Options are declared when 音韻地位 is missing, as `['key|label\ndescription', default]`, and arrive as `選項.key`. 字頭 is the character as typed.
- The 自動 table and the exception table are generated by the build pipeline, which isn't in this repository. Edit the hand-written tables instead.

## Cite as

樺修朙 and Claude (Anthropic). 2026. *Idealized literary (文讀) Hokkien in Pe̍h-ōe-jī, derived from Middle Chinese: a tshet-uinh deriver.* https://github.com/xiumingmk/hokkien-wendu-poj

Design rule, choice and supply of sources, and review: 樺修朙. Data analysis, rule writing, exception list and tests: Claude (Anthropic), run through Claude Code.

## Licence

MIT; see [LICENSE](LICENSE). The licence covers the script only. The dictionaries and data it was built from keep their own terms.

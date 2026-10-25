/* 推導閩南語文讀音（白話字 POJ）——理想化版本
 * Idealized literary (文讀) Hokkien in Pe̍h-ōe-jī, derived from Middle Chinese (tshet-uinh).
 * Framework: NK2028 tshet-uinh-deriver (tshet-uinh 0.15.x).
 *
 * DESIGN RULE
 *   A Middle Chinese contrast is kept if at least one reference variety keeps it, and is never
 *   invented otherwise. Reference varieties: Amoy, Taiwanese, Zhangzhou, Quanzhou, Penang,
 *   plus Lukang (鹿港) for tone 6. Chaozhou/Teochew and Hainanese are NOT references, but Teochew
 *   counts as evidence when checking: a syllable that Teochew has is never called wrong.
 *   The result is a mosaic, not one coherent dialect: the literary layers of the reference varieties
 *   were not borrowed as one system (楊秀芳 1982), so this is a diasystem, not a reconstruction of any
 *   single historical layer. Output is valid POJ with the usual
 *   extensions (o͘, ir, irn, eng/ek); tone 6 (全濁上) is written with a caron: ǎ ě ǐ ǒ ǔ.
 *   The tone is always the Middle Chinese class (清/濁 x 平上去入, 全濁上 = 6), also in the
 *   exceptions below: they replace the initial and final, never the tone.
 *   〔設計原則〕只要有任何一個參照方言保留某個《切韻》音系對立，就保留；絕不憑空創造對立。參照方言：廈門、臺灣、漳州、
 *   泉州、檳城，另以鹿港為全濁上（第六聲）的依據。潮州話與海南話不是參照，但潮州話可作檢驗證據：潮州話有的音節不算錯。
 *   結果是「鑲嵌」而非單一方言：各參照方言的文讀層並非一體借入（楊秀芳 1982），所以這是一個綜合音系（diasystem），不是
 *   任何單一歷史層次的重建。輸出為合法的白話字（POJ），並用慣例的擴充符號（o͘、ir、irn、eng/ek）；全濁上（第六聲）以抑揚符
 *   （caron）標示：ǎ ě ǐ ǒ ǔ。聲調一律取中古調類（清/濁 × 平上去入，全濁上 = 6），下方例外也一樣：例外只替換聲母與韻母，不動聲調。
 *
 * See README.md in the repository for a plain-language introduction. 〔白話介紹見倉庫中的 README.md。〕
 *
 * LICENSE
 *   MIT License. Copyright (c) 2026 樺修朙 (Maxim Klyashtornyy) and Claude (Anthropic).
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 *   documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 *   the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 *   to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *   The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 *   the Software.
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 *   THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *   TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 *   (The licence covers this script only. The source dictionaries and the MOE variant file keep their own terms.)
 *   〔中文參考譯文，僅供閱讀，以英文原文為準〕MIT 授權。版權所有 © 2026 樺修朙（Maxim Klyashtornyy）與 Claude（Anthropic）。
 *   茲免費授予任何取得本軟體及相關文件副本之人不受限制地處置本軟體之權利，包括但不限於使用、複製、修改、合併、出版、散布、
 *   再授權及／或販售本軟體副本，並允許獲提供本軟體之人如此行事，惟須符合下列條件：上述版權聲明與本許可聲明應包含於本軟體
 *   的所有副本或主要部分中。本軟體按「現狀」提供，不附帶任何明示或默示之擔保，包括但不限於適銷性、特定用途適用性及不侵權
 *   之擔保。在任何情況下，作者或版權持有人均不對因本軟體或其使用或其他處置而產生的任何索賠、損害或其他責任負責，不論
 *   基於合約、侵權或其他理由。（本授權僅涵蓋本腳本；所引用的辭典資料及教育部異體字檔案仍各依其自身條款。）
 *
 * CITE AS
 *   樺修朙 and Claude (Anthropic). 2026. Idealized literary (文讀) Hokkien in Pe̍h-ōe-jī, derived from Middle
 *   Chinese: a tshet-uinh deriver. Design rule, choice and supply of sources, and review: 樺修朙.
 *   Data analysis, rule writing, exception list and tests: Claude (Anthropic), run through Claude Code.
 *   〔引用格式〕樺修朙、Claude（Anthropic）。2026。《理想化閩南語文讀（白話字）：由中古漢語推導——tshet-uinh 推導腳本》。
 *   設計原則、材料選擇與提供、審閱：樺修朙。資料分析、規則撰寫、例外表與測試：Claude（Anthropic），透過 Claude Code 執行。
 *
 * SOURCES (what the rule tables and the exception list were built from or checked against)
 *   Format: Author. Year. Title. Place: Publisher. Link. -- what it was used for.
 *   Entries marked [unchecked] give publication details from memory; the rest were checked against a title
 *   page, library record or the project page.
 *   〔來源〕以下列出規則表與例外表所據以建立或檢驗的資料。格式：作者。年份。題名。出版地：出版者。連結。——用途。
 *   標有 [unchecked] 者，出版資訊出自記憶、未經核對；其餘已對照書名頁、圖書館紀錄或專案頁面。
 *
 *   廣韻 data and framework
 *   nk2028. 2021-. tshet-uinh-js (npm: tshet-uinh 0.15.4) and the NK2028 deriver framework.
 *     https://github.com/nk2028/tshet-uinh-js . -- the 3804 小韻 positions every rule is written over.
 *   ——所有規則所依據的 3804 個小韻音韻地位。
 *
 *   Hokkien dictionaries (ChhoeTaigi database, https://github.com/ChhoeTaigi/ChhoeTaigiDatabase)
 *   Campbell, William (甘為霖). 1913. 廈門音新字典 ("甘字典"). Digitized and edited by 林俊育 (Lîm Chùn-io̍k).
 *     -- Amoy readings; its capitalized and 文 entries give literary readings.
 *   ——廈門音讀；其標示的文讀條目提供文讀音。
 *   小川尚義. 1931-32. 臺日大辭典. 臺北: 臺灣總督府 [unchecked]. Taigi translation and editing: 林俊育, as distributed by
 *     ChhoeTaigi ("台日大辭典 台譯版"). -- Taiwanese readings.
 *   ——臺灣音讀。（小川尚義，臺灣總督府，1931–32；臺譯與編輯：林俊育，由 ChhoeTaigi 釋出。）
 *   教育部. 2011-. 臺灣閩南語常用詞辭典. 臺北: 教育部. https://sutian.moe.edu.tw/ . -- Taiwanese readings; its (文) marks
 *     give literary readings.
 *   ——臺灣音讀；其（文）標記提供文讀音。
 *   Wiktionary contributors. Hokkien and Teochew pronunciation sections, single-character entries (Wiktextract JSON
 *     extract of the dump). https://en.wiktionary.org/ ; extractor: https://github.com/tatuylonen/wiktextract .
 *   （維基詞典貢獻者。閩南語與潮州話發音段落，單字條目，取自 Wiktextract JSON 擷取檔。）
 *
 *   Historic Hokkien
 *   謝秀嵐. 1818. 彙集雅俗通十五音. (Zhangzhou rime book) [unchecked]. Digitization used: AlanJui, ho-lok-ue-tools,
 *     https://github.com/AlanJui/ho-lok-ue-tools . -- Zhangzhou literary finals (姜字母 for 陽韻 -iang etc.).
 *   ——漳州文讀韻母（如陽韻 -iang 對應姜字母）。
 *   Douglas, Carstairs. 1873. Chinese-English Dictionary of the Vernacular or Spoken Language of Amoy. London:
 *     Trübner & Co. (checked: HathiTrust https://catalog.hathitrust.org/Record/001774286 ); supplement by Thomas Barclay,
 *     Shanghai: Commercial Press, 1923 (facsimile reprints: 臺北: 南天書局, 1990, ISBN 957-9482-32-2; 臺北: 古亭書屋, 1970). Digitization used: Community-Min-Language-Rime, Hokkien/Dictionary/Amoy.csv,
 *     https://github.com/Language-Preservation-Community/Community-Min-Language-Rime . -- Amoy reading pronunciations ("R.").
 *   ——廈門讀書音（「R.」標記）。
 *   Medhurst, Walter Henry. 1832. A Dictionary of the Hok-këèn Dialect of the Chinese Language, according to the Reading and
 *     Colloquial Idioms. Macao: Honorable East India Company's Press, by G. J. Steyn and Brother. (Catalogues give 1832 on the
 *     title page; the text of one record says 1837, the date MCPDict uses.) https://china-bibliographie.univie.ac.at/2010/04/17/medhurst-dictionary/
 *     Used through the MCPDict table "1837漳浦" (identified by name and date). -- Zhangpu.
 *   ——漳浦音（經 MCPDict「1837漳浦」表取得，以名稱與年代認定）。
 *   Chirino, Pedro. 1604. Dictionarium Sino-Hispanicum. Manila; manuscript, Biblioteca Angelica, Rome, Ms. 60 (see
 *     Klöter's survey of the Manila sources: https://www.benjamins.com/online/hl/articles/hl.00170.doh ). Used through
 *     the MCPDict table "1604馬尼拉漳州", which I identify with this work by its date. -- Zhangzhou speech of Manila.
 *     (Not the later anonymous Dictionario Hispanico Sinicum, c. 1626-46, held at the University of Santo Tomas.)
 *   ——馬尼拉漳州話（經 MCPDict「1604馬尼拉漳州」表取得，僅憑年代認定為此書；並非後來的匿名《Dictionario Hispanico Sinicum》，約 1626–46 年，藏聖托馬斯大學）。
 *   Macgowan, John. 1883. English and Chinese Dictionary of the Amoy Dialect. Amoy: London Missionary Society
 *     [publisher: unchecked; author and year: SOAS record https://library.soas.ac.uk/Record/PCE.FMC.3.03.01 ]. Used
 *     through the MCPDict table "1883厦門（英厦辭典）". -- Amoy.
 *   ——廈門音（經 MCPDict「1883厦門（英厦辭典）」表取得）。
 *   黃謙. 1800. 彙音妙悟. (Quanzhou rime book) [unchecked]. No machine-readable copy was used; read through 洪 1996 below.
 *   （《彙音妙悟》泉州韻書；未使用機讀副本，內容經由下列洪 1996 讀取。）
 *
 *   Modern survey tables
 *   osfans (編). 2016-. 漢字音典 (MCPDict). https://github.com/osfans/MCPDict , tools/tables/output/ . -- 24 modern Hokkien
 *     tables (泉州 晉江 南安 永春 德化 惠安 安溪 金門 石獅; 厦門; 漳州 長泰 華安 南靖 漳浦 雲霄 東山 詔安 平和; 臺北 嘉義 澎湖 高雄;
 *     檳城), with their own 文/白 marks; plus the four Teochew tables (潮州 汕頭 揭陽 潮陽), used as evidence only. A survey
 *     reading counts as literary when its table marks it 文, when it is historic, or when two tables agree.
 *   ——24 個現代閩南語表（泉州、晉江、南安、永春、德化、惠安、安溪、金門、石獅；廈門；漳州、長泰、華安、南靖、漳浦、雲霄、東山、詔安、平和；臺北、嘉義、澎湖、高雄；檳城）及自帶文白標記；另有四個潮州表（潮州、汕頭、揭陽、潮陽），僅作證據。某表的讀音若被該表標為文讀、屬歷史文獻，或有兩個表一致，即算文讀。
 *   mogher.com. https://www.mogher.com/ . -- Teochew readings for 850 characters found nowhere else (low-volume lookups);
 *     one Teochew reading, 萬 buāng, was added by hand.
 *   ——潮州話 850 個其他來源皆無的字的讀音（低頻查詢）；其中潮州話「萬 buāng」為手動補入。
 *
 *   Studies
 *   洪惟仁. 1996. 《彙音妙悟》與古代泉州音. 臺北: 國立中央圖書館臺灣分館 (審議: 何大安, 張光宇). ISBN 957-9067-99-6.
 *     -- the 文/白/正音 analysis of the 妙悟 rimes; page numbers in this file are this book's.
 *   ——《彙音妙悟》各韻的文／白／正音分析；本檔所注頁碼皆指此書頁碼。
 *   杜佳倫 (Tu, Chia-lun). 2011. 閩語歷史層次分析與相關音變探討 (The Diachronic Strata Analysis of Min Phonology).
 *     國立臺灣大學中國文學研究所博士論文 (advisor: 楊秀芳). https://tdr.lib.ntu.edu.tw/handle/123456789/9993 .
 *     -- literary-layer analysis (e.g. 1、2 等 merged as 洪音).
 *   ——文讀層分析（例如一、二等同讀洪音）。
 *   楊秀芳. 1982. 閩南語文白系統的研究. 國立臺灣大學博士論文 [unchecked: later published, 臺北: 臺灣學生書局, 1991].
 *     -- the 文白 system; its Quanzhou chapter is criticized in 洪 1996.
 *   ——文白系統研究；其泉州章節受到洪 1996 批評。（臺北：臺灣學生書局，1991 年出版為專書。）
 *   羅常培. 1930. 廈門音系. 中央研究院歷史語言研究所單刊甲種之二 [unchecked]; 1956 reprint, 北京: 科學出版社, used here
 *     (ch. V, 廣韻 comparison). -- check of the Amoy backbone.
 *   ——用以核對廈門音的骨幹（第五章，廣韻比較）。
 *   鹿港 tone 6 (全濁上): from the design brief (洪惟仁's work on Lukang); not re-derived from a table here.
 *   〔鹿港第六聲〕全濁上的第六聲依設計說明（洪惟仁對鹿港的研究）；本處未另由表重新推導。
 *
 *   Other data
 *   樺修朙 (Maxim Klyashtornyy) (編). 2024. 文言頻率詞典 (frequency dictionary, revision 2024-12-30), from a
 *     frequency count of the Chinese Text Project corpus (https://ctext.org ) by Reddit user LeatherButterfly4098, with help
 *     from justsilvestrein (CEAL Discord). -- classical-Chinese frequency ranks ("top 1000" etc. below); a
 *     character it does not list counts as rare. It replaced 泛亞漢文詞頻詞典 (汐洛思, https://github.com/ShiraTheMogul/fanyahanwen-corpus ),
 *     which ranks later, Buddhist, Japanese and simplified forms high (這 949 there, 8218 here; 了 381 / 3819; 爲 / 为 116 / 416).
 *   ——〔頻率〕樺修朙編《文言頻率詞典》（2024-12-30 版），據 Reddit 用戶 LeatherButterfly4098 對中國哲學書電子化計劃（ctext.org）全庫所作字頻統計
 *     製成，justsilvestrein 協助。用於文言字頻排名（下文「前 1000」等），未收之字視為罕用。取代《泛亞漢文詞頻詞典》，後者把後世、佛典、日本及
 *     簡化字形排得過前（這：949 對 8218；了：381 對 3819）。
 *   教育部. 異體字字典 (variant groups). https://dict.variants.moe.edu.tw/ . File obtained by 樺修朙 from the Ministry of
 *     Education for research; personal-use, not part of any public release. -- variant forms in the exception table
 *     (頭头, 歲岁), with Unicode Unihan simplified / traditional links (https://www.unicode.org/charts/unihan.html ).
 *   （教育部異體字字典，異體字組。檔案由樺修朙為研究目的向教育部取得；僅供個人使用，不屬於任何公開釋出內容。——用於例外表中的異體字，如 頭 头、歲 岁，並附 Unicode Unihan 簡繁連結。）
 *
 * WHAT THE MOSAIC ADDS (distinct syllables, out of 3804 廣韻 小韻)
 *   tone 6 for 全濁上 (Lukang, Quanzhou, Nan'an, Hui'an)                 +106
 *   陽韻 開口 = iang, kept apart from 東三/鍾 iong (Zhangzhou)             +61
 *   日母 = j, kept apart from 來母 l (Zhangzhou, Penang)                    +53
 *   魚韻 = ir, kept apart from 虞韻 u (Quanzhou ɯ, Zhangzhou i)              +47
 *   侯韻 = io, kept apart from 模韻 o͘ (Quanzhou)                            +43
 *   痕韻/殷韻 = irn, apart from 魂/文 un and 真 in (Quanzhou ɯn)             +23
 *   灰韻 = oe outside 端/精/來, apart from 微/脂 ui                          +10
 *   齊韻 幫組 = e, apart from 脂/支 i                                         +8
 *   侵韻 莊組 = om (箴 字母 of both rime books), apart from 侵 im              +8
 *   Total 1759 distinct syllables (1631 without iang / io / irn; 1396 for the original script).
 *   〔鑲嵌帶來的區別〕上表為各項增加的相異音節數（對 3804 個廣韻小韻）；合計 1759（不含 iang / io / irn 為 1631；原腳本為 1396）。
 *
 * HOW IT IS BUILT
 *   Initials (聲母表) and tones (聲調): hand-written tables. Finals (韻母表), first match wins:
 *   鑲嵌 (iang, io, irn) -> 手動 (hand rules that keep a contrast) -> 補充 (hand overrides of the generated table)
 *   -> 自動 (the modal 甘字典 literary final per 韻/呼/等/類, generated by gen_finals.py) -> 後備 (per-韻 fallback).
 *   例外 (option, on by default; off = pure rule output): about 216 characters (244 readings, 56 variant forms) whose rule
 *   output is not a syllable any Hokkien variety has get the nearest syllable one does have (頭 thiô, 米 bí, 歲 sòe, 大 tāi,
 *   不 put, 內 lōe ...). It needs the 字頭; without it the rules decide. Details of every rule are in the comments below.
 *   Rarer characters (outside the 3000 most frequent) get an exception only if the reading is attested outside the 十五音
 *   rime-book lineage (甘字典, 雅俗通, Medhurst, and Wiktionary, which often copies them): in MOE, 台日大辭典, Douglas, Macgowan,
 *   1604 Manila, or a modern survey. Otherwise the 反切 reading stands. Every remaining row was reviewed by hand (2026-10-25):
 *   colloquial words written with a rare character (尪 ang, 䭕 chia̍h), Mandarin-shaped readings (傻 sa) and variants of a
 *   character the rule already handles (猪 = 豬) were dropped.
 *   〔組成〕聲母表與聲調為手寫表。韻母依序比對（先中先用）：鑲嵌（iang、io、irn）→ 手動（保留對立的手寫規則）→ 補充（手寫覆蓋生成表）
 *   → 自動（甘字典每個韻／呼／等／類的最常見文讀韻母，由 gen_finals.py 生成）→ 後備（按韻）。例外（選項，預設開；關閉即純規則輸出）：
 *   約 216 字（244 個讀音、56 個異體字形），規則輸出不是任何閩南語方言真有的音節者，改用最近的真實音節；需提供字頭，否則由規則決定。
 *   前 3000 字以外的罕用字，只有在十五音韻書系統（甘字典、雅俗通、Medhurst，及常沿用它們的維基詞典）以外也有佐證時（教育部、台日大辭典、
 *   Douglas、Macgowan、1604 馬尼拉或現代調查）才列例外，否則採反切讀音。其餘每一列皆經人工審閱（2026-10-25）：刪去以罕用字書寫的白話詞
 *   （尪 ang、䭕 chia̍h）、帶華語色彩的讀音（傻 sa），以及規則已處理之字的異體（猪＝豬）。
 *
 * HOW WELL IT MATCHES
 *   7,683 characters with one 廣韻 reading and data in the dictionaries or the historic / survey sources. A match = the initial
 *   and the final each occur in some Hokkien reading of that character, tone ignored. Second figure also counts Teochew (only
 *   where no Hokkien source contradicts it).
 *                      all            top 1000       top 3000 (by classical-Chinese frequency)
 *   rules only         86.5 / 87.3    98.0 / 98.4    95.0 / 95.6
 *   with exceptions    88.5 / 89.2    100 / 100      98.1 / 98.4     (the exceptions were chosen from the same data: in-sample)
 *   Hold-out (finals table retrained on half the characters, rules only, scored on the other half): 86.1 / 87.0 (all),
 *   96.1 / 96.5 (top 1000), 89.0 / 90.0 (top 3000); the training half scores 85.6 / 86.3. The manual rules were chosen on all data.
 *   Against Amoy 甘字典 finals alone (held out): 91.7% without iang / io / irn, 87.1% with them (they deliberately differ from Amoy).
 *   〔吻合度〕7,683 個廣韻只有一讀、且在辭典或歷史／調查資料中有資料的字；吻合＝聲母與韻母各自出現在該字的某個閩南語讀音中（不計聲調），
 *   第二個數字另算潮州話（僅在無閩南語來源反對時）。例外是依同一批資料選出（樣本內）。留出測試：以一半字重訓韻母表，僅規則，在另一半字上
 *   測得 86.1／87.0（全部）、96.1／96.5（前 1000）、89.0／90.0（前 3000）；訓練半為 85.6／86.3。若只對照廈門甘字典韻母（留出）：
 *   不含 iang / io / irn 為 91.7%，含之為 87.1%（它們刻意異於廈門）。
 *
 * KNOWN LIMITS
 *   - Tone is the Middle Chinese class, so readings that moved to another tone series keep the MC tone: 係 hè (usual hē), 踏 thap
 *     (ta̍p), 站 chàm (chām), 沖 tiông (chhiong), 懈 hài (hāi).
 *   - Left to the rules on purpose: characters whose dictionary reading belongs to a variant or another word at another 音韻地位
 *     (粗 chǒ͘ beside chho͘, 唇, 玆, 庄, 鎗), and rare characters with a single source.
 *   - Still merged, because no listed variety separates them in literary readings or POJ cannot write the difference: 支/脂/之 (i),
 *     歌/豪 (o), 清/青/蒸/庚三 and 登/庚二/耕 (eng/ek), 仙/先 (ian), 覃/談 (am), 知=端 (t), 精=章=莊 (ch), 邪=心 (s), 侯 幫滂並 = 模 (o͘),
 *     真韻 B類 見組 = A類 (in), 止攝 精莊 = 虞 精莊 (u). Quanzhou 彙音妙悟 keeps 登/庚二/耕 apart (irng; 洪 1996: 106, 116, 127), but
 *     almost no one reads it so; an option 登庚 was tried and removed (cost 2 points of agreement).
 *   - Odd cases (齊韻 幫組 e only in 迷 謎 陛; 侯韻 io and 痕/殷 irn irregular in Quanzhou itself) are in the exception table.
 *   〔已知限制〕聲調取中古調類，轉入他調系列的讀音沿用中古調（係 hè、踏 thap、站 chàm、沖 tiông、懈 hài）。刻意交給規則：辭典讀音屬異讀或另一詞
 *   者（粗 chǒ͘、唇、玆、庄、鎗）及僅有單一來源的罕用字。仍合併者：沒有任何參照方言在文讀中區分，或 POJ 無法書寫其差別（支脂之、歌豪、
 *   清青蒸庚三與登庚二耕、仙先、覃談、知端、精章莊、邪心、侯幫滂並＝模、真韻 B／A 類、止攝精莊＝虞精莊）。《彙音妙悟》分開登／庚二／耕
 *   （irng），但幾乎無人如此讀，曾試選項「登庚」後移除（吻合度降 2 點）。個別不規則字（迷謎陛的 e、泉州自身不規則的 io／irn 字）列於例外表。
 *
 * API NOTES (verified against tshet-uinh 0.15.4)
 *   - 音韻地位.判斷(rules, throws): the SECOND argument is `throws`, not a default value; pass an error string so an uncovered
 *     音韻地位 fails loudly. A rule's result must not be an array (it would be read as a nested rule list).
 *   - Entering-tone (入聲) syllables carry the same 韻/等/呼 as their level-tone partners, so one table serves all four tones;
 *     the coda is converted afterwards. Labels must be traditional: 羣母 not 群母, 常母 not 禪母, 全濁/清音/濁音.
 *   - Options are listed when 音韻地位 is missing: ['key|label\ndescription', default]; the value arrives as 選項.key. 字頭 is the character as typed.
 *   〔API 備註〕判斷(rules, throws) 的第二參數是 throws，傳入錯誤字串可使未涵蓋地位明確報錯；規則結果不可為陣列；入聲與其平聲對應者的韻／等／呼相同，
 *   故一張表服務四聲，韻尾事後轉換；標籤須用繁體（羣母、常母、全濁／清音／濁音）；缺少音韻地位時列出選項 ['key|標籤\n說明', 預設值]，值以 選項.key 傳入。
 */

const is = (...x) => 音韻地位.屬於(...x);
const when = (rules, name) => 音韻地位.判斷(rules, `${name}: 未涵蓋 ${音韻地位.描述}`);

if (!音韻地位) return [
  ['例外|套用個別字例外讀音\n勾選：約二百字（如 頭 thiô、米 bí、歲 sòe、內 lōe）改用實際存在的閩南語文讀；不勾選：全由規則推導。', true],
];

// ============================================================================
// 聲母 (initials)
// ============================================================================
// Order matters: the first matching rule wins.
// 〔中〕規則順序有意義：第一條符合者生效。
const 聲母表 = [
  // --- 輕脣 (非敷奉微). In tshet-uinh these are 幫組 + 三等 + C類 (歌韻 C類 is a rare
  // edge case, not 輕脣). 非敷奉 -> h (風 hong, 夫 hu, 非 hui, 分 hun, 方 hong, 法 hoat);
  // 微 stays b (無 bû, 文 bûn, 萬 boān -- every Hokkien source has bān; Teochew buāng keeps it), so 微 vs 非敷奉 remains distinct.
  // 〔中〕輕脣（非敷奉微）在 tshet-uinh 中是 幫組＋三等＋C類（歌韻 C類為罕見特例，不算輕脣）。非敷奉 → h（風 hong、夫 hu、非 hui、分 hun、方 hong、法 hoat）；
  // 〔中〕微 仍讀 b（無 bû、文 bûn、萬 boān——所有閩南語來源皆讀 bān；潮州話 buāng 保留 b），所以微與非敷奉仍有別。
  ['幫組 三等 C類 非 明母 非 歌韻', 'h'],

  // --- 重脣 / 微
  ['幫母', 'p'],
  ['滂母', 'ph'],
  ['並母 宵韻 A類', 'ph'],   // 瓢 phiâu, 飄 phiau, 剽 phiau, 鰾 phiāu: ph- in every source
  // 〔中〕並母宵韻 A類讀 ph-（瓢 phiâu、飄 phiau、剽 phiau、鰾 phiāu），各來源皆然。
  ['並母', 'p'],      // voicing is lost in every variety; the contrast survives in tones 5/6/7/8
  // 〔中〕濁音在各方言皆已消失；對立仍保留在第 5/6/7/8 聲。
  // 豪韻 明母: m- with o͘ (毛 mô͘, 旄 mô͘, 髦 mô͘, 冒 mō͘, 耄 mō͘), the reading most sources have (毛 mo͘ in 22
  // survey tables, 冒 25). 帽 is mostly bō (20 tables) but mō͘ is attested (MOE), so it is left to the rule.
  // Keeps 毛 apart from 模韻 明母 (摹 bô͘) and from 豪韻 other initials. (Final: 豪韻 明母 o͘, in 韻母表_手動.)
  // 〔中〕豪韻明母：m- 配 o͘（毛 mô͘、旄 mô͘、髦 mô͘、冒 mō͘、耄 mō͘），為多數來源的讀法（22 個調查表讀 毛 mo͘，冒 25 個）。帽 多讀 bō（20 個表）但 mō͘ 亦有（教育部），故交給規則。
  // 〔中〕使 毛 與模韻明母（摹 bô͘）及豪韻其他聲母有別。（韻母 豪韻明母 o͘ 見 韻母表_手動。）
  // 明母 蟹攝 一、二等 去聲: m- (賣 māi, 邁 māi, 勱 māi, 妹 mōe, 昧 māi, 瑁 mōe), the literary reading in every source; 平/上 stay b (埋 bâi, 買 bái).
  // 〔中〕明母蟹攝一、二等去聲讀 m-（賣 māi、邁 māi、勱 māi、妹 mōe、昧 māi、瑁 mōe），各來源文讀皆然；平、上聲仍讀 b（埋 bâi、買 bái）。
  ['明母 蟹攝 一等 去聲', 'm'],
  ['明母 蟹攝 二等 去聲', 'm'],
  ['明母 豪韻', 'm'],
  ['明母', 'b'],

  // --- 舌頭, 舌上 (知組 = 端組 in every reference variety), 半舌
  // 〔中〕舌頭、舌上（知組＝端組，各參照方言皆然）、半舌
  ['端母', 't'],
  ['透母', 'th'],
  ['定母', 't'],
  ['知母', 't'],
  ['徹母', 'th'],
  ['澄母', 't'],
  ['泥母', 'l'],
  ['孃母', 'l'],
  ['來母', 'l'],

  // --- 精組 / 莊組 / 章組 (fricatives are listed explicitly so they never fall into ch)
  // 〔中〕精組／莊組／章組（擦音明列，以免落入 ch）
  ['精母 東韻 三等', 'chh'],   // 蹙 chhiok, 蹴 chhiok, 槭 chhiok: the whole 小韻 has chh- in every source
  // 〔中〕精母東韻三等（蹙 小韻）讀 chh-（蹙 chhiok、蹴 chhiok、槭 chhiok），各來源皆然。
  ['精母', 'ch'],
  ['清母', 'chh'],
  ['從母 陽韻 平聲', 'chh'],   // 牆 chhiâng, 墻 檣 薔 嬙 戕: the whole 小韻 has chh- in every source
  // 〔中〕從母陽韻平聲（牆 小韻）讀 chh-（牆 chhiâng、墻 檣 薔 嬙 戕），各來源皆然。
  ['從母', 'ch'],
  ['心母', 's'],
  ['邪母', 's'],
  ['莊母', 'ch'],
  ['初母', 'chh'],
  ['崇母 止攝', 's'],     // 士 sǔ, 事 sū
  // 〔中〕士 sǔ、事 sū
  ['崇母 平聲', 'chh'],   // 柴 chhâi, 鋤 chhô͘
  ['崇母', 'ch'],
  ['生母', 's'],
  ['俟母', 's'],
  ['章母', 'ch'],
  ['昌母', 'chh'],
  ['書母', 's'],
  ['船母', 's'],
  ['常母', 's'],
  ['日母', 'j'],      // Zhangzhou/Penang/Quanzhou-old keep dz; kept distinct from l
  // 〔中〕漳州／檳城／舊泉州保留 dz；與 l 分立。

  // --- 牙喉音
  // 魂韻 見母 平聲: kh- (昆 khun, 崑 khun, 琨 khun, 鯤 khun), as 溪母 坤 khun; 見母 滾 kún stays k (上聲).
  // 〔中〕魂韻見母平聲：kh-（昆 khun、崑 khun、琨 khun、鯤 khun），與溪母 坤 khun 同；見母 滾 kún 為上聲，仍讀 k。
  ['見母 魂韻 平聲', 'kh'],
  // 元韻 入聲 (月韻) 見母: kh- (厥 khoat, 蕨 khoat, 蹶 khoat, 訐 khiat, 羯 khiat, 揭 khiat), as 溪母 闕 khoat.
  // 〔中〕元韻入聲（月韻）見母讀 kh-（厥 khoat、蕨 khoat、蹶 khoat、訐 khiat、羯 khiat、揭 khiat），與溪母 闕 khoat 同。
  ['見母 元韻 入聲', 'kh'],
  ['見母', 'k'],
  ['溪母', 'kh'],
  // 羣母 in 深攝 / 咸攝, 平聲 and 上聲: kh- (琴 khîm, 禽 khîm, 擒 khîm, 鉗 khiâm, 黔 khîm, 儉 khiǎm, 芡 khiǎm); 入聲 stays k (及 ki̍p).
  // 〔中〕羣母在深攝／咸攝的平聲與上聲：kh-（琴 khîm、禽 khîm、擒 khîm、鉗 khiâm、黔 khîm、儉 khiǎm、芡 khiǎm）；入聲仍讀 k（及 ki̍p）。
  ['羣母 深攝 平聲', 'kh'],
  ['羣母 深攝 上聲', 'kh'],
  ['羣母 咸攝 平聲', 'kh'],
  ['羣母 咸攝 上聲', 'kh'],
  ['羣母', 'k'],
  ['疑母', 'g'],      // ng- before o / o͘ is applied after the final is known
  // 〔中〕ng- 在 o / o͘ 前者於韻母確定後再套用。
  ['曉母', 'h'],
  ['匣母', 'h'],
  ['影母', ''],
  ['云母 蒸韻', 'h'],   // 域 he̍k, 棫 蜮 罭 緎 淢: h- in every source (the only 云母 蒸韻 小韻)
  // 〔中〕云母蒸韻（域 小韻）讀 h-（域 he̍k、棫 蜮 罭 緎 淢），各來源皆然。
  ['云母', ''],
  // 以母 虞韻: j- (逾 jû, 踰 jû, 愉 jû, 庾 jú, 裕 jū, 喻 jū, 諭 jū), the reading of every source (Quanzhou / Amoy l-); 以母 elsewhere has no initial.
  // 〔中〕以母虞韻讀 j-（逾 jû、踰 jû、愉 jû、庾 jú、裕 jū、喻 jū、諭 jū），各來源皆然（泉州／廈門讀 l-）；其餘以母零聲母。
  ['以母 虞韻', 'j'],
  ['以母 祭韻 合口', 'j'],   // 銳 jōe, 睿 jōe, 叡 jōe: j- in every source (Quanzhou / Amoy l-)
  // 〔中〕以母祭韻合口讀 j-（銳 jōe、睿 jōe、叡 jōe），各來源皆然（泉州／廈門讀 l-）。
  ['以母', ''],
];

// ============================================================================
// 韻母 (finals) — values are level-tone finals; first matching rule wins.
// 〔中〕韻母——值為平聲形式的韻母；第一條符合者生效。
// ============================================================================
// ---- 手動規則：輕脣、魚韻、灰韻等（優先於自動部分）----
// Each line records the contrast it keeps and which reference variety supplies it.
// 〔中〕每行記錄其所保留的對立，以及由哪個參照方言提供。
const 韻母表_手動 = [
  // 流攝 幫組 三等 C類: 輕脣 尤韻 (不 浮 婦 富 負 阜) -> u, like 輕脣 虞 (夫 hu), not iu. 明母 (謀 牟 侔 眸) is caught earlier
  // by the 尤韻 明母 io rule (謀 biô, Quanzhou; most other sources have bô͘, in 12 survey tables bo͘, 7 bio). 矛 is mâu / bâu in most sources.
  // 〔中〕流攝幫組三等 C類：輕脣尤韻（不 浮 婦 富 負 阜）→ u，同輕脣虞韻（夫 hu），不讀 iu。明母（謀 牟 侔 眸）已由前面的尤韻明母 io 規則處理
  // 〔中〕（謀 biô，泉州；多數其他來源為 bô͘，12 個調查表 bo͘、7 個 bio）。矛 在多數來源讀 mâu / bâu。
  ['流攝 幫組 三等 C類', 'u'],
  // 微韻: 輕脣 (非敷奉) -> ui (非 hui, 肥 hûi); 微母 (明) -> i (微 bî, 未 bī, 尾 bí).
  // 〔中〕微韻：輕脣（非敷奉）→ ui（非 hui、肥 hûi）；微母（明）→ i（微 bî、未 bī、尾 bí）。
  ['微韻 明母', 'i'],
  // 魚韻: 莊組 -> o͘ (初 chho͘, 疏 so͘, 阻 chó͘); everything else -> ir (Quanzhou ɯ;
  // Zhangzhou i, also distinct from 虞 u), which keeps 魚 (居 kir, 書 sir, 語 gír) apart from 虞 (拘 ku, 朱 chu, 儒 jû).
  // 〔中〕魚韻：莊組 → o͘（初 chho͘、疏 so͘、阻 chó͘）；其餘 → ir（泉州 ɯ；漳州 i，亦與虞 u 有別），使魚（居 kir、書 sir、語 gír）與虞（拘 ku、朱 chu、儒 jû）分立。
  ['魚韻 莊組', 'o͘'],
  ['魚韻', 'ir'],
  // 灰韻: oe (Zhangzhou/Quanzhou ue~oe; 灰 hoe, 回 hôe, 杯 poe). Keeps 灰 apart from 微 and 脂/支 合口
  // (ui) in the labial, velar and glottal series. 端組 / 精組 / 來母 read ui in every source, old and new
  // (對 tùi, 推 thui, 隊 tūi, 堆 tui, 腿 thúi, 崔 chhui, 催 chhui, 雷 lûi: Douglas 1873 R., 雅俗通 1818,
  // Medhurst 1832, all surveys); 內 lōe, 退 thòe, 罪 chǒe are the few oe words there.
  // 〔中〕灰韻：oe（漳州／泉州 ue~oe；灰 hoe、回 hôe、杯 poe），使灰與微及脂／支合口（ui）在唇、牙、喉各系列分立。端組／精組／來母在新舊所有來源皆讀 ui
  // 〔中〕（對 tùi、推 thui、隊 tūi、堆 tui、腿 thúi、崔 chhui、催 chhui、雷 lûi：Douglas 1873 R.、雅俗通 1818、Medhurst 1832、各調查表）；內 lōe、退 thòe、罪 chǒe 是其中少數讀 oe 者。
  ['灰韻 定母 平聲', 'oe'],   // 頹 tôe, 隤 魋 墤 蘈: the 頹 小韻 is oe everywhere, unlike 定母 去聲 隊 tūi
  // 〔中〕灰韻定母平聲（頹 小韻）讀 oe（頹 tôe、隤 魋 墤 蘈），與定母去聲 隊 tūi 不同。
  ['灰韻 來母', 'ui'],
  ['灰韻 端組', 'ui'],
  ['灰韻 精組', 'ui'],
  ['灰韻', 'oe'],
  // 豪韻 明母: o͘ (毛 mô͘, 冒 mō͘), see the initial table.
  // 〔中〕豪韻明母：o͘（毛 mô͘、冒 mō͘），見聲母表。
  ['豪韻 明母', 'o͘'],
  // (陽韻 開口 iang, 侯韻 io, 痕韻/殷韻 irn are fixed rules in 韻母表_鑲嵌, checked first.)
  // 〔中〕（陽韻開口 iang、侯韻 io、痕韻／殷韻 irn 為固定規則：見 韻母表_鑲嵌，最先比對。）
  // 侵韻 莊組 (舒聲): om, the 箴 字母 of the rime books (Zhangzhou ɔm, Quanzhou əm, still tsirm / sirm for
  // Lukang teachers per 洪惟仁 1996: 127: 森 som, 參 som, 簪 chom,
  // 譖 chòm), like the other 莊系 finals that read as 1 等 (魚 o͘, 尤 io, 陽 ong, 江 ong). 入聲 stays ip.
  // 〔中〕侵韻莊組（舒聲）：om，即韻書的箴字母（漳州 ɔm、泉州 əm；洪惟仁 1996: 127 記鹿港教師仍讀 tsirm / sirm：森 som、參 som、簪 chom、譖 chòm），
  // 〔中〕如同其他莊系讀如一等的韻母（魚 o͘、尤 io、陽 ong、江 ong）；入聲仍為 ip。
  ['侵韻 莊組 舒聲', 'om'],
  // 江韻 莊組: ong (窗 chhong, 雙 song, 朔 sok, 數 sok), like 江韻 知組 and 陽韻 莊組.
  // 〔中〕江韻莊組：ong（窗 chhong、雙 song、朔 sok、數 sok），同江韻知組及陽韻莊組。
  ['江韻 莊組', 'ong'],
  // 江韻 幫組 入聲 (覺韻): ok (剝 pok, 駁 pok, 璞 phok, 樸 phok, 雹 pho̍k), the literary reading; 舒聲 stays ang (邦 pang).
  // 〔中〕江韻幫組入聲（覺韻）：ok（剝 pok、駁 pok、璞 phok、樸 phok、雹 pho̍k），為文讀；舒聲仍為 ang（邦 pang）。
  ['江韻 幫組 入聲', '!ok'],
  // 登韻 幫滂並 入聲 (德韻): ok (北 pok, 匐 po̍k, 蔔 po̍k, 菔 po̍k, 僰 po̍k), the literary reading; 明母 stays ek (墨 be̍k, 默 be̍k).
  // 〔中〕登韻幫滂並入聲（德韻）：ok（北 pok、匐 po̍k、蔔 po̍k、菔 po̍k、僰 po̍k），為文讀；明母仍為 ek（墨 be̍k、默 be̍k）。
  ['登韻 幫母 入聲', '!ok'],
  ['登韻 滂母 入聲', '!ok'],
  ['登韻 並母 入聲', '!ok'],
  // 咸韻 開口 二等 影組 入聲: iap (洽 hia̍p, 狹 hia̍p, 峽 hia̍p, 祫 hia̍p in 甘字典 and Zhangzhou), as 見組 (夾 kiap).
  // 〔中〕咸韻開口二等影組入聲：iap（洽 hia̍p、狹 hia̍p、峽 hia̍p、祫 hia̍p，見於甘字典與漳州），同見組（夾 kiap）。
  ['咸韻 開口 二等 影組 入聲', '!iap'],
  // 耕韻 合口 / 登韻 合口, 影組 入聲: ek (獲 he̍k, 或 he̍k, 惑 he̍k; Quanzhou hia̍k, its usual ek); 見組 stays ok (國 kok).
  // 〔中〕耕韻合口／登韻合口，影組入聲：ek（獲 he̍k、或 he̍k、惑 he̍k；泉州 hia̍k，其通常為 ek）；見組仍為 ok（國 kok）。
  ['耕韻 合口 影組 入聲', '!ek'],
  ['登韻 合口 影組 入聲', '!ek'],
  // 齊韻 幫組: e (Zhangzhou/Quanzhou: 迷 bê, 謎 bē, 陛 pě), not Amoy i, so it stays apart
  // from 脂/支 幫組 (比 pí, 卑 pi). Only a few words really have e: 米 bí, 閉 pì, 嬖 pì are i
  // everywhere and are fixed in the exception table.
  // 〔中〕齊韻幫組：e（漳州／泉州：迷 bê、謎 bē、陛 pě），而非廈門 i，使其與脂／支幫組（比 pí、卑 pi）分立。真正讀 e 的只有少數詞：米 bí、閉 pì、嬖 pì 到處都是 i，已在例外表修正。
  ['齊韻 幫組', 'e'],
  // 麻韻 四等 (only 爹 端開四麻平): tia in every source; the per-韻 fallback 'a' gave ta.
  // 〔中〕麻韻四等（僅 爹 端開四麻平）：各來源皆 tia；按韻的後備 'a' 會得 ta。
  ['麻韻 四等', 'ia'],
  // 夬韻 合口: oai (快 khoài, 夬 koài), not oe.
  // 〔中〕夬韻合口：oai（快 khoài、夬 koài），而非 oe。
  ['夬韻 合口', 'oai'],
  // 真韻 日母: in (人 jîn, 仁 jîn, 忍 jím -> jín, 日 ji̍t), not im.
  // 〔中〕真韻日母：in（人 jîn、仁 jîn、忍 jím → jín、日 ji̍t），而非 im。
  ['真韻 開口 三等 日母', 'in'],
  ['真韻 開口 三等 A類 見組', 'in'],   // 緊 kín
];

// ---- Hand-written finals that override the generated table below (韻母表_自動) ----
// Each row follows the literary layer as Taiwanese uses it, where the 甘字典 majority was weak or came from one-character noise.
// 〔中〕手寫韻母：覆蓋下方自動生成表（韻母表_自動）。每行依臺灣實際使用的文讀層，用於甘字典多數票偏弱或僅來自單字雜訊之處。
const 韻母表_補充 = [
  ['祭韻 開口 三等 B類', 'e'],   // 憩 khè, 罽 kè: same as 祭韻 A類 e, apart from 支/脂 i
  ['山韻 合口 二等', 'oan'],     // 幻 hoān, 鰥 koan; 山攝合口一、二等文讀同讀 (= 刪韻合口 oan); the generated 'un' (67%) came from 猾 滑 ku̍t
  ['登韻 合口 一等', 'ong'],     // 弘 hông, 肱 kong, 國 kok (入聲 follows: ong -> ok)
  ['麻韻 三等 A類', 'ia'],       // only 乜 (biá in Wiktionary); the generated 'ian' was a one-character artifact
];
// ---- Generated part: modal Amoy literary final per 韻/呼/等/類 (and 組 where it splits), from the 甘字典 data ----
// Produced by gen_finals.py + gen_js.py (all characters); not edited by hand -- hand overrides are in 韻母表_補充.
// Format: [condition, final]. A final is the level-tone form; "!" marks a literal checked final. Trailing n = characters, % = share agreeing.
// Rows that the rules above would always shadow (魚韻, 灰韻, 夬韻 合口, 齊韻 幫組, 真韻 日母 / A類 見組, the three mosaic finals) are left out.
// 〔中〕由 gen_finals.py + gen_js.py 依甘字典全部字生成，不手改；手寫覆蓋見 韻母表_補充。格式：[條件, 韻母]；韻母為平聲形式，「!」表示已核對的實際韻母；n＝字數，％＝吻合比例。
// 〔中〕被上方規則必然遮蔽的列（魚韻、灰韻、夬韻合口、齊韻幫組、真韻日母／A類見組、三個鑲嵌韻母）不收錄。
const 韻母表_自動 = [
  ['之韻 開口 三等 精組', 'u'], // n=35 76%
  ['之韻 開口 三等 莊組', 'u'], // n=18 67%
  ['仙韻 合口 三等 以母', 'ian'], // n=13 75%
  ['先韻 合口 四等 見組', 'oan'], // n=19 75%
  ['咸韻 開口 二等 見組', 'iam'], // n=12 62%  (減 kiám, 鹼 kiám, 夾 kiap, 緘 kiam; 銜韻 監 kam is separate)
  ['支韻 開口 三等 精組', 'u'], // n=22 78%
  ['東韻 三等 C類 見組', 'iong'], // n=16 100%
  ['東韻 三等 C類 影組', 'iong'], // n=7 90%
  ['祭韻 合口 三等 精組', 'ui'], // n=5 80%
  ['脂韻 合口 三等 以母', 'i'], // n=4 60%
  ['脂韻 開口 三等 莊組', 'u'], // n=4 80%
  ['脂韻 開口 三等 精組', 'u'], // n=24 92%
  ['鍾韻 三等 C類 幫組', 'ong'], // n=17 91%
  ['陽韻 開口 三等 莊組', 'ong'], // n=15 89%
  ['江韻 二等 知組', 'ong'], // n=13 81%
  ['臻韻 開口 三等 入聲', '!ek'], // n=4 75%
  ['之韻 開口 三等 C類', 'i'], // 98%
  ['仙韻 合口 三等 A類', 'oan'], // 91%
  ['仙韻 合口 三等 B類', 'oan'], // 100%
  ['仙韻 開口 三等 A類', 'ian'], // 100%
  ['仙韻 開口 三等 B類', 'ian'], // 81%
  ['侵韻 開口 三等 A類', 'im'], // 100%
  ['侵韻 開口 三等 B類', 'im'], // 95%
  ['元韻 合口 三等 C類', 'oan'], // 94%
  ['元韻 開口 三等 C類', 'ian'], // 93%
  ['嚴韻 開口 三等 C類', 'iam'], // 89%
  ['宵韻 開口 三等 A類', 'iau'], // 100%
  ['宵韻 開口 三等 B類', 'iau'], // 81%
  ['幽韻 開口 三等 A類', 'iu'], // 100%
  ['庚韻 合口 三等 B類', 'eng'], // 100%
  ['庚韻 開口 三等 B類', 'eng'], // 88%
  ['廢韻 合口 三等 C類', 'oe'], // 60%
  ['廢韻 開口 三等 C類', 'ai'], // 75%
  ['微韻 合口 三等 C類', 'ui'], // 96%
  ['微韻 開口 三等 C類', 'i'], // 81%
  ['支韻 合口 三等 A類', 'ui'], // 83%
  ['支韻 合口 三等 B類', 'ui'], // 92%
  ['支韻 開口 三等 A類', 'i'], // 100%
  ['支韻 開口 三等 B類', 'i'], // 94%
  ['文韻 合口 三等 C類', 'un'], // 98%
  ['歌韻 合口 三等 C類', 'ia'], // 50%
  ['歌韻 開口 三等 C類', 'a'], // 33%
  ['清韻 合口 三等 A類', 'eng'], // 100%
  ['清韻 開口 三等 A類', 'eng'], // 92%
  ['真韻 合口 三等 A類', 'un'], // 57%
  ['真韻 合口 三等 B類', 'un'], // 94%
  ['真韻 開口 三等 A類', 'in'], // 62%
  ['真韻 開口 三等 B類', 'in'], // 50%
  ['祭韻 合口 三等 B類', 'oe'], // 100%
  ['祭韻 開口 三等 A類', 'e'], // 86%
  // 〔中〕祭韻 B類：憩 khè、罽 kè，同祭韻 A類 e，與支／脂 i 有別。
  ['脂韻 合口 三等 A類', 'ui'], // 100%
  ['脂韻 合口 三等 B類', 'ui'], // 93%
  ['脂韻 開口 三等 A類', 'i'], // 89%
  ['脂韻 開口 三等 B類', 'i'], // 73%
  ['蒸韻 合口 三等 B類', 'eng'], // 80%
  ['蒸韻 開口 三等 B類', 'eng'], // 100%
  ['蒸韻 開口 三等 C類', 'eng'], // 85%
  ['虞韻 合口 三等 C類', 'u'], // 91%
  ['陽韻 合口 三等 C類', 'ong'], // 94%
  ['鹽韻 開口 三等 A類', 'iam'], // 100%
  ['鹽韻 開口 三等 B類', 'iam'], // 91%
  ['之韻 開口 三等', 'i'], // 64%
  ['仙韻 三等 A類', 'ian'], // 91%
  ['仙韻 三等 B類', 'ian'], // 86%
  ['仙韻 合口 三等', 'oan'], // 73%
  ['仙韻 開口 三等', 'ian'], // 91%
  ['佳韻 合口 二等', 'oa'], // 78%
  ['佳韻 開口 二等', 'ai'], // 61%
  ['侵韻 三等 B類', 'in'], // 67%
  ['侵韻 開口 三等', 'im'], // 88%
  ['元韻 三等 C類', 'oan'], // 86%
  ['先韻 合口 四等', 'ian'], // 57%
  ['先韻 開口 四等', 'ian'], // 83%
  ['凡韻 三等 C類', 'oan'], // 100%
  ['刪韻 合口 二等', 'oan'], // 94%
  ['刪韻 開口 二等', 'an'], // 83%
  ['咍韻 開口 一等', 'ai'], // 95%
  ['咸韻 開口 二等', 'am'], // 47%
  ['唐韻 合口 一等', 'ong'], // 94%
  ['唐韻 開口 一等', 'ong'], // 89%
  ['夬韻 開口 二等', 'ai'], // 75%
  ['宵韻 三等 A類', 'iau'], // 100%
  ['宵韻 三等 B類', 'iau'], // 100%
  ['宵韻 開口 三等', 'iau'], // 94%
  ['寒韻 合口 一等', 'oan'], // 93%
  ['寒韻 開口 一等', 'an'], // 86%
  ['尤韻 三等 C類', 'iu'], // 71%
  // 〔中〕山韻合口二等：幻 hoān、鰥 koan；山攝合口一、二等文讀同讀（＝刪韻合口 oan）。'un'（67%）來自 猾 滑 ku̍t 等字。
  ['山韻 開口 二等', 'an'], // 63%
  ['幽韻 三等 B類', 'iu'], // 100%
  ['庚韻 三等 B類', 'eng'], // 96%
  ['庚韻 合口 二等', 'ong'], // 58%
  ['庚韻 開口 三等', 'eng'], // 100%
  ['庚韻 開口 二等', 'eng'], // 81%
  ['廢韻 三等 C類', 'oe'], // 40%
  ['微韻 三等 C類', 'ui'], // 76%
  ['支韻 三等 A類', 'i'], // 90%
  ['支韻 三等 B類', 'i'], // 94%
  ['支韻 合口 三等', 'ui'], // 83%
  ['支韻 開口 三等', 'i'], // 66%
  ['文韻 三等 C類', 'un'], // 97%
  ['東韻 三等 C類', 'ong'], // 48%
  ['歌韻 合口 一等', 'o'], // 87%
  ['歌韻 開口 一等', 'o'], // 73%
  ['泰韻 合口 一等', 'oe'], // 79%
  ['泰韻 開口 一等', 'ai'], // 87%
  ['添韻 開口 四等', 'iam'], // 93%
  ['清韻 三等 A類', 'eng'], // 78%
  ['清韻 合口 三等', 'eng'], // 88%
  ['清韻 開口 三等', 'eng'], // 94%
  // 〔中〕登韻合口一等：弘 hông、肱 kong、國 kok（入聲隨之：ong → ok）。
  ['登韻 開口 一等', 'eng'], // 97%
  ['皆韻 合口 二等', 'oai'], // 76%
  ['皆韻 開口 二等', 'ai'], // 82%
  ['真韻 三等 A類', 'in'], // 89%
  ['真韻 三等 B類', 'in'], // 81%
  ['真韻 合口 三等', 'un'], // 93%
  ['真韻 開口 三等', 'in'], // 60%
  ['祭韻 三等 A類', 'e'], // 86%
  ['祭韻 合口 三等', 'oe'], // 53%
  ['祭韻 開口 三等', 'e'], // 87%
  ['耕韻 合口 二等', 'ong'], // 62%
  ['耕韻 開口 二等', 'eng'], // 92%
  ['肴韻 開口 二等', 'au'], // 78%
  ['脂韻 三等 A類', 'i'], // 87%
  ['脂韻 三等 B類', 'i'], // 85%
  ['脂韻 合口 三等', 'ui'], // 83%
  ['脂韻 開口 三等', 'i'], // 59%
  ['脂韻 開口 四等', 'e'], // 100%
  ['臻韻 開口 三等', 'in'], // 67%
  ['蒸韻 三等 B類', 'eng'], // 85%
  ['蒸韻 開口 三等', 'eng'], // 84%
  ['蕭韻 開口 四等', 'iau'], // 96%
  ['虞韻 三等 C類', 'u'], // 94%
  ['虞韻 合口 三等', 'u'], // 89%
  ['覃韻 開口 一等', 'am'], // 86%
  ['談韻 開口 一等', 'am'], // 89%
  ['豪韻 開口 一等', 'o'], // 84%
  ['銜韻 開口 二等', 'am'], // 74%
  ['鍾韻 三等 C類', 'iong'], // 64%
  ['陽韻 三等 C類', 'ong'], // 93%
  ['青韻 合口 四等', 'eng'], // 100%
  ['青韻 開口 四等', 'eng'], // 88%
  ['魂韻 合口 一等', 'un'], // 91%
  ['鹽韻 三等 B類', 'ian'], // 100%
  ['鹽韻 開口 三等', 'iam'], // 86%
  // 〔中〕麻韻三等 A類：僅 乜（維基詞典 biá）；'ian' 是單字造成的假象。
  ['麻韻 合口 二等', 'oa'], // 85%
  ['麻韻 開口 三等', 'ia'], // 83%
  ['麻韻 開口 二等', 'a'], // 88%
  ['齊韻 合口 四等', 'ui'], // 56%
  ['齊韻 開口 四等', 'e'], // 76%
  ['佳韻 二等', 'ai'], // 100%
  ['侯韻 一等', 'o͘'], // 87%
  ['先韻 四等', 'ian'], // 100%
  ['冬韻 一等', 'ong'], // 85%
  ['刪韻 二等', 'an'], // 85%
  ['唐韻 一等', 'ong'], // 80%
  ['夬韻 二等', 'ai'], // 75%
  ['寒韻 一等', 'oan'], // 80%
  ['尤韻 三等', 'iu'], // 89%
  ['山韻 二等', 'an'], // 78%
  ['庚韻 二等', 'eng'], // 81%
  ['東韻 一等', 'ong'], // 88%
  ['東韻 三等', 'iong'], // 84%
  ['模韻 一等', 'o͘'], // 91%
  ['歌韻 一等', 'o'], // 55%
  ['江韻 二等', 'ang'], // 42%
  ['泰韻 一等', 'ai'], // 60%
  ['登韻 一等', 'eng'], // 69%
  ['皆韻 二等', 'ai'], // 82%
  ['耕韻 二等', 'eng'], // 85%
  ['肴韻 二等', 'au'], // 95%
  ['談韻 一等', 'am'], // 100%
  ['豪韻 一等', 'o'], // 53%
  ['銜韻 二等', 'an'], // 100%
  ['鍾韻 三等', 'iong'], // 87%
  ['青韻 四等', 'eng'], // 91%
  ['魂韻 一等', 'un'], // 89%
  ['麻韻 二等', 'a'], // 84%
];
// ---- 後備：以上規則未涵蓋的罕見地位，按韻取最常見者 ----
const 韻母表_後備 = [
  ['歌韻 三等', 'ia'],
  ['之韻', 'i'],
  ['仙韻', 'ian'],
  ['佳韻', 'ai'],
  ['侯韻', 'o͘'],
  ['侵韻', 'im'],
  ['元韻', 'oan'],
  ['先韻', 'ian'],
  ['冬韻', 'ong'],
  ['凡韻', 'oan'],
  ['刪韻', 'an'],
  ['咍韻', 'ai'],
  ['咸韻', 'am'],
  ['唐韻', 'ong'],
  ['嚴韻', 'iam'],
  ['夬韻', 'ai'],
  ['宵韻', 'iau'],
  ['寒韻', 'oan'],
  ['尤韻', 'iu'],
  ['山韻', 'an'],
  ['幽韻', 'iu'],
  ['庚韻', 'eng'],
  ['廢韻', 'oe'],
  ['微韻', 'ui'],
  ['支韻', 'i'],
  ['文韻', 'un'],
  ['東韻', 'ong'],
  ['模韻', 'o͘'],
  ['歌韻', 'o'],
  ['殷韻', 'in'],
  ['江韻', 'ang'],
  ['泰韻', 'ai'],
  ['添韻', 'iam'],
  ['清韻', 'eng'],
  ['灰韻', 'oe'],
  ['痕韻', 'un'],
  ['登韻', 'eng'],
  ['皆韻', 'ai'],
  ['真韻', 'in'],
  ['祭韻', 'e'],
  ['耕韻', 'eng'],
  ['肴韻', 'au'],
  ['脂韻', 'i'],
  ['臻韻', 'in'],
  ['蒸韻', 'eng'],
  ['蕭韻', 'iau'],
  ['虞韻', 'u'],
  ['覃韻', 'am'],
  ['談韻', 'am'],
  ['豪韻', 'o'],
  ['銜韻', 'am'],
  ['鍾韻', 'iong'],
  ['陽韻', 'iong'],
  ['青韻', 'eng'],
  ['魂韻', 'un'],
  ['魚韻', 'ir'],
  ['鹽韻', 'iam'],
  ['麻韻', 'a'],
  ['齊韻', 'e'],
];

// 山韻開口二等見組 reads -an (間 kan, 眼 gán, 簡 kán), not -ian: the literary layer merges 1、2 等 as 洪音, as in Taiwanese;
// a Zhangzhou -ian option was tried and removed, because only a few words (慳 khian, 頡 kiat) have it there.
// 〔中〕山韻開口二等見組讀 -an（間 kan、眼 gán、簡 kán），不讀 -ian：文讀層將一、二等合為洪音，同臺灣；曾試過漳州 -ian 選項後移除，因為漳州也只有少數詞（慳 khian、頡 kiat）如此。
// Mosaic finals, always on. Each keeps a contrast that one reference variety keeps in its literary
// layer (Tu 2011 analyses all three as 文讀層); the plain Amoy / Taiwanese readings (iong, o͘, un / in) are not offered.
// 〔中〕鑲嵌韻母，一律啟用。每個選項保留某一參照方言在其文讀層所保留的對立（杜 2011 皆視為文讀層）；不提供廈門／臺灣的單純讀法（iong、o͘、un / in）。
const 韻母表_鑲嵌 = [
  // 陽韻 開口 (not 莊組): iang / iak, the Zhangzhou literary reading (彙集雅俗通十五音 1818 姜 字母, Medhurst
  // 1832, 1604 Manila, 漳州 漳浦 東山 華安 南靖 長泰 雲霄 平和; Tu 2011: 漳州腔 文讀 -iaŋ/-iak, 泉州腔 -iɔŋ/-iɔk).
  // Keeps 陽 (香 hiang, 相 siang, 良 liâng, 藥 ia̍k) apart from 東三/鍾 (中 tiong, 恭 kiong, 龍 liông, 欲 io̍k),
  // which every variety reads iong. 莊組 stays ong (莊 chong, 霜 song).
  // 〔中〕陽韻開口（莊組除外）：iang / iak，漳州文讀（彙集雅俗通十五音 1818 姜字母、Medhurst 1832、1604 馬尼拉、漳州 漳浦 東山 華安 南靖 長泰 雲霄 平和；杜 2011：漳州腔文讀 -iaŋ/-iak，泉州腔 -iɔŋ/-iɔk）。
  // 〔中〕使陽（香 hiang、相 siang、良 liâng、藥 ia̍k）與東三／鍾（中 tiong、恭 kiong、龍 liông、欲 io̍k；各方言皆讀 iong）分立。莊組仍為 ong（莊 chong、霜 song）。
  ['陽韻 開口 三等 非 莊組', 'iang'],
  // 侯韻 (not 幫組, except 明母) and 尤韻 莊組 / 明母: io, the Quanzhou literary reading (頭 thiô, 口 khió, 樓 liô, 豆 tiō, 走 chió;
  // 泉州 晉江 南安 惠安; Tu 2011: 泉州腔 侯韻 文讀 -io, 尤韻 莊系 reads like 1 等). Keeps 侯 apart from 模 (o͘),
  // which Amoy, Taiwanese and Zhangzhou merge. 明母 too (母 bió, 茂 biō, 謀 biô: 泉州 晉江 南安 惠安; 彙音妙悟 puts
  // 母 某 謀 牟 in the 鉤 rime with 侯); 某 畝 牡 戊 are bó͘ everywhere (exceptions). 幫滂並 stay o͘ (部 pǒ͘).
  // 〔中〕侯韻（幫組除外，明母例外）及尤韻莊組／明母：io，泉州文讀（頭 thiô、口 khió、樓 liô、豆 tiō、走 chió；泉州 晉江 南安 惠安；杜 2011：泉州腔侯韻文讀 -io，尤韻莊系讀如一等）。
  // 〔中〕使侯與模（o͘；廈門、臺灣、漳州皆合併）分立。明母亦然（母 bió、茂 biō、謀 biô：泉州 晉江 南安 惠安；彙音妙悟將 母 某 謀 牟 與侯同歸鉤韻）；某 畝 牡 戊 各處皆 bó͘（例外）。幫滂並仍為 o͘（部 pǒ͘）。
  // 心母 / 生母 (叟 só͘, 嗽 sò͘, 搜 so͘, 瘦 sò͘, 藪 só͘, 蒐 so͘): o͘ even in Quanzhou, so no io. 精 / 初 / 崇 (奏 chiò, 鄒 chio) keep it.
  // 〔中〕心母／生母（叟 só͘、嗽 sò͘、搜 so͘、瘦 sò͘、藪 só͘、蒐 so͘）：泉州亦讀 o͘，故不用 io；精／初／崇（奏 chiò、鄒 chio）保留 io。
  ['侯韻 心母', 'o͘'], ['尤韻 生母', 'o͘'], ['侯韻 非 幫組', 'io'], ['侯韻 明母', 'io'], ['尤韻 三等 莊組', 'io'], ['尤韻 明母', 'io'],
  // 痕韻 / 殷韻: irn / irt, the Quanzhou reading ɯn ~ ən (根 kirn, 恩 irn, 斤 kirn, 勤 khîrn, 近 kǐrn; 南安
  // 惠安 永春 德化; Wiktionary POJ kirn, irn). Amoy reads them un (= 魂/文), Zhangzhou in (= 真); irn keeps both
  // contrasts, as ir does for 魚韻.
  // 〔中〕痕韻／殷韻：irn / irt，泉州讀法 ɯn ~ ən（根 kirn、恩 irn、斤 kirn、勤 khîrn、近 kǐrn；南安 惠安 永春 德化；維基詞典 POJ kirn、irn）。
  // 〔中〕廈門讀 un（＝魂／文），漳州讀 in（＝真）；irn 保留與兩者的對立，如同 ir 之於魚韻。
  ['痕韻', 'irn'], ['殷韻', 'irn'],
];
const 韻母表 = [...韻母表_鑲嵌, ...韻母表_手動, ...韻母表_補充, ...韻母表_自動, ...韻母表_後備];

// ============================================================================
// 例外 (individual characters)
// ============================================================================
// Rows: [字頭 + 異體字, 音韻地位 (space-separated), 音節]. The syllable has no tone: the tone of the
// 音韻地位 is applied afterwards, so only initial and final are replaced. First character = the
// 廣韻 headword; the rest are variant forms (異體字) that inherit the reading.
// A character is listed when the rule output is not a syllable that any Hokkien variety really has
// (Teochew counts as evidence: an output that Teochew has is left alone). The replacement is the
// attested syllable nearest to the rule output (fewest of initial / final changed), a
// dictionary-marked literary (文讀) reading first, then the best-supported one.
// Switch off with the 例外 option to get pure rule output.
// 〔中〕每列：[字頭＋異體字, 音韻地位（空格分隔）, 音節]。音節不含聲調：聲調事後依音韻地位套用，故只替換聲母與韻母。
// 〔中〕第一字為廣韻字頭，其餘為繼承其讀音的異體字。凡規則輸出不是任何閩南語方言真有的音節者才列入（潮州話可作證據：潮州話有的輸出不動）。
// 〔中〕替換音節取最接近規則輸出者（聲母／韻母改動最少），先取辭典標示的文讀，再取證據最強者。
// 〔中〕以「例外」選項關閉即得純規則輸出。
const 例外 = [
  // ---- 1–1000 (frequency rank in classical Chinese)
  ["不", "幫三C文入", "put"],  // hut → put
  ["大", "定開一歌去", "tai"],  // tō → tai
  ["乃", "泥開一咍上", "nai"],  // lái → nai
  ["萬", "明三C元去", "ban"],  // boān → ban
  ["數数", "生合三虞上 生合三虞去", "so͘"],  // sú/sù → so͘
  ["復複", "並三C尤去", "hiu"],  // hū → hiu
  ["馬马", "明二麻上", "ma"],  // bá → ma
  ["內", "泥合一灰去", "loe"],  // lūi → loe
  ["罪", "從合一灰上", "choe"],  // chǔi → choe
  ["歲岁", "心合三祭去", "soe"],  // sùi → soe
  ["退", "透合一灰去", "thoe"],  // thùi → thoe
  ["鳥鸟", "端開四蕭上", "niau"],  // tiáu → niau
  ["罷罢", "並二佳上", "pa"],  // pǎi → pa
  ["著", "澄開三陽入", "tiok"],  // tia̍k → tiok
  ["頭头", "定一侯平", "thio"],  // tiô → thio
  ["隱", "影開三C殷上 影開三C殷去", "un"],  // írn/ìrn → un
  ["質质", "知開三脂去", "chi"],  // tì → chi
  ["彭", "並二庚平", "pheng"],  // pêng → pheng
  ["轉转", "知合三仙上 知合三仙去", "choan"],  // toán/toàn → choan
  ["謹", "見開三C殷上", "kin"],  // kírn → kin
  ["崇", "崇三東平", "chiong"],  // chhiông → chiong
  ["戊", "明一侯去", "bo͘"],  // biō → bo͘
  ["拔", "並二山入", "poat"],  // pa̍t → poat
  ["貞贞", "知開三清平", "cheng"],  // teng → cheng

  // ---- 1001–3000 (frequency rank in classical Chinese)
  ["忍", "日開三真上", "jim"],  // jín → jim
  ["閉閇闭", "幫四齊去", "pi"],  // pè → pi
  ["犬", "溪合四先上", "khian"],  // khoán → khian
  ["雄", "云三C東平", "hiong"],  // iông → hiong
  ["勤懃", "羣開三C殷平", "khirn"],  // kîrn → khirn
  ["否", "幫三C尤上", "ho͘"],  // hú → ho͘
  ["否", "並三B脂上", "phi"],  // pǐ → phi
  ["肺", "滂三C廢去", "hui"],  // hòe → hui
  ["側侧", "莊開三蒸入", "chhek"],  // chek → chhek
  ["乞", "溪開三C殷入", "khit"],  // khirt → khit
  ["米", "明四齊上", "bi"],  // bé → bi
  ["買买𧹒", "明二佳上", "mai"],  // bái → mai
  ["某", "明一侯上", "bo͘"],  // bió → bo͘
  ["畝", "明一侯上", "bo͘"],  // bió → bo͘
  ["絲丝", "心開三之平", "si"],  // su → si
  ["抱", "並一豪上", "pho"],  // pǒ → pho
  ["熊", "云三C東平", "hiong"],  // iông → hiong
  ["完", "匣合一寒平", "oan"],  // hoân → oan
  ["姊", "精開三脂上", "chi"],  // chú → chi
  ["杞", "溪開三C之上", "ki"],  // khí → ki
  ["熒", "匣合四青平", "eng"],  // hêng → eng
  ["鑿凿", "從一東入 從開一唐入", "chhok"],  // cho̍k → chhok
  ["苛", "匣開一歌平", "kho"],  // hô → kho
  ["驪", "來開三支平", "le"],  // lî → le
  ["愁", "崇三尤平", "chhiu"],  // chhiô → chhiu
  ["慚惭慙", "從開一談平", "chham"],  // châm → chham
  ["牡", "明一侯上", "bo͘"],  // bió → bo͘
  ["貸贷", "透開一咍去", "tai"],  // thài → tai
  ["迺", "泥開一咍上", "nai"],  // lái → nai
  ["雀", "精開三陽入", "chhiak"],  // chiak → chhiak
  ["斥", "昌開三清入", "thek"],  // chhek → thek
  ["隗", "疑合一灰上", "gui"],  // góe → gui
  ["耦", "疑一侯上", "ngo͘"],  // gió → ngo͘
  ["蠶", "從開一覃平", "chham"],  // châm → chham
  ["岑", "崇開三侵平", "chhim"],  // chhôm → chhim
  ["貝贝", "幫一泰去", "poe"],  // pài → poe
  ["欣", "曉開三C殷平", "him"],  // hirn → him
  ["彗篲", "邪合三祭去 邪合三脂去", "hui"],  // sūi → hui
  ["訾", "精開三支上 精開三支平", "chhu"],  // chú/chu → chhu
  ["提", "定開四齊平", "the"],  // tê → the
  ["簿", "並一模上", "pho͘"],  // pǒ͘ → pho͘
  ["躁趮", "精開一豪去", "so"],  // chò → so
  ["嬖", "幫四齊去", "pi"],  // pè → pi
  ["矛", "明三C尤平", "bau"],  // biô → bau
  ["盆", "並一魂平", "phun"],  // pûn → phun
  ["吞", "透開一痕平", "thun"],  // thirn → thun
  ["艮", "見開一痕去", "kun"],  // kìrn → kun
  ["掘", "羣合三C元入", "kut"],  // koa̍t → kut
  ["仞", "日開三真去", "jim"],  // jīn → jim
  ["柯", "見開一歌平", "kho"],  // ko → kho
  ["讖谶", "初開三侵去", "chham"],  // chhòm → chham
  ["罵骂", "明二麻上 明二麻去", "ma"],  // bá/bā → ma
  ["峻", "心合三真去", "chun"],  // sùn → chun
  ["愧媿", "見合三B脂去", "khui"],  // kùi → khui
  ["疲", "並三B支平", "phi"],  // pî → phi
  ["摩", "明一歌去 明一歌平", "mo͘"],  // bō/bô → mo͘
  ["圃", "幫一模上 幫一模去", "pho͘"],  // pó͘/pò͘ → pho͘
  ["係", "見開四齊去", "he"],  // kè → he
  ["祉", "徹開三之上", "chi"],  // thí → chi
  ["訢", "曉開三C殷平", "him"],  // hirn → him
  ["梟枭", "見開四蕭平", "hiau"],  // kiau → hiau
  ["殄", "定開四先上", "thian"],  // tiǎn → thian
  ["墟", "溪開三C魚平", "hir"],  // khir → hir
  ["攜携", "匣合四齊平", "he"],  // hûi → he
  ["聃", "透開一談平", "tam"],  // tham → tam
  ["怖", "滂一模去", "po͘"],  // phò͘ → po͘
  ["挫", "精合一歌去", "chho"],  // chò → chho
  ["疵", "從開三支平", "chhu"],  // chû → chhu
  ["懈", "見開二佳去", "hai"],  // kài → hai
  ["腠", "清一侯去", "chho͘"],  // chhiò → chho͘
  ["芍", "常開三陽入", "chiak"],  // sia̍k → chiak
  ["浚濬", "心合三真去", "chun"],  // sùn → chun
  ["楫", "精開三鹽入", "chip"],  // chiap → chip
  ["挺", "定開四青上 定開四青平", "theng"],  // těng/têng → theng
  ["吠", "並三C廢去", "hui"],  // hōe → hui
  ["缶", "幫三C尤上", "ho͘"],  // hú → ho͘
  ["懾慑", "章開三鹽入", "liap"],  // chiap → liap
  ["橘", "見合三A真入", "kiat"],  // kut → kiat
  ["廁厕", "初開三之去", "chhe"],  // chhù → chhe
  ["酋", "從三尤平", "iu"],  // chiû → iu
  ["鬬", "端一侯去", "to͘"],  // tiò → to͘
  ["駮", "幫二江入", "pak"],  // pok → pak
  ["餒", "泥合一灰上", "loe"],  // lúi → loe
  ["蕤", "日合三脂平", "joe"],  // jûi → joe
  ["郈", "匣一侯上", "ho͘"],  // hiǒ → ho͘

  // ---- rarer than 3000 (frequency rank in classical Chinese)
  ["袍", "並一豪去 並一豪平", "po͘"],  // pō/pô → po͘
  ["瞀", "明一侯去", "bo͘"],  // biō → bo͘
  ["碧", "幫三B庚入", "phek"],  // pek → phek
  ["穫获", "匣合一唐入", "hek"],  // ho̍k → hek
  ["塊凷块", "溪合一灰去", "khoai"],  // khòe → khoai
  ["窕", "定開四蕭上", "thiau"],  // tiǎu → thiau
  ["瑰", "見合一灰平", "kui"],  // koe → kui
  ["詆诋", "定開四齊平 端開四齊上", "ti"],  // tê/té → ti
  ["櫛栉", "莊開三臻入", "chiat"],  // chek → chiat
  ["迅", "心合三真去", "sin"],  // sùn → sin
  ["停", "定開四青平", "theng"],  // têng → theng
  ["浞", "崇二江入", "chhiok"],  // cho̍k → chhiok
  ["覃", "定開一覃平", "tham"],  // tâm → tham
  ["靳", "見開三C殷去", "kin"],  // kìrn → kin
  ["椽", "澄合三仙平", "thoan"],  // toân → thoan
  ["畎", "見合四先上", "khian"],  // koán → khian
  ["种", "澄三東平", "thiong"],  // tiông → thiong
  ["痞", "並三B脂上 幫三B脂上", "phi"],  // pǐ/pí → phi
  ["悵", "徹開三陽去", "tiang"],  // thiàng → tiang
  ["懋", "明一侯去", "bo͘"],  // biō → bo͘
  ["裼", "心開四青入", "thek"],  // sek → thek
  ["嵬", "疑合一灰平", "gui"],  // gôe → gui
  ["杳", "影開四蕭上", "biau"],  // iáu → biau
  ["恍", "見合一唐平", "hong"],  // kong → hong
  ["塚", "知三鍾上", "thiong"],  // tióng → thiong
  ["諼", "曉合三C元上 曉合三C元平", "soan"],  // hoán/hoan → soan
  ["駐驻", "知合三虞去", "chu"],  // tù → chu
  ["滲", "生開三侵去", "sim"],  // sòm → sim
  ["畦", "匣合四齊平", "he"],  // hûi → he
  ["眸", "明三C尤平", "bo͘"],  // biô → bo͘
  ["搴", "見開三B仙上", "khian"],  // kián → khian
  ["觳", "匣一東入", "khok"],  // ho̍k → khok
  ["掊", "並一侯平 幫一侯上", "pho͘"],  // pô͘/pó͘ → pho͘
  ["話话", "匣合二夬去", "hoa"],  // hoāi → hoa
  ["譜谱", "幫一模上", "pho͘"],  // pó͘ → pho͘
  ["斮", "莊二江入 莊開三陽入", "chhiok"],  // chok → chhiok
  ["漚", "影一侯去 影一侯平", "au"],  // iò/io → au
  ["祲", "精開三侵去 精開三侵平", "chhim"],  // chìm/chim → chhim
  ["娟", "影合三A仙平", "koan"],  // oan → koan
  ["纔", "從開一咍去 從開一咍平", "chhai"],  // chāi/châi → chhai
  ["禎祯", "知開三清平", "cheng"],  // teng → cheng
  ["諠", "曉合三C元平", "soan"],  // hoan → soan
  ["蝥", "明二肴平", "mau"],  // bâu → mau
  ["濃浓", "孃三鍾平", "long"],  // liông → long
  ["眯", "明四齊上", "bi"],  // bé → bi
  ["溧", "來開三真入", "lek"],  // li̍t → lek
  ["諏", "精合三虞平", "cho͘"],  // chu → cho͘
  ["竣", "清合三真平", "chun"],  // chhun → chun
  ["鋌", "定開四青上", "theng"],  // těng → theng
  ["捉", "莊二江入", "chhiok"],  // chok → chhiok
  ["紩", "澄開三真入", "tiat"],  // ti̍t → tiat
  ["蝸蜗", "見合二佳平 見合二麻平", "oa"],  // koa → oa
  ["娃", "影開二佳平", "oa"],  // ai → oa
  ["曇昙", "定開一覃平", "tham"],  // tâm → tham
  ["鵜鴺鹈", "定開四齊平", "the"],  // tê → the
  ["輳", "清一侯去", "cho͘"],  // chhiò → cho͘
  ["莧苋", "匣開二山去", "hian"],  // hān → hian
  ["慇", "影開三C殷平", "un"],  // irn → un
  ["甓", "並四青入", "phek"],  // pe̍k → phek
  ["秪", "知開三脂平", "te"],  // ti → te
  ["佴", "泥開一咍去", "nai"],  // lāi → nai
  ["壎塤", "曉合三C元平", "hun"],  // hoan → hun
  ["諉", "孃合三支去", "ui"],  // lūi → ui
  ["愜惬", "溪開四添入", "kiap"],  // khiap → kiap
  ["艇", "定開四青上", "theng"],  // těng → theng
  ["狽", "幫一泰去", "poe"],  // pài → poe
  ["訒", "日開三真去", "jim"],  // jīn → jim
  ["枓", "端一侯上", "to͘"],  // tió → to͘
  ["註", "知合三虞去", "chu"],  // tù → chu
  ["蟫", "定開一覃平", "tham"],  // tâm → tham
  ["鐕", "精開一覃平", "chhiam"],  // cham → chhiam
  ["痕", "匣開一痕平", "hun"],  // hîrn → hun
  ["縐", "莊三尤去", "cho͘"],  // chiò → cho͘
  ["莿", "清開三支去", "chhi"],  // chhù → chhi
  ["鎚", "澄合三脂去 澄合三脂平", "thui"],  // tūi/tûi → thui
  ["槿", "見開三C殷上", "kin"],  // kírn → kin
  ["帙袠", "澄開三真入", "tiat"],  // ti̍t → tiat
  ["恰", "溪開二咸入", "khap"],  // khiap → khap
  ["闖闯", "徹開三侵去", "chhoan"],  // thìm → chhoan
  ["孋㛤", "來開三支平", "le"],  // lî → le
  ["臉脸", "來開二咸上", "liam"],  // lám → liam
  ["湒", "精開三侵入", "chhip"],  // chip → chhip
  ["踸", "徹開三侵上", "chhim"],  // thím → chhim
  ["鮡", "定開四蕭平 澄開三宵上", "thiau"],  // tiâu/tiǎu → thiau
  ["膨", "並二庚去 並二庚平", "pheng"],  // pēng/pêng → pheng
  ["焮", "曉開三C殷去", "him"],  // hìrn → him
  ["樁桩", "知二江平", "chong"],  // tong → chong
  ["棍", "匣合一魂上", "kun"],  // hǔn → kun
  ["昶", "徹開三陽上 徹開三陽去", "chhiang"],  // thiáng/thiàng → chhiang
  ["慵", "常三鍾平", "iong"],  // siông → iong
  ["箅", "幫四齊去", "pi"],  // pè → pi
  ["杮", "滂三C廢去", "phoe"],  // hòe → phoe
  ["崽", "生開二佳平 生開二皆平", "chai"],  // sai → chai
  ["魔", "明一歌平", "mo͘"],  // bô → mo͘
  ["鰻鳗", "明一寒平 明三C元去", "ban"],  // boân/boān → ban
  ["打", "端開二庚上 端開四青上", "ta"],  // téng → ta
  ["卌", "心開三侵入", "siap"],  // sip → siap
  ["呢", "孃開三脂平", "ni"],  // lî → ni
  ["壜", "定開一覃平", "tham"],  // tâm → tham
  ["媽妈", "明一模上", "ma"],  // bó͘ → ma
  ["拐", "見合二佳上", "koai"],  // kóa → koai
  ["搭", "透開一談入", "tap"],  // thap → tap
  ["枴", "見合二佳上", "koai"],  // kóa → koai
  ["澁", "生開三侵入", "siap"],  // sip → siap
  ["瘸", "羣合三C歌平", "ka"],  // kiâ → ka
  ["簆", "溪一侯去", "kho͘"],  // khiò → kho͘
  ["膁", "溪開四添上", "liam"],  // khiám → liam
  ["衅", "曉開三B真去", "hun"],  // hìn → hun
];

function 查例外(字, 地位) {
  const 有 = (列) => 列[1].split(' ').includes(地位);
  const 行 = 例外.find(列 => [...列[0]][0] === 字 && 有(列)) || 例外.find(列 => 列[0].includes(字) && 有(列));
  return 行 ? 行[2] : null;
}

// ============================================================================
// 聲調 (tones) — 8 tones; 全濁上 is its own tone 6 (Quanzhou city, Nan'an, Hui'an, Lukang)
// 〔中〕聲調：八個聲調；全濁上自成第六聲（泉州市區、南安、惠安、鹿港）。
// ============================================================================
// 清音 / 濁音 are the valid descriptors ('清' / '濁' alone throw).
// 〔中〕清音／濁音是有效的描述詞（單獨寫「清」「濁」會報錯）。次濁上併入清上（第二聲），各參照方言皆然。
// 次濁上 joins 清上 (tone 2) as in all reference varieties.
const 聲調表 = [
  ['平聲 清音', 1],
  ['平聲 濁音', 5],
  ['上聲 全濁', 6],
  ['上聲', 2],
  ['去聲 清音', 3],
  ['去聲 濁音', 7],
  ['入聲 清音', 4],
  ['入聲 濁音', 8],
];

// ============================================================================
// POJ tone marks. Tones 1 and 4 are unmarked (tone 4 shows as -p/-t/-k/-h).
// 〔中〕POJ 聲調符號：第 1、4 聲不標調（第 4 聲以 -p/-t/-k/-h 呈現）。
// ============================================================================
const 調號 = { 2: '́', 3: '̀', 5: '̂', 6: '̌', 7: '̄', 8: '̍' };

/**
 * Where POJ puts the mark:
 *  1. one vowel -> that vowel (ir: the r is not a vowel);
 *  2. two vowels with i/u -> the other vowel (ia, io, ai, au, ou), but iu and ui -> u;
 *  3. oa / oe -> o, unless the final has 3+ letters (oan, oat, oeh), then the second vowel;
 *  4. three vowels (iau, oai) -> the second vowel;
 *  5. no vowel (m, ng) -> the nasal.
 * 〔中〕調號位置：1. 單元音標在該元音（ir 的 r 不是元音）；2. 含 i/u 的雙元音標在另一元音（ia、io、ai、au、ou），但 iu、ui 標在 u；
 * 〔中〕3. oa / oe 標在 o，但韻母達 3 個字母（oan、oat、oeh）時標第二個元音；4. 三元音（iau、oai）標第二個元音；5. 無元音（m、ng）標在鼻音。
 * o͘ is "o" + U+0358; the tone mark attaches to the o and NFC puts U+0358 after it.
 */
function 標調(音節, 調) {
  const mark = 調號[調];
  if (!mark) return 音節;
  const L = [...音節];
  const V = [];
  L.forEach((c, i) => { if ('aeiou'.includes(c)) V.push(i); });
  let idx;
  if (V.length === 0) {
    idx = L.findIndex(c => c === 'm' || c === 'n');
  } else if (V.length === 1) {
    idx = V[0];
  } else if (V.length >= 3) {
    idx = V[1];
  } else {
    const [a, b] = V;
    const ca = L[a], cb = L[b];
    const 末長 = L.slice(a).filter(c => c !== '͘').length;   // letters in the final
    if ((ca === 'i' && cb === 'u') || (ca === 'u' && cb === 'i')) idx = ca === 'u' ? a : b;
    else if (ca === 'i' || ca === 'u') idx = b;
    else if (cb === 'i' || cb === 'u') idx = a;
    else if (ca === 'o' && (cb === 'a' || cb === 'e')) idx = 末長 >= 3 ? b : a;
    else idx = a;
  }
  if (idx < 0) return 音節;
  return (L.slice(0, idx + 1).join('') + mark + L.slice(idx + 1).join('')).normalize('NFC');
}

// ============================================================================
// Assemble
// ============================================================================
// Table values are level-tone finals. For 入聲 the nasal coda becomes the matching stop
// (m->p, n->t, ng->k). A value starting with "!" is already a literal checked final.
// 〔中〕組合：表中的值為平聲韻母；入聲時鼻音韻尾轉為對應塞音（m→p、n→t、ng→k）；以「!」開頭的值已是實際韻母。
function 轉入聲(f) {
  return f.replace(/ng$/, 'k').replace(/n$/, 't').replace(/m$/, 'p');
}

function 取韻母() {
  const v = when(韻母表, '韻母');
  if (v[0] === '!') return v.slice(1);
  return is('入聲') ? 轉入聲(v) : v;
}

let 聲母 = when(聲母表, '聲母');
const 韻母 = 取韻母();
// 疑母 is ng- before the open back vowels o / o͘ (五 ngó͘, 我 ngó), g- elsewhere.
// 〔中〕疑母在開後元音 o / o͘ 前讀 ng-（五 ngó͘、我 ngó），其餘讀 g-。
if (聲母 === 'g' && (韻母 === 'o' || 韻母 === 'o͘')) 聲母 = 'ng';
const 聲調 = when(聲調表, '聲調');

// 個別字例外: replace initial + final (not the tone) for the listed 字頭 / 音韻地位.
// 〔中〕個別字例外：對所列字頭／音韻地位替換聲母與韻母（不動聲調）。
if (選項.例外 !== false && 字頭) {
  const 例 = 查例外(字頭, 音韻地位.描述);
  if (例) return 標調(例, 聲調);
}

return 標調(聲母 + 韻母, 聲調);

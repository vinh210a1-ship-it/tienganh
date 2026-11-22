/* Bộ phân tích thành phần câu tiếng Anh (S, V, O, C, A, to-V...) chạy hoàn toàn trong trình duyệt.
   Không dùng thư viện ngoài, không gửi dữ liệu đi đâu. Dựa trên luật + từ điển nhỏ, nên chỉ là GỢI Ý:
   câu phức, câu nhiều dấu phẩy, từ lạ có thể sai. Xem kiem/kiem-phan-tich.mjs để biết độ chính xác đã đo. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PhanTich = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ================= 1. TỪ ĐIỂN ================= */
  var L = Object.create(null);
  function add(w, t, f, x) {
    f = f || undefined;
    var a = L[w] || (L[w] = []);
    for (var i = 0; i < a.length; i++) if (a[i].t === t && a[i].f === f) { if (x) for (var q in x) a[i][q] = x[q]; return; }
    var c = { t: t };
    if (f) c.f = f;
    if (x) for (var k in x) c[k] = x[k];
    a.push(c);
  }
  function many(str, t, f, x) { str.split(/\s+/).forEach(function (w) { if (w) add(w, t, f, x); }); }

  /* từ chức năng */
  many('a an the', 'D');
  many('this that these those', 'D', null, { dem: 1 });
  many('my your his her its our their', 'D', null, { poss: 1 });
  many('some any no every each all both either neither another much many more most few fewer less little several enough half such', 'D', null, { q: 1 });
  many('i he she we they', 'PS');
  many('you it', 'PS'); many('you it', 'PO');
  many('me him her us them', 'PO');
  many('this that these those some any all both either neither another much many more most few several none one each', 'PA');
  many('someone something anyone anything everyone everything nobody nothing somebody everybody somewhere anywhere', 'PA');
  many('mine yours hers ours theirs myself yourself himself herself itself ourselves themselves yourselves oneself', 'PA', null, { refl: 1 });
  many('myself yourself himself herself itself ourselves themselves yourselves oneself', 'PO');
  add('there', 'EX'); add('there', 'R');
  many('in on at of for from with without about by over under between among through during before after since until into onto upon within across against around near behind beyond like than as per via toward towards off along despite except inside outside above below beside throughout beneath underneath unlike plus up down out round past', 'P');
  add('to', 'TO'); add('to', 'P');
  many('that which who whom whose what whatever whoever why how whether if because although though while whereas when whenever where wherever once unless until since after before as', 'U');
  many('that which who whom whose', 'U', null, { rel: 1 });
  many('where', 'U', null, { rel: 1 });
  many('what whatever whoever who whom whose which why how whether when where', 'U', null, { wh: 1 });
  many('because although though while whereas when whenever if unless once until since after before as', 'U', null, { adv: 1 });
  many('and but or nor yet so', 'CC');
  many('can could will would shall should may might must ought', 'M');
  add('cannot', 'M', null, { neg: 1 });
  add('be', 'BE', 'b'); many('am is are was were', 'BE', 'fin'); add('been', 'BE', 'n'); add('being', 'BE', 'g');
  add('doing', 'V', 'g'); add('having', 'V', 'g');
  add('have', 'HV', 'b'); many('have has had', 'HV', 'fin'); add('had', 'HV', 'n'); add('having', 'HV', 'g');
  add('do', 'DO', 'b'); many('do does did', 'DO', 'fin'); add('done', 'DO', 'n'); add('doing', 'DO', 'g');
  add('not', 'NEG'); add("n't", 'NEG');
  many('please yes hello hi hey oh wow okay ok thanks', 'R');
  many('inside outside upstairs', 'R');
  many('not also very too quite rather really so just only even almost nearly already still yet always usually often sometimes never rarely seldom ever now then today yesterday tomorrow tonight soon later early recently currently finally here there home abroad away back together alone apart everywhere nearby upstairs downstairs well fast hard far long late again once twice perhaps maybe actually basically however therefore thus hence moreover furthermore nevertheless nonetheless meanwhile consequently instead otherwise besides indeed overall similarly likewise accordingly merely simply gradually widely highly fairly extremely equally considerably genuinely crucially surprisingly later earlier ago enough else', 'R');
  many('up down out off over away back', 'R');
  many('more most less least much', 'R');
  add('before', 'R'); add('after', 'R'); add('else', 'R'); add('yet', 'R'); add('so', 'R'); add('as', 'R'); add('once', 'R');
  many('i you he she it we they', 'PS');

  var CONN = 'however therefore thus hence moreover furthermore nevertheless nonetheless meanwhile consequently instead otherwise besides indeed overall similarly likewise accordingly'.split(' ');
  var CONN_MULTI = ['for example', 'for instance', 'in addition', 'in contrast', 'on the other hand', 'in conclusion', 'as a result', 'in other words', 'in fact', 'of course', 'at the same time', 'above all', 'first of all', 'in short', 'by contrast', 'for this reason', 'in particular', 'on the contrary'];
  var NEG_INV = ['not only', 'not until', 'never', 'hardly', 'rarely', 'seldom', 'scarcely', 'no sooner', 'only when', 'only after', 'little'];

  /* động từ thường (dạng gốc) */
  var VERBS = ('elect appoint declare crown vote label apologize exchange kick kiss paint pretend protect repair cling creep kneel shrink wind weave broadcast burst grind lower lessen enhance ensure facilitate minimise modify monitor predict regulate restrict simulate sustain transform utilize whisk emulsify homogenize pasteurize sterilize ferment extract isolate precipitate coagulate crystallize affect contribute cause rain snow fail exceed refer decrease tolerate resist absorb release dissolve interact adsorb adhere bind form accept achieve act add admit adopt advise afford agree aim allow announce answer appear apply argue arrange arrive ask assume attach attempt avoid bake bath believe belong borrow boil bother call carry cause celebrate change charge chat check choose claim clean clear click climb close collect combine commit compare complain complete conceal conduct confirm connect consider consist consolidate contact contain continue contribute control convert cook copy correct cost count cover crack create cross cry cut damage dance deal decide decline decrease deliver demand demonstrate depend describe design destroy detect determine develop die differ discover discuss dislike display distribute divide double doubt download draw dream dress drop dry earn eat employ enable encourage end enjoy enter establish estimate examine exist expand expect experience explain explore express extend face fail fade fall feel fill finish fit fix focus follow force forget form freeze gain gather generate grow guess handle happen hate head hear heat help hesitate hide hit hold hope hurry identify ignore illustrate imagine imply improve include increase indicate influence inform insist install intend introduce invest invite involve join jump keep kill knock know label land last laugh launch lead learn leave lend let lie lift like limit link list listen live load lock look lose love maintain manage mark match matter mean measure meet mention mind miss mix move name need notice obtain observe occur offer open operate order organize ought own pack park pass pay perform permit pick place plan plant play point practice prefer prepare present press prevent print produce promise promote prove provide publish pull push put quit raise reach read realize receive recall recognize recommend record reduce refer reflect refuse regard relate relax release rely remain remember remind remove repeat replace replicate reply report represent require reserve respond rest result retain retrieve return reveal review revisit rise roll rub run sail save say search see seem select sell send separate serve set settle shake share shift shop shout show shut sign sing sit skip sleep slide smell smile solve sound speak spend spread stand start state stay steal stick stop store study submit succeed suffer suggest supply support suppose surprise survive switch take talk taste teach tell tend term test thank think throw touch train transfer translate travel treat trust try turn understand update use vary visit wait wake walk want warm warn wash waste watch wear weigh welcome win wish wonder work worry write yield reconstruct reread distribute stabilize memorize memorise emulsify solidify strengthen apply approach assess analyse analyze define derive evaluate estimate interpret investigate occur participate require specify summarise summarize overcome undergo undertake withdraw prolong concentrate cram review practise reconsider recover relate separate quantify minimize minimise maximise maximize optimize optimise validate verify calibrate dissolve disperse dilute stir blend whip heat cool chill freeze thaw pour weigh sieve filter rinse boil simmer bake fry roast grill steam preserve store ship order invoice approve attend schedule reschedule cancel postpone book hire fire train supervise manage report draft sign deliver').split(/\s+/);
  var IRREG = ('become became become|bend bent bent|bet bet bet|bite bit bitten|bleed bled bled|breed bred bred|burn burnt burnt|fight fought fought|flee fled fled|ride rode ridden|ring rang rung|seek sought sought|shine shone shone|spin spun spun|split split split|sting stung stung|sweep swept swept|swing swung swung|weep wept wept|lean leant leant|leap leapt leapt|forbid forbade forbidden|go went gone|get got got|make made made|say said said|see saw seen|come came come|know knew known|think thought thought|take took taken|give gave given|find found found|tell told told|feel felt felt|leave left left|put put put|bring brought brought|buy bought bought|eat ate eaten|drink drank drunk|write wrote written|read read read|meet met met|pay paid paid|send sent sent|speak spoke spoken|begin began begun|sleep slept slept|run ran run|sit sat sat|stand stood stood|lose lost lost|win won won|teach taught taught|build built built|fall fell fallen|break broke broken|draw drew drawn|choose chose chosen|drive drove driven|fly flew flown|forget forgot forgotten|hold held held|sing sang sung|swim swam swum|wear wore worn|rise rose risen|throw threw thrown|hide hid hidden|keep kept kept|let let let|set set set|cut cut cut|hit hit hit|hurt hurt hurt|cost cost cost|spend spent spent|lead led led|learn learnt learnt|understand understood understood|mean meant meant|sell sold sold|catch caught caught|grow grew grown|show showed shown|lend lent lent|feed fed fed|lie lay lain|shut shut shut|spread spread spread|steal stole stolen|shake shook shaken|wake woke woken|bear bore borne|beat beat beaten|blow blew blown|dig dug dug|hang hung hung|light lit lit|shoot shot shot|sink sank sunk|strike struck struck|swear swore sworn|tear tore torn|undergo underwent undergone|overcome overcame overcome|withdraw withdrew withdrawn|undertake undertook undertaken|forgive forgave forgiven|upset upset upset|rebuild rebuilt rebuilt|redo redid redone|rewrite rewrote rewritten').split('|');
  /* danh từ cũng là động từ, hoặc danh từ hay gặp (để từ có hai khả năng) */
  var NV = ('approach attempt benefit challenge claim comment concern control copy escape experiment guess influence interest joke judge picture protest purchase range level surface work study test result increase decrease change need use help call look face show rise fall drink walk talk plan mix process record research report review recall decline term cost answer question pay rest love hope fear wish watch step stop turn order offer visit trip practice support market design shape cover check count dress fix heat cool form guide impact label link list load lock mark match note point press price promise push race reach rule sample score set sign sound spread start stress supply surprise target touch train trust value view vote wash water wave wonder yield present object subject permit conduct contract conflict progress finish rate store state place name way end part case time cause side home number group release return save search service shift show suggest switch update repeat damage demand dream drop effect experience focus issue lead limit move open pass plant pick pull ship shop smell smile taste test transfer travel treat trial turn use waste weight').split(/\s+/);
  var NOUNS = ('program government fact power line member community president kid others art war party guy moment air education foot sense nation death field development role effort drug leader wife police son town arm action season society tax position player space ground event official center site activity star court situation industry image doctor wall patient north type tree organization hair culture period summer letter condition daughter garden meat fruit vegetable pepper airport hotel bank library restaurant supermarket station holiday birthday shirt jacket shoes hat apartment bedroom bathroom layer mixture concentration noon midnight understanding meaning feeling building training learning reading writing listening speaking spelling cooking shopping marketing packaging processing mixing heating cooling setting ending beginning painting wedding evening clothing housing funding warning planning testing spacing consumption century psychologist experiment series syllable memory curve hour rate loss finding researcher session time effect class classroom examination exception learner material information process understanding gap review feeling fluency indicator case phenomenon retention speed interval list person man woman child student teacher worker friend family brother sister mother father parent boy girl baby company business office lab laboratory kitchen house room school city country street road shop store hospital factory building floor table desk bag box fridge phone computer car bus train plane ticket card money coffee tea water food rice bread egg milk oil sugar salt fat protein emulsion emulsifier sauce mayonnaise sample batch ingredient formula quality temperature viscosity supplier deadline equipment data meeting email report week month year day night morning afternoon evening weekend minute second today english vietnamese language word sentence question idea problem reason example thing life world country job book page paper article lesson course exam test hobby music movie film game sport football weather rain sun age name address number door window chair bed light picture photo place area part system method technique study analysis theory model figure table chart graph result evidence source structure property particle droplet size surface tension interface phase stability shelf kind lot bit piece cup glass bottle plate dish meal breakfast lunch dinner dollar price cost market customer client manager director team project plan schedule task goal target product package label quantity amount level degree range limit sale sales purchase order invoice contract agreement policy rule law decision choice chance opportunity risk benefit advantage disadvantage difference similarity relationship connection link attention knowledge skill ability experience practice habit routine energy health body mind heart hand head eye face voice sound noise mistake error issue trouble help support advice information news story history science technology research university college degree grade score mark number figure digit').split(/\s+/);
  var ADJS = ('good bad new old big small long short high low great little large young early late right wrong sure happy sad angry busy free ready easy hard difficult simple important different same similar next last other own whole full empty open close clean dirty hot cold warm cool wet dry fresh sweet sour bitter salty spicy rich poor cheap expensive fast slow quick quiet loud strong weak light dark bright heavy thin thick soft smooth rough flat round single double main common special general particular public private local national international possible impossible necessary available famous popular useful effective efficient significant relevant recent previous current final second third first various several certain clear obvious likely unlikely able unable alone afraid aware glad proud sorry fun sick tired fine nice kind lucky careful certain safe dangerous healthy natural normal central basic major minor total real true false German English French American British Chinese Vietnamese Japanese Korean Indian European African Asian steep prolonged underused passive active effortful meaningless remarkable varying considerable genuine meaningful crucial equal powerful long-term short-term well-known high-quality low-fat hydrophobic hydrophilic viscous stable unstable aqueous oral organic inorganic chemical physical biological medical economic social political cultural environmental technical scientific academic professional financial legal digital global rapid gradual sharp steady tight loose mean extra proper correct accurate precise exact vague broad narrow deep shallow wide thick additional entire overall previous following above below such same like unlike ill ugly pretty beautiful lovely wonderful terrible awful horrible excellent perfect better best worse worst ').split(/\s+/);
  var ADJ_ER = 'steep high low long short old young big small large fast slow quick cheap strong weak hot cold warm cool dark bright light heavy thin thick soft smooth rough flat close near late early hard easy happy busy nice fine safe wide deep sharp tight loose rich poor clean fresh sweet'.split(' ');
  var PARTADJ = 'promising interesting surprising exciting boring amazing confusing challenging encouraging satisfying disappointing shocking worrying tiring relaxing missing increasing growing existing remaining tired bored interested excited married worried surprised pleased satisfied confused scared disappointed amazed annoyed exhausted frightened relaxed shocked embarrassed thrilled concerned involved located based related qualified experienced limited advanced prolonged underused finished prepared pleased interested'.split(' ');
  var NATIONAL = 'german english french american british chinese vietnamese japanese korean indian european african asian'.split(' ');

  var LINK_ONLY = ['seem', 'appear', 'remain', 'become', 'stay', 'prove', 'sound'];
  var LINK_SEMI = ['look', 'feel', 'get', 'grow', 'turn', 'taste', 'smell', 'go'];
  var THINK = 'think know believe say hope suppose guess feel realize realise mean mind wish bet imagine assume expect find show suggest imply indicate argue claim report notice learn understand remember forget decide explain mention note observe discover prove demonstrate agree promise doubt worry see hear tell ask wonder confirm conclude reveal reflect ensure'.split(' ');
  var TO_COMP = 'want need like love hate try begin start decide plan hope expect prefer learn forget remember tend appear seem happen choose manage fail offer refuse agree promise continue wish dare afford intend ought compel force allow ask tell advise encourage enable require invite remind urge permit cause help get have used order'.split(' ');
  var ING_COMP = 'enjoy like love hate start begin stop keep finish avoid consider practice practise mind suggest imagine admit deny risk quit continue prefer go spend involve'.split(' ');
  var OC_VERBS = 'call name elect appoint declare crown vote label consider'.split(' ');
  var DITRANS = 'give tell show send offer teach ask buy bring make pay lend cook get write sell hand pass keep save'.split(' ');
  var PARTICLES = ['up', 'down', 'out', 'off', 'away', 'back'];
  var TIMEW = 'second minute hour day week month year decade century morning afternoon evening night noon midnight today yesterday tomorrow tonight monday tuesday wednesday thursday friday saturday sunday january february march april may june july august september october november december weekend season spring summer autumn winter time moment period moments years days weeks months hours minutes seconds decades centuries nights mornings'.split(' ');
  var FREQW = 'always usually often sometimes never rarely seldom ever again twice'.split(' ');
  var NPREP = {
    in: 'decline increase rise fall drop change gap difference interest growth reduction improvement decrease gaps',
    for: 'demand need reason search respect reward',
    to: 'attention access key answer solution reaction response approach contribution threat introduction',
    on: 'effect impact influence emphasis focus effects',
    with: 'problem trouble contact connection',
    between: 'relationship difference link gap distinction contrast balance tension interface boundary',
    about: 'knowledge idea information',
    of: ''
  };
  Object.keys(NPREP).forEach(function (p) { var o = {}; NPREP[p].split(' ').forEach(function (w) { if (w) o[w] = 1; }); NPREP[p] = o; });
  var GERUND_N = 'understanding meaning feeling building training learning reading writing listening speaking spelling cooking shopping marketing packaging processing mixing heating cooling setting ending beginning painting wedding evening clothing housing funding warning planning testing spacing'.split(' ');
  var ING_ADJ = 'varying following existing remaining increasing decreasing growing developing living missing leading surrounding resulting underlying emerging changing rising falling'.split(' ');
  var WH_ADJ = ['much', 'many', 'long', 'often', 'old', 'far', 'big', 'tall', 'fast', 'soon', 'late', 'well'];
  var ABBR = ['mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'vs', 'etc', 'e.g', 'i.e', 'fig', 'no', 'st', 'inc', 'ltd', 'co', 'approx', 'al'];

  /* sinh dạng chia của động từ thường */
  function vForms(b) {
    var s, ed, ing;
    if (/[^aeiou]y$/.test(b)) { s = b.slice(0, -1) + 'ies'; ed = b.slice(0, -1) + 'ied'; ing = b + 'ing'; }
    else {
      s = /(s|x|z|ch|sh|o)$/.test(b) ? b + 'es' : b + 's';
      if (/e$/.test(b)) { ed = b + 'd'; ing = b.slice(0, -1) + 'ing'; if (/ie$/.test(b)) ing = b.slice(0, -2) + 'ying'; }
      else { ed = b + 'ed'; ing = b + 'ing'; }
    }
    var extra = [];
    if (/^[^aeiou]*[aeiou][bdgklmnprt]$/.test(b) || /^(admit|refer|occur|prefer|permit|control|commit|submit|transfer|equip|regret)$/.test(b)) {
      var d = b + b.slice(-1); extra = [d + 'ed', d + 'ing'];
    }
    return { s: s, ed: ed, ing: ing, extra: extra };
  }
  function addVerb(base, past, pp, noLemma) {
    var f = vForms(base), x = { l: base };
    add(base, 'V', 'b', x); add(f.s, 'V', 's', x); add(f.ing, 'V', 'g', x);
    if (past) { add(past, 'V', 'd', x); add(pp, 'V', 'n', x); }
    else { add(f.ed, 'V', 'd', x); add(f.ed, 'V', 'n', x); if (f.extra[0]) { add(f.extra[0], 'V', 'd', x); add(f.extra[0], 'V', 'n', x); add(f.extra[1], 'V', 'g', x); } }
  }
  VERBS.forEach(function (v) { if (v) addVerb(v); });
  IRREG.forEach(function (r) { var p = r.split(' '); addVerb(p[0], p[1], p[2]); });
  NV.forEach(function (w) {
    if (!L[w] || !L[w].some(function (c) { return c.t === 'V'; })) addVerb(w);
    add(w, 'N', 's');
    var f = vForms(w); add(f.s, 'N', 'p');
  });
  NOUNS.forEach(function (w) {
    add(w, 'N', 's');
    var p = /[^aeiou]y$/.test(w) ? w.slice(0, -1) + 'ies' : (/(s|x|z|ch|sh)$/.test(w) ? w + 'es' : w + 's');
    add(p, 'N', 'p');
  });
  ['men', 'women', 'children', 'people', 'feet', 'teeth', 'mice', 'data', 'media', 'phenomena', 'criteria'].forEach(function (w) { add(w, 'N', 'p'); });
  add('data', 'N', 's'); add('research', 'N', 's'); add('information', 'N', 's'); add('equipment', 'N', 's');
  add('people', 'N', 'p'); add('person', 'N', 's'); add('psychologist', 'N', 's');
  ADJS.forEach(function (w) { add(w.toLowerCase(), 'J'); });
  ADJ_ER.forEach(function (w) {
    var st = w;
    if (/[^aeiou]y$/.test(w)) st = w.slice(0, -1) + 'i';
    else if (/^[^aeiou]*[aeiou][bdgmnpt]$/.test(w) && w.length <= 4) st = w + w.slice(-1);
    add(st + (/e$/.test(st) ? 'r' : 'er'), 'J'); add(st + (/e$/.test(st) ? 'st' : 'est'), 'J');
  });
  ['better', 'best', 'worse', 'worst', 'bigger', 'biggest', 'hotter', 'hottest', 'happier', 'happiest', 'easier', 'easiest', 'busier', 'busiest'].forEach(function (w) { add(w, 'J'); });
  PARTADJ.forEach(function (w) { add(w, 'J'); });
  NATIONAL.forEach(function (w) { add(w, 'J'); });
  add('english', 'N', 's'); add('vietnamese', 'N', 's');
  add('long-term', 'J'); add('short-term', 'J'); add('well-known', 'J');
  add('first', 'J'); add('second', 'J'); add('third', 'J'); add('second', 'N', 's');
  many('one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million billion', 'NUM');
  ['today', 'tomorrow', 'yesterday', 'tonight'].forEach(function (w) { add(w, 'N', 's'); });
  add('hundreds', 'N', 'p'); add('thousands', 'N', 'p'); add('millions', 'N', 'p'); add('dozens', 'N', 'p');
  add('lot', 'N', 's'); add('lots', 'N', 'p'); add('couple', 'N', 's'); add('series', 'N', 's'); add('series', 'N', 'p');

  /* ghép từ vựng của web (VOCAB) vào từ điển: [từ, nghĩa, ví dụ, loại] */
  function themTuVung(vocab) {
    (vocab || []).forEach(function (e) {
      var kind = e[3];
      String(e[0]).split(/\s*\/\s*/).forEach(function (w) {
        w = w.toLowerCase().trim();
        if (!w || /\s/.test(w)) return;
        if (kind === 'v' && !(L[w] && L[w].some(function (c) { return c.t === 'V'; }))) addVerb(w);
        else if (kind === 'n' && !L[w]) { add(w, 'N', 's'); add(/[^aeiou]y$/.test(w) ? w.slice(0, -1) + 'ies' : w + 's', 'N', 'p'); }
        else if (kind === 'a' && !L[w]) add(w, 'J');
      });
    });
  }

  /* ================= 2. TÁCH TỪ, TÁCH CÂU ================= */
  var TOKRE = /[A-Za-zÀ-ɏ]+(?:['’][A-Za-z]+)*(?:-[A-Za-zÀ-ɏ]+)*|\d+(?:[.,]\d+)*[A-Za-z%]*|[.!?]+|[,;:]|[()\[\]]|[–—]|\r?\n[ \t]*\r?\n/g;
  var STEMMAP = { ca: 'can', wo: 'will', sha: 'shall', ai: 'am', ain: 'is' };
  var BE_S = { it: 1, he: 1, she: 1, that: 1, there: 1, here: 1, what: 1, who: 1, where: 1, how: 1, let: 1 };

  function mk(text, s, e, extra) {
    var t = { w: text.slice(s, e), s: s, e: e, lw: text.slice(s, e).toLowerCase().replace(/’/g, "'") };
    for (var k in extra) t[k] = extra[k];
    return t;
  }
  function tokenize(text) {
    var toks = [], m;
    TOKRE.lastIndex = 0;
    while ((m = TOKRE.exec(text))) {
      var s = m.index, e = s + m[0].length, w = m[0];
      if (/^\r?\n/.test(w)) { toks.push({ para: true, p: true, pt: 'para', w: '', lw: '', s: s, e: e }); continue; }
      if (/^[.!?]+$/.test(w)) { toks.push(mk(text, s, e, { p: true, pt: 'final' })); continue; }
      if (w === ',') { toks.push(mk(text, s, e, { p: true, pt: 'comma' })); continue; }
      if (w === ';') { toks.push(mk(text, s, e, { p: true, pt: 'semi' })); continue; }
      if (w === ':') { toks.push(mk(text, s, e, { p: true, pt: 'colon' })); continue; }
      if (w === '(' || w === '[') { toks.push(mk(text, s, e, { p: true, pt: 'open' })); continue; }
      if (w === ')' || w === ']') { toks.push(mk(text, s, e, { p: true, pt: 'close' })); continue; }
      if (w === '–' || w === '—') { toks.push(mk(text, s, e, { p: true, pt: 'dash' })); continue; }
      var lw = w.toLowerCase().replace(/’/g, "'");
      var cap = /^[A-ZÀ-Þ]/.test(w);
      var mm;
      if ((mm = /^(.+)n't$/.exec(lw)) && w.length > 3) {
        var stem = STEMMAP[mm[1]] ? mm[1] : mm[1];
        var cut = s + mm[1].length;
        toks.push(mk(text, s, cut, { cap: cap, stem: STEMMAP[mm[1]] || mm[1] }));
        toks.push(mk(text, cut, e, { lw: "n't", cap: false }));
        continue;
      }
      if ((mm = /^(.+)'(m|re|ve|ll|d)$/.exec(lw))) {
        var cut2 = s + mm[1].length;
        toks.push(mk(text, s, cut2, { cap: cap }));
        var map = { m: 'am', re: 'are', ve: 'have', ll: 'will', d: 'would' };
        toks.push(mk(text, cut2, e, { lw: map[mm[2]], cap: false, contr: true }));
        continue;
      }
      if ((mm = /^(.+)'s$/.exec(lw))) {
        if (BE_S[mm[1]]) {
          var cut3 = s + mm[1].length;
          toks.push(mk(text, s, cut3, { cap: cap }));
          toks.push(mk(text, cut3, e, { lw: 'is', cap: false, contr: true }));
        } else toks.push(mk(text, s, e, { cap: cap, lw: mm[1], poss: true }));
        continue;
      }
      toks.push(mk(text, s, e, { cap: cap }));
    }
    return toks;
  }
  function splitSentences(toks) {
    var out = [], cur = [];
    function flush() { if (cur.some(function (t) { return !t.p; })) out.push(cur); cur = []; }
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      if (t.para) { flush(); continue; }
      cur.push(t);
      if (t.pt === 'final') {
        var nx = toks[i + 1], pv = cur.length > 1 ? cur[cur.length - 2] : null;
        var abbr = pv && !pv.p && (ABBR.indexOf(pv.lw) >= 0 || /^[A-Z]$/.test(pv.w)) && t.w === '.';
        var starts = !nx || nx.para || (!nx.p && /^[A-ZÀ-Þ0-9]/.test(nx.w)) || (nx.p && nx.pt === 'open');
        if (!abbr && starts) flush();
      }
    }
    flush();
    return out;
  }

  /* ================= 3. GÁN KHẢ NĂNG TỪ LOẠI ================= */
  function candsFor(t, first) {
    var lw = t.stem || t.lw, a = L[lw], r;
    if (t.poss && !t.stem) { return [{ t: 'N', f: 's', pn: 1 }]; }
    if (a) {
      r = a.slice();
      if (t.cap && !first && !r.some(function (c) { return c.t === 'N'; }) && !(L[lw] && L[lw].some(function (c) { return c.t === 'P' || c.t === 'D' || c.t === 'CC' || c.t === 'U' || c.t === 'M' || c.t === 'PS'; }))) r.push({ t: 'N', f: 's', pn: 1 });
      return r;
    }
    if (/^\d/.test(lw)) return [{ t: 'NUM' }, { t: 'N', f: 's', tm: /^\d{4}s?$/.test(lw) ? 1 : 0 }];
    if (t.cap && !first) return [{ t: 'N', f: 's', pn: 1, unk: 1 }];
    r = [];
    if (/ly$/.test(lw) && lw.length > 4) r.push({ t: 'R' });
    else if (/ing$/.test(lw) && lw.length > 5) { r.push({ t: 'V', f: 'g' }); r.push({ t: 'N', f: 's' }); }
    else if (/ed$/.test(lw) && lw.length > 4) { r.push({ t: 'V', f: 'd' }); r.push({ t: 'V', f: 'n' }); r.push({ t: 'J' }); }
    else if (/(tion|sion|ment|ness|ity|ance|ence|ism|ship|hood|ure|ology|ics|ist)$/.test(lw)) r.push({ t: 'N', f: 's' });
    else if (/(tions|sions|ments|nesses|ities|ances|ences|isms|ists)$/.test(lw)) r.push({ t: 'N', f: 'p' });
    else if (/(ous|ive|ful|less|able|ible|al|ic|ical|ary|ish|ent|ant|ile|ial|ular)$/.test(lw)) r.push({ t: 'J' });
    else if (/(ize|ise|ify|ate)$/.test(lw)) { r.push({ t: 'V', f: 'b' }); }
    else if (/(izes|ises|ifies|ates)$/.test(lw)) { r.push({ t: 'V', f: 's' }); r.push({ t: 'N', f: 'p' }); }
    else if (/est$/.test(lw) && lw.length > 5) r.push({ t: 'J' });
    else if (/[a-z]-[a-z]/.test(lw)) { r.push({ t: 'J' }); r.push({ t: 'N', f: 's' }); }
    else if (/ies$/.test(lw) || (/s$/.test(lw) && !/ss$/.test(lw))) { r.push({ t: 'N', f: 'p' }); r.push({ t: 'V', f: 's' }); }
    else { r.push({ t: 'N', f: 's' }); r.push({ t: 'V', f: 'b' }); }
    r.forEach(function (c) { c.unk = 1; });
    return r;
  }

  /* ================= 4. NHÃN VAI TRÒ ================= */
  var ROLES = {
    S: { vi: 'Chủ ngữ', tip: 'Người hoặc vật làm hành động. Là cụm danh từ (hoặc mệnh đề danh từ). Tìm bằng câu hỏi: ai/cái gì + động từ chính?' },
    V: { vi: 'Động từ', tip: 'Động từ chính cùng trợ động từ đi kèm (is, have, can, does...). Mỗi mệnh đề có đúng một nhóm động từ có chia.' },
    O: { vi: 'Tân ngữ', tip: 'Người/vật chịu tác động của động từ. CHỈ là cụm danh từ (hoặc mệnh đề danh từ). Giới từ và động từ thứ hai không nằm trong tân ngữ.' },
    C: { vi: 'Bổ ngữ', tip: 'Phần nói rõ chủ ngữ là gì / thế nào, đứng sau be, seem, become, remain... Có thể là tính từ hoặc cụm danh từ.' },
    A: { vi: 'Trạng ngữ', tip: 'Cho biết nơi chốn, thời gian, cách thức, lý do... Thường là cụm giới từ (in the office) hoặc trạng từ. Bỏ đi câu vẫn đủ.' },
    T: { vi: 'to-V', tip: 'Động từ nguyên mẫu có to (to fade, to reconstruct). Là động từ thứ hai, không phải tân ngữ; nó có tân ngữ riêng.' },
    X: { vi: 'Từ nối', tip: 'Từ nối câu hoặc mở đầu mệnh đề (and, but, that, which, however...). Không phải thành phần chính của câu.' },
    M: { vi: 'Bổ sung', tip: 'Cụm đặt thêm sau dấu phẩy hoặc dấu hai chấm để giải thích (đồng vị, mệnh đề which...). Bỏ ra câu vẫn đủ nghĩa.' }
  };
  var SUBVI = { place: 'nơi chốn', time: 'thời gian', manner: 'cách thức', reason: 'lý do', purpose: 'mục đích', cond: 'điều kiện', concess: 'nhượng bộ', compare: 'so sánh', freq: 'tần suất', degree: 'mức độ', topic: 'chủ đề', comment: 'bình luận', dir: 'hướng/nguồn' };

  function subOfA(a, b, T) {
    var p = T[a].lw, i, hasTime = false;
    for (i = a; i < b; i++) if (!T[i].p && (TIMEW.indexOf(T[i].lw) >= 0 || /^\d{4}s?$/.test(T[i].lw) || (T[i].c && T[i].c.some(function (c) { return c.tm; })))) hasTime = true;
    if (b - a === 1 && L[p] && L[p].some(function (c) { return c.t === 'R'; })) {
      if (FREQW.indexOf(p) >= 0) return 'freq';
      if (/^(now|then|today|yesterday|tomorrow|tonight|soon|later|earlier|already|recently|currently|finally|ago|early|late)$/.test(p)) return 'time';
      if (/^(here|there|home|abroad|away|back|everywhere|nearby|upstairs|downstairs|outside|inside)$/.test(p)) return 'place';
      if (/^(very|too|quite|rather|really|almost|nearly|just|only|even|enough|simply|gradually|considerably)$/.test(p)) return 'degree';
      if (/^(crucially|surprisingly|actually|basically|perhaps|maybe|indeed|overall)$/.test(p)) return 'comment';
      if (/ly$/.test(p)) return 'manner';
      if (/^(well|fast|hard|together|alone)$/.test(p)) return 'manner';
    }
    if (/^(because|due|owing)$/.test(p)) return 'reason';
    if (/^(although|though|whereas|despite)$/.test(p)) return 'concess';
    if (/^(if|unless|provided)$/.test(p)) return 'cond';
    if (/^(than|rather)$/.test(p)) return 'compare';
    if (/^(during|since|until|before|after|while|when|whenever|once|within)$/.test(p) || hasTime && /^(in|at|on|by|for|from|to|over|around)$/.test(p)) return 'time';
    if (/^(in|at|on|under|near|behind|between|among|inside|outside|above|below|beside|over|through|across|around|along|against|throughout)$/.test(p)) return 'place';
    if (/^(from|to|into|onto|toward|towards|off|out)$/.test(p)) return 'dir';
    if (/^(with|without|by|like|as|via)$/.test(p)) return 'manner';
    if (p === 'for') return 'purpose';
    if (p === 'about') return 'topic';
    return '';
  }

  /* ================= 5. PHÂN TÍCH MỘT CÂU ================= */
  function analyzeTokens(T) {
    var n = T.length, limit = n, flags = { ambig: 0, shrink: 0, unk: 0, leftover: 0, fragment: 0 };
    while (limit > 0 && T[limit - 1].p && T[limit - 1].pt === 'final') limit--;
    var question = n > 0 && T[n - 1].pt === 'final' && /\?/.test(T[n - 1].w);
    var firstIdx = 0; while (firstIdx < n && T[firstIdx].p) firstIdx++;
    T.forEach(function (t, i) { if (!t.p) { t.c = candsFor(t, i === firstIdx); if (t.c.some(function (c) { return c.unk; })) flags.unk++; } });

    function LEAF(r, a, b, x) { var o = { k: 'ph', r: r, a: a, b: b }; if (x) for (var q in x) o[q] = x[q]; return o; }
    function CL(r, chip, a, b, kids, x) { var o = { k: 'cl', r: r, chip: chip, a: a, b: b, kids: kids }; if (x) for (var q in x) o[q] = x[q]; return o; }

    function has(i, t) { if (i < 0 || i >= limit || T[i].p) return false; var a = T[i].c; for (var k = 0; k < a.length; k++) if (a[k].t === t) return true; return false; }
    function hasF(i, t, f) { if (i < 0 || i >= limit || T[i].p) return false; var a = T[i].c; for (var k = 0; k < a.length; k++) if (a[k].t === t && a[k].f === f) return true; return false; }
    function cd(i, t, f) { if (i < 0 || i >= limit || T[i].p) return null; var a = T[i].c; for (var k = 0; k < a.length; k++) if (a[k].t === t && (f === undefined || a[k].f === f)) return a[k]; return null; }
    function W(i) { return i >= 0 && i < n && !T[i].p ? (T[i].stem || T[i].lw) : ''; }
    function isW(i, w) { return i < limit && !T[i].p && W(i) === w; }
    function pt(i) { return i < n && T[i].p ? T[i].pt : ''; }
    function lemma(i) { var c = cd(i, 'V'); return c && c.l ? c.l : W(i); }
    function mark(a, b, pos) { for (var i = a; i < b; i++) if (!T[i].p && !T[i].pos) T[i].pos = pos; }
    function markForce(a, b, pos) { for (var i = a; i < b; i++) if (!T[i].p) T[i].pos = pos; }
    function withLimit(l, fn) { var o = limit; limit = l; try { return fn(); } finally { limit = o; } }
    function isNomOnly(i) { return has(i, 'N') && !has(i, 'V') && !has(i, 'J'); }
    function finiteOnly(i) { /* chắc chắn là động từ có chia */ return has(i, 'M') || (has(i, 'BE') && cd(i, 'BE', 'fin')) || (has(i, 'HV') && cd(i, 'HV', 'fin')) || (has(i, 'DO') && cd(i, 'DO', 'fin')) || (has(i, 'V') && !has(i, 'N') && !has(i, 'J') && (hasF(i, 'V', 's') || hasF(i, 'V', 'b') || hasF(i, 'V', 'd') || false) && !hasF(i, 'V', 'g') && !isPluralNoun(i)); }
    function isPluralNoun(i) { return !!cd(i, 'N', 'p'); }
    function connAt(i) {
      if (i >= limit || T[i].p) return 0;
      var lw = W(i), k, m;
      for (k = 0; k < CONN_MULTI.length; k++) { m = CONN_MULTI[k].split(' '); var ok = true; for (var q = 0; q < m.length; q++) if (W(i + q) !== m[q]) { ok = false; break; } if (ok) return m.length; }
      if (CONN.indexOf(lw) >= 0 && (pt(i + 1) === 'comma' || i === firstIdx)) return 1;
      return 0;
    }

    /* ---------- cụm danh từ ---------- */
    function nominalAhead(k) {
      if (k >= limit || T[k].p) return false;
      if (has(k, 'N') || has(k, 'NUM')) return true;
      if (has(k, 'J')) return true;
      /* all the samples, both my parents: từ hạn định đứng sau từ chỉ lượng */
      if ((has(k, 'D') || has(k, 'PS')) && !has(k, 'PO') && (W(k) === 'the' || W(k) === 'these' || W(k) === 'those' || W(k) === 'my' || W(k) === 'your' || W(k) === 'his' || W(k) === 'her' || W(k) === 'our' || W(k) === 'their') && nominalAhead(k + 1)) return true;
      if ((hasF(k, 'V', 'g') || hasF(k, 'V', 'n')) && has(k + 1, 'N')) return true;
      if (has(k, 'R') && (has(k + 1, 'J') || has(k + 1, 'N')) && !has(k, 'PS')) return true;
      return false;
    }
    function npStart(i) {
      if (i >= limit || T[i].p) return false;
      return has(i, 'D') || has(i, 'PS') || has(i, 'PO') || has(i, 'PA') || has(i, 'NUM') || has(i, 'N') || has(i, 'J') || (has(i, 'R') && nominalAhead(i + 1)) || ((hasF(i, 'V', 'g') || hasF(i, 'V', 'n')) && has(i + 1, 'N'));
    }
    function headNum(i) {
      if (/^(people|men|women|children|feet|teeth|mice|police)$/.test(W(i))) return 'pl';
      var c = cd(i, 'N');
      if (!c) return 'sg';
      if (c.f === 'p' && !cd(i, 'N', 's')) return 'pl';
      return 'sg';
    }
    function verbBaseAfter(k) { return k < limit && !T[k].p && (hasF(k, 'V', 'b') || hasF(k, 'M')); }
    function startsComplement(k) {
      if (k >= limit) return false;
      if (T[k].p) return T[k].pt === 'final' || k >= limit;
      return has(k, 'D') || has(k, 'PO') || has(k, 'P') || has(k, 'U') || has(k, 'TO') || has(k, 'R') || has(k, 'NUM') || has(k, 'N') || has(k, 'J') || has(k, 'PA');
    }
    /* quyết định từ vừa có thể là danh từ, vừa là động từ, đứng sau một danh từ đã có: dùng là động từ? */
    function ambigAsVerb(k, num) {
      if (!has(k, 'V')) return false;
      var sForm = hasF(k, 'V', 's') && cd(k, 'N', 'p'), bForm = hasF(k, 'V', 'b');
      if (!sForm && !bForm && !hasF(k, 'V', 'd')) return false;
      /* hình thức -s là số nhiều của danh từ và đứng sau danh từ: ghép danh từ ("lab results show") nếu sau nó là động từ gốc */
      if (sForm && verbBaseAfter(k + 1) && !has(k + 1, 'D')) return false;
      var agree = (sForm && num !== 'pl') || (bForm && num === 'pl') || (hasF(k, 'V', 'd') && !cd(k, 'N', 'p'));
      if (!agree) return false;
      flags.ambig++;
      return startsComplement(k + 1) || pt(k + 1) === 'final' || k + 1 >= limit;
    }
    function adjLike(k) { return k < limit && !T[k].p && (has(k, 'J') || ((hasF(k, 'V', 'g') || hasF(k, 'V', 'n')) && !has(k, 'N') && has(k + 1, 'N')) ); }

    function npCore(i, o) {
      o = o || {};
      if (i >= limit || T[i].p) return null;
      var j = i, head = -1, pron = false, sawAdj = false, dcount = 0;
      var d = cd(i, 'D');
      var qthan = (W(i) === 'more' || W(i) === 'less' || W(i) === 'fewer') && W(i + 1) === 'than' && (has(i + 2, 'D') || has(i + 2, 'NUM'));
      /* đại từ đứng một mình */
      if (!qthan && (has(i, 'PS') || has(i, 'PO') || has(i, 'PA')) && !(has(i, 'NUM') && has(i + 1, 'NUM')) && !(W(i) === 'one' && nominalAhead(i + 1) && !isW(i + 1, 'of') && !finiteStart(i + 1)) && !(d && nominalAhead(i + 1) && !(isW(i + 1, 'of')))) {
        if (!(o.noPron)) {
          var num = /^(i|he|she|it|someone|something|anyone|anything|everyone|everything|nobody|nothing|somebody|everybody|each|one|myself|himself|herself|itself|this|that)$/.test(W(i)) ? 'sg' : 'pl';
          var e = i + 1;
          while (e < limit && has(e, 'PA') && cd(e, 'PA').refl && has(e - 1, 'N')) e++;
          mark(i, i + 1, 'N');
          return { a: i, b: e, end: e, head: i, num: num, pron: true, mods: [] };
        }
      }
      if (!qthan && !d && (has(i, 'PS') || has(i, 'PO')) && !o.noPron && !has(i, 'N')) { mark(i, i + 1, 'N'); return { a: i, b: i + 1, end: i + 1, head: i, num: 'pl', pron: true, mods: [] }; }
      /* "more than", "less than" + số */
      if (qthan) { mark(j, j + 2, 'D'); j += 2; }
      while (j < limit && has(j, 'D') && dcount < 3 && !(dcount > 0 && !has(j, 'D'))) {
        /* "that"/"this" làm từ chỉ định chỉ khi phía sau còn danh từ */
        var dc = cd(j, 'D');
        if ((dc.dem || has(j, 'PA')) && !nominalAhead(j + 1)) break;
        mark(j, j + 1, 'F'); j++; dcount++;
      }
      var lastNoun = -1, mods = 0;
      for (;;) {
        if (j >= limit) break;
        if (T[j].p) {
          /* dấu phẩy giữa hai tính từ: "a single, prolonged session" */
          if (T[j].pt === 'comma' && sawAdj && head < 0 && (adjLike(j + 1) || (has(j + 1, 'R') && adjLike(j + 2)))) { j++; continue; }
          break;
        }
        if (j > i && /^(today|tomorrow|yesterday|tonight)$/.test(W(j))) break;
        var N_ = has(j, 'N') || (head < 0 && (dcount > 0 || sawAdj) && !has(j, 'J') && !has(j, 'M') && (hasF(j, 'V', 'b') || hasF(j, 'V', 's')) && !T[j].p);
        if (N_ && !has(j, 'N')) { T[j].c.push({ t: 'N', f: hasF(j, 'V', 's') ? 'p' : 's', conv: 1 }); }
        if (has(j, 'NUM') && !(N_ && head >= 0 && !has(j, 'NUM'))) {
          if (head >= 0 && !N_) break;
          mark(j, j + 1, 'J'); head = (head < 0 && !(nominalAhead(j + 1))) ? j : head; j++; continue;
        }
        /* trạng từ mức độ + tính từ: "equally powerful", "more recent" */
        if (has(j, 'R') && !N_ && head < 0 && (has(j + 1, 'J') || (has(j + 1, 'R') && has(j + 2, 'J')))) { mark(j, j + 1, 'D'); j++; continue; }
        if (has(j, 'R') && W(j) === 'more' && head < 0 && has(j + 1, 'J')) { j++; continue; }
        if (head >= 0 && has(j, 'J') && !N_ && !(isNomOnly(j))) break;
        if (has(j, 'J') && (!N_ || nominalAhead(j + 1) || (pt(j + 1) === 'comma' && sawAdj !== null && (adjLike(j + 2) || (has(j + 2, 'R') && adjLike(j + 3)))))) {
          if (head >= 0 && !nominalAhead(j + 1) && pt(j + 1) !== 'comma') break;
          if (head >= 0) { /* sau danh từ đầu: tính từ + danh từ nữa không hợp lệ trừ ghép */ if (!N_) break; }
          mark(j, j + 1, 'J'); sawAdj = true; j++; continue;
        }
        if (N_) {
          if (lastNoun >= 0 || head >= 0) {
            /* đã có danh từ: từ này là danh từ ghép hay động từ? */
            if (!T[j].c.some(function (c) { return c.t === 'N'; })) break;
            if (o.subject && ambigAsVerb(j, headNum(lastNoun >= 0 ? lastNoun : head))) break;
            if (hasF(j, 'V', 'd') && !cd(j, 'N') && !T[j].cap) break;
          }
          var noun = cd(j, 'N');
          if (noun.pn || T[j].cap) mark(j, j + 1, 'N'); else mark(j, j + 1, 'N');
          lastNoun = j; head = j; j++; continue;
        }
        /* V-ing / V-ed làm tính từ đứng trước danh từ: "varying intervals" */
        if ((hasF(j, 'V', 'g') || hasF(j, 'V', 'n')) && head < 0 && has(j + 1, 'N') && !has(j + 1, 'V') || (head < 0 && (hasF(j, 'V', 'g') || hasF(j, 'V', 'n')) && nominalAhead(j + 1) && has(j + 1, 'N') && (dcount > 0 || sawAdj))) {
          markForce(j, j + 1, 'F'); sawAdj = true; j++; continue;
        }
        /* danh động từ làm danh từ: "the learning" */
        if (hasF(j, 'V', 'g') && head < 0 && dcount > 0 && !nominalAhead(j + 1)) { mark(j, j + 1, 'N'); head = j; lastNoun = j; j++; continue; }
        break;
      }
      if (head < 0 || (lastNoun < 0 && head >= 0 && !has(head, 'NUM') && !has(head, 'J'))) {
        /* chỉ có từ hạn định + tính từ: "the poor", "the rich" */
        if (head < 0 && sawAdj && dcount > 0 && j - 1 >= i && has(j - 1, 'J')) { head = j - 1; }
        else if (head < 0) return null;
      }
      var b = head + 1;
      /* tính từ đã nuốt sau danh từ cuối cùng không thuộc cụm */
      if (lastNoun >= 0) b = lastNoun + 1;
      /* đại từ nhấn mạnh: the memory itself */
      if (b < limit && !T[b].p && has(b, 'PA') && cd(b, 'PA').refl && b === j) b++;
      return { a: i, b: b, end: b, head: lastNoun >= 0 ? lastNoun : head, num: headNum(lastNoun >= 0 ? lastNoun : head), pron: false, mods: [] };
    }

    /* cụm danh từ đầy đủ: of, giới từ bổ nghĩa, mệnh đề quan hệ, rút gọn */
    function npFull(i, o) {
      o = o || {};
      var np = npCore(i, o);
      if (!np) return null;
      var j = np.end, guard = 0;
      var headLem = W(np.head);
      /* chuỗi "of": nằm trong cụm */
      while (isW(j, 'of') && guard++ < 4) {
        var sub;
        if (has(j + 1, 'U') && cd(j + 1, 'U').wh && !has(j + 1, 'D')) {
          var rc = whClause(j + 1, 'mod');
          if (!rc) break;
          np.mods.push(CL('mod', 'mđ wh', rc.a, rc.end, rc.kids, { pr: o.role })); np.end = j = rc.end; markForce(j - 0, j, 'F'); break;
        }
        sub = npCore(j + 1, { noPron: false });
        if (!sub) break;
        mark(j, j + 1, 'F');
        np.b = sub.b; np.end = sub.b; j = sub.b; headLem = W(sub.head);
        if (np.pron) np.pron = false;
      }
      /* giới từ bổ nghĩa danh từ */
      guard = 0;
      while (j < limit && has(j, 'P') && !isW(j, 'of') && guard++ < 3) {
        var pw = W(j);
        var allow = (o.subject && !np.pron && !has(j, 'V')) || (NPREP[pw] && NPREP[pw][headLem]);
        if (!allow) break;
        if (has(j, 'TO') && !has(j + 1, 'D') && !npStart(j + 1)) break;
        var p = ppParse(j, { allowReduced: o.allowReduced || o.subject, asMod: true, role: o.role });
        if (!p) break;
        p.nodes.forEach(function (nd) { nd.mod = true; nd.pr = o.role; });
        np.mods.push.apply(np.mods, p.nodes); j = p.end; np.end = j;
      }
      /* mệnh đề quan hệ */
      if (j < limit && has(j, 'U') && cd(j, 'U').rel && !o.noRel && !(np.pron && /^(where|when|why|how|whether|if|what|that)$/.test(W(j)))) {
        var rl = relClause(j, o);
        if (rl) { rl.mod = true; rl.pr = o.role; np.mods.push(rl); np.end = j = rl.b; }
      } else if (j < limit && (hasF(j, 'V', 'n') || hasF(j, 'V', 'g')) && !np.pron && (o.allowReduced || o.subject) && !has(j, 'N') && !(hasF(j, 'V', 'g') && !o.subject && !o.allowReduced)) {
        var nf = nonFinite(j, { kind: hasF(j, 'V', 'n') ? 'ed' : 'ing', chip: 'mđ rút gọn' });
        if (nf && (o.allowReduced || (nf.end < limit && finiteStart(nf.end)))) { nf.node.mod = true; nf.node.pr = o.role; np.mods.push(nf.node); np.end = j = nf.end; }
      }
      return np;
    }
    function lookFinite(k) {
      for (var q = k; q < limit; q++) {
        if (T[q].p) { if (T[q].pt === 'comma' || T[q].pt === 'semi') return false; continue; }
        if (has(q, 'M') || (cd(q, 'BE', 'fin')) || (cd(q, 'HV', 'fin')) || (cd(q, 'DO', 'fin'))) return true;
        if (has(q, 'V') && (hasF(q, 'V', 's') || hasF(q, 'V', 'd')) && (!has(q, 'N') || q > k) && q > k) return true;
      }
      return false;
    }
    function pushNP(role, np, kids, x) {
      var leaf = LEAF(role, np.a, np.b, x || null);
      kids.push(leaf);
      np.mods.forEach(function (m) { kids.push(m); });
      return leaf;
    }

    /* ---------- giới từ + cụm ---------- */
    function ppParse(i, o) {
      o = o || {};
      var p = W(i), j = i + 1;
      mark(i, i + 1, 'F');
      if (p === 'than') {
        if (j < limit && !T[j].p && has(j, 'R') && !npStart(j) ) { mark(j, j + 1, 'D'); return { nodes: [LEAF('A', i, j + 1, { sub: 'compare' })], end: j + 1 }; }
        if (j < limit && hasF(j, 'V', 'g')) { var nf0 = nonFinite(j, { kind: 'ing', chip: 'than + V-ing' }); if (nf0) return { nodes: [CL('A', 'so sánh · V-ing', i, nf0.end, nf0.node.kids, { sub: 'compare' })], end: nf0.end }; }
      }
      if (j < limit && hasF(j, 'V', 'g') && !(ING_ADJ.indexOf(W(j)) >= 0 && has(j + 1, 'N')) && !(has(j, 'N') && !(npStart(j + 1) && !(has(j + 1, 'U') && cd(j + 1, 'U').rel)))) {
        var nf = nonFinite(j, { kind: 'ing', chip: 'giới từ + V-ing' });
        if (nf) return { nodes: [CL(o.asMod ? 'mod' : 'A', 'giới từ + V-ing', i, nf.end, nf.node.kids, { sub: subOfA(i, nf.end, T) })], end: nf.end };
      }
      if (j < limit && has(j, 'U') && cd(j, 'U').wh && !has(j, 'D')) {
        var wc = whClause(j, 'A');
        if (wc) return { nodes: [CL(o.asMod ? 'mod' : 'A', 'giới từ + mđ wh', i, wc.end, wc.kids, { sub: '' })], end: wc.end };
      }
      var np = npFull(j, { allowReduced: o.allowReduced, role: 'A', noRel: o.noRel });
      if (!np) return null;
      /* between oil and water, in the lab and the office */
      if (!np.mods.length && np.end < limit && (isW(np.end, 'and') || isW(np.end, 'or')) && npStart(np.end + 1) && !subjectStarts(np.end + 1) && !finiteStart(np.end + 1)) {
        var np2 = npFull(np.end + 1, { allowReduced: false, role: 'A' });
        if (np2) { np.b = np2.b; np.end = np2.end; np.mods = np2.mods; mark(np.b - 1, np.b, 'N'); }
      }
      var nodes = [LEAF(o.asMod ? 'mod' : 'A', i, np.b, { sub: o.asMod ? '' : subOfA(i, np.b, T) })];
      np.mods.forEach(function (m) { nodes.push(m); });
      return { nodes: nodes, end: np.end };
    }

    /* ---------- mệnh đề quan hệ ---------- */
    function relClause(i, o) {
      var kids = [], j = i + 1;
      kids.push(LEAF('X', i, i + 1));
      mark(i, i + 1, 'F');
      var k = j;
      while (k < limit && has(k, 'R') && !has(k, 'N')) k++;
      var gap = vgAt(k);
      var ctx = { kind: 'rel', stopComma: true };
      if (gap) {
        /* chủ ngữ bị khuyết: which are not revisited */
        var r = clauseBody(j, ctx, true);
        if (!r) return null;
        r.kids.forEach(function (q) { kids.push(q); });
        return CL('rel', 'mđ quan hệ', i, r.end, kids);
      }
      var r2 = clauseBody(j, ctx, false);
      if (!r2) return null;
      r2.kids.forEach(function (q) { kids.push(q); });
      return CL('rel', 'mđ quan hệ', i, r2.end, kids);
    }

    /* ---------- mệnh đề danh từ: that / wh ---------- */
    function whClause(i, role) {
      var kids = [], j = i;
      var u = cd(i, 'U');
      if (!u || !u.wh) return null;
      var wa = j; j++;
      /* how much, how many, what time... */
      if (W(wa) === 'how' && j < limit && (WH_ADJ.indexOf(W(j)) >= 0)) j++;
      else if ((W(wa) === 'what' || W(wa) === 'which' || W(wa) === 'whose') && j < limit && nominalAhead(j) && !has(j, 'PS') && !(has(j, 'N') && finiteOnly(j))) {
        var npw = npCore(j, { noPron: true }); if (npw && (!vgAt(j) || (has(j, 'N') && subjectStarts(j + 1)))) j = npw.end;
      }
      mark(wa, j, 'F');
      var k = j;
      while (k < limit && has(k, 'R') && !has(k, 'N')) k++;
      var gapSubj = !!vgAt(k);
      var r = clauseBody(j, { kind: 'nom', stopComma: true }, gapSubj);
      if (!r) return null;
      kids.push(LEAF(gapSubj ? 'S' : 'X', wa, j, gapSubj ? { note: 'từ để hỏi làm chủ ngữ' } : { note: 'từ để hỏi / nối' }));
      r.kids.forEach(function (q) { kids.push(q); });
      return { a: i, end: r.end, kids: kids };
    }
    function thatClause(i, ctx) {
      var kids = [LEAF('X', i, i + 1)];
      mark(i, i + 1, 'F');
      var r = clauseBody(i + 1, { kind: 'that', stopComma: !!(ctx && ctx.stopComma) }, false);
      if (!r) return null;
      r.kids.forEach(function (q) { kids.push(q); });
      return { a: i, end: r.end, kids: kids };
    }

    /* ---------- nhóm động từ ---------- */
    function nextVerbal(k) {
      while (k < limit && !T[k].p && (has(k, 'NEG') || (has(k, 'R') && !has(k, 'V') && !has(k, 'N') && !has(k, 'J') && !has(k, 'P')))) k++;
      return k < limit && !T[k].p ? k : -1;
    }
    function isPartAdj(k) { return PARTADJ.indexOf(W(k)) >= 0; }
    function vgAt(i) { return vg(i, { probe: true }); }
    function vg(i, o) {
      o = o || {};
      var j = i, segs = [], segStart = -1, advs = [], need = o.need || 'fin', main = -1, hasAux = !!o.hasAux, neg = false, passive = false, perfect = false, mainTag = null, guard = 0;
      function open(k) { if (segStart < 0) segStart = k; }
      function close(k) { if (segStart >= 0) { segs.push([segStart, k]); segStart = -1; } }
      while (j < limit && guard++ < 10) {
        if (T[j].p) break;
        if (has(j, 'NEG') && (hasAux || need !== 'fin')) { open(j); neg = true; j++; continue; }
        if (has(j, 'NEG')) break;
        if ((hasAux || need !== 'fin') && main < 0 && has(j, 'R') && !has(j, 'V') && !has(j, 'M') && !has(j, 'BE') && !has(j, 'HV') && !has(j, 'DO')) { close(j); advs.push(j); j++; continue; }
        var nv, c;
        if (need === 'fin') {
          if (has(j, 'M')) { open(j); hasAux = true; need = 'b'; if (cd(j, 'M').neg) neg = true; j++; continue; }
          if (cd(j, 'DO', 'fin')) {
            nv = nextVerbal(j + 1);
            if (nv >= 0 && (hasF(nv, 'V', 'b') || cd(nv, 'HV', 'b') || cd(nv, 'BE', 'b')) || (j + 1 < limit && has(j + 1, 'NEG'))) { open(j); hasAux = true; need = 'b'; j++; continue; }
            if (o.inv) { open(j); hasAux = true; need = 'b'; j++; continue; }
            open(j); main = j; mainTag = 'DO'; j++; break;
          }
          if (cd(j, 'HV', 'fin')) {
            nv = nextVerbal(j + 1);
            if (nv >= 0 && (hasF(nv, 'V', 'n') || cd(nv, 'BE', 'n')) && !(has(j + 1, 'NEG') && false)) { open(j); hasAux = true; need = 'n'; perfect = true; j++; continue; }
            open(j); main = j; mainTag = 'HV'; j++; break;
          }
          if (cd(j, 'BE', 'fin')) {
            nv = nextVerbal(j + 1);
            if (nv >= 0 && hasF(nv, 'V', 'g') && !isPartAdj(nv) && !(GERUND_N.indexOf(W(nv)) >= 0 && !nominalAfterG(nv))) { open(j); hasAux = true; need = 'g'; j++; continue; }
            if (nv >= 0 && hasF(nv, 'V', 'n') && !isPartAdj(nv) && !(has(nv, 'J') && !(finiteOnly(nv) === false && false) && !passiveOK(nv))) { open(j); hasAux = true; need = 'n'; passive = true; j++; continue; }
            open(j); main = j; mainTag = 'BE'; j++; break;
          }
          if (has(j, 'V') && (hasF(j, 'V', 'b') || hasF(j, 'V', 's') || hasF(j, 'V', 'd'))) {
            if (o.probe && has(j, 'N') && !hasF(j, 'V', 's') && !hasF(j, 'V', 'd') && !o.subjGap) { /* thăm dò: từ vừa danh từ vừa động từ gốc */ }
            open(j); main = j; mainTag = 'V'; j++; break;
          }
          break;
        }
        if (need === 'b') {
          if (cd(j, 'BE', 'b')) {
            nv = nextVerbal(j + 1);
            if (nv >= 0 && hasF(nv, 'V', 'g') && !isPartAdj(nv)) { open(j); need = 'g'; j++; continue; }
            if (nv >= 0 && hasF(nv, 'V', 'n') && !isPartAdj(nv)) { open(j); need = 'n'; passive = true; j++; continue; }
            open(j); main = j; mainTag = 'BE'; j++; break;
          }
          if (cd(j, 'HV', 'b')) {
            nv = nextVerbal(j + 1);
            if (nv >= 0 && (hasF(nv, 'V', 'n') || cd(nv, 'BE', 'n'))) { open(j); need = 'n'; perfect = true; j++; continue; }
            open(j); main = j; mainTag = 'HV'; j++; break;
          }
          if (cd(j, 'DO', 'b')) { open(j); main = j; mainTag = 'DO'; j++; break; }
          if (hasF(j, 'V', 'b')) { open(j); main = j; mainTag = 'V'; j++; break; }
          break;
        }
        if (need === 'n') {
          if (cd(j, 'BE', 'n')) {
            nv = nextVerbal(j + 1);
            if (nv >= 0 && hasF(nv, 'V', 'g') && !isPartAdj(nv)) { open(j); need = 'g'; j++; continue; }
            if (nv >= 0 && hasF(nv, 'V', 'n') && !isPartAdj(nv)) { open(j); need = 'n'; passive = true; j++; continue; }
            open(j); main = j; mainTag = 'BE'; j++; break;
          }
          if (hasF(j, 'V', 'n')) { open(j); main = j; mainTag = 'V'; j++; break; }
          if (cd(j, 'DO', 'n')) { open(j); main = j; mainTag = 'DO'; j++; break; }
          break;
        }
        if (need === 'g') {
          if (hasF(j, 'V', 'g')) { open(j); main = j; mainTag = 'V'; j++; break; }
          if (cd(j, 'BE', 'g')) { nv = nextVerbal(j + 1); if (nv >= 0 && hasF(nv, 'V', 'n')) { open(j); need = 'n'; passive = true; j++; continue; } }
          break;
        }
        break;
      }
      if (main < 0 && hasAux && segStart >= 0) {
        /* trợ động từ đứng một mình (đã mở đoạn): coi trợ động từ cuối là động từ chính */
        var lastTok = j - 1; while (lastTok >= i && (T[lastTok].p || has(lastTok, 'NEG'))) lastTok--;
        if (lastTok >= i && !advs.length || lastTok >= i) { main = lastTok; mainTag = has(lastTok, 'BE') ? 'BE' : (has(lastTok, 'HV') ? 'HV' : (has(lastTok, 'DO') ? 'DO' : 'AUX')); }
      }
      if (main < 0) return null;
      var endTok = j;
      /* phủ định đứng ngay sau động từ chính: is not, were not */
      if (j < limit && has(j, 'NEG') && (mainTag === 'BE' || mainTag === 'HV' || mainTag === 'DO' || mainTag === 'AUX')) { j++; endTok = j; neg = true; }
      close(endTok);
      var lem = mainTag === 'V' ? lemma(main) : (mainTag === 'BE' ? 'be' : (mainTag === 'HV' ? 'have' : (mainTag === 'DO' ? 'do' : W(main))));
      /* tiểu từ của cụm động từ: levels off, give up */
      var part = -1;
      if (!o.probe && j < limit && !T[j].p && PARTICLES.indexOf(W(j)) >= 0 && mainTag === 'V') {
        var after = j + 1;
        if (after >= limit || T[after].p || !npStart(after) || has(after, 'PO') || has(after, 'D') || (hasF(after, 'V', 'g') && /^(give|cut|turn|take|put|end|break)$/.test(lem))) { part = j; segs[segs.length - 1][1] = j + 1; endTok = j + 1; }
      }
      var linking = mainTag === 'BE' || (mainTag === 'V' && !passive && (LINK_ONLY.indexOf(lem) >= 0 || (LINK_SEMI.indexOf(lem) >= 0 && endTok < limit && !T[endTok].p && (has(endTok, 'J') || (has(endTok, 'R') && has(endTok + 1, 'J'))) && !has(endTok, 'N'))));
      var strongLink = mainTag === 'BE' || (mainTag === 'V' && LINK_ONLY.indexOf(lem) >= 0);
      if (!o.probe) {
        segs.forEach(function (s) { markForce(s[0], s[1], 'V'); });
        advs.forEach(function (a) { markForce(a, a + 1, 'D'); });
      }
      return { segs: segs, advs: advs, main: main, end: endTok, lem: lem, linking: linking, strongLink: strongLink, passive: passive, neg: neg, tag: mainTag, form: cd(main, 'V') ? (T[main].c.filter(function (c) { return c.t === 'V'; })[0].f) : 'fin' };
    }
    function nominalAfterG(k) { return nominalAhead(k + 1) || (k + 1 < limit && !T[k + 1].p && has(k + 1, 'D')); }
    function passiveOK(k) { return true; }

    function pushVG(v, kids, extra) {
      v.segs.forEach(function (s, idx) { kids.push(LEAF('V', s[0], s[1], extra && idx === 0 ? extra : null)); });
      v.advs.forEach(function (a) { kids.push(LEAF('A', a, a + 1, { sub: subOfA(a, a + 1, T) })); });
    }

    /* ---------- nhóm không chia: to V, V-ing, V-ed ---------- */
    function nonFinite(i, o) {
      o = o || {};
      var kids = [], j = i;
      var toTok = -1;
      if (o.kind === 'inf' || (has(j, 'TO') && o.kind !== 'ing' && o.kind !== 'ed')) {
        if (!has(j, 'TO')) return null;
        toTok = j; mark(j, j + 1, 'F'); j++;
        o.kind = 'inf';
      }
      var advs = [];
      while (j < limit && has(j, 'R') && !has(j, 'V') && !has(j, 'N')) { advs.push(j); j++; }
      var v = null, vi = j;
      if (o.kind === 'inf') {
        if (hasF(j, 'V', 'b') || cd(j, 'BE', 'b') || cd(j, 'HV', 'b') || cd(j, 'DO', 'b')) { v = { s: toTok, e: j + 1, lem: lemma(j), tag: has(j, 'BE') && !has(j, 'V') ? 'BE' : 'V', tok: j }; }
        /* to have been ..., to be + V-ed */
        if (v && (cd(j, 'BE', 'b') || cd(j, 'HV', 'b'))) {
          var nv = nextVerbal(j + 1);
          if (nv >= 0 && (hasF(nv, 'V', 'n') || hasF(nv, 'V', 'g') || cd(nv, 'BE', 'n'))) { v.e = nv + 1; v.tok = nv; v.lem = lemma(nv); v.tag = 'V'; }
          else if (cd(j, 'BE', 'b')) v.tag = 'BE';
        }
      } else if (o.kind === 'ing') {
        if (hasF(j, 'V', 'g') || cd(j, 'BE', 'g') || cd(j, 'HV', 'g')) {
          v = { s: j, e: j + 1, lem: lemma(j), tag: 'V', tok: j };
          if ((cd(j, 'HV', 'g') || cd(j, 'BE', 'g')) && !has(j, 'V')) {
            var nv2 = nextVerbal(j + 1);
            if (nv2 >= 0 && hasF(nv2, 'V', 'n')) { v.e = nv2 + 1; v.tok = nv2; v.lem = lemma(nv2); }
            else if (cd(j, 'BE', 'g')) v.tag = 'BE';
          }
        }
      } else if (o.kind === 'ed') {
        if (hasF(j, 'V', 'n')) v = { s: j, e: j + 1, lem: lemma(j), tag: 'V', tok: j };
      }
      if (!v) return null;
      if (advs.length) { kids.push(LEAF('A', advs[0], advs[advs.length - 1] + 1, { sub: subOfA(advs[0], advs[advs.length - 1] + 1, T) })); markForce(advs[0], advs[advs.length - 1] + 1, 'D'); }
      if (o.kind === 'inf') kids.push(LEAF('T', v.s, v.e, { note: 'to + động từ nguyên mẫu' })); else kids.push(LEAF('V', v.s, v.e, { note: o.kind === 'ing' ? 'V-ing' : 'V-ed (phân từ)' }));
      markForce(v.s, v.e, 'V'); if (o.kind === 'inf') markForce(v.s, v.s + 1, 'F');
      j = v.e;
      var lemv = v.lem, linking = v.tag === 'BE' || LINK_ONLY.indexOf(lemv) >= 0;
      var vinfo = { lem: lemv, linking: linking, strongLink: linking, passive: o.kind === 'ed', tag: v.tag, nonfinite: true };
      var st = post(j, vinfo, kids, { kind: o.kind === 'inf' ? 'inf' : 'nf', stopComma: true, noAdv: !!o.noAdv });
      var endj = st;
      var a0 = i;
      return { node: CL(o.role || 'inf', o.chip || (o.kind === 'inf' ? 'to-V' : (o.kind === 'ing' ? 'V-ing' : 'V-ed')), a0, endj, kids, { sub: o.sub || '' }), end: endj, kids: kids };
    }

    /* ---------- phần sau động từ ---------- */
    function coordOK(ctx) { return ctx.kind === 'main' || ctx.kind === 'that' || ctx.kind === 'sub' || ctx.kind === 'nom'; }
    function post(j, V, kids, ctx) {
      var haveObj = false, haveComp = false, guard = 0, lastWasObj = false, nObj = 0;
      var ditrans = DITRANS.indexOf(V.lem) >= 0;
      while (j < limit && guard++ < 80) {
        var t = T[j];
        if (t.p) {
          if (t.pt === 'comma') {
            var r = afterComma(j, kids, ctx, V);
            if (r < 0) break;
            j = r; continue;
          }
          if (t.pt === 'colon' || t.pt === 'dash') {
            var np0 = (j + 1 < limit && npStart(j + 1)) ? npFull(j + 1, { role: 'M' }) : null;
            if (np0 && (np0.end >= limit || T[np0.end].p) && !vgAtNp(np0)) { var lf = LEAF('M', np0.a, np0.b); kids.push(lf); np0.mods.forEach(function (m) { kids.push(m); }); j = np0.end; continue; }
            break;
          }
          if (t.pt === 'open') {
            /* (ghi chú trong ngoặc): bỏ qua cả cụm, không gán nhãn */
            var cl = j + 1; while (cl < limit && !(T[cl].p && T[cl].pt === 'close')) cl++;
            j = Math.min(cl + 1, limit); continue;
          }
          break;
        }
        /* nối: and, but, or */
        if (has(j, 'CC') && !has(j, 'U')) {
          var rr = coordinate(j, V, kids, ctx, { haveObj: haveObj, haveComp: haveComp });
          if (rr) { if (rr.V) { V = rr.V; haveObj = false; haveComp = false; nObj = 0; ditrans = DITRANS.indexOf(V.lem) >= 0; } else if (rr.flagObj !== undefined) { haveObj = rr.flagObj; haveComp = rr.flagComp; } j = rr.end; continue; }
          break;
        }
        /* bỏ qua mệnh đề trạng ngữ mở bằng từ phụ thuộc sau động từ */
        /* mệnh đề that / wh */
        if (has(j, 'U') && (!haveObj || (nObj === 1 && /^(ask|tell|show|teach|inform|remind|warn|promise)$/.test(V.lem))) && !haveComp) {
          var u = cd(j, 'U');
          if (isW(j, 'that') && (THINK.indexOf(V.lem) >= 0 || V.strongLink || (haveObj && /^(tell|inform|remind|warn|promise|show|teach)$/.test(V.lem))) && thatOK(j)) {
            var tc = thatClause(j, ctx);
            if (tc) { kids.push(CL(V.linking ? 'C' : 'O', 'mđ that', tc.a, tc.end, tc.kids)); j = tc.end; if (V.linking) haveComp = true; else haveObj = true; continue; }
          }
          var okWh = u.wh && !has(j, 'D') && (!/^(when|where)$/.test(W(j)) || /^(know|ask|wonder|tell|show|decide|explain|understand|remember|forget|check|learn|see|depend)$/.test(V.lem)) || (isW(j, 'if') && /^(know|ask|wonder|see|check|tell|decide)$/.test(V.lem)) || isW(j, 'whether');
          if (okWh) {
            var wc = whClause(j, V.linking ? 'C' : 'O');
            if (wc) { kids.push(CL(V.linking ? 'C' : 'O', 'mđ ' + W(j), wc.a, wc.end, wc.kids)); j = wc.end; if (V.linking) haveComp = true; else haveObj = true; continue; }
          }
        }
        /* mệnh đề that bị lược sau động từ suy nghĩ: "I think he is right" */
        if (!haveObj && !haveComp && !V.linking && !V.nonfinite && THINK.indexOf(V.lem) >= 0 && (has(j, 'PS') && !has(j, 'PO') || (npStart(j) && bareClauseAhead(j)))) {
          var bc = clauseBody(j, { kind: 'that', stopComma: !!ctx.stopComma }, false);
          if (bc && bc.hasV) { kids.push(CL('O', 'mđ (that bị lược)', j, bc.end, bc.kids)); j = bc.end; haveObj = true; continue; }
        }
        /* to + V */
        if (has(j, 'TO') && nextIsBase(j + 1)) {
          var comp = (TO_COMP.indexOf(V.lem) >= 0 || (V.linking && V.passive) || (V.tag === 'BE' && false) || (haveObj && /^(want|ask|tell|allow|force|encourage|advise|help|compel|enable|require|invite|remind|urge|permit|cause|expect|get|have|order)$/.test(V.lem)) || (V.linking && !V.strongLink) || V.strongLink && V.lem !== 'be') ;
          var nf = nonFinite(j, { kind: 'inf', chip: 'to-V', role: 'T', sub: comp ? '' : 'purpose' });
          if (nf) {
            var nfn = nf.node; if (!comp) nfn.note = 'chỉ mục đích';
            kids.push(nfn); j = nf.end; if (comp) { if (V.linking) haveComp = true; else if (!haveObj) haveObj = true; }
            continue;
          }
        }
        /* V-ing làm tân ngữ: enjoy reading */
        if (hasF(j, 'V', 'g') && !haveObj && !V.linking && ING_COMP.indexOf(V.lem) >= 0) {
          var ng = nonFinite(j, { kind: 'ing', chip: 'V-ing', role: 'O' });
          if (ng) { kids.push(ng.node); j = ng.end; haveObj = true; continue; }
        }
        if (isW(j, 'than')) { var pp1 = ppParse(j, {}); if (pp1) { pp1.nodes.forEach(function (q) { kids.push(q); }); j = pp1.end; continue; } break; }
        if (isW(j, 'rather') && isW(j + 1, 'than')) { var rt = ratherThan(j); if (rt) { kids.push(rt.node); (rt.extra || []).forEach(function (e) { kids.push(e); }); j = rt.end; continue; } }
        /* please ở cuối câu / sau dấu phẩy: từ lịch sự, không thuộc cấu trúc */
        if (W(j) === 'please' && (pt(j - 1) === 'comma' || j + 1 >= limit || T[j + 1].p)) { kids.push(LEAF('X', j, j + 1, { note: 'từ lịch sự' })); mark(j, j + 1, 'F'); j++; continue; }
        /* next door: trạng ngữ nơi chốn */
        if (W(j) === 'next' && W(j + 1) === 'door') { kids.push(LEAF('A', j, j + 2, { sub: 'place' })); mark(j, j + 1, 'J'); mark(j + 1, j + 2, 'N'); j += 2; continue; }
        /* today, tomorrow...: trạng ngữ thời gian */
        if (/^(today|tomorrow|yesterday|tonight)$/.test(W(j)) && !(npStart(j + 1) && has(j + 1, 'N') && !T[j + 1].p && false)) { var te = j + 1; if (/^(morning|afternoon|evening|night)$/.test(W(te)) && /^(yesterday|tomorrow|today)$/.test(W(j))) te++; markForce(j, te, 'D'); kids.push(LEAF('A', j, te, { sub: 'time' })); j = te; continue; }
        /* trạng từ */
        if (has(j, 'R') && !(has(j, 'D') && (nominalAhead(j + 1) || W(j + 1) === 'than')) && !(npStart(j) && has(j + 1, 'J') && !has(j, 'V') && (V.linking ? !haveComp : !haveObj)) && !(has(j, 'P') && npStart(j + 1) && !has(j + 1, 'R')) && !(has(j, 'N') && npStart(j) && !V.linking && !haveObj && false) && !(V.linking && !haveComp && adjpAt(j))) {
          var rj = j;
          if (!(has(j, 'D') && nominalAhead(j + 1) && !has(j + 1, 'R') && has(j + 1, 'N') && !haveObj && false)) {
            while (rj < limit && has(rj, 'R') && !T[rj].p && !(rj > j && (finiteStart(rj) || (has(rj, 'P') && npStart(rj + 1))))) rj++;
            if (rj === j) rj = j + 1;
            /* "than before" cụm so sánh: xử lý ở P */
            markForce(j, rj, 'D');
            kids.push(LEAF('A', j, rj, { sub: subOfA(j, rj, T) })); j = rj; continue;
          }
        }
        /* liên từ phụ thuộc (trạng ngữ) */
        if (has(j, 'U') && cd(j, 'U').adv && !ctx.noAdv && advClauseAt(j)) {
          var ac = advClause(j, ctx);
          if (ac) { kids.push(ac.node); j = ac.end; continue; }
        }
        /* giới từ */
        if (has(j, 'P') && !(has(j, 'TO') && nextIsBase(j + 1) && !npStart(j + 1))) {
          var pp = ppParse(j, { allowReduced: false });
          if (pp) {
            /* "of" lạc: gắn làm bổ nghĩa, không phải trạng ngữ */
            if (isW(j, 'of')) pp.nodes[0].r = 'mod';
            pp.nodes.forEach(function (q) { kids.push(q); }); j = pp.end; continue;
          }
          break;
        }
        /* V-ing phía sau tân ngữ: using laser diffraction */
        if (hasF(j, 'V', 'g') && !cd(j, 'BE', 'g') && !V.linking && haveObj && !has(j, 'N') || (hasF(j, 'V', 'g') && !V.linking && haveObj && npStart(j + 1) && !ING_ADJ.indexOf(W(j)) < 0)) {
          var pg = nonFinite(j, { kind: 'ing', chip: 'V-ing (cách thức)', role: 'A', sub: 'manner' });
          if (pg) { kids.push(pg.node); j = pg.end; continue; }
        }
        /* tính từ / cụm tính từ làm bổ ngữ */
        if ((V.linking || ((V.passive || /^(keep|make|find|leave|consider|prove|render)$/.test(V.lem)) && has(j, 'J') && !has(j, 'N'))) && !haveComp && adjpAt(j)) {
          var ap = adjp(j);
          if (ap) {
            kids.push(LEAF('C', ap.a, ap.b)); markForce(ap.a, ap.b, 'J'); j = ap.b; haveComp = true;
            /* tính từ + to V: easy to learn */
            continue;
          }
        }
        /* cụm danh từ */
        if (npStart(j)) {
          if (V.linking && !haveComp && !(V.tag === 'BE' && V.passive)) {
            var np = npFull(j, { role: 'C', allowReduced: false });
            if (np) { var isTime = timeNP(np); if (isTime && V.tag !== 'BE') { kids.push(LEAF('A', np.a, np.b, { sub: 'time' })); } else pushNP('C', np, kids); j = np.end; haveComp = true; continue; }
          }
          if (!V.linking && !haveObj) {
            /* người + vật: give me a book */
            var np2 = npFull(j, { role: 'O', allowReduced: false });
            if (np2) {
              if (timeNP(np2) && /^(every|each|last|next|this|that)$/.test(W(np2.a)) ) { kids.push(LEAF('A', np2.a, np2.b, { sub: 'time' })); j = np2.end; continue; }
              /* a year ago, two days ago: trạng ngữ thời gian */
              if (isW(np2.end, 'ago') && timeNP(np2)) { markForce(np2.a, np2.end + 1, 'D'); kids.push(LEAF('A', np2.a, np2.end + 1, { sub: 'time' })); j = np2.end + 1; continue; }
              /* a lot, a bit, a little: trạng ngữ mức độ/tần suất, không phải tân ngữ */
              if (np2.b - np2.a === 2 && W(np2.a) === 'a' && /^(lot|bit)$/.test(W(np2.a + 1)) && !isW(np2.b, 'of')) { markForce(np2.a, np2.b, 'D'); kids.push(LEAF('A', np2.a, np2.b, { sub: 'degree' })); j = np2.end; continue; }
              var ocv = OC_VERBS.indexOf(V.lem) >= 0 && !V.passive;
              /* elected Maria president / named the baby Anna: tách tân ngữ và bổ ngữ của tân ngữ */
              if (ocv && !np2.pron && np2.mods.length === 0 && np2.b - np2.a >= 2) {
                var nl = np2.b - 1, firstCap = T[np2.a].cap && !has(np2.a, 'D') && np2.b - np2.a === 2, lastCap = T[nl].cap && nl > np2.a + 1 && has(np2.a, 'D');
                if (firstCap || lastCap) {
                  var cut = firstCap ? np2.a + 1 : nl;
                  kids.push(LEAF('O', np2.a, cut)); kids.push(LEAF('C', cut, np2.b, { note: 'bổ ngữ của tân ngữ' }));
                  j = np2.end; haveObj = true; haveComp = true; nObj = 1; continue;
                }
              }
              pushNP('O', np2, kids); j = np2.end; haveObj = true; nObj = 1;
              /* tân ngữ thứ hai */
              if (ditrans || ocv || np2.pron && has(np2.a, 'PO') && !has(np2.a, 'PS')) {
                if (j < limit && npStart(j) && !has(j, 'P') && !(T[j].p) && !has(j, 'PS') && !has(j, 'R') && !vgAt(j) && !(has(j, 'U') && (isW(j, 'that') ? thatOK(j) : cd(j, 'U').wh)) || (j < limit && has(j, 'D') && (ditrans || ocv) && !(isW(j, 'that') && thatOK(j) && !(nominalAhead(j + 1) && !has(j + 1, 'D'))))) {
                  var np3 = npFull(j, { role: ocv ? 'C' : 'O' });
                  if (np3 && isW(np3.end, 'ago') && timeNP(np3)) { markForce(np3.a, np3.end + 1, 'D'); kids.push(LEAF('A', np3.a, np3.end + 1, { sub: 'time' })); j = np3.end + 1; }
                  else if (np3) { if (ocv) { pushNP('C', np3, kids, { note: 'bổ ngữ của tân ngữ' }); haveComp = true; } else pushNP('O', np3, kids); j = np3.end; }
                }
              }
              continue;
            }
          }
          if (!V.linking && haveObj && !lastWasObj) {
            /* "make it easy", "call him John": bổ ngữ của tân ngữ ít gặp: không đoán */
          }
          /* NP thời gian đứng một mình sau tân ngữ/bổ ngữ: A */
          var np4 = npFull(j, { role: 'A' });
          if (np4 && isW(np4.end, 'ago') && timeNP(np4)) { markForce(np4.a, np4.end + 1, 'D'); kids.push(LEAF('A', np4.a, np4.end + 1, { sub: 'time' })); j = np4.end + 1; continue; }
          if (np4 && timeNP(np4) && /^(every|each|last|next|this|that|one|two|three|\d)/.test(W(np4.a))) { kids.push(LEAF('A', np4.a, np4.b, { sub: 'time' })); j = np4.end; continue; }
          break;
        }
        break;
      }
      return j;
    }
    function vgAtNp(np) { return np && np.end < limit && !!vgAt(np.end); }
    function thatOK(j) {
      /* "that" là liên từ nếu sau đó có mệnh đề: danh từ/đại từ + động từ */
      return subjectStarts(j + 1) || !!vgAt(j + 1);
    }
    function bareClauseAhead(j) { return subjectStarts(j); }
    function finiteStart(k) { return k < limit && (has(k, 'M') || cd(k, 'BE', 'fin') || cd(k, 'HV', 'fin') || cd(k, 'DO', 'fin') || (has(k, 'V') && (hasF(k, 'V', 's') || hasF(k, 'V', 'd') || hasF(k, 'V', 'b')) && !has(k, 'N'))); }
    function nextIsBase(k) { return k < limit && !T[k].p && (hasF(k, 'V', 'b') || cd(k, 'BE', 'b') || cd(k, 'HV', 'b') || cd(k, 'DO', 'b')) && !(has(k, 'D')); }
    function timeNP(np) { for (var i = np.a; i < np.b; i++) if (!T[i].p && (TIMEW.indexOf(W(i)) >= 0 || /^\d{4}s?$/.test(W(i)))) return true; return false; }
    function adjpAt(k) {
      if (k >= limit || T[k].p) return false;
      var q = k;
      while (q < limit && has(q, 'R') && !has(q, 'J') && !has(q, 'N')) q++;
      if (q === k && has(k, 'R') && !has(k, 'J')) return false;
      if (q >= limit || T[q].p) return false;
      if (has(q, 'J')) {
        /* tính từ + danh từ: "is a good ..." không xảy ra vì có a; "is good coffee" khá hiếm -> coi là tính từ nếu sau không có danh từ */
        if (has(q + 1, 'N') && !has(q, 'N') && !has(q + 1, 'V') && !(has(q + 1, 'P')) && !/^(today|tomorrow|yesterday|tonight)$/.test(W(q + 1))) { return false; }
        return true;
      }
      if (hasF(q, 'V', 'n') && (isPartAdj(q) || q > k || (!has(q, 'N')))) return !(q === k && !isPartAdj(q) && !has(q, 'J') && false);
      return false;
    }
    function adjp(k) {
      var q = k;
      while (q < limit && has(q, 'R') && !has(q, 'J')) q++;
      if (q >= limit) return null;
      if (!(has(q, 'J') || hasF(q, 'V', 'n'))) return null;
      markForce(k, q, 'D');
      return { a: k, b: q + 1 };
    }
    /* "rather than" */
    function ratherThan(j) {
      var kids = [];
      var k = j + 2;
      var nf;
      var advs = [];
      while (k < limit && has(k, 'R') && !has(k, 'V')) { advs.push(k); k++; }
      if (hasF(k, 'V', 'g')) nf = nonFinite(k, { kind: 'ing', chip: 'V-ing' });
      if (nf) {
        var inner = []; advs.forEach(function (a) { inner.push(LEAF('A', a, a + 1, { sub: subOfA(a, a + 1, T) })); markForce(a, a + 1, 'D'); });
        nf.node.kids.forEach(function (q) { inner.push(q); });
        return { node: CL('A', 'rather than + V-ing', j, nf.end, inner, { sub: 'compare' }), end: nf.end };
      }
      var np = npFull(j + 2, { role: 'A' });
      if (np) { var nodes = LEAF('A', j, np.b, { sub: 'compare' }); return { node: nodes, end: np.end, extra: np.mods }; }
      return null;
    }
    /* "after/before/since/until/as/when..." là từ phụ thuộc (mệnh đề) hay giới từ? */
    function advClauseAt(j) {
      var w = W(j), k = j + 1;
      if (/^(because|although|though|while|whereas|unless|if|whenever|once)$/.test(w)) return true;
      if (/^(when|since|until|after|before|as)$/.test(w)) {
        if (has(k, 'PS') && !has(k, 'PO')) return true;
        return subjectStarts(k) || !!vgAt(k);
      }
      return false;
    }
    function advClause(j, ctx) {
      var kids = [LEAF('X', j, j + 1)];
      mark(j, j + 1, 'F');
      var r = clauseBody(j + 1, { kind: 'sub', stopComma: true }, false);
      if (!r) return null;
      r.kids.forEach(function (q) { kids.push(q); });
      return { node: CL('A', 'mđ trạng ngữ', j, r.end, kids, { sub: subOfA(j, j + 1, T) }), end: r.end };
    }

    /* ---------- nối: and / but / or ---------- */
    function coordinate(j, V, kids, ctx, st) {
      var k = j + 1;
      var advs = [];
      /* "and then", "but also" */
      while (k < limit && has(k, 'R') && !has(k, 'V') && !has(k, 'N') && !has(k, 'J') && !has(k, 'P') && (k + 1 < limit && (finiteStart(k + 1) || cd(k + 1, 'V') || has(k + 1, 'PS') || npStart(k + 1)))) { advs.push(k); k++; }
      if (k >= limit) return null;
      /* cùng chủ ngữ: and measured ... */
      var v2 = V.nonfinite ? null : vg(k, {});
      if (v2 && !(has(k, 'N') && npStart(k) && !finiteOnly(k) && !(hasF(k, 'V', 'd') && !cd(k, 'N')))) {
        kids.push(LEAF('X', j, j + 1)); mark(j, j + 1, 'F');
        advs.forEach(function (a) { kids.push(LEAF('A', a, a + 1, { sub: subOfA(a, a + 1, T) })); markForce(a, a + 1, 'D'); });
        var v2full = vg(k, {});
        pushVG(v2full, kids);
        return { V: v2full, end: v2full.end };
      }
      /* mệnh đề mới có chủ ngữ riêng */
      if (coordOK(ctx) && (has(k, 'PS') || npStart(k)) && newClauseAt(k)) {
        if (ctx.kind !== 'main') return null;
        kids.push(LEAF('X', j, j + 1)); mark(j, j + 1, 'F');
        advs.forEach(function (a) { kids.push(LEAF('A', a, a + 1, { sub: subOfA(a, a + 1, T) })); markForce(a, a + 1, 'D'); });
        var r = clauseBody(k, { kind: 'main' }, false);
        if (!r) return null;
        r.kids.forEach(function (q) { kids.push(q); });
        return { end: r.end, V: { lem: '', linking: false, nonfinite: false, tag: 'V', done: true } };
      }
      /* nối cụm: O and O, C and C, A and A */
      if (st.haveObj && npStart(k)) {
        var np = npFull(k, { role: 'O' });
        if (np) { kids.push(LEAF('X', j, j + 1)); mark(j, j + 1, 'F'); pushNP('O', np, kids); return { end: np.end, flagObj: true, flagComp: st.haveComp }; }
      }
      if (st.haveComp) {
        if (adjpAt(k)) { var ap = adjp(k); if (ap) { kids.push(LEAF('X', j, j + 1)); kids.push(LEAF('C', ap.a, ap.b)); markForce(ap.a, ap.b, 'J'); return { end: ap.b, flagObj: st.haveObj, flagComp: true }; } }
        if (npStart(k)) { var npc = npFull(k, { role: 'C' }); if (npc) { kids.push(LEAF('X', j, j + 1)); pushNP('C', npc, kids); return { end: npc.end, flagObj: st.haveObj, flagComp: true }; } }
      }
      if (has(k, 'P')) { var pp = ppParse(k, {}); if (pp) { kids.push(LEAF('X', j, j + 1)); pp.nodes.forEach(function (q) { kids.push(q); }); return { end: pp.end, flagObj: st.haveObj, flagComp: st.haveComp }; } }
      return null;
    }
    function newClauseAt(k) { return subjectStarts(k); }

    /* ---------- dấu phẩy ---------- */
    function closingComma(k, maxLen) {
      for (var q = k; q < limit && q - k < (maxLen || 12); q++) if (T[q].p && T[q].pt === 'comma') return q;
      return -1;
    }
    function interrupt(j, kids, ctx) {
      /* T[j] là dấu phẩy; trả chỉ số tiếp theo hoặc -1 */
      var k = j + 1;
      if (k >= limit) return -1;
      var c = closingComma(k);
      /* mệnh đề quan hệ bổ sung: which / who / where / P + which */
      var relAt = -1;
      if (has(k, 'U') && cd(k, 'U').rel && !isW(k, 'that') && !has(k, 'D')) relAt = k;
      else if (has(k, 'P') && has(k + 1, 'U') && /^(which|whom|whose)$/.test(W(k + 1))) relAt = k + 1;
      if (relAt >= 0) {
        var nodeKids = [];
        if (relAt > k) { nodeKids.push(LEAF('X', k, relAt + 1, { note: 'giới từ + which' })); markForce(k, relAt + 1, 'F'); }
        var lim = c >= 0 ? c : limit;
        var res = withLimit(lim, function () {
          var kk = relAt + 1; while (kk < limit && has(kk, 'R') && !has(kk, 'N')) kk++;
          var gap = !!vgAt(kk);
          var cb = clauseBody(relAt + 1, { kind: 'rel', stopComma: true }, relAt === k && gap);
          return cb;
        });
        if (res && res.end >= (c >= 0 ? c : limit) - 0 || (res && res.end > relAt + 1)) {
          if (relAt === k) { nodeKids.push(LEAF('X', k, k + 1)); mark(k, k + 1, 'F'); }
          res.kids.forEach(function (q) { nodeKids.push(q); });
          kids.push(CL('M', 'mđ quan hệ bổ sung', k, res.end, nodeKids));
          var e = res.end; if (e < n && T[e].p && T[e].pt === 'comma') e++;
          return e;
        }
      }
      if (c >= 0) {
        /* cụm chen giữa hai dấu phẩy */
        var parsed = withLimit(c, function () {
          var q = k, nodes = [];
          /* liên từ nối, trạng từ, giới từ */
          var cm = connAt(q);
          if (cm && q + cm === c) { nodes.push(LEAF('X', q, q + cm)); return { nodes: nodes, end: c }; }
          if (has(q, 'P') && !(has(q, 'TO') && nextIsBase(q + 1))) {
            var pp = ppParse(q, {});
            if (pp && pp.end === c) return { nodes: pp.nodes, end: c };
          }
          if (has(q, 'R') && !has(q, 'N') && !has(q, 'V')) {
            var r0 = q; while (r0 < limit && has(r0, 'R') && !has(r0, 'V')) r0++;
            if (r0 === c) { markForce(q, r0, 'D'); return { nodes: [LEAF('A', q, r0, { sub: subOfA(q, r0, T) })], end: c }; }
          }
          var kk = q; while (kk < limit && has(kk, 'R') && !has(kk, 'V') && !has(kk, 'N')) kk++;
          if ((hasF(kk, 'V', 'n') || hasF(kk, 'V', 'g')) && !finiteOnly(kk)) {
            var nf = nonFinite(q, { kind: hasF(kk, 'V', 'n') ? 'ed' : 'ing', chip: 'cụm V-ed/V-ing', role: 'M' });
            if (nf && nf.end === c) return { nodes: [nf.node], end: c };
          }
          if (has(q, 'U') && cd(q, 'U').adv && advClauseAt(q)) {
            var ac = advClause(q, {});
            if (ac && ac.end === c) return { nodes: [ac.node], end: c };
          }
          if (npStart(q)) {
            var np = npFull(q, { role: 'M' });
            if (np && np.end === c && !finiteStart(np.end)) { var ns = [LEAF('M', np.a, np.b)]; np.mods.forEach(function (m) { ns.push(m); }); return { nodes: ns, end: c }; }
          }
          return null;
        });
        if (parsed) { parsed.nodes.forEach(function (q) { kids.push(q); }); return c + 1; }
      }
      /* đồng vị cuối câu: ", a process that ..." */
      if (npStart(k) && !finiteStart(k)) {
        var np2 = npFull(k, { role: 'M' });
        if (np2 && np2.end >= limit - 0 || (np2 && T[np2.end] && T[np2.end].p)) {
          if (np2 && !vgAtNp(np2) && !has(k, 'PS')) { kids.push(LEAF('M', np2.a, np2.b)); np2.mods.forEach(function (m) { kids.push(m); }); return np2.end; }
        }
      }
      return -1;
    }
    function afterComma(j, kids, ctx, V) {
      var k = j + 1;
      if (k >= limit) return -1;
      /* nối bằng dấu phẩy + and/but */
      if (has(k, 'CC') && !has(k, 'U')) {
        if (ctx.kind === 'main' || ctx.kind === 'that' || ctx.kind === 'sub') return k;
        return -1;
      }
      if (ctx.stopComma) {
        /* mệnh đề bị chặn ở dấu phẩy: nhưng cụm chen giữa vẫn được phép khi có dấu phẩy đóng */
        return -1;
      }
      var r = interrupt(j, kids, ctx);
      if (r >= 0) return r;
      /* trạng ngữ sau dấu phẩy: ", using X", ", because ..." */
      if (has(k, 'U') && cd(k, 'U').adv && advClauseAt(k)) { var ac = advClause(k, ctx); if (ac) { kids.push(ac.node); return ac.end; } }
      if (hasF(k, 'V', 'g') && !finiteOnly(k)) { var nf = nonFinite(k, { kind: 'ing', chip: 'cụm V-ing', role: 'A' }); if (nf) { kids.push(nf.node); return nf.end; } }
      if (has(k, 'P')) { var pp = ppParse(k, {}); if (pp) { pp.nodes.forEach(function (q) { kids.push(q); }); return pp.end; } }
      if (has(k, 'R') && !has(k, 'N') && !has(k, 'V')) { var r1 = k; while (r1 < limit && has(r1, 'R')) r1++; markForce(k, r1, 'D'); kids.push(LEAF('A', k, r1, { sub: subOfA(k, r1, T) })); return r1; }
      return -1;
    }

    /* ---------- chủ ngữ ---------- */
    function absorb(jj, kids) {
      var g = 0;
      while (jj < limit && T[jj].p && T[jj].pt === 'comma' && g++ < 3) {
        var tmp = [], rr = interrupt(jj, tmp, { kind: 'main' });
        if (rr < 0) break;
        tmp.forEach(function (q) { kids.push(q); });
        jj = rr;
      }
      return jj;
    }
    function subject(j, ctx, kids, o) {
      o = o || {};
      /* there is... */
      if (has(j, 'EX') && isW(j, 'there') && (cd(j + 1, 'BE', 'fin') || has(j + 1, 'M') || cd(j + 1, 'HV', 'fin') || (has(j + 1, 'V') && finiteStart(j + 1))) && !(o.noThere)) {
        kids.push(LEAF('S', j, j + 1, { note: 'chủ ngữ giả (there)' })); mark(j, j + 1, 'F');
        return { end: j + 1, num: 'sg', there: true, ok: true };
      }
      /* mệnh đề danh từ làm chủ ngữ: What he found / That ... / Whether ... */
      if (has(j, 'U') && ((cd(j, 'U').wh && !isW(j, 'when') && !isW(j, 'where') && !isW(j, 'how') || isW(j, 'how')) && !has(j, 'D')) && !o.question) {
        var wc = whClause(j, 'S');
        if (wc && wc.end < limit && (finiteStart(wc.end) || vgAt(wc.end) || pt(wc.end) === 'comma')) {
          kids.push(CL('S', 'mđ ' + W(j), wc.a, wc.end, wc.kids)); return { end: absorb(wc.end, kids), num: 'sg', ok: true };
        }
      }
      if (isW(j, 'that') && has(j, 'U') && !nominalAhead(j + 1) === false && false) { /* chưa hỗ trợ */ }
      /* V-ing hay to-V làm chủ ngữ */
      if (hasF(j, 'V', 'g') && !(has(j, 'N') && false) && !cd(j, 'BE', 'g') && lookFinite(j + 1)) {
        var ng = nonFinite(j, { kind: 'ing', chip: 'V-ing', role: 'S', noAdv: true });
        if (ng && ng.end < limit && vgAt(ng.end)) { kids.push(ng.node); return { end: absorb(ng.end, kids), num: 'sg', ok: true }; }
      }
      if (has(j, 'TO') && nextIsBase(j + 1) && lookFinite(j + 2)) {
        var nt = nonFinite(j, { kind: 'inf', chip: 'to-V', role: 'S', noAdv: true });
        if (nt && nt.end < limit && vgAt(nt.end)) { kids.push(nt.node); return { end: nt.end, num: 'sg', ok: true }; }
      }
      /* cụm danh từ, thu hẹp dần nếu chưa tìm được động từ sau nó */
      var np = npFull(j, { subject: true, role: 'S', allowReduced: false });
      var guard = 0;
      while (np && guard++ < 4) {
        var aft = np.end;
        /* chen dấu phẩy: Ebbinghaus, the psychologist, ... */
        var probeKids = [], jj = aft, g2 = 0;
        while (jj < limit && T[jj].p && T[jj].pt === 'comma' && g2++ < 3) {
          var rr = interrupt(jj, probeKids, { kind: 'main' });
          if (rr < 0) break;
          jj = rr;
        }
        var okV = o.inv ? true : (jj < limit && (!!vgAt(jj) || !!vgAt(skipR(jj)) || o.allowNoVerb));
        if (okV) {
          pushNP('S', np, kids);
          probeKids.forEach(function (q) { kids.push(q); });
          return { end: jj, num: np.num, ok: true };
        }
        if (np.pron) break;
        /* thu hẹp: bỏ bớt danh từ cuối làm động từ */
        var lastN = np.b - 1;
        var prevEnd = -1;
        for (var q = np.b - 2; q >= np.a; q--) { if (has(q, 'N') || has(q, 'J')) { prevEnd = q + 1; break; } }
        if (prevEnd < 0 || prevEnd <= np.a) break;
        flags.shrink++;
        var np2 = withLimit(prevEnd, function () { return npFull(j, { subject: true, role: 'S' }); });
        if (!np2 || np2.end === np.end) break;
        np = np2;
        /* np2 bị cắt ở limit tạm nên mod có thể thiếu; chấp nhận */
        np.end = prevEnd; np.b = Math.min(np.b, prevEnd);
        if (vgAt(np.end)) { pushNP('S', np, kids); return { end: np.end, num: np.num, ok: true }; }
        break;
      }
      return { end: j, ok: false };
    }

    /* ---------- đầu mệnh đề ---------- */
    function lead(j, kids, ctx) {
      var guard = 0, st = { invert: false };
      while (j < limit && guard++ < 12) {
        if (T[j].p) { if (T[j].pt === 'comma' && j > 0 && guard > 1) { j++; continue; } break; }
        if (W(j) === 'please' && (guard === 1 || pt(j - 1) === 'comma')) { kids.push(LEAF('X', j, j + 1, { note: 'từ lịch sự' })); mark(j, j + 1, 'F'); j++; if (pt(j) === 'comma') j++; continue; }
        if (/^(yes|no|sorry|thanks|hello|hi|hey|oh|wow|okay|ok|sir|madam|sure|excuse)$/.test(W(j)) && pt(j + 1) === 'comma' && j + 2 < limit) { kids.push(LEAF('X', j, j + 1, { note: 'lời chào / từ cảm thán, không thuộc cấu trúc câu' })); mark(j, j + 1, 'F'); j += 2; continue; }
        var m = connAt(j);
        if (m) { kids.push(LEAF('X', j, j + m, { note: 'từ nối câu' })); mark(j, j + m, 'F'); j += m; if (pt(j) === 'comma') j++; continue; }
        if (ctx.first !== false && has(j, 'CC') && !has(j, 'R') || (ctx.first !== false && isW(j, 'so') && has(j, 'CC') && false)) {
          if (j + 1 < limit && (has(j, 'CC'))) { kids.push(LEAF('X', j, j + 1)); mark(j, j + 1, 'F'); j++; continue; }
        }
        /* đảo ngữ sau phủ định */
        var neg = null;
        for (var q = 0; q < NEG_INV.length; q++) {
          var parts = NEG_INV[q].split(' '), okn = true;
          for (var z = 0; z < parts.length; z++) if (W(j + z) !== parts[z]) { okn = false; break; }
          if (okn && (has(j + parts.length, 'DO') || has(j + parts.length, 'HV') || has(j + parts.length, 'M') || has(j + parts.length, 'BE'))) { neg = parts.length; break; }
        }
        if (neg) { kids.push(LEAF('X', j, j + neg, { note: 'trạng từ phủ định đứng đầu: đảo trợ động từ lên trước chủ ngữ' })); mark(j, j + neg, 'F'); j += neg; st.invert = true; continue; }
        /* rather than + V-ing */
        if (isW(j, 'rather') && isW(j + 1, 'than')) {
          var rt = ratherThan(j);
          if (rt && (pt(rt.end) === 'comma' || startsSubj(rt.end))) { kids.push(rt.node); (rt.extra || []).forEach(function (e) { kids.push(e); }); j = rt.end; if (pt(j) === 'comma') j++; continue; }
        }
        /* each time / every time + mệnh đề */
        if (/^(each|every)$/.test(W(j)) && isW(j + 1, 'time')) {
          var rc = withLimit(limit, function () { return clauseBody(j + 2, { kind: 'sub', stopComma: true }, false); });
          if (rc && rc.hasV) { var kk2 = [LEAF('X', j, j + 2)]; mark(j, j + 2, 'F'); rc.kids.forEach(function (q2) { kk2.push(q2); }); kids.push(CL('A', 'mđ trạng ngữ', j, rc.end, kk2, { sub: 'time' })); j = rc.end; if (pt(j) === 'comma') j++; continue; }
        }
        /* next year, last week, this morning... + (dấu phẩy | chủ ngữ): trạng ngữ thời gian đứng đầu câu */
        if (/^(next|last|this|every|each|that|one)$/.test(W(j)) && /^(day|week|month|year|morning|afternoon|evening|night|weekend|summer|winter|spring|autumn|time|semester|term|century|decade|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/.test(W(j + 1)) && (pt(j + 2) === 'comma' || startsSubj(j + 2))) {
          kids.push(LEAF('A', j, j + 2, { sub: 'time' })); mark(j, j + 1, 'J'); mark(j + 1, j + 2, 'N'); j += 2; if (pt(j) === 'comma') j++; continue;
        }
        /* trạng từ + dấu phẩy, hoặc trạng từ thời gian */
        if (has(j, 'R') && (!has(j, 'N') || /^(today|tomorrow|yesterday|tonight)$/.test(W(j))) && !(has(j, 'V')) && !has(j, 'PS')) {
          var r1 = j; while (r1 < limit && has(r1, 'R') && (!has(r1, 'N') || r1 === j)) r1++;
          if (pt(r1) === 'comma' || (r1 - j >= 1 && startsSubj(r1) && /^(now|then|today|yesterday|tomorrow|tonight|later|here|there|sometimes|usually|often|always|recently|finally|suddenly)$/.test(W(j)))) {
            markForce(j, r1, 'D'); kids.push(LEAF('A', j, r1, { sub: subOfA(j, r1, T) })); j = r1; if (pt(j) === 'comma') j++; continue;
          }
        }
        /* cụm giới từ đứng đầu */
        if (has(j, 'P') && !(has(j, 'TO') && nextIsBase(j + 1) && !npStart(j + 1)) && !(has(j, 'U') && advClauseAt(j))) {
          var pp = ppParse(j, { allowReduced: true });
          if (pp && (pt(pp.end) === 'comma' || startsSubj(pp.end))) {
            pp.nodes.forEach(function (q3) { kids.push(q3); }); j = pp.end; if (pt(j) === 'comma') j++; continue;
          }
        }
        /* mệnh đề trạng ngữ đứng đầu: Although..., When..., If... */
        if (has(j, 'U') && cd(j, 'U').adv && !(ctx.question && (cd(j + 1, 'DO', 'fin') || cd(j + 1, 'BE', 'fin') || has(j + 1, 'M') || cd(j + 1, 'HV', 'fin'))) && advClauseAt(j)) {
          var ac = advClause(j, ctx);
          if (ac) { kids.push(ac.node); j = ac.end; if (pt(j) === 'comma') j++; continue; }
        }
        /* cụm phân từ đứng đầu: Taken together, ... */
        if ((hasF(j, 'V', 'n') || hasF(j, 'V', 'g') || cd(j, 'HV', 'g') || cd(j, 'BE', 'g')) && !st.invert) {
          var c = closingComma(j, 14);
          if (c >= 0 && !has(j, 'M')) {
            var nf = withLimit(c, function () { return nonFinite(j, { kind: (hasF(j, 'V', 'n') && !hasF(j, 'V', 'g')) ? 'ed' : 'ing', chip: 'cụm V-ed/V-ing', role: 'A', sub: 'cách thức' }); });
            if (nf && nf.end === c) { kids.push(nf.node); j = c + 1; continue; }
          }
        }
        break;
      }
      return { j: j, invert: st.invert };
    }
    function skipR(e) { while (e < limit && has(e, 'R') && !has(e, 'N') && !finiteStart(e)) e++; return e; }
    function subjectStarts(k) {
      if (k >= limit || T[k].p) return false;
      if (has(k, 'PS') && !has(k, 'PO')) return true;
      if (hasF(k, 'V', 'g') && !cd(k, 'BE', 'g') && lookFinite(k + 1)) { var nf = nonFinite(k, { kind: 'ing', noAdv: true }); if (nf && nf.end < limit && !!vgAt(skipR(nf.end))) return true; }
      var np = npFull(k, { subject: true });
      if (!np) return false;
      var e = skipR(np.end);
      return e < limit && (finiteStart(e) || !!vgAt(e));
    }
    function startsSubj(k) { return subjectStarts(k); }

    /* ---------- thân mệnh đề ---------- */
    function clauseBody(i, ctx, subjGap) {
      var kids = [], j = i, hasV = false, v;
      var ld = (ctx.kind === 'main' || ctx.kind === 'that' || ctx.kind === 'sub') ? lead(j, kids, ctx) : { j: j, invert: false };
      j = ld.j;
      var isQ = !!ctx.question;
      var inv = ld.invert || isQ;
      var subj = { ok: true, end: j, num: 'sg' };
      /* câu hỏi đảo: Do you..., Is this..., Where do you live */
      if (ctx.kind === 'main' && !subjGap) {
        if (isQ && has(j, 'U') && cd(j, 'U').wh) {
          var wj = j, we = j + 1;
          if (W(j) === 'how' && WH_ADJ.indexOf(W(we)) >= 0) we++;
          else if ((W(j) === 'what' || W(j) === 'which' || W(j) === 'whose') && nominalAhead(we) && !(has(we, 'PS')) && !(cd(we, 'DO', 'fin') || cd(we, 'BE', 'fin') || has(we, 'M') || cd(we, 'HV', 'fin'))) { var wnp = npCore(we, { noPron: true }); if (wnp) we = wnp.end; }
          var gapQ = !!vgAt(we) && !(cd(we, 'DO', 'fin') || cd(we, 'BE', 'fin') && npStart(we + 1) && false);
          var auxQ = (cd(we, 'DO', 'fin') || cd(we, 'BE', 'fin') || has(we, 'M') || cd(we, 'HV', 'fin'));
          var subjQ = auxQ && npStart(we + 1) && !(cd(we, 'BE', 'fin') && !npStart(we + 1)) && !(cd(we, 'BE', 'fin') && has(we + 1, 'J') && !has(we + 1, 'N') && !has(we + 1, 'D'));
          if (!auxQ || !subjQ) { /* Who knows? What happened? */
            kids.push(LEAF('S', wj, we, { note: 'từ để hỏi làm chủ ngữ' })); mark(wj, we, 'F'); j = we; subjGap = true; subj = { ok: true, end: j };
          } else { kids.push(LEAF('X', wj, we, { note: 'từ để hỏi' })); mark(wj, we, 'F'); j = we; inv = true; }
        } else if (isQ && (cd(j, 'DO', 'fin') || cd(j, 'BE', 'fin') || has(j, 'M') || cd(j, 'HV', 'fin')) && npStart(j + 1)) inv = true;
      }
      if (inv && !subjGap) {
        /* trợ động từ trước chủ ngữ */
        var auxTok = j;
        if (!(cd(j, 'DO', 'fin') || cd(j, 'BE', 'fin') || has(j, 'M') || cd(j, 'HV', 'fin'))) { inv = false; }
        else {
          var kk = auxTok + 1;
          var sj = withLimit(limit, function () { return subject(kk, ctx, [], { inv: true, noThere: false }); });
          if (sj && sj.ok) {
            var sk = [];
            var sj2 = subject(kk, ctx, sk, { inv: true });
            var auxEnd = auxTok + 1;
            if (has(auxEnd, 'NEG') && false) auxEnd++;
            kids.push(LEAF('V', auxTok, auxEnd, { note: 'trợ động từ đảo lên trước chủ ngữ' })); markForce(auxTok, auxEnd, 'V');
            sk.forEach(function (q) { kids.push(q); });
            var need = cd(auxTok, 'M') ? 'b' : (cd(auxTok, 'DO', 'fin') ? 'b' : (cd(auxTok, 'HV', 'fin') ? 'n' : null));
            j = sj2.end;
            if (need) {
              v = vg(j, { need: need, hasAux: true, inv: true });
              if (!v) { /* thiếu động từ chính: trợ động từ là động từ chính (Do you ...?) */ v = { segs: [], advs: [], lem: lemma(auxTok), linking: false, end: j, tag: 'V', neg: false }; }
              hasV = true; pushVG(v, kids); j = v.end;
            } else {
              /* BE đảo: be + V-ing/V-ed hoặc be là động từ chính (Is this ...?) */
              var nvb = nextVerbal(j);
              if (nvb >= 0 && (hasF(nvb, 'V', 'g') || (hasF(nvb, 'V', 'n') && !isPartAdj(nvb))) && nvb === j) { v = vg(j, { need: hasF(nvb, 'V', 'g') ? 'g' : 'n', hasAux: true }); if (v) { hasV = true; pushVG(v, kids); j = v.end; } }
              if (!v) { v = { segs: [], advs: [], lem: 'be', linking: true, strongLink: true, end: j, tag: 'BE', neg: false }; hasV = true; }
            }
            var e2 = post(j, v, kids, ctx);
            return { kids: kids, end: e2, hasV: hasV };
          }
          inv = false;
        }
      }
      if (!subjGap) {
        subj = subject(j, ctx, kids, {});
        if (!subj.ok) {
          /* câu mệnh lệnh: động từ đứng đầu */
          if (ctx.kind === 'main' && j < limit && (hasF(j, 'V', 'b') || has(j, 'DO') || (cd(j, 'HV', 'b') && (has(j + 1, 'D') || has(j + 1, 'PO')))) && (!has(j, 'N') || has(j + 1, 'D') || has(j + 1, 'PO') || has(j + 1, 'P') || has(j + 1, 'R')) || (ctx.kind === 'main' && j < limit && hasF(j, 'V', 'b') && !T[j].cap)) {
            v = vg(j, {});
            if (v) { hasV = true; pushVG(v, kids); j = post(v.end, v, kids, ctx); return { kids: kids, end: j, hasV: true }; }
          }
          flags.fragment++;
          return { kids: kids, end: kids.length ? j : i, hasV: false };
        }
        j = subj.end;
      }
      /* trạng từ chen giữa chủ ngữ và động từ: Ebbinghaus also observed */
      var preAdv = [];
      while (j < limit && has(j, 'R') && !has(j, 'N') && !has(j, 'V') && !(vg(j, { probe: true }) && false)) { if (finiteStart(j + 1) || vgAt(j + 1) || has(j + 1, 'R')) { preAdv.push(j); j++; } else break; }
      v = vg(j, { subjGap: subjGap });
      if (!v) {
        /* không có động từ: rút lại trạng từ */
        return { kids: kids, end: kids.length ? (preAdv.length ? preAdv[0] : j) : i, hasV: false };
      }
      preAdv.forEach(function (a) { markForce(a, a + 1, 'D'); kids.push(LEAF('A', a, a + 1, { sub: subOfA(a, a + 1, T) })); });
      hasV = true;
      pushVG(v, kids);
      j = v.end;
      /* there + be + NP thật */
      if (subj.there && !v.passive) {
        var npT = j < limit && npStart(j) ? npFull(j, { role: 'S' }) : null;
        if (npT) { pushNP('S', npT, kids, { note: 'chủ ngữ thật (đứng sau be)' }); j = npT.end; }
        v = Object.assign({}, v, { lem: v.lem, linking: false });
        var e3 = post(j, Object.assign({}, v, { linking: false, strongLink: false }), kids, ctx);
        /* đánh dấu đã có tân ngữ giả: không gán O cho NP đã dùng */
        return { kids: kids, end: e3, hasV: true };
      }
      var e = post(j, v, kids, ctx);
      return { kids: kids, end: e, hasV: hasV };
    }

    /* ---------- chạy cả câu ---------- */
    var out = [], pos = firstIdx;
    var guardTop = 0;
    while (pos < limit && guardTop++ < 12) {
      var r = clauseBody(pos, { kind: 'main', question: question && guardTop === 1 }, false);
      if (!r || r.end <= pos) {
        /* không tiến được: bỏ qua từ này (có thể là dấu câu) */
        var skip = pos; while (skip < limit && T[skip].p && T[skip].pt !== 'final') skip++;
        if (skip > pos) { pos = skip; continue; }
        break;
      }
      r.kids.forEach(function (q) { out.push(q); });
      pos = r.end;
      while (pos < limit && T[pos].p && T[pos].pt !== 'final') pos++;
    }
    if (pos < limit) {
      for (var z = pos; z < limit; z++) if (!T[z].p) flags.leftover++;
    }
    /* What did you buy?: từ để hỏi what/who/whom/which đứng đầu, trợ động từ đảo, chưa có tân ngữ -> là tân ngữ đã đảo lên đầu */
    (function () {
      var f = out[0];
      if (!f || f.k !== 'ph' || f.r !== 'X' || !/^(what|who|whom|which)$/.test(W(f.a))) return;
      var hasAuxInv = false, hasObj = false, nV = 0, beInv = false, ingV = false;
      out.forEach(function (nd) {
        if (nd.k === 'ph' && nd.r === 'V') { nV++; if (nd.note && nd.note.indexOf('đảo') >= 0 && /^(do|does|did|will|would|can|could|should|may|might|must|shall|have|has|had)$/.test(W(nd.a))) hasAuxInv = true; if (nd.note && nd.note.indexOf('đảo') >= 0 && /^(am|is|are|was|were)$/.test(W(nd.a))) beInv = true; if (/ing$/.test(W(nd.b - 1))) ingV = true; }
        if (nd.r === 'O' || nd.r === 'C') hasObj = true;
        if (nd.k === 'ph' && nd.r === 'A' && nd !== f && /^(at|to|for|with|about|of|from|on|in)$/.test(W(nd.a))) hasObj = true;
      });
      if ((hasAuxInv || (beInv && ingV)) && !hasObj && nV >= 2) { f.r = 'O'; f.note = 'từ để hỏi làm tân ngữ (đã đảo lên đầu câu)'; }
    })();
    /* "please" không phải trạng ngữ: đổi thành từ nối/lịch sự (X) */
    (function fix(list) { list.forEach(function (nd) { if (nd.k === 'ph' && nd.r === 'A' && nd.b - nd.a === 1 && W(nd.a) === 'please') { nd.r = 'X'; nd.sub = ''; nd.note = 'từ lịch sự'; } if (nd.kids) fix(nd.kids); }); })(out);
    return { kids: out, flags: flags, limit: limit, question: question };
  }

  /* ================= 6. ĐỘ TIN CẬY, LÕI CÂU, XUẤT HTML ================= */
  function covered(nodes, n) {
    var cov = new Array(n);
    (function walk(list) { list.forEach(function (nd) { for (var i = nd.a; i < nd.b; i++) cov[i] = true; if (nd.kids) walk(nd.kids); }); })(nodes);
    return cov;
  }
  function describeConfidence(res, T) {
    var f = res.flags, cnt = 0;
    T.forEach(function (t) { if (!t.p) cnt++; });
    var hasV = false;
    (function w(l) { l.forEach(function (n) { if (n.r === 'V' || n.r === 'T') hasV = true; if (n.kids) w(n.kids); }); })(res.kids);
    var reasons = [];
    if (cnt > 40) reasons.push('câu rất dài (' + cnt + ' từ)');
    if (f.unk > 0) reasons.push(f.unk + ' từ chưa có trong từ điển nhỏ (đoán theo đuôi từ)');
    if (f.leftover > 0) reasons.push(f.leftover + ' từ cuối câu chưa được gán nhãn');
    if (f.fragment > 0 || !hasV) reasons.push('không tìm thấy cấu trúc câu đầy đủ');
    if (f.shrink > 0) reasons.push('phải đoán từ vừa là danh từ vừa là động từ');
    var level = 'cao';
    if (reasons.length) level = 'vừa';
    if (f.leftover > 2 || !hasV || cnt > 55 || f.unk > 3) level = 'thấp';
    return { level: level, reasons: reasons };
  }
  function skeleton(kids, T) {
    var parts = [];
    kids.forEach(function (k) {
      if (k.mod || k.r === 'mod' || k.r === 'M' || k.r === 'rel') return;
      if (k.r === 'X' || k.r === 'A') return;
      var txt = '';
      if (k.k === 'cl') txt = (k.chip ? '[' + k.chip + ']' : '[mệnh đề]');
      else { txt = T.slice(k.a, k.b).filter(function (t) { return !t.p; }).map(function (t) { return t.w; }).join(' '); }
      var last = parts[parts.length - 1];
      if (last && last.r === k.r && k.r === 'V' && last.b === k.a) { last.txt += ' ' + txt; last.b = k.b; return; }
      parts.push({ r: k.r, txt: txt, b: k.b });
    });
    return parts;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function render(sent, text, mode) {
    var T = sent.tokens;
    function gap(t) { return t > 0 ? text.slice(T[t - 1].e, T[t].s) : ''; }
    function piece(t) { return esc(text.slice(T[t].s, T[t].e)); }
    function plain(a, b, skipFirstGap) {
      var h = '';
      for (var t = a; t < b; t++) h += ((t === a && skipFirstGap) ? '' : esc(gap(t))) + posWrap(t);
      return h;
    }
    function posWrap(t) {
      if (mode === 'pos' && !T[t].p && T[t].pos && T[t].pos !== 'F') return '<i class="pc-pos pos-' + T[t].pos + '">' + piece(t) + '</i>';
      if (mode === 'pos' && !T[t].p && T[t].pos === 'F') return '<i class="pc-pos pos-F">' + piece(t) + '</i>';
      return piece(t);
    }
    if (mode === 'pos') return plain(0, T.length, true);
    function emit(a, b, kids, skipFirstGap) {
      var h = '', p = a;
      var sorted = kids.slice().sort(function (x, y) { return x.a - y.a || y.b - x.b; });
      sorted.forEach(function (k, idx) {
        if (k.a < p) return;
        h += plain(p, k.a, p === a && skipFirstGap);
        var first = (k.a === a && skipFirstGap);
        h += node(k, first);
        p = k.b;
      });
      h += plain(p, b, p === a && skipFirstGap);
      return h;
    }
    function node(k, first) {
      var role = k.mod ? 'mod' : k.r, cls, attrs = '';
      var g = first ? '' : esc(gap(k.a));
      var title = '';
      if (k.k === 'ph') {
        var roleName = (ROLES[k.r] ? ROLES[k.r].vi : k.r);
        var chip = k.r === 'A' && k.sub ? 'A·' + SUBVI[k.sub] : (k.r === 'X' ? 'nối' : (k.r === 'T' ? 'to-V' : k.r));
        if (k.mod) { cls = 'pc-mod'; attrs = ' data-r="' + esc(k.pr || 'O') + '" data-c="bổ nghĩa"'; }
        else { cls = 'pc-ph'; attrs = ' data-r="' + k.r + '" data-c="' + esc(chip) + '"' + (k.sub ? ' data-sub="' + k.sub + '"' : '') + (k.note ? ' data-note="' + esc(k.note) + '"' : ''); }
        return g + '<span class="' + cls + '"' + attrs + '>' + plain(k.a, k.b, true) + '</span>';
      }
      var r = k.mod ? (k.pr || 'O') : k.r;
      var chipC = (k.r === 'mod' || k.mod) ? (k.chip || 'mệnh đề') : (k.chip || '');
      if (k.r === 'inf') chipC = k.chip || 'to-V';
      if (k.r === 'rel') chipC = k.chip;
      if (k.r === 'A' && k.sub) chipC = SUBVI[k.sub] + ' · ' + k.chip;
      var dr = (k.r === 'rel' || k.r === 'inf' || k.r === 'mod') ? (k.pr || (k.r === 'inf' ? 'T' : 'O')) : k.r;
      if (k.r === 'rel') dr = k.pr || 'X';
      return g + '<span class="pc-cl" data-r="' + dr + '" data-c="' + esc(chipC) + '"' + (k.note ? ' data-note="' + esc(k.note) + '"' : '') + '>' + emit(k.a, k.b, k.kids || [], true) + '</span>';
    }
    return emit(0, T.length, sent.kids, true);
  }

  /* ================= 7. HÀM CHÍNH ================= */
  function analyze(text, opts) {
    opts = opts || {};
    var max = opts.maxChars || 40000, truncated = false;
    if (text.length > max) { text = text.slice(0, max); truncated = true; }
    var toks = tokenize(text);
    var sents = splitSentences(toks);
    var out = sents.map(function (T, i) {
      var firstTok = T.filter(function (t) { return !t.p; })[0];
      var res = analyzeTokens(T);
      var conf = describeConfidence(res, T);
      var s = T[0].s, e = T[T.length - 1].e;
      var sent = { id: i + 1, tokens: T, start: s, end: e, text: text.slice(s, e), kids: res.kids, flags: res.flags, question: res.question, confidence: conf.level, reasons: conf.reasons };
      sent.skeleton = skeleton(res.kids, T);
      return sent;
    });
    return { text: text, sentences: out, truncated: truncated };
  }
  function html(sent, text, mode) { return render(sent, text, mode || 'role'); }
  /* bản bracket để kiểm thử: [S: ...] cho cụm, <O: ...> cho mệnh đề */
  function dump(sent, text) {
    var T = sent.tokens;
    function words(a, b) { return T.slice(a, b).filter(function (t) { return !t.p; }).map(function (t) { return t.w; }).join(' '); }
    function emit(a, b, kids) {
      var p = a, parts = [];
      kids.slice().sort(function (x, y) { return x.a - y.a || y.b - x.b; }).forEach(function (k) {
        if (k.a < p) return;
        var w = words(p, k.a); if (w) parts.push(w);
        if (k.k === 'ph') parts.push('[' + (k.mod ? 'm' : k.r) + ' ' + words(k.a, k.b) + ']');
        else parts.push('<' + (k.mod ? 'm' : k.r) + (k.r === 'A' && k.sub ? '.' + k.sub : '') + ' ' + emit(k.a, k.b, k.kids) + '>');
        p = k.b;
      });
      var w2 = words(p, b); if (w2) parts.push(w2);
      return parts.join(' ');
    }
    return emit(0, T.length, sent.kids);
  }

  return { analyze: analyze, html: html, dump: dump, themTuVung: themTuVung, ROLES: ROLES, SUBVI: SUBVI, tokenize: tokenize, splitSentences: splitSentences, version: '1.0' };
});

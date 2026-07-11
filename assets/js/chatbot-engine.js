/* Vision Touch chatbot — layer-1 conversation engine (v2).
   Universal module: attaches to window in the browser and globalThis in Node
   (so build/test-chatbot-intents.mjs unit-tests the same code the site runs).

   v2 upgrades over the original keyword matcher:
   - typo tolerance: bounded Levenshtein fuzzy matching ("rennovation",
     "kitchin", "illford" all resolve correctly)
   - light stemming (renovations/renovating → renovate, floors → floor)
   - ~140 recognised Greater London areas + postcode-prefix detection (IG1,
     HA1, SE15 …) instead of the original 16 boroughs
   - project-intent detection ("I want/need/planning …") so the UI can offer
     a pre-filled quote conversationally
   - rank(): fuzzy retrieval over the knowledge base, used as a smart
     fallback before giving up on a question

   Pure functions only — no DOM, no fetch. Data injected via init(). */
(function (root) {
  'use strict';

  var DATA = { intents: [], serviceKeywords: {}, areas: [], projectVerbs: [] };

  /* ------------------------------------------------------------ text prep */
  function normalise(s) {
    return ' ' + String(s || '').toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9£\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() + ' ';
  }

  function stem(w) {
    if (w.length > 6 && /ing$/.test(w)) return w.slice(0, -3);
    if (w.length > 5 && /ed$/.test(w)) return w.slice(0, -2);
    if (w.length > 4 && /es$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w)) return w.slice(0, -1);
    return w;
  }

  function tokenize(s) {
    var toks = normalise(s).trim().split(' ').filter(Boolean);
    return { tokens: toks, stems: toks.map(stem) };
  }

  /* Bounded Levenshtein — early-exits once distance exceeds `max`. */
  function lev(a, b, max) {
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= lb; j++) prev[j] = j;
    for (i = 1; i <= la; i++) {
      cur[0] = i;
      var rowMin = i;
      for (j = 1; j <= lb; j++) {
        var cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > max) return max + 1;
      var tmp = prev; prev = cur; cur = tmp;
    }
    return prev[lb];
  }

  function allowedDist(w) { return w.length >= 8 ? 2 : w.length >= 5 ? 1 : 0; }

  /* Match one single-word keyword against pre-tokenized input.
     exact 1.0 · stem match 0.95 · fuzzy within allowed distance 0.85 */
  function wordMatch(tok, kw, exactOnly) {
    var kwStem = stem(kw);
    for (var i = 0; i < tok.tokens.length; i++) {
      if (tok.tokens[i] === kw) return 1;
      if (tok.stems[i] === kwStem) return 0.95;
    }
    if (exactOnly) return 0;
    var max = allowedDist(kw);
    if (max > 0) {
      for (i = 0; i < tok.tokens.length; i++) {
        var t = tok.tokens[i];
        if (t.length < 4) continue;
        if (lev(t, kw, max) <= max || lev(tok.stems[i], kwStem, max) <= max) return 0.85;
      }
    }
    return 0;
  }

  /* Score one keyword (word or phrase) against the input. */
  function keywordScore(text, tok, kw, exactOnly) {
    var k = kw.toLowerCase();
    if (k.indexOf(' ') !== -1 || k.indexOf('-') !== -1) {
      if (text.indexOf(' ' + k + ' ') !== -1 || text.indexOf(k) !== -1) return 2.2;
      if (exactOnly) return 0;
      // loose phrase: every word present (any gaps) e.g. "help with" matches
      // "help me with", "convert loft" matches "convert my loft".
      // Phrase words match exact/stem only — fuzzy inside phrases multiplies
      // false positives ("whole house" must not fire on "while … house").
      // Short filler words (<3 chars) must appear verbatim; at least one
      // substantial word is required — otherwise "do up" would match anything.
      var words = k.split(/[\s-]+/).filter(Boolean);
      if (words.length > 1) {
        var longMatched = 0;
        for (var w = 0; w < words.length; w++) {
          if (words[w].length < 3) {
            if (tok.tokens.indexOf(words[w]) === -1) return 0;
          } else {
            if (wordMatch(tok, words[w], true) === 0) return 0;
            longMatched++;
          }
        }
        return longMatched > 0 ? 1.6 : 0;
      }
      return 0;
    }
    return wordMatch(tok, k, exactOnly);
  }

  function scoreKeywords(text, tok, keywords, exactOnly) {
    var score = 0;
    for (var i = 0; i < keywords.length; i++) score += keywordScore(text, tok, keywords[i], exactOnly);
    return score;
  }

  /* ------------------------------------------------------------- services */
  function detectService(text, tok) {
    var best = null, bestScore = 0;
    var map = DATA.serviceKeywords || {};
    for (var slug in map) {
      var s = scoreKeywords(text, tok, map[slug]);
      // "remodel my kitchen" → the room-specific service beats the generic
      // renovation match, so generic renovation words weigh less.
      if (slug === 'property-renovations') s *= 0.8;
      if (s > bestScore) { bestScore = s; best = slug; }
    }
    return bestScore > 0 ? { slug: best, score: bestScore } : null;
  }

  /* ---------------------------------------------------------------- areas */
  var PC_RE = /\b(ec|wc|nw|se|sw|br|cr|da|en|ha|ig|kt|rm|sm|tw|ub|wd|e|n|w)\s?(\d{1,2})[a-z]?\b/;

  function titleCase(s) {
    return s.replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
  }

  function detectArea(text, tok) {
    var lists = [DATA.areas, DATA.areasExtended];
    for (var L = 0; L < lists.length; L++) {
      var areas = lists[L] || [];
      for (var i = 0; i < areas.length; i++) {
        var a = areas[i].toLowerCase();
        if (text.indexOf(' ' + a + ' ') !== -1) return areas[i];
      }
    }
    // typo-tolerant pass over single-word area names ("illford" → Ilford)
    var all = (DATA.areas || []).concat(DATA.areasExtended || []);
    for (i = 0; i < all.length; i++) {
      var name = all[i];
      if (name.indexOf(' ') !== -1) continue;
      var nl = name.toLowerCase(), max = allowedDist(nl);
      if (max === 0) continue;
      for (var t = 0; t < tok.tokens.length; t++) {
        var w = tok.tokens[t];
        if (w.length >= 5 && lev(w, nl, max) <= max) return name;
      }
    }
    // postcode prefixes (IG1, HA1, SE15 …) — all Greater London districts
    var m = text.match(PC_RE);
    if (m) return (m[1] + m[2]).toUpperCase();
    if (text.indexOf('greater london') !== -1) return 'Greater London';
    if (text.indexOf(' london ') !== -1) return 'London';
    return null;
  }

  /* -------------------------------------------------------- project intent */
  function detectProjectIntent(text, tok) {
    var verbs = DATA.projectVerbs || [];
    for (var i = 0; i < verbs.length; i++) {
      if (keywordScore(text, tok, verbs[i]) > 0) return true;
    }
    return false;
  }

  /* ------------------------------------------------------------ retrieval */
  var STOP = {};
  ('the a an and or but if then so to of in on at for with about as is are was were be been being do does did done ' +
   'can could will would should shall may might must have has had i you we they he she it my your our their me us them ' +
   'this that these those there here what which who whom how when where why not no yes dont cant im its get got want ' +
   'need like just also very really please hi hello hey ok okay').split(' ').forEach(function (w) { STOP[w] = 1; });

  /* rank(message, entries[{id,text}]) → sorted [{id,score}] by fuzzy token
     overlap. Used by the widget to answer from the knowledge base before
     falling back to "I'm not sure". */
  function rank(message, entries) {
    var q = tokenize(message);
    var qWords = [];
    for (var i = 0; i < q.tokens.length; i++) {
      if (q.tokens[i].length >= 3 && !STOP[q.tokens[i]]) qWords.push({ w: q.tokens[i], s: q.stems[i] });
    }
    if (!qWords.length) return [];
    var out = [];
    for (var e = 0; e < entries.length; e++) {
      var doc = tokenize(entries[e].text);
      var score = 0;
      for (var w = 0; w < qWords.length; w++) {
        var bestW = 0, qw = qWords[w];
        for (var t = 0; t < doc.tokens.length; t++) {
          if (doc.tokens[t] === qw.w) { bestW = 1; break; }
          if (doc.stems[t] === qw.s) { bestW = Math.max(bestW, 0.9); continue; }
          var max = allowedDist(qw.w);
          if (max > 0 && doc.tokens[t].length >= 4 && lev(doc.tokens[t], qw.w, max) <= max) bestW = Math.max(bestW, 0.7);
        }
        score += bestW;
      }
      if (score > 0) out.push({ id: entries[e].id, score: score });
    }
    out.sort(function (a, b) { return b.score - a.score; });
    return out;
  }

  /* ----------------------------------------------------------- main detect */
  function detect(message) {
    var text = normalise(message);
    var tok = tokenize(message);
    var words = tok.tokens.length;

    var service = detectService(text, tok);
    var area = detectArea(text, tok);
    var projectIntent = detectProjectIntent(text, tok);

    var best = null, bestScore = 0;
    for (var i = 0; i < DATA.intents.length; i++) {
      var it = DATA.intents[i];
      if (it.maxWords && words > it.maxWords) continue;
      // Emergency matches must be exact — fuzzy would let "flooring" trip
      // "flooding". Everything else gets typo tolerance.
      var s = scoreKeywords(text, tok, it.keywords || [], it.id === 'emergency');
      if (it.id === 'emergency' && s > 0) s *= 2.5;          // safety first
      if (it.id === 'quote' && service) s += 0.6;            // "loft cost?" → quote about a service
      if (s > bestScore) { bestScore = s; best = it; }
    }

    // Service mentions ("do you do roofing?", "I want a renovation…") beat
    // weak or generic intent matches — the service answer is the
    // conversational one ("…my loft, can you help me with that?" must go to
    // lofts, not the generic services list).
    if (service) {
      var genericBest = !best || ['greeting', 'services-general', 'affirm'].indexOf(best.id) !== -1;
      if (genericBest || (bestScore < service.score + 0.5 && bestScore <= 1)) {
        return {
          intent: 'service', service: service.slug, area: area, projectIntent: projectIntent,
          confidence: Math.min(1, 0.55 + service.score * 0.18), def: null
        };
      }
    }

    // Named place with no stronger signal → area question
    if ((!best || bestScore < 1) && area && !service) {
      return { intent: 'areas', service: null, area: area, projectIntent: projectIntent, confidence: 0.7, def: null };
    }

    if (!best || bestScore <= 0) {
      return { intent: 'fallback', service: service && service.slug, area: area, projectIntent: projectIntent, confidence: 0, def: null };
    }

    return {
      intent: best.id,
      service: service && service.slug,
      area: area,
      projectIntent: projectIntent,
      confidence: Math.min(1, bestScore / 2.5),
      def: best
    };
  }

  root.VTChatEngine = {
    init: function (intentsJson, knowledgeJson) {
      DATA.intents = (intentsJson && intentsJson.intents) || [];
      DATA.serviceKeywords = (intentsJson && intentsJson.serviceKeywords) || {};
      DATA.projectVerbs = (intentsJson && intentsJson.projectVerbs) || [];
      var areas = (knowledgeJson && knowledgeJson.areas) || {};
      DATA.areas = areas.named || [];
      DATA.areasExtended = areas.extended || [];
    },
    detect: detect,
    rank: rank,
    _normalise: normalise
  };
})(typeof window !== 'undefined' ? window : globalThis);

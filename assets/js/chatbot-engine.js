/* Vision Touch chatbot — layer-1 intent engine.
   Universal module: attaches to window in the browser and globalThis in Node
   (so build/test-chatbot-intents.mjs can unit-test the same code the site runs).
   Pure functions only — no DOM, no fetch. Data (intents/knowledge JSON) is
   injected via init(). */
(function (root) {
  'use strict';

  var DATA = { intents: [], serviceKeywords: {}, areas: [] };

  function normalise(s) {
    return ' ' + String(s || '').toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9£\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() + ' ';
  }

  /* Score one keyword against normalised text. Multi-word phrases are strong
     signals; single words must match as whole words. */
  function keywordScore(text, kw) {
    var k = kw.toLowerCase();
    if (k.indexOf(' ') !== -1 || k.indexOf('-') !== -1) {
      return text.indexOf(' ' + k + ' ') !== -1 || text.indexOf(k) !== -1 ? 2.2 : 0;
    }
    return text.indexOf(' ' + k + ' ') !== -1 ? 1 : 0;
  }

  function scoreKeywords(text, keywords) {
    var score = 0, hits = [];
    for (var i = 0; i < keywords.length; i++) {
      var s = keywordScore(text, keywords[i]);
      if (s > 0) { score += s; hits.push(keywords[i]); }
    }
    return { score: score, hits: hits };
  }

  function wordCount(s) { return normalise(s).trim().split(' ').filter(Boolean).length; }

  function detectService(text) {
    var best = null, bestScore = 0;
    var map = DATA.serviceKeywords || {};
    for (var slug in map) {
      var r = scoreKeywords(text, map[slug]);
      var s = r.score;
      // "renovate my kitchen/bathroom" → the room-specific service is the
      // better answer, so generic renovation words weigh slightly less.
      if (slug === 'property-renovations') s *= 0.9;
      if (s > bestScore) { bestScore = s; best = slug; }
    }
    return bestScore > 0 ? { slug: best, score: bestScore } : null;
  }

  function detectArea(text) {
    var areas = DATA.areas || [];
    for (var i = 0; i < areas.length; i++) {
      if (text.indexOf(' ' + areas[i].toLowerCase() + ' ') !== -1) return areas[i];
    }
    if (text.indexOf('greater london') !== -1) return 'Greater London';
    if (text.indexOf(' london ') !== -1) return 'London';
    return null;
  }

  /* Main entry: returns {intent, service, area, confidence, def} */
  function detect(message) {
    var text = normalise(message);
    var words = wordCount(message);

    var service = detectService(text);
    var area = detectArea(text);

    var best = null, bestScore = 0;
    for (var i = 0; i < DATA.intents.length; i++) {
      var it = DATA.intents[i];
      if (it.maxWords && words > it.maxWords) continue;
      var r = scoreKeywords(text, it.keywords || []);
      var s = r.score;
      if (it.id === 'emergency' && s > 0) s *= 2.5;          // safety first
      if (it.id === 'quote' && service) s += 0.6;            // "loft cost?" → quote about a service
      if (s > bestScore) { bestScore = s; best = it; }
    }

    // Service-only questions ("do you do roofing?") → service intent
    if (service && (!best || bestScore < service.score + 0.5)) {
      var svcOnly = !best || ['greeting', 'services-general'].indexOf(best.id) !== -1 || bestScore <= 1;
      if (svcOnly) {
        return {
          intent: 'service', service: service.slug, area: area,
          confidence: Math.min(1, 0.55 + service.score * 0.18), def: null
        };
      }
    }

    // Bare area question with a named place ("do you cover Croydon?")
    if (!best && area) {
      return { intent: 'areas', service: service && service.slug, area: area, confidence: 0.7, def: null };
    }

    if (!best || bestScore <= 0) {
      return { intent: 'fallback', service: service && service.slug, area: area, confidence: 0, def: null };
    }

    return {
      intent: best.id,
      service: service && service.slug,
      area: area,
      confidence: Math.min(1, bestScore / 2.5),
      def: best
    };
  }

  var engine = {
    init: function (intentsJson, knowledgeJson) {
      DATA.intents = (intentsJson && intentsJson.intents) || [];
      DATA.serviceKeywords = (intentsJson && intentsJson.serviceKeywords) || {};
      DATA.areas = (knowledgeJson && knowledgeJson.areas && knowledgeJson.areas.named) || [];
    },
    detect: detect,
    _normalise: normalise
  };

  root.VTChatEngine = engine;
})(typeof window !== 'undefined' ? window : globalThis);

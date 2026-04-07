// Run test suite headlessly via Playwright - inject tests into the app page directly
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

const PORT = 9876;
const DIR = new URL('.', import.meta.url).pathname;

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json',
  '.pdf': 'application/pdf', '.css': 'text/css', '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  let path = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = join(DIR, path);
  if (!existsSync(filePath)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
  res.end(readFileSync(filePath));
});

server.listen(PORT, async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Intercept ALL requests - serve local, fulfill external with empty responses
  await page.route('**/*', (route, request) => {
    if (request.url().startsWith(`http://localhost:${PORT}`)) {
      route.continue();
    } else {
      const ct = request.url().includes('.css') || request.url().includes('fonts.googleapis') ? 'text/css' : 'text/plain';
      route.fulfill({ status: 200, contentType: ct, body: '' });
    }
  });

  await page.goto(`http://localhost:${PORT}/index.html`, { timeout: 10000 });
  // Wait for the app to initialize - dayData is a const (not on window), check via DOM
  await page.waitForFunction(() => document.querySelectorAll('.day-card').length === 8, { timeout: 15000 });

  // Expose const variables to window for testing
  await page.evaluate(() => {
    const script = document.createElement('script');
    script.textContent = 'window.__dayData = dayData; window.__defaultPackingList = defaultPackingList; window.__viewTicket = viewTicket;';
    document.body.appendChild(script);
  });

  // Run tests
  const results = await page.evaluate(() => {
    const dayData = window.__dayData;
    const defaultPackingList = window.__defaultPackingList;
    const viewTicket = window.__viewTicket;
    const log = [];
    let passed = 0, failed = 0;

    function assert(cond, msg, detail) {
      if (cond) { passed++; log.push({ s: 'PASS', m: msg }); }
      else { failed++; log.push({ s: 'FAIL', m: msg, d: detail }); }
    }
    function section(name) { log.push({ s: 'SECTION', m: name }); }

    // ======================== DATA INTEGRITY ========================
    section('Data Integrity');
    assert(Array.isArray(dayData), 'dayData is an array');
    assert(dayData.length === 8, `dayData has 8 days (got ${dayData.length})`);

    const expectedDays = [21,22,23,24,25,26,27,28];
    const actualDays = dayData.map(d => d.number);
    assert(JSON.stringify(actualDays) === JSON.stringify(expectedDays),
      `Day numbers are 21-28 (got ${actualDays.join(', ')})`);

    dayData.forEach(day => {
      assert(day.date && typeof day.date === 'string', `Day ${day.number}: has a date string`);
      assert(day.theme && typeof day.theme === 'string', `Day ${day.number}: has a theme`);
      assert(Array.isArray(day.stops) && day.stops.length > 0, `Day ${day.number}: has ${day.stops.length} stops`);
    });

    const marathonDay = dayData.find(d => d.isMarathon);
    assert(marathonDay && marathonDay.number === 26, 'Marathon day is Day 26');

    // ======================== STOP VALIDATION ========================
    section('Stop Data Validation');
    let totalStops = 0;
    dayData.forEach(day => {
      day.stops.forEach((stop, idx) => {
        totalStops++;
        assert(stop.name && typeof stop.name === 'string',
          `Day ${day.number} stop ${idx}: "${(stop.name||'').substring(0,40)}"`);
        assert(stop.emoji, `Day ${day.number} stop ${idx}: has emoji`);
        assert(stop.time !== undefined, `Day ${day.number} stop ${idx}: has time`);
      });
    });
    assert(totalStops > 60, `Total stops: ${totalStops} (expected 60+)`);

    // ======================== TICKETS ========================
    section('Tickets & Reservations');

    const pdfTickets = [];
    const emailTickets = [];
    const reservations = [];
    dayData.forEach(day => {
      day.stops.forEach(stop => {
        if (stop.tickets) pdfTickets.push(stop);
        if (stop.emailTicket) emailTickets.push(stop);
        if (stop.reservation) reservations.push({ day: day.number, stop });
      });
    });

    assert(pdfTickets.length === 3, `3 PDF tickets (got ${pdfTickets.length})`);
    ['Tower of London','Westminster Abbey','The British Museum'].forEach(name => {
      assert(pdfTickets.some(s => s.tickets.name === name), `PDF ticket: "${name}"`);
    });
    pdfTickets.forEach(s => {
      assert(s.tickets.pdf && s.tickets.pdf.startsWith('tickets/'),
        `"${s.tickets.name}" PDF path: ${s.tickets.pdf}`);
    });

    assert(emailTickets.length === 1, `1 email ticket (got ${emailTickets.length})`);
    if (emailTickets[0]) {
      assert(emailTickets[0].emailTicket.name === 'Churchill War Rooms', 'Email ticket: Churchill War Rooms');
      assert(emailTickets[0].emailTicket.url.includes('mail.google.com'), 'Churchill ticket links to Gmail');
    }

    assert(reservations.length >= 5, `${reservations.length} reservations (expected 5+)`);
    reservations.forEach(r => {
      assert(r.stop.reservation.bookedBy && r.stop.reservation.partySize > 0,
        `Day ${r.day} "${r.stop.name}": ${r.stop.reservation.bookedBy}, party ${r.stop.reservation.partySize}`);
    });

    // ======================== WEATHER ========================
    section('Weather Data');
    dayData.forEach(day => {
      assert(day.weather && day.weather.temp, `Day ${day.number}: weather (${day.weather.temp})`);
      assert(day.weather.icon, `Day ${day.number}: weather icon`);
      assert(day.weather.rain, `Day ${day.number}: rain info`);
    });

    // ======================== TRANSPORT ========================
    section('Transport Directions');
    let transportCount = 0;
    dayData.forEach(day => {
      day.stops.forEach(stop => {
        if (stop.transportDir) {
          transportCount++;
          assert(stop.transportDir.name && stop.transportDir.steps.length > 0,
            `Day ${day.number} "${stop.name}": ${stop.transportDir.steps.length} steps`);
          assert(stop.transportDir.time, `Day ${day.number} "${stop.name}": has time`);
        }
      });
    });
    assert(transportCount >= 10, `${transportCount} transport directions (expected 10+)`);

    // ======================== LINKS ========================
    section('External Links');
    let linkCount = 0;
    const brokenLinks = [];
    dayData.forEach(day => {
      day.stops.forEach(stop => {
        if (stop.link) {
          linkCount++;
          try { new URL(stop.link); } catch { brokenLinks.push(`Day ${day.number} "${stop.name}": ${stop.link}`); }
        }
      });
    });
    assert(linkCount > 20, `${linkCount} external links`);
    assert(brokenLinks.length === 0, 'All links valid URLs', brokenLinks.join('\n'));

    // ======================== DOM ========================
    section('DOM Rendering');
    const dayCards = document.querySelectorAll('.day-card');
    assert(dayCards.length === 8, `8 day cards (got ${dayCards.length})`);

    const dayPills = document.querySelectorAll('.day-pill');
    assert(dayPills.length === 10, `10 pills (got ${dayPills.length})`);

    const marathonCard = document.querySelector('.day-card.marathon');
    assert(marathonCard !== null, 'Marathon card has .marathon class');
    assert(marathonCard && marathonCard.getAttribute('data-day') === '26', 'Marathon card is day 26');

    assert(document.querySelector('.day-pill.marathon') !== null, 'Marathon pill has .marathon class');

    const weatherBars = document.querySelectorAll('.weather-bar');
    assert(weatherBars.length === 8, `8 weather bars (got ${weatherBars.length})`);

    const dots = document.querySelectorAll('.timeline-dot');
    assert(dots.length > 60, `${dots.length} timeline dots (expected 60+)`);

    // ======================== TICKET UI ========================
    section('Ticket UI');
    const ticketBtns = document.querySelectorAll('.ticket-btn-large');
    assert(ticketBtns.length === 4, `4 ticket buttons (got ${ticketBtns.length})`);

    const emailBtn = document.querySelector('a.ticket-btn-large');
    assert(emailBtn !== null, 'Email ticket is <a> element');
    if (emailBtn) {
      assert(emailBtn.getAttribute('target') === '_blank', 'Email ticket opens new tab');
      assert(emailBtn.getAttribute('href').includes('mail.google.com'), 'Email ticket links to Gmail');
    }

    // ======================== MODAL ========================
    section('Ticket Modal');
    const modal = document.getElementById('ticketModal');
    assert(modal !== null, 'Modal exists');
    assert(!modal.classList.contains('open'), 'Modal starts closed');

    viewTicket('Test', 'tickets/tower-of-london.pdf');
    assert(modal.classList.contains('open'), 'viewTicket() opens modal');
    assert(document.getElementById('ticketTitle').textContent === 'Test', 'viewTicket() sets title');
    assert(document.getElementById('ticketIframe').src.includes('tower-of-london.pdf'), 'viewTicket() sets src');
    modal.classList.remove('open');

    // ======================== PACKING ========================
    section('Packing List');
    assert(typeof defaultPackingList === 'object', 'defaultPackingList exists');
    const cats = Object.keys(defaultPackingList);
    assert(cats.length === 5, `5 categories (got ${cats.length})`);

    let totalItems = 0;
    const allIds = [];
    cats.forEach(cat => {
      const items = defaultPackingList[cat];
      assert(items.length > 0, `"${cat}": ${items.length} items`);
      totalItems += items.length;
      items.forEach(i => allIds.push(i.id));
    });
    assert(totalItems >= 30, `${totalItems} packing items (expected 30+)`);
    assert(new Set(allIds).size === allIds.length, `All packing IDs unique (${new Set(allIds).size}/${allIds.length})`);

    // ======================== RESOURCES ========================
    section('Resources Section');
    const resGroups = document.querySelectorAll('.resource-group');
    assert(resGroups.length >= 7, `${resGroups.length} resource groups (expected 7+)`);

    const resLinks = document.querySelectorAll('.resource-item-name a');
    assert(resLinks.length > 15, `${resLinks.length} resource links (expected 15+)`);

    // Churchill in resources
    const churchillDetail = Array.from(document.querySelectorAll('.resource-item-detail'))
      .find(el => el.textContent.includes('Apr 25'));
    assert(churchillDetail !== null, 'Churchill War Rooms resource entry');
    if (churchillDetail) {
      const link = churchillDetail.querySelector('a');
      assert(link && link.textContent.includes('View Tickets'), 'Churchill has "View Tickets" link');
      assert(link && link.href.includes('mail.google.com'), 'Churchill ticket links to Gmail');
    }

    assert(document.querySelector('a[href="tel:999"]') !== null, 'Emergency 999 present');
    assert(document.querySelector('a[href="tel:111"]') !== null, 'NHS 111 present');

    // ======================== CSS ========================
    section('CSS & Layout');
    let maxH = null, hasDark = false, hasPrint = false;
    try {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText === '.day-card.expanded .day-content') maxH = rule.style.maxHeight;
            if (rule.media && rule.media.mediaText.includes('prefers-color-scheme: dark')) hasDark = true;
            if (rule.media && rule.media.mediaText === 'print') hasPrint = true;
          }
        } catch(e) { /* cross-origin sheet */ }
      }
    } catch(e) {}
    // Also check by reading inline style content as fallback
    if (!maxH) {
      const styleText = Array.from(document.querySelectorAll('style')).map(s => s.textContent).join('');
      const match = styleText.match(/\.day-card\.expanded\s+\.day-content\s*\{[^}]*max-height:\s*(\d+px)/);
      if (match) maxH = match[1];
      if (styleText.includes('prefers-color-scheme: dark')) hasDark = true;
      if (styleText.includes('@media print')) hasPrint = true;
    }
    assert(maxH && parseInt(maxH) >= 5000, `Expanded max-height: ${maxH} (>= 5000px)`);
    assert(hasDark, 'Dark mode CSS exists');
    assert(hasPrint, 'Print styles exist');

    // ======================== NAVIGATION ========================
    section('Navigation');
    assert(document.querySelectorAll('.day-pill[data-day]').length === 8, '8 pills with data-day');
    assert(document.querySelector('.day-pill[data-view="resources"]') !== null, 'Resources pill');
    assert(document.querySelector('.day-pill[data-view="packing"]') !== null, 'Packing pill');
    assert(document.getElementById('backToTop') !== null, 'Back-to-top button');

    // ======================== FLIGHT ========================
    section('Flight Info');
    assert(document.getElementById('flightBar') !== null, 'Flight bar exists');
    assert(document.getElementById('flightToggle') !== null, 'Flight toggle exists');
    const routes = Array.from(document.querySelectorAll('.flight-info .route')).map(r => r.textContent);
    assert(routes.some(t => t.includes('SEA') && t.includes('LHR')), 'Outbound SEA->LHR');
    assert(routes.some(t => t.includes('LHR') && t.includes('SEA')), 'Return LHR->SEA');

    // ======================== CUTOFF REGRESSION ========================
    section('Schedule Cutoff (Regression)');
    const sorted = dayData.map(d => ({n:d.number, c:d.stops.length})).sort((a,b) => b.c - a.c);
    assert(sorted[0].c <= 15, `Longest day: ${sorted[0].c} stops (Day ${sorted[0].n})`);

    const longestCard = document.querySelector(`.day-card[data-day="${sorted[0].n}"]`);
    if (longestCard) {
      longestCard.classList.add('expanded');
      const stops = longestCard.querySelectorAll('.stop');
      assert(stops.length === sorted[0].c, `Day ${sorted[0].n}: all ${stops.length} stops in DOM`);
    }

    // ======================== CHECKLISTS ========================
    section('Checklist System');
    const cbs = document.querySelectorAll('.stop-checklist-item input[type="checkbox"]');
    assert(cbs.length > 30, `${cbs.length} checklist items (expected 30+)`);

    let missingKeys = 0;
    cbs.forEach(cb => { if (!cb.getAttribute('data-key')) missingKeys++; });
    assert(missingKeys === 0, `All checkboxes have data-key (${missingKeys} missing)`);

    const key = cbs[0] ? cbs[0].getAttribute('data-key') : '';
    assert(key.match(/^d\d+-s\d+-\d+$/), `Checklist key format correct ("${key}")`);

    // ======================== PWA ========================
    section('PWA Configuration');
    assert(document.querySelector('link[rel="manifest"]') !== null, 'Manifest link');
    const tc = document.querySelector('meta[name="theme-color"]');
    assert(tc && tc.content === '#2d5a3d', 'Theme color');
    assert(document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.content === 'yes', 'Apple web app');
    assert(document.querySelector('meta[name="viewport"]') !== null, 'Viewport meta');

    return { log, passed, failed };
  });

  // Print results
  for (const item of results.log) {
    if (item.s === 'SECTION') {
      console.log(`\n\x1b[33m--- ${item.m} ---\x1b[0m`);
    } else {
      const color = item.s === 'PASS' ? '\x1b[32m' : '\x1b[31m';
      console.log(`  ${color}[${item.s}]\x1b[0m ${item.m}`);
      if (item.d) console.log(`        \x1b[2m${item.d}\x1b[0m`);
    }
  }

  console.log(`\n${'='.repeat(55)}`);
  const summaryColor = results.failed > 0 ? '\x1b[31m' : '\x1b[32m';
  console.log(`${summaryColor}Results: ${results.passed} passed, ${results.failed} failed (${results.passed + results.failed} total)\x1b[0m`);
  console.log('='.repeat(55));

  await browser.close();
  server.close();
  process.exit(results.failed > 0 ? 1 : 0);
});

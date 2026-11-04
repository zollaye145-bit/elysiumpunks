/**
 * Elysium Punks — Whitelist collector (Google Sheets + Apps Script)
 *
 * Setup (5 min):
 * 1. Create a Google Sheet named "Elysium Punks WL". Row 1 headers:
 *    timestamp | wallet | twitter | follow | like | retweet
 * 2. Extensions > Apps Script, paste this whole file, Save.
 * 3. Deploy > New deployment > type "Web app"
 *      Execute as: Me
 *      Who has access: Anyone
 *    Copy the Web app URL (ends with /exec).
 * 4. Paste that URL into CONFIG.SUBMIT_URL in index.html, then redeploy the site.
 */

const SHEET_NAME = ""; // empty = first sheet

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const wallet = String(data.wallet || "").trim();
    const twitter = String(data.twitter || "").trim().replace(/^@/, "");
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) return json_({ ok: false, error: "bad_wallet" });
    if (!/^[A-Za-z0-9_]{1,15}$/.test(twitter)) return json_({ ok: false, error: "bad_handle" });

    const sh = sheet_();
    const last = sh.getLastRow();
    if (last > 1) {
      const existing = sh.getRange(2, 2, last - 1, 2).getValues();
      const w = wallet.toLowerCase(), t = twitter.toLowerCase();
      for (const [ew, et] of existing) {
        if (String(ew).toLowerCase() === w || String(et).toLowerCase() === t) {
          return json_({ ok: true, duplicate: true });
        }
      }
    }
    sh.appendRow([new Date(), wallet, "@" + twitter, !!data.follow, !!data.like, !!data.retweet]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const n = Math.max(0, sheet_().getLastRow() - 1);
  return json_({ count: n });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

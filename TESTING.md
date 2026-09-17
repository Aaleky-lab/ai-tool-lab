# Catalog checks

Serve this directory with any static HTTP server and open index.html. No build step or package installation is required.

## Browser regression checklist

- Initial state: 20 cards and "20 of 20 tools".
- Search: "  lEOnÁrDo  " finds Leonardo AI; "editable transcript" finds Descript; "Typography" finds Ideogram.
- Categories: Video = 7, Images = 5, Writing = 5, Voice / Audio = 3, Research / Productivity = 5. Tools can belong to more than one category.
- Access: Free access available = 17, Paid / trial available = 2, Check current plans = 1.
- Combined: Video + Free access available + "transcript" finds only Descript.
- Empty state: "zzzz-no-match" shows no cards, "0 of 20 tools", and the clear-all action.
- Both reset buttons restore 20 cards and clear both selects and the search field.
- Search Enter does not reload the page; Tab moves from search to Category.
- Every card is one anchor to tool.html?tool=<id>, without nested interactive elements.
- Open Leonardo AI and Descript, verify their heading and official website link, and return to the collection.
- Check the existing chatgpt.html page and its back link.
- Check 320px and 390px mobile widths and 1280px desktop: no horizontal overflow, readable controls and cards.
- Browser console: no JavaScript warnings or errors during filtering and detail navigation.

## Tool Finder and guide checks

- Tool Finder requires a choice before advancing and shows three steps.
- Video + easy + free recommends CapCut and shows two alternatives.
- Images + creative + any recommends a high-fit image generator.
- Back from the result returns to step three; navigation remains keyboard accessible.
- All five guide cards open a unique page with one H1, canonical URL, description and links back to the catalog.
- Affiliate disclosure is linked from the homepage, guides and dynamic detail page.
- `robots.txt` points to `sitemap.xml`; every URL in the sitemap resolves.
- `analytics.js` sends no network request while `GA4_ID` is empty, but pushes named events into `dataLayer`.

These checks were exercised in the in-app Chromium browser during implementation. JavaScript syntax and whitespace checks also passed:

```sh
node --check tools.js
node --check catalog.js
git diff --check
```

## Maintaining metadata

Each entry in tools.js retains the existing detail fields and adds:

- categories: an array of the filter labels offered in index.html.
- access: free, trial, or unknown. These reflect the existing free-text access summaries, not a new audit of provider pricing. In particular, Midjourney remains unknown.
- tags: an optional array of additional search terms.

Keep filter labels, metadata and expected counts in this checklist in sync when adding tools. Search matches all entered words across name, description, category tags, best-for text and optional tags, ignoring case, accents and excess whitespace.

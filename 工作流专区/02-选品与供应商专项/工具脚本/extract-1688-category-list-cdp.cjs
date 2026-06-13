const http = require("http");
const WebSocket = require("ws");

const port = process.argv[2] || "9223";
const categoryUrl = process.argv[3];
const waitMs = Number(process.argv[4] || 5000);

if (!categoryUrl) {
  console.error("Usage: node extract-1688-category-list-cdp.cjs <port> <categoryUrl> [waitMs]");
  process.exit(1);
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", reject);
  });
}

async function connect(page) {
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.on("open", resolve);
    ws.on("error", reject);
  });

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 1e9);
      const onMessage = (data) => {
        const msg = JSON.parse(data);
        if (msg.id === id) {
          ws.off("message", onMessage);
          resolve(msg);
        }
      };
      ws.on("message", onMessage);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  return { ws, send };
}

async function main() {
  const pages = (await getJson(`http://127.0.0.1:${port}/json`)).filter(
    (target) => target.type === "page",
  );
  const categoryId = (categoryUrl.match(/offerlist_(-?\d+)/) || [])[1] || "";
  const page =
    pages.find((target) => categoryId && target.url.includes(`offerlist_${categoryId}`)) ||
    pages.find((target) => target.url.includes("yixingfangsc.1688.com/page/offerlist")) ||
    pages[0];
  if (!page) throw new Error("No CDP page target found");

  const { ws, send } = await connect(page);
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.navigate", { url: categoryUrl });
  await new Promise((resolve) => setTimeout(resolve, waitMs));

  // Trigger lazy images and card rendering.
  for (const y of [0, 500, 1000, 1500]) {
    await send("Runtime.evaluate", {
      expression: `window.scrollTo(0, ${y})`,
      returnByValue: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 650));
  }
  await send("Runtime.evaluate", { expression: "window.scrollTo(0, 0)", returnByValue: true });
  await new Promise((resolve) => setTimeout(resolve, 500));

  const result = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const sold = String.fromCharCode(24050, 21806);
      const mix = String.fromCharCode(28151, 25209);
      const bodyText = document.body.innerText || "";
      const recommend = [...document.querySelectorAll("*")]
        .map((el) => {
          const text = (el.innerText || "").trim().replace(/\\s+/g, " ");
          const rect = el.getBoundingClientRect();
          return { text, top: rect.top + window.scrollY };
        })
        .filter((item) => item.text.startsWith(String.fromCharCode(20026, 20320, 25512, 33616)))
        .sort((a, b) => a.top - b.top)[0];
      const recommendTop = recommend ? recommend.top : Infinity;

      function imageUrls(el) {
        const urls = [];
        for (const img of el.querySelectorAll("img")) {
          urls.push(img.currentSrc || img.src || img.getAttribute("data-src") || img.getAttribute("src") || "");
        }
        for (const node of [el, ...el.querySelectorAll("*")]) {
          const bg = getComputedStyle(node).backgroundImage || "";
          const match = bg.match(/url\\(["']?([^"')]+)["']?\\)/);
          if (match) urls.push(match[1]);
        }
        return [...new Set(urls)]
          .filter(Boolean)
          .filter((src) => !src.startsWith("data:image/gif"))
          .map((src) => src.startsWith("//") ? "https:" + src : src)
          .filter((src) => /alicdn|alicdn\\.com|cbu01|gw\\.alicdn/.test(src));
      }

      const candidates = [...document.querySelectorAll("*")]
        .map((el) => {
          const text = (el.innerText || "").trim().replace(/\\s+/g, " ");
          const rect = el.getBoundingClientRect();
          const pageTop = rect.top + window.scrollY;
          const imgs = imageUrls(el);
          return {
            text,
            pageTop,
            rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
            imgs,
          };
        })
        .filter((item) =>
          item.text.includes(sold) &&
          (item.text.includes("¥") || item.text.includes("￥")) &&
          item.rect.width >= 200 &&
          item.rect.width <= 260 &&
          item.rect.height >= 280 &&
          item.rect.height <= 380 &&
          item.pageTop < recommendTop
        )
        .sort((a, b) => (a.pageTop - b.pageTop) || (a.rect.left - b.rect.left));

      const deduped = [];
      const seen = new Set();
      for (const item of candidates) {
        const name = item.text.split(mix)[0].trim();
        const key = name || item.text;
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push({
          text: item.text,
          image: item.imgs[0] || "",
          pageTop: item.pageTop,
          rect: item.rect,
        });
      }

      return {
        title: document.title,
        url: location.href,
        categoryId: ${JSON.stringify(categoryId)},
        bodyText,
        recommendTop,
        candidateCount: candidates.length,
        productCount: deduped.length,
        products: deduped,
      };
    })()`,
  });

  ws.close();
  console.log(JSON.stringify(result.result.result.value, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

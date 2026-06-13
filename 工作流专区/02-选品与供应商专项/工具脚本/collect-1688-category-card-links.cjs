const http = require("http");
const WebSocket = require("ws");

const port = process.argv[2] || "9223";
const categoryUrl =
  process.argv[3] || "https://yixingfangsc.1688.com/page/offerlist_208785104.htm";
const maxCards = Number(process.argv[4] || 10);
const startIndex = Number(process.argv[5] || 0);

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

async function pages() {
  return (await getJson(`http://127.0.0.1:${port}/json`)).filter(
    (target) => target.type === "page",
  );
}

async function main() {
  let page =
    (await pages()).find((target) => target.url.includes("offerlist_208785104")) ||
    (await pages()).find((target) => target.url.includes("yixingfangsc.1688.com/page/offerlist"));
  if (!page) throw new Error("No category page target found");

  const { ws, send } = await connect(page);
  await send("Page.enable");
  await send("Runtime.enable");

  const results = [];
  for (let i = startIndex; i < startIndex + maxCards; i += 1) {
    await send("Page.navigate", { url: categoryUrl });
    await new Promise((resolve) => setTimeout(resolve, 3500));

    const before = new Set(
      (await pages())
        .map((target) => target.url)
        .filter((url) => url.includes("detail.1688.com/offer/")),
    );

    const located = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const sold = String.fromCharCode(24050, 21806);
        const cards = [...document.querySelectorAll("*")]
          .map((el) => {
            const text = (el.innerText || "").trim().replace(/\\s+/g, " ");
            const rect = el.getBoundingClientRect();
            const imgs = [...el.querySelectorAll("img")]
              .map((img) => img.currentSrc || img.src || img.getAttribute("data-src") || img.getAttribute("src"))
              .filter(Boolean);
            return { el, text, rect, imgs };
          })
          .filter(({ text, rect, imgs }) =>
            text.includes(sold) &&
            text.includes("¥") &&
            imgs.length === 1 &&
            rect.width >= 210 &&
            rect.width <= 245 &&
            rect.height >= 300 &&
            rect.height <= 350 &&
            rect.top < 1150
          )
          .sort((a, b) => (a.rect.top - b.rect.top) || (a.rect.left - b.rect.left));
        const item = cards[${i}];
        if (!item) return { count: cards.length, item: null };
        item.el.scrollIntoView({ block: "center", inline: "center" });
        const r = item.el.getBoundingClientRect();
        return {
          count: cards.length,
          item: {
            text: item.text,
            image: item.imgs[0] || "",
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
            rect: { left: r.left, top: r.top, width: r.width, height: r.height }
          }
        };
      })()`,
    });

    const value = located.result.result.value;
    const item = value && value.item;
    if (!item) {
      results.push({ index: i + 1, status: "not_found", count: value ? value.count : null });
      continue;
    }

    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: item.x,
      y: item.y,
      button: "none",
    });
    await send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      x: item.x,
      y: item.y,
      button: "left",
      clickCount: 1,
    });
    await send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      x: item.x,
      y: item.y,
      button: "left",
      clickCount: 1,
    });
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const detailPages = (await pages()).filter((target) =>
      target.url.includes("detail.1688.com/offer/"),
    );
    const fresh = detailPages.find((target) => !before.has(target.url));
    const matching = detailPages.find((target) =>
      target.title && item.text && target.title.includes(item.text.slice(0, 12)),
    );

    const found = fresh || matching;
    results.push({
      index: i + 1,
      text: item.text,
      image: item.image,
      detailTitle: found ? found.title : "",
      detailUrl: found ? found.url : "",
      status: found ? "ok" : "detail_not_found",
    });
  }

  ws.close();
  console.log(JSON.stringify({ categoryUrl, results }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

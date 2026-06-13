const http = require("http");
const WebSocket = require("ws");

const port = process.argv[2] || "9223";
const listUrl =
  process.argv[3] ||
  "https://yixingfangsc.1688.com/page/offerlist.htm?keywords=%E7%A4%BC%E7%9B%92";
const waitMs = Number(process.argv[4] || 1800);

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

async function listPages() {
  return (await getJson(`http://127.0.0.1:${port}/json`)).filter(
    (target) => target.type === "page",
  );
}

async function main() {
  let pages = await listPages();
  let page =
    pages.find((target) => target.url.includes("yixingfangsc.1688.com/page/offerlist")) ||
    pages.find((target) => /1688/.test(target.url)) ||
    pages[0];
  if (!page) throw new Error("No CDP page target found");

  const { ws, send } = await connect(page);
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.navigate", { url: listUrl });
  await new Promise((resolve) => setTimeout(resolve, 3500));

  const countResult = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const cards = [...document.querySelectorAll("*")]
        .map((el) => {
          const text = (el.innerText || "").trim().replace(/\\s+/g, " ");
          const rect = el.getBoundingClientRect();
          return { text, rect };
        })
        .filter(({ text, rect }) =>
          text.includes("\\u6df7\\u6279") &&
          text.includes("¥") &&
          rect.width >= 180 &&
          rect.width <= 280 &&
          rect.height >= 220 &&
          rect.height <= 400
        );
      return cards.map(({ text }) => text);
    })()`,
  });

  const cardTexts = countResult.result.result.value || [];
  const collected = [];

  for (let i = 0; i < cardTexts.length; i += 1) {
    await send("Page.navigate", { url: listUrl });
    await new Promise((resolve) => setTimeout(resolve, waitMs));

    const before = new Set(
      (await listPages())
        .map((target) => target.url)
        .filter((url) => url.includes("detail.1688.com/offer/")),
    );

    const productName = (cardTexts[i] || "").split(" 混批 ")[0];
    let item = null;

    for (const scrollY of [0, 360, 720, 1080, 1440, 1800, 2160]) {
      await send("Runtime.evaluate", {
        expression: `window.scrollTo(0, ${scrollY})`,
        returnByValue: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 650));

      const locatedResult = await send("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const needle = ${JSON.stringify(productName)};
          const cards = [...document.querySelectorAll("*")]
            .map((el) => {
              const text = (el.innerText || "").trim().replace(/\\s+/g, " ");
              const rect = el.getBoundingClientRect();
              return { el, text, rect };
            })
            .filter(({ text, rect }) =>
              text.includes("\\u6df7\\u6279") &&
              text.includes("¥") &&
              rect.width >= 180 &&
              rect.width <= 280 &&
              rect.height >= 220 &&
              rect.height <= 400
            );
          let item = cards.find(({ text }) => text.includes(needle));
          if (!item && ${i} < cards.length) item = cards[${i}];
          if (!item) return null;
          return {
            text: item.text,
            x: item.rect.left + item.rect.width / 2,
            y: item.rect.top + item.rect.height / 2,
            rect: {
              left: item.rect.left,
              top: item.rect.top,
              width: item.rect.width,
              height: item.rect.height
            },
            count: cards.length,
            scrollY: window.scrollY
          };
        })()`,
      });
      item = locatedResult.result.result.value;
      if (item) break;
    }

    if (!item) {
      collected.push({ index: i + 1, text: cardTexts[i], detailUrl: "", status: "card not found" });
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
    pages = await listPages();
    const detailPage = pages.find(
      (target) =>
        target.url.includes("detail.1688.com/offer/") && !before.has(target.url),
    );
    const sameProductDetail = pages.find(
      (target) =>
        target.url.includes("detail.1688.com/offer/") &&
        target.title &&
        target.title.includes(productName.slice(0, 18)),
    );
    const found = detailPage || sameProductDetail;

    collected.push({
      index: i + 1,
      text: item.text,
      title: found ? found.title : "",
      detailUrl: found ? found.url : "",
      status: found ? "ok" : "detail not found",
    });
  }

  ws.close();
  console.log(JSON.stringify({ listUrl, count: cardTexts.length, collected }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

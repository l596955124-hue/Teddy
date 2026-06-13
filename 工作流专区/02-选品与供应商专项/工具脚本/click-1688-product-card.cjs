const http = require("http");
const WebSocket = require("ws");

const port = process.argv[2] || "9223";
const cardIndex = Number(process.argv[3] || 0);

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

async function main() {
  const pages = (await getJson(`http://127.0.0.1:${port}/json`)).filter(
    (target) => target.type === "page",
  );
  const page =
    pages.find((target) => target.url.includes("yixingfangsc.1688.com/page/offerlist")) ||
    pages.find((target) => /yixingfangsc|1688/.test(target.url)) ||
    pages[0];
  if (!page) throw new Error("No CDP page target found");

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

  const locateExpression = `(() => {
    const cards = [...document.querySelectorAll("*")]
      .map((el) => {
        const text = (el.innerText || "").trim().replace(/\\s+/g, " ");
        const rect = el.getBoundingClientRect();
        return { el, text, rect };
      })
      .filter(({ text, rect }) =>
        text.includes("混批") &&
        text.includes("¥") &&
        rect.width >= 180 &&
        rect.width <= 260 &&
        rect.height >= 220 &&
        rect.height <= 380
      );
    const item = cards[${cardIndex}];
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
      count: cards.length
    };
  })()`;

  const located = await send("Runtime.evaluate", {
    expression: locateExpression,
    returnByValue: true,
  });
  const item = located.result.result.value;
  console.log(JSON.stringify({ located: item }, null, 2));
  if (!item) {
    ws.close();
    return;
  }

  await send("Runtime.evaluate", {
    expression: `(() => {
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
      const item = cards[${cardIndex}];
      if (!item) return false;
      item.el.scrollIntoView({ block: "center", inline: "center" });
      item.el.click();
      return true;
    })()`,
    returnByValue: true,
  });
  await new Promise((resolve) => setTimeout(resolve, 2500));
  ws.close();

  const afterPages = (await getJson(`http://127.0.0.1:${port}/json`)).filter(
    (target) => target.type === "page",
  );
  console.log(JSON.stringify({ pages: afterPages.map((p) => ({ title: p.title, url: p.url })) }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

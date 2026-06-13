const http = require("http");
const WebSocket = require("ws");

const port = process.argv[2] || "9223";

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
    pages.find((target) => /yixingfangsc|1688/.test(target.url)) || pages[0];
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

  const expression = `(() => {
    const text = document.body.innerText || "";
    const html = document.documentElement.innerHTML || "";
    const patterns = [
      /offerId["']?\\s*[:=]\\s*["']?(\\d{8,})/ig,
      /offer\\/(\\d{8,})/ig,
      /detail\\.1688\\.com\\/offer\\/(\\d{8,})/ig,
      /offerId=(\\d{8,})/ig
    ];
    const ids = new Set();
    for (const re of patterns) {
      let match;
      while ((match = re.exec(html))) ids.add(match[1]);
    }

    const interestingElements = [...document.querySelectorAll("*")]
      .map((el, index) => {
        const obj = {
          index,
          tag: el.tagName,
          cls: String(el.className || "").slice(0, 160),
          text: (el.innerText || el.textContent || "")
            .trim()
            .replace(/\\s+/g, " ")
            .slice(0, 240),
        };
        for (const attr of el.attributes || []) {
          if (/offer|href|url|data|id|spm|trace/i.test(attr.name + attr.value)) {
            obj[attr.name] = attr.value;
          }
        }
        return obj;
      })
      .filter((item) => {
        const blob = JSON.stringify(item);
        return (
          /offer|detail|1688|item|\\d{8,}/i.test(blob) ||
          /¥|已售|混批/.test(item.text)
        );
      })
      .slice(0, 300);

    return {
      title: document.title,
      url: location.href,
      text,
      htmlLength: html.length,
      offerIds: [...ids],
      interestingElements,
    };
  })()`;

  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  console.log(JSON.stringify(result.result.result.value, null, 2));
  ws.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

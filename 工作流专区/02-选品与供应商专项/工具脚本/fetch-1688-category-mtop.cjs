const http = require("http");
const WebSocket = require("ws");

const port = process.argv[2] || "9223";
const categoryId = process.argv[3];
const pageCount = Number(process.argv[4] || 1);
const count = Number(process.argv[5] || 30);

if (!categoryId) {
  console.error("Usage: node fetch-1688-category-mtop.cjs <port> <categoryId> <pageCount> [count]");
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
  const categoryUrl = `https://yixingfangsc.1688.com/page/offerlist_${categoryId}.htm`;
  const pages = (await getJson(`http://127.0.0.1:${port}/json`)).filter(
    (target) => target.type === "page",
  );
  const page =
    pages.find((target) => target.url.includes(`offerlist_${categoryId}`)) ||
    pages.find((target) => target.url.includes("yixingfangsc.1688.com/page/offerlist")) ||
    pages[0];
  if (!page) throw new Error("No CDP page target found");

  const { ws, send } = await connect(page);
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.navigate", { url: categoryUrl });
  await new Promise((resolve) => setTimeout(resolve, 4500));

  const result = await send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `new Promise(async (resolve) => {
      const categoryId = ${JSON.stringify(categoryId)};
      const pageCount = ${pageCount};
      const count = ${count};
      const pages = [];
      function requestPage(pageNum) {
        return new Promise((done) => {
          window.lib.mtop.request({
            api: "mtop.alibaba.alisite.cbu.server.ModuleAsyncService",
            data: {
              componentKey: "Wp_pc_common_offerlist",
              params: JSON.stringify({
                memberId: "yixingfangsc",
                appdata: {
                  catId: categoryId,
                  pageNum,
                  count,
                  sortType: "wangpu_score",
                  sellerRecommendFilter: false,
                  mixFilter: false,
                  tradenumFilter: false,
                  quantityBegin: null
                }
              })
            },
            v: "1.0",
            ecode: 0,
            type: "POST",
            valueType: "string",
            dataType: "jsonp",
            timeout: 10000
          }, function(res) {
            const content = res && res.data && res.data.content ? res.data.content : null;
            done({ ok: true, pageNum, content });
          }, function(err) {
            done({ ok: false, pageNum, error: String(err) });
          });
        });
      }
      for (let pageNum = 1; pageNum <= pageCount; pageNum += 1) {
        pages.push(await requestPage(pageNum));
        await new Promise((r) => setTimeout(r, 450));
      }
      resolve({ categoryId, categoryUrl: location.href, pages });
    })`,
  });

  ws.close();
  console.log(JSON.stringify(result.result.result.value, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

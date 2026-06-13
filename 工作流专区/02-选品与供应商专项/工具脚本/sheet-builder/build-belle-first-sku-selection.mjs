import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "D:/Teddy创业项目/工作流专区/02-选品与供应商专项";
const outputDir = `${root}/SKU表`;
const outputPath = `${outputDir}/TEDDY BELLE高端店首批候选SKU-第一批-20260608.xlsx`;
const previewPath = `${outputDir}/TEDDY BELLE高端店首批候选SKU-第一批-20260608-preview.png`;

function htmlDecode(text = "") {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(text = "") {
  return htmlDecode(text.replace(/<[^>]+>/g, " "));
}

function meta(html, property) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]+content=["']([^"']+)["']`, "i");
  return html.match(re)?.[1] || "";
}

function absUrl(url, base) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return new URL(url, base).toString();
}

const rows = [];
let sequence = 1;

function add(item) {
  rows.push([
    sequence++,
    item.brand,
    item.name,
    item.image || "",
    item.model || "",
    item.price || "",
    item.currency || "CNY",
    item.link,
    item.category || "",
    item.source || "",
    item.note || "",
  ]);
}

// SVAKOM official Shopify JSON.
const svakomData = JSON.parse(await fs.readFile(`${root}/供应商资料/svakom-products-20260608.json`, "utf8"));
const svakomWanted = [
  "CICI Slim Flexible G-Spot Vibrator",
  "ELLA NEO Interactive App-Controlled Egg Vibrator",
  "MINI EMMA NEO Interactive Compact Wand Vibrator",
  "TULIP",
  "PULSE UNION",
  "PHOENIX NEO",
  "VICK NEO",
  "ECHO NEO",
  "COCO",
  "IRIS",
  "AVA NEO",
  "ALYA",
];
for (const wanted of svakomWanted) {
  const product = svakomData.products.find((p) => p.title.toLowerCase().includes(wanted.toLowerCase()));
  if (!product) continue;
  const variant = product.variants?.[0] || {};
  add({
    brand: "SVAKOM",
    name: product.title,
    image: product.images?.[0]?.src || product.image?.src || "",
    model: variant.sku || product.handle,
    price: variant.price ? Number(variant.price) : "",
    currency: "USD",
    link: `https://www.svakom.com/products/${product.handle}`,
    category: product.product_type || "高端女性/情侣器具",
    source: "SVAKOM官方产品JSON",
    note: "官方零售价参考；需确认中国授权和平台可售",
  });
}

// OMYSKY product pages.
const omyskyFiles = [
  "omysky-gspot-rabbit-20260608.html",
  "omysky-vibrating-egg-20260608.html",
  "omysky-lipstick-20260608.html",
];
for (const file of omyskyFiles) {
  const html = await fs.readFile(`${root}/供应商资料/${file}`, "utf8");
  const title = htmlDecode(meta(html, "og:title")).replace(" - OMYSKY Official Website", "");
  const image = htmlDecode(meta(html, "og:image"));
  const link = htmlDecode(meta(html, "og:url"));
  const price = meta(html, "product:price:amount") || html.match(/woocommerce-Price-amount amount[^>]*>.*?([0-9]+(?:\.[0-9]+)?)/s)?.[1] || "";
  const sku = stripTags(html.match(/<span class="sku">([\s\S]*?)<\/span>/)?.[1] || "");
  add({
    brand: "OMYSKY",
    name: title,
    image,
    model: sku || link.split("/").filter(Boolean).at(-1),
    price: price ? Number(price) : "",
    currency: "USD",
    link,
    category: "萌趣/入门女性器具",
    source: "OMYSKY官网产品页",
    note: "海外官网零售价参考；需确认国内代理价和授权",
  });
}

// ZEMALIA list page.
const zemaliaHtml = await fs.readFile(`${root}/供应商资料/zemalia-products-page-20260608.html`, "utf8");
const productBlocks = zemaliaHtml.split(/class="product-thumb product-wrapper/).slice(1);
for (const block of productBlocks.slice(0, 16)) {
  const link = absUrl(htmlDecode(block.match(/<h4 class="name"><a\s+href="([^"]+)"/)?.[1] || block.match(/href="([^"]+)"\s+class="has-second-image"/)?.[1] || ""), "https://www.zemalia.com.cn/");
  const name = stripTags(block.match(/<h4 class="name"><a[^>]*>([\s\S]*?)<\/a><\/h4>/)?.[1] || "");
  const image =
    absUrl(htmlDecode(block.match(/data-lazyload="([^"]+)"/)?.[1] || block.match(/src="([^"]+)"/)?.[1] || ""), "https://www.zemalia.com.cn/");
  const priceText = stripTags(block.match(/class="price">([\s\S]*?)<\/div>/)?.[1] || "");
  const price = Number((priceText.match(/([0-9]+(?:\.[0-9]+)?)/) || [])[1]) || "";
  if (!name || !link) continue;
  add({
    brand: "ZEMALIA/枕木恋",
    name,
    image,
    model: link.split("/").filter(Boolean).at(-1) || "",
    price,
    currency: "CNY",
    link,
    category: "新手友好/轻高端",
    source: "ZEMALIA中国官网产品列表",
    note: price ? "官网列表价参考；需确认批发价" : "官网未显示价格；需联系品牌确认供货价",
  });
}

// TRYFUN: official China product pages + retail reference where price is available.
const tryfunManual = [
  {
    brand: "TRYFUN/春风",
    name: "春风矜系列点潮震动棒",
    image: "https://www.tryfun.cn/products/p000019",
    model: "矜系列/粉色*1",
    price: 185,
    currency: "CNY",
    link: "https://www.tryfun.cn/products/p000019",
    category: "女性友好小型器具",
    source: "TRYFUN官网+亮健好药网零售价参考",
    note: "第三方页面显示参考价185元；需确认品牌供货价",
  },
  {
    brand: "TRYFUN/春风",
    name: "春风Kiss系列啵啵汪",
    image: "https://www.tryfun.cn/products/p000018",
    model: "TF-Kiss-dog01 / TF-Kiss-dog02",
    price: "",
    currency: "CNY",
    link: "https://www.tryfun.cn/products/p000018",
    category: "萌趣低尴尬/女性友好器具",
    source: "TRYFUN官网",
    note: "官网展示型号但未显示价格；需联系品牌确认供货价",
  },
  {
    brand: "TRYFUN/春风",
    name: "Meta Series 2 Smart Masturbator Group",
    image: "https://www.tryfun.com/products/meta-series-2-smart-masturbator-group",
    model: "Meta Series 2 Host / Group",
    price: 282,
    currency: "USD",
    link: "https://www.tryfun.com/products/meta-series-2-smart-masturbator-group",
    category: "高客单门面/智能互动",
    source: "TRYFUN海外官网",
    note: "偏男用/互动科技；BELLE只建议少量门面或不进首批",
  },
  {
    brand: "TRYFUN/春风",
    name: "Meta Series 2 Liner Stella",
    image: "https://www.tryfun.com/products/meta-series-2-liner-stella",
    model: "Liner Stella",
    price: 70,
    currency: "USD",
    link: "https://www.tryfun.com/products/meta-series-2-liner-stella",
    category: "配件/智能互动",
    source: "TRYFUN海外官网",
    note: "配件型；优先级低于女性友好器具和润滑计生",
  },
];
tryfunManual.forEach(add);

// ANKNI placeholders from public brand info; precise SKU pages need next pass.
[
  ["ANKNI/安可尼", "安可尼女性入门器具候选款", "", "待查具体型号", "", "CNY", "https://m.maigoo.com/brand/4173611.html", "中高端女性器具", "品牌资料页", "已找到品牌电话0577-56890696；下一步需从官方/代理获取产品链接和价格"],
  ["ANKNI/安可尼", "安可尼便携/萌趣款候选", "", "待查具体型号", "", "CNY", "https://m.maigoo.com/brand/4173611.html", "便携/萌趣器具", "品牌资料页", "适合利润线；待补具体SKU"],
].forEach(([brand, name, image, model, price, currency, link, category, source, note]) => add({ brand, name, image, model, price, currency, link, category, source, note }));

const headers = ["序号", "品牌", "名称", "图片", "型号", "单价", "币种", "售卖链接", "建议类目", "数据来源", "备注"];

await fs.mkdir(outputDir, { recursive: true });
const workbook = Workbook.create();
const sheet = workbook.worksheets.add("BELLE候选SKU");
const notes = workbook.worksheets.add("说明");
sheet.showGridLines = false;
notes.showGridLines = false;

sheet.getRange("A1:K1").values = [headers];
sheet.getRange(`A2:K${rows.length + 1}`).values = rows;
sheet.getRange("A1:K1").format = {
  fill: "#7A4E8A",
  font: { bold: true, color: "#FFFFFF" },
  alignment: { horizontal: "center", vertical: "middle", wrapText: true },
};
sheet.getRange(`A2:K${rows.length + 1}`).format = {
  alignment: { vertical: "top", wrapText: true },
  borders: { preset: "all", style: "thin", color: "#E5D6EA" },
};
sheet.getRange("A:A").format.columnWidthPx = 52;
sheet.getRange("B:B").format.columnWidthPx = 130;
sheet.getRange("C:C").format.columnWidthPx = 360;
sheet.getRange("D:D").format.columnWidthPx = 420;
sheet.getRange("E:E").format.columnWidthPx = 190;
sheet.getRange("F:G").format.columnWidthPx = 80;
sheet.getRange("H:H").format.columnWidthPx = 390;
sheet.getRange("I:K").format.columnWidthPx = 190;
sheet.getRange(`F2:F${rows.length + 1}`).format.numberFormat = "0.00";
sheet.freezePanes.freezeRows(1);
sheet.freezePanes.freezeColumns(3);
sheet.tables.add(`A1:K${rows.length + 1}`, true, "BelleFirstCandidateSku");

notes.getRange("A1:B9").values = [
  ["项目", "说明"],
  ["生成日期", "2026-06-08"],
  ["用途", "TEDDY BELLE高端店第一批候选SKU明细，字段按用户要求：品牌、名称、图片、型号、单价、售卖链接"],
  ["价格口径", "当前多为官方零售价/公开零售价参考，不等于最终采购价或平台售价"],
  ["授权口径", "所有SKU仍需确认品牌授权、美团/饿了么/淘宝闪购可售范围和供货价"],
  ["TRYFUN说明", "国内官网部分产品只展示型号不展示价格，表内使用可追溯零售价参考或留空待补"],
  ["ANKNI说明", "已找到品牌电话和品牌资料，但具体SKU链接需下一步从官方/代理补齐"],
  ["下一步", "继续扩展到每个品牌10-30个SKU，并加入评分、采购价、建议售价、毛利率"],
  ["保存位置", outputPath],
];
notes.getRange("A1:B1").format = { fill: "#7A4E8A", font: { bold: true, color: "#FFFFFF" } };
notes.getRange("A:A").format.columnWidthPx = 120;
notes.getRange("B:B").format.columnWidthPx = 820;
notes.getRange("A1:B9").format = {
  alignment: { vertical: "top", wrapText: true },
  borders: { preset: "all", style: "thin", color: "#E5D6EA" },
};

const inspected = await workbook.inspect({
  kind: "table",
  range: "BELLE候选SKU!A1:K10",
  include: "values",
  tableMaxRows: 10,
  tableMaxCols: 11,
  tableMaxCellChars: 90,
});
console.log(inspected.ndjson);

const preview = await workbook.render({ sheetName: "BELLE候选SKU", range: "A1:K16", autoCrop: "all", scale: 1, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);

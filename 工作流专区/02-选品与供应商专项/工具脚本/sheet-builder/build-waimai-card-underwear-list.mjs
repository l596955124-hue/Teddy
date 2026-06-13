import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "D:/Teddy创业项目/工作流专区/02-选品与供应商专项";
const inputPath = `${root}/供应商资料/1688醉清风-外卖实体带图片卡纸内衣-mtop-allpages-20260607.json`;
const outputDir = `${root}/SKU表`;
const outputPath = `${outputDir}/1688醉清风-外卖实体带图片卡纸内衣-列表层-20260607.xlsx`;
const previewPath = `${outputDir}/1688醉清风-外卖实体带图片卡纸内衣-列表层-20260607-preview.png`;

const supplier = "上海醉清风健康科技股份有限公司";
const sourcePlatform = "1688";
const categoryName = "【外卖实体】带图片卡纸内衣";
const categoryId = "207640198";
const categoryUrl = "https://yixingfangsc.1688.com/page/offerlist_207640198.htm";
const collectedAt = "2026-06-07";

function normalizeImage(uri) {
  if (!uri) return "";
  if (uri.startsWith("http")) return uri;
  if (uri.startsWith("//")) return `https:${uri}`;
  return `https://cbu01.alicdn.com/${uri.replace(/^\/+/, "")}`;
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return "";
  const n = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : "";
}

function inferBrand(subject) {
  const brands = [
    "霏慕",
    "谜姬",
    "醉清风",
    "安可尼",
    "杜蕾斯",
    "冈本",
    "名流",
    "大象",
    "杰士邦",
    "第六感",
    "倍力乐",
    "尚牌",
  ];
  return brands.find((brand) => subject.includes(brand)) || "未标明";
}

function extractModel(subject) {
  const codes = [...subject.matchAll(/(?<!\d)(\d{4}(?:-\d{4})?)(?!\d)/g)].map((m) => m[1]);
  return [...new Set(codes)].join(" / ");
}

function extractSpec(subject) {
  const specs = [];
  const packMatches = [...subject.matchAll(/(\d+\s*(?:\/|件\/)\s*包|\d+\s*包|盒装|单支|一盒|一套)/g)].map((m) =>
    m[1].replace(/\s+/g, ""),
  );
  specs.push(...packMatches);

  const keywords = [
    "包芯丝",
    "连裤袜",
    "长筒袜",
    "网袜",
    "蕾丝",
    "开裆",
    "高弹",
    "免洗",
    "卡纸",
    "黑丝",
  ];
  const hit = keywords.filter((word) => subject.includes(word));
  specs.push(...hit.slice(0, 4));

  return [...new Set(specs)].join(" / ") || "列表标题待拆分";
}

function getEvaluateTag(offer) {
  if (offer.offerSellPoint?.evaluateTag) return offer.offerSellPoint.evaluateTag;
  const point = offer.offerPointModelList?.find((item) => item.pointCode === "evaluateTag");
  return point?.pointText || "";
}

function getOffers(data) {
  const rows = [];
  for (const page of data.pages || []) {
    const offerList = page.content?.offerList || page.content?.offerListDataModel?.offerList || [];
    for (const offer of offerList) {
      rows.push({ pageNum: page.pageNum, offer });
    }
  }
  return rows;
}

const raw = await fs.readFile(inputPath, "utf8");
const data = JSON.parse(raw.replace(/^\uFEFF/, ""));
const offers = getOffers(data);

const rows = offers.map(({ pageNum, offer }, index) => {
  const subject = offer.subject || "";
  const price = toNumber(offer.handPrice || offer.offerPrice || offer.originalPrice);
  const discount = toNumber(offer.discountPrice) || "";
  const listPrice = toNumber(offer.underLinePrice || offer.originalPrice || offer.consignPrice);
  const image = normalizeImage(offer.offerImages?.[0]?.size310x310ImageURI || offer.offerImages?.[0]?.imageURI);
  const link = offer.id ? `https://detail.1688.com/offer/${offer.id}.html` : categoryUrl;

  return [
    index + 1,
    supplier,
    sourcePlatform,
    categoryName,
    categoryId,
    pageNum,
    offer.id || "",
    inferBrand(subject),
    subject,
    image,
    extractSpec(subject),
    extractModel(subject),
    price,
    discount,
    listPrice,
    offer.quantityBegin || "",
    offer.unit || "",
    offer.vagueSaleQuantity || "",
    toNumber(offer.bookedCount),
    toNumber(offer.thirtySaleQuantity),
    getEvaluateTag(offer),
    link,
    "Mtop列表接口已采集",
    "列表层可用于初筛；颜色/尺码/SKU阶梯价需后续详情页增强",
  ];
});

const headers = [
  "序号",
  "供应商",
  "来源平台",
  "1688类目",
  "类目ID",
  "页码",
  "商品ID",
  "品牌",
  "商品名称",
  "图片URL",
  "规格/型号",
  "系列/货号",
  "单价(元)",
  "优惠价(元)",
  "划线价/原价(元)",
  "起批量",
  "单位",
  "销量展示",
  "累计下单数",
  "30天销量",
  "评价/卖点",
  "下单链接",
  "采集状态",
  "备注",
];

await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const sku = workbook.worksheets.add("SKU列表");
const summary = workbook.worksheets.add("采集说明");

sku.showGridLines = false;
sku.getRange("A1:X1").values = [headers];
sku.getRange(`A2:X${rows.length + 1}`).values = rows;

sku.getRange("A1:X1").format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
  alignment: { horizontal: "center", vertical: "middle", wrapText: true },
};
sku.getRange(`A2:X${rows.length + 1}`).format = {
  alignment: { vertical: "top", wrapText: true },
  borders: { preset: "all", style: "thin", color: "#D9E2F3" },
};
sku.getRange("A:A").format.columnWidthPx = 48;
sku.getRange("B:B").format.columnWidthPx = 210;
sku.getRange("C:C").format.columnWidthPx = 70;
sku.getRange("D:D").format.columnWidthPx = 190;
sku.getRange("E:G").format.columnWidthPx = 95;
sku.getRange("H:H").format.columnWidthPx = 80;
sku.getRange("I:I").format.columnWidthPx = 430;
sku.getRange("J:J").format.columnWidthPx = 420;
sku.getRange("K:L").format.columnWidthPx = 160;
sku.getRange("M:O").format.columnWidthPx = 100;
sku.getRange("P:Q").format.columnWidthPx = 70;
sku.getRange("R:T").format.columnWidthPx = 95;
sku.getRange("U:U").format.columnWidthPx = 170;
sku.getRange("V:V").format.columnWidthPx = 360;
sku.getRange("W:X").format.columnWidthPx = 190;
sku.getRange(`M2:O${rows.length + 1}`).format.numberFormat = "0.00";
sku.getRange(`S2:T${rows.length + 1}`).format.numberFormat = "0";
sku.freezePanes.freezeRows(1);
sku.freezePanes.freezeColumns(8);
sku.tables.add(`A1:X${rows.length + 1}`, true, "WaimaiCardUnderwearSku");

summary.showGridLines = false;
summary.getRange("A1:B12").values = [
  ["项目", "说明"],
  ["采集时间", collectedAt],
  ["供应商", supplier],
  ["来源店铺", "https://yixingfangsc.1688.com/"],
  ["类目入口", categoryUrl],
  ["类目ID", categoryId],
  ["接口页数", `${data.pages?.length || 0} 页`],
  ["商品数量", `${rows.length} 个列表商品`],
  ["已采字段", "商品ID、名称、主图、单价、优惠价、划线价、起批量、单位、销量展示、累计下单数、30天销量、评价/卖点、下单链接"],
  ["规格型号规则", "先从标题中提取包装数、丝袜/内衣关键词、4位货号；后续详情页增强时补颜色/尺码/完整SKU组合"],
  ["AnySearch用途", "用于入口与类目校验；正式表格以登录态1688接口数据为准"],
  ["下一步", "继续抓取男用、女用、计生、情趣内衣等低端店核心类目，并按800-1000 SKU目标做筛选"],
];
summary.getRange("A1:B1").format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
};
summary.getRange("A:A").format.columnWidthPx = 130;
summary.getRange("B:B").format.columnWidthPx = 780;
summary.getRange("A1:B12").format = {
  alignment: { vertical: "top", wrapText: true },
  borders: { preset: "all", style: "thin", color: "#D9E2F3" },
};

const summaryData = [
  ["指标", "数值"],
  ["商品数量", rows.length],
  ["最低单价", Math.min(...rows.map((r) => r[12]).filter((v) => typeof v === "number"))],
  ["最高单价", Math.max(...rows.map((r) => r[12]).filter((v) => typeof v === "number"))],
  ["平均单价", rows.reduce((sum, r) => sum + (typeof r[12] === "number" ? r[12] : 0), 0) / rows.filter((r) => typeof r[12] === "number").length],
];
summary.getRange("D1:E5").values = summaryData;
summary.getRange("D1:E1").format = {
  fill: "#5B9BD5",
  font: { bold: true, color: "#FFFFFF" },
};
summary.getRange("D1:E5").format = {
  borders: { preset: "all", style: "thin", color: "#D9E2F3" },
  alignment: { vertical: "middle" },
};
summary.getRange("E3:E5").format.numberFormat = "0.00";

const inspected = await workbook.inspect({
  kind: "table",
  range: "SKU列表!A1:X8",
  include: "values",
  tableMaxRows: 8,
  tableMaxCols: 24,
  tableMaxCellChars: 80,
});
console.log(inspected.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "SKU列表",
  range: "A1:X16",
  autoCrop: "all",
  scale: 1,
  format: "png",
});
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);

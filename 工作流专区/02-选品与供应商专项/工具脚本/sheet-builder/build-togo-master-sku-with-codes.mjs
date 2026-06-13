import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "D:/Teddy创业项目/工作流专区/02-选品与供应商专项";
const outputDir = `${root}/SKU表`;
const outputPath = `${outputDir}/Teddy低端店首批SKU候选池-带内部编码-20260607.xlsx`;
const previewPath = `${outputDir}/Teddy低端店首批SKU候选池-带内部编码-20260607-preview.png`;

const supplier = "上海醉清风健康科技股份有限公司";
const supplierCode = "ZQF";
const store = "TEDDY TOGO";
const storeCode = "TGO";
const sourcePlatform = "1688";
const collectedAt = "2026-06-07";

const categories = [
  {
    code: "WMBY",
    name: "【外卖实体】必买清单",
    id: "208785104",
    file: `${root}/供应商资料/1688醉清风-外卖实体必买清单-mtop-allpages-20260607.json`,
    priority: 1,
  },
  {
    code: "KZNY",
    name: "【外卖实体】带图片卡纸内衣",
    id: "207640198",
    file: `${root}/供应商资料/1688醉清风-外卖实体带图片卡纸内衣-mtop-allpages-20260607.json`,
    priority: 2,
  },
  {
    code: "JSBT",
    name: "【计生专区】大牌避孕套",
    id: "26325346",
    file: `${root}/供应商资料/1688醉清风-计生专区大牌避孕套-mtop-allpages-20260607.json`,
    priority: 3,
  },
  {
    code: "MENS",
    name: "【男用专区】自主品牌谜姬以及市场热门品牌",
    id: "26325363",
    file: `${root}/供应商资料/1688醉清风-男用专区-mtop-allpages-20260607.json`,
    priority: 4,
  },
  {
    code: "FEML",
    name: "【女用专区】自主品牌谜姬安可尼以及市场热门品牌",
    id: "26325357",
    file: `${root}/供应商资料/1688醉清风-女用专区-mtop-allpages-20260607.json`,
    priority: 5,
  },
];

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
    "威尔乐",
    "赤尾",
    "冰果",
  ];
  return brands.find((brand) => subject.includes(brand)) || "未标明";
}

function extractModel(subject) {
  const codes = [...subject.matchAll(/(?<!\d)(\d{3,6}(?:-\d{3,6})?)(?!\d)/g)]
    .map((m) => m[1])
    .filter((code) => !["1688", "2026", "2025"].includes(code));
  return [...new Set(codes)].slice(0, 6).join(" / ");
}

function extractSpec(subject) {
  const specs = [];
  const packMatches = [...subject.matchAll(/(\d+\s*(?:只|片|支|颗|个|盒|瓶|包|套|箱|ml|g|KG|kg)|\d+\s*(?:\/|件\/)\s*包|盒装|单支|一盒|一套|组合装|混批)/gi)].map((m) =>
    m[1].replace(/\s+/g, ""),
  );
  specs.push(...packMatches);

  const keywords = [
    "超薄",
    "大颗粒",
    "螺纹",
    "延时",
    "持久",
    "玻尿酸",
    "水润",
    "香味",
    "避孕套",
    "润滑液",
    "湿巾",
    "飞机杯",
    "倒模",
    "跳蛋",
    "震动",
    "包芯丝",
    "连裤袜",
    "长筒袜",
    "网袜",
    "蕾丝",
    "开裆",
    "免洗",
    "卡纸",
  ];
  specs.push(...keywords.filter((word) => subject.includes(word)).slice(0, 5));
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
    for (const offer of offerList) rows.push({ pageNum: page.pageNum, offer });
  }
  return rows;
}

const rows = [];
for (const category of categories) {
  const raw = await fs.readFile(category.file, "utf8");
  const data = JSON.parse(raw.replace(/^\uFEFF/, ""));
  const offers = getOffers(data);
  offers.forEach(({ pageNum, offer }, categoryIndex) => {
    const subject = offer.subject || "";
    const spuCode = `${storeCode}-${supplierCode}-${category.code}-${String(categoryIndex + 1).padStart(4, "0")}`;
    const skuCode = `${spuCode}-V01`;
    const price = toNumber(offer.handPrice || offer.offerPrice || offer.originalPrice);
    const discount = toNumber(offer.discountPrice) || "";
    const listPrice = toNumber(offer.underLinePrice || offer.originalPrice || offer.consignPrice);
    const image = normalizeImage(offer.offerImages?.[0]?.size310x310ImageURI || offer.offerImages?.[0]?.imageURI);
    const link = offer.id ? `https://detail.1688.com/offer/${offer.id}.html` : `https://yixingfangsc.1688.com/page/offerlist_${category.id}.htm`;

    rows.push([
      rows.length + 1,
      spuCode,
      skuCode,
      store,
      storeCode,
      supplier,
      supplierCode,
      sourcePlatform,
      category.name,
      category.code,
      category.id,
      pageNum,
      categoryIndex + 1,
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
      "列表层候选",
      "待筛选",
      "待补详情页规格/平台合规/建议售价/毛利",
      collectedAt,
    ]);
  });
}

const headers = [
  "总序号",
  "内部SPU编码",
  "默认SKU编码",
  "店铺",
  "店铺码",
  "供应商",
  "供应商码",
  "来源平台",
  "1688类目",
  "类目码",
  "类目ID",
  "页码",
  "类目内序号",
  "供应商商品ID",
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
  "筛选状态",
  "备注",
  "采集日期",
];

await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const master = workbook.worksheets.add("SKU母表");
const rule = workbook.worksheets.add("编码规则");
const categorySheet = workbook.worksheets.add("类目码表");

for (const sheet of [master, rule, categorySheet]) sheet.showGridLines = false;

master.getRange("A1:AG1").values = [headers];
master.getRange(`A2:AG${rows.length + 1}`).values = rows;
master.getRange("A1:AG1").format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
  alignment: { horizontal: "center", vertical: "middle", wrapText: true },
};
master.getRange(`A2:AG${rows.length + 1}`).format = {
  alignment: { vertical: "top", wrapText: true },
  borders: { preset: "all", style: "thin", color: "#D9E2F3" },
};
master.getRange("A:A").format.columnWidthPx = 60;
master.getRange("B:C").format.columnWidthPx = 190;
master.getRange("D:H").format.columnWidthPx = 100;
master.getRange("I:I").format.columnWidthPx = 220;
master.getRange("J:N").format.columnWidthPx = 95;
master.getRange("O:O").format.columnWidthPx = 80;
master.getRange("P:P").format.columnWidthPx = 440;
master.getRange("Q:Q").format.columnWidthPx = 420;
master.getRange("R:S").format.columnWidthPx = 170;
master.getRange("T:V").format.columnWidthPx = 105;
master.getRange("W:X").format.columnWidthPx = 75;
master.getRange("Y:AA").format.columnWidthPx = 95;
master.getRange("AB:AB").format.columnWidthPx = 170;
master.getRange("AC:AC").format.columnWidthPx = 360;
master.getRange("AD:AG").format.columnWidthPx = 130;
master.getRange(`T2:V${rows.length + 1}`).format.numberFormat = "0.00";
master.getRange(`Z2:AA${rows.length + 1}`).format.numberFormat = "0";
master.freezePanes.freezeRows(1);
master.freezePanes.freezeColumns(3);
master.tables.add(`A1:AG${rows.length + 1}`, true, "TogoMasterSku");

rule.getRange("A1:B12").values = [
  ["项目", "规则"],
  ["内部SPU编码", "店铺码-供应商码-类目码-四位流水号，例如 TGO-ZQF-MENS-0001"],
  ["默认SKU编码", "内部SPU编码-V两位规格号，例如 TGO-ZQF-MENS-0001-V01"],
  ["店铺码", "TGO = TEDDY TOGO 低端店"],
  ["供应商码", "ZQF = 1688 上海醉清风健康科技股份有限公司"],
  ["流水号", "每个类目从 0001 开始，按1688列表页顺序递增"],
  ["供应商商品ID", "保存1688商品ID，作为供应商外部货号，不作为Teddy内部SKU"],
  ["当前规格", "列表层统一先生成 V01；详情页增强后按颜色/规格扩展 V02、V03"],
  ["筛选状态", "默认待筛选，后续改为拟上架、备选、淘汰、待补资料"],
  ["稳定性", "已生成编码不要随意删除或改名；作废商品用状态字段处理"],
  ["导入库存系统", "优先使用默认SKU编码作为库存SKU，内部SPU编码作为商品档案主编码"],
  ["建立时间", collectedAt],
];
rule.getRange("A1:B1").format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
};
rule.getRange("A:A").format.columnWidthPx = 150;
rule.getRange("B:B").format.columnWidthPx = 760;
rule.getRange("A1:B12").format = {
  alignment: { vertical: "top", wrapText: true },
  borders: { preset: "all", style: "thin", color: "#D9E2F3" },
};

const categoryRows = categories.map((category) => {
  const count = rows.filter((row) => row[9] === category.code).length;
  return [category.priority, category.code, category.name, category.id, count, `${storeCode}-${supplierCode}-${category.code}-0001`];
});
categorySheet.getRange("A1:F1").values = [["优先级", "类目码", "类目名称", "类目ID", "商品数", "编码示例"]];
categorySheet.getRange(`A2:F${categoryRows.length + 1}`).values = categoryRows;
categorySheet.getRange("A1:F1").format = {
  fill: "#5B9BD5",
  font: { bold: true, color: "#FFFFFF" },
};
categorySheet.getRange(`A1:F${categoryRows.length + 1}`).format = {
  alignment: { vertical: "middle", wrapText: true },
  borders: { preset: "all", style: "thin", color: "#D9E2F3" },
};
categorySheet.getRange("A:A").format.columnWidthPx = 70;
categorySheet.getRange("B:B").format.columnWidthPx = 90;
categorySheet.getRange("C:C").format.columnWidthPx = 300;
categorySheet.getRange("D:F").format.columnWidthPx = 140;

const inspected = await workbook.inspect({
  kind: "table",
  range: "SKU母表!A1:AG8",
  include: "values",
  tableMaxRows: 8,
  tableMaxCols: 33,
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
  sheetName: "SKU母表",
  range: "A1:AG16",
  autoCrop: "all",
  scale: 1,
  format: "png",
});
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);

import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "D:/Teddy创业项目/工作流专区/02-选品与供应商专项/SKU表";
const outputPath = `${outputDir}/1688醉清风礼盒类目商品汇总-20260607.xlsx`;
const previewPath = `${outputDir}/1688醉清风礼盒类目商品汇总-20260607-preview.png`;
const listUrl = "https://yixingfangsc.1688.com/page/offerlist.htm?keywords=%E7%A4%BC%E7%9B%92";

const products = [
  {
    brand: "WildOne",
    name: "WildOne神舌系列电动口交杯女优舌头名器飞机杯倒模成人男用24/箱",
    spec: "24/箱",
    model: "神舌系列",
    price: 148,
    redPacketPrice: 143,
    sales: "已售500+件",
    link: "https://detail.1688.com/offer/832337058883.html",
    linkType: "详情页直达",
  },
  {
    brand: "谜姬",
    name: "谜姬轻情趣礼盒套装sm夫妻情侣互动调情玩具成人情趣用品32/箱",
    spec: "32/箱",
    model: "轻情趣礼盒套装",
    price: 20,
    redPacketPrice: 15,
    sales: "已售30+件",
    link: "https://detail.1688.com/offer/1054512757616.html",
    linkType: "详情页直达",
  },
  {
    brand: "谜姬",
    name: "谜姬情趣捆绑束缚套装女用另类玩具SM成人用品口球皮鞭肛塞全系列",
    spec: "",
    model: "捆绑束缚套装/全系列",
    price: 1.3,
    redPacketPrice: 1.3,
    sales: "已售100+件",
    link: "https://detail.1688.com/offer/1051945450750.html",
    linkType: "详情页直达",
  },
  {
    brand: "羞羞哒",
    name: "羞羞哒 情趣大礼包器具液湿巾润滑油组合礼包成人情趣性用品60/箱",
    spec: "60/箱",
    model: "情趣大礼包/组合礼包",
    price: 29.9,
    redPacketPrice: 24.9,
    sales: "已售400+件",
    link: "https://detail.1688.com/offer/600841804807.html",
    linkType: "详情页直达",
  },
  {
    brand: "霏慕",
    name: "霏慕SM连颈链可调节蝴蝶铃铛乳夹7613情趣内衣配件性感调情 50/包",
    spec: "50/包",
    model: "7613",
    price: 31,
    redPacketPrice: 26,
    sales: "已售100+件",
    link: "https://detail.1688.com/offer/824994426116.html",
    linkType: "详情页直达",
  },
  {
    brand: "安可尼",
    name: "安可尼甜心派对礼盒吮吸拍打双头替换震动抗菌蓄电醉清风app36/箱",
    spec: "36/箱",
    model: "甜心派对礼盒",
    price: 329.9,
    redPacketPrice: 324.9,
    sales: "已售100+件",
    link: `${listUrl}&_teddy_keyword=${encodeURIComponent("安可尼甜心派对礼盒")}`,
    linkType: "店铺列表入口，待补详情页",
  },
  {
    brand: "谜姬",
    name: "谜姬驯龙高手脉冲电击器SM道具成人用品另类刺激玩具夫妻房事用品",
    spec: "",
    model: "驯龙高手",
    price: 12.6,
    redPacketPrice: 7.6,
    sales: "已售20+件",
    link: `${listUrl}&_teddy_keyword=${encodeURIComponent("谜姬驯龙高手脉冲电击器")}`,
    linkType: "店铺列表入口，待补详情页",
  },
  {
    brand: "谜姬",
    name: "谜姬锁春心束缚套装便携收纳礼盒密码性趣九件套捆绑SM情趣20/箱",
    spec: "20/箱",
    model: "锁春心/九件套",
    price: 155,
    redPacketPrice: 150,
    sales: "",
    link: `${listUrl}&_teddy_keyword=${encodeURIComponent("谜姬锁春心束缚套装")}`,
    linkType: "店铺列表入口，待补详情页",
  },
  {
    brand: "谜姬",
    name: "谜姬芒种情趣礼盒束缚SM刑具夫妻调教捆绑道具情趣成人用品 20/箱",
    spec: "20/箱",
    model: "芒种情趣礼盒",
    price: 140,
    redPacketPrice: 135,
    sales: "已售20+件",
    link: `${listUrl}&_teddy_keyword=${encodeURIComponent("谜姬芒种情趣礼盒")}`,
    linkType: "店铺列表入口，待补详情页",
  },
  {
    brand: "谜姬",
    name: "谜姬次元之恋手办娃娃神宫千月飞机杯倒模名器男用自慰器1.23kg",
    spec: "1.23kg",
    model: "次元之恋/神宫千月",
    price: 679,
    redPacketPrice: 674,
    sales: "",
    link: `${listUrl}&_teddy_keyword=${encodeURIComponent("谜姬次元之恋神宫千月")}`,
    linkType: "店铺列表入口，待补详情页",
  },
  {
    brand: "谜姬",
    name: "谜姬 密约·探索套装礼盒款桌游互动sm调情成人用品情趣玩具18/箱",
    spec: "18/箱",
    model: "密约·探索套装",
    price: 124,
    redPacketPrice: 119,
    sales: "已售20+件",
    link: `${listUrl}&_teddy_keyword=${encodeURIComponent("谜姬 密约 探索套装")}`,
    linkType: "店铺列表入口，待补详情页",
  },
  {
    brand: "未标明",
    name: "飞机杯名器倒模-mmsl",
    spec: "",
    model: "mmsl",
    price: 107,
    redPacketPrice: 102,
    sales: "已售70+件",
    link: `${listUrl}&_teddy_keyword=${encodeURIComponent("飞机杯名器倒模 mmsl")}`,
    linkType: "店铺列表入口，待补详情页",
  },
];

const headers = [
  "序号",
  "供应商",
  "来源平台",
  "店铺/公司",
  "类目",
  "品牌",
  "商品名称",
  "规格/装箱数",
  "型号/系列",
  "采购方式",
  "1688页面价(元)",
  "当前红包价/登录价(元)",
  "页面销量",
  "下单链接",
  "链接状态",
  "选品备注",
];

const rows = products.map((item, index) => [
  index + 1,
  "上海醉清风健康科技股份有限公司",
  "1688",
  "醉清风健康科技",
  "礼盒/礼包/套装",
  item.brand,
  item.name,
  item.spec,
  item.model,
  "混批",
  item.price,
  item.redPacketPrice,
  item.sales,
  item.link,
  item.linkType,
  item.linkType === "详情页直达"
    ? "已拿到详情页；后续可补首图、可售平台标题、建议售价"
    : "页面可见但详情链接未稳定抓取；先用店铺列表入口复核",
]);

await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const sku = workbook.worksheets.add("礼盒SKU汇总");
const source = workbook.worksheets.add("来源与说明");

sku.getRange("A1:P1").values = [headers];
sku.getRange(`A2:P${rows.length + 1}`).values = rows;

sku.getRange("A1:P1").format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
};
sku.getRange(`A2:P${rows.length + 1}`).format = {
  alignment: { vertical: "top", wrapText: true },
};
sku.getRange(`K2:L${rows.length + 1}`).format.numberFormat = "0.00";
sku.getRange("A:A").format.columnWidthPx = 48;
sku.getRange("B:B").format.columnWidthPx = 210;
sku.getRange("C:F").format.columnWidthPx = 100;
sku.getRange("G:G").format.columnWidthPx = 460;
sku.getRange("H:J").format.columnWidthPx = 120;
sku.getRange("K:M").format.columnWidthPx = 110;
sku.getRange("N:N").format.columnWidthPx = 410;
sku.getRange("O:P").format.columnWidthPx = 190;
sku.freezePanes.freezeRows(1);

source.getRange("A1:B8").values = [
  ["项目", "说明"],
  ["采集时间", "2026-06-07"],
  ["供应商", "上海醉清风健康科技股份有限公司 / 1688店铺"],
  ["采集入口", listUrl],
  ["范围", "1688店铺礼盒关键词页面显示的全部12件相关产品"],
  ["价格口径", "1688页面价来自未红包展示；当前红包价/登录价来自登录后列表页显示，实际下单以详情页结算为准"],
  ["链接口径", "前5件已通过浏览器采集到详情页；后7件页面可见但详情页点击未稳定触发，先保留店铺列表入口待复核"],
  ["平台注意", "上架美团/饿了么/淘宝闪购前需做标题与图片合规改写，并核验平台类目审核要求"],
];
source.getRange("A1:B1").format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
};
source.getRange("A:A").format.columnWidthPx = 110;
source.getRange("B:B").format.columnWidthPx = 760;
source.getRange("A2:B8").format = {
  alignment: { vertical: "top", wrapText: true },
};

const inspected = await workbook.inspect({
  kind: "table",
  range: "礼盒SKU汇总!A1:P13",
  include: "values",
  tableMaxRows: 14,
  tableMaxCols: 16,
});
console.log(inspected.ndjson);

const preview = await workbook.render({
  sheetName: "礼盒SKU汇总",
  range: "A1:P13",
  autoCrop: "all",
  scale: 1,
  format: "png",
});
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);

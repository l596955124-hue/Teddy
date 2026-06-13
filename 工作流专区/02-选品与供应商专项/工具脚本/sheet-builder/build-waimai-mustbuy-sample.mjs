import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "D:/Teddy创业项目/工作流专区/02-选品与供应商专项/SKU表";
const outputPath = `${outputDir}/1688醉清风-外卖实体必买清单-小样测试-20260607.xlsx`;
const previewPath = `${outputDir}/1688醉清风-外卖实体必买清单-小样测试-20260607-preview.png`;
const categoryUrl = "https://yixingfangsc.1688.com/page/offerlist_208785104.htm";

const rows = [
  {
    brand: "未标明/组合清单",
    name: "美团外卖秋季清单飞机杯倒模跳蛋避孕套自慰玩具批发成人情趣用品",
    image: "https://cbu01.alicdn.com/img/ibank/O1CN01zqF0DA1ok3F6j0M8M_!!939665262-0-cib.310x310.jpg",
    spec: "组合清单",
    model: "美团外卖秋季清单",
    price: 2.5,
    discount: "",
    sales: "已售5400+件",
    link: "https://detail.1688.com/offer/980291149775.html",
    status: "详情页直达",
  },
  {
    brand: "醉清风",
    name: "美团成人商品清单醉清风联系客服转负责人",
    image: "https://cbu01.alicdn.com/img/ibank/O1CN01eLaMgO1ok39BTANKi_!!939665262-0-cib.310x310.jpg",
    spec: "客服/清单链接",
    model: "美团成人商品清单",
    price: 0.09,
    discount: "",
    sales: "已售2.2万+件",
    link: "https://detail.1688.com/offer/947256036765.html",
    status: "详情页直达",
  },
  {
    brand: "霏慕",
    name: "霏慕免洗情趣内衣EO灭菌拆袋即穿性感调情制服套装睡衣约会战袍",
    image: "https://cbu01.alicdn.com/img/ibank/O1CN01rg5tYb1ok3DsiW7Bb_!!939665262-0-cib.310x310.jpg",
    spec: "EO灭菌/拆袋即穿",
    model: "免洗情趣内衣系列",
    price: 10,
    discount: "红包价",
    sales: "已售800+件",
    link: "https://detail.1688.com/offer/1021087498513.html",
    status: "详情页直达",
  },
  {
    brand: "霏慕",
    name: "霏慕×美团专供系列必卖清单成人用品平台推荐情趣内衣一站式采购",
    image: "https://cbu01.alicdn.com/img/ibank/O1CN014aA8xR1ok3B2npq5x_!!939665262-0-cib.310x310.jpg",
    spec: "美团专供/必卖清单",
    model: "平台推荐清单",
    price: 3,
    discount: "",
    sales: "已售2600+件",
    link: "https://detail.1688.com/offer/959571391704.html",
    status: "详情页直达",
  },
  {
    brand: "未标明/组合清单",
    name: "美团商家主推17款下单链接美团商家主推款下单链接美团大牌活动",
    image: "https://cbu01.alicdn.com/img/ibank/O1CN01fLWD681ok3B1rzth9_!!939665262-0-cib.310x310.jpg",
    spec: "17款主推清单",
    model: "美团大牌活动",
    price: 0.85,
    discount: "",
    sales: "已售1900+件",
    link: "https://detail.1688.com/offer/959111366146.html",
    status: "详情页直达",
  },
  {
    brand: "霏慕",
    name: "霏慕无菌免洗情趣内衣蕾丝性感女仆套装免脱露臀透视大码制服7911",
    image: "https://cbu01.alicdn.com/img/ibank/O1CN01LraEWe1ok3Dt1g9I7_!!939665262-0-cib.310x310.jpg",
    spec: "无菌免洗/大码制服",
    model: "7911",
    price: 16.5,
    discount: "红包价",
    sales: "已售100+件",
    link: "https://detail.1688.com/offer/1024592035506.html",
    status: "详情页直达",
  },
  {
    brand: "霏慕",
    name: "霏慕无菌免洗情趣内衣高阶尤物蕾丝透视诱惑包臀睡裙性感纯欲6108",
    image: "https://cbu01.alicdn.com/img/ibank/O1CN0185SQw61ok3Dt6kdCg_!!939665262-0-cib.310x310.jpg",
    spec: "无菌免洗/包臀睡裙",
    model: "6108",
    price: 18.5,
    discount: "红包价",
    sales: "已售50+件",
    link: categoryUrl,
    status: "列表可见，详情待补",
  },
  {
    brand: "霏慕",
    name: "霏慕无菌免洗情趣内衣深V露胸高开衩透视蕾丝调情免脱睡衣6363",
    image: "https://cbu01.alicdn.com/img/ibank/O1CN01tjXuda1ok3Dt24Ntk_!!939665262-0-cib.310x310.jpg",
    spec: "无菌免洗/深V高开衩",
    model: "6363",
    price: 15.3,
    discount: "红包价",
    sales: "已售10+件",
    link: categoryUrl,
    status: "列表可见，详情待补",
  },
  {
    brand: "霏慕",
    name: "美团成人商品平台推荐上架清单霏慕情趣内衣一站式购齐带卡纸包装",
    image: "https://cbu01.alicdn.com/img/ibank/O1CN01U98w3V1ok3AQKznld_!!939665262-0-cib.310x310.jpg",
    spec: "带卡纸包装/一站式清单",
    model: "平台推荐上架清单",
    price: 3.8,
    discount: "",
    sales: "已售900+件",
    link: categoryUrl,
    status: "列表可见，详情待补",
  },
  {
    brand: "谜姬/霏慕",
    name: "12月 美团谜姬&霏慕爆品超级官方补贴产品",
    image: "https://cbu01.alicdn.com/img/ibank/O1CN01eLaMgO1ok39BTANKi_!!939665262-0-cib.310x310.jpg",
    spec: "官方补贴/爆品清单",
    model: "12月美团爆品",
    price: 4.1,
    discount: "",
    sales: "已售100+件",
    link: categoryUrl,
    status: "列表可见，详情待补",
  },
];

const headers = [
  "序号",
  "供应商",
  "来源平台",
  "1688类目",
  "品牌",
  "商品名称",
  "图片URL",
  "规格/型号",
  "系列/货号",
  "单价(元)",
  "优惠价/价格标记",
  "销量",
  "下单链接",
  "采集状态",
  "备注",
];

await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("小样SKU");
const note = workbook.worksheets.add("测试说明");

sheet.getRange("A1:O1").values = [headers];
sheet.getRange(`A2:O${rows.length + 1}`).values = rows.map((item, index) => [
  index + 1,
  "上海醉清风健康科技股份有限公司",
  "1688",
  "【外卖实体】必买清单",
  item.brand,
  item.name,
  item.image,
  item.spec,
  item.model,
  item.price,
  item.discount,
  item.sales,
  item.link,
  item.status,
  item.status === "详情页直达"
    ? "列表页+详情页已校验"
    : "列表页已校验；详情页点击需分批补采",
]);

sheet.getRange("A1:O1").format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
};
sheet.getRange(`A2:O${rows.length + 1}`).format = {
  alignment: { vertical: "top", wrapText: true },
};
sheet.getRange(`J2:J${rows.length + 1}`).format.numberFormat = "0.00";
sheet.getRange("A:A").format.columnWidthPx = 48;
sheet.getRange("B:D").format.columnWidthPx = 150;
sheet.getRange("E:E").format.columnWidthPx = 100;
sheet.getRange("F:F").format.columnWidthPx = 430;
sheet.getRange("G:G").format.columnWidthPx = 430;
sheet.getRange("H:I").format.columnWidthPx = 160;
sheet.getRange("J:L").format.columnWidthPx = 110;
sheet.getRange("M:M").format.columnWidthPx = 350;
sheet.getRange("N:O").format.columnWidthPx = 160;
sheet.freezePanes.freezeRows(1);

note.getRange("A1:B9").values = [
  ["项目", "说明"],
  ["采集时间", "2026-06-07"],
  ["类目ID", "208785104"],
  ["类目入口", categoryUrl],
  ["类目商品数", "10"],
  ["AnySearch结果", "用于入口候选，未直接写入正式链接字段"],
  ["列表页结果", "10件商品的名称、图片URL、价格、销量均可读取"],
  ["详情页结果", "前6件详情页链接采集成功；后4件因页面渲染/点击稳定性待补"],
  ["后续建议", "批量全店采集时先采列表层字段，再对入选SKU分批补详情页字段"],
];
note.getRange("A1:B1").format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
};
note.getRange("A:A").format.columnWidthPx = 120;
note.getRange("B:B").format.columnWidthPx = 760;
note.getRange("A2:B9").format = { alignment: { vertical: "top", wrapText: true } };

const inspected = await workbook.inspect({
  kind: "table",
  range: "小样SKU!A1:O11",
  include: "values",
  tableMaxRows: 12,
  tableMaxCols: 15,
});
console.log(inspected.ndjson);

const preview = await workbook.render({
  sheetName: "小样SKU",
  range: "A1:O11",
  autoCrop: "all",
  scale: 1,
  format: "png",
});
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);

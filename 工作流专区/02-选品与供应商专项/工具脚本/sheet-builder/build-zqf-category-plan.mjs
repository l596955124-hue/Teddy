import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "D:/Teddy创业项目/工作流专区/02-选品与供应商专项/SKU表";
const outputPath = `${outputDir}/1688醉清风-全店类目与采集批次-20260607.xlsx`;
const previewPath = `${outputDir}/1688醉清风-全店类目与采集批次-20260607-preview.png`;

const categories = [
  ["【外卖实体】必买清单", "208785104", 10, "已完成小样", 1, "已采10件列表层，6件详情页直达"],
  ["【外卖实体】带图片卡纸内衣", "207640198", 159, "高优先级", 2, "适合低端店平台上架，先采列表层"],
  ["【组合链接专区】", "211965359", 31, "高优先级", 3, "多为清单/组合入口，需识别真实SKU"],
  ["【计生专区】大牌避孕套", "26325346", 40, "高优先级", 4, "低端店刚需类目，平台合规风险低"],
  ["【传统线上】淘拼热款", "205890522", 23, "高优先级", 5, "热销款可参考线上价格带"],
  ["【霏慕免洗内衣】安心不贵-拆开即穿", "214303185", 44, "中高优先级", 6, "适合外卖即时零售，需注意图片合规"],
  ["【私域内容】抖微好物", "205890523", 16, "中高优先级", 7, "可找引流款/爆款素材"],
  ["谜姬电动", "217268410", 341, "中优先级", 8, "低端店核心器具池，需分批采集"],
  ["谜姬非电动", "217268409", 454, "中优先级", 9, "低端店核心器具池，需分批采集"],
  ["【男用专区】自主品牌谜姬以及市场热门品牌", "26325363", 469, "中优先级", 10, "商品多，需按销量/价格筛"],
  ["【女用专区】自主品牌谜姬安可尼以及市场热门品牌", "26325357", 409, "中优先级", 11, "商品多，需按销量/价格筛"],
  ["【情趣专区】自主品牌谜姬以及热门品牌", "26325367", 394, "中优先级", 12, "需区分可上线与敏感款"],
  ["【情趣内衣-霏慕】", "26325344", 818, "中低优先级", 13, "数量大，先抽高销量/平台友好款"],
  ["【品牌专区】各个品牌挑选区", "27133010", 793, "中低优先级", 14, "重复率可能高，后期补品牌授权/价格带"],
  ["【每月上新】抢占先机", "53547757", 771, "低优先级", 15, "与其他类目高度重复，后期用于补新品"],
  ["未分类", "-2", 18, "低优先级", 16, "最后采集/查漏补缺"],
];

const workbook = Workbook.create();
const plan = workbook.worksheets.add("类目采集批次");
const notes = workbook.worksheets.add("执行说明");

plan.getRange("A1:H1").values = [[
  "序号",
  "类目名称",
  "类目ID",
  "页面商品数",
  "优先级",
  "采集批次",
  "类目链接",
  "备注",
]];
plan.getRange(`A2:H${categories.length + 1}`).values = categories.map((row, index) => [
  index + 1,
  row[0],
  row[1],
  row[2],
  row[3],
  row[4],
  `https://yixingfangsc.1688.com/page/offerlist_${row[1]}.htm`,
  row[5],
]);

plan.getRange("A1:H1").format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
};
plan.getRange(`A2:H${categories.length + 1}`).format = {
  alignment: { vertical: "top", wrapText: true },
};
plan.getRange("A:A").format.columnWidthPx = 48;
plan.getRange("B:B").format.columnWidthPx = 340;
plan.getRange("C:F").format.columnWidthPx = 105;
plan.getRange("G:G").format.columnWidthPx = 360;
plan.getRange("H:H").format.columnWidthPx = 360;
plan.freezePanes.freezeRows(1);

notes.getRange("A1:B8").values = [
  ["项目", "说明"],
  ["当前阶段", "正式采集第一阶段：全店类目总表与批次规划"],
  ["关键困难1", "AnySearch 只能做候选入口，不能作为最终商品数据源"],
  ["关键困难2", "1688 详情页点击可用但要分批，长时间连续点击会超时"],
  ["关键困难3", "类目计数合计大于店铺商品数，说明存在跨类目重复，后续必须按商品ID/详情链接去重"],
  ["建议策略", "先采列表层字段，再对入选SKU分批补详情页规格、价格档、主图"],
  ["下一步", "按批次2开始采集【外卖实体】带图片卡纸内衣"],
  ["保存口径", "每完成一个类目或超过15分钟，保存阶段文件"],
];
notes.getRange("A1:B1").format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
};
notes.getRange("A:A").format.columnWidthPx = 130;
notes.getRange("B:B").format.columnWidthPx = 780;
notes.getRange("A2:B8").format = { alignment: { vertical: "top", wrapText: true } };

await fs.mkdir(outputDir, { recursive: true });
const inspected = await workbook.inspect({
  kind: "table",
  range: "类目采集批次!A1:H17",
  include: "values",
  tableMaxRows: 18,
  tableMaxCols: 8,
});
console.log(inspected.ndjson);

const preview = await workbook.render({
  sheetName: "类目采集批次",
  range: "A1:H17",
  autoCrop: "all",
  scale: 1,
  format: "png",
});
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);

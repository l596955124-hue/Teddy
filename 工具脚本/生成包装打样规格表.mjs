import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "D:/Teddy创业项目/输出文件/供应商打样资料包/包装打样资料包-20260610/02-规格与说明";
const assetRoot = "D:/Teddy创业项目";
const outputXlsx = `${outputDir}/Teddy包装打样规格表-v1-可制作版.xlsx`;

const colors = {
  teddyOrange: "#F5A623",
  togo: "#FF5A1F",
  belle: "#E8B4B8",
  belleGold: "#D4AF37",
  rainbow: "#2A164B",
  teal: "#06D6A0",
  ivory: "#FFF8E8",
  chocolate: "#3B2416",
  line: "#E6D8C3",
};

const workbook = Workbook.create();

function writeSheet(sheet, title, subtitle, headers, rows, widths = []) {
  sheet.showGridLines = false;
  sheet.getRange("A1:K1").merge();
  sheet.getRange("A1").values = [[title]];
  sheet.getRange("A1").format.fill = { color: colors.ivory };
  sheet.getRange("A1").format.font = { bold: true, size: 18, color: colors.chocolate };
  sheet.getRange("A2:K2").merge();
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange("A2").format.font = { size: 10, color: "#6B4A34" };

  const headerRange = sheet.getRangeByIndexes(3, 0, 1, headers.length);
  headerRange.values = [headers];
  headerRange.format.fill = { color: colors.chocolate };
  headerRange.format.font = { bold: true, color: "#FFFFFF" };
  headerRange.format.wrapText = true;
  headerRange.format.borders = { preset: "all", style: "thin", color: colors.line };

  const dataRange = sheet.getRangeByIndexes(4, 0, rows.length, headers.length);
  dataRange.values = rows;
  dataRange.format.wrapText = true;
  dataRange.format.borders = { preset: "all", style: "thin", color: colors.line };
  dataRange.format.font = { size: 10, color: colors.chocolate };
  dataRange.format.fill = { color: "#FFFFFF" };

  for (let i = 0; i < widths.length; i += 1) {
    sheet.getRangeByIndexes(0, i, rows.length + 6, 1).format.columnWidthPx = widths[i];
  }
  sheet.freezePanes.freezeRows(4);
  try {
    sheet.tables.add(`A4:${String.fromCharCode(64 + headers.length)}${rows.length + 4}`, true, `${sheet.name.replace(/[^A-Za-z0-9]/g, "")}Table`);
  } catch {
    // Table names are helpful but not required for use.
  }
}

const summary = workbook.worksheets.add("使用说明");
writeSheet(
  summary,
  "Teddy 包装打样规格表 v1",
  "用途：给供应商报价、打样、印刷制作前沟通。当前为可制作/可报价资料，不是最终刀版文件。",
  ["项目", "当前口径", "注意事项", "对应文件"],
  [
    ["资料包位置", "输出文件/供应商打样资料包/包装打样资料包-20260610", "可整体复制给供应商；正式报价前建议只给必要文件。", ""],
    ["外层履约包装", "所有订单统一隐私外包装，不展示商品信息。", "不得出现成人用品、情趣、SM 等敏感字样。", "02-规格与说明/Teddy自有包装体系规划-v1-审核稿.md"],
    ["成熟品牌产品", "避孕套、精油、按摩棒等保留厂家包装。", "Teddy 只叠加隐私袋、封口贴、售后卡、感谢卡。", ""],
    ["自有/无 LOGO 产品", "按 TOGO、BELLE、RAINBOW 三品牌分别做包装。", "需要供应商确认尺寸、材质、刀版、MOQ 和单价。", "01-参考图片/"],
    ["印刷要求", "优先索要 AI/PDF/CDR 刀版模板；最终文件 CMYK、300dpi、文字转曲。", "本资料包中的 PNG 是风格参考，不等于最终印刷源文件。", ""],
    ["成本控制", "先做低 MOQ 打样，小批量验证复购和毛利。", "TOGO 控成本，BELLE/Rainbow 允许更高单价换体验。", ""],
  ],
  [150, 280, 360, 360],
);

const sampleHeaders = ["优先级", "物料名称", "适用品牌", "适用品类", "建议尺寸/规格", "建议材质", "建议工艺", "初始数量/MOQ", "成本目标", "是否可先打样", "备注"];
const sampleRows = [
  ["P0", "白色隐私配送袋-小", "全品牌", "小件订单", "约 18x25cm，按供应商标准袋确认", "白色 PE/复合袋，哑光优先", "无敏感字，贴 Teddy 封口贴", "500-1000 个", "0.20-0.50 元/个", "是", "先用通用现货袋，降低起订压力"],
  ["P0", "白色隐私配送袋-中", "全品牌", "常规订单", "约 25x35cm，按供应商标准袋确认", "白色 PE/复合袋，哑光优先", "无敏感字，贴 Teddy 封口贴", "500-1000 个", "0.35-0.80 元/个", "是", "开店首批最常用"],
  ["P0", "白色隐私配送袋-大", "全品牌", "礼盒/服饰/多件订单", "约 32x45cm，按供应商标准袋确认", "白色 PE/复合袋，哑光优先", "无敏感字，贴 Teddy 封口贴", "300-500 个", "0.60-1.20 元/个", "是", "大件占比低，少量备货"],
  ["P0", "Teddy 通用封口贴", "全品牌", "外层封口/盒贴", "圆形 40-50mm；长条约 80x25mm", "铜版纸/合成纸不干胶", "哑膜，四色印刷", "1000-3000 张", "0.03-0.15 元/张", "是", "圆形放 LOGO，长条放隐私提示"],
  ["P0", "售后说明卡", "全品牌", "所有订单", "A6 或 90x54mm", "250-300g 白卡/铜版纸", "双面四色，哑膜可选", "500-1000 张", "0.05-0.20 元/张", "是", "内容必须平台合规，不承诺夸大功效"],
  ["P0", "感谢卡", "全品牌", "所有订单", "90x54mm 或 A6", "250-300g 白卡/铜版纸", "双面四色", "500-1000 张", "0.05-0.20 元/张", "是", "可放公众号/客服入口，避免敏感词"],
  ["P1", "TOGO 橙白贴纸标签", "TEDDY TOGO", "低价补给包/日常刚需", "40-60mm 圆贴；80x30mm 分类贴", "铜版纸不干胶", "四色印刷，哑膜", "1000-3000 张", "0.03-0.12 元/张", "是", "先用贴纸统一无品牌货源，暂不做复杂盒型"],
  ["P1", "TOGO 白色拉链袋", "TEDDY TOGO", "小件组合包/出行包", "12x17cm、15x22cm 两个规格", "白色磨砂 PE/自封袋", "贴纸标签，不直接印刷", "500-1000 个", "0.15-0.60 元/个", "是", "低成本、快周转"],
  ["P1", "BELLE 丝袜细长盒", "TEDDY BELLE", "丝袜/袜品", "约 80x220x25mm，需供应商刀版确认", "350g 白卡/特种纸", "粉金四色、局部烫金可选、哑膜", "300-1000 个", "1.20-4.00 元/个", "是", "第一批重点打样，适合建立自有品牌感"],
  ["P1", "BELLE 服饰吊牌", "TEDDY BELLE", "情趣衣服/服饰", "约 50x90mm", "350g 白卡/特种纸", "圆角、打孔、金色棉绳", "500-1000 个", "0.10-0.50 元/个", "是", "吊牌可强化质感和尺码信息"],
  ["P2", "BELLE 粉金礼盒", "TEDDY BELLE", "服饰/礼盒组合", "约 180x130x55mm，需供应商刀版确认", "硬纸板裱特种纸", "烫金、磁吸/天地盖二选一", "200-500 个", "4.00-12.00 元/个", "否，第二阶段", "先小批量验证高客单礼盒"],
  ["P1", "RAINBOW 边界提示卡", "RAINBOW TEDDY", "小众探索/社群礼盒", "A6 或 90x120mm", "300g 白卡/特种纸", "双面四色，哑膜", "500-1000 张", "0.08-0.30 元/张", "是", "品牌差异点，文案要高级、清楚、不低俗"],
  ["P2", "RAINBOW 紫色小礼盒", "RAINBOW TEDDY", "小众礼盒/配饰", "约 160x120x50mm，需供应商刀版确认", "硬纸板裱紫色特种纸", "彩虹烫印/局部 UV 可选", "200-500 个", "4.00-12.00 元/个", "否，第二阶段", "适合小众高毛利套装"],
  ["P2", "RAINBOW 彩虹隐私袋", "RAINBOW TEDDY", "服饰/配饰/套装", "约 20x28cm", "磨砂自封袋/束口袋", "低调彩虹标签，避免外层敏感", "300-1000 个", "0.40-1.50 元/个", "可选", "只用于内包装，外层仍统一隐私袋"],
];
writeSheet(workbook.worksheets.add("首批打样清单"), "首批包装打样清单", "按优先级推进：P0 立即可打样，P1 首批可报价，P2 等 SKU 与销量验证后再打样。", sampleHeaders, sampleRows, [70, 170, 120, 180, 240, 180, 200, 130, 130, 110, 300]);

const brandHeaders = ["品牌", "包装定位", "主色", "适合品类", "推荐盒/袋型", "视觉关键词", "不建议做", "参考图"];
const brandRows = [
  ["TEDDY TOGO", "低价、快速、实用、即时补给", "橙红/暖黄/白/巧克力棕", "日常刚需、基础护理、低价组合、深夜补给包", "隐私配送袋、白色拉链袋、贴纸标签、简易纸盒", "快、省、私密、好分拣、低成本", "复杂礼盒、高单价工艺、过度装饰", "01-参考图片/TEDDY-TOGO低价补给包装套装-确认稿-v1.png"],
  ["TEDDY BELLE", "女性悦己、高端、卫生、舒适、礼盒氛围", "粉色/香槟金/象牙白/巧克力棕", "丝袜、情趣衣服、女性护理、香氛礼盒、高客单组合", "丝袜细长盒、服饰礼盒、吊牌、洗护卡、防尘袋", "柔软、洁净、仪式感、礼物感、品质", "廉价塑料感、过多敏感词、低俗文案", "01-参考图片/TEDDY-BELLE丝袜服饰礼盒包装-确认稿-v1.png"],
  ["RAINBOW TEDDY", "多元、尊重、边界、小众探索", "深紫/彩虹色/青绿/玫红/象牙白", "小众服饰、角色氛围、配饰、边界卡、探索礼盒", "紫色小礼盒、彩虹隐私袋、边界提示卡、尊重说明卡", "大胆、包容、边界、社区感、安全感", "外层暴露敏感信息、露骨图形、仿冒成熟品牌", "01-参考图片/RAINBOW-TEDDY小众礼盒边界卡包装-确认稿-v1.png"],
  ["成熟品牌合作产品", "保留厂家包装，Teddy 只做履约层", "按 Teddy 外层统一包装", "避孕套、精油、按摩棒、品牌授权产品", "隐私配送袋、封口贴、售后卡、感谢卡", "合规、真实授权、减少售后风险", "私自换包装、遮盖必要标签、暗示虚假授权", ""],
];
writeSheet(workbook.worksheets.add("品牌包装模板"), "三品牌包装模板", "用于后续选品、打样和供应商沟通时快速判断产品应该套用哪类包装。", brandHeaders, brandRows, [130, 210, 180, 250, 260, 220, 240, 360]);

const printHeaders = ["项目", "推荐标准", "供应商需确认", "备注"];
const printRows = [
  ["文件格式", "最终印刷优先 AI/PDF/CDR；本资料包 PNG 仅作风格参考", "是否提供刀版模板、是否接受 PDF", "确认稿前必须回传可印刷预览"],
  ["颜色模式", "CMYK", "专色/烫金色号/打样色差范围", "屏幕色与印刷色会有差异"],
  ["图片分辨率", "300dpi 以上", "实际印刷尺寸下是否清晰", "当前参考图适合 PPT 和风格沟通，不直接替代矢量印刷稿"],
  ["出血", "常规 3mm", "每种盒型/卡片具体出血要求", "按供应商刀版执行"],
  ["文字", "正式印刷前文字转曲/嵌入字体", "是否有免费商用字体限制", "避免字体侵权"],
  ["盒型", "贴纸/卡片可先走标准尺寸；礼盒/丝袜盒需刀版", "尺寸、开口、折线、糊口、承重", "打样后再批量下单"],
  ["表面工艺", "哑膜为基础；烫金/局部 UV 用于 BELLE/Rainbow 高客单", "单价、MOQ、工期", "TOGO 先不做高成本工艺"],
  ["合规文案", "外包装不出现敏感词；卡片话术合规克制", "平台或印刷厂是否有敏感词限制", "成人用品属性不要在外层暴露"],
  ["二维码/联系方式", "可放公众号/客服入口，但避免敏感名称", "二维码清晰度、跳转页内容", "上线前再确认"],
];
writeSheet(workbook.worksheets.add("印刷制作要求"), "印刷制作要求", "供应商打样和正式印刷前必须逐项确认。", printHeaders, printRows, [170, 380, 300, 350]);

const inquiryHeaders = ["供应商", "联系人", "联系方式", "物料名称", "报价数量", "单价", "版费/模具费", "打样费", "工期", "最小起订量", "备注"];
const inquiryRows = Array.from({ length: 15 }, () => ["", "", "", "", "", "", "", "", "", "", ""]);
writeSheet(workbook.worksheets.add("供应商询价模板"), "供应商询价模板", "复制给不同供应商报价时使用。建议每个供应商保留一份独立表。", inquiryHeaders, inquiryRows, [120, 100, 150, 180, 100, 90, 110, 100, 100, 110, 260]);

const indexHeaders = ["文件类型", "文件名", "包内路径", "项目原始路径", "用途"];
const indexRows = [
  ["参考图", "TEDDY-TOGO低价补给包装套装-确认稿-v1.png", "01-参考图片/", `${assetRoot}/品牌资产/包装与物料/第一批自有包装风格模板-20260610/`, "TOGO 包装风格参考"],
  ["参考图", "TEDDY-BELLE丝袜服饰礼盒包装-确认稿-v1.png", "01-参考图片/", `${assetRoot}/品牌资产/包装与物料/第一批自有包装风格模板-20260610/`, "BELLE 丝袜盒/服饰礼盒/吊牌参考"],
  ["参考图", "RAINBOW-TEDDY小众礼盒边界卡包装-确认稿-v1.png", "01-参考图片/", `${assetRoot}/品牌资产/包装与物料/第一批自有包装风格模板-20260610/`, "RAINBOW 小众礼盒/边界卡参考"],
  ["LOGO", "Teddy四品牌统一LOGO总览-v2-确认稿.png", "03-LOGO参考/", `${assetRoot}/品牌资产/LOGO设计/最终稿/`, "四品牌 LOGO 总览"],
  ["LOGO", "TEDDY-TOGO平台头像-v1.png", "03-LOGO参考/", `${assetRoot}/品牌资产/LOGO设计/子品牌平台头像/`, "TOGO 贴纸和标签参考"],
  ["LOGO", "TEDDY-BELLE平台头像-v1.png", "03-LOGO参考/", `${assetRoot}/品牌资产/LOGO设计/子品牌平台头像/`, "BELLE 包装与吊牌参考"],
  ["LOGO", "RAINBOW-TEDDY平台头像-v1.png", "03-LOGO参考/", `${assetRoot}/品牌资产/LOGO设计/子品牌平台头像/`, "RAINBOW 包装与边界卡参考"],
  ["说明", "Teddy自有包装体系规划-v1-审核稿.md", "02-规格与说明/", `${assetRoot}/品牌资产/包装与物料/`, "包装体系文字规则"],
];
writeSheet(workbook.worksheets.add("文件路径索引"), "文件路径索引", "给内部协作和供应商资料包整理使用。", indexHeaders, indexRows, [100, 330, 180, 440, 260]);

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  if (used) {
    used.format.rowHeightPx = 42;
  }
  sheet.getRange("A1:K2").format.rowHeightPx = 30;
}

await fs.mkdir(outputDir, { recursive: true });
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputXlsx);

const check = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  summary: "formula error scan",
});
console.log(check.ndjson);
console.log(outputXlsx);

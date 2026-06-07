export const A = {
  cream: "#FFF8E8",
  white: "#FFFFFF",
  gold: "#F6A800",
  orange: "#FF5A1F",
  cocoa: "#3B2416",
  muted: "#7B5A42",
  line: "#F2D7A4",
  belle: "#F3A6B8",
  rainbow: "#7A60A8",
  green: "#3F8F5A",
  paleOrange: "#FFE2CC",
  palePink: "#FBE1E8",
  palePurple: "#EAE3F5",
  shadow: "#00000012",
};

export const fonts = {
  title: "Microsoft YaHei",
  body: "Microsoft YaHei",
  latin: "Aptos",
};

export const assets = {
  logo: "D:/新疆/测试/Teddy/品牌资产/LOGO设计/最终稿/Teddy公司主体LOGO-v1.png",
  togo: "D:/新疆/测试/Teddy/品牌资产/LOGO设计/子品牌平台头像/TEDDY-TOGO平台头像-v1.png",
  belle: "D:/新疆/测试/Teddy/品牌资产/LOGO设计/子品牌平台头像/TEDDY-BELLE平台头像-v1.png",
  rainbow: "D:/新疆/测试/Teddy/品牌资产/LOGO设计/子品牌平台头像/RAINBOW-TEDDY平台头像-v1.png",
  coverBg: "D:/新疆/测试/Teddy/品牌资产/PPT模板预览/A风格封面背景-image2测试-v1.png",
  platformMock: "D:/新疆/测试/Teddy/品牌资产/线上店铺视觉/即时零售平台页面模拟图-v1.png",
  stickerMock: "D:/新疆/测试/Teddy/品牌资产/包装与物料/配送袋贴纸效果图-v1.png",
  storefrontMock: "D:/新疆/测试/Teddy/品牌资产/门店视觉/Teddy门头设计效果图-v1.png",
  viOverview: "D:/新疆/测试/Teddy/品牌资产/VI视觉系统/四品牌VI物料总览图-v1.png",
};

export function bg(ctx, slide, fill = A.cream) {
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: ctx.H, fill });
}

export function title(ctx, slide, text, subtitle = "") {
  ctx.addText(slide, {
    text,
    x: 72,
    y: 48,
    w: 760,
    h: 48,
    size: 31,
    bold: true,
    color: A.cocoa,
    typeface: fonts.title,
  });
  if (subtitle) {
    ctx.addText(slide, {
      text: subtitle,
      x: 74,
      y: 102,
      w: 920,
      h: 30,
      size: 15,
      color: A.muted,
      typeface: fonts.body,
    });
  }
}

export function footer(ctx, slide, text = "Teddy Business Plan · Internal Execution Deck") {
  ctx.addShape(slide, { x: 72, y: 670, w: 1136, h: 1.5, fill: A.line });
  ctx.addText(slide, {
    text,
    x: 72,
    y: 682,
    w: 650,
    h: 18,
    size: 9,
    color: A.muted,
    typeface: fonts.body,
  });
}

export function metric(ctx, slide, value, label, x, y, w = 250, h = 124, color = A.cocoa) {
  ctx.addShape(slide, { x, y, w, h, fill: A.white, line: ctx.line(A.line, 2) });
  ctx.addText(slide, {
    text: value,
    x: x + 16,
    y: y + 22,
    w: w - 32,
    h: 42,
    size: 30,
    bold: true,
    color,
    align: "center",
    typeface: fonts.title,
  });
  ctx.addText(slide, {
    text: label,
    x: x + 18,
    y: y + 76,
    w: w - 36,
    h: 32,
    size: 13,
    color: A.muted,
    align: "center",
    typeface: fonts.body,
  });
}

export function pill(ctx, slide, text, x, y, w, color, textColor = A.white) {
  ctx.addShape(slide, { x, y, w, h: 54, fill: color, line: ctx.line("#00000000") });
  ctx.addText(slide, {
    text,
    x: x + 18,
    y: y + 13,
    w: w - 36,
    h: 24,
    size: 16,
    bold: true,
    color: textColor,
    align: "center",
    typeface: fonts.title,
  });
}

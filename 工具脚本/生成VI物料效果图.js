const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const paths = {
  mainLogo: path.join(root, '品牌资产', 'LOGO设计', '最终稿', 'Teddy公司主体LOGO-v1.png'),
  togoLogo: path.join(root, '品牌资产', 'LOGO设计', '子品牌平台头像', 'TEDDY-TOGO平台头像-v1.png'),
  belleLogo: path.join(root, '品牌资产', 'LOGO设计', '子品牌平台头像', 'TEDDY-BELLE平台头像-v1.png'),
  rainbowLogo: path.join(root, '品牌资产', 'LOGO设计', '子品牌平台头像', 'RAINBOW-TEDDY平台头像-v1.png'),
  online: path.join(root, '品牌资产', '线上店铺视觉', '即时零售平台页面模拟图-v1.png'),
  package: path.join(root, '品牌资产', '包装与物料', '配送袋贴纸效果图-v1.png'),
  storefront: path.join(root, '品牌资产', '门店视觉', 'Teddy门头设计效果图-v1.png'),
  board: path.join(root, '品牌资产', 'VI视觉系统', '四品牌VI物料总览图-v1.png'),
};

for (const out of [paths.online, paths.package, paths.storefront, paths.board]) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
}

const url = (filePath) => {
  const ext = path.extname(filePath).toLowerCase().replace('.', '') || 'png';
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${data}`;
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@600;700&display=swap');
* { box-sizing: border-box; }
body { margin: 0; background: #f4efe6; font-family: "Noto Sans SC", "Microsoft YaHei", Arial, sans-serif; color: #3B2416; }
.stage { position: relative; overflow: hidden; background: #FFF8E8; }
.fredoka { font-family: "Fredoka", "Arial Rounded MT Bold", "Noto Sans SC", sans-serif; letter-spacing: 0; }
.serif { font-family: "Noto Serif SC", "Noto Sans SC", serif; letter-spacing: 0; }
.logo { object-fit: cover; border-radius: 50%; display: block; }
.shadow { box-shadow: 0 22px 60px rgba(59, 36, 22, .16); }
.small { font-size: 22px; color: rgba(59, 36, 22, .72); line-height: 1.5; }
`;

const htmlWrap = (inner, w, h) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="stage" style="width:${w}px;height:${h}px">${inner}</div></body></html>`;

function boardHtml() {
  const logos = [
    ['Teddy', '公司主体', paths.mainLogo, '#F5A623', '#FF5A1F', '#3B2416', 'Fredoka + Noto Sans SC'],
    ['TEDDY TOGO', '低端走量店', paths.togoLogo, '#FF5A1F', '#FFC43D', '#3B2416', 'Fredoka Bold'],
    ['TEDDY BELLE', '高端女性店', paths.belleLogo, '#E8B4B8', '#D4AF37', '#3B2416', 'Noto Serif SC + Fredoka'],
    ['RAINBOW TEDDY', '小众圈层店', paths.rainbowLogo, '#2A164B', '#F45B69', '#FFF8E8', 'Fredoka SemiBold'],
  ];
  return htmlWrap(`
    <div style="padding:64px 72px;">
      <div class="fredoka" style="font-size:58px;font-weight:700;">Teddy Brand VI v1</div>
      <div class="small" style="margin-top:8px;">四品牌 LOGO、品牌色、免费可商用字体方向，用于商业计划书 PPT 与首批视觉物料。</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:26px;margin-top:46px;">
        ${logos.map(([name, role, logo, c1, c2, c3, font]) => `
          <div class="shadow" style="background:white;border-radius:24px;padding:28px;min-height:600px;border:1px solid rgba(59,36,22,.08);">
            <img class="logo" src="${url(logo)}" style="width:190px;height:190px;margin:0 auto 26px;">
            <div class="fredoka" style="font-size:34px;font-weight:700;text-align:center;line-height:1.08;">${name}</div>
            <div style="text-align:center;margin-top:8px;font-size:20px;color:rgba(59,36,22,.66);">${role}</div>
            <div style="display:flex;gap:12px;justify-content:center;margin:32px 0 28px;">
              <div style="width:58px;height:58px;border-radius:50%;background:${c1};border:4px solid white;box-shadow:0 8px 20px rgba(0,0,0,.12);"></div>
              <div style="width:58px;height:58px;border-radius:50%;background:${c2};border:4px solid white;box-shadow:0 8px 20px rgba(0,0,0,.12);"></div>
              <div style="width:58px;height:58px;border-radius:50%;background:${c3};border:4px solid white;box-shadow:0 8px 20px rgba(0,0,0,.12);"></div>
            </div>
            <div style="border-top:1px solid rgba(59,36,22,.12);padding-top:22px;font-size:20px;line-height:1.65;">
              <div><b>主色：</b>${c1}</div>
              <div><b>辅助：</b>${c2}</div>
              <div><b>字体：</b>${font}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `, 1800, 1100);
}

function onlineHtml() {
  const cards = [
    ['即时补货', '安全合规', '#FF5A1F'],
    ['隐私配送', '密封包装', '#FFC43D'],
    ['夜间可达', '同城履约', '#3B2416'],
  ];
  return htmlWrap(`
    <div style="position:absolute;inset:0;background:linear-gradient(135deg,#fff7e4 0%,#fff0e6 58%,#ffe1ca 100%);"></div>
    <div style="position:absolute;left:86px;top:80px;width:520px;">
      <img class="logo shadow" src="${url(paths.togoLogo)}" style="width:150px;height:150px;">
      <div class="fredoka" style="font-size:62px;font-weight:700;margin-top:28px;">TEDDY TOGO</div>
      <div style="font-size:34px;font-weight:700;margin-top:8px;">即时零售平台页面模拟</div>
      <div class="small" style="margin-top:20px;">用于 PPT 展示线上店铺打开后的视觉方向。此图为概念模拟，不使用平台商标，不作为正式平台界面复刻。</div>
      <div style="display:flex;gap:14px;margin-top:34px;flex-wrap:wrap;">
        ${cards.map(([a,b,c]) => `<div style="background:${c};color:${c==='#FFC43D'?'#3B2416':'white'};border-radius:999px;padding:12px 20px;font-size:22px;font-weight:700;">${a} · ${b}</div>`).join('')}
      </div>
    </div>
    <div class="shadow" style="position:absolute;right:110px;top:58px;width:450px;height:860px;background:#111;border-radius:54px;padding:18px;">
      <div style="width:100%;height:100%;background:#f7f7f7;border-radius:40px;overflow:hidden;position:relative;">
        <div style="height:112px;background:linear-gradient(90deg,#FF5A1F,#FFC43D);padding:26px 24px;color:white;">
          <div style="font-size:20px;opacity:.92;">即时零售平台</div>
          <div style="font-size:30px;font-weight:700;margin-top:8px;">附近好店</div>
        </div>
        <div style="padding:22px;">
          <div style="background:white;border-radius:24px;padding:18px;display:flex;gap:16px;box-shadow:0 8px 22px rgba(0,0,0,.08);">
            <img class="logo" src="${url(paths.togoLogo)}" style="width:92px;height:92px;">
            <div style="flex:1;">
              <div class="fredoka" style="font-size:28px;font-weight:700;">TEDDY TOGO</div>
              <div style="font-size:18px;color:#777;margin-top:5px;">30分钟左右送达 · 隐私包装</div>
              <div style="margin-top:10px;display:flex;gap:8px;">
                <span style="background:#FFF0E6;color:#FF5A1F;border-radius:8px;padding:4px 8px;font-size:16px;">新店优惠</span>
                <span style="background:#FFF8E8;color:#3B2416;border-radius:8px;padding:4px 8px;font-size:16px;">可开票</span>
              </div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:20px 0;">
            ${['安全套','润滑','玩具','丝袜'].map(t => `<div style="background:white;border-radius:14px;text-align:center;padding:13px 4px;font-size:17px;color:#3B2416;">${t}</div>`).join('')}
          </div>
          ${['热销基础套装','夜间应急专区','隐私护理组合'].map((t,i) => `
            <div style="background:white;border-radius:18px;margin-bottom:14px;padding:14px;display:flex;gap:14px;">
              <div style="width:88px;height:88px;border-radius:16px;background:${['#FFF0E6','#FFF8E8','#FFE3D2'][i]};display:flex;align-items:center;justify-content:center;color:#FF5A1F;font-weight:700;font-size:20px;">SKU</div>
              <div style="flex:1;">
                <div style="font-weight:700;font-size:22px;">${t}</div>
                <div style="font-size:16px;color:#777;margin-top:6px;">合规上架 · 快速补货 · 明码标价</div>
                <div style="font-size:24px;color:#FF5A1F;font-weight:700;margin-top:8px;">¥${[29,39,59][i]} 起</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `, 1400, 980);
}

function packageHtml() {
  return htmlWrap(`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 25% 10%,#fff 0,#fff7e4 32%,#ead8bd 100%);"></div>
    <div style="position:absolute;left:76px;top:64px;">
      <div class="fredoka" style="font-size:58px;font-weight:700;">Delivery Sticker Mockup</div>
      <div class="small" style="width:520px;margin-top:12px;">统一配送袋 + 子品牌贴纸。实体仓可共用包装物料，只通过贴纸区分线上店铺。</div>
    </div>
    <div class="shadow" style="position:absolute;left:185px;top:245px;width:455px;height:560px;background:#d6ad73;border-radius:12px 12px 28px 28px;transform:rotate(-5deg);">
      <div style="position:absolute;left:0;right:0;top:0;height:88px;background:#c89655;border-radius:12px 12px 0 0;"></div>
      <div style="position:absolute;left:92px;top:128px;width:270px;height:270px;background:white;border-radius:50%;padding:14px;border:10px solid #F5A623;">
        <img class="logo" src="${url(paths.mainLogo)}" style="width:100%;height:100%;">
      </div>
      <div style="position:absolute;left:98px;bottom:70px;background:#3B2416;color:#FFF8E8;border-radius:999px;padding:14px 28px;font-size:24px;font-weight:700;">隐私密封配送</div>
    </div>
    <div class="shadow" style="position:absolute;right:132px;top:170px;width:475px;height:650px;background:white;border-radius:32px;padding:42px;">
      <div style="font-size:32px;font-weight:700;">贴纸组合</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:36px;">
        ${[
          [paths.togoLogo, '#FF5A1F', '快速配送'],
          [paths.belleLogo, '#E8B4B8', '精致精选'],
          [paths.rainbowLogo, '#2A164B', '小众专属'],
          [paths.mainLogo, '#F5A623', 'Teddy 主体']
        ].map(([logo, color, text]) => `
          <div style="border-radius:24px;border:2px solid ${color};padding:18px;text-align:center;background:#FFF8E8;">
            <img class="logo" src="${url(logo)}" style="width:128px;height:128px;margin:0 auto 12px;">
            <div style="font-size:20px;font-weight:700;">${text}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `, 1400, 980);
}

function storefrontHtml() {
  return htmlWrap(`
    <div style="position:absolute;inset:0;background:linear-gradient(#d9d4c7 0 48%,#bfb6a5 48% 100%);"></div>
    <div style="position:absolute;left:110px;right:110px;top:88px;height:620px;background:#f8f5ee;border-radius:18px;box-shadow:0 28px 90px rgba(0,0,0,.24);overflow:hidden;">
      <div style="height:150px;background:#3B2416;display:flex;align-items:center;padding:0 56px;gap:28px;">
        <img class="logo" src="${url(paths.mainLogo)}" style="width:104px;height:104px;">
        <div>
          <div class="fredoka" style="font-size:66px;font-weight:700;color:#F5A623;line-height:1;">TEDDY</div>
          <div style="font-size:22px;color:#FFF8E8;margin-top:8px;">线上即时零售 · 隐私配送 · 三品牌矩阵</div>
        </div>
      </div>
      <div style="height:355px;background:linear-gradient(90deg,#fff8e8,#fff);display:grid;grid-template-columns:1.25fr .75fr;">
        <div style="padding:56px 64px;">
          <div style="font-size:42px;font-weight:700;">实体前置仓与线上品牌展示门头</div>
          <div style="font-size:24px;line-height:1.7;color:rgba(59,36,22,.75);margin-top:18px;width:690px;">门店对外保持亲和、干净、合规的 Teddy 主体形象；线上店铺通过 TOGO、BELLE、RAINBOW 三个子品牌分层承接不同用户。</div>
          <div style="display:flex;gap:18px;margin-top:36px;">
            <img class="logo" src="${url(paths.togoLogo)}" style="width:92px;height:92px;">
            <img class="logo" src="${url(paths.belleLogo)}" style="width:92px;height:92px;">
            <img class="logo" src="${url(paths.rainbowLogo)}" style="width:92px;height:92px;">
          </div>
        </div>
        <div style="background:#FFF0E6;display:flex;align-items:center;justify-content:center;">
          <div style="width:255px;height:255px;border-radius:50%;background:#fff;border:14px solid #F5A623;padding:12px;">
            <img class="logo" src="${url(paths.mainLogo)}" style="width:100%;height:100%;">
          </div>
        </div>
      </div>
      <div style="height:115px;background:#fff;display:flex;align-items:center;justify-content:space-around;font-size:24px;font-weight:700;">
        <span>预约自提</span><span>平台配送</span><span>隐私包装</span><span>合规选品</span>
      </div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:210px;background:#9f9483;"></div>
  `, 1600, 950);
}

async function renderOne(browser, html, outPath, width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.screenshot({ path: outPath, fullPage: false });
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  await renderOne(browser, boardHtml(), paths.board, 1800, 1100);
  await renderOne(browser, onlineHtml(), paths.online, 1400, 980);
  await renderOne(browser, packageHtml(), paths.package, 1400, 980);
  await renderOne(browser, storefrontHtml(), paths.storefront, 1600, 950);
  await browser.close();
  console.log(JSON.stringify(paths, null, 2));
})();

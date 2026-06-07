const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '品牌资产', 'PPT模板预览');

const assets = {
  mainLogo: path.join(root, '品牌资产', 'LOGO设计', '最终稿', 'Teddy公司主体LOGO-v1.png'),
  togoLogo: path.join(root, '品牌资产', 'LOGO设计', '子品牌平台头像', 'TEDDY-TOGO平台头像-v1.png'),
  belleLogo: path.join(root, '品牌资产', 'LOGO设计', '子品牌平台头像', 'TEDDY-BELLE平台头像-v1.png'),
  rainbowLogo: path.join(root, '品牌资产', 'LOGO设计', '子品牌平台头像', 'RAINBOW-TEDDY平台头像-v1.png'),
  viBoard: path.join(root, '品牌资产', 'VI视觉系统', '四品牌VI物料总览图-v1.png'),
  onlineMock: path.join(root, '品牌资产', '线上店铺视觉', '即时零售平台页面模拟图-v1.png'),
  bagMock: path.join(root, '品牌资产', '包装与物料', '配送袋贴纸效果图-v1.png'),
  storefrontMock: path.join(root, '品牌资产', '门店视觉', 'Teddy门头设计效果图-v1.png'),
};

const outputs = {
  a: path.join(outDir, '模板A-暖色品牌型-v1.png'),
  b: path.join(outDir, '模板B-商务执行型-v1.png'),
  c: path.join(outDir, '模板C-高级质感型-v1.png'),
  overview: path.join(outDir, '三种PPT模板对比总览-v1.png'),
};

fs.mkdirSync(outDir, { recursive: true });

const img = (filePath) => {
  const ext = path.extname(filePath).toLowerCase().replace('.', '') || 'png';
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Noto+Sans+SC:wght@400;500;700;900&family=Noto+Serif+SC:wght@600;700&display=swap');
* { box-sizing: border-box; }
body { margin: 0; font-family: "Noto Sans SC", "Microsoft YaHei", Arial, sans-serif; background: #eee8dc; color: #3B2416; }
.canvas { width: 1920px; height: 1080px; overflow: hidden; position: relative; }
.fredoka { font-family: "Fredoka", "Arial Rounded MT Bold", "Noto Sans SC", sans-serif; letter-spacing: 0; }
.serif { font-family: "Noto Serif SC", "Noto Sans SC", serif; letter-spacing: 0; }
.slide-row { position: absolute; left: 84px; right: 84px; top: 232px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 34px; }
.mini { width: 560px; height: 315px; border-radius: 18px; position: relative; overflow: hidden; box-shadow: 0 24px 70px rgba(44, 28, 16, .18); }
.caption { margin-top: 22px; font-size: 25px; font-weight: 900; }
.note { font-size: 20px; line-height: 1.55; color: rgba(59,36,22,.70); margin-top: 7px; }
.logo { object-fit: cover; border-radius: 50%; display: block; }
.pill { border-radius: 999px; padding: 8px 14px; font-size: 15px; font-weight: 900; display: inline-block; }
.footer { position: absolute; left: 84px; right: 84px; bottom: 54px; display: flex; justify-content: space-between; align-items: center; font-size: 20px; color: rgba(59,36,22,.62); }
`;

function wrap(inner) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${inner}</body></html>`;
}

function templateA() {
  return wrap(`
    <div class="canvas" style="background: radial-gradient(circle at 16% 0%, #fff 0, #FFF8E8 34%, #FFE8C5 100%);">
      <div style="position:absolute;left:84px;top:62px;">
        <div class="fredoka" style="font-size:66px;font-weight:700;">Template A · Warm Brand</div>
        <div style="font-size:29px;font-weight:900;margin-top:10px;">暖色品牌型：亲和、可爱、适合讲 Teddy 品牌和即时零售体验</div>
      </div>
      <div style="position:absolute;right:92px;top:64px;display:flex;gap:18px;">
        <img class="logo" src="${img(assets.mainLogo)}" style="width:98px;height:98px;">
        <img class="logo" src="${img(assets.togoLogo)}" style="width:98px;height:98px;">
        <img class="logo" src="${img(assets.belleLogo)}" style="width:98px;height:98px;">
      </div>
      <div class="slide-row">
        <div>
          <div class="mini" style="background:#FFF8E8;">
            <div style="position:absolute;left:44px;top:42px;width:270px;">
              <div class="fredoka" style="font-size:54px;font-weight:700;line-height:1.02;">TEDDY</div>
              <div style="font-size:30px;font-weight:900;margin-top:12px;">一店三线上店</div>
              <div style="font-size:18px;line-height:1.55;margin-top:16px;color:rgba(59,36,22,.7);">从一个实体前置仓出发，承接三个不同定位的线上品牌店。</div>
              <div style="margin-top:22px;"><span class="pill" style="background:#FF5A1F;color:white;">内部汇报版</span></div>
            </div>
            <img class="logo" src="${img(assets.mainLogo)}" style="position:absolute;right:44px;top:48px;width:185px;height:185px;border:8px solid #F5A623;">
            <div style="position:absolute;left:0;right:0;bottom:0;height:20px;background:linear-gradient(90deg,#F5A623,#FF5A1F);"></div>
          </div>
          <div class="caption">封面页</div>
          <div class="note">适合第一眼建立“可爱但合规”的品牌记忆。</div>
        </div>
        <div>
          <div class="mini" style="background:white;">
            <div style="height:58px;background:#3B2416;color:#FFF8E8;display:flex;align-items:center;padding:0 28px;font-size:18px;font-weight:900;">01 · 项目核心模式</div>
            <div style="position:absolute;left:34px;top:91px;width:260px;">
              <div style="font-size:31px;font-weight:900;line-height:1.25;">一个实体店<br>三家线上品牌店</div>
              <div style="margin-top:18px;display:grid;gap:8px;">
                ${['房租共享','人员共享','物料共享','履约共享'].map(t => `<span style="font-size:17px;background:#FFF0E6;border-radius:10px;padding:8px 12px;">${t}</span>`).join('')}
              </div>
            </div>
            <div style="position:absolute;right:34px;top:92px;display:grid;gap:12px;">
              ${[
                [assets.togoLogo, 'TOGO', '#FF5A1F'],
                [assets.belleLogo, 'BELLE', '#E8B4B8'],
                [assets.rainbowLogo, 'RAINBOW', '#2A164B'],
              ].map(([logo, name, color]) => `<div style="display:flex;align-items:center;gap:12px;"><img class="logo" src="${img(logo)}" style="width:60px;height:60px;border:3px solid ${color};"><b style="font-size:21px;">${name}</b></div>`).join('')}
            </div>
          </div>
          <div class="caption">核心模式页</div>
          <div class="note">用品牌色和图标讲清共享成本结构。</div>
        </div>
        <div>
          <div class="mini" style="background:#FFF8E8;">
            <div style="position:absolute;left:34px;top:34px;font-size:30px;font-weight:900;">第3个月验证目标</div>
            <div style="position:absolute;left:34px;top:92px;display:grid;grid-template-columns:1fr 1fr;gap:18px;width:300px;">
              ${[
                ['月营收','5万','#FF5A1F'],
                ['净利润','1.5万+','#F5A623'],
                ['房租','≤4000','#3B2416'],
                ['人员','1-2人','#D4AF37'],
              ].map(([k,v,c]) => `<div style="background:white;border-radius:16px;padding:16px;border-left:8px solid ${c};"><div style="font-size:16px;color:#8a6b4c;">${k}</div><div style="font-size:30px;font-weight:900;color:${c};">${v}</div></div>`).join('')}
            </div>
            <img src="${img(assets.onlineMock)}" style="position:absolute;right:-8px;bottom:-18px;width:235px;border-radius:18px;box-shadow:0 14px 34px rgba(0,0,0,.18);">
          </div>
          <div class="caption">经营目标页</div>
          <div class="note">数字醒目，适合内部对齐目标。</div>
        </div>
      </div>
      <div class="footer"><span>推荐用途：内部汇报 / 品牌确认 / 第一版商业计划书</span><span>视觉关键词：温暖、亲和、轻零售</span></div>
    </div>
  `);
}

function templateB() {
  return wrap(`
    <div class="canvas" style="background:#F6F3EC;">
      <div style="position:absolute;left:0;top:0;bottom:0;width:310px;background:#3B2416;"></div>
      <img class="logo" src="${img(assets.mainLogo)}" style="position:absolute;left:84px;top:70px;width:142px;height:142px;border:6px solid #F5A623;">
      <div style="position:absolute;left:380px;top:66px;">
        <div class="fredoka" style="font-size:60px;font-weight:700;color:#3B2416;">Template B · Executive</div>
        <div style="font-size:29px;font-weight:900;margin-top:10px;">商务执行型：结构清晰、图表密度高、适合团队决策和执行推进</div>
      </div>
      <div class="slide-row" style="left:380px;right:72px;grid-template-columns:repeat(3,470px);gap:30px;">
        <div>
          <div class="mini" style="width:470px;height:264px;background:white;border-radius:10px;">
            <div style="position:absolute;left:30px;top:26px;font-size:16px;font-weight:900;color:#FF5A1F;">TEDDY BUSINESS PLAN</div>
            <div style="position:absolute;left:30px;top:65px;font-size:40px;font-weight:900;line-height:1.14;">成人用品即时零售<br>首店验证计划</div>
            <div style="position:absolute;left:30px;bottom:30px;font-size:16px;color:#766554;">内部执行汇报 · 2026</div>
            <img class="logo" src="${img(assets.mainLogo)}" style="position:absolute;right:30px;bottom:26px;width:96px;height:96px;">
          </div>
          <div class="caption" style="font-size:24px;">封面页</div>
          <div class="note" style="font-size:18px;">更像创业项目内部评审材料。</div>
        </div>
        <div>
          <div class="mini" style="width:470px;height:264px;background:white;border-radius:10px;">
            <div style="height:48px;background:#3B2416;color:#FFF8E8;display:flex;align-items:center;padding:0 24px;font-size:16px;font-weight:900;">02 · 资金使用结构</div>
            <div style="display:grid;grid-template-columns:160px 1fr;gap:22px;padding:28px 26px;">
              <div style="width:148px;height:148px;border-radius:50%;background:conic-gradient(#FF5A1F 0 30%,#F5A623 30% 56%,#D4AF37 56% 72%,#8A6B4C 72% 100%);display:flex;align-items:center;justify-content:center;">
                <div style="width:88px;height:88px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;">15万</div>
              </div>
              <div style="display:grid;gap:9px;font-size:16px;">
                ${[
                  ['首批库存','2.5-4万','#FF5A1F'],
                  ['房租装修','2-3万','#F5A623'],
                  ['平台物料','1-2万','#D4AF37'],
                  ['备用资金','6-8万','#8A6B4C'],
                ].map(([a,b,c]) => `<div style="display:flex;align-items:center;gap:10px;"><span style="width:10px;height:10px;border-radius:50%;background:${c};"></span><b style="width:78px;">${a}</b><span>${b}</span></div>`).join('')}
              </div>
            </div>
          </div>
          <div class="caption" style="font-size:24px;">图表页</div>
          <div class="note" style="font-size:18px;">适合讲资金、SKU、目标拆解。</div>
        </div>
        <div>
          <div class="mini" style="width:470px;height:264px;background:white;border-radius:10px;">
            <div style="height:48px;background:#3B2416;color:#FFF8E8;display:flex;align-items:center;padding:0 24px;font-size:16px;font-weight:900;">08 · 团队责任矩阵</div>
            <div style="padding:25px 24px;display:grid;gap:10px;">
              ${[
                ['刘梓寒','创始人 / 总控','战略、资金、供应链'],
                ['欧阳超','全职执行','门店、平台、履约'],
                ['汤宇盛','兼职PM','进度、节点、风险'],
                ['聂思伟','数据复盘','费用、利润、SKU'],
              ].map(([n,r,d]) => `<div style="display:grid;grid-template-columns:72px 96px 1fr;gap:12px;align-items:center;border-bottom:1px solid #eee;padding-bottom:8px;font-size:15px;"><b>${n}</b><span style="color:#FF5A1F;font-weight:900;">${r}</span><span style="color:#766554;">${d}</span></div>`).join('')}
            </div>
          </div>
          <div class="caption" style="font-size:24px;">责任矩阵页</div>
          <div class="note" style="font-size:18px;">更利于团队落地和分工确认。</div>
        </div>
      </div>
      <div class="footer" style="left:380px;"><span>推荐用途：内部决策 / 投入测算 / 执行计划</span><span>视觉关键词：克制、清晰、可信</span></div>
    </div>
  `);
}

function templateC() {
  return wrap(`
    <div class="canvas" style="background:#1B102D;color:#FFF8E8;">
      <div style="position:absolute;inset:0;background:radial-gradient(circle at 78% 18%,rgba(232,180,184,.32),transparent 28%),radial-gradient(circle at 14% 80%,rgba(245,166,35,.22),transparent 30%);"></div>
      <div style="position:absolute;left:84px;top:62px;">
        <div class="serif" style="font-size:64px;font-weight:700;">Template C · Premium Brand</div>
        <div style="font-size:28px;font-weight:900;margin-top:10px;color:#F3DDC5;">高级质感型：适合对外展示、品牌故事、高端线和未来融资路演</div>
      </div>
      <div style="position:absolute;right:92px;top:74px;display:flex;gap:16px;">
        <img class="logo" src="${img(assets.belleLogo)}" style="width:92px;height:92px;border:4px solid #D4AF37;">
        <img class="logo" src="${img(assets.rainbowLogo)}" style="width:92px;height:92px;border:4px solid #F45B69;">
      </div>
      <div class="slide-row">
        <div>
          <div class="mini" style="background:#2A164B;border:1px solid rgba(212,175,55,.42);">
            <div style="position:absolute;left:42px;top:40px;width:300px;">
              <div class="serif" style="font-size:45px;font-weight:700;line-height:1.12;color:#FFF8E8;">Teddy Brand Matrix</div>
              <div style="font-size:23px;line-height:1.5;margin-top:17px;color:#F3DDC5;">以可爱外壳承接隐私消费，以三品牌矩阵分层用户价值。</div>
              <div style="width:130px;height:4px;background:#D4AF37;margin-top:28px;"></div>
            </div>
            <img class="logo" src="${img(assets.mainLogo)}" style="position:absolute;right:46px;top:54px;width:165px;height:165px;border:6px solid #D4AF37;">
          </div>
          <div class="caption" style="color:#FFF8E8;">封面页</div>
          <div class="note" style="color:#DCCAB5;">更像品牌路演或对外展示。</div>
        </div>
        <div>
          <div class="mini" style="background:#FFF8E8;color:#3B2416;">
            <div style="position:absolute;left:36px;top:32px;font-size:29px;font-weight:900;">品牌分层策略</div>
            <div style="position:absolute;left:36px;top:88px;right:36px;display:grid;gap:14px;">
              ${[
                [assets.togoLogo, '大众刚需', '现金流与平台搜索覆盖', '#FF5A1F'],
                [assets.belleLogo, '高端女性', '客单价与品牌调性', '#D4AF37'],
                [assets.rainbowLogo, '小众圈层', '差异化与私域复购', '#2A164B'],
              ].map(([logo, t, d, c]) => `<div style="display:flex;align-items:center;gap:15px;background:white;border-radius:16px;padding:12px 16px;border-left:7px solid ${c};"><img class="logo" src="${img(logo)}" style="width:54px;height:54px;"><div><b style="font-size:20px;">${t}</b><div style="font-size:15px;color:#766554;margin-top:3px;">${d}</div></div></div>`).join('')}
            </div>
          </div>
          <div class="caption" style="color:#FFF8E8;">品牌矩阵页</div>
          <div class="note" style="color:#DCCAB5;">适合讲品牌故事和用户分层。</div>
        </div>
        <div>
          <div class="mini" style="background:#2A164B;border:1px solid rgba(212,175,55,.42);">
            <img src="${img(assets.bagMock)}" style="position:absolute;left:26px;top:30px;width:240px;border-radius:18px;">
            <div style="position:absolute;right:35px;top:40px;width:220px;">
              <div class="serif" style="font-size:32px;font-weight:700;color:#FFF8E8;">物料与触点</div>
              <div style="font-size:17px;line-height:1.6;margin-top:14px;color:#F3DDC5;">平台头像、配送贴纸、门头和 PPT 视觉统一调用，形成低成本品牌资产。</div>
              <div style="margin-top:23px;"><span class="pill" style="background:#D4AF37;color:#2A164B;">VI v1 Ready</span></div>
            </div>
          </div>
          <div class="caption" style="color:#FFF8E8;">物料展示页</div>
          <div class="note" style="color:#DCCAB5;">视觉更高级，但内部数据页会稍弱。</div>
        </div>
      </div>
      <div class="footer" style="color:#DCCAB5;"><span>推荐用途：对外展示 / 品牌故事 / 未来融资路演</span><span>视觉关键词：高级、克制、品牌感</span></div>
    </div>
  `);
}

function overview() {
  return wrap(`
    <div class="canvas" style="background:#FFF8E8;">
      <div style="position:absolute;left:84px;top:60px;">
        <div class="fredoka" style="font-size:60px;font-weight:700;">Teddy PPT Template Options</div>
        <div style="font-size:28px;font-weight:900;margin-top:8px;">三种风格模板对比，选择后用于生成完整商业计划书 PPT</div>
      </div>
      <div style="position:absolute;left:84px;right:84px;top:190px;display:grid;grid-template-columns:repeat(3,1fr);gap:34px;">
        ${[
          ['A 暖色品牌型', outputs.a, '最推荐第一版', '亲和、可爱、零售感强，适合当前 Teddy 阶段。'],
          ['B 商务执行型', outputs.b, '适合内部推进', '结构清晰、数字密度高，适合团队执行和资金测算。'],
          ['C 高级质感型', outputs.c, '适合对外展示', '品牌感强，适合后续对外路演和高端线表达。'],
        ].map(([name, file, tag, desc]) => `
          <div style="background:white;border-radius:24px;padding:22px;box-shadow:0 22px 60px rgba(59,36,22,.15);">
            <img src="${img(file)}" style="width:100%;height:300px;object-fit:cover;border-radius:16px;object-position:top left;">
            <div style="font-size:30px;font-weight:900;margin-top:22px;">${name}</div>
            <div style="display:inline-block;background:#FF5A1F;color:white;border-radius:999px;padding:8px 14px;font-size:18px;font-weight:900;margin-top:12px;">${tag}</div>
            <div style="font-size:22px;line-height:1.55;color:#6b5646;margin-top:16px;">${desc}</div>
          </div>
        `).join('')}
      </div>
      <div class="footer"><span>建议：如果是第一次内部汇报，优先选 A；如果要推动执行预算，选 B；如果要给外部人看，选 C。</span></div>
    </div>
  `);
}

async function render(browser, html, outPath) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.screenshot({ path: outPath, fullPage: false });
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  await render(browser, templateA(), outputs.a);
  await render(browser, templateB(), outputs.b);
  await render(browser, templateC(), outputs.c);
  await render(browser, overview(), outputs.overview);
  await browser.close();
  console.log(JSON.stringify(outputs, null, 2));
})();

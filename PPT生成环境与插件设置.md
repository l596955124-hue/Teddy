# PPT生成环境与插件设置

> 文档版本：v1.0
> 更新日期：2026-06-06
> 用途：记录 Teddy 项目生成PPT所需的软件、插件、依赖和当前安装状态

---

## 一、计划使用方式

最终PPT计划使用：

1. **Presentation Skills**：用于规划PPT结构、生成 `.pptx`、处理版式和内容。
2. **image2 / 图片生成能力**：用于生成封面图、品牌氛围图、视觉素材、图标或背景图。
3. **WPS**：用于打开、检查、人工微调最终PPT。

---

## 二、当前可用能力

| 能力 | 状态 | 说明 |
|------|------|------|
| Presentation Skills | 已可用 | 本地已有 `pptx` 技能文件 |
| 图片生成能力 | 已可用 | 当前对话环境有图片生成工具，可用于生成PPT视觉素材 |
| WPS | 可人工打开文件 | 命令行未加入 PATH，但可双击/系统默认方式打开 |
| 本地PPT生成 | 已可用 | 已安装 `pptxgenjs` 和 `python-pptx` |
| HTML渲染校验 | 已可用 | 已安装 Playwright Chromium |
| 图片处理 | 已可用 | 已安装 Sharp 和 Pillow |

---

## 三、已安装依赖

### 3.1 Node.js 依赖

安装位置：`D:/新疆/测试/Teddy/node_modules/`

| 依赖 | 状态 | 用途 |
|------|------|------|
| `pptxgenjs` | 已安装 | 生成 `.pptx` 文件 |
| `playwright` | 已安装 | 渲染HTML、截图校验 |
| `sharp` | 已安装 | 图片处理、图标/背景转PNG |
| `react` | 已安装 | 可用于生成图形组件 |
| `react-dom` | 已安装 | 配合React渲染 |
| `react-icons` | 已安装 | 使用图标素材 |

已执行：

```bash
npm.cmd init -y
npm.cmd install pptxgenjs playwright sharp react react-dom react-icons
npx.cmd playwright install chromium
```

### 3.2 Python 依赖

| 依赖 | 状态 | 用途 |
|------|------|------|
| `python-pptx` | 已安装 | 备用PPT生成方案 |
| `openpyxl` | 已安装 | 生成Excel表格 |
| `Pillow` | 已安装 | 图片处理 |

已执行：

```bash
python -m pip install python-pptx
```

---

## 四、测试结果

已成功生成测试文件：

`输出文件/Teddy-PPT环境测试.pptx`

说明本地 `.pptx` 生成链路已经可用。

---

## 五、暂未安装/暂不需要的软件

| 工具 | 当前状态 | 是否必须 |
|------|----------|----------|
| LibreOffice `soffice` | 未在PATH中找到 | 非必须 |
| Poppler `pdftoppm` | 未在PATH中找到 | 非必须 |
| WPS命令行 `wps/et/wpp` | 未在PATH中找到 | 非必须 |

说明：

1. 生成PPT不依赖 LibreOffice。
2. WPS主要用于最终人工打开和检查。
3. 如果后续需要批量把PPT转图片做缩略图校验，再考虑安装 LibreOffice/Poppler。

---

## 六、推荐生成流程

1. 生成 `PPT大纲.md`。
2. 生成 `PPT素材清单.md`。
3. 生成需要的图片素材，保存到 `品牌资产/可复用素材/` 或 `输出文件/`。
4. 使用 `pptxgenjs` 生成 `.pptx`。
5. 使用 Playwright/截图方式检查关键页面视觉。
6. 用 WPS 打开最终PPT人工检查。
7. 最终文件保存到 `输出文件/`。

---

## 七、注意事项

1. 正式LOGO/VI未完成前，先用临时品牌色和文字版 Teddy。
2. 所有可复用图片、图标、背景、色板要保存到 `品牌资产/`。
3. 最终PPT和中间版本都保存到 `输出文件/`。
4. 如果后续要用 Canva 生成，则需走 Canva 的演示文稿大纲确认流程。

---

*PPT生成环境与插件设置 v1.0*

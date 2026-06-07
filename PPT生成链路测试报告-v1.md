# Teddy PPT生成链路测试报告 v1

保存时间：2026-06-06 20:55

## 本轮结论

已确定使用 **A风格：暖色品牌型** 作为商业计划书 PPT 的主模板方向。

本轮已完成 image2/图片生成与 Presentations 的最小链路测试：

1. image2 生成的 A风格封面背景可正常保存到项目资产库。
2. Presentations 插件运行时可用。
3. 已成功生成 3 页 PPTX 测试稿、单页预览图和总览图。
4. 中文文本、品牌 LOGO、图片素材、形状和颜色系统均可插入 PPT。

## 测试产物

- PPTX测试稿：`D:\新疆\测试\商业计划\输出文件\Teddy-A风格PPT链路测试.pptx`
- 总览预览图：`D:\新疆\测试\商业计划\输出文件\PPT可调用素材\PPT链路测试\Teddy-A风格PPT链路测试-总览.png`
- 单页预览图目录：`D:\新疆\测试\商业计划\outputs\manual-20260606-teddy-test\presentations\a-style-chain-test\previews`
- 构建清单：`D:\新疆\测试\商业计划\outputs\manual-20260606-teddy-test\presentations\a-style-chain-test\artifact-build-manifest.json`
- A风格 image2 背景图：`D:\新疆\测试\商业计划\品牌资产\PPT模板预览\A风格封面背景-image2测试-v1.png`

## 使用中发现的阻碍

### 1. Teddy项目根目录不能直接作为 Presentations 工作区

原因：`D:\新疆\测试\商业计划\package.json` 不是 ESM 配置，缺少 `"type": "module"`。

处理方式：正式做 PPT 时，使用独立的 Presentations 工作目录，例如：

`D:\新疆\测试\商业计划\outputs\manual-日期-teddy-ppt\presentations\正式PPT`

### 2. Windows 环境需要设置 HOME

原因：Presentations 脚本默认通过 `HOME` 查找 Codex runtime。

处理方式：运行前设置：

`$env:HOME='C:\Users\燕子三'`

### 3. PowerShell 的 ps1 包装脚本可能被执行策略拦截

处理方式：优先使用 `.cmd` 或 bundled node：

- `npx.cmd`
- `npm.cmd`
- `C:\Users\燕子三\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`

### 4. LOGO正式版需要再做透明底/纯色底整理

测试稿中部分 LOGO 图片边缘有黑底。正式 PPT、平台头像、物料 mockup 前，建议统一处理为：

- 透明底 PNG
- 白底圆形 PNG
- 平台头像安全边距版本

### 5. 本次构建返回码异常但文件生成成功

构建命令返回码为 1，但 PPTX、预览图、总览图和 manifest 均已实际生成，PPTX 内部包含 3 页 slide XML。

正式生成时需要继续观察该问题；如果反复出现，可将输出路径改为英文临时目录，生成后再复制回 Teddy 项目中文目录。

## 正式生成PPT前建议补齐

内容层面仍建议补齐：

1. `PPT大纲-v1.md`
2. `09-发展里程碑.md`
3. `PPT图表数据表.md`
4. 高端店品牌授权/供应商证据截图
5. SKU结构与首批库存预算的图表化版本
6. Firecrawl 登录后的市场数据复核
7. LOGO透明底与平台头像安全边距版本

## 是否还需要额外插件或软件

当前不强制需要新增插件。

已具备：

- image2/图片生成：用于封面背景、场景图、物料 mockup
- Presentations：用于生成 PPTX、预览图、总览图
- Spreadsheets：可用于生成资金测算表、SKU表、执行表
- Firecrawl：可用于市场数据、竞品和供应商公开信息复核，但当前还需要登录/API Key

建议辅助软件：

- WPS 或 PowerPoint：用于最终人工检查字体、动画、版式和导出 PDF
- 图片编辑工具：用于 LOGO 透明底、裁切、安全边距处理

## 下一步建议

先补齐 `PPT大纲-v1.md`、`09-发展里程碑.md` 和 `PPT图表数据表.md`，再按 A风格生成第一版完整商业计划书 PPT。

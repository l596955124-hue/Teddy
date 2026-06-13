# 阶段存档：Computer Use 插件诊断

保存时间：2026-06-07

## 用户问题

用户希望安装并启用 Codex 自带的 Computer Use 插件，用于操控电脑鼠标键盘，进而操作腾讯应用宝/微信小程序等非网页窗口。

## 本机检查结果

### 1. 当前会话工具列表

当前会话没有暴露可直接调用的 Computer Use 工具。

工具搜索没有返回鼠标、键盘、桌面截图类原生工具。

### 2. 可安装插件列表

通过 Codex 当前可安装插件列表检查，未看到 `Computer Use` 插件候选。

当前可安装插件包括 Canva、Figma、GitHub、Gmail、Google Drive、Notion、Slack、Teams 等，但不包括 Computer Use。

### 3. 本机目录

本机存在：

`C:\Users\燕子三\.codex\computer-use\config.json`

内容仅为界面文案配置，例如：

`Codex is using your computer`

这说明本机有 Computer Use 相关前端配置目录，但不等于插件已经可用。

### 4. Codex 日志

日志中看到当前 Codex 会话特性列表包含：

`ComputerUse`

但 remote control 日志显示：

`initial_enabled=false`

状态库中：

`remote_control_enrollments` 表为空。

判断：

> 当前更像是“客户端支持 Computer Use，但本账号/工作区/插件市场还没有启用或完成注册”，不是普通依赖缺失。

## 可能原因

1. Computer Use 插件还没有在 Codex 插件市场安装。
2. 当前账号/工作区没有开放该插件。
3. 工作区管理员未启用对应 app/plugin 权限。
4. 功能处于灰度/地区/计划限制。
5. 本机 remote control enrollment 未完成。

## 当前可执行结论

Codex 当前不能通过官方 Computer Use 工具直接控制鼠标键盘。

可继续使用替代方案：

- Edge 调试端口读取网页数据。
- Firecrawl / AnySearch 抓取公开网页。
- 如用户确认，可安装本地 Python 桌面控制助手用于截图、点击、输入，但这不是官方 Computer Use 插件。

## 建议用户操作

1. 打开 Codex 桌面端插件市场或设置页。
2. 搜索 `Computer Use`。
3. 如果能看到插件，点击安装/启用。
4. 回到“电脑操控”页面确认不再显示“Computer Use 插件不可用”。
5. 重启 Codex 后重新进入本线程测试。

如果插件市场搜索不到 Computer Use，说明当前账号/工作区暂不可用，需要检查 ChatGPT/Codex 计划、工作区插件权限或等待功能开放。

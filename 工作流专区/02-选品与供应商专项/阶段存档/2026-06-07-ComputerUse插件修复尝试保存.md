# Computer Use 插件修复记录

时间：2026-06-07 14:12（Asia/Shanghai）
依据文章：https://www.autoxb.com/article/112216

## 问题判断

Codex 设置页显示“Computer Use 插件不可用”。本机原配置只有 `openai-primary-runtime`，缺少文章提到的 `openai-bundled` marketplace，因此 `chrome@openai-bundled` / `computer-use@openai-bundled` 无法出现在可安装插件列表中。

## 已执行修复

1. 已备份配置：
   - `C:\Users\燕子三\.codex\backups\plugin-repair-20260607-140016\config-before-openai-bundled-20260607-140950.toml`
2. 从 WindowsApps 内置包读取并字节级复制 `openai-bundled` 到普通目录：
   - `D:\CodexPlugins\openai-bundled-bytecopy-20260607-140907`
   - 复制结果：225 个目录、953 个文件；仅跳过 1 个无效/缺失的 pnpm tslib 目录入口。
3. 复制 Codex 桌面运行时到普通目录，避免 WindowsApps 执行权限问题：
   - `D:\CodexPlugins\runtime-openai-codex-26.602.4764.0\codex.exe`
   - `D:\CodexPlugins\runtime-openai-codex-26.602.4764.0\node.exe`
   - `D:\CodexPlugins\runtime-openai-codex-26.602.4764.0\node_repl.exe`
4. 更新 `C:\Users\燕子三\.codex\config.toml`：
   - 添加 `[marketplaces.openai-bundled]`
   - 启用 `[plugins."chrome@openai-bundled"]`
   - 启用 `[plugins."computer-use@openai-bundled"]`
   - TOML 已用 Codex 自带 Python 校验通过。
5. 使用复制出的 `codex.exe` 执行：
   - `codex plugin add chrome@openai-bundled`
   - `codex plugin add computer-use@openai-bundled`
6. 插件列表复核通过：
   - `chrome@openai-bundled` = installed, enabled, version 26.602.40724
   - `computer-use@openai-bundled` = installed, enabled, version 26.602.40724
7. 手动执行 Chrome native host 安装脚本并校验通过：
   - manifest：`C:\Users\燕子三\AppData\Local\OpenAI\extension\com.openai.codexextension.json`
   - registry key：`HKCU\Software\Google\Chrome\NativeMessagingHosts\com.openai.codexextension`
   - check-native-host-manifest 结果：`correct: true`

## 当前结论

本地配置层面已经修复完成。由于 Codex Desktop 当前进程启动时已经加载过旧配置，需要完全退出并重新打开 Codex Desktop 后，设置页里的 Computer Use 状态才可能刷新。

## 下一步验证

1. 彻底退出 Codex Desktop。
2. 重新打开 Codex Desktop。
3. 到 Settings / 电脑操控 查看：
   - Computer Use 是否从“不可用”变为可配置。
   - 是否能把 Edge、腾讯应用宝、微信/WeChatAppEx 等加入允许应用。
4. 回到对话后让我再检查工具是否出现 Computer Use/desktop control 能力。

## 回滚参考

如果重启后异常，可恢复备份配置文件，并删除/忽略：
- `D:\CodexPlugins\openai-bundled-bytecopy-20260607-140907`
- `D:\CodexPlugins\runtime-openai-codex-26.602.4764.0`
- `C:\Users\燕子三\AppData\Local\OpenAI\extension\com.openai.codexextension.json`
## 追加检查：2026-06-07 14:25

用户要求再次测试是否可以操控电脑。当前会话通过 `tool_search` 仍未暴露 Computer Use/桌面鼠标键盘工具。

复核结果：

- `codex plugin list` 仍显示：
  - `chrome@openai-bundled` installed, enabled
  - `computer-use@openai-bundled` installed, enabled
- `state_5.sqlite`：
  - `remote_control_enrollments` 仍为 0
  - `thread_dynamic_tools` 仍为 0
- 日志关键项：
  - `remote_control websocket task started`
  - `state_db_available=true`
  - `initial_enabled=false`

已追加修改 `C:\Users\燕子三\.codex\config.toml`：

```toml
[features]
remote_control = true
computer_use = true
ComputerUse = true
```

修改前备份：

- `C:\Users\燕子三\.codex\backups\plugin-repair-20260607-140016\config-before-remote-control-feature-20260607-142526.toml`

结论：插件和 Chrome native host 已修复，但 Desktop 当前进程仍没有完成 remote_control enrollment。需要完全退出并重启 Codex Desktop 后再次测试。
## 追加测试：再次重启后 2026-06-07

用户要求“你再试试”。本轮再次执行工具发现：

- `tool_search` 仍未暴露 Computer Use 桌面控制工具。
- `tool_search` 搜索 `node_repl js` / `mcp__node_repl__js` 返回 0 个工具。
- `computer-use` 插件 SKILL.md 已读取，插件要求通过 `node_repl` 的 `js` 工具执行 `setupComputerUseRuntime`。
- 当前线程缺少该 `node_repl` 工具，因此无法调用 `sky.list_apps()`。
- `state_5.sqlite` 仍显示：
  - `remote_control_enrollments = 0`
  - `thread_dynamic_tools = 0`
- `computer-use-client.mjs` 依赖 `globalThis.nodeRepl.nativePipe` 和 `SKY_CUA_NATIVE_PIPE_DIRECTORY`。当前 shell 环境没有这些注入项，也未发现可直接安全复用的 Computer Use native pipe。

当前结论：

- 插件安装层、Chrome native host 层已经修好。
- 当前线程仍未获得 Codex Desktop 下发的 Computer Use / Node REPL 动态工具，因此还不能由我直接操控桌面。
- 下一步需要在 Codex 设置页确认“电脑操控 / Computer Use”是否已经从“不可用”变为可配置，并手动允许目标应用；或者开启一个全新的 Codex 线程测试动态工具是否只是不加载到旧线程。
## 追加测试：Chrome 默认浏览器与腾讯应用宝

本轮用户要求：设置默认浏览器为 Chrome，并测试打开网页、腾讯应用宝小程序/美团。

执行结果：

- 已确认 Chrome 安装路径：`C:\Program Files\Google\Chrome\Application\chrome.exe`
- 已用 Chrome 打开美团外卖网页：`https://waimai.meituan.com/`
- 已打开 Windows 默认应用设置页：`ms-settings:defaultapps`
- 已启动腾讯应用宝/Androws：`D:\Program Files\Tencent\Androws\Application\AndrowsLauncher.exe`
- 进程已出现：`AndrowsStore`、`AndrowsSvr`、`AndrowsAssistant`、多个 `WeChatAppEx`

限制：

Windows 默认浏览器通常需要用户在系统设置 UI 中手动确认，不能稳定静默改写。当前 Codex 线程仍没有 Computer Use / node_repl 动态工具，因此只能打开程序，不能代替用户点击腾讯应用宝或美团小程序界面。
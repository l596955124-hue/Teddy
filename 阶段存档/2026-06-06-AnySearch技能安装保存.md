# 阶段存档：AnySearch技能安装完成

保存时间：2026-06-06 21:05

## 已完成

- 已从 GitHub 安装 AnySearch Skill。
- 来源仓库：`https://github.com/anysearch-ai/anysearch-skill.git`
- 安装目录：`C:\Users\燕子三\.codex\skills\anysearch`
- 已读取并确认 `SKILL.md`。
- 已配置运行时文件：`C:\Users\燕子三\.codex\skills\anysearch\runtime.conf`

## 运行配置

当前使用 Codex bundled Node.js 执行：

`C:\Users\燕子三\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe C:\Users\燕子三\.codex\skills\anysearch\scripts\anysearch_cli.js`

选择 Node.js 的原因：

- 当前系统 `python` 指向 WindowsApps 占位程序，不能稳定运行安装/技能脚本。
- Node.js 版本由 Codex runtime 提供，路径稳定，无额外依赖。

## 基础测试

测试命令类型：`search`

测试关键词：`Firecrawl`

测试结果：成功返回 3 条搜索结果，包括 Firecrawl GitHub、官网 About 页面和 Reddit 讨论页面。

## 注意事项

- AnySearch 可匿名访问，但速率限制较低。
- 如果后续大量搜索或出现限流，需要配置 `ANYSEARCH_API_KEY`。
- AnySearch Skill 说明中要求：涉及金融、学术、健康、法律、商业、安全、代码、旅行等垂直领域时，应先调用 `get_sub_domains` 再做垂直搜索。

## 后续用途

AnySearch 可与 Firecrawl 配合使用：

1. AnySearch：快速搜索、发现信息源、批量并行查询。
2. Firecrawl：抓取页面正文、沉淀本地证据、保存市场/竞品/供应商资料。
3. 两者交叉验证后，再写入 PPT 数据口径和商业计划书。

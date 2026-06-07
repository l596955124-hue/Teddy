# Teddy GitHub协作与每日同步规则

> 更新时间：2026-06-07  
> 用途：记录 Teddy 项目公开 GitHub 仓库、协作方式和每日自动同步规则。

---

## 一、公开仓库

GitHub 仓库：

`https://github.com/l596955124-hue/Teddy`

仓库属性：

- Visibility：Public
- 默认分支：`main`
- 本地目录：`D:\新疆\测试\商业计划`
- 说明：本地文件夹已从 `Teddy` 改名为 `商业计划`，GitHub远程仓库名称暂仍为 `Teddy`。

同事可以通过以下方式克隆：

```bash
git clone https://github.com/l596955124-hue/Teddy.git
```

使用自己的 Codex 工具协作时，建议先读取：

1. `README.md`
2. `项目总控上下文-精简版.md`
3. `跨工作流同步规则.md`
4. `项目协作规则.md`

---

## 二、每日自动同步

已创建 Codex 自动化任务：

| 项目 | 内容 |
|------|------|
| 自动化ID | `teddy-github` |
| 名称 | Teddy 每日 GitHub 公开同步 |
| 频率 | 每天 |
| 时间 | 北京时间 23:30 |
| 工作目录 | `D:\新疆\测试\商业计划` |
| 目标仓库 | `l596955124-hue/Teddy` |
| 分支 | `main` |

自动化任务会：

1. 检查 `.gitignore`。
2. 确认 `.firecrawl/`、`node_modules/`、`outputs/`、`.env*` 不被提交。
3. 执行敏感信息扫描。
4. 如果有变更，自动 commit 并 push 到 GitHub。
5. 确认远程仓库仍为 Public。
6. 如果发现疑似密钥或推送失败，停止提交并报告。

---

## 三、公开仓库注意事项

由于仓库是公开的，任何人都可能看到内容。

禁止提交：

- API Key
- Token
- 密码
- `.env` 文件
- Firecrawl缓存
- `node_modules`
- 临时构建目录 `outputs`

可以提交：

- 商业计划书
- PPT
- 品牌资产
- 执行流程
- 公开来源资料
- 跨工作流同步规则

---

## 四、同事协作建议

同事使用自己的 Codex 时，建议这样开场：

```text
请先读取这个仓库中的 README.md、项目总控上下文-精简版.md、跨工作流同步规则.md，然后基于 Teddy 项目的统一口径继续协作。
```

如果同事要修改内容：

1. 先 `git pull`。
2. 修改或新增对应文件。
3. 保存结论到本地文件。
4. 提交并推送，或等待每日自动同步。

---

## 五、当前状态

第一次公开推送已完成。

后续每日自动同步由 `teddy-github` 自动化任务负责。

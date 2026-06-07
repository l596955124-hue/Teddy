# Teddy 阶段存档：Firecrawl 安装与基础数据校验

保存时间：2026-06-06

## 一、已完成

1. 已从 Firecrawl 官方仓库安装 Codex skills：
   - `firecrawl-cli`
   - `firecrawl-search`
   - `firecrawl-scrape`
   - `firecrawl-crawl`
   - `firecrawl-map`
   - `firecrawl-build-search`
   - `firecrawl-build-scrape`

2. 已安装 Firecrawl CLI：
   - 版本：`firecrawl-cli@1.16.2`
   - Windows 可执行文件：`C:\Users\燕子三\AppData\Roaming\npm\firecrawl.cmd`

3. 已检查 Firecrawl 状态：
   - CLI 已安装成功。
   - 当前未登录/未认证。
   - 需要后续执行 `firecrawl.cmd login --browser` 或设置 `FIRECRAWL_API_KEY`。

4. 已创建 Firecrawl 缓存目录：
   - `D:\Teddy创业项目\.firecrawl`

5. 已将 `.firecrawl/` 加入项目 `.gitignore`。

6. 已完成第一轮基础数据公开来源校验，并保存文件：
   - `D:\Teddy创业项目\基础数据校验-Firecrawl与公开来源-v1.md`
   - `D:\Teddy创业项目\市场数据口径说明-v1.md`

## 二、关键校验结论

1. 成人用品市场规模：
   - 原 `1500亿` 可作为保守口径。
   - PPT 建议改成“千亿级市场，公开资料显示 2024 年约 1900 亿元量级”。

2. 成人用品行业增速：
   - `15%-20%` 暂不建议写死。
   - PPT 先写“持续增长”，等后续 Firecrawl 深查补权威来源。

3. 即时零售：
   - “30分钟万物到家”和即时零售高增长趋势可以保留。
   - 具体增速建议标注来源或写成趋势表达。

4. 宝安月市场规模：
   - `600-1000万元/月` 建议标注为内部测算，不作为官方数据。

5. SKU 与财务目标：
   - 当前口径内部一致。
   - PPT 必须强调“上架SKU不等于深库存”。

## 三、后续待做

1. 重启 Codex，让新安装的 Firecrawl skills 自动进入技能列表。
2. 完成 Firecrawl 登录认证。
3. 用 Firecrawl 深查并保存：
   - 成人用品行业规模来源
   - 即时零售增长来源
   - 宝安区统计公报原文
   - 美团/饿了么/淘宝闪购类目规则
4. 继续补：
   - `PPT大纲-v1.md`
   - `09-发展里程碑.md`
   - `PPT图表数据表.md`

## 四、下次继续提示

“继续 Teddy 项目，Firecrawl 已安装但未认证。先登录 Firecrawl，然后继续深查市场数据和平台规则，补 PPT 大纲与图表数据表。”

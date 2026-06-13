[线报精选](https://www.autoxb.com/)

[实时线报](https://www.autoxb.com/timeline)

[影视资源](https://www.autoxb.com/video-resources)

[付费资源](https://www.autoxb.com/learning-resources)

[PDD互助](https://www.autoxb.com/pdd)

[京东淘宝签到](https://www.autoxb.com/qiandao)

API分享

[API分享](https://www.autoxb.com/nodes/apishare) [节点分享](https://www.autoxb.com/nodes/subhub) [AI 额度查询](https://www.autoxb.com/nodes/aitools) [运动步数](https://www.autoxb.com/nodes/bstools) [去水印解析](https://www.autoxb.com/nodes/qsytools) [实时热点](https://www.autoxb.com/nodes/hotnow)

[文章归档](https://www.autoxb.com/articles)

1. [首页](https://www.autoxb.com/)
2. / [攻略](https://www.autoxb.com/sections/guide)
3. /windows 解决 codex 的 computer use 插件无法使用问题

05/31 19:49更新时间：2026/05/31 19:49浏览：4.0k

# windows 解决 codex 的 computer use 插件无法使用问题

我的版本是 26.521.10419，更新之后，刷某音都说 win 也可以使用 computer use 的插件了。

想着试试，发现显示不可用的状态，就让 codex 自己联网搜索修了修，codex 的总结就是

> Codex 设置页要能显示 Chrome / Computer Use，至少要同时满足：
>
> openai-bundled marketplace 注册正常。
>
> chrome@openai-bundled /computer-use@openai-bundled 能被 codex plugin list 找到。
>
> 插件已经 installed, enabled。
>
> 插件缓存目录完整，尤其是 Chrome 的 scripts/browser-client.mjs、extension-host.exe。
>
> Chrome native host 注册正常。
>
> 问题是：openai-bundled 源没正确进入 marketplace；直接从 WindowsApps 应用包安装又因为文件是 Application Protected，触发 os error 6000。所以界面只看到 “配置里启用了”，但插件市场和缓存实际不可用，UI 就不显示。
>
> 正确修法

**1\. 先备份**

Bash复制代码

```bash
$backup = “𝐻𝑂𝑀𝐸\.𝑐𝑜𝑑𝑒𝑥\backups\plugin −𝑟𝑒𝑝𝑎𝑖𝑟 −(Get-Date -Format yyyyMMdd-HHmmss)”
New-Item -ItemType Directory -Force $backup
Copy-Item “$HOME.codex\config.toml” $backup -Force
Copy-Item “$HOME.codex.codex-global-state.json” $backup -Force -ErrorAction SilentlyContinue
```

**2\. 找 Codex 桌面版 bundled 插件源**

SQL复制代码

```sql
Get-Process Codex | Select-Object Path
然后按实际路径找到：
…\Codex…\app\resources\plugins\openai-bundled
如果直接注册后安装报 os error 6000，不要硬改权限，正确做法是复制一份未加密镜像到用户目录，再注册这个镜像源。
```

**示例：把这里改成你本机实际路径**

Bash复制代码

```bash
$src = “D:\WindowsApps\OpenAI.Codex_版本号 \app\resources\plugins\openai-bundled”
$dst = “$HOME.codex\plugins\sources\openai-bundled-fixed”
```

**用字节流复制，避免 WindowsApps 加密属性导致 os error 6000**

SQL复制代码

```sql
New-Item -ItemType Directory -Force $dst | Out-Null
Get-ChildItem $src -Recurse -Directory | ForEach-Object {
New-Item -ItemType Directory -Force (Join-Path 𝑑𝑠𝑡.FullName.Substring($src.Length).TrimStart('')) | Out-Null
}
Get-ChildItem $src -Recurse -File | ForEach-Object {
$target = Join-Path 𝑑𝑠𝑡.FullName.Substring($src.Length).TrimStart('')
New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
[IO.File]::WriteAllBytes(𝑡𝑎𝑟𝑔𝑒𝑡,[𝐼𝑂.𝐹𝑖𝑙𝑒] ::𝑅𝑒𝑎𝑑𝐴𝑙𝑙𝐵𝑦𝑡𝑒𝑠(_.FullName))
}
codex plugin marketplace remove openai-bundled
codex plugin marketplace add $dst
codex plugin add chrome@openai-bundled
codex plugin add computer-use@openai-bundled
验证：
codex plugin list --marketplace openai-bundled
应该看到：
chrome@openai-bundled installed, enabled
computer-use@openai-bundled installed, enabled
最后重启 Codex。
```

也可以使用：

YAML复制代码

```yaml
https://github.com/chen0416ccc-cpu/codex-windows-fast-patch-skill
```

YAML复制代码

```yaml
使用 codex-windows-fast-patch 这个 skill，检查并修复这台 Windows 机器上的 Codex Desktop Fast Mode、插件市场和 Computer Use 等可用性问题。
```

免责声明

本站内容均来源于网络整理、用户投稿或公开信息，仅供学习交流与信息参考使用，不保证其实时性、完整性、准确性或可用性。

文中涉及的软件、项目、教程、资源、活动与链接，请用户自行甄别风险后再访问或使用；因使用相关内容所产生的任何问题、损失或纠纷，均由用户自行承担。

若相关内容涉及版权、侵权、失效链接或不适宜展示的信息，请以实际权利状态为准；本站仅做信息展示与聚合，不对第三方内容承担担保责任。

## 相关文章

## [\[20260322\]中国联通 Python 版置顶精选热门](https://www.autoxb.com/article/20260322-python)

更新时间：2026/03/26 23:13浏览：451

## [14点 美团领60-30卷 最后一场 有需要的记得卡点去哦‼️](https://www.autoxb.com/article/113664)

更新时间：2026/06/07 13:54浏览：7

## [本地活动，参与参与，水了一个最差奖](https://www.autoxb.com/article/113663)

更新时间：2026/06/07 13:20浏览：6

## [老赖死了 欠的钱多久会消除](https://www.autoxb.com/article/113662)

更新时间：2026/06/07 13:18浏览：13

实时线报交流群1

2026线报精选 \| 优惠线报 \| 实用攻略 \| 热门内容

持续更新站内精选内容。

免责声明：本站内容为网络整理与信息聚合，仅供参考，请自行甄别活动时效、规则变化与使用风险。

[关于本站](https://www.autoxb.com/about) [联系我们](https://www.autoxb.com/contact) [隐私政策](https://www.autoxb.com/privacy) [服务条款](https://www.autoxb.com/terms)

友情链接

[AutoXb 中转站](https://ai.autoxb.com/) [AI Navigator](https://daohang.autoxb.com/) [去水印下载](https://parse.autoxb.com/) [tool工具箱](https://tool.autoxb.com/) [算24小游戏](https://24.autoxb.com/)
# RetroGPT Skin for DSH

让 DeepSeek Harness 回到 2022 年的 ChatGPT。

2022 年底，ChatGPT 刚刚问世。深灰色的侧边栏、绿色的 ChatGPT 标志、简洁的对话界面，还有那个熟悉的纸飞机发送按钮，构成了很多人对生成式 AI 最初的印象。

那时候的 GPT-3.5 远没有今天的模型强大，但第一次和它对话时的惊喜，至今仍然令人难忘。

RetroGPT Skin 是一个为 DeepSeek Harness 制作的怀旧主题插件，尝试还原早期 ChatGPT 网页版的视觉风格，同时保留 Harness 原有的功能和交互。

我们永远怀念那个 AI 技术开始爆炸式发展的时代。

## 功能

### 经典 ChatGPT 外观

- **深色侧边栏**：还原早期 ChatGPT 标志性的深灰色侧边栏，浅色和深色主题下保持一致。
- **双主题支持**：支持浅色与深色模式，并可直接在对话标题栏中切换。
- **经典对话布局**：用户与 AI 消息统一左对齐，采用早期 ChatGPT 的阅读布局。
- **整行背景色带**：用户和 AI 回复使用不同的背景颜色，以细线分隔。
- **复古头像**：支持经典 ChatGPT 标记与 DeepSeek 图标，每轮 AI 回复只在开头显示一个头像。
- **纸飞机发送按钮**：还原经典发送图标，生成过程中仍保留原有的停止按钮。
- **打字机光标**：AI 流式输出时，在文本末尾显示闪烁的方块光标。

### 个性化设置

插件提供独立的 **GPT retro UI** 设置页面。

| 设置 | 说明 |
|---|---|
| AI 头像 | 经典 ChatGPT 标记 / DeepSeek 图标 |
| 用户头像颜色 | 6 种预设颜色及自由取色 |
| 用户头像图片 | 上传自定义图片替换默认头像 |
| 正文字号 | 13–18 px，默认 15 px |
| 纸飞机发送按钮 | 开启 / 关闭 |
| 打字机光标 | 开启 / 关闭 |

头像支持 PNG、JPEG、WebP 和 GIF 格式。图片仅在本地处理，不会上传。

所有皮肤偏好均保存在本地。

## 安装

插件包名：`dsh-retrogpt-skin`

### 方法一：通过 DSH CLI 安装（推荐）

如果当前版本的 DSH CLI 支持从 npm 包名安装插件，可以执行：

```bash
dsh plugin install dsh-retrogpt-skin
```

部分版本使用基于 profile 的插件管理命令：

```bash
dsh plugin --profile web add dsh-retrogpt-skin
```

具体以当前 DSH CLI 的帮助信息为准：

```bash
dsh plugin --help
```

### 方法二：通过 npm 安装

```bash
npm install dsh-retrogpt-skin@0.7.5
```

一定要**带版本号**。早期为了占住包名，先发布过一个 `0.0.0-stage` 的占位包（内容只有一个 `package.json`，没有 `dsh.bundle`），而 npm 的 `latest` 标签还停在那上面。插件管理器"按包名安装"时取的是 `latest`，于是会拿回那个空壳，并报：

> 这个包没有声明组合包，无法作为插件安装

正式版本本身是完整的（含 `dsh.bundle.patch`）。把 `latest` 指回正式版之后，就可以省略版本号：

```bash
npm dist-tag add dsh-retrogpt-skin@0.7.5 latest   # 需要 npm 登录
npm unpublish dsh-retrogpt-skin@0.0.0-stage       # 可选：删掉占位包
```

如果希望安装到全局 npm 环境：

```bash
npm install -g dsh-retrogpt-skin@0.7.5
```

**注意：** npm 安装只负责获取插件文件，并不保证 DeepSeek Harness 会自动识别或启用插件。安装后仍可能需要通过 DSH 插件管理器注册对应 bundle。

### 方法三：从 GitHub 安装

从 GitHub 克隆项目：

```bash
git clone https://github.com/YOUR_USERNAME/dsh-retroGPT-skin.git
cd dsh-retroGPT-skin
```

然后从项目目录安装：

```bash
dsh plugin install .
```

### 方法四：从本地目录安装

如果已经下载并解压插件源码，可以直接指定本地目录：

```bash
dsh plugin install "./dsh-retroGPT-skin"
```

也可以使用插件管理器中的 `install_bundle` 功能，指定插件目录，并启用 `include:retrogpt-skin`。

**安装或更新后，请重新打开 DeepSeek Harness 窗口，使皮肤完整生效。**

## 卸载

通过 DSH CLI 卸载：

```bash
dsh plugin remove dsh-retrogpt-skin
```

插件禁用或卸载后，会清理注入的样式与界面元素，恢复 Harness 原本的外观。

个性化设置默认保留在本地，方便下次启用时继续使用。

如果是通过 npm 安装到 Node.js 项目，也可以使用：

```bash
npm uninstall dsh-retrogpt-skin
```

注意，npm 卸载与 DSH 插件管理器中的卸载是两回事。

## 实现方式

RetroGPT Skin 是一个客户端主题插件，不需要直接修改 DeepSeek Harness 的应用文件。

插件使用 Harness 提供的主题覆盖能力、界面插槽和客户端扩展机制，对原有界面进行样式调整。

主要包括：

- 通过 `ctx.theme.overrideTokens()` 调整主题颜色。
- 使用 CSS 实现对话布局、头像和背景色带。
- 在标题栏注入明暗主题切换按钮。
- 在设置页面提供独立的个性化选项。
- 使用 `localStorage` 保存皮肤偏好。

插件不会修改对话内容本身。禁用皮肤后，相关样式和界面元素会被移除。

## 兼容性

已验证的运行时版本：

- `@deepseek-ai/dsh-desktop-runtime@0.2.1-rc.3`

部分样式依赖 Harness 的页面结构和 CSS 选择器。后续版本如果调整了界面实现，可能需要更新适配。

目前尚未完善的部分包括：

- 早期 ChatGPT 风格的三栏欢迎页。
- 部分弹出菜单与对话框的视觉适配。
- 窄窗口下的细节优化。
- 自定义强调色与主题预设导入、导出。

如遇到样式冲突或布局问题，欢迎提交 Issue。

## 与其他主题插件共存

RetroGPT Skin 会修改对话背景、侧边栏、字体及部分布局样式。

不建议与其他大幅修改相同区域的主题插件同时启用，尤其是全屏壁纸、透明窗口和侧边栏重构类插件。

## 灵感来源

灵感来自 [ThrowbackGPT](https://github.com/arshawnarbabi/ThrowbackGPT)，一个重现早期 ChatGPT 网页界面的开源项目。

RetroGPT Skin 希望把那种熟悉的感觉带到 DeepSeek Harness 中。

它不是要让今天的 AI 变回过去，而是想留住那个时代的界面，以及第一次接触 ChatGPT 时的记忆。

**致 GPT-3.5，致 2022 年底。**

---

RetroGPT Skin 是非官方社区主题项目，与 OpenAI、ChatGPT 或 DeepSeek 官方没有关联。
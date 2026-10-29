# Release notes

## 0.7.4 — 2026-10-29

- 开发工具改为通过命令行接收图片路径，移除本机用户目录和附件标识。
- 移除包元数据中的个人账号链接。
- 打包前增加隐私检查，阻止常见个人路径、邮箱和凭据进入源码包。

## 0.7.3 — 2026-10-29

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **头像仍然偏低**：0.7.2 给两种行用了同一个 `16px + (行高 - 方块) / 2` 公式，但**只有用户行有那 16px 的内边距**，回答行的第一行字是从行顶开始的。实测（截图 2110×507、DPR 2.5）：15px 字号下，回答行首行墨迹中心在行顶下方 12.4px，也就是 `行高 / 2`；方块中心比它低 15.4px——正好等于多加的那 16px。
  - 现在拆成两条：回答行 `top: calc((1.6 * var(--rgs-font-size, 15px) - 30px) / 2)`（15px 字号时 −3px，中心落在行顶 +12px，与实测 12.4px 对齐），用户行保留 `16px + …`；≤720px 档位（26px 方块、用户行 14px 内边距）同样分开算。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。数值来自用户截图的像素测量（`tools/measure-avatar.py`）。

## 0.7.2 — 2026-10-29

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **0.7.1 之后一个头像都不显示**：0.7.1 把「画头像」完全交给了 JS 打的 `data-rgs-turn-start` 标记，标记没落到行上就整片没有头像。现在分两层：
  - 样式层加了**纯 CSS 兜底**：紧跟在用户行之后的 AI 回答行（`:not([data-chat-group-part="reasoning"])`），以及列首的回答行，不需要任何标记就直接画头像。这覆盖了绝大多数轮次，即使脚本没跑也不会「全空」。
  - 脚本层只负责兜底覆盖不到的情况（一轮里先出现工具行、再出现回答行时，标记那条回答行）。扫描改成按**每个会话容器**分别重算轮次边界，不再只信第一个 `[data-conversation-content]`——窗口里可能同时挂着多个会话视图（分栏、后台保留的旧视图），只取第一个会让可见会话永远拿不到标记，这正是 0.7.1 头像全空的成因。
- **头像与首行文字垂直对齐**：之前是固定 `top: 2px`（AI）/`17px`（用户），和行高没有关系。现在按行内边距 + 行盒高度算：`top: calc(16px + (1.6 * var(--rgs-font-size, 15px) - 30px) / 2)`，宽窗口 ≤720px 档位用 26px 方块与 14px 内边距的对应公式；改字号时头像自动跟着居中。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。像素级对齐仍需截图确认（本会话无法抓取桌面窗口）。

## 0.7.1 — 2026-10-29

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **一轮里出现两个 AI 头像**：之前每一条 AI 回答行都会画头像，思考过程中一步一条，看起来像两个头像并排。现在每轮只在该轮**第一条真回答行**画头像。
  - 轮次边界是用户行，而「上一个用户行之后的第一条 AI 行」纯 CSS 表达不出来（`~` 兄弟组合只能跨整列，不能按轮分组），所以由 JS 扫描打 `data-rgs-turn-start`，样式表只认这个标记；没打标记的行保持同样的 72px 缩进，只是不画头像。
  - 折叠的「已思考」行依旧跳过；标记随内容变化重算，历史消息与未来的消息一视同仁。
- **刚发出的用户消息先出现在右侧再跳到左侧**：原因是「用户行内部左对齐」的规则挂在 `[data-chat-flow-kind="user"]` 上，而消息刚挂载的那一帧还没有这个属性（或落在 pending 包装里），于是先按宿主默认的右对齐画了一帧，属性到位后再跳左。
  - 现在这几条内部规则（`_userRow` / `_userStack` / `_bubble` 归零气泡）改成直接匹配用户节点自己的 CSS-module 类名——这些类名只属于用户消息，因此既不会误伤其它节点，也在第一帧就生效。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。像素级效果仍需截图确认（本会话无法抓取桌面窗口）。

## 0.7.0 — 2026-10-29

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 新增

- **打字机光标**：AI 回答流式输出时，最后一个字符后面跟随一个闪烁的方块光标（`steps()` 硬切闪烁，不淡入淡出）。
  - 判断"是否在流式"用的是宿主自己的可见状态：发送按钮在流式态渲染 `svg > rect`（停止方块），空闲态是 `svg > path`（箭头），所以存在 `[class*="_primary"] > svg > rect` 就等于正在生成。命中时给最新一条 AI 回答行打 `data-rgs-typing`，样式表在该行最后一个正文块的末尾用 `::after` 画光标。
  - 光标跟随「最后一个字符」而非独占一行，因为 `::after` 落在块的行内内容末尾；折叠的「已思考」行不接管光标。
  - 设置页新增「打字机光标」开关，默认开；`prefers-reduced-motion: reduce` 下不闪。
- 没有改写宿主 markdown 的任何字符：不逐字包 span、不动 React 管理的节点，流式重渲染、停止、重试的既有行为不受影响（对应文档 F03）。

### 说明

- 逐字"蹦出来"本身来自宿主的流式 token 推送；本插件只负责光标与节奏感，不做二次打字模拟——二次模拟会把已完成的历史消息也重放一遍，且必须改写 React 拥有的文本节点，风险高于收益。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。

## 0.6.6 — 2026-10-29

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **0.6.5 的 48px 没生效的原因**：0.6.4 是用行内 `style.padding-top` 写的空条，写完后该行一直带着这个行内值，而 0.6.5 的判断是「已经有 padding-top 就不再写」，于是行内值永远停在 34px，新数值根本没机会落地——所以看起来「完全没有改进」。
  - 现在改成**标记 + 样式表**：`client.js` 只给「首块是卡片」的回复行打 `data-rgs-card-first` 属性，空条高度写在 `STYLES` 里（`padding-top: 52px`）。属性是幂等的，重复执行一定覆盖；以后只调间隙也不必改 JS。
  - 52px = 按钮行 28px + 24px 实际间隙。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。

## 0.6.5 — 2026-10-29

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- 0.6.4 给卡片型回复留的 34px 顶部空条太窄：按钮行 28px 高，只剩 6px 与卡片相隔，视觉上仍然贴着卡片。`ACTION_STRIP` 改为 48px，按钮在空条内、卡片下移，二者之间留出 20px。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。

## 0.6.4 — 2026-10-29

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **AI 回复里的点赞/点踩/复制那一行压住了「已编辑 N 个文件」卡片**。悬浮按钮是相对 turn tail 行绝对定位、再按测量出的 `--rgs-actions-lift` 提到回复顶部的；当这条回复**第一块内容就是卡片**（编辑文件、工具结果等）时，按钮正好落在卡片右上角上。
  - 现在 `placeTurnActions()` 会先判断回复首块是不是正文块（`P / UL / OL / PRE / H1–H6 / BLOCKQUOTE / TABLE / HR / DL`）：
    - 首块是正文 → 维持原样，按钮浮在第一行右侧的 96px 空列里；
    - 首块是卡片 → 给该行留出 34px 的顶部空条（按钮高 28px + 6px），按钮落在空条里，卡片下移，不再重叠。
  - 空条只在需要时加，行内其它样式不变；插件停用时会一并清掉（`paddedAnchors` 集合在清理函数里逐个 `removeProperty("padding-top")`）。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。
- 视觉仍需人工确认：卡片型回复首行留白、正文型回复按钮位置。

## 0.6.3 — 2026-10-29

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 变更

- **浅色模式下用户与 AI 的背景反差加大**：用户发言仍是纯白 `#FFFFFF`，AI 底色带从 `#F7F7F8` 加深到 `#ECECEC`，分隔细线相应改为 `#DCDCDC`（原来 `#E5E5E5` 在白底上几乎看不见）。
- 输入座的「铺平」规则原本只在深色下生效，现在两种模式都生效：浅色下输入区也统一成 AI 底色带，不再出现「对话区 → 输入区」的淡出渐变。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。

## 0.6.2 — 2026-10-29

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修正

- **AI 回复底部的「本轮费用 ≈ …」与下方的用户发言分界线离得太近**。费用/复制/赞踩这一行是宿主在回答之后单独渲染的 turn tail 行（`[data-turn-tail]`），它原本没有上下内边距，所以紧贴分界线。
  - 现在给它 `padding-top: 8px; padding-bottom: 20px`：上方与回答正文留出呼吸，下方与用户色带/分界线之间留出空隙。
  - 悬浮的赞踩按钮仍是绝对定位并由测量出的 `--rgs-actions-lift` 上提到回答首行，这次的内边距不影响它的位置。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。

## 0.6.1 — 2026-10-29

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修正

- **深色模式下输入区与对话区交界不再是渐变**。宿主在 `data-phase=active` 时把输入座（`[data-composer-seat]`）吸底，并盖一层 36px 的 `linear-gradient(transparent → bg-base)`，本意是让滚上去的文字淡出；配上灰色页面后，这段渐变看上去就是交界处「颜色变来变去」。
  - 现在深色模式把输入座整块铺平为 AI 底色带 `#444654`，与对话区连成一片，输入卡片（`#40414F`）直接浮在上面。
  - 宿主的规则是 `.root[data-phase] .seat`（特异度 0,3,0），要压过它必须用一次 `!important`；作用域仍限定在 `body[data-ds-dark-theme]` 内。浅色模式保持原样。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。

## 0.6.0 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 变更

- **深色模式的对话配色改成截图里那种「灰 + 更深灰」**（经典 ChatGPT 深色值）：
  - 对话页 / 用户发言色带：`#343541`（原来是纯黑 `#000`）
  - AI 发言底色带：`#444654`（原来是 `#212121`）
  - 分隔细线：`#4A4B57`
  - 输入框卡片：`#40414F`（原来是 `#171717`，在 `#343541` 上会像一块黑洞）
- 对话页底色**只作用在会话子树**：新增 `--rgs-page-band`，铺在 `[data-slot="main.conversation"]` 上，并在该子树内重映射 `--dsw-alias-bg-base`（宿主用这个 token 画会话根节点，不重映射会被盖回黑色）。设置页、侧边栏等 Harness 其它界面保持原有深色，不受影响。
- 浅色模式不变：纯白页面 / 用户色带 + `#F7F7F8` AI 色带。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。
- 具体像素值取自用户截图（1000×1435）采样：用户行 `#35353F`、AI 行 `#434655`（截图有视频压缩偏移，因此取经典值 `#343541` / `#444654`）。

## 0.5.2 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 变更

- **设置侧栏里的入口名固定为英文 `GPT retro UI`**：它和宿主自带的分区并排，不跟随皮肤自己的语言设置（原来的 `GPT怀旧UI设计` 与重注册逻辑已删除，面板不再因语言切换而重挂载）。
- 「界面语言」仍然只切换设置页内部的文案与顶栏按钮提示。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。

## 0.5.1 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修正

- **界面语言只切换本插件自己的文案**（0.5.0 误用了客户端 `locale.setLocale()`，会把整个 Harness 界面一起切走）。现在语言是皮肤自己的偏好：新增 `lang`（`"" | "zh" | "en"`，存于 `localStorage["dsh-retrogpt-skin:ui:v1"]`，`""` = 跟随 Harness 语言）。
  - 生效范围：本设置页全部文案、顶栏明暗按钮的 `title/aria-label`（**0.5.2 起不再包含设置侧栏的入口名**）。
  - 宿主界面语言完全不动。
  - 「恢复默认」把 `lang` 复位为跟随 Harness 语言。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。
- 未做点击核对：需要你点一下 English，确认只有设置页与按钮提示变英文、宿主界面不变。

## 0.5.0 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 新增

- 设置页新增「界面语言」分段按钮（**已被 0.5.1 修正语义**：0.5.0 期间它调用官方 `locale.setLocale()`，切换的是整个 Harness 界面）。

## 0.4.4 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **0.4.2 把品牌行（鱼形标记 + `deepseek` 字标）也一起上墨，导致字标在深色侧栏上"消失"**：那条 `[class*="_logoRow"] * { color: #202123 }` 已删除，品牌行恢复用侧栏的浅色文字。
- **`HARNESS` 徽标改为只调它自己的字色**：字标是**一个 SVG**（`BrandWordmark`，定义在 `@deepseek-ai/dsh-web-frontend/dist/assets/index-BXV-oxvX.js`），其中 `deepseek` 字形与徽标底板都用 `currentColor`（=侧栏的 `#ECECEC`），而徽标**字母**用 `var(--dsw-alias-label-primary-inverted)`。因此现在只在 `[data-slot="sidebar"]` 子树里把该别名固定为 `#202123`：浅色主题下不再出现白底白字，深色主题下与原先观感一致，`deepseek` 字标保持浅色。
- 「＋ 新会话」行的浅色主题上墨（`#202123`）保留 —— 它确实是一块白色按钮。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。
- 未做像素级核对：`HARNESS` 徽标在两种主题下的观感需你确认。

## 0.4.3 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 变更

- **AI 发言的操作按钮（复制 / 赞 / 踩 / 重新生成）移到发言区右侧**：宿主的这一排按钮属于**发言之后的 `turn-tail` 行**（`data-turn-tail`，`TurnTailNodeView`），不在发言行内部，所以只能用「测量 + 抬升」的方式来对齐：
  - 样式：`[data-turn-tail]{position:relative}`，其内的 `[class*="_actions"]` 改为 `position:absolute; top:0; right:0`；发言行再加 96px 右内边距，给按钮留出通道，避免压住正文与代码块。
  - 脚本：`placeTurnActions()` 对每个 `turn-tail` 行向上找最近的、非 `reasoning` 的 `assistant-step` 行，把两行的 `getBoundingClientRect().top` 之差写进该行的 `--rgs-actions-lift`，样式表再用 `translateY(calc(-1 * var(--rgs-actions-lift)))` 把按钮抬到发言顶部；`MutationObserver`（body，childList+subtree）与 `resize` 以 150 ms 抖动重算，字体大小变化后也会重算；卸载时断开观察器并清掉所有 `--rgs-actions-lift`。
  - 之所以测量而不是搬 DOM：CSS 无法「抬到上一个兄弟元素的顶部」（高度未知），而搬动 React 管理的节点会在卸载时触发 `NotFoundError`。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。
- 未做像素级核对：按钮的实际位置（是否与发言首行齐平、是否与右侧边距对齐）需你在会话里确认。

## 0.4.2 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **浅色模式下左上角「deepseek / HARNESS / ＋ 新会话」看不清**：这两行在浅色主题里落在浅色表面上，却继承了皮肤给深色侧栏准备的浅色文字（`#ECECEC`），于是白字压白底。0.4.2 **只给这两行重新上墨**（`#202123`），侧栏其余部分的令牌保持原样：
  - 品牌行：`[class*="_logoRow"]` 及其内部元素（鱼形标记、`deepseek`、`HARNESS` 徽标、折叠按钮）。
  - 新会话行：`[class*="_newSession"]` 及其内部元素（`＋` 号、`新会话` 文字、快捷键提示）。
- 为了能只在浅色主题生效，客户端新增一个根属性 `html[data-rgs-theme="light" | "dark"]`：由 `theme.getTheme().active.colorScheme` 写入，并订阅 `theme/change` 跟随切换，卸载时移除。宿主本身只在 `<body>` 上标 `data-ds-dark-theme`，没有对应的「浅色」标记。

### 验证状态

- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。
- 未做像素级核对：这两行的实际观感需你在浅色模式里确认（尤其 HARNESS 徽标的底色与文字对比）。

## 0.4.1 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **明暗切换按钮位置放错了**：0.4.0 用 `shell.overlay` + `position: fixed` 把它钉在窗口右上角，结果浮在对话区上方，不在标题栏那一排按钮里。0.4.1 改为注册进 `conversation.session.header.utilities`（该插槽就是会话标题栏右侧那一排工具按钮，「按 order 升序」），`order: -20`，正好排在 **`open-in-app`（"用文件资源管理器打开"，`order: -10`）的左侧**；其余同级是 `schedule-catalog`(-5)、`session-log-download`(0)。
- 样式改成行内按钮（28×28、透明底、悬停用 `--dsw-alias-interactive-bg-hover`、`flex: none` + 2px 右边距），跟随该行的高度与间距，不再有 fixed 定位。
- `dsh.client.inject` 相应改为 `ui-theme` / `ui-conversation` / `ui-settings-general`（不再需要 `ui-layout`）。

### 已知取舍

- `conversation.session.header.utilities` 是**会话作用域**插槽：没有打开会话时（空白欢迎页）标题栏没有这一排按钮，切换按钮也就不会出现；空白页仍可在「设置 → 通用 → 外观」里切换明暗。如果希望首页也常驻一个，可以再叠一个 `shell.overlay` 的兜底按钮并用 `:has()` 在标题栏存在时隐藏 —— 需要你确认要不要。

### 验证状态

- `Cordis Inspect` → `conversation.session.header.utilities` 占用者：`retrogpt-skin-toggle`(-20) → `open-in-app`(-10) → `schedule-catalog`(-5) → `session-log-download`(0)，四项均 `active: true`。
- `node --check client.js` 通过；`plugin_manager set_plugin` 关→开 `application: applied`，无警告。

## 0.4.0 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 新增

- **用户头像可自定义**（设置 → 「GPT怀旧UI设计」→ 外观）：
  - 颜色：6 个预设色块 + 系统取色器（`<input type="color">`），改完立刻反映到每条用户消息左侧的方块。
  - 图片：可上传 PNG/JPEG/WebP/GIF，前端用 canvas 居中裁方、缩到 128×128 再转 PNG data URI 存进偏好（不写服务器、不走宿主接口）；有图时方形头像直接换成图片（`data-rgs-user-avatar="image"` + `--rgs-user-image`），并带缩略图预览与「移除」。
  - 两个新喜好项存在同一个 `localStorage["dsh-retrogpt-skin:ui:v1"]` 里，字段为 `userAvatarColor` / `userAvatarImage`，仍带 `schema: 1`；读写都做校验（颜色须为 `#rrggbb`，图片须为 `data:image/` 且不超限）。
- **明暗切换按钮移到整个界面右上角**：原来挂在侧栏页脚（`sidebar.footer.action`），现在注册进 `shell.overlay`（`id: retrogpt-skin-toggle`，`order: 60`），用 `position: fixed` + `top: var(--dsh-frame-overlay-top)` + `right: 10px` 定位 —— 这个变量由宿主按「Windows 标题栏高度 + 20px」（全屏时 20px）给出，所以按钮始终落在标题栏下方的右上角，不压住窗口按钮，也不受会话页/首页切换影响（`shell.overlay` 是常驻、点击穿透的整框图层）。深色模式显示太阳、浅色模式显示月亮，颜色改用宿主令牌以适配两种底色。

### 变更

- `dsh.client.inject` 改为 `ui-theme` / `ui-layout` / `ui-settings-general`（不再需要 `ui-sidebar`，侧栏页脚那处注册已移除）。
- 切换按钮的样式全部走宿主令牌（`--dsw-alias-label-secondary`、`--dsw-alias-interactive-bg-hover`、`--dsw-alias-brand-primary`），不再是写死的深色侧栏配色。

### 验证状态

- `Cordis Inspect`：`shell.overlay` 占用者列表出现 `retrogpt-skin-toggle`（`order: 60`，`active: true`），与 `cost-meter-context-intro`(50)、`trading-mode-app`(500) 并列；`settings.section` 仍有 `retro-ui`（`order: 200`）。
- `node --check client.js` / `index.js` 通过；`plugin_manager set_plugin` 关→开后 `application: applied`，无警告。
- 未做像素级截图核对（本机窗口无法被本会话截图）；颜色/图片两类控件与定位的实际观感需在界面里确认。

## 0.3.3 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **纸飞机图标不对**：0.3.0–0.3.2 用的是实心剪影，和参考图里那种**细线描边的纸飞机**不是一回事。0.3.3 换成描边图形（24×24 视框、`fill: none`、`stroke-width: 1.9`、圆角线帽与线接），只保留外轮廓和中间那道折线；作为 mask 用时 alpha 只来自笔画，所以不会出现实心块。
- 图标颜色独立成 `--rgs-plane`（浅色 `#8E8E8E`、深色 `#A1A1AA`），悬停时才加深到正文色；按钮底色保持透明，不再出现宿主的蓝色圆钮。

## 0.3.2 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **黑白分界线不齐（中间有细线、两侧突然没有）**：0.3.1 用 `border-top` / `border-bottom` 给用户行画分隔线，而边框只能画在 760px 的行盒上，色带却靠 `box-shadow` 铺到整个对话区宽度 —— 于是细线只覆盖中间一段，两侧的「黑→灰」直接过渡，看上去像台阶。0.3.2 删掉这两条边框，改用与色带同样的挤出做法：用户行的 `::after` 是一条 1px 伪线，靠自身 `box-shadow: 0 0 0 100vmax` 铺满对话区宽度、再用 `clip-path: inset(0 -100vmax)` 裁回 1px 高，位置钉在色带下沿（`bottom: 0`），正好落在黑与灰的分界上。
- 顺带修掉一个仅在探针构建里存在的语法风险：PowerShell 的 `Get-Content`/`Set-Content` 往返会把本文件的中文与破折号写成替换字符（13 行受影响），已改为用 edit / Node 写文件并逐行修复；`client.js` 现在全文无 `U+FFFD`。

### 验证状态

- 探针回读：用户行 `border: 0px/0px`；`::after` 为 `position: absolute`、`height: 1px`、`bottom: 0px`（高 223 的行里 `top: 222px`）、`background: rgb(51,51,51)`、`box-shadow: rgb(51,51,51) 0 0 0 1152px`、`clip-path: inset(0px -1152px)`；行盒 `x 333 w 760`，滚动容器 `x 280 w 870` —— 挤出宽度（1152px）覆盖两侧各 53/57px 的边距，线因此横贯整个对话区。
- 收尾：探针路由、`DIAG`/`diag()` 全部移除；`node --check` 通过；`Select-String 'DIAG|diag(|probe|TEMPORARY'` 无命中。

## 0.3.1 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **「两侧两条大灰条、中间还是白的」**：0.3.0 把 AI 底色画在 760px 对话列的 box-shadow 上，阴影只在列外绘制，列内本身透明 —— 于是灰色只出现在列两侧的边距里。0.3.1 改为直接给**对话滚动容器**（`[data-conversation-scroll]`）上底色，灰色从对话区左沿连续到右沿，用户行再在它上面铺自己的整条色带。
- **历史消息没有 AI 头像**：0.3.0 靠 `MutationObserver` 逐轮打标记（只标每轮第一条），旧记录/后续渲染容易漏。0.3.1 改为纯 CSS：每条 AI 回答行都出头像，折叠的「已思考」行（24px 高）跳过以免与下一行压住。旧的 `markTurnAvatars()` 与观察器整段删除。

### 验证状态

- 探针回读（浏览器真实计算样式）：`[data-conversation-scroll]` 盒 `280..1150`、高 604、`background-color: rgb(33,33,33)`；列盒 `333..1093`、`background: rgba(0,0,0,0)`（透明，由容器底色透出）；AI 回答行均透明、`::before` 可见并带 PNG data URI。
- 客户端热重载校验：把侧栏按钮 `order` 临时改成 6 再 re-apply，`Slots` 立刻返回 `order: 6`，证明模块是按磁盘最新内容加载的（不是缓存）。
- 收尾：探针路由、`DIAG`/`diag()`、临时 `order` 改动全部还原；`node --check` 通过；之后 5 分钟内 `.probe` 无新文件写入。

## 0.3.0 — 2026-10-28

目标版本：`@deepseek-ai/dsh-desktop-runtime` 0.2.1-rc.3（未验证其他版本）。

### 修复

- **断带（一块灰一块黑）**：0.2.0 逐行上色，`turn-process` / `tool-call` 行没有色带、行间 16px 外边距又露出黑底，于是看起来是碎片。0.3.0 改成一次性给对话列铺底色（`box-shadow` + `clip-path`），所有行一律透明，用户行再在上层铺自己的色带 —— 但这版仍有「列内透明、只填两侧」的缺陷，见 0.3.1。
- **深色 AI 色带亮度**：`#171717` → `#212121`，与纯黑用户色带区分更明确（浅色仍为 `#F7F7F8` / 纯白）。
- 正文行字号改由皮肤自己的 `--rgs-font-size` 驱动（原先只改 `--dsh-content-font-size`，被行内规则压住）。

### 新增

- **设置页「GPT怀旧UI设计」**（`settings.section`，`id: retro-ui`，`order: 200`）：
  - AI 头像二选一：**GPT 结** / **DeepSeek 鲸鱼**，直接来自你给的两张图（按亮度提取白色墨迹 + alpha，内联为 PNG data URI，不依赖外链）。
  - 正文字号 13–18 px（默认 15）。
  - 纸飞机发送按钮开关。
  - 一键恢复默认。
- **按轮标记头像**：`MutationObserver`（`childList`/`subtree`，只监听 `data-chat-flow-kind`、`data-chat-turn` 两个属性）把头像只标在每轮第一条 `assistant-step` 上，同一轮后续行不再重复。
- 正文换行 1.6、对话列宽 760px（覆盖宿主 `--dsh-chat-content-width`）。

### 变更

- 皮肤自身偏好存 `localStorage["dsh-retrogpt-skin:ui:v1"]`（`{ schema: 1, aiAvatar, fontSize, planeSend }`）；宿主没有客户端设置存储服务，这与其它客户端插件一致。
- `dsh.client.inject` 增加 `@deepseek-ai/dsh-client-ui-settings-general`（设置页插槽的声明方）。
- 宿主半恢复为 `export function apply() {}`：探针路由、`readBody`、`inject: ['webServer']` 全部移除；`client.js` 里的 `DIAG`/`diag()` 及其定时器同样移除，`node --check` 通过，仓库内 `Select-String 'DIAG|diag|probe'` 无命中。

### 验证状态

- 已通过：`node --check`（`client.js`、`index.js`）；`Theme.listTokens` 返回 23 个令牌；`sidebar.footer.action` 占用 `retrogpt-skin-toggle`；`settings.section` 占用 `id: retro-ui, order: 200, active: true`。
- 结构校验（探针回读浏览器计算样式）：列 `max-width: 760px`、`box-shadow: rgb(23,23,23) 0 0 0 1152px`（单张 AI 底）、用户行 `bg rgb(0,0,0)`、`padding 16px 24px 16px 72px`；`grp=response` 的 assistant 行带 `data-rgs-turn-avatar` 且 `::before` 为头像 data URI，其余 assistant 行 `visibility: hidden`；所有行 `font-size 15px`。
- **未验证**：真实截图。本会话无浏览器控制权；窗口不响应 F5/Ctrl+R，需关闭再打开。

### 已知限制

- 三列欢迎页未做：宿主没有标题/正文插槽，只能替换官方组件，风险过高。
- 浮层/门户未逐个核对；`dsh-pocket` 窄窗布局只做了 ≤720px 一档。
- 浅色模式下侧边栏仍是 `#202123`（按设计文档要求，与宿主浅色主题不一致）。

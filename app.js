const sampleTrades = [
  {
    id: 1,
    date: "2026-05-23",
    market: "MNQ",
    session: "NY Open",
    direction: "Long",
    setup: "Liquidity Sweep + BOS",
    context: "前高被扫后快速收回，5m 形成 BOS，回踩 FVG 入场。",
    entry: 18720.25,
    stop: 18692.25,
    exit: 18778.25,
    contracts: 2,
    r: 2.07,
    result: "+2.07R",
    grade: "A",
    emotion: "冷静",
    tags: ["扫流动性", "BOS", "FVG", "顺势"],
    mistake: "无明显错误",
    lesson: "等待确认后入场，执行质量较好。"
  },
  {
    id: 2,
    date: "2026-05-22",
    market: "MES",
    session: "London Close",
    direction: "Short",
    setup: "Range Rejection",
    context: "区间上沿假突破，但入场过早，未等确认K线收盘。",
    entry: 5348.5,
    stop: 5356.5,
    exit: 5356.5,
    contracts: 3,
    r: -1,
    result: "-1R",
    grade: "C",
    emotion: "急躁",
    tags: ["区间", "过早入场", "逆势"],
    mistake: "没有等待收盘确认；止损设置合理但交易质量不足。",
    lesson: "区间交易必须等反转确认，不能看到影线就追。"
  }
];

const setupLibrary = [
  {
    name: "主要趋势反转 / Major Trend Reversal (MTR)",
    category: "趋势反转",
    quality: "核心策略",
    signal: "强趋势后突破趋势线，回测趋势极值；出现强反转棒，收盘靠近高点或低点。",
    entry: "突破信号棒极值 1 tick 入场。",
    stop: "信号棒另一端极值。",
    target: "1:1 或 2:1 盈亏比，或下一个磁铁位。",
    note: "新趋势的潜在开始。初学者胜率约 40%，必须搭配合理盈亏比。"
  },
  {
    name: "二次入场 / High 2 & Low 2 (H2/L2)",
    category: "趋势延续",
    quality: "核心策略",
    signal: "强趋势中的两腿回调（ABC 修正）；第二条修正腿结束时出现趋势信号棒。",
    entry: "H2 突破前一棒高点做多；L2 跌破前一棒低点做空。",
    stop: "信号棒极值外。",
    target: "趋势恢复后的等量移动（MM）或前高/前低。",
    note: "强趋势中最可靠的顺势模型；H2/L2 代表空头或多头第二次尝试失败。"
  },
  {
    name: "楔形反转 / Wedge Reversal (Wedge)",
    category: "趋势反转",
    quality: "核心策略",
    signal: "收敛通道中出现三次推进，第三次推进后形成反转棒。",
    entry: "突破反转信号棒。",
    stop: "楔形顶点或底点极值外。",
    target: "至少两腿反向移动，或回到楔形起点。",
    note: "三次推进通常代表趋势动能衰竭；牛市通道最终多向下突破，熊市反之。"
  },
  {
    name: "最终旗形 / Final Flag (FF)",
    category: "趋势反转",
    quality: "核心策略",
    signal: "长期趋势末端，靠近重要支撑/阻力；出现紧凑交易区间或水平旗形。",
    entry: "旗形反向突破并确认后入场。",
    stop: "失败突破棒的极值外。",
    target: "回测旗形中轴、趋势线或趋势反转目标。",
    note: "磁铁效应会吸引价格回测；若旗形顺趋势突破失败，往往预示趋势结束。"
  },
  {
    name: "突破回调 / Breakout Pullback (BO PB)",
    category: "突破延续",
    quality: "核心策略",
    signal: "价格突破重要支撑/阻力或交易区间后，出现小型回测K线或反转棒。",
    entry: "确认回测结束，价格重新向突破方向移动时。",
    stop: "突破棒或回调信号棒极值外。",
    target: "突破区间宽度的 1:1 等量移动。",
    note: "高概率模型。关键不是追突破，而是等待市场确认突破真实有效。"
  },
  {
    name: "楔形旗形 / Wedge Flag (WF)",
    category: "趋势延续",
    quality: "核心策略",
    signal: "趋势中的三腿回调（High 3 / Low 3），形成倾斜的收敛旗形。",
    entry: "第三腿结束并出现反转信号时。",
    stop: "信号棒极值外。",
    target: "顺趋势方向的磁铁位或前高/前低。",
    note: "复合型回调，比简单 H2/L2 更有韧性，但必须顺大级别趋势。"
  },
  {
    name: "交易区间反转 / Trading Range Reversal (TRR)",
    category: "区间交易",
    quality: "核心策略",
    signal: "市场横盘震荡；区间边界出现真实测试、假突破或失败突破棒。",
    entry: "边界反转触发时低买高卖。",
    stop: "区间边界外侧。",
    target: "先看区间中轴，再看区间另一端。",
    note: "默认每次突破都可能失败。核心是寻找失望的多头或空头，不在区间中部入场。"
  },
  {
    name: "开盘反转 / Opening Reversal (OR)",
    category: "开盘策略",
    quality: "核心策略",
    signal: "开盘前一小时常见剧烈波动；缺口回踩 EMA、昨日高低点后出现第一波冲刺失败。",
    entry: "第一波冲刺失败后的反转信号。",
    stop: "信号棒极值外。",
    target: "当天潜在趋势极值、VWAP 或另一重要磁铁位。",
    note: "用于捕捉全天趋势，但不要接开盘第一下；等待失败和反转得到确认。"
  },
  {
    name: "等量移动 / Measured Move (MM)",
    category: "目标工具",
    quality: "辅助工具",
    signal: "出现清晰的两腿波动结构，第一腿之后形成修正旗形（AB=CD）。",
    entry: "配合旗形突破或其他策略入场，不单独作为信号。",
    stop: "通常放在旗形起点或原策略失效点。",
    target: "根据第一腿高度投射第二腿目标。",
    note: "主要用于确定止盈位置，或在目标位附近寻找趋势反转机会。"
  },
  {
    name: "磁铁位测试 / Magnet Test (MT)",
    category: "目标工具",
    quality: "辅助工具",
    signal: "价格接近昨日高低点、EMA、整数关口、区间边界等重要位置时快速吸引。",
    entry: "触及磁铁位后，必须等待明确反转信号。",
    stop: "磁铁位外侧或反转结构失效点。",
    target: "反弹至区间内部、均值或下一磁铁位。",
    note: "不是独立 Setup，而是为所有交易提供获利目标和位置逻辑。"
  }
];

const icons = {
  chart: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-7"/></svg>',
  plus: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  list: '<svg class="icon" viewBox="0 0 24 24"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>',
  target: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  book: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>',
  check: '<svg class="icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
  warn: '<svg class="icon" viewBox="0 0 24 24"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  up: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>',
  down: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/></svg>',
  search: '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>',
  filter: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/></svg>',
  clock: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  money: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>',
  user: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  camera: '<svg class="icon" viewBox="0 0 24 24"><path d="M14.5 4l1.5 3H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4l1.5-3z"/><circle cx="12" cy="13" r="3"/></svg>'
};

const state = {
  tab: "dashboard",
  account: "LUCID 50K",
  customAccounts: loadCustomAccounts(),
  market: "MNQ",
  direction: "Long",
  contextType: "窄通道",
  entrySignal: "有入场信号K",
  editingId: null,
  query: "",
  trades: loadTrades()
};

const tabs = [
  { id: "dashboard", label: "首页", icon: icons.chart },
  { id: "new", label: "记录", icon: icons.plus },
  { id: "review", label: "复盘", icon: icons.list },
  { id: "stats", label: "统计", icon: icons.target },
  { id: "me", label: "我的", icon: icons.user }
];

function loadTrades() {
  try {
    const stored = window.localStorage.getItem("trading-journal-trades");
    if (!stored) return sampleTrades;
    return JSON.parse(stored);
  } catch {
    return sampleTrades;
  }
}

function saveTrades() {
  try {
    window.localStorage.setItem("trading-journal-trades", JSON.stringify(state.trades));
  } catch {
    // Some local file previews disable storage. The app still works for this session.
  }
}

function loadCustomAccounts() {
  try {
    const stored = window.localStorage.getItem("trading-journal-accounts");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCustomAccounts() {
  try {
    window.localStorage.setItem("trading-journal-accounts", JSON.stringify(state.customAccounts));
  } catch {
    // Local file previews can block storage; the account still works for this session.
  }
}

function exportBackup() {
  const backup = {
    app: "trading-journal",
    version: 1,
    exportedAt: new Date().toISOString(),
    trades: state.trades,
    customAccounts: state.customAccounts
  };
  downloadTextFile(`trading-journal-backup-${backup.exportedAt.slice(0, 10)}.json`, JSON.stringify(backup, null, 2), "application/json");
}

function exportCsv() {
  const headers = [
    "日期",
    "交易时间",
    "平仓时间",
    "账户",
    "品种",
    "方向",
    "市场背景",
    "Setup",
    "信号K",
    "入场",
    "止损",
    "出场",
    "R倍数",
    "实际盈亏",
    "备注"
  ];
  const rows = state.trades.map(trade => [
    trade.date,
    formatDateTime(trade.tradeTime),
    formatDateTime(trade.closeTime),
    trade.account,
    trade.market,
    trade.direction,
    trade.context,
    trade.setup,
    trade.signalCandle,
    trade.entry,
    trade.stop,
    trade.exit,
    trade.r,
    getTradePnl(trade),
    trade.note || trade.mistake || trade.lesson || ""
  ]);
  const csv = [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\n");
  downloadTextFile(`trading-journal-${new Date().toISOString().slice(0, 10)}.csv`, `\ufeff${csv}`, "text/csv;charset=utf-8");
}

function importBackup(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      restoreBackupData(parsed);
    } catch (error) {
      window.alert(`导入失败：${error.message || "备份文件格式不正确"}`);
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function importBackupText() {
  const input = document.getElementById("backup-json-text");
  if (!input) return;
  try {
    const parsed = JSON.parse(input.value.trim());
    restoreBackupData(parsed);
  } catch (error) {
    window.alert(`导入失败：${error.message || "备份内容不是正确的 JSON"}`);
  }
}

function restoreBackupData(parsed) {
  const trades = Array.isArray(parsed) ? parsed : parsed.trades;
  const customAccounts = Array.isArray(parsed.customAccounts) ? parsed.customAccounts : [];
  if (!Array.isArray(trades)) throw new Error("备份文件里没有交易记录");
  const shouldImport = window.confirm(`将导入 ${trades.length} 条交易记录，并覆盖当前本机记录。确定继续吗？`);
  if (!shouldImport) return;
  state.trades = trades;
  state.customAccounts = customAccounts.filter(Boolean);
  state.editingId = null;
  saveTrades();
  saveCustomAccounts();
  state.tab = "dashboard";
  render();
  window.alert("导入完成。");
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvCell(value) {
  const text = value === undefined || value === null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function getEditingTrade() {
  if (!state.editingId) return null;
  return state.trades.find(trade => String(trade.id) === String(state.editingId)) || null;
}

function startEditTrade(id) {
  const trade = state.trades.find(item => String(item.id) === String(id));
  if (!trade) return;
  state.editingId = trade.id;
  state.account = trade.account || state.account;
  state.market = trade.market || state.market;
  state.direction = trade.direction || state.direction;
  state.contextType = trade.contextType || state.contextType;
  state.entrySignal = trade.entrySignal || state.entrySignal;
  if (trade.account && !["LUCID 50K", "LUCID 100K", "其他"].includes(trade.account) && !state.customAccounts.includes(trade.account)) {
    state.customAccounts.push(trade.account);
    saveCustomAccounts();
  }
  state.tab = "new";
  render();
}

function deleteTrade(id) {
  const trade = state.trades.find(item => String(item.id) === String(id));
  if (!trade) return;
  const label = `${trade.account || ""} ${trade.market || ""} ${trade.setup || ""}`.trim();
  const shouldDelete = window.confirm(`确定删除这条交易记录吗？\n${label}`);
  if (!shouldDelete) return;
  state.trades = state.trades.filter(item => String(item.id) !== String(id));
  if (String(state.editingId) === String(id)) state.editingId = null;
  saveTrades();
  render();
}

function badge(text, tone = "") {
  return `<span class="badge ${tone}">${escapeHtml(String(text))}</span>`;
}

function statCard(icon, title, value, note) {
  return `
    <article class="card stat">
      <div class="stat-top">
        <div>
          <div class="stat-label">${title}</div>
          <div class="stat-value">${value}</div>
        </div>
        <div class="icon-box">${icon}</div>
      </div>
      <p class="stat-note">${note}</p>
    </article>
  `;
}

function pageHead(title, subtitle) {
  return `<header class="page-head"><h1>${title}</h1><p>${subtitle}</p></header>`;
}

function dashboard() {
  const total = state.trades.length;
  const wins = state.trades.filter(trade => Number(trade.r) > 0).length;
  const totalR = state.trades.reduce((sum, trade) => sum + Number(trade.r || 0), 0);
  const avgR = total ? totalR / total : 0;
  const recent = [...state.trades].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 4);

  return `
    <section class="page">
      ${pageHead("交易复盘", "MES / MNQ · 价格行为交易日志")}
      <div class="grid-2">
        ${statCard(icons.list, "交易次数", total, "本周期记录")}
        ${statCard(icons.target, "胜率", `${total ? Math.round((wins / total) * 100) : 0}%`, "仅供复盘，不单独决策")}
        ${statCard(icons.money, "累计R", `${totalR.toFixed(2)}R`, "优先看R倍数")}
        ${statCard(icons.chart, "平均R", `${avgR.toFixed(2)}R`, "衡量执行质量")}
      </div>
      <article class="card">
        <div class="card-title">
          <h2>今日复盘重点</h2>
          ${badge("价格行为", "purple")}
        </div>
        <ul class="focus-list">
          <li><span class="ok">${icons.check}</span><span>先判断大级别结构：趋势、震荡、关键流动性位置。</span></li>
          <li><span class="ok">${icons.check}</span><span>入场必须有触发条件：扫流动性、BOS/CHOCH、回踩确认或拒绝K线。</span></li>
          <li><span class="warn">${icons.warn}</span><span>重点统计：过早入场、追单、未按计划止损、新闻前交易。</span></li>
        </ul>
      </article>
      <h2 class="section-title">最近交易</h2>
      ${recent.length ? recent.map(tradeCard).join("") : `<article class="card empty">还没有交易记录。</article>`}
    </section>
  `;
}

function tradeCard(trade) {
  const positive = Number(trade.r) > 0;
  return `
    <article class="card trade-card">
      <div class="trade-head">
        <div>
          <div class="badge-row">
            ${trade.account ? badge(trade.account, "amber") : ""}
            ${badge(trade.market, "blue")}
            ${badge(trade.direction, trade.direction === "Long" ? "green" : "red")}
          </div>
          <h3 class="trade-title">${escapeHtml(trade.setup)}</h3>
          <p class="trade-meta">${escapeHtml(formatDateTime(trade.tradeTime) || trade.date || "-")}</p>
        </div>
        <div class="result ${positive ? "win" : "loss"}">${escapeHtml(trade.result || `${Number(trade.r || 0).toFixed(2)}R`)}</div>
      </div>
      <p class="body-copy">${escapeHtml(trade.context || "")}</p>
      <div class="badge-row" style="margin-top: 12px">${(trade.tags || []).map(tag => badge(tag)).join("")}</div>
      <div class="price-grid">
        <div>入场<strong>${escapeHtml(trade.entry || "-")}</strong></div>
        <div>止损<strong>${escapeHtml(trade.stop || "-")}</strong></div>
        <div>出场<strong>${escapeHtml(trade.exit || "-")}</strong></div>
        <div>R倍数<strong>${escapeHtml(trade.r ?? "-")}</strong></div>
        <div>实际盈亏<strong>${escapeHtml(getTradePnl(trade) || "-")}</strong></div>
        <div>平仓<strong>${escapeHtml(formatDateTime(trade.closeTime) || "-")}</strong></div>
      </div>
      ${trade.note ? `<p class="trade-note">${escapeHtml(trade.note)}</p>` : ""}
      <div class="record-actions">
        <button class="secondary-action edit-trade" type="button" data-id="${trade.id}">修改</button>
        <button class="secondary-action danger-action delete-trade" type="button" data-id="${trade.id}">删除</button>
      </div>
    </article>
  `;
}

function newTrade() {
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const editingTrade = getEditingTrade();
  const tradeTime = editingTrade ? normalizeDateTimeInput(editingTrade.tradeTime || editingTrade.session) : localNow;
  const closeTime = editingTrade ? normalizeDateTimeInput(editingTrade.closeTime) : localNow;
  const contextText = editingTrade ? stripContextType(editingTrade.context, editingTrade.contextType) : "";
  const pnlAmount = editingTrade ? getTradePnl(editingTrade) : "";
  const note = editingTrade ? (editingTrade.note || editingTrade.mistake || editingTrade.lesson || "") : "";
  return `
    <section class="page">
      ${pageHead(editingTrade ? "修改交易" : "快速记录", editingTrade ? "调整入场与出场数据" : "只记录交易中最重要的信息")}
      <form id="trade-form" class="card form-card">
        ${accountSelector()}
        <div class="grid-2 compact-choice-grid">
          ${segmented("品种", "market", ["MES", "MNQ"], state.market)}
          ${segmented("方向", "direction", ["Long", "Short"], state.direction, { Long: "做多", Short: "做空" })}
        </div>
        ${field("交易时间", "tradeTime", "datetime-local", tradeTime, "", icons.clock)}
        ${segmented("市场背景", "contextType", ["窄通道", "宽通道", "突破", "震荡区间"], state.contextType)}
        ${field("位置与背景", "context", "text", contextText, "如 前高、区间边界、EMA、磁铁位")}
        ${field("Setup / 入场信号", "setup", "text", editingTrade ? editingTrade.setup : "", "如 H2、突破回调、楔形反转", icons.target)}
        ${field("信号K", "signalCandle", "text", editingTrade ? editingTrade.signalCandle : "", "如 强反转棒、吞没K；没有可留空")}
        <div class="grid-3">
          ${miniField("入场价", "entry", "价格", "", editingTrade ? editingTrade.entry : "")}
          ${miniField("止损价", "stop", "价格", "", editingTrade ? editingTrade.stop : "")}
          ${miniField("出场价", "exit", "价格", "", editingTrade ? editingTrade.exit : "")}
        </div>
        <div class="grid-2">
          ${miniField("R倍数", "r", "自动计算", "readonly", editingTrade ? editingTrade.r : "")}
          ${miniField("实际盈亏", "pnlAmount", "如 +250 / -100", "", pnlAmount)}
        </div>
        ${field("平仓时间", "closeTime", "datetime-local", closeTime, "", icons.clock)}
        ${field("简短备注", "note", "textarea", note, "为什么进场、为什么出场，或需要改进的一点")}
        <button class="primary" type="submit">${editingTrade ? "保存修改" : "保存交易"}</button>
        ${editingTrade ? `<button id="cancel-edit" class="secondary-action" type="button">取消修改</button>` : ""}
      </form>
    </section>
  `;
}

function segmented(label, name, options, active, custom = {}) {
  return `
    <div class="field">
      <label>${label}</label>
      <div class="segmented" data-segmented="${name}" style="grid-template-columns: repeat(${options.length}, minmax(0, 1fr))">
        ${options.map(option => `<button type="button" class="segment ${active === option ? "active" : ""}" data-value="${option}">${custom[option] || option}</button>`).join("")}
      </div>
    </div>
  `;
}

function accountSelector() {
  const baseAccounts = ["LUCID 50K", "LUCID 100K"];
  const accounts = [...baseAccounts, ...state.customAccounts.filter(account => !baseAccounts.includes(account)), "其他"];
  return `
    ${segmented("账户类型", "account", accounts, state.account)}
    ${state.account === "其他" ? `
      <div class="field">
        <label>新增账户</label>
        <div class="inline-add">
          <input id="new-account-name" placeholder="输入账户名称，如 LUCID 150K" />
          <button id="add-account-button" type="button">新增</button>
        </div>
      </div>
    ` : ""}
  `;
}

function field(label, name, type, value = "", placeholder = "", icon = "") {
  const control = type === "textarea"
    ? `<textarea name="${name}" placeholder="${placeholder}">${escapeHtml(value)}</textarea>`
    : `<input name="${name}" type="${type}" value="${escapeHtml(value)}" placeholder="${placeholder}" />`;
  return `
    <div class="field">
      <label>${label}</label>
      <div class="field-shell">${icon || ""}${control}</div>
    </div>
  `;
}

function miniField(label, name, placeholder = "价格", extra = "", value = "") {
  return `
    <div class="mini-input">
      <label class="mini-label">${label}</label>
      <input name="${name}" placeholder="${placeholder}" value="${escapeHtml(value || "")}" ${extra} />
    </div>
  `;
}

function review() {
  const query = state.query.trim().toLowerCase();
  const filtered = state.trades.filter(trade => {
    const haystack = [trade.account, trade.setup, trade.contextType, trade.signalCandle, trade.note, trade.context].join(" ").toLowerCase();
    return !query || haystack.includes(query);
  });
  return `
    <section class="page">
      ${pageHead("复盘中心", "按价格行为结构复盘每笔交易")}
      <div class="search-row">
        <div class="field-shell">${icons.search}<input id="review-search" value="${escapeHtml(state.query)}" placeholder="搜索 setup / 错误 / 标签" /></div>
        <button class="filter-button" type="button" title="筛选">${icons.filter}</button>
      </div>
      ${filtered.length ? filtered.map(reviewCard).join("") : `<article class="card empty">没有匹配的交易记录。</article>`}
    </section>
  `;
}

function reviewCard(trade) {
  return `
    <article class="card">
      <div class="review-head">
        <h3 class="trade-title" style="margin-top: 0">${escapeHtml(trade.account ? `${trade.account} · ` : "")}${escapeHtml(trade.market)} · ${escapeHtml(trade.setup)}</h3>
        ${badge(trade.result || `${Number(trade.r || 0).toFixed(2)}R`, Number(trade.r) > 0 ? "green" : "red")}
      </div>
      <div class="body-copy">
        <p><strong>背景：</strong>${escapeHtml(trade.context || "-")}</p>
        <p><strong>信号K：</strong>${escapeHtml(trade.signalCandle || "-")}</p>
        <p><strong>入场 / 止损 / 出场：</strong>${escapeHtml(trade.entry || "-")} / ${escapeHtml(trade.stop || "-")} / ${escapeHtml(trade.exit || "-")}</p>
        <p><strong>结果：</strong>${escapeHtml(trade.r ?? "-")}R · ${escapeHtml(getTradePnl(trade) || "-")} · ${escapeHtml(formatDateTime(trade.closeTime) || "-")}</p>
        ${trade.note ? `<p><strong>备注：</strong>${escapeHtml(trade.note)}</p>` : ""}
      </div>
      <div class="record-actions">
        <button class="secondary-action edit-trade" type="button" data-id="${trade.id}">修改</button>
        <button class="secondary-action danger-action delete-trade" type="button" data-id="${trade.id}">删除</button>
      </div>
    </article>
  `;
}

function stats() {
  const rows = setupStats();
  const best = rows[0] || { setup: "-", totalR: 0 };
  return `
    <section class="page">
      ${pageHead("统计分析", "按 Setup、时段、错误类型找优势")}
      <div class="grid-2">
        ${statCard(icons.target, "最佳Setup", best.setup.split(" ")[0] || "-", `累计 ${best.totalR.toFixed(2)}R`)}
        ${statCard(icons.clock, "最佳时段", bestSession(), "按累计R排序")}
      </div>
      <article class="card">
        <h2 class="section-title">Setup 表现</h2>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>Setup</th><th>次数</th><th>胜率</th><th>R</th></tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  <td><strong>${escapeHtml(row.setup)}</strong></td>
                  <td>${row.count}</td>
                  <td>${row.winRate}%</td>
                  <td class="${row.totalR >= 0 ? "ok" : "result loss"}"><strong>${row.totalR >= 0 ? "+" : ""}${row.totalR.toFixed(2)}R</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function setupStats() {
  const grouped = new Map();
  state.trades.forEach(trade => {
    const key = trade.setup || "未分类";
    const row = grouped.get(key) || { setup: key, count: 0, wins: 0, totalR: 0 };
    row.count += 1;
    row.wins += Number(trade.r) > 0 ? 1 : 0;
    row.totalR += Number(trade.r || 0);
    grouped.set(key, row);
  });
  return [...grouped.values()]
    .map(row => ({ ...row, winRate: Math.round((row.wins / row.count) * 100) }))
    .sort((a, b) => b.totalR - a.totalR);
}

function bestSession() {
  const grouped = new Map();
  state.trades.forEach(trade => {
    const key = trade.session || "未记录";
    grouped.set(key, (grouped.get(key) || 0) + Number(trade.r || 0));
  });
  const best = [...grouped.entries()].sort((a, b) => b[1] - a[1])[0];
  return best ? best[0].split(" ")[0] : "-";
}

function backupPanel() {
  return `
    <article class="card">
      <div class="card-title">
        <h2>备份与恢复</h2>
        ${badge("iCloud", "blue")}
      </div>
      <p class="body-copy" style="margin-top: 0">定期导出完整备份到 iCloud。换手机、换浏览器或更新页面后，可用备份恢复记录。</p>
      <div class="backup-actions">
        <button id="export-backup" class="secondary-action" type="button">导出备份</button>
        <button id="export-csv" class="secondary-action" type="button">导出CSV</button>
        <label class="secondary-action file-action">选择文件<input id="import-backup" type="file" accept=".json,application/json" /></label>
      </div>
      <details class="paste-import">
        <summary>iCloud 选不了文件时，点这里粘贴导入</summary>
        <textarea id="backup-json-text" placeholder="把备份 JSON 文件内容粘贴到这里"></textarea>
        <button id="import-backup-text" class="primary" type="button">导入粘贴内容</button>
      </details>
    </article>
  `;
}

function me() {
  const accountCount = 2 + state.customAccounts.length;
  return `
    <section class="page">
      ${pageHead("我的", "账户、备份、策略库和应用设置")}
      <div class="grid-2">
        ${statCard(icons.list, "交易记录", state.trades.length, "当前本机记录")}
        ${statCard(icons.book, "账户数量", accountCount, "含自定义账户")}
      </div>
      <article class="card">
        <div class="card-title">
          <h2>策略库</h2>
          ${badge(`${setupLibrary.length} 个`, "purple")}
        </div>
        <p class="body-copy" style="margin-top: 0">查看价格行为策略、确认条件和入场检查清单。</p>
        <button id="open-playbook" class="primary" type="button">进入策略库</button>
      </article>
      ${backupPanel()}
    </section>
  `;
}

function playbook() {
  return `
    <section class="page">
      <button id="back-to-me" class="back-button" type="button">返回我的</button>
      ${pageHead("策略库", `${setupLibrary.length} 个核心模型 · 背景比信号更重要`)}
      <article class="card playbook-guide">
        <h2 class="section-title">使用原则</h2>
        <p class="body-copy">每次只专练一种模型。只有市场背景、信号棒和入场条件同时成立时才执行；辅助工具不单独作为入场依据。</p>
      </article>
      ${setupLibrary.map(setup => `
        <article class="card">
          <div class="setup-head">
            <h3 class="trade-title" style="margin-top: 0">${setup.name}</h3>
            <div class="badge-row" style="justify-content: flex-end">
              ${badge(setup.category || "价格行为", "blue")}
              ${badge(setup.quality, setup.quality === "核心策略" ? "green" : "purple")}
            </div>
          </div>
          <dl class="setup-details">
            ${setupDetail("视觉特征 / 信号棒", setup.signal)}
            ${setupDetail("入场点", setup.entry)}
            ${setupDetail("初始止损", setup.stop)}
            ${setupDetail("获利目标 / 磁铁位", setup.target)}
            ${setupDetail("核心逻辑与备注", setup.note)}
          </dl>
        </article>
      `).join("")}
    </section>
  `;
}

function setupDetail(label, value) {
  return `
    <div>
      <dt>${label}</dt>
      <dd>${value}</dd>
    </div>
  `;
}

function renderTabs() {
  document.getElementById("tabs").innerHTML = tabs.map(tab => `
    <button class="tab ${state.tab === tab.id || (tab.id === "me" && state.tab === "playbook") ? "active" : ""}" data-tab="${tab.id}" type="button">
      ${tab.icon}
      ${tab.label}
    </button>
  `).join("");
}

function render() {
  const view = document.getElementById("view");
  const pages = { dashboard, new: newTrade, review, stats, me, playbook };
  view.innerHTML = pages[state.tab]();
  renderTabs();
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll("[data-tab]").forEach(button => {
    button.addEventListener("click", () => {
      state.tab = button.dataset.tab;
      render();
    });
  });

  document.querySelectorAll("[data-segmented]").forEach(group => {
    group.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        const name = group.dataset.segmented;
        state[name] = button.dataset.value;
        render();
      });
    });
  });

  const addAccountButton = document.getElementById("add-account-button");
  if (addAccountButton) {
    addAccountButton.addEventListener("click", () => {
      const input = document.getElementById("new-account-name");
      const accountName = input.value.trim();
      if (!accountName) return;
      if (!state.customAccounts.includes(accountName) && !["LUCID 50K", "LUCID 100K"].includes(accountName)) {
        state.customAccounts.push(accountName);
        saveCustomAccounts();
      }
      state.account = accountName;
      render();
    });
  }

  const exportBackupButton = document.getElementById("export-backup");
  if (exportBackupButton) {
    exportBackupButton.addEventListener("click", exportBackup);
  }

  const exportCsvButton = document.getElementById("export-csv");
  if (exportCsvButton) {
    exportCsvButton.addEventListener("click", exportCsv);
  }

  const importBackupInput = document.getElementById("import-backup");
  if (importBackupInput) {
    importBackupInput.addEventListener("change", importBackup);
  }

  const importBackupTextButton = document.getElementById("import-backup-text");
  if (importBackupTextButton) {
    importBackupTextButton.addEventListener("click", importBackupText);
  }

  const openPlaybookButton = document.getElementById("open-playbook");
  if (openPlaybookButton) {
    openPlaybookButton.addEventListener("click", () => {
      state.tab = "playbook";
      render();
    });
  }

  const backToMeButton = document.getElementById("back-to-me");
  if (backToMeButton) {
    backToMeButton.addEventListener("click", () => {
      state.tab = "me";
      render();
    });
  }

  document.querySelectorAll(".edit-trade").forEach(button => {
    button.addEventListener("click", () => startEditTrade(button.dataset.id));
  });

  document.querySelectorAll(".delete-trade").forEach(button => {
    button.addEventListener("click", () => deleteTrade(button.dataset.id));
  });

  const cancelEditButton = document.getElementById("cancel-edit");
  if (cancelEditButton) {
    cancelEditButton.addEventListener("click", () => {
      state.editingId = null;
      state.tab = "dashboard";
      render();
    });
  }

  const search = document.getElementById("review-search");
  if (search) {
    search.addEventListener("input", event => {
      state.query = event.target.value;
      render();
      const nextSearch = document.getElementById("review-search");
      nextSearch.focus();
      nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
    });
  }

  const form = document.getElementById("trade-form");
  if (form) {
    const updateR = () => {
      const entry = Number(form.elements.entry.value);
      const stop = Number(form.elements.stop.value);
      const exit = Number(form.elements.exit.value);
      const risk = state.direction === "Long" ? entry - stop : stop - entry;
      const reward = state.direction === "Long" ? exit - entry : entry - exit;
      const rInput = form.elements.r;
      if (!entry || !stop || !exit || risk <= 0) {
        rInput.value = "";
        return;
      }
      const r = reward / risk;
      rInput.value = Number.isFinite(r) ? r.toFixed(2) : "";
    };
    ["entry", "stop", "exit"].forEach(name => {
      form.elements[name].addEventListener("input", updateR);
    });
    updateR();

    form.addEventListener("submit", event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const r = Number(data.r || 0);
      const tradeDate = data.tradeTime ? data.tradeTime.slice(0, 10) : "";
      const editingTrade = getEditingTrade();
      const trade = {
        ...(editingTrade || {}),
        id: editingTrade ? editingTrade.id : Date.now(),
        date: tradeDate,
        tradeTime: data.tradeTime,
        closeTime: data.closeTime,
        account: state.account,
        market: state.market,
        session: data.tradeTime ? data.tradeTime.replace("T", " ") : "",
        direction: state.direction,
        setup: data.setup || "未命名 Setup",
        contextType: state.contextType,
        context: `${state.contextType || ""}${data.context ? `：${data.context}` : ""}`,
        signalCandle: data.signalCandle,
        entry: data.entry,
        stop: data.stop,
        exit: data.exit,
        pnlAmount: data.pnlAmount,
        contracts: 1,
        r,
        result: `${r > 0 ? "+" : ""}${r.toFixed(2)}R`,
        note: data.note || ""
      };
      state.trades = editingTrade
        ? state.trades.map(item => String(item.id) === String(editingTrade.id) ? trade : item)
        : [trade, ...state.trades];
      saveTrades();
      state.editingId = null;
      state.tab = "dashboard";
      render();
    });
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDateTime(value) {
  if (!value) return "";
  return String(value).replace("T", " ");
}

function getTradePnl(trade) {
  if (trade.pnlAmount !== undefined && trade.pnlAmount !== null && trade.pnlAmount !== "") {
    return trade.pnlAmount;
  }
  if (trade.profitAmount) return String(trade.profitAmount).startsWith("+") ? trade.profitAmount : `+${trade.profitAmount}`;
  if (trade.lossAmount) return String(trade.lossAmount).startsWith("-") ? trade.lossAmount : `-${trade.lossAmount}`;
  return "";
}

function normalizeDateTimeInput(value) {
  if (!value) return "";
  return String(value).replace(" ", "T").slice(0, 16);
}

function stripContextType(context, contextType) {
  if (!context) return "";
  const prefix = `${contextType || ""}：`;
  return String(context).startsWith(prefix) ? String(context).slice(prefix.length) : String(context);
}

render();

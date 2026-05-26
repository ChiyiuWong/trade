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
    name: "流动性扫盘 + 结构突破 / Liquidity Sweep + Break of Structure (LS+BOS)",
    category: "流动性反转",
    quality: "高优先级",
    rule: "扫前高/前低后快速收回，随后形成结构突破，等待回踩或FVG再入场。",
    checklist: ["明确前高/前低", "扫流动性后收回", "出现BOS/CHOCH", "RR >= 1.5", "不在重大新闻前入场"]
  },
  {
    name: "趋势回调 / Trend Pullback (TPB)",
    category: "趋势延续",
    quality: "高优先级",
    rule: "顺大级别趋势，等待回踩关键位、均衡区或订单块后出现小级别确认。",
    checklist: ["高低点结构清晰", "回踩到关键区域", "小级别反转确认", "止损在结构外", "目标至少到前高/前低"]
  },
  {
    name: "区间边界拒绝 / Range Rejection (RRJ)",
    category: "区间交易",
    quality: "中优先级",
    rule: "震荡区间上沿做空、下沿做多，必须看到拒绝和收盘确认。",
    checklist: ["区间边界清楚", "出现假突破/拒绝", "确认K线收盘", "避免中间位置入场", "目标先看区间中轴"]
  },
  {
    name: "突破回踩 / Breakout Retest (BRT)",
    category: "突破延续",
    quality: "高优先级",
    rule: "价格有效突破关键高低点、区间边界或日内开盘区间后，不追第一根突破，等待回踩突破位并守住再入场。",
    checklist: ["突破位来自明显结构", "突破K线实体有效", "回踩不重新跌回区间", "回踩出现拒绝/小级别BOS", "止损放在回踩结构外"]
  },
  {
    name: "假突破反转 / Failed Breakout (FB)",
    category: "假突破反转",
    quality: "高优先级",
    rule: "价格突破关键位后无法延续，快速收回原区间，顺着失败方向入场，目标先看区间中轴或另一侧流动性。",
    checklist: ["突破位置明显", "突破后成交/动能没有跟进", "重新收回关键位内", "反向出现强实体或BOS", "避免在区间中间追单"]
  },
  {
    name: "开盘区间突破 / Opening Range Breakout (ORB)",
    category: "时段策略",
    quality: "中优先级",
    rule: "用开盘前15-30分钟高低点作为日内初始区间，等待有效突破并回踩确认，适合NY开盘波动。",
    checklist: ["定义开盘区间高低点", "避开第一分钟噪音", "突破后等待回踩", "确认方向和大级别一致", "当天已有巨大波动时降低仓位"]
  },
  {
    name: "开盘驱动回调 / Opening Drive Pullback (ODP)",
    category: "时段策略",
    quality: "高优先级",
    rule: "开盘后出现单边驱动行情，第一次健康回踩到VWAP、前结构位或FVG时，顺势寻找延续机会。",
    checklist: ["开盘方向明确且动能强", "不是新闻瞬间乱扫", "第一次回踩优先", "回踩量能/波动收缩", "目标看前高/前低或当日极值"]
  },
  {
    name: "前日高低点扫盘 / Previous Day High/Low Sweep (PDH/PDL Sweep)",
    category: "关键流动性",
    quality: "高优先级",
    rule: "价格扫掉前一日高点或低点后，如果无法继续推进并快速收回，寻找反向交易，常用于NY开盘前后。",
    checklist: ["标记PDH/PDL", "扫位后出现明显拒绝", "收回关键位内", "小周期结构转向", "目标先看日内均衡区/VWAP"]
  },
  {
    name: "时段高低点扫盘 / Session High/Low Sweep (SH/SL Sweep)",
    category: "关键流动性",
    quality: "高优先级",
    rule: "扫亚洲盘、伦敦盘或NY早盘高低点后，若价格回到原区间，寻找反向回归机会。",
    checklist: ["明确时段高低点", "扫位发生在高流动性时段", "扫后没有继续单边", "收回并形成确认", "目标看时段中轴或另一侧边界"]
  },
  {
    name: "等高/等低流动性猎取 / Equal Highs/Lows Raid (EQH/EQL Raid)",
    category: "关键流动性",
    quality: "中优先级",
    rule: "相等高点/低点上方常聚集止损，价格扫掉后如果不能接受新价格，等待反向确认。",
    checklist: ["至少两次触碰形成等高/等低", "扫位幅度不过大", "扫后迅速回落/回升", "入场不抢第一下", "止损放在扫点外"]
  },
  {
    name: "公允价值缺口回补 / Fair Value Gap Fill (FVG Fill)",
    category: "不平衡/FVG",
    quality: "中优先级",
    rule: "强动能留下FVG后，等待价格回补到不平衡区域并出现顺势拒绝，再参与原方向延续。",
    checklist: ["FVG来自强实体推进", "大级别方向支持", "回补到50%-100%区域", "低周期出现拒绝", "FVG被完全穿透则放弃"]
  },
  {
    name: "公允价值缺口反转 / Fair Value Gap Inversion (IFVG)",
    category: "不平衡/FVG",
    quality: "中优先级",
    rule: "原本看涨/看跌FVG被有效反向穿越后，等待回踩该区域，把它当作反向压力/支撑使用。",
    checklist: ["原FVG被实体突破", "突破后结构发生改变", "回踩FVG区域", "回踩被拒绝", "止损放在失效区域外"]
  },
  {
    name: "订单块回测 / Order Block Retest (OB Retest)",
    category: "订单块/供需",
    quality: "中优先级",
    rule: "强烈离开前的最后一段反向K线区域可作为订单块，价格回测时若出现确认，顺原离开方向交易。",
    checklist: ["订单块导致明显位移", "最好伴随BOS", "回测前未被多次消耗", "入场有小周期确认", "不要把每根反向K都当订单块"]
  },
  {
    name: "破坏块 / Breaker Block (BB)",
    category: "订单块/供需",
    quality: "中优先级",
    rule: "失败的订单块被价格击穿后，常会在回踩时转化为反向支撑/压力，适合结构反转后使用。",
    checklist: ["先有明确订单块", "该区域被实体击穿", "结构方向已改变", "回踩区域出现拒绝", "避免在大级别强支撑前追空"]
  },
  {
    name: "缓解块 / Mitigation Block (MB)",
    category: "订单块/供需",
    quality: "中优先级",
    rule: "价格回到尚未被缓解的机构参与区域后，若仍维持原结构方向，可寻找继续推动行情。",
    checklist: ["区域未被充分回测", "回测前趋势仍有效", "有明确失效点", "出现反应后再进", "同一区域反复测试则降级"]
  },
  {
    name: "支撑阻力转换 / Support Resistance Flip (S/R Flip)",
    category: "结构转换",
    quality: "高优先级",
    rule: "原阻力被突破后转为支撑，原支撑被跌破后转为压力，等待回踩确认而不是追突破。",
    checklist: ["水平位被多次尊重", "突破实体清楚", "回踩守住该位", "低周期出现顺势信号", "假突破收回则放弃"]
  },
  {
    name: "市场结构转移 / Market Structure Shift (MSS)",
    category: "结构反转",
    quality: "高优先级",
    rule: "在关键流动性或高低位附近，价格打破最近一段反向结构，说明短线控制权切换，可等待回踩入场。",
    checklist: ["发生在关键位置", "先有扫流动性或明显拒绝", "突破最近结构点", "回踩不破新结构", "不要在无位置优势处硬做MSS"]
  },
  {
    name: "性质改变反转 / Change of Character Reversal (CHOCH)",
    category: "结构反转",
    quality: "中优先级",
    rule: "趋势末端首次改变高低点排列，视为潜在反转预警，需等待二次确认或回踩再入场。",
    checklist: ["原趋势已接近关键目标", "出现动能衰竭", "首次打破内部结构", "等待回踩确认", "没有二次确认则小仓或放弃"]
  },
  {
    name: "结构突破延续 / Break of Structure Continuation (BOS-C)",
    category: "趋势延续",
    quality: "高优先级",
    rule: "趋势中价格持续打破同方向结构，回踩前结构点、FVG或订单块时寻找延续。",
    checklist: ["高高低高或低低高低清晰", "BOS实体有效", "回踩幅度健康", "没有扫反向大级别流动性", "目标看下一结构点"]
  },
  {
    name: "更高低点/更低高点延续 / Higher Low / Lower High Continuation (HL/LH)",
    category: "趋势延续",
    quality: "高优先级",
    rule: "上升趋势做更高低点，下降趋势做更低高点，等待低周期拒绝后顺势进入。",
    checklist: ["大级别趋势明确", "回踩未破趋势关键低/高", "出现吞没/针脚/小BOS", "止损在HL/LH外", "不要在第三第四次追末端"]
  },
  {
    name: "趋势线突破回踩 / Trendline Break Retest (TLB)",
    category: "趋势线",
    quality: "中优先级",
    rule: "趋势线被有效突破后，等待回踩趋势线或最近结构，确认后做反向或趋势加速段。",
    checklist: ["趋势线至少连接两到三点", "突破有实体和动能", "回踩不重新回到趋势线内", "结合水平位更可靠", "单独趋势线不作为唯一理由"]
  },
  {
    name: "通道边界拒绝 / Channel Boundary Rejection (CBR)",
    category: "通道/区间",
    quality: "中优先级",
    rule: "在上升/下降通道边界出现拒绝时，顺通道方向或做边界回归，目标先看中线。",
    checklist: ["通道边界清楚", "至少两次有效反应", "触边后出现拒绝K", "中线/另一边界有空间", "突破通道后停止反向"]
  },
  {
    name: "区间极值回归均值 / Range Extremes to Mean (REM)",
    category: "区间交易",
    quality: "中优先级",
    rule: "震荡行情只在区间上沿/下沿交易，入场后第一目标放在区间中轴，不在中间位置开仓。",
    checklist: ["区间至少两次上沿两次下沿", "ADX/波动显示无趋势", "只在边界交易", "确认拒绝后入场", "中轴减仓或保护利润"]
  },
  {
    name: "压缩后区间扩张 / Range Expansion After Compression (REC)",
    category: "突破延续",
    quality: "中优先级",
    rule: "长时间窄幅压缩后，等待价格带量突破压缩区间并回踩确认，参与波动扩张。",
    checklist: ["压缩时间足够长", "高低点逐渐收窄", "突破方向有实体", "回踩不回压缩区", "假突破时快速止损"]
  },
  {
    name: "内包K突破 / Inside Bar Breakout (IBB)",
    category: "K线结构",
    quality: "中优先级",
    rule: "母K线后出现内包K，代表短暂压缩；顺大级别方向突破内包结构时入场，失效在母K另一侧。",
    checklist: ["母K线范围清晰", "内包K完全在母K内", "方向顺趋势或关键位", "突破后不立刻收回", "避免在无波动时段使用"]
  },
  {
    name: "外包K/吞没K / Outside Bar / Engulfing (OBE)",
    category: "K线结构",
    quality: "中优先级",
    rule: "吞没K线代表短线控制权变化，最好出现在关键位、扫流动性后或回踩确认处。",
    checklist: ["出现在关键位置", "实体吞没更优于影线吞没", "后续不被立刻反吞", "配合结构方向", "止损放在吞没K极值外"]
  },
  {
    name: "针形K拒绝 / Pin Bar Rejection (PBR)",
    category: "K线结构",
    quality: "低优先级",
    rule: "长影线显示某价位被拒绝，但必须结合结构位置使用，不单独因为影线入场。",
    checklist: ["出现在支撑/压力/流动性位", "影线扫位后收回", "实体收盘方向明确", "下一根K不否定信号", "不要在趋势中间逆势做"]
  },
  {
    name: "两段式回调 / Two-Legged Pullback (2LP)",
    category: "趋势延续",
    quality: "中优先级",
    rule: "强趋势中价格通常以两段回调修正，第二段衰竭并出现确认后，顺原趋势进入。",
    checklist: ["原趋势强", "回调分成两段", "第二段动能减弱", "关键位出现拒绝", "目标看趋势延续高/低"]
  },
  {
    name: "等距测量目标 / Measured Move (MM)",
    category: "目标管理",
    quality: "中优先级",
    rule: "突破区间或旗形后，用前一段推动幅度投射目标，作为止盈参考而非盲目追单理由。",
    checklist: ["已有清楚第一推动段", "中间出现整理", "突破整理后延续", "投射目标前有足够空间", "接近目标时主动保护利润"]
  },
  {
    name: "缺口回补 / Gap Fill (GF)",
    category: "缺口/回补",
    quality: "中优先级",
    rule: "指数期货开盘出现明显跳空时，若开盘无法延续缺口方向，寻找回补缺口的交易机会。",
    checklist: ["确认真实跳空区域", "开盘未继续缺口方向", "价格重新进入缺口", "目标分段看50%和完全回补", "强趋势日不硬做回补"]
  },
  {
    name: "VWAP收复/拒绝 / VWAP Reclaim / Reject (VWAP R/R)",
    category: "日内均衡",
    quality: "中优先级",
    rule: "价格重新站上VWAP并回踩守住可做多，跌破VWAP并回踩受压可做空，适合日内方向过滤。",
    checklist: ["VWAP和结构方向一致", "不是来回穿越的震荡日", "回踩VWAP有反应", "配合高低点结构", "目标看日内高低或标准差带"]
  },
  {
    name: "新闻尖刺反向回归 / News Spike Fade (NSF)",
    category: "事件波动",
    quality: "低优先级",
    rule: "重大数据发布后第一波急拉/急跌如果迅速失败并回到数据前区间，可小仓寻找反向回归。",
    checklist: ["只在数据后等待稳定", "不接第一根剧烈波动", "确认回到发布前区间", "仓位降低", "滑点不可控时不做"]
  },
  {
    name: "震荡不交易过滤 / No-Trade Chop Filter (NTC)",
    category: "风险过滤",
    quality: "过滤规则",
    rule: "当价格在VWAP/区间中轴附近反复穿越、K线重叠严重、没有清楚高低点时，主动不交易。",
    checklist: ["连续重叠K线", "无清晰结构", "突破都没有延续", "手续费和情绪成本上升", "等待价格到区间边界或重新出现趋势"]
  },
  {
    name: "大级别冲突过滤 / Higher Time Frame Conflict Filter (HTF Filter)",
    category: "风险过滤",
    quality: "过滤规则",
    rule: "当大级别方向、日内结构和入场周期互相冲突时，降低仓位或放弃，优先等待方向重新统一。",
    checklist: ["日线/4H/1H方向冲突", "关键位太近", "入场周期信号逆大级别", "目标空间不足", "没有位置优势则不做"]
  },
  {
    name: "流动性真空延续 / Liquidity Void Continuation (LVC)",
    category: "动能延续",
    quality: "中优先级",
    rule: "价格快速穿越低成交/低阻力区域后，若回踩浅且不填满空档，通常有继续推进到下一流动性池的倾向。",
    checklist: ["位移速度快", "中间回撤少", "前方有明显目标", "回踩浅且被买/卖回", "接近目标不再追"]
  },
  {
    name: "扫损后延续 / Stop Run Continuation (SRC)",
    category: "动能延续",
    quality: "中优先级",
    rule: "价格扫掉一侧流动性后并不反转，而是继续接受新价格，说明突破可能有效，等待回踩顺突破方向入场。",
    checklist: ["扫位后没有快速收回", "关键位外持续收盘", "回踩守住扫位区域", "成交/动能延续", "不要把所有扫位都当反转"]
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
  { id: "me", label: "我的", icon: icons.book }
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
    "大级别背景",
    "Setup",
    "入场信号K",
    "信号K说明",
    "入场",
    "止损",
    "出场",
    "R倍数",
    "止盈金额",
    "止损金额",
    "等级",
    "情绪",
    "错误",
    "教训",
    "标签"
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
    trade.entrySignal,
    trade.signalCandle,
    trade.entry,
    trade.stop,
    trade.exit,
    trade.r,
    trade.profitAmount,
    trade.lossAmount,
    trade.grade,
    trade.emotion,
    trade.mistake,
    trade.lesson,
    (trade.tags || []).join("|")
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
            ${badge(`Grade ${trade.grade || "-"}`, "purple")}
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
        <div>平仓<strong>${escapeHtml(formatDateTime(trade.closeTime) || "-")}</strong></div>
        <div>止盈金额<strong>${escapeHtml(trade.profitAmount || "-")}</strong></div>
        <div>止损金额<strong>${escapeHtml(trade.lossAmount || "-")}</strong></div>
      </div>
      <div class="record-actions">
        <button class="secondary-action edit-trade" type="button" data-id="${trade.id}">修改</button>
        <button class="secondary-action danger-action delete-trade" type="button" data-id="${trade.id}">删除</button>
      </div>
    </article>
  `;
}

function newTrade() {
  const checklist = ["是否先判断大级别结构？", "是否标记前高/前低流动性？", "是否有BOS/CHOCH或拒绝确认？", "RR是否 >= 1.5？", "是否避开重大新闻窗口？"];
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const editingTrade = getEditingTrade();
  const tradeTime = editingTrade ? normalizeDateTimeInput(editingTrade.tradeTime || editingTrade.session) : localNow;
  const closeTime = editingTrade ? normalizeDateTimeInput(editingTrade.closeTime) : localNow;
  const contextText = editingTrade ? stripContextType(editingTrade.context, editingTrade.contextType) : "";
  return `
    <section class="page">
      ${pageHead(editingTrade ? "修改交易" : "新增交易", editingTrade ? "调整已保存的交易记录" : "记录交易前计划、执行和盘后复盘")}
      <form id="trade-form" class="card form-card">
        ${accountSelector()}
        ${segmented("品种", "market", ["MES", "MNQ"], state.market)}
        ${segmented("方向", "direction", ["Long", "Short"], state.direction, { Long: `${icons.up} 做多`, Short: `${icons.down} 做空` })}
        ${field("交易时间", "tradeTime", "datetime-local", tradeTime, "", icons.clock)}
        ${segmented("大级别背景", "contextType", ["窄通道", "宽通道", "突破", "震荡区间"], state.contextType)}
        ${field("关键位 / 流动性位置", "context", "textarea", contextText, "如 前高/前低、PDH/PDL、订单块、FVG、区间边界")}
        ${field("价格行为 Setup", "setup", "text", editingTrade ? editingTrade.setup : "", "如 流动性扫盘 + BOS / FVG回补", icons.target)}
        ${segmented("是否有入场信号K", "entrySignal", ["有入场信号K", "无入场信号K", "不确定"], state.entrySignal)}
        ${field("入场信号K说明", "signalCandle", "text", editingTrade ? editingTrade.signalCandle : "", "如 吞没K、针形K、拒绝K、收盘确认")}
        <div class="grid-3">
          ${miniField("入场", "entry", "价格", "", editingTrade ? editingTrade.entry : "")}
          ${miniField("止损", "stop", "价格", "", editingTrade ? editingTrade.stop : "")}
          ${miniField("出场", "exit", "价格", "", editingTrade ? editingTrade.exit : "")}
        </div>
        <div class="grid-3">
          ${miniField("R倍数", "r", "自动计算", "readonly", editingTrade ? editingTrade.r : "")}
          ${miniField("等级", "grade", "A", "", editingTrade ? editingTrade.grade : "")}
          ${miniField("情绪", "emotion", "冷静", "", editingTrade ? editingTrade.emotion : "")}
        </div>
        ${field("平仓时间", "closeTime", "datetime-local", closeTime, "", icons.clock)}
        <div class="grid-2">
          ${miniField("止盈金额", "profitAmount", "金额", "", editingTrade ? editingTrade.profitAmount : "")}
          ${miniField("止损金额", "lossAmount", "金额", "", editingTrade ? editingTrade.lossAmount : "")}
        </div>
        ${field("错误记录", "mistake", "textarea", editingTrade ? editingTrade.mistake : "", "没有错误也可以写：无明显错误")}
        ${field("盘后教训", "lesson", "textarea", editingTrade ? editingTrade.lesson : "", "下次要重复或避免什么")}
        ${field("标签", "tags", "text", editingTrade ? (editingTrade.tags || []).join(",") : "", "用逗号分隔，如 BOS,FVG,顺势", icons.list)}
        ${field("截图/标注", "screenshot", "text", "", "记录截图文件名或链接", icons.camera)}
      </form>
      <article class="card">
        <h2 class="section-title">入场前检查清单</h2>
        <div class="check-list">
          ${checklist.map(item => `<label class="check-item"><input type="checkbox" />${item}</label>`).join("")}
        </div>
        <button class="primary" form="trade-form" type="submit" style="margin-top: 14px">${editingTrade ? "保存修改" : "保存交易记录"}</button>
        ${editingTrade ? `<button id="cancel-edit" class="secondary-action" type="button" style="width: 100%; margin-top: 10px">取消修改</button>` : ""}
      </article>
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
    const haystack = [trade.account, trade.setup, trade.contextType, trade.entrySignal, trade.signalCandle, trade.mistake, trade.lesson, trade.context, ...(trade.tags || [])].join(" ").toLowerCase();
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
        <p><strong>入场信号K：</strong>${escapeHtml(trade.entrySignal || "-")}${trade.signalCandle ? ` · ${escapeHtml(trade.signalCandle)}` : ""}</p>
        <p><strong>平仓：</strong>${escapeHtml(formatDateTime(trade.closeTime) || "-")} · 止盈 ${escapeHtml(trade.profitAmount || "-")} · 止损 ${escapeHtml(trade.lossAmount || "-")}</p>
        <p><strong>错误：</strong>${escapeHtml(trade.mistake || "-")}</p>
        <p><strong>教训：</strong>${escapeHtml(trade.lesson || "-")}</p>
      </div>
      <div class="score-grid">
        <div>结构<strong>A</strong></div>
        <div>入场<strong>${escapeHtml(trade.grade || "-")}</strong></div>
        <div>风控<strong>A</strong></div>
        <div>情绪<strong>${escapeHtml(trade.emotion || "-")}</strong></div>
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
      ${pageHead("策略库", `已整理 ${setupLibrary.length} 个价格行为策略 · 把理论转化为可执行规则`)}
      ${setupLibrary.map(setup => `
        <article class="card">
          <div class="setup-head">
            <h3 class="trade-title" style="margin-top: 0">${setup.name}</h3>
            <div class="badge-row" style="justify-content: flex-end">
              ${badge(setup.category || "价格行为", "blue")}
              ${badge(setup.quality, setup.quality === "高优先级" ? "green" : setup.quality === "过滤规则" ? "purple" : setup.quality === "低优先级" ? "red" : "amber")}
            </div>
          </div>
          <p class="body-copy">${setup.rule}</p>
          <ul class="setup-list">
            ${setup.checklist.map(item => `<li><span class="ok">${icons.check}</span><span>${item}</span></li>`).join("")}
          </ul>
        </article>
      `).join("")}
    </section>
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
        entrySignal: state.entrySignal,
        signalCandle: data.signalCandle,
        entry: data.entry,
        stop: data.stop,
        exit: data.exit,
        profitAmount: data.profitAmount,
        lossAmount: data.lossAmount,
        contracts: 1,
        r,
        result: `${r > 0 ? "+" : ""}${r.toFixed(2)}R`,
        grade: data.grade || "-",
        emotion: data.emotion || "-",
        tags: data.tags ? data.tags.split(/[,，]/).map(tag => tag.trim()).filter(Boolean) : [],
        mistake: data.mistake || "未记录",
        lesson: data.lesson || "未记录"
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

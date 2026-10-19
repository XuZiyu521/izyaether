/* izyAether Web · 核心（数据 / 路由 / 四大主干页）
 * 依赖：assets/cloud.js（账号同步）、assets/screens.js（二级页）
 * UI 尺寸与配色一律取自 app 源码：entry/src/main/resources/base/element/color.json
 * 与四个 page 的 fontSize / borderRadius / padding 参数
 */
const LS = {
  lang: 'izy.lang', pro: 'izy.pro', proUntil: 'izy.pro_until', first: 'izy.first_launch',
  keys: 'izy.keys', prompts: 'izy.prompts',
  trash: 'izy.trash', cats: 'izy.cats', cover: 'izy.cover', theme: 'izy.theme',
  profile: 'izy.profile', follow: 'izy.follow', alert: 'izy.alert', order: 'izy.order',
  hidden: 'izy.hidden_builtin'
};
const S = {
  lang: 'zh-CN', page: 'library', sub: '', arg: '', q: '', priceTab: 'api',
  libType: 'all', favOnly: false, cmpOn: false, cmpIds: [], open: {}, cat: '',
  manualOpen: false
};
const LANGS = [
  ['zh-CN', '简体中文'], ['zh-TW', '繁體中文'], ['en-US', 'English'],
  ['ja-JP', '日本語'], ['ko-KR', '한국어'], ['de-DE', 'Deutsch'],
  ['es-ES', 'Español'], ['fr-FR', 'Français'], ['ru-RU', 'Русский']
];

/* ══════════ 文案 ══════════ */
function t(k) {
  var args = [].slice.call(arguments, 1);
  var d = I18N[S.lang] || I18N['zh-CN'] || {};
  var s = (d[k] !== undefined ? d[k] : (WEB[S.lang] && WEB[S.lang][k]));
  if (s === undefined) s = (WEB['zh-CN'] && WEB['zh-CN'][k]) || (WEBX[S.lang] && WEBX[S.lang][k]) || (WEBX['zh-CN'] && WEBX['zh-CN'][k]) || (I18N['zh-CN'] && I18N['zh-CN'][k]) || k;
  args.forEach(function (a, i) { s = s.replace('{' + i + '}', a); });
  return s;
}
const WEB = {
  'zh-CN': { 'web.login.title': '登录', 'web.login.hint': '登录后可跨设备同步会员与自建 Prompt（API Key 不上传）', 'web.login.email': '邮箱', 'web.login.code': '验证码', 'web.login.send': '发送验证码', 'web.login.sent': '验证码已发送', 'web.login.submit': '登录', 'web.login.err': '登录失败，请检查邮箱与验证码', 'web.logout': '退出登录', 'web.sync.on': '已开启云端同步', 'web.sync.off': '未登录，数据仅保存在本机', 'web.sync.ok': '已同步', 'web.sync.fail': '同步失败', 'web.sort': '排序', 'web.copied': '已复制', 'web.proxy': '需要代理服务', 'web.needOrg': '组织 ID', 'web.cover': '封面', 'web.cover.preset': '封面 {0}', 'web.count': '{0} 项', 'web.light': '浅色', 'web.dark': '深色', 'web.system': '跟随系统', 'web.back': '返回', 'web.fav.only': '只看收藏', 'web.trash.entry': '回收站', 'web.drag.hint': '可长按卡片拖动排序', 'web.limit.prompt': '免费版最多 {0} 条自建，升级后不限', 'web.limit.cat': '免费版最多 {0} 个分类', 'web.clip.code': '检测到分享码，导入「{0}」吗？', 'web.clip.text': '剪贴板里有 {0} 字文本，新建成 Prompt 吗？', 'web.sub.trash': '回收站', 'web.sub.import': '导入', 'web.sub.cats': '分类管理', 'web.sub.detail': '详情', 'web.sub.new': '新建 Prompt', 'web.sub.edit': '编辑', 'web.sub.addkey': '添加 Key', 'web.sub.qdetail': '账户详情', 'web.sub.vguide': '接入指引', 'web.sub.calc': '成本计算器', 'web.sub.compare': '模型对比', 'web.sub.profile': '个人资料', 'web.plans': '方案对比', 'web.plans.free': '免费版', 'web.theme': '外观', 'web.avatar': '头像', 'web.avatar.app': ' App 图标', 'web.export.json': '导出 JSON', 'web.export.ok': '已导出到下载目录', 'web.compare': '对比', 'web.compare.pick': '勾选要对比的模型（最多 4 个）', 'web.compare.need2': '至少选 2 个模型', 'web.compare.exit': '退出对比', 'web.compare.start': '开始对比', 'web.follow': '关注', 'web.follow.limit': '免费版只能关注 1 个模型', 'web.savings': '省钱账本', 'web.savings.paid': '按量实付', 'web.savings.sub': '若走订阅', 'web.savings.saved': '本月省了', 'web.alert': '余额预警', 'web.alert.th': '低于 {0} 时标红', 'web.month': '本月消耗', 'web.total': '余额合计', 'web.badge.low': '{0} 个账户偏低', 'web.badge.fail': '{0} 个拉取失败', 'web.mask.key': '密钥（已隐藏）', 'web.retry': '重试', 'web.open.console': '打开控制台', 'web.restored': '已恢复', 'web.confirm.del': '确定彻底删除？不可恢复', 'web.album': '从相册选图', 'web.need.key': '请先填写 Key', 'web.need.name': '请填写标题与正文', 'web.save.ok': '已保存', 'web.import.paste': '粘贴原文', 'web.import.file': '选择文件', 'web.import.manual': '手动新建', 'web.import.split': '智能拆条', 'web.import.run': '导入 {0} 条', 'web.import.done': '已导入 {0} 条', 'web.import.busy': '正在处理…', 'web.vg.manual': '以下厂商需在官网控制台查看用量', 'web.calc.run': '计算', 'web.calc.cheapest': '最省', 'web.calc.quality': '最佳质量', 'web.calc.code': '复制代码', 'web.calc.empty': '填写参数后点计算', 'web.calc.tokens': '预估 token', 'web.qd.trend': '余额趋势', 'web.qd.recent': '最近记录', 'web.qd.nodata': '暂无数据，下拉刷新后重试', 'web.cmp.lowest': '最低', 'web.cmp.longest': '最长', 'web.cmp.highest': '最高', 'web.cats.new': '新建分类', 'web.cats.rename': '重命名', 'web.cats.del': '删除', 'web.cats.hint': '删除分类后条目归入未分类', 'web.trash.restore': '恢复', 'web.trash.empty': '回收站是空的', 'web.trash.keep': '回收站保留 7 天', 'web.trash.all': '全部恢复', 'web.trash.clear': '清空', 'web.detail.vars': '变量', 'web.detail.use': '一键使用', 'web.detail.copy': '复制正文', 'web.detail.share': '分享', 'web.detail.note': '备注', 'web.detail.source': '来源', 'web.edit.title': '标题', 'web.edit.body': '正文', 'web.edit.type': '类型', 'web.edit.cat': '分类', 'web.edit.model': '适用模型', 'web.edit.tags': '标签', 'web.edit.note': '备注', 'web.edit.var': '识别到变量', 'web.edit.paste': '从剪贴板粘贴', 'web.edit.suggest': '推荐标签', 'web.key.local': 'Key 只存在本浏览器；查询余额时由浏览器直接发给厂商，不经过 izyAether 服务器，也不参与云同步' },
  'zh-TW': { 'web.login.title': '登入', 'web.login.hint': '登入後可跨裝置同步會員與自建 Prompt（API Key 不上傳）', 'web.login.email': '電子郵件', 'web.login.code': '驗證碼', 'web.login.send': '傳送驗證碼', 'web.login.sent': '驗證碼已傳送', 'web.login.submit': '登入', 'web.login.err': '登入失敗，請檢查電子郵件與驗證碼', 'web.logout': '登出', 'web.sync.on': '已開啟雲端同步', 'web.sync.off': '未登入，資料僅儲存在本機', 'web.sync.ok': '已同步', 'web.sync.fail': '同步失敗', 'web.sort': '排序', 'web.copied': '已複製', 'web.proxy': '需要代理服務', 'web.needOrg': '組織 ID', 'web.cover': '封面', 'web.cover.preset': '封面 {0}', 'web.count': '{0} 項', 'web.light': '淺色', 'web.dark': '深色', 'web.system': '跟隨系統', 'web.back': '返回', 'web.fav.only': '只看收藏', 'web.trash.entry': '回收站', 'web.drag.hint': '可長按卡片拖動排序', 'web.limit.prompt': '免費版最多 {0} 條自建，升級後不限', 'web.limit.cat': '免費版最多 {0} 個分類', 'web.clip.code': '偵測到分享碼，匯入「{0}」嗎？', 'web.clip.text': '剪貼簿裡有 {0} 字文字，新建成 Prompt 嗎？', 'web.sub.trash': '回收站', 'web.sub.import': '匯入', 'web.sub.cats': '分類管理', 'web.sub.detail': '詳情', 'web.sub.new': '新建 Prompt', 'web.sub.edit': '編輯', 'web.sub.addkey': '新增 Key', 'web.sub.qdetail': '帳戶詳情', 'web.sub.vguide': '接入指引', 'web.sub.calc': '成本計算機', 'web.sub.compare': '模型對比', 'web.sub.profile': '個人資料', 'web.plans': '方案對比', 'web.plans.free': '免費版', 'web.theme': '外觀', 'web.avatar': '頭像', 'web.avatar.app': ' App 圖示', 'web.export.json': '匯出 JSON', 'web.export.ok': '已匯出到下載目錄', 'web.compare': '對比', 'web.compare.pick': '勾選要比對的模型（最多 4 個）', 'web.compare.need2': '至少選 2 個模型', 'web.compare.exit': '退出對比', 'web.compare.start': '開始對比', 'web.follow': '關注', 'web.follow.limit': '免費版只能關注 1 個模型', 'web.savings': '省錢帳本', 'web.savings.paid': '按量實付', 'web.savings.sub': '若走訂閱', 'web.savings.saved': '本月省了', 'web.alert': '餘額預警', 'web.alert.th': '低於 {0} 時標紅', 'web.month': '本月消耗', 'web.total': '餘額合計', 'web.badge.low': '{0} 個帳戶偏低', 'web.badge.fail': '{0} 個拉取失敗', 'web.mask.key': '金鑰（已隱藏）', 'web.retry': '重試', 'web.open.console': '開啟控制台', 'web.restored': '已恢復', 'web.confirm.del': '確定徹底刪除？不可復原', 'web.album': '從相簿選圖', 'web.need.key': '請先填寫 Key', 'web.need.name': '請填寫標題與內文', 'web.save.ok': '已儲存', 'web.import.paste': '貼上原文', 'web.import.file': '選擇檔案', 'web.import.manual': '手動新建', 'web.import.split': '智慧拆條', 'web.import.run': '匯入 {0} 條', 'web.import.done': '已匯入 {0} 條', 'web.import.busy': '正在處理…', 'web.vg.manual': '以下廠商需在官網控制台查看用量', 'web.calc.run': '計算', 'web.calc.cheapest': '最省', 'web.calc.quality': '最佳品質', 'web.calc.code': '複製程式碼', 'web.calc.empty': '填寫參數後點計算', 'web.calc.tokens': '預估 token', 'web.qd.trend': '餘額趨勢', 'web.qd.recent': '最近記錄', 'web.qd.nodata': '暫無資料，重新整理後重試', 'web.cmp.lowest': '最低', 'web.cmp.longest': '最長', 'web.cmp.highest': '最高', 'web.cats.new': '新建分類', 'web.cats.rename': '重新命名', 'web.cats.del': '刪除', 'web.cats.hint': '刪除分類後條目歸入未分類', 'web.trash.restore': '還原', 'web.trash.empty': '回收站是空的', 'web.trash.keep': '回收站保留 7 天', 'web.trash.all': '全部還原', 'web.trash.clear': '清空', 'web.detail.vars': '變數', 'web.detail.use': '一鍵使用', 'web.detail.copy': '複製內文', 'web.detail.share': '分享', 'web.detail.note': '備註', 'web.detail.source': '來源', 'web.edit.title': '標題', 'web.edit.body': '內文', 'web.edit.type': '類型', 'web.edit.cat': '分類', 'web.edit.model': '適用模型', 'web.edit.tags': '標籤', 'web.edit.note': '備註', 'web.edit.var': '識別到變數', 'web.edit.paste': '從剪貼簿貼上', 'web.edit.suggest': '推薦標籤', 'web.key.local': 'Key 只存在本瀏覽器；查詢餘額時由瀏覽器直接發給廠商，不經過 izyAether 伺服器，也不參與雲端同步' },
  'en-US': { 'web.login.title': 'Sign in', 'web.login.hint': 'Sign in to sync membership and custom prompts across devices (API keys are never uploaded)', 'web.login.email': 'Email', 'web.login.code': 'Verification code', 'web.login.send': 'Send code', 'web.login.sent': 'Code sent', 'web.login.submit': 'Sign in', 'web.login.err': 'Sign-in failed — check email and code', 'web.logout': 'Sign out', 'web.sync.on': 'Cloud sync is on', 'web.sync.off': 'Not signed in — data stays on this device', 'web.sync.ok': 'Synced', 'web.sync.fail': 'Sync failed', 'web.sort': 'Sort', 'web.copied': 'Copied', 'web.proxy': 'Proxy service needed', 'web.needOrg': 'Organization ID', 'web.cover': 'Cover', 'web.cover.preset': 'Cover {0}', 'web.count': '{0} items', 'web.light': 'Light', 'web.dark': 'Dark', 'web.system': 'Follow system', 'web.back': 'Back', 'web.fav.only': 'Favorites only', 'web.trash.entry': 'Trash', 'web.drag.hint': 'Long-press a card to reorder', 'web.limit.prompt': 'Free plan allows {0} custom prompts', 'web.limit.cat': 'Free plan allows {0} categories', 'web.clip.code': 'Share code found — import "{0}"?', 'web.clip.text': 'Clipboard has {0} characters — create a prompt?', 'web.sub.trash': 'Trash', 'web.sub.import': 'Import', 'web.sub.cats': 'Categories', 'web.sub.detail': 'Detail', 'web.sub.new': 'New prompt', 'web.sub.edit': 'Edit', 'web.sub.addkey': 'Add key', 'web.sub.qdetail': 'Account detail', 'web.sub.vguide': 'Setup guide', 'web.sub.calc': 'Cost calculator', 'web.sub.compare': 'Compare models', 'web.sub.profile': 'Profile', 'web.plans': 'Compare plans', 'web.plans.free': 'Free', 'web.theme': 'Appearance', 'web.avatar': 'Avatar', 'web.avatar.app': ' App icon', 'web.export.json': 'Export JSON', 'web.export.ok': 'Saved to downloads', 'web.compare': 'Compare', 'web.compare.pick': 'Pick models to compare (up to 4)', 'web.compare.need2': 'Pick at least 2 models', 'web.compare.exit': 'Exit compare', 'web.compare.start': 'Start compare', 'web.follow': 'Follow', 'web.follow.limit': 'Free plan allows only 1 followed model', 'web.savings': 'Savings ledger', 'web.savings.paid': 'Pay-as-you-go', 'web.savings.sub': 'If subscribed', 'web.savings.saved': 'Saved this month', 'web.alert': 'Balance alert', 'web.alert.th': 'Highlight below {0}', 'web.month': 'Spent this month', 'web.total': 'Total balance', 'web.badge.low': '{0} accounts low', 'web.badge.fail': '{0} failed', 'web.mask.key': 'Key (hidden)', 'web.retry': 'Retry', 'web.open.console': 'Open console', 'web.restored': 'Restored', 'web.confirm.del': 'Delete permanently? This cannot be undone', 'web.album': 'Choose from photos', 'web.need.key': 'Please enter a key first', 'web.need.name': 'Title and body are required', 'web.save.ok': 'Saved', 'web.import.paste': 'Paste text', 'web.import.file': 'Choose file', 'web.import.manual': 'Create manually', 'web.import.split': 'Smart split', 'web.import.run': 'Import {0}', 'web.import.done': 'Imported {0}', 'web.import.busy': 'Working…', 'web.vg.manual': 'These vendors show usage in their own console', 'web.calc.run': 'Calculate', 'web.calc.cheapest': 'Cheapest', 'web.calc.quality': 'Best quality', 'web.calc.code': 'Copy code', 'web.calc.empty': 'Fill in the fields and calculate', 'web.calc.tokens': 'Estimated tokens', 'web.qd.trend': 'Balance trend', 'web.qd.recent': 'Recent records', 'web.qd.nodata': 'No data yet — refresh and retry', 'web.cmp.lowest': 'Lowest', 'web.cmp.longest': 'Longest', 'web.cmp.highest': 'Highest', 'web.cats.new': 'New category', 'web.cats.rename': 'Rename', 'web.cats.del': 'Delete', 'web.cats.hint': 'Deleting a category keeps its prompts (moved to uncategorized)', 'web.trash.restore': 'Restore', 'web.trash.empty': 'Trash is empty', 'web.trash.keep': 'Items are kept for 7 days', 'web.trash.all': 'Restore all', 'web.trash.clear': 'Clear', 'web.detail.vars': 'Variables', 'web.detail.use': 'Use', 'web.detail.copy': 'Copy body', 'web.detail.share': 'Share', 'web.detail.note': 'Note', 'web.detail.source': 'Source', 'web.edit.title': 'Title', 'web.edit.body': 'Body', 'web.edit.type': 'Type', 'web.edit.cat': 'Category', 'web.edit.model': 'Target model', 'web.edit.tags': 'Tags', 'web.edit.note': 'Note', 'web.edit.var': 'Detected variables', 'web.edit.paste': 'Paste from clipboard', 'web.edit.suggest': 'Suggested tags', 'web.key.local': 'Your key stays in this browser. Balance checks go straight from your browser to the vendor, never through izyAether servers, and keys are not cloud-synced' },
  'ja-JP': { 'web.login.title': 'ログイン', 'web.login.hint': 'ログインすると会員状態と自作 Prompt がデバイス間で同期されます（API Key はアップロードされません）', 'web.login.email': 'メールアドレス', 'web.login.code': '認証コード', 'web.login.send': 'コードを送信', 'web.login.sent': 'コードを送信しました', 'web.login.submit': 'ログイン', 'web.login.err': 'ログインに失敗しました。メールとコードを確認してください', 'web.logout': 'ログアウト', 'web.sync.on': 'クラウド同期が有効です', 'web.sync.off': '未ログインのためデータはこの端末のみに保存されます', 'web.sync.ok': '同期しました', 'web.sync.fail': '同期に失敗しました', 'web.sort': '並び替え', 'web.copied': 'コピーしました', 'web.proxy': 'プロキシが必要です', 'web.needOrg': '組織 ID', 'web.cover': 'カバー', 'web.cover.preset': 'カバー {0}', 'web.count': '{0} 件', 'web.light': 'ライト', 'web.dark': 'ダーク', 'web.system': 'システムに従う', 'web.back': '戻る', 'web.fav.only': 'お気に入りのみ', 'web.trash.entry': 'ごみ箱', 'web.drag.hint': 'カードを長押しで並べ替え', 'web.limit.prompt': '無料版は自作 {0} 件まで', 'web.limit.cat': '無料版はカテゴリ {0} 個まで', 'web.clip.code': '共有コードを検出しました。「{0}」を取り込みますか？', 'web.clip.text': 'クリップボードに {0} 文字あります。新規作成しますか？', 'web.sub.trash': 'ごみ箱', 'web.sub.import': '取り込み', 'web.sub.cats': 'カテゴリ管理', 'web.sub.detail': '詳細', 'web.sub.new': '新規 Prompt', 'web.sub.edit': '編集', 'web.sub.addkey': 'Key を追加', 'web.sub.qdetail': 'アカウント詳細', 'web.sub.vguide': '接続ガイド', 'web.sub.calc': 'コスト計算', 'web.sub.compare': 'モデル比較', 'web.sub.profile': 'プロフィール', 'web.plans': 'プラン比較', 'web.plans.free': '無料版', 'web.theme': '外観', 'web.avatar': 'アバター', 'web.avatar.app': ' アプリアイコン', 'web.export.json': 'JSON を書き出し', 'web.export.ok': 'ダウンロードに保存しました', 'web.compare': '比較', 'web.compare.pick': '比較するモデルを選択（最大 4 つ）', 'web.compare.need2': '少なくとも 2 つ選択してください', 'web.compare.exit': '比較を終了', 'web.compare.start': '比較開始', 'web.follow': 'フォロー', 'web.follow.limit': '無料版でフォローできるのは 1 モデルです', 'web.savings': '節約台帳', 'web.savings.paid': '従量課金', 'web.savings.sub': '定額の場合', 'web.savings.saved': '今月の節約', 'web.alert': '残高アラート', 'web.alert.th': '{0} 未満で強調', 'web.month': '今月の消費', 'web.total': '残高合計', 'web.badge.low': '{0} 件が残高低下', 'web.badge.fail': '{0} 件が取得失敗', 'web.mask.key': 'キー（非表示）', 'web.retry': '再試行', 'web.open.console': 'コンソールを開く', 'web.restored': '復元しました', 'web.confirm.del': '完全に削除しますか？取り消せません', 'web.album': '写真から選ぶ', 'web.need.key': 'まず Key を入力してください', 'web.need.name': 'タイトルと本文は必須です', 'web.save.ok': '保存しました', 'web.import.paste': '原文を貼り付け', 'web.import.file': 'ファイルを選択', 'web.import.manual': '手動作成', 'web.import.split': '自動分割', 'web.import.run': '{0} 件取り込む', 'web.import.done': '{0} 件取り込みました', 'web.import.busy': '処理中…', 'web.vg.manual': '以下の事業者は公式コンソールで使用量を確認します', 'web.calc.run': '計算', 'web.calc.cheapest': '最安', 'web.calc.quality': '最良品質', 'web.calc.code': 'コードをコピー', 'web.calc.empty': '項目を入力して計算', 'web.calc.tokens': '推定 token', 'web.qd.trend': '残高推移', 'web.qd.recent': '最近の記録', 'web.qd.nodata': 'データがありません。再取得してください', 'web.cmp.lowest': '最低', 'web.cmp.longest': '最長', 'web.cmp.highest': '最高', 'web.cats.new': '新規カテゴリ', 'web.cats.rename': '名前変更', 'web.cats.del': '削除', 'web.cats.hint': 'カテゴリを削除しても項目は未分類に残ります', 'web.trash.restore': '復元', 'web.trash.empty': 'ごみ箱は空です', 'web.trash.keep': '7 日間保持されます', 'web.trash.all': 'すべて復元', 'web.trash.clear': 'すべて削除', 'web.detail.vars': '変数', 'web.detail.use': '使う', 'web.detail.copy': '本文をコピー', 'web.detail.share': '共有', 'web.detail.note': 'メモ', 'web.detail.source': '出典', 'web.edit.title': 'タイトル', 'web.edit.body': '本文', 'web.edit.type': '種類', 'web.edit.cat': 'カテゴリ', 'web.edit.model': '対象モデル', 'web.edit.tags': 'タグ', 'web.edit.note': 'メモ', 'web.edit.var': '検出された変数', 'web.edit.paste': 'クリップボードから貼り付け', 'web.edit.suggest': 'おすすめタグ', 'web.key.local': 'キーはこのブラウザにのみ保存されます。残高照会はブラウザから各社へ直接送信され、izyAether のサーバーを経由せず、クラウド同期もされません' },
  'ko-KR': { 'web.login.title': '로그인', 'web.login.hint': '로그인하면 멤버십과 직접 만든 Prompt가 기기 간에 동기화됩니다(API Key는 업로드되지 않음)', 'web.login.email': '이메일', 'web.login.code': '인증 코드', 'web.login.send': '코드 받기', 'web.login.sent': '코드를 보냈습니다', 'web.login.submit': '로그인', 'web.login.err': '로그인 실패 — 이메일과 코드를 확인하세요', 'web.logout': '로그아웃', 'web.sync.on': '클라우드 동기화 사용 중', 'web.sync.off': '로그인하지 않아 데이터는 이 기기에만 저장됩니다', 'web.sync.ok': '동기화됨', 'web.sync.fail': '동기화 실패', 'web.sort': '정렬', 'web.copied': '복사됨', 'web.proxy': '프록시 서비스 필요', 'web.needOrg': '조직 ID', 'web.cover': '커버', 'web.cover.preset': '커버 {0}', 'web.count': '{0}개', 'web.light': '라이트', 'web.dark': '다크', 'web.system': '시스템 따르기', 'web.back': '뒤로', 'web.fav.only': '즐겨찾기만', 'web.trash.entry': '휴지통', 'web.drag.hint': '카드를 길게 눌러 순서 변경', 'web.limit.prompt': '무료 버전은 직접 만든 Prompt {0}개까지', 'web.limit.cat': '무료 버전은 분류 {0}개까지', 'web.clip.code': '공유 코드를 찾았습니다. "{0}"을(를) 가져올까요?', 'web.clip.text': '클립보드에 {0}자 있습니다. 새로 만들까요?', 'web.sub.trash': '휴지통', 'web.sub.import': '가져오기', 'web.sub.cats': '분류 관리', 'web.sub.detail': '상세', 'web.sub.new': '새 Prompt', 'web.sub.edit': '편집', 'web.sub.addkey': 'Key 추가', 'web.sub.qdetail': '계정 상세', 'web.sub.vguide': '연결 안내', 'web.sub.calc': '비용 계산기', 'web.sub.compare': '모델 비교', 'web.sub.profile': '프로필', 'web.plans': '플랜 비교', 'web.plans.free': '무료', 'web.theme': '테마', 'web.avatar': '아바타', 'web.avatar.app': ' 앱 아이콘', 'web.export.json': 'JSON 내보내기', 'web.export.ok': '다운로드 폴더에 저장했습니다', 'web.compare': '비교', 'web.compare.pick': '비교할 모델 선택 (최대 4개)', 'web.compare.need2': '최소 2개를 선택하세요', 'web.compare.exit': '비교 종료', 'web.compare.start': '비교 시작', 'web.follow': '팔로우', 'web.follow.limit': '무료 버전은 모델 1개만 팔로우할 수 있습니다', 'web.savings': '절약 내역', 'web.savings.paid': '종량제 결제', 'web.savings.sub': '구독 시', 'web.savings.saved': '이번 달 절약', 'web.alert': '잔액 알림', 'web.alert.th': '{0} 미만이면 강조', 'web.month': '이번 달 사용', 'web.total': '총 잔액', 'web.badge.low': '{0}개 계정 잔액 부족', 'web.badge.fail': '{0}개 조회 실패', 'web.mask.key': '키 (숨김)', 'web.retry': '다시 시도', 'web.open.console': '콘솔 열기', 'web.restored': '복구됨', 'web.confirm.del': '완전히 삭제할까요? 되돌릴 수 없습니다', 'web.album': '사진에서 선택', 'web.need.key': '먼저 Key를 입력하세요', 'web.need.name': '제목과 본문은 필수입니다', 'web.save.ok': '저장됨', 'web.import.paste': '원문 붙여넣기', 'web.import.file': '파일 선택', 'web.import.manual': '직접 만들기', 'web.import.split': '자동 분리', 'web.import.run': '{0}개 가져오기', 'web.import.done': '{0}개 가져왔습니다', 'web.import.busy': '처리 중…', 'web.vg.manual': '아래 제공사는 공식 콘솔에서 사용량을 확인합니다', 'web.calc.run': '계산', 'web.calc.cheapest': '최저가', 'web.calc.quality': '최고 품질', 'web.calc.code': '코드 복사', 'web.calc.empty': '항목을 입력하고 계산하세요', 'web.calc.tokens': '예상 token', 'web.qd.trend': '잔액 추이', 'web.qd.recent': '최근 기록', 'web.qd.nodata': '데이터가 없습니다. 새로고침하세요', 'web.cmp.lowest': '최저', 'web.cmp.longest': '최장', 'web.cmp.highest': '최고', 'web.cats.new': '새 분류', 'web.cats.rename': '이름 바꾸기', 'web.cats.del': '삭제', 'web.cats.hint': '분류를 삭제해도 항목은 미분류로 남습니다', 'web.trash.restore': '복구', 'web.trash.empty': '휴지통이 비어 있습니다', 'web.trash.keep': '7일간 보관됩니다', 'web.trash.all': '모두 복구', 'web.trash.clear': '모두 삭제', 'web.detail.vars': '변수', 'web.detail.use': '사용', 'web.detail.copy': '본문 복사', 'web.detail.share': '공유', 'web.detail.note': '메모', 'web.detail.source': '출처', 'web.edit.title': '제목', 'web.edit.body': '본문', 'web.edit.type': '유형', 'web.edit.cat': '분류', 'web.edit.model': '대상 모델', 'web.edit.tags': '태그', 'web.edit.note': '메모', 'web.edit.var': '감지된 변수', 'web.edit.paste': '클립보드에서 붙여넣기', 'web.edit.suggest': '추천 태그', 'web.key.local': '키는 이 브라우저에만 저장됩니다. 잔액 조회는 브라우저에서 업체로 직접 전송되며 izyAether 서버를 거치지 않고 클라우드 동기화에도 포함되지 않습니다' },
  'de-DE': { 'web.login.title': 'Anmelden', 'web.login.hint': 'Nach der Anmeldung werden Mitgliedschaft und eigene Prompts geräteübergreifend synchronisiert (API-Schlüssel werden nie hochgeladen)', 'web.login.email': 'E-Mail', 'web.login.code': 'Bestätigungscode', 'web.login.send': 'Code senden', 'web.login.sent': 'Code gesendet', 'web.login.submit': 'Anmelden', 'web.login.err': 'Anmeldung fehlgeschlagen – E-Mail und Code prüfen', 'web.logout': 'Abmelden', 'web.sync.on': 'Cloud-Synchronisierung aktiv', 'web.sync.off': 'Nicht angemeldet – Daten bleiben auf diesem Gerät', 'web.sync.ok': 'Synchronisiert', 'web.sync.fail': 'Synchronisierung fehlgeschlagen', 'web.sort': 'Sortieren', 'web.copied': 'Kopiert', 'web.proxy': 'Proxy-Dienst nötig', 'web.needOrg': 'Organisations-ID', 'web.cover': 'Titelbild', 'web.cover.preset': 'Titelbild {0}', 'web.count': '{0} Einträge', 'web.light': 'Hell', 'web.dark': 'Dunkel', 'web.system': 'System folgen', 'web.back': 'Zurück', 'web.fav.only': 'Nur Favoriten', 'web.trash.entry': 'Papierkorb', 'web.drag.hint': 'Karte lange drücken zum Sortieren', 'web.limit.prompt': 'Kostenlos: maximal {0} eigene Prompts', 'web.limit.cat': 'Kostenlos: maximal {0} Kategorien', 'web.clip.code': 'Freigabecode gefunden – „{0}“ importieren?', 'web.clip.text': 'Zwischenablage hat {0} Zeichen – Prompt erstellen?', 'web.sub.trash': 'Papierkorb', 'web.sub.import': 'Import', 'web.sub.cats': 'Kategorien', 'web.sub.detail': 'Detail', 'web.sub.new': 'Neuer Prompt', 'web.sub.edit': 'Bearbeiten', 'web.sub.addkey': 'Schlüssel hinzufügen', 'web.sub.qdetail': 'Kontodetail', 'web.sub.vguide': 'Einrichtungsanleitung', 'web.sub.calc': 'Kostenrechner', 'web.sub.compare': 'Modelle vergleichen', 'web.sub.profile': 'Profil', 'web.plans': 'Pläne vergleichen', 'web.plans.free': 'Kostenlos', 'web.theme': 'Darstellung', 'web.avatar': 'Avatar', 'web.avatar.app': ' App-Symbol', 'web.export.json': 'JSON exportieren', 'web.export.ok': 'In Downloads gespeichert', 'web.compare': 'Vergleich', 'web.compare.pick': 'Modelle wählen (max. 4)', 'web.compare.need2': 'Mindestens 2 Modelle', 'web.compare.exit': 'Vergleich beenden', 'web.compare.start': 'Vergleich starten', 'web.follow': 'Beobachten', 'web.follow.limit': 'Kostenlos nur 1 beobachtetes Modell', 'web.savings': 'Sparbuch', 'web.savings.paid': 'Nutzungsbasiert', 'web.savings.sub': 'Mit Abo', 'web.savings.saved': 'Diesen Monat gespart', 'web.alert': 'Saldo-Warnung', 'web.alert.th': 'Unter {0} markieren', 'web.month': 'Dieses Monat verbraucht', 'web.total': 'Gesamtsaldo', 'web.badge.low': '{0} Konten niedrig', 'web.badge.fail': '{0} fehlgeschlagen', 'web.mask.key': 'Schlüssel (verborgen)', 'web.retry': 'Erneut versuchen', 'web.open.console': 'Konsole öffnen', 'web.restored': 'Wiederhergestellt', 'web.confirm.del': 'Endgültig löschen? Nicht rückgängig machbar', 'web.album': 'Aus Fotos wählen', 'web.need.key': 'Bitte zuerst einen Schlüssel eingeben', 'web.need.name': 'Titel und Text sind erforderlich', 'web.save.ok': 'Gespeichert', 'web.import.paste': 'Text einfügen', 'web.import.file': 'Datei wählen', 'web.import.manual': 'Manuell erstellen', 'web.import.split': 'Automatisch teilen', 'web.import.run': '{0} importieren', 'web.import.done': '{0} importiert', 'web.import.busy': 'Verarbeitung…', 'web.vg.manual': 'Diese Anbieter zeigen die Nutzung in ihrer Konsole', 'web.calc.run': 'Berechnen', 'web.calc.cheapest': 'Am günstigsten', 'web.calc.quality': 'Beste Qualität', 'web.calc.code': 'Code kopieren', 'web.calc.empty': 'Felder ausfüllen und berechnen', 'web.calc.tokens': 'Geschätzte Tokens', 'web.qd.trend': 'Saldo-Verlauf', 'web.qd.recent': 'Letzte Einträge', 'web.qd.nodata': 'Noch keine Daten – bitte aktualisieren', 'web.cmp.lowest': 'Niedrigster', 'web.cmp.longest': 'Längster', 'web.cmp.highest': 'Höchster', 'web.cats.new': 'Neue Kategorie', 'web.cats.rename': 'Umbenennen', 'web.cats.del': 'Löschen', 'web.cats.hint': 'Kategorielöschung behält Prompts (unkategorisiert)', 'web.trash.restore': 'Wiederherstellen', 'web.trash.empty': 'Papierkorb ist leer', 'web.trash.keep': 'Einträge bleiben 7 Tage', 'web.trash.all': 'Alle wiederherstellen', 'web.trash.clear': 'Leeren', 'web.detail.vars': 'Variablen', 'web.detail.use': 'Verwenden', 'web.detail.copy': 'Text kopieren', 'web.detail.share': 'Teilen', 'web.detail.note': 'Notiz', 'web.detail.source': 'Quelle', 'web.edit.title': 'Titel', 'web.edit.body': 'Text', 'web.edit.type': 'Typ', 'web.edit.cat': 'Kategorie', 'web.edit.model': 'Zielmodell', 'web.edit.tags': 'Tags', 'web.edit.note': 'Notiz', 'web.edit.var': 'Erkannte Variablen', 'web.edit.paste': 'Aus Zwischenablage einfügen', 'web.edit.suggest': 'Vorgeschlagene Tags', 'web.key.local': 'Der Schlüssel bleibt in diesem Browser. Guthabenabfragen gehen direkt vom Browser zum Anbieter, nie über izyAether-Server, und werden nicht in die Cloud synchronisiert' },
  'es-ES': { 'web.login.title': 'Iniciar sesión', 'web.login.hint': 'Tras iniciar sesión, la membresía y tus prompts se sincronizan entre dispositivos (las claves API nunca se suben)', 'web.login.email': 'Correo electrónico', 'web.login.code': 'Código de verificación', 'web.login.send': 'Enviar código', 'web.login.sent': 'Código enviado', 'web.login.submit': 'Iniciar sesión', 'web.login.err': 'Error al iniciar sesión: revisa el correo y el código', 'web.logout': 'Cerrar sesión', 'web.sync.on': 'Sincronización en la nube activa', 'web.sync.off': 'No has iniciado sesión: los datos se quedan en este dispositivo', 'web.sync.ok': 'Sincronizado', 'web.sync.fail': 'Error de sincronización', 'web.sort': 'Ordenar', 'web.copied': 'Copiado', 'web.proxy': 'Se necesita un proxy', 'web.needOrg': 'ID de organización', 'web.cover': 'Portada', 'web.cover.preset': 'Portada {0}', 'web.count': '{0} elementos', 'web.light': 'Claro', 'web.dark': 'Oscuro', 'web.system': 'Seguir al sistema', 'web.back': 'Atrás', 'web.fav.only': 'Solo favoritos', 'web.trash.entry': 'Papelera', 'web.drag.hint': 'Mantén pulsada una tarjeta para ordenar', 'web.limit.prompt': 'El plan gratuito permite {0} prompts propios', 'web.limit.cat': 'El plan gratuito permite {0} categorías', 'web.clip.code': 'Se detectó un código compartido, ¿importar «{0}»?', 'web.clip.text': 'El portapapeles tiene {0} caracteres, ¿crear un prompt?', 'web.sub.trash': 'Papelera', 'web.sub.import': 'Importar', 'web.sub.cats': 'Categorías', 'web.sub.detail': 'Detalle', 'web.sub.new': 'Nuevo prompt', 'web.sub.edit': 'Editar', 'web.sub.addkey': 'Añadir clave', 'web.sub.qdetail': 'Detalle de cuenta', 'web.sub.vguide': 'Guía de conexión', 'web.sub.calc': 'Calculadora de coste', 'web.sub.compare': 'Comparar modelos', 'web.sub.profile': 'Perfil', 'web.plans': 'Comparar planes', 'web.plans.free': 'Gratis', 'web.theme': 'Apariencia', 'web.avatar': 'Avatar', 'web.avatar.app': ' icono de la app', 'web.export.json': 'Exportar JSON', 'web.export.ok': 'Guardado en descargas', 'web.compare': 'Comparar', 'web.compare.pick': 'Elige modelos (máx. 4)', 'web.compare.need2': 'Elige al menos 2 modelos', 'web.compare.exit': 'Salir de la comparación', 'web.compare.start': 'Empezar', 'web.follow': 'Seguir', 'web.follow.limit': 'El plan gratuito solo permite 1 modelo seguido', 'web.savings': 'Libro de ahorro', 'web.savings.paid': 'Pago por uso', 'web.savings.sub': 'Con suscripción', 'web.savings.saved': 'Ahorrado este mes', 'web.alert': 'Aviso de saldo', 'web.alert.th': 'Resaltar por debajo de {0}', 'web.month': 'Gasto del mes', 'web.total': 'Saldo total', 'web.badge.low': '{0} cuentas bajas', 'web.badge.fail': '{0} con error', 'web.mask.key': 'Clave (oculta)', 'web.retry': 'Reintentar', 'web.open.console': 'Abrir consola', 'web.restored': 'Restaurado', 'web.confirm.del': '¿Eliminar definitivamente? No se puede deshacer', 'web.album': 'Elegir de fotos', 'web.need.key': 'Introduce primero una clave', 'web.need.name': 'Título y cuerpo obligatorios', 'web.save.ok': 'Guardado', 'web.import.paste': 'Pegar texto', 'web.import.file': 'Elegir archivo', 'web.import.manual': 'Crear a mano', 'web.import.split': 'División inteligente', 'web.import.run': 'Importar {0}', 'web.import.done': 'Importado {0}', 'web.import.busy': 'Procesando…', 'web.vg.manual': 'Estos proveedores muestran el uso en su consola', 'web.calc.run': 'Calcular', 'web.calc.cheapest': 'Más barato', 'web.calc.quality': 'Mejor calidad', 'web.calc.code': 'Copiar código', 'web.calc.empty': 'Rellena los campos y calcula', 'web.calc.tokens': 'Tokens estimados', 'web.qd.trend': 'Tendencia del saldo', 'web.qd.recent': 'Registros recientes', 'web.qd.nodata': 'Aún sin datos — actualiza y reintenta', 'web.cmp.lowest': 'Más bajo', 'web.cmp.longest': 'Más largo', 'web.cmp.highest': 'Más alto', 'web.cats.new': 'Nueva categoría', 'web.cats.rename': 'Renombrar', 'web.cats.del': 'Eliminar', 'web.cats.hint': 'Al borrar una categoría sus prompts quedan sin categoría', 'web.trash.restore': 'Restaurar', 'web.trash.empty': 'La papelera está vacía', 'web.trash.keep': 'Los elementos se guardan 7 días', 'web.trash.all': 'Restaurar todo', 'web.trash.clear': 'Vaciar', 'web.detail.vars': 'Variables', 'web.detail.use': 'Usar', 'web.detail.copy': 'Copiar cuerpo', 'web.detail.share': 'Compartir', 'web.detail.note': 'Nota', 'web.detail.source': 'Fuente', 'web.edit.title': 'Título', 'web.edit.body': 'Cuerpo', 'web.edit.type': 'Tipo', 'web.edit.cat': 'Categoría', 'web.edit.model': 'Modelo destino', 'web.edit.tags': 'Etiquetas', 'web.edit.note': 'Nota', 'web.edit.var': 'Variables detectadas', 'web.edit.paste': 'Pegar del portapapeles', 'web.edit.suggest': 'Etiquetas sugeridas', 'web.key.local': 'La clave solo se guarda en este navegador. Las consultas de saldo van directamente del navegador al proveedor, sin pasar por servidores de izyAether, y no se sincronizan en la nube' },
  'fr-FR': { 'web.login.title': 'Se connecter', 'web.login.hint': 'Après la connexion, abonnement et prompts sont synchronisés entre appareils (les clés API ne sont jamais envoyées)', 'web.login.email': 'Adresse e-mail', 'web.login.code': 'Code de vérification', 'web.login.send': 'Envoyer le code', 'web.login.sent': 'Code envoyé', 'web.login.submit': 'Se connecter', 'web.login.err': 'Échec de la connexion — vérifiez le courriel et le code', 'web.logout': 'Se déconnecter', 'web.sync.on': 'Synchronisation cloud activée', 'web.sync.off': 'Non connecté — les données restent sur cet appareil', 'web.sync.ok': 'Synchronisé', 'web.sync.fail': 'Échec de la synchronisation', 'web.sort': 'Trier', 'web.copied': 'Copié', 'web.proxy': 'Un proxy est nécessaire', 'web.needOrg': 'ID d organisation', 'web.cover': 'Couverture', 'web.cover.preset': 'Couverture {0}', 'web.count': '{0} éléments', 'web.light': 'Clair', 'web.dark': 'Sombre', 'web.system': 'Suivre le système', 'web.back': 'Retour', 'web.fav.only': 'Favoris uniquement', 'web.trash.entry': 'Corbeille', 'web.drag.hint': 'Maintenez une carte pour la déplacer', 'web.limit.prompt': 'Gratuit : {0} prompts personnels maximum', 'web.limit.cat': 'Gratuit : {0} catégories maximum', 'web.clip.code': 'Code de partage détecté — importer « {0} » ?', 'web.clip.text': 'Le presse-papier contient {0} caractères — créer un prompt ?', 'web.sub.trash': 'Corbeille', 'web.sub.import': 'Importer', 'web.sub.cats': 'Catégories', 'web.sub.detail': 'Détail', 'web.sub.new': 'Nouveau prompt', 'web.sub.edit': 'Modifier', 'web.sub.addkey': 'Ajouter une clé', 'web.sub.qdetail': 'Détail du compte', 'web.sub.vguide': 'Guide de connexion', 'web.sub.calc': 'Calculateur de coût', 'web.sub.compare': 'Comparer les modèles', 'web.sub.profile': 'Profil', 'web.plans': 'Comparer les offres', 'web.plans.free': 'Gratuit', 'web.theme': 'Apparence', 'web.avatar': 'Avatar', 'web.avatar.app': ' icône de l app', 'web.export.json': 'Exporter en JSON', 'web.export.ok': 'Enregistré dans les téléchargements', 'web.compare': 'Comparer', 'web.compare.pick': 'Choisissez des modèles (4 max)', 'web.compare.need2': 'Choisissez au moins 2 modèles', 'web.compare.exit': 'Quitter la comparaison', 'web.compare.start': 'Lancer', 'web.follow': 'Suivre', 'web.follow.limit': 'Gratuit : un seul modèle suivi', 'web.savings': 'Carnet d économies', 'web.savings.paid': 'Paiement à l usage', 'web.savings.sub': 'Avec abonnement', 'web.savings.saved': 'Économisé ce mois', 'web.alert': 'Alerte de solde', 'web.alert.th': 'Surligner sous {0}', 'web.month': 'Dépense du mois', 'web.total': 'Solde total', 'web.badge.low': '{0} comptes bas', 'web.badge.fail': '{0} en échec', 'web.mask.key': 'Clé (masquée)', 'web.retry': 'Réessayer', 'web.open.console': 'Ouvrir la console', 'web.restored': 'Restauré', 'web.confirm.del': 'Supprimer définitivement ? Irréversible', 'web.album': 'Choisir dans les photos', 'web.need.key': 'Saisissez d abord une clé', 'web.need.name': 'Titre et texte obligatoires', 'web.save.ok': 'Enregistré', 'web.import.paste': 'Coller le texte', 'web.import.file': 'Choisir un fichier', 'web.import.manual': 'Créer à la main', 'web.import.split': 'Découpe intelligente', 'web.import.run': 'Importer {0}', 'web.import.done': 'Importé {0}', 'web.import.busy': 'Traitement…', 'web.vg.manual': 'Ces fournisseurs affichent l usage dans leur console', 'web.calc.run': 'Calculer', 'web.calc.cheapest': 'Le moins cher', 'web.calc.quality': 'Meilleure qualité', 'web.calc.code': 'Copier le code', 'web.calc.empty': 'Remplissez les champs puis calculez', 'web.calc.tokens': 'Tokens estimés', 'web.qd.trend': 'Évolution du solde', 'web.qd.recent': 'Derniers relevés', 'web.qd.nodata': 'Pas encore de données — actualisez', 'web.cmp.lowest': 'Le plus bas', 'web.cmp.longest': 'Le plus long', 'web.cmp.highest': 'Le plus élevé', 'web.cats.new': 'Nouvelle catégorie', 'web.cats.rename': 'Renommer', 'web.cats.del': 'Supprimer', 'web.cats.hint': 'Supprimer une catégorie conserve ses prompts (sans catégorie)', 'web.trash.restore': 'Restaurer', 'web.trash.empty': 'La corbeille est vide', 'web.trash.keep': 'Les éléments sont gardés 7 jours', 'web.trash.all': 'Tout restaurer', 'web.trash.clear': 'Vider', 'web.detail.vars': 'Variables', 'web.detail.use': 'Utiliser', 'web.detail.copy': 'Copier le texte', 'web.detail.share': 'Partager', 'web.detail.note': 'Note', 'web.detail.source': 'Source', 'web.edit.title': 'Titre', 'web.edit.body': 'Texte', 'web.edit.type': 'Type', 'web.edit.cat': 'Catégorie', 'web.edit.model': 'Modèle cible', 'web.edit.tags': 'Tags', 'web.edit.note': 'Note', 'web.edit.var': 'Variables détectées', 'web.edit.paste': 'Coller depuis le presse-papier', 'web.edit.suggest': 'Tags suggérés', 'web.key.local': 'La clé reste dans ce navigateur. Les demandes de solde partent directement du navigateur vers le fournisseur, sans passer par les serveurs izyAether, et ne sont pas synchronisées dans le cloud' },
  'ru-RU': { 'web.login.title': 'Войти', 'web.login.hint': 'После входа подписка и свои промпты синхронизируются между устройствами (API-ключи не загружаются)', 'web.login.email': 'Электронная почта', 'web.login.code': 'Код подтверждения', 'web.login.send': 'Отправить код', 'web.login.sent': 'Код отправлен', 'web.login.submit': 'Войти', 'web.login.err': 'Не удалось войти — проверьте почту и код', 'web.logout': 'Выйти', 'web.sync.on': 'Облачная синхронизация включена', 'web.sync.off': 'Вы не вошли — данные остаются на этом устройстве', 'web.sync.ok': 'Синхронизировано', 'web.sync.fail': 'Ошибка синхронизации', 'web.sort': 'Сортировка', 'web.copied': 'Скопировано', 'web.proxy': 'Нужен прокси', 'web.needOrg': 'ID организации', 'web.cover': 'Обложка', 'web.cover.preset': 'Обложка {0}', 'web.count': '{0} шт.', 'web.light': 'Светлая', 'web.dark': 'Тёмная', 'web.system': 'Как в системе', 'web.back': 'Назад', 'web.fav.only': 'Только избранные', 'web.trash.entry': 'Корзина', 'web.drag.hint': 'Удерживайте карточку для сортировки', 'web.limit.prompt': 'Бесплатно: максимум {0} своих промптов', 'web.limit.cat': 'Бесплатно: максимум {0} категорий', 'web.clip.code': 'Найден код общего доступа — импортировать «{0}»?', 'web.clip.text': 'В буфере {0} символов — создать промпт?', 'web.sub.trash': 'Корзина', 'web.sub.import': 'Импорт', 'web.sub.cats': 'Категории', 'web.sub.detail': 'Подробнее', 'web.sub.new': 'Новый промпт', 'web.sub.edit': 'Изменить', 'web.sub.addkey': 'Добавить ключ', 'web.sub.qdetail': 'Детали аккаунта', 'web.sub.vguide': 'Инструкция', 'web.sub.calc': 'Калькулятор', 'web.sub.compare': 'Сравнение моделей', 'web.sub.profile': 'Профиль', 'web.plans': 'Сравнить планы', 'web.plans.free': 'Бесплатно', 'web.theme': 'Оформление', 'web.avatar': 'Аватар', 'web.avatar.app': ' иконка приложения', 'web.export.json': 'Экспорт JSON', 'web.export.ok': 'Сохранено в загрузки', 'web.compare': 'Сравнить', 'web.compare.pick': 'Выберите модели (до 4)', 'web.compare.need2': 'Минимум 2 модели', 'web.compare.exit': 'Выйти из сравнения', 'web.compare.start': 'Начать', 'web.follow': 'Отслеживать', 'web.follow.limit': 'Бесплатно можно отслеживать только 1 модель', 'web.savings': 'Журнал экономии', 'web.savings.paid': 'По факту', 'web.savings.sub': 'С подпиской', 'web.savings.saved': 'Сэкономлено за месяц', 'web.alert': 'Оповещение о балансе', 'web.alert.th': 'Подсвечивать ниже {0}', 'web.month': 'Расход за месяц', 'web.total': 'Всего баланс', 'web.badge.low': '{0} аккаунтов с низким балансом', 'web.badge.fail': '{0} с ошибкой', 'web.mask.key': 'Ключ (скрыт)', 'web.retry': 'Повторить', 'web.open.console': 'Открыть консоль', 'web.restored': 'Восстановлено', 'web.confirm.del': 'Удалить навсегда? Это необратимо', 'web.album': 'Выбрать из фото', 'web.need.key': 'Сначала введите ключ', 'web.need.name': 'Заголовок и текст обязательны', 'web.save.ok': 'Сохранено', 'web.import.paste': 'Вставить текст', 'web.import.file': 'Выбрать файл', 'web.import.manual': 'Создать вручную', 'web.import.split': 'Авто-разбор', 'web.import.run': 'Импортировать {0}', 'web.import.done': 'Импортировано {0}', 'web.import.busy': 'Обработка…', 'web.vg.manual': 'Эти поставщики показывают расход в своей консоли', 'web.calc.run': 'Рассчитать', 'web.calc.cheapest': 'Самая дешёвая', 'web.calc.quality': 'Лучшее качество', 'web.calc.code': 'Скопировать код', 'web.calc.empty': 'Заполните поля и рассчитайте', 'web.calc.tokens': 'Оценка токенов', 'web.qd.trend': 'Динамика баланса', 'web.qd.recent': 'Последние записи', 'web.qd.nodata': 'Данных нет — обновите', 'web.cmp.lowest': 'Минимум', 'web.cmp.longest': 'Максимум', 'web.cmp.highest': 'Максимум', 'web.cats.new': 'Новая категория', 'web.cats.rename': 'Переименовать', 'web.cats.del': 'Удалить', 'web.cats.hint': 'При удалении категории промпты остаются без категории', 'web.trash.restore': 'Восстановить', 'web.trash.empty': 'Корзина пуста', 'web.trash.keep': 'Хранится 7 дней', 'web.trash.all': 'Восстановить все', 'web.trash.clear': 'Очистить', 'web.detail.vars': 'Переменные', 'web.detail.use': 'Использовать', 'web.detail.copy': 'Копировать текст', 'web.detail.share': 'Поделиться', 'web.detail.note': 'Заметка', 'web.detail.source': 'Источник', 'web.edit.title': 'Заголовок', 'web.edit.body': 'Текст', 'web.edit.type': 'Тип', 'web.edit.cat': 'Категория', 'web.edit.model': 'Целевая модель', 'web.edit.tags': 'Теги', 'web.edit.note': 'Заметка', 'web.edit.var': 'Найденные переменные', 'web.edit.paste': 'Вставить из буфера', 'web.edit.suggest': 'Рекомендуемые теги', 'web.key.local': 'Ключ хранится только в этом браузере. Запросы баланса идут из браузера напрямую к провайдеру, минуя серверы izyAether, и не синхронизируются с облаком' }
};
function guessLang() {
  const n = (navigator.language || 'zh-CN');
  if (LANGS.some(function (x) { return x[0] === n; })) return n;
  const short = n.split('-')[0];
  const hit = LANGS.filter(function (x) { return x[0].indexOf(short + '-') === 0; })[0];
  return hit ? hit[0] : 'en-US';
}

/* ══════════ 存储 ══════════ */
const store = {
  get(k, def) {
    try { const s = localStorage.getItem(k); return s === null ? def : JSON.parse(s); } catch (e) { return def; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { }
    /* 2026-10-19：已去掉云同步 */
  }
};
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const yuan = n => '¥' + Number(n || 0).toLocaleString('zh-CN', { maximumFractionDigits: 2 });
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.className = 'on';
  clearTimeout(window.__tt); window.__tt = setTimeout(function () { el.className = ''; }, 1800);
}
function copyText(s) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(s).then(function () { toast(t('web.copied')); }, function () { fallbackCopy(s); });
  } else fallbackCopy(s);
}
function fallbackCopy(s) {
  const ta = document.createElement('textarea');
  ta.value = s; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); toast(t('web.copied')); } catch (e) { toast('copy failed'); }
  ta.remove();
}

/* ══════════ 会员（唯一判定口径，逐条对齐 app common/ProState.ets） ══════════
 * 三态：0 = 免费（试用已过、未购买）→ 30 条 / 3 分类上限
 *       1 = 7 天全功能试用期（安装起算）→ 不限
 *       2 = 已购（年会员未过期 / 永久）→ 不限
 * 所有付费墙只认 hasFullAccess() 一个入口，与 app「显示不限、实际也被放行」一致 */
const TRIAL_DAYS = 7, DAY_MS = 86400000, YEAR_MS = 365 * DAY_MS;
function firstLaunch() {
  let f = store.get(LS.first, 0);
  if (!f) { f = Date.now(); store.set(LS.first, f); }
  return f;
}
function proPlan() {
  const v = store.get(LS.pro, '');
  return (v === 'annual' || v === 'forever') ? v : 'free';
}
function proUntil() {
  const v = store.get(LS.proUntil, -1);
  return typeof v === 'number' ? v : -1;
}
function proPurchased() {
  const p = proPlan();
  if (p === 'forever') return true;
  if (p !== 'annual') return false;
  return proUntil() > Date.now();
}
/* 与 App 的 PAYWALL_ENABLED 一致：首发全部免费，会员卡 / 价格 / 升级入口不出现 */
const PAYWALL_ENABLED = false;
function trialActive() {
  if (!PAYWALL_ENABLED) return true;
  if (proPurchased()) return true;
  const f = firstLaunch();
  if (f <= 0) return true;
  return Date.now() - f < TRIAL_DAYS * DAY_MS;
}
function hasFullAccess() { return trialActive(); }
function isPro() { return trialActive(); }
function proStatus() { return proPurchased() ? 2 : (trialActive() ? 1 : 0); }
function proIsFree() { return proPlan() === 'free' && !trialActive(); }
function trialDaysLeft() {
  const f = firstLaunch();
  return Math.max(0, TRIAL_DAYS - Math.floor((Date.now() - f) / DAY_MS));
}
function proDaysLeft() {
  if (proPurchased()) {
    if (proPlan() === 'forever') return -1;
    return Math.max(0, Math.ceil((proUntil() - Date.now()) / DAY_MS));
  }
  if (trialActive()) return -1;
  return 0;
}
function proTitle() {
  const p = proPlan();
  if (p === 'forever') return t('mine.pro.forever');
  if (p === 'annual') return t('mine.pro.annual');
  if (trialActive()) return t('mine.pro.trial');
  return t('mine.pro.free');
}
function proSubText() {
  const p = proPlan();
  if (p === 'forever') return t('mine.pro.forever.sub');
  if (p === 'annual') return t('mine.pro.annual.sub', proDaysLeft());
  if (trialActive()) return t('mine.pro.trial.days', trialDaysLeft());
  /* App 2026-10-18：有额度数据 → 本月按量实付 vs 若走订阅（SavingsService.hasData）；没有 → Pro 解锁什么 */
  const sv = savingsData();
  if (sv.lines.length > 0) return t('mine.pro.free.save', calcFmtCny(sv.paid), calcFmtCny(sv.sub));
  return t('mine.pro.free.pitch');
}
const LIMIT_PROMPT = 30, LIMIT_CAT = 3, LIMIT_FOLLOW = 1;
/* App LibraryPage.QUOTA_SHOW_AT：免费版自建条数达到这个数才在页头显示「N/30」分母 */
const LIB_QUOTA_SHOW_AT = 20;

/* ══════════ 图标 ══════════ */
const svg = (d, size, sw, color) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
/* 填充型图标（App isFilled：More / Sparkle / Zap） */
const svgF = (d, size, color) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none">${d}</svg>`;
const IC = {
  search: () => svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', 16, 2, '#98A1A9'),
  searchL: () => svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', 17, 2, '#98A1A9'),
  searchW: (s) => svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', s || 17, 2, '#FFFFFF'),
  close: () => svg('<path d="M6 6l12 12M18 6L6 18"/>', 14, 2, '#98A1A9'),
  right: () => svg('<path d="M9 5l7 7-7 7"/>', 14, 2, '#C3CAD3'),
  left: () => svg('<path d="M15 5l-7 7 7 7"/>', 18, 2, '#182431'),
  chevR: () => svg('<path d="M9 18L15 12L9 6"/>', 12, 2.2, '#98A1A9'),
  chevR2: () => svg('<path d="M9 18L15 12L9 6"/>', 20, 2.2, '#98A1A9'),
  chevRP: () => svg('<path d="M9 18L15 12L9 6"/>', 15, 2.2, '#0A59F7'),
  chevD: () => svg('<path d="M6 9.2L12 15.2L18 9.2"/>', 16, 2.2, '#667788'),
  arrowUR: () => svg('<path d="M7 7L17 7L17 17M7 17L17 7"/>', 13, 2, '#0A59F7'),
  lock: () => svg('<path d="M8 10.5L8 7.2A4 4 0 0 1 16 7.2L16 10.5M5.6 10.5H18.4A2.1 2.1 0 0 1 20.5 12.6V19.4A2.1 2.1 0 0 1 18.4 21.5H5.6A2.1 2.1 0 0 1 3.5 19.4V12.6A2.1 2.1 0 0 1 5.6 10.5Z"/>', 12, 1.8, '#98A1A9'),
  checkOk: () => svg('<path d="M20 6.5L9.5 17L4.5 12"/>', 15, 2.2, '#0F9B8E'),
  closeWarn: () => svg('<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5"/>', 13, 2.2, '#E84026'),
  trashBig: () => svg('<path d="M3.8 6.6H20.2M9.4 6.6V4.6A1 1 0 0 1 10.4 3.6H13.6A1 1 0 0 1 14.6 4.6V6.6M5.6 6.6V19.4A1.9 1.9 0 0 0 7.5 21.3H16.5A1.9 1.9 0 0 0 18.4 19.4V6.6M10.1 10.4V17.5M13.9 10.4V17.5"/>', 30, 1.8, '#98A1A9'),
  more: (s, c) => svgF('<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>', s || 17, c || '#FFFFFF'),
  plusBig: (s, c) => svg('<path d="M5 12H19M12 5V19"/>', s || 18, 2, c || '#FFFFFF'),
  sparkle: () => svg('<path d="M12 3l1.8 4.6L18.4 9.4l-4.6 1.8L12 15.8l-1.8-4.6L5.6 9.4l4.6-1.8z"/><path d="M18.5 15l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z"/>', 13, 1.6, '#0A59F7'),
  spark: () => svg('<path d="M12 3l1.8 4.6L18.4 9.4l-4.6 1.8L12 15.8l-1.8-4.6L5.6 9.4l4.6-1.8z"/>', 19, 1.8, '#FFFFFF'),
  /* App IconKind.Sparkle / Zap：填充型（库卡与回收站卡片徽章同款） */
  sparkleW: (s) => svgF('<path d="M12 2.2C12.6 7.6 16.4 11.4 21.8 12C16.4 12.6 12.6 16.4 12 21.8C11.4 16.4 7.6 12.6 2.2 12C7.6 11.4 11.4 7.6 12 2.2Z"/>', s || 19, '#FFFFFF'),
  /* App IconKind.Prompt：对话气泡（2026-10-19 替换星芒，避开 Gemini 标志） */
  promptW: (s, c) => svgF('<path d="M5.2 3.6H18.8A2.8 2.8 0 0 1 21.6 6.4V14.6A2.8 2.8 0 0 1 18.8 17.4H10.6L5.6 21.2L6.6 17.4H5.2A2.8 2.8 0 0 1 2.4 14.6V6.4A2.8 2.8 0 0 1 5.2 3.6Z"/>', s || 19, c || '#FFFFFF'),
  zapW: (s) => svgF('<path d="M13.6 2L5 13.4H11.2L10.4 22L19 10.6H12.8Z"/>', s || 19, '#FFFFFF'),
  zap: () => svg('<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>', 19, 1.8, '#FFFFFF'),
  checkW: () => svg('<path d="M4 12l5 5L20 6"/>', 13, 2.2, '#FFFFFF'),
  trashL: () => svg('<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>', 16, 1.8, '#667788'),
  plusS: () => svg('<path d="M12 5v14M5 12h14"/>', 15, 2, '#0A59F7'),
  copy: () => svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h8"/>', 15, 2, '#667788'),
  star: (on) => svg('<path d="M12 3.6l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.3l5.4-.8z" fill="' + (on ? '#F5A623' : 'none') + '"/>', 15, 1.6, on ? '#F5A623' : '#98A1A9'),
  trash: () => svg('<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>', 16, 1.8, '#98A1A9'),
  plus: () => svg('<path d="M12 5v14M5 12h14"/>', 18, 2, '#0A59F7'),
  edit: () => svg('<path d="M4 20h4L19 9l-4-4L4 16z"/>', 15, 1.8, '#667788'),
  share: () => svg('<path d="M12 15V4M8 8l4-4 4 4"/><path d="M4 14v5h16v-5"/>', 16, 1.8, '#667788'),
  check: () => svg('<path d="M4 12l5 5L20 6"/>', 15, 2, '#0A59F7'),
  refresh: () => svg('<path d="M20 11a8 8 0 10-2.5 5.8"/><path d="M20 5v6h-6"/>', 15, 2, '#182431')
};
/* App PricingData.PRICE_UPDATED_AT（比价数据截至日，对比页副标题用） */
const PRICE_UPDATED_AT = '2026-10-13';
const CAPS = { fn: 'price.caps.fn', vision: 'price.caps.vision', reasoning: 'price.caps.reasoning', search: 'price.caps.search' };
const capLabel = c => (CAPS[c] ? t(CAPS[c]) : c);
const stars = n => '★'.repeat(Math.max(0, Math.min(5, n))) + '☆'.repeat(Math.max(0, 5 - Math.max(0, Math.min(5, n))));

/* ══════════ 品牌 & 头像 ══════════ */
function brandMark(group, size) {
  const key = BRAND.fromGroup[group] || group;
  const logo = BRAND.logo[key];
  if (logo) return `<span class="bmark" style="width:${size}px;height:${size}px"><img src="assets/img/${logo}.png" alt="${esc(group)}"></span>`;
  const mark = BRAND.mark[key] || BRAND.mark[group] || '';
  return `<span class="bmark" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.42)}px">${esc(mark)}</span>`;
}
const AVATARS = [1, 2, 3, 4, 5, 6];
/* App VendorBrand.label：字典缺该 key 时回退成 id 本身，不显示 'vendor.xxx' */
function vendorLabel(id) {
  const key = 'vendor.' + id;
  const v = t(key);
  return v === key ? id : v;
}
function avatarSrc() {
  const p = store.get(LS.profile, {});
  if (p.avatarCustom) return p.avatarCustom;
  const i = (typeof p.avatar === 'number' && p.avatar >= 1 && p.avatar <= 6) ? p.avatar : 0;
  return 'assets/img/avatar_' + (i === 0 ? 'default' : i) + '.png';
}
function coverHTML(title, sub, fade) {
  const n = store.get(LS.cover, 1);
  const p = store.get(LS.profile, {});
  const img = (p.coverCustom && p.coverImg) ? p.coverImg : 'assets/img/cover_' + n + '.jpg';
  return `<div class="cover" style="--cover_fade:${fade || 48}px">
    <img src="${esc(img)}" alt="">
    <div class="scrim"></div><div class="fade"></div>
    <div class="ttl">${title ? `<h1>${esc(title)}</h1>` : ''}${sub ? `<div class="sub">${esc(sub)}</div>` : ''}</div>
  </div>`;
}
function applyTheme() {
  const m = store.get(LS.theme, 'light');
  const dark = m === 'dark' || (m === 'system' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
}

/* ══════════ 路由 ══════════ */
function parseHash() {
  const h = location.hash.replace(/^#/, '');
  const parts = h.split('/');
  return { main: parts[0] || 'library', sub: parts[1] || '', arg: parts.slice(2).join('/') };
}
function goHash(h) { location.hash = h; }

/* ══════════ 外壳 ══════════ */
const NAV = [
  { p: 'library', icon: 'library', key: 'tab.library', dock: 1 },
  { p: 'quota', icon: 'gauge', key: 'tab.quota', dock: 1 },
  { p: 'price', icon: 'price', key: 'tab.pricing', dock: 1 },
  { p: 'mine', icon: 'mine', key: 'tab.mine', dock: 2 }
];
function buildChrome() {
  document.getElementById('nav').innerHTML = NAV.map(x =>
    `<button class="navbtn" data-p="${x.p}"><img src="assets/img/ic_tab_${x.icon}_off.png" alt="">${esc(t(x.key))}</button>`).join('');
  const items = NAV.filter(x => x.dock === 1);
  const mine = NAV.filter(x => x.dock === 2)[0];
  const on = p => S.page === p ? ' on' : '';
  /* App Index.dockBar：Column[ （库页才有的）＋行 → 主行（玻璃药丸 252 + 间隔 12 + 独立圆 62）]
     ＋钮只在 currentIndex===0（库页）出现，且圆心与「我的」圆心对齐 */
  document.getElementById('dock').innerHTML =
    `<div class="dockcol">
      ${S.page === 'library' ? `<div class="fabrow">
        <button class="dockfab" id="goImport" aria-label="${esc(t('common.add'))}"><span>+</span></button>
      </div>` : ''}
      <div class="dockrow">
        <div class="pill">${items.map(x =>
      `<button class="it${on(x.p)}" data-p="${x.p}">
            <span class="ib"><span class="bg"></span><img src="assets/img/ic_tab_${x.icon}${S.page === x.p ? '_w' : '_off'}.png" alt=""></span>
            <span class="lb">${esc(t(x.key))}</span>
          </button>`).join('')}</div>
        <button class="orb${on(mine.p)}" data-p="${mine.p}">
          <span class="circle"></span>
          <span class="ib"><img src="assets/img/ic_tab_${mine.icon}${S.page === mine.p ? '_w' : '_off'}.png" alt=""></span>
          <span class="lb">${esc(t(mine.key))}</span>
        </button>
      </div>
    </div>`;
  bindDockTouch();
  syncShellH();
  document.querySelectorAll('#dock [data-p]').forEach(b => b.onclick = function () { goHash(b.dataset.p); });
  document.querySelectorAll('.navbtn').forEach(function (b, i) {
    b.className = 'navbtn' + (S.page === NAV[i].p ? ' on' : '');
  });
  const sel = document.getElementById('langPick');
  sel.innerHTML = LANGS.map(([c, n]) => `<option value="${c}">${n}</option>`).join('');
  sel.value = S.lang;
  sel.onchange = function () { S.lang = sel.value; store.set(LS.lang, S.lang); buildChrome(); render(); };
  document.getElementById('verLine').textContent = 'izyAether v1.0.0 · ' + t('price.sub');
}

/* ── Dock 跟手反馈（App Index.dockBar）──
   ① 光团：104×104 圆，#4DFFFFFF(30% 白) blur 28，position x = touchX-64、y = -26，被药丸裁掉；
   ② 跟手放大：scale = 1 + 0.08·exp(-d²/(2·30²))，d = |格心 - touchX|；150ms EaseOut。 */
function bindDockTouch() {
  const pill = document.querySelector('#dock .pill');
  if (!pill) return;
  let blob = null;
  const paint = function (x) {
    const w = pill.getBoundingClientRect().width;
    const seg = (w - 24) / 3;
    if (blob) blob.style.transform = 'translateX(' + (x - 64) + 'px)';
    pill.querySelectorAll('.it').forEach(function (b, i) {
      const d = Math.abs(12 + seg * (i + 0.5) - x);
      b.style.transform = 'scale(' + (1 + 0.08 * Math.exp(-(d * d) / 1800)).toFixed(4) + ')';
    });
  };
  const clear = function () {
    if (blob) { blob.remove(); blob = null; }
    pill.querySelectorAll('.it').forEach(function (b) { b.style.transform = ''; });
  };
  pill.addEventListener('pointerdown', function (e) {
    clear();
    blob = document.createElement('span');
    blob.className = 'dockblob';
    pill.appendChild(blob);
    paint(e.clientX - pill.getBoundingClientRect().left);
  });
  pill.addEventListener('pointermove', function (e) {
    if (blob) paint(e.clientX - pill.getBoundingClientRect().left);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { pill.addEventListener(ev, clear); });
}

/* ── 外壳高度同步（固定式底栏的关键，2026-10-14 改）──
   手机浏览器**自己的底部工具栏**会盖住视口底部。旧做法是 dock 用 position:fixed，再用
   visualViewport 量出被盖高度去「把它抬上来」—— 但 iOS Safari 上 fixed 底栏本身就会被压到
   工具栏后面，抬多少都不稳（用户实测：往下拖动时 dock 和浏览器 dock 重叠）。
   新做法：dock 贴在外壳 #app 底部（CSS 已改成 absolute），只要**外壳高度 = 可见高度**，
   浏览器工具栏就永远压不到它。
   ★依据★：visualViewport.height = 浏览器 UI 之外真正看得见的高度；
            100vh = 大视口（含被工具栏盖住的区域，历史坑）；100dvh 已按当前 UI 状态取值。 */
function syncShellH() {
  const app = document.getElementById('app');
  if (!app) return;
  const vv = window.visualViewport;
  let h = window.innerHeight;
  /* 双指缩放时不跟（否则外壳会跟着缩放比例乱缩），只在 scale≈1 时采信可视高度 */
  if (vv && Math.abs((vv.scale || 1) - 1) < 0.01) h = vv.height;
  if (!(h > 0)) return;
  /* 只写一个来源：--app_h。外壳 #app 与遮罩/弹层（.mask）都用它 */
  document.documentElement.style.setProperty('--app_h', Math.round(h) + 'px');
}
window.addEventListener('resize', syncShellH);
window.addEventListener('orientationchange', syncShellH);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', syncShellH);
  window.visualViewport.addEventListener('scroll', syncShellH);
}
syncShellH();

/* ══════════ 渲染 ══════════ */
const BINDER = { manual: 'bindManual', detail: 'bindDetail', edit: 'bindEdit', cats: 'bindCats', trash: 'bindTrash', import: 'bindImport', addkey: 'bindAddKey', qdetail: 'bindQDetail', vguide: 'bindVGuide', calc: 'bindCalc', compare: 'bindCompare', profile: 'bindProfile' };
function render() {
  /* boot 的数据 fetch 未完成时不渲染（hashchange 可能早于 boot 触发，见 ERR: I18N is not defined） */
  if (!S.ready) return;
  const r = parseHash();
  S.page = r.main; S.sub = r.sub; S.arg = r.arg ? decodeURIComponent(r.arg) : '';
  // App 路由口径：二级页是 push 进来的全屏页，盖住底部 Dock（网页同步隐藏）
  document.body.classList.toggle('insub', !!S.sub);
  // App aboutToAppear / onTabSwitched 口径：进入比价页一律全折叠，展开态不跨页保留
  if (S.page === 'price' && S._lastPage !== 'price') S.open = {};
  S._lastPage = S.page;
  buildChrome();
  const c = document.getElementById('content');
  if (S.sub && window.SCREENS && SCREENS[S.sub]) c.innerHTML = SCREENS[S.sub]();
  else c.innerHTML = ({ library: viewLibrary, quota: viewQuota, price: viewPrice, mine: viewMine })[S.page]();
  const b = BINDER[S.sub] || ({ library: 'bindLibrary', price: 'bindPrice', quota: 'bindQuota', mine: 'bindMine' })[S.page];
  if (b && window[b]) window[b]();
  /* 内容区是内滚容器（文档本身不滚），换页要把滚动位归零 */
  c.scrollTop = 0;
}

/* ══════════ 库 ══════════ */
function selfPrompts() { return store.get(LS.prompts, []); }
/* 被删除的内置条目（App：DB 行置 deletedAt，库页不再出现、回收站可恢复） */
function hiddenBuilt() { return store.get(LS.hidden, []); }
function allPrompts() {
  const hidden = hiddenBuilt();
  const built = (DATA.builtinPrompts || []).filter(function (b) { return hidden.indexOf(b.id) < 0; })
    .map(function (b) {
      return Object.assign({}, b, { builtin: true, id: b.id || ('b_' + b.title) });
    });
  return built.concat(selfPrompts());
}
function libCats() {
  const counts = {};
  allPrompts().forEach(function (p) { const c = p.category || ''; if (c) counts[c] = (counts[c] || 0) + 1; });
  const custom = store.get(LS.cats, []);
  const auto = Object.keys(counts).filter(c => custom.indexOf(c) < 0);
  // App loadCats：「全部」+「内置精选」+ 题材分类 + 分类表其余；空分类不出现
  const all = ['__builtin__'].concat(custom.concat(auto).filter(function (c) { return counts[c] > 0 || custom.indexOf(c) >= 0; }));
  return { all: all, counts: counts };
}
function expandQuery(kw) {
  const terms = [kw];
  (EXTRA.synonymGroups || []).forEach(function (grp) {
    const hit = grp.some(function (w) { return kw.indexOf(w) >= 0 || w.indexOf(kw) >= 0; });
    if (hit) grp.forEach(function (w) { if (terms.indexOf(w) < 0) terms.push(w); });
  });
  return terms;
}
/* ── 题材文案（App I18n.realCatLabel / catLabel / TimeUtil.daysAgoIn 逐条对齐） ── */
const BUILTIN_CAT_MAP = [
  '科研论文', 'lib.cat.research', 'AI 前沿', 'lib.cat.ai', '工程效率', 'lib.cat.eng',
  '写作', 'lib.cat.write', '翻译', 'lib.cat.translate', '改代码', 'lib.cat.code',
  '职场', 'lib.cat.work', '写论文', 'lib.cat.paper', '学习', 'lib.cat.study', '生活', 'lib.cat.life', '数据分析', 'lib.cat.data'
];
function catLabel(name) {
  if (!name || name === '未分类') return t('cat.none');
  if (name === '内置精选') return t('lib.cat.builtinCat');
  for (let i = 0; i < BUILTIN_CAT_MAP.length; i += 2) {
    if (name === BUILTIN_CAT_MAP[i]) return t(BUILTIN_CAT_MAP[i + 1]);
  }
  return name;
}
/* App realCatLabel：内置条目的 DB 分类是集合名，真实题材在 tags 里 */
function realCatLabel(p) {
  if (p.builtin) {
    const tags = p.tags || [];
    for (let ti = 0; ti < tags.length; ti++) {
      for (let i = 0; i < BUILTIN_CAT_MAP.length; i += 2) {
        if (tags[ti] === BUILTIN_CAT_MAP[i]) return t(BUILTIN_CAT_MAP[i + 1]);
      }
    }
    return t('lib.cat.builtinCat');
  }
  return catLabel(p.category || '');
}
/* App PromptCard.srcShort：内置条目来源短标签（srcLabel 优先，否则截 source 末段） */
function srcShort(p) {
  if (!p.builtin) return '';
  if (p.srcLabel) return p.srcLabel;
  if (!p.source) return '';
  const i = p.source.lastIndexOf('·');
  return i >= 0 ? p.source.substring(i + 1).trim() : p.source;
}
function daysAgoIn(ts) {
  if (!ts || ts <= 0) return t('time.unused');
  const days = Math.floor((Date.now() - ts) / 864e5);
  if (days <= 0) {
    const hours = Math.floor((Date.now() - ts) / 36e5);
    if (hours <= 0) return t('time.now');
    return t('time.hoursAgo', hours);
  }
  return t('time.daysAgo', days);
}
/* 库页额度行文案（App LibraryPage.quotaText：免费给分母 / 试用、已购写"不限"；满额 warn + 升级胶囊） */
function libQuota(selfCount, built) {
  const st = proStatus();
  const full = st === 0 && selfCount >= LIMIT_PROMPT;
  let txt = t('lib.quota.builtin', built) + ' · ';
  if (!PAYWALL_ENABLED) txt = t('lib.quota.builtinFree', built) + ' · ' + t('lib.quota.self', selfCount);
  else if (st === 2) txt += t('lib.quota.self', selfCount) + ' · ' + t('lib.quota.pro');
  else if (st === 1) txt += t('lib.quota.self', selfCount) + ' · ' + t('lib.quota.trial');
  else if (full) txt += t('lib.quota.selfFull', selfCount, LIMIT_PROMPT);
  /* App 2026-10-18：离上限还远时只写条数，接近上限（≥ QUOTA_SHOW_AT）才亮出分母 */
  else if (selfCount < LIB_QUOTA_SHOW_AT) txt += t('lib.quota.self', selfCount);
  else txt += t('lib.quota.selfOf', selfCount, LIMIT_PROMPT);
  return { txt: txt, full: full };
}
function viewLibrary() {
  const self = selfPrompts();
  const built = (DATA.builtinPrompts || []).length;
  const q = libQuota(self.length, built);
  const trashCount = store.get(LS.trash, []).length;
  return `<div class="libwrap">
    <div class="libhead">
      <div class="libtop">
        <h2>${esc(t('tab.library'))}</h2>
        <span class="ltools">
          <button class="lchip" id="goTrash">${IC.trashL()}${trashCount ? `<i class="badge">${trashCount > 99 ? '99+' : trashCount}</i>` : ''}</button>
          <button class="lchip ${S.favOnly ? 'on' : ''}" id="favOnly">${IC.star(S.favOnly)}<span>${esc(t('lib.fav'))}</span></button>
        </span>
      </div>
      <div class="libquota ${q.full ? 'full' : ''}"><span>${esc(q.txt)}</span>${q.full ? `<button class="upgrade" id="goPro">${esc(t('lib.pro.upgrade'))}</button>` : ''}</div>
      <div class="search lib-search">${IC.searchL()}<input type="search" id="q" value="${esc(S.q)}" placeholder="${esc(t('lib.search'))}">
        ${S.q ? `<span class="clear" id="qc">${IC.close()}</span>` : ''}</div>
    </div>
    <div class="catrow"><span class="catinner" id="cats"></span><span class="cathint">${esc(t('lib.cat.hint'))}</span></div>
    <div class="page libpage"><div id="list" class="plist"></div></div>
  </div>`;
}
/* App LibraryPage.listTopRow（2026-10-18）：左 = 拖动提示（只在从未拖过且无筛选时）或「共 N 条」；
 * 右 = 类型小分段（库里有 Skill 才出现；已选中某类型时保留，避免筛选生效但控件消失） */
function libHasFilter() { return !!(S.cat || S.q || S.favOnly || S.libType !== 'all'); }
function libTopRow(n) {
  const skillCount = allPrompts().filter(function (p) { return p.type === 'skill'; }).length;
  const hint = n > 1 && !libHasFilter() && store.get(LS.order, []).length === 0;
  const types = ['all', 'prompt', 'skill'];
  return `<div class="libtoprow">
    <span class="ltr-t">${esc(hint ? t('price.reorder.hint') : t('lib.count', n))}</span>
    ${(skillCount > 0 || S.libType !== 'all') ? `<span class="libtseg">
      <span class="slider" style="transform:translateX(${types.indexOf(S.libType) * 100}%)"></span>
      ${types.map(function (ty) { const ic = ty === 'skill' ? IC.zapW(10).replace('#FFFFFF', '#7B5CFF') : (ty === 'prompt' ? IC.promptW(10, '#0A59F7') : ''); return `<button data-type="${ty}" class="${S.libType === ty ? 'on' : ''}">${ic}${esc(t('lib.type.' + ty))}</button>`; }).join('')}
    </span>` : ''}
  </div>`;
}
function paintPrompts() {
  const chips = document.getElementById('cats');
  if (chips) {
    const c = libCats();
    // App categoryRow：「全部」+「内置精选」+ 题材分类 + 分类表其余；行尾挂长按管理提示
    const order = [''].concat(['__builtin__']).concat(c.all.filter(function (x) { return x !== '__builtin__'; }));
    const label = function (x) { return x === '__builtin__' ? t('lib.cat.builtinCat') : (x === '' ? t('lib.cat.all') : x); };
    const key = function (x) { return x === '__builtin__' ? '科研论文' : x; };
    chips.innerHTML = order.map(function (x) {
      const k = key(x);
      const on = S.cat === k || (x === '' && S.cat === '');
      return `<button class="cchip ${on ? 'on' : ''}" data-cat="${esc(k)}">${esc(label(x))}</button>`;
    }).join('');
    chips.querySelectorAll('[data-cat]').forEach(function (b) {
      b.onclick = function () { S.cat = b.dataset.cat === '' ? '' : b.dataset.cat; paintPrompts(); };
    });
  }
  const box = document.getElementById('list');
  if (!box) return;
  let list = allPrompts();
  if (S.cat === '科研论文') list = list.filter(function (p) { return p.builtin || (p.category || '') === '科研论文'; });
  else if (S.cat) list = list.filter(function (p) { return (p.category || '') === S.cat; });
  if (S.libType !== 'all') list = list.filter(function (p) { return (p.type || 'prompt') === S.libType; });
  if (S.favOnly) list = list.filter(function (p) { return p.fav; });
  if (S.q) {
    const terms = expandQuery(S.q.trim().toLowerCase());
    list = list.filter(function (p) {
      const hay = (p.title + ' ' + p.content + ' ' + (p.tags || []).join(' ') + ' ' + (p.category || '')).toLowerCase();
      return terms.some(function (w) { return hay.indexOf(w) >= 0; });
    });
  }
  const order = store.get(LS.order, []);
  list.sort(function (a, b) {
    const fa = a.fav ? 0 : 1, fb = b.fav ? 0 : 1;
    if (fa !== fb) return fa - fb;
    const oa = order.indexOf(a.id), ob = order.indexOf(b.id);
    if (oa >= 0 && ob >= 0) return oa - ob;
    return (b.lastUsed || b.createdAt || 0) - (a.lastUsed || a.createdAt || 0);
  });
  if (!list.length) {
    // App 空态三态：收藏空 / 有筛选无结果 / 无数据
    const k = S.favOnly ? 'lib.fav.empty' : (S.q || S.cat || S.libType !== 'all' ? 'lib.empty.filtered' : 'lib.empty.none');
    box.innerHTML = `<div class="empty"><div class="e1">${esc(t(k))}</div>
      <div class="e2">${esc(t(k + '.sub'))}</div></div>`;
    return;
  }
  box.innerHTML = libTopRow(list.length) + list.map(promptCard).join('');
  bindCardDrag(box);
  box.querySelectorAll('.libtseg button').forEach(function (b) {
    b.onclick = function () { S.libType = b.dataset.type; paintPrompts(); };
  });
  box.querySelectorAll('[data-fav]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); favToggle(b.dataset.fav); }; });
  box.querySelectorAll('[data-open]').forEach(function (b) { b.onclick = function () { goHash('library/detail/' + encodeURIComponent(b.dataset.open)); }; });
}
/* Prompt 卡（App PromptCard：徽章 38 渐变 / 标题 16 Bold / 摘要 12 两行 / meta 11 / 变量行 10）
   ★App 卡片只有「星标 + 点开详情」两个交互，没有编辑/删除按钮（删除只在详情页）★ */
function previewOf(content) {
  const out = [];
  const lines = String(content || '').split('\n');
  for (let i = 0; i < lines.length && out.length < 6; i++) {
    const tt = lines[i].trim();
    if (tt.length === 0 || /^#{1,6}(\s|$)/.test(tt) || /^[-=*_]{3,}$/.test(tt)) continue;
    out.push(tt.replace(/^([-*+>]|\d+[.)、])\s+/, '').replace(/\*\*/g, ''));
  }
  return out.length > 0 ? out.join(' ') : String(content || '');
}
function promptCard(p) {
  const isSkill = p.type === 'skill';
  const fav = !!p.fav;
  const vars = parseVars(p.content || '');
  const metaLeft = realCatLabel(p) + (p.targetModel && p.targetModel !== '通用' ? ' · ' + p.targetModel : '');
  const metaRight = p.builtin
    ? (srcShort(p) ? `<span class="psrc">${esc(srcShort(p))}</span>` : '')
    : `<span class="pused">${esc(t('lib.used', p.useCount || 0))} · ${esc(daysAgoIn(p.lastUsedAt))}</span>`;
  return `<div class="pcard" draggable="true" data-id="${esc(p.id)}" data-open="${esc(p.id)}">
    <div class="prow">
      <span class="pbadge ${isSkill ? 'skill' : ''}">${isSkill ? IC.zapW() : IC.promptW()}</span>
      <div class="ptxt">
        <div class="ptitle">${esc(p.title)}</div>
        ${p.content ? `<div class="pabs">${esc(previewOf(p.content).slice(0, 90))}</div>` : ''}
      </div>
      <button class="pstar" data-fav="${esc(p.id)}">${IC.star(fav)}</button>
    </div>
    <div class="pmeta2"><span class="pml">${esc(metaLeft)}</span>${metaRight}</div>
    ${vars.length ? `<div class="pvars"><span class="pvl">${esc(t('lib.vars'))}</span>${vars.map(function (v) { return `<span class="pvc">${esc(v)}</span>`; }).join('')}</div>` : ''}
  </div>`;
}
/* 变量提取（App VarParser.extract：{{变量名}}，按出现顺序去重） */
function parseVars(s) {
  const out = [];
  const re = /\{\{([^{}]+)\}\}/g;
  let m;
  while ((m = re.exec(String(s || ''))) !== null) {
    const v = m[1].trim();
    if (v && out.indexOf(v) < 0) out.push(v);
  }
  return out;
}
/* 变量渲染（App VarParser.render：未填写的变量保持 {{原名}} 原样） */
function renderVars(content, values) {
  return String(content || '').replace(/\{\{([^{}]+)\}\}/g, function (sub, name) {
    const val = values[name.trim()];
    return (val !== undefined && val !== null && String(val).length > 0) ? val : sub;
  });
}
function bindCardDrag(box) {
  let dragId = null;
  box.querySelectorAll('.pcard').forEach(function (el) {
    el.ondragstart = function () { dragId = el.dataset.id; };
    el.ondragenter = function () {
      if (!dragId || dragId === el.dataset.id) return;
      const ids = currentOrderIds();
      const from = ids.indexOf(dragId), to = ids.indexOf(el.dataset.id);
      if (from < 0 || to < 0) return;
      ids.splice(to, 0, ids.splice(from, 1)[0]);
      store.set(LS.order, ids);
      dragId = null;
      paintPrompts();
    };
    el.ondragover = function (e) { e.preventDefault(); };
    el.ondragend = function () { dragId = null; };
  });
}
function currentOrderIds() {
  const o = store.get(LS.order, []);
  const all = allPrompts().map(function (p) { return p.id; });
  return o.concat(all.filter(function (id) { return o.indexOf(id) < 0; }));
}
function favToggle(id) {
  const mine = selfPrompts();
  const p = mine.filter(function (x) { return x.id === id; })[0];
  if (!p) return;
  p.fav = !p.fav;
  store.set(LS.prompts, mine);
  paintPrompts();
}
function delPrompt(id) {
  const mine = selfPrompts();
  const p = mine.filter(function (x) { return x.id === id; })[0];
  if (p) {
    p.deletedAt = Date.now();
    const trash = store.get(LS.trash, []);
    trash.unshift(p);
    store.set(LS.trash, trash);
    store.set(LS.prompts, mine.filter(function (x) { return x.id !== id; }));
  } else {
    /* 内置条目：App 同样移入回收站（repo.remove → deletedAt）；web 复刻为「隐藏 + 入回收站」 */
    const b = (DATA.builtinPrompts || []).filter(function (x) { return x.id === id; })[0];
    if (!b) return;
    const hidden = hiddenBuilt();
    if (hidden.indexOf(id) < 0) hidden.push(id);
    store.set(LS.hidden, hidden);
    const trash = store.get(LS.trash, []);
    trash.unshift(Object.assign({}, b, { builtin: true, deletedAt: Date.now() }));
    store.set(LS.trash, trash);
  }
  toast(t('trash.moved'));
  paintPrompts();
}
function bindLibrary() {
  const q = document.getElementById('q');
  if (q) q.oninput = function () { S.q = q.value; paintPrompts(); };
  const qc = document.getElementById('qc');
  if (qc) qc.onclick = function () { S.q = ''; render(); };
  const fav = document.getElementById('favOnly');
  if (fav) fav.onclick = function () { S.favOnly = !S.favOnly; render(); };
  const gp = document.getElementById('goPro'); if (gp) gp.onclick = function () { goHash('mine'); setTimeout(openPlans, 60); };
  const gt = document.getElementById('goTrash'); if (gt) gt.onclick = function () { goHash('library/trash'); };
  const gi = document.getElementById('goImport'); if (gi) gi.onclick = function () { goHash('library/import'); };
  // App categoryRow 长按 → 分类管理页
  const cr = document.querySelector('.catrow');
  if (cr) {
    let timer = null;
    cr.addEventListener('touchstart', function () { timer = setTimeout(function () { goHash('library/cats'); }, 550); }, { passive: true });
    cr.addEventListener('touchend', function () { clearTimeout(timer); });
    cr.addEventListener('mousedown', function () { timer = setTimeout(function () { goHash('library/cats'); }, 550); });
    document.addEventListener('mouseup', function () { clearTimeout(timer); });
  }
  paintPrompts();
}

/* ══════════ 分享码（与 app ShareCode 互通：izy://p/ + base64url(JSON)） ══════════ */
function b64urlEncode(str) {
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s) {
  let b = s.replace(/-/g, '+').replace(/_/g, '/');
  while (b.length % 4) b += '=';
  return decodeURIComponent(escape(atob(b)));
}
function packCode(p) {
  const o = { v: 1, t: p.title, c: p.content, y: p.type === 'skill' ? 'skill' : 'prompt', g: p.tags, m: p.targetModel, n: p.note, k: p.category };
  try { return 'izy://p/' + b64urlEncode(JSON.stringify(o)); } catch (e) { return ''; }
}
function unpackCode(text) {
  const pre = 'izy://p/';
  const i = String(text || '').indexOf(pre);
  if (i < 0) return null;
  let j = i + pre.length;
  while (j < text.length && /[A-Za-z0-9\-_]/.test(text.charAt(j))) j++;
  try {
    const o = JSON.parse(b64urlDecode(text.slice(i + pre.length, j)));
    return { title: o.t || '', content: o.c || '', type: o.y === 'skill' ? 'skill' : 'prompt', tags: o.g || [], targetModel: o.m || '', note: o.n || '', category: o.k || '' };
  } catch (e) { return null; }
}

/* ══════════ 比价 ══════════ */
function aliasOf(v) { return (EXTRA.vendorAlias || {})[v] || ''; }
function hitApi(g, q) {
  if (!q) return true;
  const hay = (g.vendor + ' ' + aliasOf(g.vendor)).toLowerCase();
  if (hay.indexOf(q) >= 0) return true;
  return (g.models || []).some(function (m) {
    return (m.id + ' ' + m.name + ' ' + g.vendor).toLowerCase().indexOf(q) >= 0;
  });
}
function hitSub(s, q) {
  if (!q) return true;
  const hay = (s.product + ' ' + s.vendor + ' ' + (s.company || '') + ' ' + (s.engine || '') + ' ' + aliasOf(s.vendor) + ' ' + aliasOf(s.product)).toLowerCase();
  return hay.indexOf(q) >= 0;
}
function viewPrice() {
  return coverHTML(t('price.title'), t('price.sub')) + `<div class="page">
    ${calcCard()}
    <div class="segbox">
      <div class="seg ${S.priceTab === 'sub' ? 'tab2' : ''}">
        <span class="slider"></span>
        <button data-tab="api" class="${S.priceTab === 'api' ? 'on' : ''}">${esc(t('price.tab.api'))}</button>
        <button data-tab="sub" class="${S.priceTab === 'sub' ? 'on' : ''}">${esc(t('price.tab.sub'))}</button>
      </div>
    </div>
    <div class="search">${IC.search()}<input type="search" id="q" value="${esc(S.q)}" placeholder="${esc(t('price.search.hint'))}">
      ${S.q ? `<span class="clear" id="qc">${IC.close()}</span>` : ''}</div>
    ${S.priceTab === 'api' ? cmpEntry() : ''}
    <div id="list"></div>
    ${S.cmpOn ? cmpBar() : ''}
  </div>`;
}
/* 横向对比入口（App compareEntry：与搜索框同款操作卡，40 高 / 圆角 20） */
function cmpEntry() {
  const on = S.cmpOn;
  return `<button class="cmpentry ${on ? 'on' : ''}" id="cmpToggle">
    <span class="ce-ic">${on ? IC.checkW() : IC.plus()}</span>
    <span class="ce-t">${esc(on ? t('cmp.pick', S.cmpIds.length) : t('cmp.entry'))}</span>
    ${on ? `<span class="ce-exit" id="cmpExit">${esc(t('cmp.exit'))}</span>`
      : `<span class="ce-tip">${esc(t('cmp.tip'))}</span>${IC.chevR()}`}</button>`;
}
/* 排序提示条（App sortHint：26 高 / 11 号 / 常态 text_ter） */
function sortHint() {
  return `<div class="sorthint">${esc(t('price.sort.entry'))}</div>`;
}
function calcCard() {
  return `<button class="calc" onclick="goHash('price/calc')">
    <span style="min-width:0"><b>${esc(t('price.calc.title'))}</b><span class="s">${esc(t('price.calc.sub'))}</span></span>
    <em>${esc(t('price.calc.cta'))}</em></button>`;
}
function cmpBar() {
  const ids = S.cmpIds;
  return `<div class="cmpbar">
    <div class="chips small">${ids.map(function (id) { return `<span class="chip on">${esc(modelNameOf(id))}<i data-un="${esc(id)}">✕</i></span>`; }).join('')}${ids.length ? '' : `<span class="hint">${esc(t('cmp.pick', 0))}</span>`}</div>
    <button class="btn primary ${ids.length >= 2 ? '' : 'off'}" id="cmpGo">${esc(t('cmp.start', ids.length))}</button></div>`;
}
function modelNameOf(id) {
  const m = (DATA.apiPrices || []).filter(function (x) { return x.id === id; })[0];
  return m ? (m.name || m.id) : id;
}
function apiGroups() {
  const map = {};
  (DATA.apiPrices || []).forEach(function (m) {
    const v = m.vendor;
    if (!map[v]) map[v] = { vendor: v, models: [] };
    map[v].models.push(m);
  });
  return (DATA.vendorOrder || []).map(function (o) { return map[o.vendor]; }).filter(Boolean);
}
function regionOf(vendor) {
  const o = (DATA.vendorOrder || []).filter(function (x) { return x.vendor === vendor; })[0];
  return o && o.region === 'cn';
}
/* App PricingPage.priceRange（2026-10-18）：最便宜那一款（按 输入+输出 之和取）的「¥入 / ¥出」，两个数来自同一款模型 */
function priceRange(models) {
  let best = null;
  models.forEach(function (m) {
    if (best === null || Number(m.priceIn) + Number(m.priceOut) < Number(best.priceIn) + Number(best.priceOut)) best = m;
  });
  return best === null ? '' : '¥' + best.priceIn + ' / ¥' + best.priceOut;
}
/* 模型行（App familyCard 展开区：name 14 Medium / caps·ctx 10 / ¥in / ¥out 13 Bold + price.io 10 / note 10） */
function cardModel(m, mi) {
  const followed = (store.get(LS.follow, [])).indexOf(m.id) >= 0;
  const checked = S.cmpIds.indexOf(m.id) >= 0;
  const ctx = Number(m.contextK || 0);
  const ctxTxt = ctx >= 1000 ? (ctx / 1000) + 'M' : ctx + 'K';
  const caps = (m.caps || []).map(capLabel).join('/');
  const price = Number(m.priceOut) > 0
    ? `<div class="p1">¥${m.priceIn} / ¥${m.priceOut}</div><div class="p2">${esc(t('price.io'))}</div>`
    : `<div class="p1">${esc(t('price.byUsage'))}</div>`;
  return `${mi > 0 ? '<div class="msep"></div>' : ''}<div class="mrow">
    <div class="mtxt">
      <div class="mname">${esc(m.name || m.id)}</div>
      <div class="mmeta">${esc(caps || t('price.caps.text'))} · ${esc(t('price.ctx', ctxTxt))}</div>
    </div>
    <div class="mprice">${price}</div>
    ${S.cmpOn ? `<span class="pick ${checked ? 'on' : ''}" data-pick="${esc(m.id)}">${checked ? IC.check() : ''}</span>`
      : `<button class="pstar small" data-follow="${esc(m.id)}">${IC.star(followed)}</button>`}
  </div>
  ${m.note ? `<div class="mnote">${esc(m.note)}</div>` : ''}`;
}
/* 订阅卡（App subCard：product 15 / regionPill / company·engine · N 档 / 档位蓝底卡） */
function cardSub(s) {
  const tiers = (s.tiers || []).map(function (tr) {
    return `<div class="tier">
      <div class="trow"><span class="tname">${esc(tr.name)}</span>
        <span class="tprice">${esc(tr.month || '—')}${tr.year ? `<em>${esc(tr.year)}</em>` : ''}</span></div>
      <div class="tben">${esc(tr.benefits || '')}</div>
    </div>`;
  }).join('');
  const cn = s.cnAvailable === '直连';
  return `<div class="card vcard" draggable="true" data-v="${esc(s.vendor)}">
    <div class="vhead" data-v="${esc(s.vendor)}">
      ${brandMark(s.vendor, 38)}
      <div style="flex:1;min-width:0">
        <div class="vname"><span class="vt">${esc(s.product)}</span><span class="region ${cn ? 'cn' : 'gl'}">${esc(t(cn ? 'price.region.cn' : 'price.region.global'))}</span></div>
        <div class="vmeta">${esc(s.company || s.vendor)}${s.engine ? ' · ' + esc(s.engine) : ''} · ${esc(t('price.tier', (s.tiers || []).length))}</div>
      </div>
      <span class="chev ${S.open[s.vendor] ? 'open' : ''}">${IC.chevD()}</span>
    </div>
    <div class="tiers ${S.open[s.vendor] ? '' : 'hide'}">${tiers}</div>
  </div>`;
}
function paintList() {
  const q = S.q.trim().toLowerCase();
  const box = document.getElementById('list');
  if (S.priceTab === 'api') {
    const groups = apiGroups().filter(function (g) { return hitApi(g, q); });
    if (!groups.length) { box.innerHTML = `<div class="empty"><div class="e1">${esc(t('price.search.empty'))}</div></div>`; return; }
    box.innerHTML = (S.cmpOn ? '' : sortHint()) + groups.map(function (g) {
      const low = priceRange(g.models);
      const net = regionOf(g.vendor);
      return `<div class="card vcard" draggable="true" data-v="${esc(g.vendor)}">
        <div class="vhead" data-v="${esc(g.vendor)}">
          ${brandMark(g.vendor, 38)}
          <div style="flex:1;min-width:0">
            <div class="vname"><span class="vt">${esc(g.vendor)}</span><span class="region ${net ? 'cn' : 'gl'}">${esc(t(net ? 'price.region.cn' : 'price.region.global'))}</span></div>
            <div class="vmeta">${esc(t('price.versions', g.models.length, low))}</div>
          </div>
          <span class="chev ${S.open[g.vendor] ? 'open' : ''}">${IC.chevD()}</span>
        </div>
        <div class="models ${S.open[g.vendor] ? '' : 'hide'}">${g.models.map(cardModel).join('')}</div>
      </div>`;
    }).join('');
    box.querySelectorAll('.vhead').forEach(function (h) {
      h.onclick = function () {
        const v = h.dataset.v;
        S.open[v] = !S.open[v];
        const card = h.closest('.card');
        // 展开内容整容器切换（含分隔线与 note），chevron 同步翻转
        const ms = card.querySelector('.models');
        if (ms) ms.classList.toggle('hide', !S.open[v]);
        const ch = card.querySelector('.chev');
        if (ch) ch.classList.toggle('open', !!S.open[v]);
      };
    });
    box.querySelectorAll('.card[data-v]').forEach(function (c) {
      const ms = c.querySelector('.models');
      if (ms) ms.classList.toggle('hide', !S.open[c.dataset.v]);
      const ch = c.querySelector('.chev');
      if (ch) ch.classList.toggle('open', !!S.open[c.dataset.v]);
    });
    box.querySelectorAll('[data-follow]').forEach(function (b) { b.onclick = function () { toggleFollow(b.dataset.follow); }; });
    box.querySelectorAll('[data-pick]').forEach(function (b) { b.onclick = function () { togglePick(b.dataset.pick); }; });
    bindGroupDrag(box);
  } else {
    const subs = (DATA.subscriptions || []).filter(function (s) { return hitSub(s, q); });
    if (!subs.length) { box.innerHTML = `<div class="empty"><div class="e1">${esc(t('price.search.empty'))}</div></div>`; return; }
    box.innerHTML = sortHint() + subs.map(cardSub).join('');
    box.querySelectorAll('.vhead').forEach(function (h) {
      h.onclick = function () {
        const v = h.dataset.v;
        S.open[v] = !S.open[v];
        const card = h.closest('.card');
        const ts = card.querySelector('.tiers');
        if (ts) ts.classList.toggle('hide', !S.open[v]);
        const ch = card.querySelector('.chev');
        if (ch) ch.classList.toggle('open', !!S.open[v]);
      };
    });
    box.querySelectorAll('.card[data-v]').forEach(function (c) {
      const ts = c.querySelector('.tiers');
      if (ts) ts.classList.toggle('hide', !S.open[c.dataset.v]);
      const ch = c.querySelector('.chev');
      if (ch) ch.classList.toggle('open', !!S.open[c.dataset.v]);
    });
  }
}
function bindGroupDrag(box) {
  let drag = null;
  box.querySelectorAll('.card[draggable]').forEach(function (el) {
    el.ondragstart = function () { drag = el.dataset.v; };
    el.ondragenter = function () {
      if (!drag || drag === el.dataset.v) return;
      const names = (DATA.vendorOrder || []).map(function (x) { return x.vendor; });
      const io = names.indexOf(drag), it = names.indexOf(el.dataset.v);
      if (io < 0 || it < 0) return;
      DATA.vendorOrder.splice(it, 0, DATA.vendorOrder.splice(io, 1)[0]);
      drag = null;
      paintList();
    };
    el.ondragover = function (e) { e.preventDefault(); };
    el.ondragend = function () { drag = null; };
  });
}
function toggleFollow(id) {
  const list = store.get(LS.follow, []);
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1);
  else {
    if (!isPro() && list.length >= LIMIT_FOLLOW) return toast(t('price.follow.limit'));
    list.push(id);
  }
  store.set(LS.follow, list);
  paintList();
}
function togglePick(id) {
  const i = S.cmpIds.indexOf(id);
  if (i >= 0) S.cmpIds.splice(i, 1);
  else {
    if (S.cmpIds.length >= 4) return toast(t('cmp.max'));
    S.cmpIds.push(id);
  }
  render();
}
function bindPrice() {
  const q = document.getElementById('q');
  if (q) q.oninput = function () { S.q = q.value; S.open = {}; paintList(); };
  const qc = document.getElementById('qc');
  if (qc) qc.onclick = function () { S.q = ''; S.open = {}; render(); };
  document.querySelectorAll('.seg button[data-tab]').forEach(function (b) {
    b.onclick = function () { S.priceTab = b.dataset.tab; S.open = {}; render(); };
  });
  const ct = document.getElementById('cmpToggle');
  if (ct) ct.onclick = function (e) {
    if (e && e.target && e.target.closest && e.target.closest('#cmpExit')) return;
    if (S.cmpOn) return;
    S.cmpOn = true; S.cmpIds = []; render();
  };
  const ce = document.getElementById('cmpExit');
  if (ce) ce.onclick = function (e) { e.stopPropagation(); S.cmpOn = false; S.cmpIds = []; render(); };
  const cg = document.getElementById('cmpGo');
  if (cg) cg.onclick = function () {
    if (S.cmpIds.length < 2) return toast(t('cmp.need2'));
    goHash('price/compare/' + encodeURIComponent(S.cmpIds.join(',')));
  };
  document.querySelectorAll('[data-un]').forEach(function (i) {
    i.onclick = function (e) { e.stopPropagation(); togglePick(i.dataset.un); };
  });
  paintList();
}

/* ══════════ 额度 ══════════ */
const AUTO = {
  deepseek: { url: 'https://api.deepseek.com/user/balance', currency: 'CNY' },
  moonshot: { url: 'https://api.moonshot.cn/v1/users/me/balance', currency: 'CNY' },
  zhipu: { url: 'https://open.bigmodel.cn/api/paas/finance/balance', currency: 'CNY' }
};
/* 2026-10-18：余额由浏览器直连厂商（三家均已实测允许 CORS），Key 不再经过 izyAether 服务器。
 * 取值口径照抄 app adapter/Adapters.ets；返回 { ok, balance, currency, detail } */
function balNum(o, keys) {
  for (const k of keys) {
    const v = o && o[k];
    if (typeof v === 'number' && isFinite(v)) return v;
    if (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v))) return Number(v);
  }
  return null;
}
const BAL_PICK = {
  deepseek: function (o) {
    const infos = (o && o.balance_infos) || [];
    for (const i of infos) {
      if (i.currency === 'CNY' || i.currency === 'USD' || infos.length === 1) {
        const v = balNum(i, ['total_balance', 'balance']);
        if (v !== null) return v;
      }
    }
    return null;
  },
  moonshot: function (o) { const k = ['available_balance', 'balance', 'total_balance']; return balNum(o, k) ?? balNum(o && o.data, k); },
  zhipu: function (o) { const k = ['balance', 'total_balance', 'available_balance']; return balNum(o, k) ?? balNum(o && o.data, k); }
};
async function queryBalance(vendor, key) {
  const cfg = AUTO[vendor];
  if (!cfg) return { ok: false, detail: t('quota.err.unsupported') };
  let r, json = null;
  try {
    const ctl = new AbortController();
    const tm = setTimeout(function () { ctl.abort(); }, 12000);
    r = await fetch(cfg.url, { headers: { Authorization: 'Bearer ' + String(key || '').trim(), Accept: 'application/json' }, signal: ctl.signal });
    clearTimeout(tm);
  } catch (e) { return { ok: false, detail: t('addkey.netError') }; }
  try { json = await r.json(); } catch (e) { }
  if (r.status >= 400) {
    const msg = json && (json.error && (json.error.message || json.error.code) || json.message);
    return { ok: false, detail: String(msg || ('HTTP ' + r.status)).slice(0, 200) };
  }
  if (!json) return { ok: false, detail: t('quota.err.noBalanceField') };
  /* 智谱：HTTP 200 但业务错误码在 body 里 */
  const biz = typeof json.code === 'number' ? json.code : (typeof json.code === 'string' && /^\d+$/.test(json.code) ? Number(json.code) : null);
  if (json.success === false || (biz !== null && biz >= 400)) {
    return { ok: false, detail: String(json.msg || json.message || ('code ' + biz)).slice(0, 200) };
  }
  const v = BAL_PICK[vendor](json);
  if (v === null || v === undefined) return { ok: false, detail: t('quota.err.noBalanceField') };
  return { ok: true, balance: v, currency: cfg.currency, detail: '' };
}
function maskKey(k) {
  const s = String(k || '');
  if (s.length <= 8) return s.replace(/./g, '•');
  return s.slice(0, 4) + '••••' + s.slice(-4);
}
function monthUse(k) {
  /* 手动记账没有月消耗口径（App snapshot.monthCost=null）：不计入本月消耗 / 省钱账本 */
  if (k.manual) return 0;
  const hist = k.hist || [];
  const now = new Date(), y = now.getFullYear(), m = now.getMonth();
  const cur = hist.filter(function (h) { const d = new Date(h.t); return d.getFullYear() === y && d.getMonth() === m; });
  if (cur.length < 1) return 0;
  return Math.max(0, cur[0].bal - cur[cur.length - 1].bal);
}
function quotaStats() {
  const keys = store.get(LS.keys, []);
  let cny = 0, usd = 0, low = 0, fail = 0, use = 0, usdUse = 0;
  keys.forEach(function (k) {
    const b = (typeof k.bal === 'number') ? k.bal : null;
    if (b === null) { if (k.msg) fail++; return; }
    if (k.cur === 'USD') { usd += b; usdUse += monthUse(k); } else cny += b;
    if (b < 10) low++;
    use += monthUse(k);
  });
  return { cny: cny, usd: usd, low: low, fail: fail, use: use, usdUse: usdUse, count: keys.length };
}
/* brand 键 → 比价库显示名（Kimi/GLM/DeepSeek…） */
/* App SavingsService 用 VendorBrand.priceGroup(vendorId)；原先反查 BRAND.fromGroup 对 zhipu/moonshot 落空
 * （GLM→glm、Kimi→kimi），省钱账本永远无数据 → 改走同一张 PRICE_GROUP 表 */
function brandOf(vendorId) {
  return PRICE_GROUP[vendorId] || '';
}
/* 省钱账本（App SavingsService：actual=各 Key 本月消耗；sub=该厂商最低付费档；USD×7.2） */
function savingsData() {
  const keys = store.get(LS.keys, []);
  let paid = 0, sub = 0;
  const lines = [];
  keys.forEach(function (k) {
    if (typeof k.bal !== 'number') return;
    const mc = monthUse(k);
    if (!mc) return;
    const disp = brandOf(k.vendorId);
    const plans = (DATA.subscriptions || []).filter(function (s) { return s.vendor === disp; });
    if (!plans.length) return;
    let min = null;
    plans.forEach(function (s) {
      (s.tiers || []).forEach(function (t2) {
        const m = /([0-9]+(?:\.[0-9]+)?)/.exec(String(t2.month || ''));
        if (!m) return;
        let v = Number(m[1]);
        if (/\$/.test(t2.month)) v = v * 7.2;
        if (v > 0 && (min === null || v < min)) min = v;
      });
    });
    if (min === null) return;
    const actual = k.cur === 'USD' ? mc * 7.2 : mc;
    paid += actual; sub += min;
    lines.push({ name: disp, actual: actual, saved: min - actual });
  });
  lines.sort(function (a, b) { return b.saved - a.saved; });
  return { paid: paid, sub: sub, saved: sub - paid, lines: lines };
}
/* 金额缩写（App money：|n|>=10000 → 万 / 欧美 k；否则 toFixed(2)） */
function money(n) {
  const v = Number(n || 0);
  const en = S.lang === 'en-US' || S.lang === 'de-DE' || S.lang === 'es-ES' || S.lang === 'fr-FR' || S.lang === 'ru-RU';
  if (Math.abs(v) >= 10000) return en ? (v / 1000).toFixed(2) + 'k' : (v / 10000).toFixed(2) + '万';
  return v.toFixed(2);
}
function sym(cur) { return cur === 'USD' ? '$' : '¥'; }
function timeShort(ts) {
  if (!ts) return '-';
  const d = new Date(ts);
  const p = function (x) { return (x < 10 ? '0' : '') + x; };
  return (d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}
/* Key 卡进度百分比（App usedPercent 规则） */
function usedPercent(k) {
  if (typeof k.bal !== 'number' || typeof monthUse(k) !== 'number') return 0;
  const total = k.bal + monthUse(k);
  if (total <= 0) return 0;
  let p = monthUse(k) / total * 100;
  if (p < 2) p = 2;
  if (p > 100) p = 100;
  return Math.round(p);
}
/* App VendorBrand.priceGroup：额度厂商 id → 比价库分组名（逐条照抄，空串 = 不进比价库，如硅基流动） */
const PRICE_GROUP = {
  deepseek: 'DeepSeek', moonshot: 'Kimi', zhipu: 'GLM', glm: 'GLM', openai: 'GPT', anthropic: 'Claude', claude: 'Claude',
  doubao: '豆包', qwen: 'Qwen', aliyun: 'Qwen', ernie: 'ERNIE', hunyuan: '混元', minimax: 'MiniMax', spark: '星火',
  xinghuo: '星火', mimo: 'MiMo', stepfun: '阶跃星辰', sensetime: '商汤', baichuan: '百川', mistral: 'Mistral',
  cohere: 'Cohere', amazon: 'Amazon', nvidia: 'NVIDIA', perplexity: 'Perplexity', gemini: 'Gemini', grok: 'Grok', muse: 'Muse'
};
function keyCovers(vendorId) {
  // App QuotaPage.covers：该账户覆盖的模型名（priceGroup 分组命中即列）
  const g = PRICE_GROUP[vendorId] || '';
  const names = [];
  if (!g) return names;
  (DATA.apiPrices || []).forEach(function (m) { if (m.vendor === g) names.push(m.name); });
  return names;
}
/* App QuotaService.daysLeft：日均消耗 = 期间所有下降之和 / 跨度天数（充值上涨不计）；
 * < 2 条、跨度 < 1 天、没有下降 → -1 */
function manualDaysLeft(k) {
  const h = (k.hist || []).slice().sort(function (a, b) { return a.t - b.t; });
  if (h.length < 2 || typeof k.bal !== 'number') return -1;
  const spanDays = (h[h.length - 1].t - h[0].t) / DAY_MS;
  if (spanDays < 1) return -1;
  let used = 0;
  for (let i = 1; i < h.length; i++) if (h[i].bal < h[i - 1].bal) used += h[i - 1].bal - h[i].bal;
  if (used <= 0) return -1;
  return Math.floor(k.bal / (used / spanDays));
}
function viewQuota() {
  const st = quotaStats();
  const sv = savingsData();
  const alert = store.get(LS.alert, { on: true, th: 10 });
  const manual = DATA.manualVendors || [];
  const keys = store.get(LS.keys, []);
  const heroSub = st.count ? t('quota.hero.count', st.count) : t('quota.hero.empty');
  const empty = !st.count;
  return coverHTML(t('quota.title'), heroSub) + `<div class="page">
    ${empty ? `<div class="card qempty">
        <div class="qbadge"><i></i><i></i><b>￥</b></div>
        <div class="et1">${esc(t('quota.empty.title'))}</div>
        <div class="et2">${esc(t('quota.empty.sub'))}</div>
        <button class="btn primary qbtn" onclick="goHash('quota/addkey')">${esc(t('quota.add.first'))}</button>
      </div>` : `
      <div class="toolrow">
        <button class="qpill" id="rfAll">${IC.refresh()}${esc(t('common.refresh'))}</button>
        <button class="qpill" onclick="goHash('quota/addkey')">${IC.plusS()}${esc(t('common.add'))}</button>
      </div>
      <div class="card qcard sum">
        <div class="qsum">
          <div class="qcol">
            <div class="qlbl">${esc(t('quota.total'))}</div>
            <div class="qbig">¥${money(st.cny)}</div>
          </div>
          <span class="qsep"></span>
          <div class="qcol right">
            <div class="qlbl">${esc(t('quota.month'))}</div>
            <div class="qmid">¥${money(st.use)}</div>
          </div>
        </div>
        ${st.usd ? `<div class="qusd">${esc(t('quota.usd', '$' + money(st.usd), '$' + money(st.usdUse || 0)))}</div>` : ''}
        ${(st.low || st.fail) ? `<div class="qbadges">
          ${st.low ? `<span class="qblow">${esc(t('quota.low', st.low, 10))}</span>` : ''}
          ${st.fail ? `<span class="qfail">${esc(t('quota.failed', st.fail))}</span>` : ''}
        </div>` : ''}
      </div>`}
    <div class="card qcard">
      <div class="qstitle"><span>${esc(t('save.title'))}</span><i>${esc(t('save.sub'))}</i></div>
      ${sv.paid || sv.sub ? `<div class="qsave">
        <div class="qsv"><i>${esc(t('save.actual'))}</i><b>¥${money(sv.paid)}</b></div>
        <div class="qsv"><i>${esc(t('save.ifSub'))}</i><b class="sub">¥${money(sv.sub)}</b></div>
        <div class="qsv hl"><i>${esc(t('save.thisMonth'))}</i><b>¥${money(sv.saved)}</b></div>
      </div>` : `<div class="qhint">${esc(t('save.empty'))}</div>`}
      ${isPro() ? '' : `<div class="qpro" onclick="goHash('mine');setTimeout(openPlans,60)">
        <span>${esc(t('save.proOnly'))}</span><i>${esc(t('mine.pro.compare'))} ›</i></div>`}
      <div class="qfoot">${esc(t('save.foot'))}</div>
    </div>
    <div class="card qcard">
      <div class="qalert">
        <div class="qacol">
          <div class="qatitle">${esc(t('alert.title'))}</div>
          <div class="qasub">${esc(alert.on ? t('alert.on') : t('alert.off'))}</div>
        </div>
        <button class="qswitch ${alert.on ? 'on' : ''}" id="alOn" role="switch" aria-checked="${alert.on ? 'true' : 'false'}"><i></i></button>
      </div>
      ${alert.on ? `<div class="qth" id="qthRow">
        <span>${esc(t('alert.threshold'))}</span>
        <button class="qthv" id="alThBtn">¥${alert.th} ›</button>
      </div>
      <div class="qthmenu hide" id="thMenu">
        ${[5, 10, 50, 100].map(function (n) { return `<button data-th="${n}">¥${n}</button>`; }).join('')}
        <button data-th="custom">${esc(t('alert.custom'))}</button>
      </div>` : ''}
    </div>
    <div id="keys"></div>
    <button class="qadd" onclick="goHash('quota/addkey')"><span class="plus">＋</span>${esc(t('quota.add'))}</button>
    <div class="card qcard">
      <div class="qstitle" id="manualHead" style="cursor:pointer">
        <span>${esc(t('quota.manual'))}</span><i>${esc(t('quota.manual.sub', manual.length))}</i>
        <em id="manualTg">${esc(S.manualOpen ? t('common.collapse') : t('common.expand'))} ›</em>
      </div>
      <div class="qmanual ${S.manualOpen ? '' : 'hide'}">
        ${manual.map(function (v) {
    const note = (['doubao', 'qwen', 'aliyun', 'ernie'].indexOf(v.id) >= 0) ? t('quota.err.manualHint') : t('quota.err.noApi');
    return `<button class="qmrow" data-vid="${esc(v.id)}">
            ${brandMark(v.id, 32)}
            <span class="qmtxt"><b>${esc(v.name)}</b><i>${esc(note)}</i></span>
            <span class="qmgo">›</span>
          </button>`;
  }).join('')}
      </div>
    </div>
  </div>`;
}
function paintKeys() {
  const box = document.getElementById('keys');
  if (!box) return;
  const keys = store.get(LS.keys, []);
  const th = store.get(LS.alert, { on: true, th: 10 }).th;
  box.innerHTML = keys.map(function (k) {
    const bad = typeof k.bal !== 'number';
    const low = !bad && k.bal < th;
    const cur = k.cur || 'CNY';
    const st = bad ? (k.msg ? t('quota.st.fail') : t('quota.st.pending')) : null;
    const stLine = bad ? t('quota.cached', timeShort(k.ts)) : (low ? t('quota.st.low') : t('quota.st.ok'));
    const stCls = bad ? (k.msg ? 'warn' : 'ter') : (low ? 'warn' : 'ok');
    const covers = keyCovers(k.vendorId);
    const pct = k.manual ? 0 : usedPercent(k);
    const dl = k.manual ? manualDaysLeft(k) : -1;
    return `<div class="card qcard kcard" data-kid="${esc(k.id)}">
      <div class="krow">
        ${brandMark(k.vendorId, 42)}
        <div class="ktxt" onclick="goHash('quota/qdetail/${encodeURIComponent(k.id)}')">
          <div class="kname">${esc(k.manual ? (vendorLabel(k.vendorId) || k.vendorId) : (k.name || k.vendorId))}</div>
          <div class="kalias">${esc(k.alias || '默认')} · ${esc(k.manual ? t('manual.tag') : maskKey(k.key))}</div>
        </div>
        <div class="kstat ${bad ? (k.msg ? 'warn' : 'ter') : (low ? 'warn' : '')}">
          <b>${bad ? (st || '—') : sym(cur) + money(k.bal)}</b>
          <i class="${bad ? (k.msg ? 'warn' : 'ter') : stCls}">${stLine}</i>
        </div>
        <button class="kmore" data-more="${esc(k.id)}">⋯</button>
      </div>
      ${covers.length ? `<div class="kcovers">${esc(t(k.manual ? 'manual.covers' : 'quota.covers', covers.slice(0, 4).join(' · ') + (covers.length > 4 ? ' …' : '')))}</div>` : ''}
      ${(!bad && k.bal !== null) ? `<div class="kprog">
        <div class="progress"><i class="${low ? 'warn' : ''}" style="width:${pct}%"></i></div>
        <div class="kpline"><span>${esc(k.manual ? (dl >= 0 ? t('manual.daysLeft', dl) : t('manual.daysLeft.none')) : t('quota.monthUsed', pct))}</span><span>${esc(t('quota.updated', timeShort(k.ts)))}</span></div>
      </div>` : ''}
      ${bad && k.msg ? `<div class="kerr">${esc(k.msg)}</div>` : ''}
      <div class="kmenu hide" data-menu="${esc(k.id)}">
        ${k.manual ? `<button data-mupd="${esc(k.id)}">${esc(t('manual.menu'))}</button>`
      : `<button data-rf="${esc(k.id)}">${esc(t('quota.menu.refresh'))}</button>`}
        <button data-qd="${esc(k.id)}">${esc(t('quota.menu.detail'))}</button>
        <button data-kdel="${esc(k.id)}" class="del">${esc(t('quota.menu.delete'))}</button>
      </div>
    </div>`;
  }).join('');
  box.querySelectorAll('[data-more]').forEach(function (b) {
    b.onclick = function (e) {
      e.stopPropagation();
      const id = b.dataset.more;
      box.querySelectorAll('.kmenu').forEach(function (m) { if (m.dataset.menu !== id) m.classList.add('hide'); });
      const m = box.querySelector('.kmenu[data-menu="' + id + '"]');
      if (m) m.classList.toggle('hide');
    };
  });
  box.querySelectorAll('[data-rf]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); refreshOne(b.dataset.rf, b); }; });
  box.querySelectorAll('[data-mupd]').forEach(function (b) {
    b.onclick = function (e) { e.stopPropagation(); goHash('quota/manual/key/' + encodeURIComponent(b.dataset.mupd)); };
  });
  box.querySelectorAll('[data-qd]').forEach(function (b) { b.onclick = function () { goHash('quota/qdetail/' + encodeURIComponent(b.dataset.qd)); }; });
  box.querySelectorAll('[data-kdel]').forEach(function (b) {
    b.onclick = function (e) {
      e.stopPropagation();
      const id = b.dataset.kdel;
      const k = store.get(LS.keys, []).filter(function (x) { return x.id === id; })[0];
      if (!confirm(t(k && k.manual ? 'manual.del.title' : 'quota.del.title') + '\n' + t('quota.del.msg', (k && (k.name || k.vendorId)) || '', (k && k.alias) || ''))) return;
      store.set(LS.keys, store.get(LS.keys, []).filter(function (x) { return x.id !== id; }));
      render();
    };
  });
}
function bindQuota() {
  const rf = document.getElementById('rfAll');
  if (rf) rf.onclick = refreshAll;
  const on = document.getElementById('alOn');
  if (on) on.onclick = function () {
    const a = store.get(LS.alert, { on: true, th: 10 });
    a.on = !a.on;
    store.set(LS.alert, a);
    render();
  };
  const thBtn = document.getElementById('alThBtn');
  if (thBtn) thBtn.onclick = function () { document.getElementById('thMenu').classList.toggle('hide'); };
  document.querySelectorAll('[data-th]').forEach(function (b) {
    b.onclick = function () {
      const v = b.dataset.th;
      const a = store.get(LS.alert, { on: true, th: 10 });
      if (v === 'custom') {
        const raw = prompt(t('alert.custom.hint'), '');
        if (raw === null) return;
        const n = Number(raw);
        if (!n || n <= 0) { toast(t('alert.custom.bad')); return; }
        a.th = Math.min(99999, Math.round(n * 10) / 10);
      } else a.th = Number(v);
      store.set(LS.alert, a);
      render();
    };
  });
  const mh = document.getElementById('manualHead');
  if (mh) mh.onclick = function () { S.manualOpen = !S.manualOpen; render(); };
  document.querySelectorAll('[data-vid]').forEach(function (b) {
    b.onclick = function () { goHash('quota/vguide'); };
  });
  paintKeys();
}
async function refreshAll() {
  const keys = store.get(LS.keys, []);
  for (let i = 0; i < keys.length; i++) await refreshOne(keys[i].id, null, true);
  render();
}
async function refreshOne(id, btn, silent) {
  const keys = store.get(LS.keys, []);
  const k = keys.filter(function (x) { return x.id === id; })[0];
  if (!k) return;
  /* App QuotaService.refresh：手动记账没有接口可拉，原样保留用户记的余额（不能被「不支持」覆盖） */
  if (k.manual) return;
  if (btn) btn.disabled = true;
  try {
    const o = await queryBalance(k.vendorId, k.key);
    k.ts = Date.now();
    if (o && o.ok && typeof o.balance === 'number') {
      k.bal = o.balance; k.cur = o.currency || 'CNY'; k.msg = '';
      k.hist = (k.hist || []).concat([{ t: Date.now(), bal: k.bal }]).slice(-400);
    } else {
      k.bal = null;
      k.msg = (o && o.detail) || t('addkey.netError');
    }
  } catch (e) { k.ts = Date.now(); k.bal = null; k.msg = t('addkey.netError'); }
  store.set(LS.keys, keys);
  if (!silent) render(); else paintKeys();
}

/* ══════════ 我的 ══════════ */
function viewMine() {
  const p = store.get(LS.profile, {});
  /* 不设账号（与 App LOGIN_ENABLED=false 一致）：顶部始终是本地资料 */
  const logged = true;
  const nick = p.nick || t('mine.name.default');
  const sub2 = p.bio || t('mine.editProfile');
  /* App MinePage.extraLine：性别标签 · 年龄+岁 · 属地；填了哪项显示哪项，全空整行不出现 */
  const gv = p.gender === 'm' ? 'male' : p.gender === 'f' ? 'female' : p.gender === 's' ? 'secret' : p.gender;
  const genderTxt = (gv === 'male' || gv === 'female' || gv === 'secret') ? t('profile.gender.' + gv) : '';
  const extra = [genderTxt, p.age ? p.age + t('profile.age.unit') : '', p.region].filter(Boolean).join(' · ');
  const coverN = (p.coverCustom && p.coverImg) ? null : store.get(LS.cover, 1);
  return `<div class="minewrap">
    <div class="mcover" onclick="openCover()">
      <img src="${(p.coverCustom && p.coverImg) ? esc(p.coverImg) : 'assets/img/cover_' + (coverN || 1) + '.jpg'}" alt="">
      <span class="scrim"></span><span class="fade"></span>
    </div>
    <div class="prow2" id="profileRow">
      <span class="avatar"><img src="${esc(avatarSrc())}" alt=""></span>
      <div class="ptxt2">
        <div class="pname">${esc(logged ? nick : t('mine.login'))}</div>
        <div class="psub">${esc(logged ? sub2 : t('mine.login.hint'))}</div>
        ${extra ? `<div class="pextra">${esc(extra)}</div>` : ''}
      </div>
      <span class="pgo">${IC.chevR2()}</span>
    </div>
    <div class="page minepage">
      ${PAYWALL_ENABLED ? `<div class="card procard" onclick="openPlans()">
        <div class="pcol">
          <div class="ptitle2 ${proIsFree() ? '' : 'pro'}">${esc(proTitle())}</div>
          <div class="psub2">${esc(proSubText())}</div>
        </div>
        <span class="pvs ${proIsFree() ? 'free' : ''}">${esc(proIsFree() ? t('mine.pro.from', t('pro.plan.year.price')) : t('mine.pro.compare'))}${IC.chevR2()}</span>
      </div>` : ''}
      <div class="grouptitle">${esc(t('mine.pref'))}</div>
      <div class="card setcard">
        <div class="setrow" onclick="openCover()"><span>${esc(t('mine.cover'))}</span>
          <span class="val">${esc((p.coverCustom && p.coverImg) ? t('mine.cover.custom') : (coverN + ' / 6'))}</span>${IC.chevR2()}</div>
        <div class="rdiv"></div>
        <div class="setrow" onclick="openLang()"><span>${esc(t('mine.language'))}</span>
          <span class="val">${esc((LANGS.filter(function (x) { return x[0] === S.lang; })[0] || [])[1] || S.lang)}</span>${IC.chevR2()}</div>
        <div class="rdiv"></div>
        <div class="approw">
          <div class="apt">${esc(t('mine.appearance'))}</div>
          <div class="apchips">${[['system', t('mine.theme.system')], ['light', t('mine.theme.light')], ['dark', t('mine.theme.dark')]].map(function (x) {
            return `<button class="apchip ${store.get(LS.theme, 'light') === x[0] ? 'on' : ''}" data-theme="${x[0]}">${esc(x[1])}</button>`;
          }).join('')}</div>
        </div>
      </div>
      <div class="grouptitle">${esc(t('mine.data'))}</div>
      <div class="card setcard">
        <div class="drow" id="doExport"><span class="dcol"><b>${esc(t('mine.export'))}</b><i>${esc(t('mine.export.sub'))}</i></span>${IC.chevR2()}</div>
        <div class="rdiv"></div>
        <div class="drow" id="doImport"><span class="dcol"><b>${esc(t('mine.import'))}</b><i>${esc(t('mine.import.hint'))}</i></span>${IC.chevR2()}</div>
        <div class="rdiv"></div>
        <div class="drow" onclick="goHash('library/trash')"><span class="dcol"><b>${esc(t('mine.trash'))}</b><i>${esc(t('mine.trash.hint'))}</i></span>${IC.chevR2()}</div>
      </div>
      <div class="grouptitle">${esc(t('mine.about'))}</div>
      <div class="card setcard aboutcard">
        <div class="ab1">izyAether v1.0.0</div>
        <div class="ab2">${esc(t('mine.about.privacy'))}</div>
        <div class="ab2">${esc(t('mine.about.price'))}</div>
        <div class="ab2">${esc(t('mine.about.tm'))}</div>
        <div class="ablinks"><a href="legal/privacy.html" target="_blank">${esc(t('legal.privacy'))}</a><a href="legal/terms.html" target="_blank">${esc(t('legal.terms'))}</a></div>
      </div>
      <div class="minebottom"></div>
    </div>
  </div>`;
}
function bindMine() {
  document.querySelectorAll('[data-theme]').forEach(function (b) {
    b.onclick = function () { store.set(LS.theme, b.dataset.theme); applyTheme(); render(); };
  });
  const pr = document.getElementById('profileRow');
  if (pr) pr.onclick = function () {
    goHash('mine/profile');
  };
  const ex = document.getElementById('doExport');
  if (ex) ex.onclick = exportJSON;
  const im = document.getElementById('doImport');
  if (im) im.onclick = importShare;
}
/* 封面弹层（App coverSheet：6 预设两行 + 相册 + 恢复默认） */
function openCover() {
  closeMask();
  const p = store.get(LS.profile, {});
  const cur = (p.coverCustom && p.coverImg) ? -1 : store.get(LS.cover, 1);
  const m = document.createElement('div');
  m.className = 'mask'; m.id = 'coverMask';
  m.innerHTML = `<div class="sheet">
    <div class="sh-h">${esc(t('mine.cover.change'))}</div>
    <div class="cvfl">${esc(t('mine.cover.preset'))}</div>
    <div class="cvgrid">${[1, 2, 3].map(function (n) { return coverThumb(n, cur); }).join('')}</div>
    <div class="cvgrid">${[4, 5, 6].map(function (n) { return coverThumb(n, cur); }).join('')}</div>
    <label class="cvalbum">${esc(t('mine.cover.pick'))}<input type="file" accept="image/*" id="coverFile" hidden></label>
    <button class="cvreset" id="cvReset">${esc(t('mine.cover.reset'))}</button>
  </div>`;
  document.body.appendChild(m);
  /* App coverThumb.onClick：点预设即选中并收起（CoverStore.setPreset(n)） */
  m.querySelectorAll('[data-cv]').forEach(function (b) {
    b.onclick = function () {
      const pp = store.get(LS.profile, {});
      pp.coverCustom = false; pp.coverImg = '';
      store.set(LS.cover, Number(b.dataset.cv)); store.set(LS.profile, pp);
      closeMask(); render();
    };
  });
  const cf = document.getElementById('coverFile');
  if (cf) cf.onchange = function () {
    const f = cf.files && cf.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = function () {
      const pp = store.get(LS.profile, {});
      pp.coverCustom = true; pp.coverImg = rd.result;
      store.set(LS.profile, pp); closeMask(); render();
    };
    rd.readAsDataURL(f);
  };
  const rs = document.getElementById('cvReset');
  if (rs) rs.onclick = function () {
    const pp = store.get(LS.profile, {});
    pp.coverCustom = false; pp.coverImg = '';
    store.set(LS.cover, 1); store.set(LS.profile, pp); closeMask(); render();
  };
  m.onclick = function (e) { if (e.target === m) closeMask(); };
}
function coverThumb(n, cur) {
  const on = cur === n;
  return `<button class="cvthumb ${on ? 'on' : ''}" data-cv="${n}">
    <img src="assets/img/cover_${n}.jpg" alt="">${on ? '<span class="cvck">✓</span>' : ''}</button>`;
}
/* 语言弹层（App langSheet：9 行，选中行右侧勾） */
function openLang() {
  closeMask();
  const m = document.createElement('div');
  m.className = 'mask'; m.id = 'langMask';
  m.innerHTML = `<div class="sheet">
    <div class="sh-h">${esc(t('mine.language'))}</div>
    <div class="langlist">${LANGS.map(function (x) {
    return `<button class="langrow ${S.lang === x[0] ? 'on' : ''}" data-lang="${x[0]}"><span>${esc(x[1])}</span>${S.lang === x[0] ? '<i>✓</i>' : ''}</button>`;
  }).join('')}</div>
  </div>`;
  document.body.appendChild(m);
  m.querySelectorAll('[data-lang]').forEach(function (b) {
    b.onclick = function () {
      S.lang = b.dataset.lang; store.set(LS.lang, S.lang);
      applyTheme(); closeMask(); buildChrome(); render();
    };
  });
  m.onclick = function (e) { if (e.target === m) closeMask(); };
}
/* 导入好友分享（App doImportShare：读剪贴板分享码，无码/损坏/确认/限额/成功五态） */
function importShare() {
  if (navigator.clipboard && navigator.clipboard.readText) {
    navigator.clipboard.readText().then(function (s2) { doImportShare(s2); }, function () { doImportShare(''); });
  } else doImportShare('');
}
function doImportShare(text) {
  const txt = String(text || '');
  if (txt.indexOf('izy://p/') < 0) {
    dlg(t('share.import.title'), t('share.import.nocode'), t('mine.pro.got'));
    return;
  }
  const code = unpackCode(txt);
  if (!code) { toast(t('share.import.bad')); return; }
  dlg(t('share.import.title'), t('share.import.msg', code.title || t('lib.type.prompt')), t('share.import.ok'), t('common.ignore'), function () {
    const mine = selfPrompts();
    if (!isPro() && mine.length >= LIMIT_PROMPT) { toast(t('lib.paste.limit')); return; }
    mine.push(Object.assign({}, code, { id: 'p_' + Date.now(), fav: false, createdAt: Date.now() }));
    store.set(LS.prompts, mine);
    toast(t('share.import.done', code.title || ''));
    render();
  });
}
/* App PromptAction.showDialog：标题 + 说明 + 一或两个按钮（传 cancelText 才是双按钮）
 * okTone: 'warn' = 确认按钮用警告色（删除/清空类，App 同款：取消左·确认右） */
function dlg(title, msg, okText, cancelText, onOk, okTone) {
  closeMask();
  const two = cancelText !== undefined;
  const m = document.createElement('div');
  m.className = 'mask'; m.id = 'dlgMask';
  m.innerHTML = `<div class="sheet dlg">
    <div class="dlg-t">${esc(title)}</div>
    <div class="dlg-m">${esc(msg)}</div>
    <div class="dlg-b">
      ${two ? `<button class="btn" id="dlgNo">${esc(cancelText)}</button>` : ''}
      <button class="btn primary ${okTone === 'warn' ? 'warn' : ''}" id="dlgYes">${esc(okText)}</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  const yes = document.getElementById('dlgYes');
  const no = document.getElementById('dlgNo');
  if (yes) yes.onclick = function () { closeMask(); if (onOk) onOk(); };
  if (no) no.onclick = closeMask;
  m.onclick = function (e) { if (e.target === m) closeMask(); };
}
function openPlans() {
  closeMask();
  const plans = DATA.proPlans || [];
  const rows = [
    ['lib.type.skill', '高级 Skill'], ['lib.quota.self', '自建条数'], ['web.savings', '省钱账本'],
    ['tab.pricing', '比价'], ['web.sub.qdetail', '历史曲线'], ['web.alert', '余额预警'],
    ['web.sub.calc', '成本计算器'], ['web.sub.cats', '分类管理']
  ];
  const m = document.createElement('div');
  m.className = 'mask'; m.id = 'planMask';
  m.innerHTML = `<div class="sheet wide"><div class="sh-h">${esc(t('mine.pro.compare'))}</div>
    <div class="planrow"><span></span>${plans.map(function (p) {
    return `<div class="planhead ${proPlan() === p.id ? 'on' : ''}"><b>${esc(t(p.titleKey))}</b><i>${esc(t(p.priceKey))}${p.unitKey ? ' ' + esc(t(p.unitKey)) : ''}</i></div>`;
  }).join('')}</div>
    ${rows.map(function (r, i) {
    return `<div class="planrow"><span class="rk">${esc(t(r[0], '') || r[1])}</span>${plans.map(function (p) {
      return `<div class="rc"><i class="mark ${(p.id === 'free' && i > 0) ? 'no' : 'yes'}"></i></div>`;
    }).join('')}</div>`;
  }).join('')}
    <button class="btn primary" style="width:100%;margin-top:14px" onclick="buyPlan('forever')">${esc(t('common.ok'))}</button></div>`;
  document.body.appendChild(m);
  m.onclick = function (e) { if (e.target === m) closeMask(); };
}
/* App ProState.activate：年会员写 365 天后到期；永久写 0 */
function buyPlan(id) {
  store.set(LS.pro, id);
  store.set(LS.proUntil, id === 'forever' ? 0 : Date.now() + YEAR_MS);
  closeMask(); render(); toast(t('web.sync.ok'));
}
function closeMask() {
  ['planMask', 'coverMask', 'langMask', 'dlgMask', 'fillMask', 'regionMask'].forEach(function (id) {
    const m = document.getElementById(id);
    if (m) m.remove();
  });
}
function exportJSON() {
  const data = {
    version: 1, exportedAt: new Date().toISOString(),
    prompts: selfPrompts(), categories: store.get(LS.cats, []),
    cover: store.get(LS.cover, 1), lang: S.lang, pro: proPlan()
  };
  const name = 'izyaether-' + new Date().toISOString().slice(0, 10) + '.json';
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  /* App doExport：对话框「导出成功」+ 路径 + 提示（web 无文件系统路径，用文件名） */
  dlg(t('mine.export.ok'), t('mine.export.path', name) + '\n' + t('mine.export.hint'), t('mine.pro.got'));
}

/* ══════════ 启动 ══════════ */
async function boot() {
  /* no-cache：每次向服务器确认是否有新版本（GitHub Pages 默认缓存 10 分钟，否则更新后老访客看到旧内容） */
  const NC = { cache: 'no-cache' };
  const [d, i, b, e] = await Promise.all([
    fetch('data/app-data.json', NC).then(r => r.json()),
    fetch('data/i18n.json', NC).then(r => r.json()),
    fetch('data/brand.json', NC).then(r => r.json()),
    fetch('data/extra.json', NC).then(r => r.json()).catch(() => ({}))
  ]);
  DATA = d; I18N = i; BRAND = b; EXTRA = e;
  S.lang = store.get(LS.lang, guessLang());
  const q = new URLSearchParams(location.search).get('lang');
  if (q && LANGS.some(function (x) { return x[0] === q; })) { S.lang = q; store.set(LS.lang, q); }
  applyTheme();
  const r = parseHash();
  S.page = ['library', 'quota', 'price', 'mine'].indexOf(r.main) >= 0 ? r.main : 'library';
  S.sub = r.sub; S.arg = r.arg;
  buildChrome();
  S.ready = true;
  render();
}
window.AppBoot = boot;
window.addEventListener('hashchange', function () { render(); });

/* 二级页 / 比价补充文案（i18n.json 未覆盖的键，9 语言） */
const WEBX = {
  'zh-CN': { 'lib.title':'库', 'price.from':'起', 'price.tab.all':'全部', 'lib.empty.title':'这里还没有条目', 'lib.empty.sub':'点右下角 + 导入，或切换筛选看看', 'lib.cat.uncat':'未分类', 'lib.detail':'详情', 'quota.verify':'验证', 'quota.add.alias':'备注名', 'price.in':'输入', 'price.out':'输出', 'price.caps':'能力', 'price.quality':'质量', 'price.scenario':'场景', 'price.region':'网络', 'price.calc.words':'每篇字数', 'price.calc.t1':'总结', 'price.calc.t2':'翻译', 'price.calc.t3':'创作', 'price.calc.out':'输出字数', 'profile.gender.m':'男', 'profile.gender.f':'女', 'profile.gender.s':'保密', 'mine.album':'从相册选图' },
  'zh-TW': { 'lib.title':'庫', 'price.from':'起', 'price.tab.all':'全部', 'lib.empty.title':'這裡還沒有項目', 'lib.empty.sub':'點右下角 + 匯入，或切換篩選看看', 'lib.cat.uncat':'未分類', 'lib.detail':'詳情', 'quota.verify':'驗證', 'quota.add.alias':'備註名', 'price.in':'輸入', 'price.out':'輸出', 'price.caps':'能力', 'price.quality':'品質', 'price.scenario':'場景', 'price.region':'網路', 'price.calc.words':'每篇字數', 'price.calc.t1':'總結', 'price.calc.t2':'翻譯', 'price.calc.t3':'創作', 'price.calc.out':'輸出字數', 'profile.gender.m':'男', 'profile.gender.f':'女', 'profile.gender.s':'保密', 'mine.album':'從相簿選圖' },
  'en-US': { 'lib.title':'Library', 'price.from':'from', 'price.tab.all':'All', 'lib.empty.title':'Nothing here yet', 'lib.empty.sub':'Tap + to import, or change filters', 'lib.cat.uncat':'Uncategorized', 'lib.detail':'Detail', 'quota.verify':'Verify', 'quota.add.alias':'Label', 'price.in':'Input', 'price.out':'Output', 'price.caps':'Capabilities', 'price.quality':'Quality', 'price.scenario':'Scenarios', 'price.region':'Network', 'price.calc.words':'Words per doc', 'price.calc.t1':'Summarize', 'price.calc.t2':'Translate', 'price.calc.t3':'Write', 'price.calc.out':'Output words', 'profile.gender.m':'Male', 'profile.gender.f':'Female', 'profile.gender.s':'Private', 'mine.album':'Choose from photos' },
  'ja-JP': { 'lib.title':'ライブラリ', 'price.from':'から', 'price.tab.all':'すべて', 'lib.empty.title':'まだ何もありません', 'lib.empty.sub':'＋から取り込むか、絞り込みを変えてください', 'lib.cat.uncat':'未分類', 'lib.detail':'詳細', 'quota.verify':'検証', 'quota.add.alias':'ラベル', 'price.in':'入力', 'price.out':'出力', 'price.caps':'機能', 'price.quality':'品質', 'price.scenario':'用途', 'price.region':'ネットワーク', 'price.calc.words':'1 件あたりの文字数', 'price.calc.t1':'要約', 'price.calc.t2':'翻訳', 'price.calc.t3':'作成', 'price.calc.out':'出力文字数', 'profile.gender.m':'男性', 'profile.gender.f':'女性', 'profile.gender.s':'非公開', 'mine.album':'写真から選ぶ' },
  'ko-KR': { 'lib.title':'라이브러리', 'price.from':'부터', 'price.tab.all':'전체', 'lib.empty.title':'아직 항목이 없습니다', 'lib.empty.sub':'+ 버튼으로 가져오거나 필터를 바꿔보세요', 'lib.cat.uncat':'미분류', 'lib.detail':'상세', 'quota.verify':'확인', 'quota.add.alias':'라벨', 'price.in':'입력', 'price.out':'출력', 'price.caps':'기능', 'price.quality':'품질', 'price.scenario':'용도', 'price.region':'네트워크', 'price.calc.words':'문서당 글자 수', 'price.calc.t1':'요약', 'price.calc.t2':'번역', 'price.calc.t3':'창작', 'price.calc.out':'출력 글자 수', 'profile.gender.m':'남성', 'profile.gender.f':'여성', 'profile.gender.s':'비공개', 'mine.album':'사진에서 선택' },
  'de-DE': { 'lib.title':'Bibliothek', 'price.from':'ab', 'price.tab.all':'Alle', 'lib.empty.title':'Noch nichts hier', 'lib.empty.sub':'Über + importieren oder Filter ändern', 'lib.cat.uncat':'Ohne Kategorie', 'lib.detail':'Detail', 'quota.verify':'Prüfen', 'quota.add.alias':'Bezeichnung', 'price.in':'Eingabe', 'price.out':'Ausgabe', 'price.caps':'Fähigkeiten', 'price.quality':'Qualität', 'price.scenario':'Szenarien', 'price.region':'Netzwerk', 'price.calc.words':'Wörter pro Dokument', 'price.calc.t1':'Zusammenfassen', 'price.calc.t2':'Übersetzen', 'price.calc.t3':'Schreiben', 'price.calc.out':'Ausgabewörter', 'profile.gender.m':'Männlich', 'profile.gender.f':'Weiblich', 'profile.gender.s':'Privat', 'mine.album':'Aus Fotos wählen' },
  'es-ES': { 'lib.title':'Biblioteca', 'price.from':'desde', 'price.tab.all':'Todo', 'lib.empty.title':'Aún no hay nada', 'lib.empty.sub':'Pulsa + para importar o cambia los filtros', 'lib.cat.uncat':'Sin categoría', 'lib.detail':'Detalle', 'quota.verify':'Verificar', 'quota.add.alias':'Etiqueta', 'price.in':'Entrada', 'price.out':'Salida', 'price.caps':'Capacidades', 'price.quality':'Calidad', 'price.scenario':'Escenarios', 'price.region':'Red', 'price.calc.words':'Palabras por documento', 'price.calc.t1':'Resumir', 'price.calc.t2':'Traducir', 'price.calc.t3':'Escribir', 'price.calc.out':'Palabras de salida', 'profile.gender.m':'Hombre', 'profile.gender.f':'Mujer', 'profile.gender.s':'Privado', 'mine.album':'Elegir de fotos' },
  'fr-FR': { 'lib.title':'Bibliothèque', 'price.from':'à partir de', 'price.tab.all':'Tout', 'lib.empty.title':'Rien ici pour l instant', 'lib.empty.sub':'Appuyez sur + pour importer ou changez les filtres', 'lib.cat.uncat':'Sans catégorie', 'lib.detail':'Détail', 'quota.verify':'Vérifier', 'quota.add.alias':'Libellé', 'price.in':'Entrée', 'price.out':'Sortie', 'price.caps':'Capacités', 'price.quality':'Qualité', 'price.scenario':'Scénarios', 'price.region':'Réseau', 'price.calc.words':'Mots par document', 'price.calc.t1':'Résumer', 'price.calc.t2':'Traduire', 'price.calc.t3':'Rédiger', 'price.calc.out':'Mots de sortie', 'profile.gender.m':'Homme', 'profile.gender.f':'Femme', 'profile.gender.s':'Privé', 'mine.album':'Choisir dans les photos' },
  'ru-RU': { 'lib.title':'Библиотека', 'price.from':'от', 'price.tab.all':'Все', 'lib.empty.title':'Здесь пока пусто', 'lib.empty.sub':'Нажмите + для импорта или смените фильтр', 'lib.cat.uncat':'Без категории', 'lib.detail':'Подробнее', 'quota.verify':'Проверить', 'quota.add.alias':'Метка', 'price.in':'Ввод', 'price.out':'Вывод', 'price.caps':'Возможности', 'price.quality':'Качество', 'price.scenario':'Сценарии', 'price.region':'Сеть', 'price.calc.words':'Слов в документе', 'price.calc.t1':'Сжато', 'price.calc.t2':'Перевод', 'price.calc.t3':'Текст', 'price.calc.out':'Слов на выходе', 'profile.gender.m':'Мужской', 'profile.gender.f':'Женский', 'profile.gender.s':'Скрыт', 'mine.album':'Выбрать из фото' }
};

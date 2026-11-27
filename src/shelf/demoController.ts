import type { ShelfContentPackage, ShelfRuntime } from './contract';

/**
 * 演示内容管线（Notion 实例）。
 *
 * 与 TOKI 的 demo/contentController 同形：同样的状态机、同样的 action id、
 * 同样的 payload 键；只有数据与标题换成 Notion 的四个 Tab。
 * 这里不解析任何 Notion 视觉令牌，渲染交给 SlotView。
 */

export const DEMO_SLOT = 'contentSlot';

export type FeedItem = { id: string; title: string; meta: string };
export type ListPayload = { title: string; batch: number; items: FeedItem[] };
export type ErrorPayload = { message: string };

const TAB_TITLES: Record<string, string> = {
  home: '主页',
  chats: '对话',
  meetings: '会议',
  inbox: '收件箱',
};

const FEED: Record<string, FeedItem[][]> = {
  home: [
    [
      { id: 'home-1', title: '产品路线图 Q4', meta: '页面 · 昨天编辑' },
      { id: 'home-2', title: '设计系统 2.0', meta: '数据库 · 12 条记录' },
      { id: 'home-3', title: '周会纪要', meta: '页面 · 周一' },
    ],
    [
      { id: 'home-4', title: '用户访谈汇总', meta: '页面 · 3 天前' },
      { id: 'home-5', title: '增长实验看板', meta: '数据库 · 8 条记录' },
      { id: 'home-6', title: '季度目标', meta: '页面 · 上周' },
    ],
  ],
  chats: [
    [
      { id: 'chat-1', title: '与设计对齐槽位', meta: '今天 10:24' },
      { id: 'chat-2', title: '契约字段讨论', meta: '昨天' },
      { id: 'chat-3', title: '发布检查清单', meta: '周一' },
    ],
    [
      { id: 'chat-4', title: '第二实例选型', meta: '今天 09:10' },
      { id: 'chat-5', title: '校验器评审', meta: '昨天' },
      { id: 'chat-6', title: '回归结果', meta: '上周五' },
    ],
  ],
  meetings: [
    [
      { id: 'meet-1', title: '周一同步', meta: '09:30 · 30 分钟' },
      { id: 'meet-2', title: '设计评审', meta: '14:00 · 45 分钟' },
      { id: 'meet-3', title: '复盘', meta: '17:30 · 20 分钟' },
    ],
    [
      { id: 'meet-4', title: '跨团队对齐', meta: '11:00 · 60 分钟' },
      { id: 'meet-5', title: '1:1', meta: '15:00 · 30 分钟' },
      { id: 'meet-6', title: '季度规划', meta: '周四 · 90 分钟' },
    ],
  ],
  inbox: [
    [
      { id: 'in-1', title: '评论提及', meta: '2 条未读' },
      { id: 'in-2', title: '页面共享', meta: '来自设计组' },
      { id: 'in-3', title: '数据库变更', meta: '1 条未读' },
    ],
    [
      { id: 'in-4', title: '邀请加入工作区', meta: '1 条未读' },
      { id: 'in-5', title: '导出完成', meta: '昨天' },
      { id: 'in-6', title: '权限变更', meta: '上周' },
    ],
  ],
};

const titleFor = (tabId: string) => TAB_TITLES[tabId] ?? tabId;

const itemsFor = (tabId: string, batch: number) => {
  const batches = FEED[tabId] ?? FEED.home;
  return batches[batch % batches.length];
};

export function loadingPackage(tabId: string, batch: number): ShelfContentPackage {
  return { id: `feed:${tabId}:loading:${batch}`, kind: 'loading', payload: { title: titleFor(tabId), batch } };
}

export function listPackage(tabId: string, batch: number, items: FeedItem[]): ShelfContentPackage {
  return {
    id: `feed:${tabId}:list:${batch}`,
    kind: 'list',
    payload: { title: titleFor(tabId), batch, items } satisfies ListPayload,
    actions: [
      { id: 'feed.refresh', label: '换一批' },
      { id: 'feed.clear', label: '清空' },
      { id: 'feed.fail', label: '模拟失败' },
    ],
  };
}

export function emptyPackage(tabId: string): ShelfContentPackage {
  return {
    id: `feed:${tabId}:empty`,
    kind: 'empty',
    payload: { title: titleFor(tabId) },
    actions: [{ id: 'feed.reload', label: '载入示例内容' }],
  };
}

export function errorPackage(tabId: string, message: string): ShelfContentPackage {
  return {
    id: `feed:${tabId}:error`,
    kind: 'error',
    payload: { message } satisfies ErrorPayload,
    actions: [{ id: 'feed.retry', label: '重试' }],
  };
}

export function attachDemoController(
  runtime: ShelfRuntime,
  options?: { delayMs?: number },
): () => void {
  const delay = options?.delayMs ?? 180;
  let tabId = 'home';
  let batch = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;

  const clearTimer = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const write = (content: ShelfContentPackage | null) => {
    if (disposed) return;
    runtime.updateSlot(DEMO_SLOT, content);
  };

  const load = () => {
    clearTimer();
    const targetTab = tabId;
    const targetBatch = batch;
    write(loadingPackage(targetTab, targetBatch));
    timer = setTimeout(() => {
      timer = null;
      if (disposed) return;
      write(listPackage(targetTab, targetBatch, itemsFor(targetTab, targetBatch)));
    }, delay);
  };

  const unsubscribe = runtime.subscribe((event) => {
    if (disposed) return;

    if (event.type === 'tab.select') {
      tabId = event.tabId;
      batch = 0;
      load();
      return;
    }

    if (event.type !== 'action.invoke' || event.slot !== DEMO_SLOT) return;

    switch (event.actionId) {
      case 'feed.refresh':
        batch += 1;
        load();
        break;
      case 'feed.reload':
      case 'feed.retry':
        load();
        break;
      case 'feed.clear':
        clearTimer();
        write(emptyPackage(tabId));
        break;
      case 'feed.fail':
        clearTimer();
        write(errorPackage(tabId, '演示失败：内容管线返回错误'));
        break;
      default:
        break;
    }
  });

  load();

  return () => {
    disposed = true;
    clearTimer();
    unsubscribe();
    runtime.updateSlot(DEMO_SLOT, null);
  };
}

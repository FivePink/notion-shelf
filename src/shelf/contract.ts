/**
 * Shelf 契约 v1 —— Notion 侧实现。
 *
 * 字段与语义以 docs/SHELF_CONTRACT_V1.md 为准；与 TOKI 的 contract.ts 同形，
 * 区别只在本例不需要 slot binding（订阅由 hook 完成）。
 */

export const SHELF_CONTRACT_VERSION = 1 as const;

export type ShelfThemeMode = 'light' | 'dark';
export type ShelfTabId = string;
export type ShelfSlotId = string;

export type ShelfAction = {
  id: string;
  label: string;
  payload?: unknown;
};

export type ShelfContentPackage<TPayload = unknown> = {
  id: string;
  kind: string;
  payload: TPayload;
  actions?: readonly ShelfAction[];
};

export type ShelfEvent =
  | { type: 'tab.select'; tabId: ShelfTabId; previousTabId?: ShelfTabId }
  | { type: 'chat.open'; fromTabId: ShelfTabId }
  | { type: 'chat.close'; toTabId: ShelfTabId }
  | { type: 'theme.change'; mode: ShelfThemeMode }
  | { type: 'slot.update'; slot: ShelfSlotId; content: ShelfContentPackage | null }
  | { type: 'action.invoke'; slot: ShelfSlotId; actionId: string; contentId?: string };

export type ShelfEventHandler = (event: ShelfEvent) => void;
export type ShelfUnsubscribe = () => void;

export class ShelfRuntime {
  private readonly handlers = new Set<ShelfEventHandler>();
  private readonly contents = new Map<ShelfSlotId, ShelfContentPackage | null>();

  subscribe(handler: ShelfEventHandler): ShelfUnsubscribe {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  emit(event: ShelfEvent): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }

  updateSlot(slot: ShelfSlotId, content: ShelfContentPackage | null): void {
    this.contents.set(slot, content);
    this.emit({ type: 'slot.update', slot, content });
  }

  getContent(slot: ShelfSlotId): ShelfContentPackage | null {
    return this.contents.get(slot) ?? null;
  }
}

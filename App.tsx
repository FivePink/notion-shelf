import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TopTabBar } from './src/components/TopTabBar';
import { BottomToolbar } from './src/components/BottomToolbar';
import { usePx } from './src/config/tokens';
import { DARK, LIGHT } from './src/config/theme';
import type { TabId } from './src/config/tabs';
import { ShelfRuntime } from './src/shelf/contract';
import { attachDemoController, DEMO_SLOT } from './src/shelf/demoController';
import { SlotView } from './src/shelf/SlotView';
import { useSlotContent } from './src/shelf/useSlotContent';

function Shelf() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? DARK : LIGHT;
  const px = usePx();
  const [tab, setTab] = useState<TabId>('home');
  const runtime = useMemo(() => new ShelfRuntime(), []);
  const content = useSlotContent(runtime, DEMO_SLOT);

  // 演示内容接管 contentSlot；外壳只把动作回传成事件，不解析 payload。
  useEffect(() => attachDemoController(runtime), [runtime]);

  const selectTab = (next: TabId) => {
    if (next === tab) return;
    runtime.emit({ type: 'tab.select', tabId: next, previousTabId: tab });
    setTab(next);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.pageBg }]}>
      <View style={{ height: px(80) }} />
      <TopTabBar theme={theme} selected={tab} onSelect={selectTab} />
      <View style={styles.content} testID="contentSlot">
        <SlotView
          content={content}
          theme={theme}
          px={px}
          onAction={(actionId, contentId) =>
            runtime.emit({ type: 'action.invoke', slot: DEMO_SLOT, actionId, contentId })
          }
        />
      </View>
      <BottomToolbar theme={theme} />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Shelf />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

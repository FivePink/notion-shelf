import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TopTabBar } from './src/components/TopTabBar';
import { BottomToolbar } from './src/components/BottomToolbar';
import { usePx } from './src/config/tokens';
import { DARK, LIGHT } from './src/config/theme';
import type { TabId } from './src/config/tabs';

function Shelf() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? DARK : LIGHT;
  const px = usePx();
  const [tab, setTab] = useState<TabId>('home');

  return (
    <View style={[styles.root, { backgroundColor: theme.pageBg }]}>
      <View style={{ height: px(80) }} />
      <TopTabBar theme={theme} selected={tab} onSelect={setTab} />
      <View style={styles.content} />
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

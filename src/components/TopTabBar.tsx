import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { TOKENS, usePx } from '../config/tokens';
import { TABS, type TabId } from '../config/tabs';
import type { ThemeTokens } from '../config/theme';

type Props = {
  theme: ThemeTokens;
  selected: TabId;
  onSelect: (id: TabId) => void;
};

export function TopTabBar({ theme, selected, onSelect }: Props) {
  const isDark = theme.pageBg === '#202020';
  const px = usePx();
  const pillH = px(TOKENS.topBar.pillHeightPx);
  const workspaceSlot = px(TOKENS.topBar.workspaceSlotPx);
  const workspaceVisual = px(TOKENS.topBar.workspaceVisualPx);
  const pillIcon = px(TOKENS.topBar.pillIconPx);

  return (
    <View
      testID="topTabBar"
      style={[
        styles.bar,
        {
          height: px(TOKENS.topBar.heightPx),
          marginHorizontal: px(TOKENS.topBar.marginHorizontalPx),
          marginRight: px(TOKENS.topBar.marginHorizontalPx + TOKENS.topBar.trailingInsetPx),
        },
      ]}
    >
      <Pressable
        testID="workspaceIcon"
        onPress={() => {}}
        style={({ pressed }) => [
          styles.workspace,
          {
            width: workspaceSlot,
            height: workspaceSlot,
            marginRight: px(TOKENS.topBar.iconGapPx),
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Image
          source={isDark ? require('../../assets/icons/workspace-dark.png') : require('../../assets/icons/workspace.png')}
          style={{ width: workspaceVisual, height: workspaceVisual, borderRadius: workspaceVisual / 2 }}
        />
      </Pressable>

      <View style={styles.pillGroup}>
        {TABS.map((tab) => {
          const isSelected = tab.id === selected;
          return (
            <Pressable
              key={tab.id}
              testID={`tab-${tab.id}`}
              accessibilityLabel={tab.label}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(tab.id)}
              style={[
                styles.pill,
                {
                  flex: 1,
                  height: pillH,
                  borderRadius: pillH / 2,
                  backgroundColor: isSelected ? theme.pillBgSelected : theme.pillBg,
                },
              ]}
            >
              <Image
                source={isSelected ? tab.iconSelected : tab.iconUnselected}
                tintColor={isSelected ? theme.ink : theme.inkMuted}
                style={{ width: pillIcon, height: pillIcon }}
                resizeMode="contain"
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workspace: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillGroup: {
    flexDirection: 'row',
    flex: 1,
    gap: 22 / 2.75,
  },
  pill: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

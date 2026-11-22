import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { TOKENS, usePx } from '../config/tokens';
import type { ThemeTokens } from '../config/theme';

type Props = {
  theme: ThemeTokens;
  onSearch?: () => void;
  onAgent?: () => void;
  onCreate?: () => void;
};

export function BottomToolbar({ theme, onSearch, onAgent, onCreate }: Props) {
  const isDark = theme.pageBg === '#202020';
  const px = usePx();
  const barH = px(TOKENS.bottomBar.heightPx);
  const btnDp = px(TOKENS.bottomBar.buttonSizePx);
  const agentW = px(TOKENS.bottomBar.pillWidthPx);
  const agentIcon = px(TOKENS.bottomBar.pillIconPx);
  const iconSize = px(TOKENS.searchCreateIconPx);

  return (
    <LinearGradient
      testID="bottomGradient"
      colors={[theme.bottomGradientTop, theme.bottomGradientBottom]}
      style={[
        styles.gradient,
        {
          height: px(TOKENS.bottomGradientHeightPx),
          paddingBottom: px(TOKENS.bottomInsetPx),
        },
      ]}
    >
      <View
        style={[
          styles.toolbar,
          {
            height: barH,
            marginHorizontal: px(TOKENS.bottomBar.marginHorizontalPx),
          },
        ]}
      >
        <Pressable
          testID="searchButton"
          accessibilityLabel="搜索"
          onPress={onSearch}
          style={({ pressed }) => [
            styles.circleButton,
            {
              width: btnDp,
              height: btnDp,
              borderRadius: px(TOKENS.controlRadiusPx),
              borderWidth: px(TOKENS.controlBorderPx),
              borderColor: theme.pillBg,
              backgroundColor: theme.buttonBg,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Image
            source={isDark ? require('../../assets/icons/search-dark.png') : require('../../assets/icons/search.png')}
            style={{ width: iconSize, height: iconSize }}
          />
        </Pressable>

        <Pressable
          testID="agentPill"
          accessibilityLabel="万事问 AI"
          onPress={onAgent}
          style={({ pressed }) => [
            styles.agentPill,
            {
              width: agentW,
              height: barH,
              borderRadius: px(TOKENS.bottomBar.radiusPx),
              paddingLeft: px(TOKENS.bottomBar.pillIconInsetPx),
              borderWidth: px(TOKENS.controlBorderPx),
              borderColor: theme.pillBg,
              backgroundColor: theme.buttonBg,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Image
            source={isDark ? require('../../assets/icons/agent-dark.png') : require('../../assets/icons/agent.png')}
            style={{ width: agentIcon, height: agentIcon }}
          />
          <Text
            style={[
              styles.agentText,
              {
                color: theme.agentText,
                fontSize: px(TOKENS.bottomBar.agentTextSizePx),
                marginLeft: px(TOKENS.bottomBar.pillIconTextGapPx),
              },
            ]}
          >
            万事问 AI
          </Text>
        </Pressable>

        <Pressable
          testID="createButton"
          accessibilityLabel="创建"
          onPress={onCreate}
          style={({ pressed }) => [
            styles.circleButton,
            {
              width: btnDp,
              height: btnDp,
              borderRadius: px(TOKENS.controlRadiusPx),
              borderWidth: px(TOKENS.controlBorderPx),
              borderColor: theme.pillBg,
              backgroundColor: theme.buttonBg,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Image
            source={isDark ? require('../../assets/icons/create-dark.png') : require('../../assets/icons/create.png')}
            style={{ width: iconSize, height: iconSize }}
          />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 33 / 2.75,
  },
  circleButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentText: {
    fontSize: 16,
  },
});

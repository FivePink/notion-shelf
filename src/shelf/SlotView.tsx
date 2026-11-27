import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import type { ThemeTokens } from '../config/theme';
import type { ShelfContentPackage } from './contract';
import type { ErrorPayload, ListPayload } from './demoController';

type Props = {
  content: ShelfContentPackage | null;
  theme: ThemeTokens;
  px: (value: number) => number;
  onAction: (actionId: string, contentId?: string) => void;
};

function Actions({ content, theme, px, onAction }: Props & { content: ShelfContentPackage }) {
  if (!content.actions?.length) return null;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: px(12) }}>
      {content.actions.map((action) => (
        <Pressable
          key={action.id}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={() => onAction(action.id, content.id)}
          style={{
            paddingHorizontal: px(22),
            paddingVertical: px(14),
            borderRadius: px(22),
            backgroundColor: theme.pillBg,
          }}
        >
          <Text style={{ color: theme.ink, fontSize: px(26) }}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function SlotView({ content, theme, px, onAction }: Props) {
  if (!content) return null;

  const padding = px(44);

  if (content.kind === 'loading') {
    return (
      <View
        testID="contentLoading"
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: px(16) }}
      >
        <ActivityIndicator color={theme.inkMuted} />
        <Text style={{ color: theme.inkMuted, fontSize: px(26) }}>正在载入…</Text>
      </View>
    );
  }

  if (content.kind === 'empty') {
    const { title } = content.payload as { title?: string };
    return (
      <View testID="contentEmpty" style={{ flex: 1, padding, gap: px(18), justifyContent: 'center' }}>
        <Text style={{ color: theme.ink, fontSize: px(34), fontWeight: '600' }}>
          {title ?? '内容'} · 空
        </Text>
        <Text style={{ color: theme.inkMuted, fontSize: px(26) }}>还没有内容。</Text>
        <Actions content={content} theme={theme} px={px} onAction={onAction} />
      </View>
    );
  }

  if (content.kind === 'error') {
    const { message } = content.payload as ErrorPayload;
    return (
      <View testID="contentError" style={{ flex: 1, padding, gap: px(18), justifyContent: 'center' }}>
        <Text style={{ color: theme.ink, fontSize: px(34), fontWeight: '600' }}>载入失败</Text>
        <Text style={{ color: theme.inkMuted, fontSize: px(26) }}>{message}</Text>
        <Actions content={content} theme={theme} px={px} onAction={onAction} />
      </View>
    );
  }

  if (content.kind === 'list') {
    const { title, batch, items } = content.payload as ListPayload;
    return (
      <ScrollView
        testID="contentList"
        contentContainerStyle={{ padding, gap: px(14) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: px(4), marginBottom: px(6) }}>
          <Text style={{ color: theme.ink, fontSize: px(40), fontWeight: '700' }}>{title}</Text>
          <Text style={{ color: theme.inkMuted, fontSize: px(24) }}>
            演示内容 · 第 {batch + 1} 批 · {items.length} 条
          </Text>
        </View>

        {items.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: theme.pillBg,
              borderRadius: px(24),
              paddingHorizontal: px(24),
              paddingVertical: px(20),
              gap: px(4),
            }}
          >
            <Text style={{ color: theme.ink, fontSize: px(30), fontWeight: '600' }}>{item.title}</Text>
            <Text style={{ color: theme.inkMuted, fontSize: px(24) }}>{item.meta}</Text>
          </View>
        ))}

        <View style={{ marginTop: px(8) }}>
          <Actions content={content} theme={theme} px={px} onAction={onAction} />
        </View>
      </ScrollView>
    );
  }

  return (
    <View testID="contentUnknown" style={{ flex: 1, padding, justifyContent: 'center' }}>
      <Text style={{ color: theme.inkMuted, fontSize: px(26) }}>未识别的内容类型：{content.kind}</Text>
    </View>
  );
}

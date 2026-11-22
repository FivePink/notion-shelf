import { useWindowDimensions } from 'react-native';

export const REF_WIDTH = 1080;

export function useScale() {
  const { width } = useWindowDimensions();
  return width / REF_WIDTH;
}

export function usePx() {
  const scale = useScale();
  return (px: number) => px * scale;
}

export const TOKENS = {
  topBar: {
    heightPx: 132,
    marginHorizontalPx: 44,
    workspaceSlotPx: 132,
    workspaceVisualPx: 133,
    iconGapPx: 11,
    pillGapPx: 22,
    pillHeightPx: 110,
    pillIconPx: 72,
    trailingInsetPx: 11,
  },
  bottomBar: {
    heightPx: 132,
    marginHorizontalPx: 44,
    buttonSizePx: 132,
    gapPx: 33,
    pillWidthPx: 662,
    pillIconPx: 88,
    pillIconInsetPx: 22,
    pillIconTextGapPx: 22,
    radiusPx: 66,
    agentTextSizePx: 44,
  },
  bottomGradientHeightPx: 200,
  bottomInsetPx: 11,
  searchCreateIconPx: 66,
  controlRadiusPx: 66,
  controlBorderPx: 3,
};

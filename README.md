# Notion Shelf

Expo Go 外壳，复刻 Notion Android `0.6.4304` 的顶部四个 Tab 与底部三个控件。仅复刻外观、几何、选中态和主题切换，不实现任何业务功能。

## 运行

```bash
npm install
npx expo start --localhost --port 8082
```

Android 真机连接后：

```bash
adb reverse tcp:8082 tcp:8082
adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8082"
```

## 验收边界

- 已验证：1080×2400 / density 440 设备下的顶部与底部 hit bounds；顶部工作区圆与四个 Tab 胶囊的 visual bounds；四个 Tab 点击选中态；亮色与系统暗色。
- 已实现：静态外壳与空回调。
- 未实现：Notion 页面内容、搜索、AI、创建的业务动作、宽屏适配、多分辨率、独立 Android 构建。
- 证据：`screenshots/`。Expo Go 画面可能包含自带 Tools 浮层，不属于被测界面。

## 素材说明

`assets/icons/tab-*-selected-dark.png` 和 `tab-*-unselected-dark.png` 被当作透明遮罩源，运行时用 `tintColor` 按状态与主题着色。浅色与带背景的历史素材已移除。

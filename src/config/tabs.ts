export type TabId = 'home' | 'chats' | 'meetings' | 'inbox';

export type TabItem = {
  id: TabId;
  label: string;
  iconSelected: ReturnType<typeof require>;
  iconUnselected: ReturnType<typeof require>;
};

export const TABS: TabItem[] = [
  { id: 'home', label: '主页',
    iconSelected: require('../../assets/icons/tab-home-selected-dark.png'),
    iconUnselected: require('../../assets/icons/tab-home-unselected-dark.png') },
  { id: 'chats', label: '对话',
    iconSelected: require('../../assets/icons/tab-chats-selected-dark.png'),
    iconUnselected: require('../../assets/icons/tab-chats-unselected-dark.png') },
  { id: 'meetings', label: '会议',
    iconSelected: require('../../assets/icons/tab-meetings-selected-dark.png'),
    iconUnselected: require('../../assets/icons/tab-meetings-unselected-dark.png') },
  { id: 'inbox', label: '收件箱',
    iconSelected: require('../../assets/icons/tab-inbox-selected-dark.png'),
    iconUnselected: require('../../assets/icons/tab-inbox-unselected-dark.png') },
];

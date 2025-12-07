'use client';

import { Menu } from 'antd';
import { FileTextOutlined, MessageOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navigation = () => {
  const pathname = usePathname();
  
  const items = [
    {
      key: '/documents',
      icon: <FileTextOutlined />,
      label: <Link href="/documents">Документы</Link>,
    },
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: <Link href="/chat">Чат</Link>,
    },
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[pathname]}
      items={items}
      style={{ marginBottom: 20 }}
    />
  );
};

export default Navigation;
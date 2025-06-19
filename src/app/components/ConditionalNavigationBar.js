"use client";

import { usePathname } from 'next/navigation';
import NavigationBar from '@/app/components/NavigationBar';

export default function ConditionalNavigationBar() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return <NavigationBar />;
}

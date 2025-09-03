'use client';

import { SearchIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';

export function SearchInput() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <Input
      defaultValue={query ?? ''}
      onChange={(e) =>
        window.history.replaceState({}, '', e.target.value ? `/?q=${e.target.value}` : '/')
      }
      placeholder='サーバーを検索'
      startContent={<SearchIcon />}
    />
  );
}

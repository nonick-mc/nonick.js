'use client';

import { SearchIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

export function SearchInput() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [inputValue, setInputValue] = useState(query ?? '');
  const isComposing = useRef(false);

  const updateURL = (value: string) => {
    window.history.replaceState({}, '', value ? `/?q=${value}` : '/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // IME変換中でない場合のみURLを更新
    if (!isComposing.current) {
      updateURL(value);
    }
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    // 変換確定時にURLを更新
    updateURL(e.currentTarget.value);
  };

  return (
    <Input
      value={inputValue}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      placeholder='サーバーを検索'
      startContent={<SearchIcon />}
    />
  );
}

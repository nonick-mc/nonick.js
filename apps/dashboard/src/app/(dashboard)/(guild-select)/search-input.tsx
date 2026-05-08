'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@repo/ui/components/input-group';
import { SearchIcon, XIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';

export function SearchInput() {
  const [query, setQuery] = useQueryState('q');

  return (
    <InputGroup className='h-10'>
      <InputGroupInput
        placeholder='サーバーを検索'
        value={query || ''}
        onChange={(e) => setQuery(e.target.value || null)}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      {query && (
        <InputGroupAddon align='inline-end'>
          <InputGroupButton onClick={() => setQuery(null)} size='icon-sm'>
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

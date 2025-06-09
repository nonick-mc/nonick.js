'use client';

import { Icon } from '@/components/icon';
import type { auditLog } from '@/lib/database/src/schema/audit-log';
import { DiscordEndPoints } from '@/lib/discord/constants';
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  ScrollShadow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import type { APIUser } from 'discord-api-types/v10';
import { useMemo, useState } from 'react';
import type { AuditLogActionType } from './constants';
import { TableRowAuthor, TableRowCreatedAt, TableRowLogContent } from './table-row-content';

const columns = [
  {
    key: 'user',
    label: 'ユーザー',
  },
  {
    key: 'content',
    label: '内容',
  },
  {
    key: 'time',
    label: '時間',
  },
];

export function AuditLogTable({
  auditLogs,
  authors,
}: { auditLogs: (typeof auditLog.$inferSelect)[]; authors: APIUser[] }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [userIdFilter, setUserIdFilter] = useState<string | null>(null);
  const [actionTypeFilter, setActionTypeFilter] = useState<AuditLogActionType | null>(null);

  const filteredItems = useMemo(() => {
    let filteredAuditLog = [...auditLogs];

    if (userIdFilter) {
      filteredAuditLog = filteredAuditLog.filter((log) => log.authorId === userIdFilter);
    }
    if (actionTypeFilter) {
      filteredAuditLog = filteredAuditLog.filter((log) => log.actionType === actionTypeFilter);
    }

    return filteredAuditLog;
  }, [auditLogs, userIdFilter, actionTypeFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = (entry: typeof auditLog.$inferSelect, columnKey: React.Key) => {
    switch (columnKey) {
      case 'user':
        return <TableRowAuthor authors={authors} authorId={entry.authorId} />;
      case 'content':
        return <TableRowLogContent actionType={entry.actionType} targetName={entry.targetName} />;
      case 'time':
        return <TableRowCreatedAt time={entry.createdAt} />;
      default:
        return <span className='text-default-500'>unknown</span>;
    }
  };

  return (
    <div className='flex flex-col gap-6 pb-6'>
      <div className='flex max-sm:justify-center gap-3'>
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant='flat'
              startContent={
                <Badge
                  color='primary'
                  size='sm'
                  content=''
                  isInvisible={!userIdFilter}
                  shape='circle'
                >
                  <Icon icon='solar:user-bold' className='text-2xl' />
                </Badge>
              }
              endContent={<Icon icon='solar:alt-arrow-down-outline' className='text-base' />}
            >
              ユーザー
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label='Single selection example'
            selectedKeys={userIdFilter ? [userIdFilter] : []}
            onSelectionChange={(keys) =>
              setUserIdFilter(Array.from(keys)[0] ? (Array.from(keys)[0] as string) : null)
            }
            items={authors}
            selectionMode='single'
            variant='flat'
          >
            {(author) => (
              <DropdownItem
                key={author.id}
                startContent={
                  <Avatar
                    size='sm'
                    src={`${DiscordEndPoints.CDN}/avatars/${author.id}/${author.avatar}.webp`}
                    name={author.username}
                  />
                }
              >
                {author.username}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant='flat'
              startContent={
                <Badge
                  color='primary'
                  size='sm'
                  content=''
                  isInvisible={!actionTypeFilter}
                  shape='circle'
                >
                  <Icon icon='solar:tuning-2-bold' className='text-2xl' />
                </Badge>
              }
              endContent={<Icon icon='solar:alt-arrow-down-outline' className='text-base' />}
            >
              操作内容
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label='Single selection example'
            selectedKeys={actionTypeFilter ? [actionTypeFilter] : []}
            onSelectionChange={(keys) =>
              setActionTypeFilter(
                Array.from(keys)[0] ? (Array.from(keys)[0] as AuditLogActionType) : null,
              )
            }
            selectionMode='single'
            variant='flat'
          >
            <DropdownItem
              startContent={<Icon icon='solar:settings-outline' className='text-xl text-warning' />}
              key={'update_guild_setting'}
            >
              サーバー設定を更新
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <ScrollShadow className='w-full' orientation='horizontal'>
        <Table className='min-w-[600px]' aria-label='auditlog table'>
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody emptyContent='表示する監査ログがありません' items={items}>
            {(entry) => (
              <TableRow key={entry.id}>
                {(columnKey) => <TableCell>{renderCell(entry, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollShadow>
      <div className='flex w-full justify-between items-center gap-6'>
        <div className='flex gap-3 items-center'>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant='flat'
                endContent={<Icon icon='solar:alt-arrow-down-outline' className='text-base' />}
              >
                {rowsPerPage}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label='Single selection example'
              selectedKeys={[String(rowsPerPage)]}
              onSelectionChange={(keys) => {
                setRowsPerPage(Number(Array.from(keys)[0]));
                setPage(1);
              }}
              selectionMode='single'
              variant='flat'
            >
              <DropdownItem key='20'>20</DropdownItem>
              <DropdownItem key='50'>50</DropdownItem>
              <DropdownItem key='100'>100</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <p className='text-default-500 text-sm'>件表示</p>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          page={page}
          total={pages}
          isDisabled={pages < 1}
          onChange={(page) => setPage(page)}
        />
      </div>
    </div>
  );
}

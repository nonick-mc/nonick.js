'use client';

import { Icon } from '@/components/icon';
import {
  banLogSettingSchema,
  kickLogSettingSchema,
  msgDeleteLogSettingSchema,
  msgEditLogSettingSchema,
  timeoutLogSettingSchema,
  voiceLogSettingSchema,
} from '@/lib/database/src/schema/setting';
import {
  Accordion,
  AccordionItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type Selection,
  useDisclosure,
} from '@heroui/react';
import type { APIGuildChannel, GuildChannelType } from 'discord-api-types/v10';
import { createContext, useState } from 'react';
import { BanLogSettingForm } from './forms/ban';
import { KickLogSettingForm } from './forms/kick';
import { MsgDeleteLogSettingForm } from './forms/message-delete';
import { MsgEditLogSettingForm } from './forms/message-edit';
import { TimeoutLogSettingForm } from './forms/timeout';
import { VoiceLogSettingForm } from './forms/voice';
import type { getLogSettings } from './lib';

type Props = {
  channels: APIGuildChannel<GuildChannelType>[];
  settings: Awaited<ReturnType<typeof getLogSettings>>;
};

export const PropsContext = createContext<Pick<Props, 'channels'>>({
  channels: [],
});

export function FormContainer({ settings, ...props }: Props) {
  const [selectedKey, setSelectedKey] = useState<string | null>('timeout');
  const [hasFormChanges, setHasFormChanges] = useState<boolean>(false);
  const [pendingSelectionKey, setPendingSelectionKey] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleSelectionChange = (keys: Selection) => {
    const keysArray = Array.from(keys);

    if (keysArray.length === 0 || !hasFormChanges) {
      if (keysArray.length > 0) {
        const newKey = keysArray[0].toString();
        setSelectedKey(newKey);
        setHasFormChanges(false);
      } else {
        setSelectedKey(null);
        setHasFormChanges(false);
      }
      return;
    }

    const newKey = keysArray[0].toString();
    if (newKey !== selectedKey) {
      setPendingSelectionKey(newKey);
      onOpen();
    }
  };

  const handleConfirmSectionChange = () => {
    if (pendingSelectionKey) {
      setSelectedKey(pendingSelectionKey);
      setHasFormChanges(false);
    }
    onClose();
  };

  const handleFormChange = (hasChanges: boolean) => {
    setHasFormChanges(hasChanges);
  };

  return (
    <PropsContext value={props}>
      <Accordion
        variant='splitted'
        className='px-0 gap-3 pb-28'
        selectionMode='single'
        selectedKeys={selectedKey ? new Set([selectedKey]) : new Set([])}
        onSelectionChange={handleSelectionChange}
        disallowEmptySelection={true}
        itemClasses={{
          base: 'p-0',
          trigger: 'px-6 py-[18px] text-lg font-semibold',
          content: 'p-6 pt-[6px]',
        }}
      >
        <AccordionItem
          key='timeout'
          title='タイムアウト'
          startContent={<AccordionItemIcon icon='solar:clock-circle-bold' />}
        >
          <TimeoutLogSettingForm
            setting={timeoutLogSettingSchema.form.safeParse(settings.timeout).data ?? null}
            onFormChange={handleFormChange}
          />
        </AccordionItem>
        <AccordionItem
          key='kick'
          title='キック'
          startContent={<AccordionItemIcon icon='solar:sledgehammer-bold' />}
        >
          <KickLogSettingForm
            setting={kickLogSettingSchema.form.safeParse(settings.kick).data ?? null}
            onFormChange={handleFormChange}
          />
        </AccordionItem>
        <AccordionItem
          key='ban'
          title='BAN'
          startContent={<AccordionItemIcon icon='solar:sledgehammer-bold' />}
        >
          <BanLogSettingForm
            setting={banLogSettingSchema.form.safeParse(settings.ban).data ?? null}
            onFormChange={handleFormChange}
          />
        </AccordionItem>
        <AccordionItem
          key='voice'
          title='ボイスチャンネル'
          startContent={<AccordionItemIcon icon='solar:volume-loud-bold' />}
        >
          <VoiceLogSettingForm
            setting={voiceLogSettingSchema.form.safeParse(settings.voice).data ?? null}
            onFormChange={handleFormChange}
          />
        </AccordionItem>
        <AccordionItem
          key='message-edit'
          title='メッセージ編集'
          startContent={<AccordionItemIcon icon='solar:chat-round-line-bold' />}
        >
          <MsgEditLogSettingForm
            setting={msgEditLogSettingSchema.form.safeParse(settings.msgEdit).data ?? null}
            onFormChange={handleFormChange}
          />
        </AccordionItem>
        <AccordionItem
          key='message-delete'
          title='メッセージ削除'
          startContent={<AccordionItemIcon icon='solar:chat-round-line-bold' />}
        >
          <MsgDeleteLogSettingForm
            setting={msgDeleteLogSettingSchema.form.safeParse(settings.msgDelete).data ?? null}
            onFormChange={handleFormChange}
          />
        </AccordionItem>
      </Accordion>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalBody>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1 text-white'>
                  変更が保存されていません
                </ModalHeader>
                <ModalBody className='text-[#b5bac1]'>
                  <p>保存されてない変更があります。保存せずに編集を終了してよろしいですか？</p>
                </ModalBody>
                <ModalFooter>
                  <Button color='default' variant='flat' onPress={onClose}>
                    キャンセル
                  </Button>
                  <Button color='danger' onPress={handleConfirmSectionChange}>
                    続行
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </ModalBody>
      </Modal>
    </PropsContext>
  );
}

function AccordionItemIcon({ icon }: { icon: string }) {
  return (
    <div className='flex size-10 bg-content2 rounded-full justify-center items-center'>
      <Icon icon={icon} className='text-2xl text-current' />
    </div>
  );
}

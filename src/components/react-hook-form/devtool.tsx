'use client';

import { DevTool } from '@hookform/devtools';
import { useFormContext } from 'react-hook-form';

export function FormDevTool() {
  if (process.env.NODE_ENV !== 'development') return null;

  const form = useFormContext();
  return <DevTool control={form.control} placement='top-left' />;
}

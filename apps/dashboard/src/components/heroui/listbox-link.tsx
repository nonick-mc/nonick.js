import Link, { type LinkProps } from 'next/link';

export function LinkForListbox({
  ...props
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps<string>> &
  LinkProps<string> & { textValue: string | undefined }) {
  const { textValue, ...otherProps } = props;
  return <Link {...otherProps} />;
}

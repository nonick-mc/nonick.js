import { signOut, useSession } from 'next-auth/react';
import { type ReactNode, useEffect } from 'react';

export function CheckSessionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session.error) {
      console.log(`This user has been forcibly signed out. Reason: ${session.error}`);
      signOut();
    }
  }, [session?.error, status]);

  return <>{children}</>;
}

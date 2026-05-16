'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface SessionContextType {
  username: string | null;
  setUsername: (name: string | null) => void;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  username: null,
  setUsername: () => {},
  logout: async () => {},
});

export function SessionProvider({
  children,
  initialUsername,
}: {
  children: ReactNode;
  initialUsername: string | null;
}) {
  const [username, setUsername] = useState<string | null>(initialUsername);

  const logout = useCallback(async () => {
    const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    await fetch(`${bp}/api/auth/logout`, { method: 'POST' });
    setUsername(null);
    window.location.href = `${bp}/login`;
  }, []);

  return (
    <SessionContext.Provider value={{ username, setUsername, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

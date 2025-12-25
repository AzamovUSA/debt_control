import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: TelegramWebAppUser | null;
  userId: string | null;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  userId: null,
  isReady: false,
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramWebAppUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand();
      setWebApp(tg);

      const tgUser = tg.initDataUnsafe?.user;

      if (tgUser) {
        setUser(tgUser);
        initializeUser(tgUser);
      } else {
        const mockUser: TelegramWebAppUser = {
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
        };
        setUser(mockUser);
        initializeUser(mockUser);
      }
    } else {
      const mockUser: TelegramWebAppUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
      };
      setUser(mockUser);
      initializeUser(mockUser);
    }
  }, []);

  const initializeUser = async (tgUser: TelegramWebAppUser) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', tgUser.id)
        .maybeSingle();

      if (existingUser) {
        setUserId(existingUser.id);
      } else {
        const displayName = tgUser.last_name
          ? `${tgUser.first_name} ${tgUser.last_name}`
          : tgUser.first_name;

        const { data: newUser, error } = await supabase
          .from('users')
          .insert({
            telegram_id: tgUser.id,
            name: displayName,
            is_premium: tgUser.is_premium || false,
          })
          .select('id')
          .single();

        if (error) {
          console.error('Error creating user:', error);
        } else if (newUser) {
          setUserId(newUser.id);
        }
      }

      setIsReady(true);
    } catch (error) {
      console.error('Error initializing user:', error);
      setIsReady(true);
    }
  };

  return (
    <TelegramContext.Provider value={{ webApp, user, userId, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
};

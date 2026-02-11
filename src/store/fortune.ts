import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FortuneState {
    isUsed: boolean;
    lastFortuneDate: string | null;
    fortuneData: any | null;
    setFortune: (data: any) => void;
    checkIsUsed: () => void;
}

export const useFortuneStore = create<FortuneState>()(
    persist(
        (set, get) => ({
            isUsed: false,
            lastFortuneDate: null,
            fortuneData: null,
            setFortune: (data) => {
                const today = new Date().toISOString().split('T')[0];
                set({ 
                    fortuneData: data, 
                    lastFortuneDate: today,
                    isUsed: true 
                });
            },
            checkIsUsed: () => {
                const today = new Date().toISOString().split('T')[0];
                const { lastFortuneDate } = get();
                if (lastFortuneDate === today) {
                    set({ isUsed: true });
                } else {
                    set({ isUsed: false });
                }
            },
        }),
        {
            name: 'fortune-storage', // 로컬 스토리지 키 이름
        }
    )
);
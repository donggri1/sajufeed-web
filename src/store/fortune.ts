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
                // 테스트를 위해 일시적으로 무력화: 항상 false로 설정
                set({ isUsed: false });

                /* 원래 로직:
                const today = new Date().toISOString().split('T')[0];
                const { lastFortuneDate } = get();
                if (lastFortuneDate === today) {
                    set({ isUsed: true });
                } else {
                    set({ isUsed: false });
                }
                */
            },
        }),
        {
            name: 'fortune-storage', // 로컬 스토리지 키 이름
        }
    )
);
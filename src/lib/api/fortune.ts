import apiClient from './client';
import { DailyFortuneResponse, WebtoonResponse, FortuneHistoryResponse } from '@/types/fortune';

/**
 * 오늘의 운세 조회
 * @param mock - true일 경우 Mock 데이터 반환 (백엔드 미구현 시 사용)
 */
export async function getDailyFortune(mock: boolean = false): Promise<DailyFortuneResponse> {
    if (mock) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 1,
                    totalScore: 85,
                    wealthScore: 90,
                    loveScore: 75,
                    healthScore: 80,
                    wishScore: 88,
                    summary: "오늘은 금전운이 매우 좋은 날입니다. 투자를 고려해보세요!",
                    description: "전반적으로 기운이 상승하는 날입니다. 특히 재물과 관련된 운이 따르니, 평소 망설이던 투자가 있다면 오늘 시도해보는 것도 좋겠습니다. 다만 애정운은 평이하니 연인과의 말다툼은 피하는 것이 좋습니다.",
                    details: null,
                    luckyColor: "Gold",
                    luckyItem: "동전",
                    luckyDirection: "동쪽",
                    date: new Date().toISOString().split('T')[0],
                });
            }, 500); // 0.5초 지연 시뮬레이션
        });
    }

    const { data } = await apiClient.get<DailyFortuneResponse>('/fortune/daily');
    return data;
}

/**
 * 오늘의 운세 생성
 */
export async function createDailyFortune(): Promise<DailyFortuneResponse> {
    const { data } = await apiClient.post<DailyFortuneResponse>('/fortune/daily');
    return data;
}

/**
 * 웹툰 생성
 */
export async function createWebtoon(fortuneId: number): Promise<WebtoonResponse> {
    const { data } = await apiClient.post<WebtoonResponse>(`/fortune/${fortuneId}/webtoon`);
    return data;
}

/**
 * 웹툰 조회
 */
export async function getWebtoon(fortuneId: number): Promise<WebtoonResponse | null> {
    const { data } = await apiClient.get<WebtoonResponse>(`/fortune/${fortuneId}/webtoon`);
    return data;
}

/**
 * 운세 히스토리 조회
 */
export async function getFortuneHistory(page: number = 1, limit: number = 10): Promise<FortuneHistoryResponse> {
    const { data } = await apiClient.get<FortuneHistoryResponse>('/fortune/history', {
        params: { page, limit },
    });
    return data;
}

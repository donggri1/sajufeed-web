export interface DailyFortuneResponse {
    // ID
    id: number;

    // 점수 (0~100)
    totalScore: number;      // 종합운
    wealthScore: number;     // 재물운
    loveScore: number;       // 애정운
    healthScore: number;     // 건강운 (소망운 대신 건강운으로 변경 가능성 고려, 일단 소망운=Health로 매핑하거나 별도 필드)
    wishScore: number;       // 소망운

    // 운세 내용
    summary: string;         // 한줄 요약
    description: string;     // 상세 내용
    details: string | null;  // 상세 분석 (재물/애정/건강/직장)

    // 럭키 아이템
    luckyColor: string;
    luckyItem: string;
    luckyDirection: string;

    // 날짜
    date: string;            // YYYY-MM-DD

    // 웹툰 (옵션)
    webtoon?: WebtoonResponse | null;
}

export interface WebtoonPanelResponse {
    id: number;
    pageNumber: number;
    imagePath: string;
    description: string | null;
}

export interface WebtoonResponse {
    id: number;
    title: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    panels: WebtoonPanelResponse[];
    createdAt: string;
}

export interface FortuneHistoryResponse {
    items: DailyFortuneResponse[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

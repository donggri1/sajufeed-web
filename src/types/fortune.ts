export interface DailyFortuneResponse {
    // 점수 (0~100)
    totalScore: number;      // 종합운
    wealthScore: number;     // 재물운
    loveScore: number;       // 애정운
    healthScore: number;     // 건강운 (소망운 대신 건강운으로 변경 가능성 고려, 일단 소망운=Health로 매핑하거나 별도 필드)
    wishScore: number;       // 소망운

    // 운세 내용
    summary: string;         // 한줄 요약
    description: string;     // 상세 내용

    // 럭키 아이템
    luckyColor: string;
    luckyItem: string;
    luckyDirection: string;

    // 날짜
    date: string;            // YYYY-MM-DD
}

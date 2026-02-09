import { SajuStatCard } from "../molecules/SajuStatCard";

export function SajuSummaryGrid() {
    // 나중에 백엔드 데이터로 교체될 부분
    const stats = [
        { title: "오늘의 총운", value: "85점", description: "새로운 시작에 길한 날", icon: "✨", color: "border-t-purple-500" },
        { title: "재물운", value: "매우 좋음", description: "뜻밖의 수익 예상", icon: "💰", color: "border-t-yellow-500" },
        { title: "애정운", value: "보통", description: "차분한 대화가 필요", icon: "❤️", color: "border-t-pink-500" },
        { title: "직업운", value: "안정적", description: "노력한 만큼의 결실", icon: "💼", color: "border-t-blue-500" },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <SajuStatCard key={stat.title} {...stat} borderColor={stat.color} />
            ))}
        </div>
    );
}
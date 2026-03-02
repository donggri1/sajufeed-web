import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    title: string;
    value: string | number;
    description: string;
    icon: string;
    borderColor?: string;
}

export function SajuStatCard({ title, value, description, icon, borderColor = "border-t-purple-500" }: Props) {
    // 테마별 그림자 및 글로우 효과 매핑
    const themeStyles: Record<string, string> = {
        'border-t-purple-500': 'shadow-purple-500/10 hover:shadow-purple-500/20 group-hover:bg-purple-50/50',
        'border-t-yellow-500': 'shadow-yellow-500/10 hover:shadow-yellow-500/20 group-hover:bg-yellow-50/50',
        'border-t-pink-500': 'shadow-pink-500/10 hover:shadow-pink-500/20 group-hover:bg-pink-50/50',
        'border-t-blue-500': 'shadow-blue-500/10 hover:shadow-blue-500/20 group-hover:bg-blue-50/50',
    };

    const glowClass = themeStyles[borderColor] || 'shadow-indigo-500/10 hover:shadow-indigo-500/20 group-hover:bg-indigo-50/50';

    return (
        <Card className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-md border border-white/40 shadow-lg ${glowClass} rounded-2xl`}>
            {/* 상단 포인트 라인 */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-current ${borderColor.replace('border-t-', 'text-')}`}></div>

            {/* 배경 은은한 빛샘 효과 */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-current opacity-[0.03] rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-300"></div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 pt-6">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <span className="text-2xl">{icon}</span>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-3xl font-extrabold text-slate-800 tracking-tight group-hover:scale-105 transition-transform origin-left duration-300">{value}</div>
                <p className="text-sm text-slate-500 mt-2 font-medium">{description}</p>
            </CardContent>
        </Card>
    );
}
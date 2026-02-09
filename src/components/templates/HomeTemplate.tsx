import { SajuSummaryGrid } from "../organisms/SajuSummaryGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface HomeTemplateProps {
    nickname: string;
    children?: React.ReactNode; // 추가적인 상세 분석 내용
}

export function HomeTemplate({ nickname }: HomeTemplateProps) {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    {nickname}님의 2026년 운세 🔮
                </h2>
                <Badge variant="secondary" className="text-sm px-4 py-1">병오년 (丙午年)</Badge>
            </div>

            <SajuSummaryGrid />

            <Tabs defaultValue="total" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="total">종합 분석</TabsTrigger>
                    <TabsTrigger value="period">시기별 운세</TabsTrigger>
                </TabsList>
                <TabsContent value="total" className="border rounded-xl bg-white p-6 shadow-sm">
                    {/* 여기에 상세 분석 Organism이 들어갑니다. */}
                    <p className="text-slate-600">상세한 사주 분석 결과가 여기에 표시됩니다.</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}
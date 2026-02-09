import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    title: string;
    value: string | number;
    description: string;
    icon: string;
    borderColor?: string;
}

export function SajuStatCard({ title, value, description, icon, borderColor = "border-t-purple-500" }: Props) {
    return (
        <Card className={`border-t-4 ${borderColor} shadow-sm`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <span className="text-2xl">{icon}</span>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}
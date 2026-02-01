import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignupForm from "./_component/SignupForm";

export default function SignupPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">회원가입 🔮</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                </CardContent>
            </Card>
        </main>
    );
}
import { ProfileForm } from '@/components/features/profile/ProfileForm';

export default function ProfilePage() {
    return (
        <div className="bg-slate-50 min-h-[calc(100vh-64px)]">
            <div className="container mx-auto max-w-2xl px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-slate-900">내 정보</h1>
                <ProfileForm />
            </div>
        </div>
    );
}

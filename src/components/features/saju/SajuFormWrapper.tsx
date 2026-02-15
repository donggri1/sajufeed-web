"use client";

import dynamic from "next/dynamic";

// Radix UI의 hydration 오류 방지를 위해 클라이언트 전용 렌더링
const SajuForm = dynamic(
    () => import("@/components/features/saju/SajuForm"),
    { ssr: false }
);

export default function SajuFormWrapper() {
    return <SajuForm />;
}

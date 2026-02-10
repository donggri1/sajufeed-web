import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-slate-50">
            <div className="container px-4 md:px-8 py-12 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            SAJUFEED
                        </span>
                        <p className="mt-4 text-sm text-slate-500 max-w-xs">
                            SAJUFEED는 당신의 사주를 분석하여 매일 맞춤형 운세와 인사이트를 제공하는 개인화 운세 서비스입니다.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">서비스</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/daily" className="text-sm text-slate-600 hover:text-indigo-600">오늘의 운세</Link></li>
                            <li><Link href="/saju" className="text-sm text-slate-600 hover:text-indigo-600">사주</Link></li>
                            <li><Link href="/tojeong" className="text-sm text-slate-600 hover:text-indigo-600">토정비결</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">고객지원</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/notice" className="text-sm text-slate-600 hover:text-indigo-600">공지사항</Link></li>
                            <li><Link href="/faq" className="text-sm text-slate-600 hover:text-indigo-600">자주 묻는 질문</Link></li>
                            <li><Link href="/contact" className="text-sm text-slate-600 hover:text-indigo-600">문의하기</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8">
                    <p className="text-sm text-slate-400 text-center">
                        © 2026 SAJUFEED. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

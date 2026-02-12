type Props = {
    children: React.ReactNode;
    modal: React.ReactNode; // @modal 폴더의 내용이 일로 들어옵니다.
};

export default function BeforeLoginLayout({ children, modal }: Props) {
    return (
        <div className="min-h-screen bg-slate-50">
            {children}
            {modal}
        </div>
    );
}
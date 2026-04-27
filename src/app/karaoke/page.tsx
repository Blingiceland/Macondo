import StickyNav from "@/components/StickyNav";

export default function KaraokePage() {
    return (
        <main className="min-h-screen bg-[#0f0a08] flex flex-col pt-[96px]">
            <StickyNav />
            <div className="flex-1 w-full relative" style={{ height: "calc(100vh - 96px)" }}>
                <iframe 
                    src="https://pablodiscobar.is/karaoke" 
                    className="w-full h-full border-0"
                    title="Pablo Discobar Karaoke"
                    allowFullScreen
                />
            </div>
        </main>
    );
}

import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-3 py-6 sm:px-4 sm:py-10">
      <Card className="w-full max-w-[420px] px-6 py-10 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-[#FFF0F1] flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-[#F04452]" aria-hidden="true" />
        </div>

        <span className="inline-flex items-center rounded-full bg-[#F2F4F6] px-3 py-1 text-[12px] font-bold text-[#6B7684] mb-2">
          404 Not Found
        </span>

        <h1 className="text-[20px] sm:text-[22px] font-bold leading-[1.35] tracking-[-0.015em] text-[#191F28] mb-2">
          존재하지 않는 사용자 페이지예요
        </h1>

        <p className="text-[13.5px] sm:text-[14px] font-normal leading-[1.6] text-[#6B7684] break-keep mb-6 px-2">
          입력하신 이름(Display Name)의 사용자를 찾을 수 없어요. 주소를 다시 확인해 주세요.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full h-[48px] rounded-[14px] bg-[#3182F6] hover:bg-[#1B64DA] text-white text-[15px] font-bold transition-all active:scale-[0.98]"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          마이페이지 홈으로 이동하기
        </Link>
      </Card>
    </div>
  );
}

import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useConfirmPayment } from "../../../../hooks/user/userHook";
import { ArrowRight, Check } from "lucide-react";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const navigate = useNavigate();

  const { mutate } = useConfirmPayment();

  useEffect(() => {
    if (sessionId) {
      mutate(sessionId, {
        onSuccess: () => {
          console.log("Payment confirmed");
        },
        onError: () => {
          console.log("Confirm failed");
        },
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#070B1E] flex items-center justify-center p-6 font-['Inter','Segoe_UI',sans-serif]">
      <div className="bg-gradient-to-b from-[#0D1230] to-[#0A0E27] border border-[rgba(100,116,180,0.15)] rounded-3xl py-14 px-12 max-w-[480px] w-full text-center shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
        {/* Checkmark Icon with Rings */}
        <div className="flex justify-center mb-9">
          <div className="relative w-[140px] h-[140px]">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
            {/* Middle ring */}
            <div className="absolute inset-3 rounded-full border-2 border-emerald-500/30" />
            {/* Inner glowing circle */}
            <div className="absolute inset-6 rounded-full bg-[radial-gradient(circle_at_40%_35%,#34D399,#10B981_60%,#059669_100%)] flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.35),0_0_60px_rgba(16,185,129,0.15)]">
              {/* Check icon circle */}
              <div className="w-11 h-11 rounded-full border-2 border-white/60 flex items-center justify-center">
                <Check className="w-[22px] h-[22px] text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-[32px] font-bold text-white leading-[1.3] mb-4">
          Payment Done
          <br />
          Successfully
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-sm leading-relaxed mb-10">
          go and explore it the awesome designing platform
        </p>

        {/* Go to Dashboard Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="group w-full py-4 px-8 border-none rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-base font-semibold cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:from-emerald-600 hover:to-emerald-500 hover:shadow-[0_6px_28px_rgba(16,185,129,0.45)] hover:-translate-y-px"
        >
          Go to Dashboard
          <ArrowRight className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
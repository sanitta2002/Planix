
import { Check } from 'lucide-react';
import { useCreateSubscription, useGetActivePlan, useUpgradeSubscription, useWorkspacePaymentDetails } from '../../../hooks/user/userHook';
import { useState } from 'react';
import { toast } from 'sonner';
import { createCheckoutSession } from '../../../Service/user/userService';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/Store';
import { useSearchParams } from 'react-router';


interface Plan {
    id: string;
    name: string;
    price: number;
    features: string[];
    subtitle?: string;
    recommended?: boolean;
    isActive: boolean;
}



const SubscriptionPage = () => {
    const [selectedPlan, setSelectedPlan] = useState<string>('');

    const { data, isLoading } = useGetActivePlan();
    const plans: Plan[] =
        data?.data?.filter((p: Plan) => p.isActive).slice(0, 3) || [];

    const currentWorkspace = useSelector(
        (state: RootState) => state.workspace.currentWorkspace
    );

    const [searchParams] = useSearchParams();
    const searchParamWorkSpaceId = searchParams.get("workspaceId")

    const workspaceId = searchParamWorkSpaceId ?? currentWorkspace?.id;
    const { mutate: createSubscribtion } = useCreateSubscription()
    const { mutate: upgradeSubscription } = useUpgradeSubscription();

    const { data: paymentData } = useWorkspacePaymentDetails(workspaceId ?? '');
    const subscription = paymentData?.data;


    // const navigate = useNavigate()


    if (isLoading) {
        return <p className="text-white text-center mt-10">Loading plans...</p>;
    }

    const handleContinue = () => {
        if (!selectedPlan) {
            toast.error("Select plan")
            return
        }
        if (!workspaceId) {
            toast.error('Workspace missing')
            return
        }

        const mutation = subscription?.plan ? upgradeSubscription : createSubscribtion;

        mutation({
            planId: selectedPlan,
            workspaceId: workspaceId!,
        }, {
            onSuccess: async (res) => {
                console.log('sub created', res)
                const subscriptionId = res.data.id
                try {
                    const session = await createCheckoutSession({
                        planId: selectedPlan,
                        subscriptionId,
                        workspaceId
                    })
                    window.location.href = session.url
                } catch (error) {
                    toast.error("Payment initialization failed");
                    console.log(error)
                }

            },
            onError: () => {
                toast.error("Payment initialization failed");
            }
        })
    }

    return (

        <div className="min-h-screen  bg-[#0A0E27] text-slate-200 p-4 md:p-8 font-sans">
            {/* Small "sub" label at top-left */}


            {/* Main container */}
            <div className="max-w-6xl mx-auto">
                {/* Title */}
                <h1
                    className="text-center text-3xl md:text-5xl font-bold italic mb-12"
                    style={{
                        background: 'linear-gradient(135deg, #7E3FF2, #626FF6, #7E3FF2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Choose Your Plan
                </h1>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {plans.map((plan, index) => {
                        const isSelected = selectedPlan === plan.id;
                        const isRecommended = plan.recommended ?? index === 1;

                        return (
                            <div
                                key={plan.id}
                                className="relative"
                            >
                                {/* Recommended Badge */}
                                {isRecommended && (
                                    <div className="flex justify-center -mb-3 relative z-10">
                                        <span className="px-5 py-1 rounded-full bg-[#626FF6] text-white text-xs font-semibold tracking-wide">
                                            Recommended
                                        </span>
                                    </div>
                                )}

                                {/* Card */}
                                <div
                                    className={`
                                        rounded-2xl p-6 md:p-8 border transition-all duration-300
                                        ${isRecommended
                                            ? 'bg-gradient-to-b from-[#131A3A] to-[#0D1230] border-[#626FF6]/40 shadow-lg shadow-[#626FF6]/10'
                                            : 'bg-[#0D1230]/80 border-slate-700/40'
                                        }
                                        ${isSelected ? 'ring-1 ring-[#626FF6]/30' : ''}
                                    `}
                                >
                                    {/* Plan Name & Subtitle */}
                                    <div className="text-center mb-6">
                                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                                            {plan.name}
                                        </h2>
                                        <p className="text-slate-400 text-sm">
                                            {plan.subtitle}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline justify-start mb-8">
                                        <span className="text-4xl md:text-5xl font-bold text-white">
                                            ${plan.price}
                                        </span>
                                        <span className="text-slate-400 ml-2 text-sm">
                                            /month
                                        </span>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3.5 mb-8">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3">
                                                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-green-400" />
                                                </div>
                                                <span className="text-slate-300 text-sm">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Select / Selected Button */}
                                    <button
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`
                                            w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer
                                            ${isSelected
                                                ? 'bg-[#626FF6]/20 text-[#626FF6] border border-[#626FF6]/30'
                                                : 'bg-[#1A1F3D] text-slate-300 border border-slate-700/50 hover:border-slate-600 hover:bg-[#1E2445]'
                                            }
                                        `}
                                    >
                                        {isSelected ? 'Selected' : 'Select Plan'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Continue Button */}
                <div className="flex justify-end mt-8">
                    <button onClick={handleContinue} className="px-10 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm hover:from-green-400 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-green-500/20 cursor-pointer">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;

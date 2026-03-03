import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    useAcceptInvite,
    useCompleteProfile,
} from "../../../hooks/user/userHook";
import { setAccessToken } from "../../../store/tokenSlice";
import { setAuthUser, type AuthUser } from "../../../store/authSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const AcceptInvitePage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showProfileForm, setShowProfileForm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        password: "",
    });

    //  Accept Invite Query
    const { data, isLoading, isError } = useAcceptInvite(token || "");

    //  Complete Profile Mutation
    const {
        mutate: completeProfileMutation,
        isPending: isCompletingProfile,
    } = useCompleteProfile();

    const completeLogin = (user: AuthUser, accessToken: string) => {
        dispatch(setAccessToken(accessToken));

        dispatch(
            setAuthUser({
                ...user,
                hasWorkspace: true,
            })
        );

        toast.success("Joined workspace successfully!");
        navigate("/");
    };

    // 🔹 Handle invite validation
    useEffect(() => {
        if (!data?.data) return;

        if (data.data.needsProfileCompletion) {
            setShowProfileForm(true);
        } else {
            const { accessToken, user } = data.data;
            completeLogin(user, accessToken);
        }
    }, [data]);

    // 🔹 Handle profile completion
    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.password) {
            toast.error("Please fill all fields");
            return;
        }

        if (!token) return;

        completeProfileMutation(
            {
                token,
                data: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    password: formData.password,
                },
            },
            {
                onSuccess: (res) => {
                    const { accessToken, user } = res.data;
                    completeLogin(user, accessToken);
                },
                onError: () => {
                    toast.error("Failed to complete profile");
                },
            }
        );
    };

    // 🔹 Loading Screen
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <Loader2 className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    // 🔹 Error Screen
    if (isError || !token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="bg-[#111827] p-8 rounded-2xl text-center">
                    <h2 className="text-xl font-semibold mb-3">
                        Invalid or Expired Invitation
                    </h2>
                    <button
                        onClick={() => navigate("/login")}
                        className="mt-4 px-6 py-2 bg-indigo-600 rounded-xl"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    // 🔹 Profile Modal
    if (showProfileForm) {
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
                <div className="bg-[#0f1729] w-full max-w-md p-8 rounded-3xl">
                    <h2 className="text-xl text-white mb-6">
                        Complete Your Profile
                    </h2>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={(e) =>
                                setFormData({ ...formData, firstName: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#1a2340] text-white"
                        />

                        <input
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) =>
                                setFormData({ ...formData, lastName: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#1a2340] text-white"
                        />

                        <input
                            type="password"
                            placeholder="Create Password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#1a2340] text-white"
                        />

                        <button
                            type="submit"
                            disabled={isCompletingProfile}
                            className="w-full py-3 bg-[#606cf6] rounded-xl text-white"
                        >
                            {isCompletingProfile ? "Processing..." : "Complete & Join"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

};
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { redeemBetaCode, type BetaCodeState } from "@/app/actions/redeemBetaCode";
import { KeyRound } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex-shrink-0 px-4 py-2.5 rounded-lg bg-white/[0.08] border border-white/[0.12] text-sm font-medium text-[#f0ede8] hover:bg-white/[0.12] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
            {pending ? "…" : "Débloquer"}
        </button>
    );
}

const initialState: BetaCodeState = { error: null };

export function BetaCodeForm() {
    const [state, formAction] = useFormState(redeemBetaCode, initialState);

    return (
        <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5 mb-3">
                <KeyRound className="w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
                <span className="text-xs text-white/35">Vous avez un pass d&apos;accès Bêta ?</span>
            </div>
            <form action={formAction} className="flex gap-2">
                <input
                    type="text"
                    name="beta_code"
                    placeholder="Code bêta"
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#f0ede8] placeholder-white/20 focus:outline-none focus:border-white/[0.18] focus:bg-white/[0.06] transition-all duration-200"
                />
                <SubmitButton />
            </form>
            {state?.error && (
                <p className="mt-2 text-xs text-red-400/75">{state.error}</p>
            )}
        </div>
    );
}

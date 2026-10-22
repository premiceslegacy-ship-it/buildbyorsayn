"use client";

import { useFormState, useFormStatus } from "react-dom";
import { redeemBetaCode, type BetaCodeState } from "@/app/actions/redeemBetaCode";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="btn btn--g">
            {pending ? "Vérification" : "Débloquer"}
        </button>
    );
}

const initialState: BetaCodeState = { error: null };

export function BetaCodeForm() {
    const [state, formAction] = useFormState(redeemBetaCode, initialState);

    return (
        <form action={formAction} className="px-beta__form">
            <label htmlFor="beta_code">Tu as un code d&apos;accès bêta ?</label>
            <div className="px-beta__ligne">
                <input
                    id="beta_code"
                    type="text"
                    name="beta_code"
                    placeholder="Ton code bêta"
                    autoComplete="off"
                    spellCheck={false}
                />
                <SubmitButton />
            </div>
            {state?.error ? <p role="alert" className="px-erreur">{state.error}</p> : null}
        </form>
    );
}

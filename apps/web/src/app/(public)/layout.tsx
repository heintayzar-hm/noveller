import { isAuthorized } from "@web/lib/auth"
import { redirect } from "next/navigation"

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
    const isLoggedIn = isAuthorized()

    if (isLoggedIn) {
        redirect("/")
    }

    return (
        <>
            {children}
        </>
    )
}

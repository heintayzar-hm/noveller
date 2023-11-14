"use client"

import useSession from "@web/hooks/useSession"

export default function ProfilePage() {
    const { user } = useSession()
    return (
        <>
            <h1>Profile</h1>
        </>
    )
}

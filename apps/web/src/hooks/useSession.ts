import { SessionContext } from "@web/app/context/providers/session-context"
import { useContext } from "react"

const useSession = () => {
    const [session, dispatch] = useContext(SessionContext);
    const user = session?.user;
    const isLoggedIn = session?.isLoggedIn;
    return {session, dispatch, user , isLoggedIn}
}

export default useSession;

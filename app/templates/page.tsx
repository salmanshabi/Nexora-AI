import { auth } from "@/auth";
import TemplatesClient from "./TemplatesClient";

export default async function TemplatesPage() {
    // Templates are publicly browsable — no redirect for guests.
    // Auth is enforced by the builder when the user clicks "Use this template".
    const session = await auth().catch(() => null);

    const user = session?.user
        ? { name: session.user.name || "User", email: session.user.email || "" }
        : null;

    return <TemplatesClient user={user} />;
}

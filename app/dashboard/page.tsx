import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

const prisma = new PrismaClient();

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/sign-in");
    }

    const projects = await prisma.project.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
    });

    return (
        <DashboardClient
            user={{ name: session.user.name || "User", email: session.user.email || "" }}
            projects={projects}
        />
    );
}

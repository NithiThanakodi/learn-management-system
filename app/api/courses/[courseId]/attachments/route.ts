import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        const { url } = await req.json();

        if (!userId) {
            return new NextResponse("UnAuthorized", { status: 401 });
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })
        if (!courseOwner) {
            return new NextResponse("UnAuthorized", { status: 401 });
        }

        const attachment = await db.attachment.create({
            data: {
                name: url.split("/").pop(),
                url,
                courseId: params.courseId,
            }
        })

        return NextResponse.json(attachment);

    } catch (error) {
        console.log("[COURSES_ID_ATTACHMENTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
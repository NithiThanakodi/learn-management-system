import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category;
    chapters: Chapter[];
    progress: number | null;
}

type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgerss: CourseWithProgressWithCategory[];

}

export const getDashboardCourses = async (userid: string): Promise<DashboardCourses> => {

    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userid
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            },
                        }
                    }
                }
            }
        })

        const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userid, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter((course) => course.progress === 100);
        const coursesInProgerss = courses.filter((course) => (course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesInProgerss
        }

    } catch (error) {
        console.log("GET_DASHBOARD_COURSED", error)
        return {
            completedCourses: [],
            coursesInProgerss: [],
        }
    }
}
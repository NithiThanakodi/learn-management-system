import React from "react";
import { auth } from "@clerk/nextjs";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CourseList from "@/components/courses-list";
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";
import { InfoCard } from "./_components/info-card";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgerss } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={Clock} label="In Progress" numberOfItems={coursesInProgerss.length} />
        <InfoCard icon={CheckCircle} label="Completed Progress" numberOfItems={completedCourses.length} variant="success" />
      </div>
      <CourseList items={[...completedCourses, ...coursesInProgerss]} />
    </div>
  )
}

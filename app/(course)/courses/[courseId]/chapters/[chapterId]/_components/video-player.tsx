"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


interface VideoPlayerProps {
    chapterId: string
    title: string
    courseId: string
    nextChapter?: string
    playbackId: string
    isLocked: boolean
    completeOnEnd: boolean
}


const VideoPlayer = ({
    chapterId,
    title,
    courseId,
    nextChapter,
    playbackId,
    isLocked,
    completeOnEnd,
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onEnded = async () => {
        try {
            // setIsLoading(true);

            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: true
            });

            if (!nextChapter) {
                confetti.onOpen();
            }
            else {
                router.push(`/courses/${courseId}/chapters/${nextChapter}`);
            }

            toast.success("Progress updated");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">
                        This chapter is locked
                    </p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer title={title} className={cn(!isReady && "hidden")} onCanPlay={() => setIsReady(true)} onEnded={onEnded} autoPlay playbackId={playbackId} />
            )}
        </div>
    )
}

export default VideoPlayer
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import toast from 'react-hot-toast';
import axios from 'axios';




const CourseEnrollButton = ({ courseId, price }: { courseId: string, price: number }) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`/api/courses/${courseId}/checkout`);
            window.location.assign(response.data.url);

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Button disabled={isLoading} onClick={onClick} className='w-full md:w-auto' size="sm">
            Enroll for {formatPrice(price)}
        </Button>
    )
}

export default CourseEnrollButton

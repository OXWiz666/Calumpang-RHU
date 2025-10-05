import React, { useState, useEffect } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    isSameISOWeek,
    isBefore,
    subDays,
} from "date-fns";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const CustomCalendar = ({ selectedDate, onDateSelect, hasPrograms = [], serviceId = null, subserviceId = null }) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [dateAvailability, setDateAvailability] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch date availability for the current month
    const fetchDateAvailability = async () => {
        if (!serviceId) return;
        
        setLoading(true);
        try {
            const startDate = startOfMonth(currentMonth);
            const endDate = endOfMonth(currentMonth);
            
            const response = await fetch(`/patient/get-date-availability?start_date=${format(startDate, 'yyyy-MM-dd')}&end_date=${format(endDate, 'yyyy-MM-dd')}&service_id=${serviceId}`);
            const data = await response.json();
            
            if (data.availability) {
                const availabilityMap = {};
                data.availability.forEach(item => {
                    availabilityMap[item.date] = item;
                });
                setDateAvailability(availabilityMap);
            }
        } catch (error) {
            console.error('Error fetching date availability:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch availability when month or service changes
    useEffect(() => {
        fetchDateAvailability();
    }, [currentMonth, serviceId, subserviceId]);

    // Get days of current month view
    const getDaysInMonth = () => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    };

    // Get days from previous month to fill first week
    const getPreviousMonthDays = () => {
        const firstDayOfMonth = startOfMonth(currentMonth);
        const dayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

        if (dayOfWeek === 0) return []; // Sunday, no need for previous month days

        const prevMonthEnd = new Date(firstDayOfMonth);
        prevMonthEnd.setDate(0); // Last day of previous month

        const daysNeeded = dayOfWeek;
        const result = [];

        for (let i = 0; i < daysNeeded; i++) {
            const day = new Date(prevMonthEnd);
            day.setDate(prevMonthEnd.getDate() - i);
            result.unshift(day);
        }

        return result;
    };

    // Get days from next month to fill last week
    const getNextMonthDays = () => {
        const lastDayOfMonth = endOfMonth(currentMonth);
        const dayOfWeek = lastDayOfMonth.getDay(); // 0 = Sunday, 6 = Saturday

        if (dayOfWeek === 6) return []; // Saturday, no need for next month days

        const daysNeeded = 6 - dayOfWeek;
        const result = [];

        for (let i = 1; i <= daysNeeded; i++) {
            const day = new Date(lastDayOfMonth);
            day.setDate(lastDayOfMonth.getDate() + i);
            result.push(day);
        }

        return result;
    };

    const previousMonth = (e) => {
        e.preventDefault();
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = (e) => {
        e.preventDefault();
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const hasProgram = (date) => {
        return hasPrograms.some((programDate) =>
            isSameDay(new Date(programDate), date)
        );
    };

    const hasProgram2 = (dayCheck, daysArray = []) => {
        // Check if this day is in your target days
        const dayName = format(dayCheck, "EEEE");

        return daysArray.includes(dayName);
    };

    // Get availability status for a specific date
    const getAvailabilityStatus = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const availability = dateAvailability[dateStr];
        
        if (!availability) return 'unknown';
        
        if (availability.appointment_count >= 20) return 'full';
        if (availability.appointment_count >= 15) return 'limited';
        if (availability.appointment_count >= 10) return 'moderate';
        return 'available';
    };

    // Get availability icon for a specific date
    const getAvailabilityIcon = (date) => {
        const status = getAvailabilityStatus(date);
        
        switch (status) {
            case 'available':
                return <CheckCircle className="h-3 w-3 text-green-500" />;
            case 'moderate':
                return <AlertCircle className="h-3 w-3 text-yellow-500" />;
            case 'limited':
                return <AlertCircle className="h-3 w-3 text-orange-500" />;
            case 'full':
                return <XCircle className="h-3 w-3 text-red-500" />;
            default:
                return null;
        }
    };

    // Get availability color for a specific date
    const getAvailabilityColor = (date) => {
        const status = getAvailabilityStatus(date);
        
        switch (status) {
            case 'available':
                return 'bg-green-100 border-green-300';
            case 'moderate':
                return 'bg-yellow-100 border-yellow-300';
            case 'limited':
                return 'bg-orange-100 border-orange-300';
            case 'full':
                return 'bg-red-100 border-red-300';
            default:
                return '';
        }
    };

    const days = [
        ...getPreviousMonthDays(),
        ...getDaysInMonth(),
        ...getNextMonthDays(),
    ];
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return (
        <div className="w-full">
            {/* Header with month and navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={previousMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Previous month"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-base font-medium">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <button
                    onClick={nextMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Next month"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Weekday headers */}
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 py-1"
                    >
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {days.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected =
                        selectedDate && isSameDay(day, selectedDate);
                    //const isProgramDay = hasProgram(day);
                    const isProgramDay = hasProgram2(day, hasPrograms);

                    const isTodayDate = isToday(day);

                    //const isSameDay = isSameISOWeek("Monday", day);

                    const dayName = format(day, "EEEE"); // ni iterate

                    // if (hasPrograms.length > 0) {
                    //     console.log("day today: ", dayName);

                    // }
                    if (isSelected) {
                        //console.log("day today: ", day);
                        //console.log("day name: ", dayName);
                        //console.log("prggg: ", hasPrograms);
                    }

                    // .filter((day) => !isBefore(new Date(), day))
                    const isBeforexx = isBefore(subDays(new Date(), 1), day);
                    const availabilityStatus = getAvailabilityStatus(day);
                    const availabilityIcon = getAvailabilityIcon(day);
                    const availabilityColor = getAvailabilityColor(day);

                    //const yesterday = subDays(day, 1);
                    return (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.preventDefault();
                                onDateSelect(day);
                            }}
                            disabled={!isBeforexx || !isProgramDay || availabilityStatus === 'full'}
                            className={`
                h-9 w-9 mx-auto flex flex-col items-center justify-center rounded-full text-sm relative
                ${!isCurrentMonth ? "text-gray-400" : ""}
                ${isSelected ? "bg-blue-500 text-white" : ""}
                ${
                    isProgramDay && !isSelected && isBeforexx
                        ? `bg-blue-100 ${availabilityColor}`
                        : ""
                }
                ${isTodayDate && !isSelected ? "border border-blue-500" : ""}
                ${availabilityStatus === 'full' ? "opacity-50 cursor-not-allowed" : ""}
                hover:bg-gray-100
              `}
                            title={availabilityStatus !== 'unknown' ? 
                                `${availabilityStatus.charAt(0).toUpperCase() + availabilityStatus.slice(1)} slots` : 
                                'No data available'
                            }
                        >
                            <span className="text-xs">{format(day, "d")}</span>
                            {availabilityIcon && (
                                <div className="absolute -top-1 -right-1">
                                    {availabilityIcon}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
            
            {/* Legend */}
            {serviceId && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Slot Availability Legend:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Available (0-9 slots)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 text-yellow-500" />
                            <span>Moderate (10-14 slots)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 text-orange-500" />
                            <span>Limited (15-19 slots)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircle className="h-3 w-3 text-red-500" />
                            <span>Full (20+ slots)</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomCalendar;

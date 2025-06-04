import React from "react";
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
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomCalendar = ({ selectedDate, onDateSelect, hasPrograms = [] }) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

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

                    //const yesterday = subDays(day, 1);
                    return (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.preventDefault();
                                onDateSelect(day);
                            }}
                            disabled={!isBeforexx || !isProgramDay}
                            className={`
                h-9 w-9 mx-auto flex items-center justify-center rounded-full text-sm
                ${!isCurrentMonth ? "text-gray-400" : ""}
                ${isSelected ? "bg-blue-500 text-white" : ""}
                ${
                    isProgramDay && !isSelected && isBeforexx
                        ? "bg-blue-100"
                        : ""
                }
                ${isTodayDate && !isSelected ? "border border-blue-500" : ""}
                hover:bg-gray-100
              `}
                        >
                            {format(day, "d")}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomCalendar;

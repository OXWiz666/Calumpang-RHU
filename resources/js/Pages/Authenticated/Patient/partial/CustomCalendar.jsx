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
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, AlertCircle, Calendar } from "lucide-react";

const CustomCalendar = ({ selectedDate, onDateSelect, hasPrograms = [], serviceId = null, subserviceId = null }) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [dateAvailability, setDateAvailability] = useState({});
    const [loading, setLoading] = useState(false);
    
    // Debug logging for serviceId
    console.log('CustomCalendar received serviceId:', serviceId, 'type:', typeof serviceId);

    // Fetch date availability for the current month
    const fetchDateAvailability = async () => {
        if (!serviceId || serviceId === '' || serviceId === null || serviceId === undefined) {
            console.log('No valid serviceId provided to calendar:', serviceId);
            return;
        }
        
        console.log('Fetching availability for serviceId:', serviceId);
        setLoading(true);
        try {
            const startDate = startOfMonth(currentMonth);
            const endDate = endOfMonth(currentMonth);
            
            const url = `/patient/get-date-availability?start_date=${format(startDate, 'yyyy-MM-dd')}&end_date=${format(endDate, 'yyyy-MM-dd')}&service_id=${Number(serviceId)}`;
            console.log('Fetching from URL:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error('API call failed:', response.status, response.statusText);
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            console.log('API Response:', data);
            console.log('API Response type:', typeof data);
            console.log('API Response keys:', Object.keys(data));
            
            if (data.availability && Array.isArray(data.availability)) {
                const availabilityMap = {};
                data.availability.forEach(item => {
                    availabilityMap[item.date] = item;
                });
                setDateAvailability(availabilityMap);
                console.log('✅ Date availability loaded successfully:', availabilityMap);
                console.log('✅ Availability map keys:', Object.keys(availabilityMap));
                console.log('✅ Sample availability data:', availabilityMap[Object.keys(availabilityMap)[0]]);
            } else {
                console.log('❌ No availability data received:', data);
                console.log('❌ data.availability:', data.availability);
                console.log('❌ data.availability type:', typeof data.availability);
                console.log('❌ Full API response:', JSON.stringify(data, null, 2));
            }
        } catch (error) {
            console.error('Error fetching date availability:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch availability when month or service changes
    useEffect(() => {
        console.log('Calendar useEffect triggered - serviceId:', serviceId, 'currentMonth:', currentMonth);
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
        
        console.log(`🔍 Checking availability for ${dateStr}:`, availability);
        console.log('dateAvailability keys:', Object.keys(dateAvailability));
        console.log('dateAvailability object:', dateAvailability);
        
        if (!availability) {
            console.log(`No availability data for ${dateStr}`);
            return 'unknown'; // Don't show hardcoded data, show unknown when no real data
        }
        
        // Get day-specific slot capacity from service days
        const dayName = format(date, 'EEEE'); // Get day name (Monday, Tuesday, etc.)
        const maxSlots = availability.max_slots;
        const usedSlots = availability.appointment_count || 0;
        
        // If maxSlots is 0 or undefined, the day is not configured and should be unavailable
        if (!maxSlots || maxSlots === 0) {
            return 'full';
        }
        
        const availableSlots = Math.max(0, maxSlots - usedSlots);
        
        console.log(`${dateStr}: maxSlots=${maxSlots}, usedSlots=${usedSlots}, availableSlots=${availableSlots}`);
        
        // Updated logic to match the new legend format
        if (availableSlots === 0) return 'full';
        if (availableSlots <= 2) return 'limited';
        if (availableSlots <= 5) return 'moderate';
        return 'available';
    };

    // Get slot count for a specific date
    const getSlotCount = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const availability = dateAvailability[dateStr];
        
        if (!availability) {
            return { available: 0, total: 0 }; // Don't show hardcoded data, show 0 when no real data
        }
        
        const maxSlots = availability.max_slots;
        const usedSlots = availability.appointment_count || 0;
        
        // If maxSlots is 0 or undefined, the day is not configured and should be unavailable
        if (!maxSlots || maxSlots === 0) {
            return { available: 0, total: 0 };
        }
        
        const availableSlots = Math.max(0, maxSlots - usedSlots);
        
        return { available: availableSlots, total: maxSlots };
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
                return 'bg-green-100 border-green-300 text-green-800';
            case 'moderate':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'limited':
                return 'bg-orange-100 border-orange-300 text-orange-800';
            case 'full':
                return 'bg-red-100 border-red-300 text-red-800';
            default:
                return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    };

    const days = [
        ...getPreviousMonthDays(),
        ...getDaysInMonth(),
        ...getNextMonthDays(),
    ];
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // Show message when no service is selected
    if (!serviceId || serviceId === '' || serviceId === null || serviceId === undefined) {
        console.log('Showing "Select a Service First" message because serviceId is:', serviceId);
        return (
            <div className="w-full">
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Service First</h3>
                    <p className="text-gray-500">Please select a service type to view available appointment dates.</p>
                </div>
            </div>
        );
    }

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
                    
                    // Debug logging for date selection
                    if (day.getDate() === 31 && day.getMonth() === 9) { // October 31
                        console.log('October 31 debug:');
                        console.log('day:', day);
                        console.log('selectedDate:', selectedDate);
                        console.log('isSelected:', isSelected);
                        console.log('isSameDay result:', selectedDate ? isSameDay(day, selectedDate) : false);
                    }
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

                    // Check if the day is in the future (after today)
                    const isFutureDay = isBefore(new Date(), day);
                    const availabilityStatus = getAvailabilityStatus(day);
                    const availabilityIcon = getAvailabilityIcon(day);
                    const availabilityColor = getAvailabilityColor(day);
                    const slotCount = getSlotCount(day);
                    
                    // Debug logging for dates 26-31 (October)
                    if (day.getDate() >= 26 && day.getDate() <= 31 && day.getMonth() === 9) { // October 26-31
                        console.log(`🔍 October ${day.getDate()} Debug:`);
                        console.log('isFutureDay:', isFutureDay);
                        console.log('availabilityStatus:', availabilityStatus);
                        console.log('isProgramDay:', isProgramDay);
                        console.log('hasPrograms:', hasPrograms);
                        console.log('Will be disabled:', !isFutureDay || availabilityStatus === 'full');
                    }

                    //const yesterday = subDays(day, 1);
                    return (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.preventDefault();
                                // Create a new date in local timezone to avoid timezone conversion issues
                                const localDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
                                onDateSelect(localDate);
                            }}
                            disabled={!isFutureDay || availabilityStatus === 'full'}
                            className={`
                h-12 w-12 mx-auto flex flex-col items-center justify-center rounded-lg text-sm relative border-2
                ${!isCurrentMonth ? "text-gray-400" : ""}
                ${isSelected ? "bg-blue-500 text-white border-blue-500" : ""}
                ${
                    !isSelected && isFutureDay && availabilityStatus !== 'unknown'
                        ? availabilityColor || "bg-blue-50 border-blue-200"
                        : ""
                }
                ${isTodayDate && !isSelected ? "border-2 border-blue-500" : ""}
                ${availabilityStatus === 'full' ? "opacity-50 cursor-not-allowed" : ""}
                hover:bg-gray-100 transition-all duration-200
              `}
                            title={
                                !isFutureDay ? 'Cannot select past or current date' :
                                availabilityStatus !== 'unknown' ? 
                                    `${slotCount.available}/${slotCount.total} slots available` : 
                                    'No data available'
                            }
                        >
                            <span className="text-xs font-medium">{format(day, "d")}</span>
                            {isFutureDay && availabilityStatus !== 'unknown' && (
                                <div className="text-xs font-bold mt-0.5 flex items-center gap-1">
                                    <span className={`${
                                        availabilityStatus === 'available' ? 'text-green-700' :
                                        availabilityStatus === 'moderate' ? 'text-yellow-700' :
                                        availabilityStatus === 'limited' ? 'text-orange-700' :
                                        'text-red-700'
                                    }`}>
                                        {slotCount.available}
                                    </span>
                                    <span className="text-gray-500">/{slotCount.total}</span>
                                </div>
                            )}
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
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Slot Availability Legend
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded flex items-center justify-center">
                                <span className="text-green-700 text-xs font-bold"></span>
                            </div>
                            <span className="text-gray-700 font-medium">Available (6+ slots)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded flex items-center justify-center">
                                <span className="text-yellow-700 text-xs font-bold"></span>
                            </div>
                            <span className="text-gray-700 font-medium">Moderate (3-5 slots)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded flex items-center justify-center">
                                <span className="text-orange-700 text-xs font-bold"></span>
                            </div>
                            <span className="text-gray-700 font-medium">Limited (1-2 slots)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded flex items-center justify-center">
                                <span className="text-red-700 text-xs font-bold"></span>
                            </div>
                            <span className="text-gray-700 font-medium">Full (0 slots)</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomCalendar;

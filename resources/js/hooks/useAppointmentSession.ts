import { useState, useEffect } from 'react';

export const useAppointmentSession = () => {
    const [isInAppointmentSession, setIsInAppointmentSession] = useState(false);

    // Check if we're in an appointment session
    useEffect(() => {
        const checkAppointmentSession = () => {
            const currentUrl = window.location.pathname;
            const hasTokenSession = localStorage.getItem('patientTokenSession');
            const isAppointmentPage = currentUrl.includes('/appointments');
            
            setIsInAppointmentSession(isAppointmentPage || !!hasTokenSession);
        };

        checkAppointmentSession();
        
        // Listen for URL changes
        const handleRouteChange = () => {
            checkAppointmentSession();
        };

        window.addEventListener('popstate', handleRouteChange);
        
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);

    // Reset session when leaving appointment page
    useEffect(() => {
        const handleBeforeUnload = () => {
            const currentUrl = window.location.pathname;
            if (!currentUrl.includes('/appointments')) {
                // Clear patient session when leaving appointment page
                localStorage.removeItem('patientTokenSession');
                localStorage.removeItem('patientVerificationData');
                setIsInAppointmentSession(false);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Handler for appointment button clicks
    const handleAppointmentClick = (e: React.MouseEvent) => {
        if (isInAppointmentSession) {
            e.preventDefault();
            e.stopPropagation();
            
            // Show a message that they're already in an appointment session
            alert('You are already in an appointment session. Please complete your current appointment or refresh the page to start a new one.');
            return false;
        }
        
        // Normal flow - dispatch event to open terms modal
        window.dispatchEvent(new CustomEvent('openTermsOfServiceModal'));
        return true;
    };

    return {
        isInAppointmentSession,
        handleAppointmentClick
    };
};

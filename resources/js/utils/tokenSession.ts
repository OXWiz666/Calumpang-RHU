// Token Session Utility for Patient Data Persistence

interface PatientTokenData {
    token: string;
    patientData: {
        firstname: string;
        middlename: string;
        lastname: string;
        suffix: string;
        sex: string;
        birthdate: string;
        age: number;
        email: string;
        phone: string;
        civilStatus: string;
        nationality: string;
        religion: string;
        country: string;
        region: string;
        province: string;
        city: string;
        barangay: string;
        street: string;
        zipCode: string;
        profileImage: string | null;
    };
    timestamp: number;
    expiresAt: number;
}

class TokenSessionManager {
    private readonly TOKEN_KEY = 'patient_verification_token';
    private readonly TOKEN_EXPIRY_HOURS = 24; // Token expires after 24 hours

    // Generate a unique token
    private generateToken(): string {
        return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Create a new token session
    createTokenSession(patientData: any): string {
        const token = this.generateToken();
        const now = Date.now();
        const expiresAt = now + (this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

        const tokenData: PatientTokenData = {
            token,
            patientData,
            timestamp: now,
            expiresAt
        };

        localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
        return token;
    }

    // Get current token session
    getTokenSession(): PatientTokenData | null {
        try {
            const stored = localStorage.getItem(this.TOKEN_KEY);
            if (!stored) return null;

            const tokenData: PatientTokenData = JSON.parse(stored);
            
            // Check if token has expired
            if (Date.now() > tokenData.expiresAt) {
                this.clearTokenSession();
                return null;
            }

            return tokenData;
        } catch (error) {
            console.error('Error retrieving token session:', error);
            this.clearTokenSession();
            return null;
        }
    }

    // Check if token session exists and is valid
    hasValidTokenSession(): boolean {
        const tokenData = this.getTokenSession();
        return tokenData !== null;
    }

    // Get patient data from token session
    getPatientData(): any | null {
        const tokenData = this.getTokenSession();
        return tokenData ? tokenData.patientData : null;
    }

    // Update patient data in existing token session
    updatePatientData(patientData: any): boolean {
        const tokenData = this.getTokenSession();
        if (!tokenData) return false;

        tokenData.patientData = { ...tokenData.patientData, ...patientData };
        localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
        return true;
    }

    // Clear token session
    clearTokenSession(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    // Refresh token expiry (extend by another 24 hours)
    refreshTokenSession(): boolean {
        const tokenData = this.getTokenSession();
        if (!tokenData) return false;

        tokenData.expiresAt = Date.now() + (this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
        localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
        return true;
    }

    // Get token expiry time remaining (in minutes)
    getTokenExpiryMinutes(): number {
        const tokenData = this.getTokenSession();
        if (!tokenData) return 0;

        const remaining = tokenData.expiresAt - Date.now();
        return Math.max(0, Math.floor(remaining / (60 * 1000)));
    }
}

// Export singleton instance
export const tokenSessionManager = new TokenSessionManager();

// Export types
export type { PatientTokenData };

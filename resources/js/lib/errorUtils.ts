import { AlertCircle, CreditCard, RefreshCw, UserPlus, WifiOff } from 'lucide-react';

export interface ErrorInfo {
    type: ErrorType;
    title: string;
    description: string;
    icon: any;
    nextSteps: string[];
    isRetryable: boolean;
    severity: 'error' | 'warning' | 'info';
}

export enum ErrorType {
    INSUFFICIENT_POINTS = 'insufficient_points',
    ALREADY_CHECKED_IN = 'already_checked_in',
    HAS_EXPIRED = 'has_expired',
    MEMBER_NOT_FOUND = 'member_not_found',
    INVALID_RFID = 'invalid_rfid',
    SYSTEM_ERROR = 'system_error',
    UNKNOWN_ERROR = 'unknown_error',
}

export function detectErrorType(errorMessage: string): ErrorType {
    const message = errorMessage.toLowerCase();

    if (message.includes('no available points') || message.includes('insufficient points')) {
        return ErrorType.INSUFFICIENT_POINTS;
    }

    if (message.includes('already checked in')) {
        return ErrorType.ALREADY_CHECKED_IN;
    }

    if (message.includes('has expired')) {
        return ErrorType.HAS_EXPIRED;
    }

    if (message.includes('is not registered') || message.includes('not found')) {
        return ErrorType.MEMBER_NOT_FOUND;
    }

    if (message.includes('invalid rfid uid format') || message.includes('invalid rfid')) {
        return ErrorType.INVALID_RFID;
    }

    if (message.includes('system error occurred') || message.includes('technical issue')) {
        return ErrorType.SYSTEM_ERROR;
    }

    return ErrorType.UNKNOWN_ERROR;
}

export function getErrorInfo(errorMessage: string): ErrorInfo {
    const errorType = detectErrorType(errorMessage);

    const errorInfoMap: Record<ErrorType, Omit<ErrorInfo, 'type'>> = {
        [ErrorType.INSUFFICIENT_POINTS]: {
            title: 'Insufficient Points',
            description: "Your account doesn't have enough points for gym access",
            icon: CreditCard,
            nextSteps: [
                'Contact gym staff to top up your points',
                'Check your membership status and renewal',
                'Verify your payment and subscription plan',
                'Ask about available point packages',
            ],
            isRetryable: false,
            severity: 'error',
        },

        [ErrorType.ALREADY_CHECKED_IN]: {
            title: 'Already Checked In',
            description: "You have already completed today's check-in",
            icon: AlertCircle,
            nextSteps: [
                'Your check-in for today is already complete',
                'Come back tomorrow for your next session',
                'Contact staff if you believe this is an error',
                'Check your check-in history for confirmation',
            ],
            isRetryable: false,
            severity: 'warning',
        },

        [ErrorType.HAS_EXPIRED]: {
            title: 'Membership Expired',
            description: 'Your membership has expired, please renew',
            icon: AlertCircle,
            nextSteps: [
                'Your membership has expired, please renew',
                'Contact gym staff for renewal',
                'Check your membership status and renewal',
                'Ask about available membership packages',
            ],
            isRetryable: false,
            severity: 'warning',
        },

        [ErrorType.MEMBER_NOT_FOUND]: {
            title: 'Member Not Found',
            description: 'This Member card is not registered in our system',
            icon: UserPlus,
            nextSteps: [
                'Please contact the gym staff for registration',
                'Bring a valid ID for membership setup',
                'Ask about available membership packages',
                'Ensure you are using the correct Member card',
            ],
            isRetryable: false,
            severity: 'error',
        },

        [ErrorType.INVALID_RFID]: {
            title: 'Invalid Member Card',
            description: 'Please scan a valid Member card',
            icon: RefreshCw,
            nextSteps: [
                'Make sure you are using the correct Member card',
                'Check if your card is damaged or dirty',
                'Try scanning the card again slowly',
                'Hold the card steady near the scanner',
            ],
            isRetryable: true,
            severity: 'warning',
        },

        [ErrorType.SYSTEM_ERROR]: {
            title: 'System Error',
            description: 'A technical issue occurred, please try again',
            icon: WifiOff,
            nextSteps: [
                'Please wait a moment and try again',
                'Check your internet connection',
                'Contact support if the problem persists',
                'Try refreshing the page',
            ],
            isRetryable: true,
            severity: 'error',
        },

        [ErrorType.UNKNOWN_ERROR]: {
            title: 'Access Denied',
            description: 'Unable to process your request',
            icon: AlertCircle,
            nextSteps: [
                'Please contact the gym staff for assistance',
                'Make sure your Member card is properly activated',
                'Check if you are using the correct Member card',
                'Verify your membership status',
            ],
            isRetryable: false,
            severity: 'error',
        },
    };

    return {
        type: errorType,
        ...errorInfoMap[errorType],
    };
}

export function getErrorColors(severity: 'error' | 'warning' | 'info') {
    const colorSchemes = {
        error: {
            title: 'text-red-600',
            description: 'text-red-600/80',
            border: 'border-red-200',
            bg: 'bg-red-50',
            icon: 'text-red-500',
            text: 'text-red-700',
            header: 'text-red-800',
        },
        warning: {
            title: 'text-orange-600',
            description: 'text-orange-600/80',
            border: 'border-orange-200',
            bg: 'bg-orange-50',
            icon: 'text-orange-500',
            text: 'text-orange-700',
            header: 'text-orange-800',
        },
        info: {
            title: 'text-blue-600',
            description: 'text-blue-600/80',
            border: 'border-blue-200',
            bg: 'bg-blue-50',
            icon: 'text-blue-500',
            text: 'text-blue-700',
            header: 'text-blue-800',
        },
    };

    return colorSchemes[severity];
}

export function formatErrorForLogging(error: string, context?: Record<string, any>): string {
    const errorInfo = getErrorInfo(error);
    const timestamp = new Date().toISOString();

    return JSON.stringify(
        {
            timestamp,
            errorType: errorInfo.type,
            message: error,
            severity: errorInfo.severity,
            context: context || {},
        },
        null,
        2,
    );
}

export const getStatusFromAttendableType = (attendableType: string): string => {
    return attendableType.split('\\').pop() || '';
};

export const baseConfig= {
    headers: {
        'Content-Type': 'application/json',
    }
};

export const authConfig = (token?:string) => ({
    headers: {
        'Content-Type': 'application/json',
        'Authentication': `Bearer ${token}`,
    }
});
export const getImageUrl = (path: string) => {
    if (!path) {
        return '/default.png';
    }
    return path?.startsWith('storage') ? `${process.env.NEXT_PUBLIC_BASE_URL}${path}` : path;
}
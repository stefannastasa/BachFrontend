
export interface Note {
    id: string,
    userId: string,
    title: string,
    content: string,
    imageUrls: string[],
    createdAt: Date,
    updatedAt: Date,
}

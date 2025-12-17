export interface Brand {
    id: string;
    created_at: string;
    name: string;
    slug: string;
    keywords: string[];
}

export interface BrandInput {
    name: string;
    slug: string;
    keywords: string[];
}

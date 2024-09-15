export interface Product {
    id: string;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: string;
    date_end: string;
}

export interface SelectionChangeEvent {
    value: Product[];
}
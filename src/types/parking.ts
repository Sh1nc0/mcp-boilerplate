interface ParkingRecord {
    nom: string;
    disponible: number;
}

export interface ParkingResponse {
    results: ParkingRecord[];
}

export const ADDIS_DELIVERY_AREAS = [
    { id: 'bole', name: 'Bole (Medhanialem, Atlas)', fee: 60, minMinutes: 25, maxMinutes: 35 },
    { id: 'kazanchis', name: 'Kazanchis & UNECA', fee: 50, minMinutes: 20, maxMinutes: 30 },
    { id: 'piassa', name: 'Piassa & Arat Kilo', fee: 70, minMinutes: 30, maxMinutes: 45 },
    { id: 'sarbet', name: 'Sarbet & Bisrate Gabriel', fee: 65, minMinutes: 25, maxMinutes: 35 },
    { id: 'cmc', name: 'CMC & Summit', fee: 90, minMinutes: 40, maxMinutes: 55 },
    { id: 'gerji', name: 'Gerji & Imperial', fee: 70, minMinutes: 30, maxMinutes: 40 },
    { id: 'hayahulet', name: 'Hayahulet & 22 Mazoriya', fee: 55, minMinutes: 25, maxMinutes: 35 },
    { id: 'old_airport', name: 'Old Airport & Vatican', fee: 75, minMinutes: 30, maxMinutes: 45 },
    { id: 'megenagna', name: 'Megenagna & Lem Hotel', fee: 65, minMinutes: 25, maxMinutes: 40 },
    { id: 'ayat', name: 'Ayat & Tafo Zone', fee: 100, minMinutes: 45, maxMinutes: 60 },
];
export function getDeliveryFee(areaNameOrId) {
    const match = ADDIS_DELIVERY_AREAS.find((a) => a.id.toLowerCase() === areaNameOrId.toLowerCase() || a.name.toLowerCase().includes(areaNameOrId.toLowerCase()));
    return match ? match.fee : 60; 
}
export function getEstimatedDeliveryTime(areaNameOrId) {
    const match = ADDIS_DELIVERY_AREAS.find((a) => a.id.toLowerCase() === areaNameOrId.toLowerCase() || a.name.toLowerCase().includes(areaNameOrId.toLowerCase()));
    if (match) {
        return `${match.minMinutes} - ${match.maxMinutes} mins`;
    }
    return '30 - 45 mins';
}

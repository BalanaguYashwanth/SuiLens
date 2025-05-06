import { SuiClient } from '@mysten/sui/client';
import { TimelineData } from "./api.services";

export const transformPackageData = (timeline: TimelineData) => {
    const allDates = new Set<string>();
    Object.values(timeline).forEach((dateCounts) => {
        Object.keys(dateCounts).forEach((date) => allDates.add(date));
    });
    const sortedDates = Array.from(allDates).sort();
    return sortedDates.map((date) => {
        const entry: Record<string, string | number> = { date };
        Object.entries(timeline).forEach(([fn, data]) => {
            entry[fn] = data[date] || 0;
        });
        return entry;
    });
};


export const getColor = (index: number) => {
    const googleHueOffsets = [210, 0, 45, 135, 290]; // close to Google colors
    const hue = googleHueOffsets[index % googleHueOffsets.length] + (index * 15) % 30;
    return `hsl(${hue}, 85%, 55%)`;
};

// node rpc url
const FULLNODE_URL = process.env.REACT_APP_FULLNODE_URL;
export const SUI_CLIENT = new SuiClient({ url: FULLNODE_URL as string })
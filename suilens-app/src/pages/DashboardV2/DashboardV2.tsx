import { useEffect, useState } from "react";
import { getPackageAnalytics } from "../../common/api.services";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import "./DashboardV2.scss";

// Updated Google-style trend colors
const googleColors = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#AB47BC"];

type TimelineData = Record<string, Record<string, number>>;

const transformData = (timeline: TimelineData) => {
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

const IndividualGraph = ({ data, functionName, color }: { data: any[]; functionName: string; color: string }) => (
    <div className="individual-graph">
        <h4>{functionName}</h4>
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={`color-${functionName}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="50%" stopColor={color} stopOpacity={1} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.2} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey={functionName}
                    stroke={`url(#color-${functionName})`}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const DashboardV2 = () => {
    const [analytics, setAnalytics] = useState<Record<string, string | number>[]>([]);
    const [functionNames, setFunctionNames] = useState<string[]>([]);
    const [originalTimeline, setOriginalTimeline] = useState<TimelineData>({});
    console.log('--functionNames--',functionNames)
    const fetchAnalytics = async () => {
        const response = await getPackageAnalytics(
            "0xa93c09ef153ecfb7353c7a2e3059f769711a04fc63f8cbc64d23dccab1bacf1a"
        );
        const timeline = response?.analytics;
        if (timeline) {
            const data = transformData(timeline);
            setAnalytics(data);
            setFunctionNames(Object.keys(timeline));
            setOriginalTimeline(timeline);
        }
    };

    const getColor = (index: number) => {
        const googleHueOffsets = [210, 0, 45, 135, 290]; // close to Google colors
        const hue = googleHueOffsets[index % googleHueOffsets.length] + (index * 15) % 30;
        return `hsl(${hue}, 85%, 55%)`;
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return (
        <main className="analytics-graph">
            <h2> Graph</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        {functionNames.map((fn, i) => (
                            <linearGradient id={`color-${fn}`} key={fn} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={getColor(i)} stopOpacity={0.2} />
                                <stop offset="50%" stopColor={getColor(i)} stopOpacity={1} />
                                <stop offset="100%" stopColor={getColor(i)} stopOpacity={0.2} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 10, boxShadow: "0 0 15px rgba(0,0,0,0.2)" }} />
                    <Legend verticalAlign="top" height={36} />
                    {functionNames.map((fn, i) => (
                        <Line
                            key={fn}
                            type="monotone"
                            dataKey={fn}
                            stroke={`url(#color-${fn})`}
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            
            {functionNames.length > 1 && <section>
                <div className="individual-graph-grid">
                    {functionNames.map((fn, i) => {
                        const individualData = analytics.map((entry) => ({
                            date: entry.date,
                            [fn]: entry[fn] || 0,
                        }));

                        // Make last item span full if total count is odd
                        const isLast = i === functionNames.length - 1;
                        const isOdd = functionNames.length % 2 !== 0;
                        const spanFull = isOdd && isLast;

                        return (
                            <div
                                key={fn}
                                className={`individual-graph ${spanFull ? "graph-span-full" : ""}`}
                            >
                                <IndividualGraph
                                    data={individualData}
                                    functionName={fn}
                                    color={googleColors[i % googleColors.length]}
                                />
                            </div>
                        );
                    })}
                </div>
            </section>}
        </main>
    );
};

export default DashboardV2;

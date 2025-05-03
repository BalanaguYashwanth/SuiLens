import { useEffect, useState } from "react";
import { getPackageAnalytics, TimelineData } from "../../common/api.services";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faExplosion, faDatabase} from '@fortawesome/free-solid-svg-icons'
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
import { useNavigate, useParams } from "react-router-dom";
import { getColor, transformPackageData } from "../../common/helpers";
import FunctionGraph from "../../components/FunctionGraph/FunctionGraph";
import { PAGE_ROUTES } from "../../common/constant";
import "./Dashboard.scss";

const googleColors = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#AB47BC"];
const iconColor = "#202124"

const Dashboard = () => {
    const navigate = useNavigate()
    const { packageAddress } = useParams();
    const [analytics, setAnalytics] = useState<Record<string, string | number>[]>([]);
    const [functionNames, setFunctionNames] = useState<string[]>([]);
    // #TODO - timeline should use in graph
    const [originalTimeline, setOriginalTimeline] = useState<TimelineData>({});

    const navigateEditor = () => {
        navigate(`${PAGE_ROUTES.QUERY_EDITOR}/${packageAddress}`)
    }

    const fetchAnalytics = async (packageAddress: string) => {
        if (packageAddress) {
            // #TODO: Add loader
            const response = await getPackageAnalytics(packageAddress);
            const timeline = response?.analytics;
            if (timeline) {
                const data = transformPackageData(timeline);
                setAnalytics(data);
                setFunctionNames(Object.keys(timeline));
                setOriginalTimeline(timeline);
            }
        } else {
            console.error('Couldnt get the package address')
        }
    };

    useEffect(() => {
        if (packageAddress) {
            fetchAnalytics(packageAddress);
        }
    }, [packageAddress]);

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar">
                <div className="logo"><FontAwesomeIcon icon={faExplosion} color={iconColor} size="lg" /> </div>
                <div className="nav-link active"><FontAwesomeIcon icon={faChartLine} color={iconColor} size="lg" /></div>
                <div className="nav-link" onClick={navigateEditor}><FontAwesomeIcon icon={faDatabase} color={iconColor} size="lg" /></div>
            </aside>

            <div className="content">

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
                                const isLast = i === functionNames.length - 1;
                                const isOdd = functionNames.length % 2 !== 0;
                                const spanFull = isOdd && isLast;

                                return (
                                    <div
                                        key={fn}
                                        className={`individual-graph ${spanFull ? "graph-span-full" : ""}`}
                                    >
                                        <FunctionGraph
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
            </div>
        </div>
    );
};

export default Dashboard;

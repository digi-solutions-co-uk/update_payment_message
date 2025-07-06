import { useEffect, useState } from "react";
import { database } from "../firebaseConfig";
import { get, ref, update } from "firebase/database";
import ReactSwitch from "react-switch";

const Home = () => {
    const [users, setUsers] = useState({});
    const [filteredUsers, setFilteredUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const getData = async () => {
        try {
            const clientsRef = ref(database, "paymentWarning");
            const snapshot = await get(clientsRef);
            if (snapshot.exists()) {
                const allClients = snapshot.val();
                setUsers(allClients);
                setFilteredUsers(allClients);
            } else {
                console.log("No data found");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (key, currentValue) => {
        try {
            const userRef = ref(database, `paymentWarning/${key}`);
            await update(userRef, { notPaid: !currentValue });
            setUsers(prev => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    notPaid: !currentValue
                }
            }));
            setFilteredUsers(prev => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    notPaid: !currentValue
                }
            }));
        } catch (error) {
            console.error("Error updating Firebase:", error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = Object.entries(users).filter(([key]) =>
                key.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(Object.fromEntries(filtered));
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="p-6 max-w-xl mx-auto font-sans border border-gray-300 rounded-xl shadow-sm bg-white">
            <h1 className="text-2xl font-bold mb-6 text-center">Payment Warnings</h1>

            <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by ID..."
                className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            />

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="container">
                    {Object.entries(filteredUsers).map(([key, value]) => (
                        <div className="item" key={key}>
                            <span className="title2">{key}</span>
                            <ReactSwitch
                                checked={!!value?.notPaid}
                                onChange={() => handleToggle(key, value?.notPaid)}
                            />
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default Home;

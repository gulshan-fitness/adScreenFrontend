import { useEffect, useState } from "react";

export default function UserLive()  {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          "https://analyticsdata.googleapis.com/v1beta/properties/PROPERTY_ID:runRealtimeReport",
          {
            method: "POST",
            headers: {
              "Authorization": "Bearer YOUR_ACCESS_TOKEN",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              metrics: [{ name: "activeUsers" }],
            }),
          }
        );
        const data = await response.json();
        setUsers(data.rows?.[0]?.metricValues?.[0]?.value || "0");
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();

    const interval = setInterval(fetchUsers, 5000); // refresh every 5s

    return () => clearInterval(interval);
    
  }, []);

  return (
    <div>
      <h2>👥 Live Users on Site: {users}</h2>
    </div>
  );
}




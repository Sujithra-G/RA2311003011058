import { useEffect, useState } from "react";
import { Log } from "../../logging_middleware/log.js";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzZzQ2NDRAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTgzMCwiaWF0IjoxNzc3NzAwOTMwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMTBmYmI3ZDEtZTIzNC00OWVmLWFjMTAtMGQ4ZDNlMWJmOGJjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic3VqaXRocmFfZyIsInN1YiI6IjE0ZGRkNGMyLWQ3YTAtNDAzMC05YzZjLTE3M2I3OWNhYTBjMCJ9LCJlbWFpbCI6InNnNDY0NEBzcm1pc3QuZWR1LmluIiwibmFtZSI6InN1aml0aHJhX2ciLCJyb2xsTm8iOiJyYTIzMTEwMDMwMTEwNTgiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIxNGRkZDRjMi1kN2EwLTQwMzAtOWM2Yy0xNzNiNzljYWEwYzAiLCJjbGllbnRTZWNyZXQiOiJ3bk1KUktNU0pUS3BBbndUIn0.6KQCSilDtzFm8I8BXGxfb4gWd9F8w6fSlYflXISqWko";

const ITEMS_PER_PAGE = 5;

function App() {
  const [allNotifications, setAllNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      await Log("frontend", "info", "api", "Fetching notifications", TOKEN);

      const res = await fetch(
        "http://20.207.122.201/evaluation-service/notifications",
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`
          }
        }
      );

      const data = await res.json();

      if (data?.notifications?.length > 0) {
        setAllNotifications(data.notifications);
      } else {
        // 🔥 fallback data (important)
        setAllNotifications([
          {
            ID: "1",
            Type: "Placement",
            Message: "Google hiring",
            Timestamp: "2026-04-22 17:51:18"
          },
          {
            ID: "2",
            Type: "Result",
            Message: "Mid-sem results",
            Timestamp: "2026-04-22 17:51:30"
          },
          {
            ID: "3",
            Type: "Event",
            Message: "Tech Fest",
            Timestamp: "2026-04-22 17:50:06"
          },
          {
            ID: "4",
            Type: "Placement",
            Message: "Amazon hiring",
            Timestamp: "2026-04-22 17:49:42"
          }
        ]);

        await Log(
          "frontend",
          "warn",
          "api",
          "API empty → using fallback",
          TOKEN
        );
      }

      await Log("frontend", "info", "api", "Fetch success", TOKEN);
    } catch (err) {
      await Log("frontend", "error", "api", "Fetch failed", TOKEN);
      setAllNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Apply filter
  useEffect(() => {
    let temp = [...allNotifications];

    if (typeFilter !== "All") {
      temp = temp.filter((n) => n.Type === typeFilter);
    }

    setFilteredNotifications(temp);
    setPage(1);
  }, [typeFilter, allNotifications]);

  // 🔹 Pagination
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredNotifications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "700px",
        margin: "auto",
        color: "white"
      }}
    >
      <h1 style={{ textAlign: "center" }}>Notifications</h1>

      {/* 🔹 Filter */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Placement">Placement</option>
          <option value="Result">Result</option>
          <option value="Event">Event</option>
        </select>
      </div>

      {/* 🔹 Content */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : paginatedData.length === 0 ? (
        <p style={{ textAlign: "center" }}>No notifications</p>
      ) : (
        paginatedData.map((n) => (
          <div
            key={n.ID}
            style={{
              border: "1px solid #444",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              background: "#111"
            }}
          >
            <h3
              style={{
                color:
                  n.Type === "Placement"
                    ? "#4CAF50"
                    : n.Type === "Result"
                    ? "#2196F3"
                    : "#FF9800"
              }}
            >
              {n.Type}
            </h3>

            <p>{n.Message}</p>
            <small>{n.Timestamp}</small>
          </div>
        ))
      )}

      {/* 🔹 Pagination */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>Page {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={startIndex + ITEMS_PER_PAGE >= filteredNotifications.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
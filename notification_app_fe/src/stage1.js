import { Log } from "../../logging_middleware/log.js";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzZzQ2NDRAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTgzMCwiaWF0IjoxNzc3NzAwOTMwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMTBmYmI3ZDEtZTIzNC00OWVmLWFjMTAtMGQ4ZDNlMWJmOGJjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic3VqaXRocmFfZyIsInN1YiI6IjE0ZGRkNGMyLWQ3YTAtNDAzMC05YzZjLTE3M2I3OWNhYTBjMCJ9LCJlbWFpbCI6InNnNDY0NEBzcm1pc3QuZWR1LmluIiwibmFtZSI6InN1aml0aHJhX2ciLCJyb2xsTm8iOiJyYTIzMTEwMDMwMTEwNTgiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiIxNGRkZDRjMi1kN2EwLTQwMzAtOWM2Yy0xNzNiNzljYWEwYzAiLCJjbGllbnRTZWNyZXQiOiJ3bk1KUktNU0pUS3BBbndUIn0.6KQCSilDtzFm8I8BXGxfb4gWd9F8w6fSlYflXISqWko";

const fetchNotifications = async () => {
  try {
    await Log("frontend", "info", "api", "Fetching notifications", TOKEN);

    const res = await fetch(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const data = await res.json();

    await Log("frontend", "info", "api", "Fetched notifications successfully", TOKEN);

    return data.notifications;

  } catch (err) {
    await Log("frontend", "error", "api", "Error fetching notifications", TOKEN);
  }
};

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1
};

const getTopNotifications = async () => {
  const notifications = await fetchNotifications();

  await Log("frontend", "info", "api", "Sorting notifications", TOKEN);

  const sorted = notifications.sort((a, b) => {

    
    if (priorityMap[b.Type] !== priorityMap[a.Type]) {
      return priorityMap[b.Type] - priorityMap[a.Type];
    }

    
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });

  await Log("frontend", "info", "api", "Top 10 notifications selected", TOKEN);

  return sorted.slice(0, 10);
};


getTopNotifications().then(async (data) => {

  await Log(
    "frontend",
    "info",
    "api",
    "Final output ready",
    TOKEN
  );

  console.log("Top 10 Notifications:");
  console.log(data);
});
const BASE_URL = "http://20.207.122.201/evaluation-service/logs";

export const Log = async (stack, level, pkg, message, token) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });

    const data = await res.json();
    console.log("Log success:", data);
  } catch (err) {
    console.log("Log error:", err);
  }
};
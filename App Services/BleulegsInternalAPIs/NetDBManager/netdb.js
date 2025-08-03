const NetDB = (apiUrl, apiKey) => {
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const post = async (endpoint, body) => {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || res.statusText);
    return json;
  };

  const get = async (endpoint) => {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: "GET",
      headers,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || res.statusText);
    return json;
  };

  return {
    createTable: (tableName, columns) =>
      post("/create-table", { tableName, columns }),

    dropTable: (tableName) =>
      post("/drop-table", { tableName }),

    insert: (tableName, data) =>
      post("/insert", { tableName, data }),

    view: (tableName) =>
      get(`/view?tableName=${encodeURIComponent(tableName)}`),

    update: (tableName, updates, where) =>
      post("/update", { tableName, updates, where }),

    delete: (tableName, where) =>
      post("/delete", { tableName, where }),

    rawSQL: (sql, params = []) =>
      post("/sql", { sql, params }),
  };
};

module.exports = NetDB;
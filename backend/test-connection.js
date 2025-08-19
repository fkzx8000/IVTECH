import mysql from "mysql2/promise";

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "srv1757.hstgr.io",
      user: "u101146292_judge",
      password: "SCEpass1234",
      database: "u101146292_judge",
      port: 3306,
    });

    console.log("✅ חיבור למסד הנתונים הצליח!");

    // בדיקה שהטבלה קיימת
    const [tables] = await connection.execute("SHOW TABLES");
    console.log("📋 טבלאות במסד הנתונים:", tables);

    await connection.end();
  } catch (error) {
    console.error("❌ שגיאה בחיבור למסד הנתונים:", error.message);
  }
}

testConnection();

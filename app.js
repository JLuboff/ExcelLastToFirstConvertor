const Excel = require("exceljs");

const returnSQLString = async readFile => {
  const workbook = new Excel.Workbook();
  try {
    const readFile = await workbook.xlsx.readFile("./Employee Roster.xlsx");
    const worksheet = workbook.getWorksheet("Employee Roster Report");
    const columnToRead = worksheet.getColumn("A");
    const sqlStringArray = [];

    await columnToRead.eachCell((cell, rowNum) => {
      const { value } = cell;
      value !== "NAME" &&
        sqlStringArray.push(
          `(N'${value
            .split(",")
            .reverse()
            .join(" ")
            .trim()}', NULL, NULL)`
        );
    });

    return sqlStringArray.join(",");
  } catch (err) {
    throw err;
  }
};

returnSQLString().then(data => console.log(data));

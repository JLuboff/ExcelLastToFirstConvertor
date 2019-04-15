const Excel = require('exceljs');
const readline = require('readline');

const filterData = array => array.reduce((returnArray, value) => {
  !returnArray.includes(value) && returnArray.push(value);
  return returnArray;
}, []);
const singleColumnSQLString = async () => {
  const workbook = new Excel.Workbook();
  try {
    await workbook.xlsx.readFile('./Employee Roster.xlsx');
    const worksheet = workbook.getWorksheet('Employee Roster Report');
    const columnToRead = worksheet.getColumn('A');
    const sqlStringArray = [];

    await columnToRead.eachCell((cell) => {
      const { value } = cell;
      value !== 'NAME'
        && sqlStringArray.push(
          `(N'${value
            .split(',')
            .reverse()
            .join(' ')
            .trim()}', NULL, NULL)`,
        );
    });

    return sqlStringArray.join(',');
  } catch (err) {
    throw err;
  }
};

const multiColumnSQLString = async () => {
  const workbook = new Excel.Workbook();
  try {
    await workbook.xlsx.readFile('./Contractors.xlsx');
    const workSheets = [];
    const nameSQLStringArray = [];
    const companySQLStringArray = [];

    workbook.eachSheet((worksheet) => {
      workSheets.push(worksheet.name);
    });
    workSheets.forEach((workSheetName) => {
      const worksheet = workbook.getWorksheet(workSheetName);
      const firstName = worksheet.getColumn('B');

      firstName.eachCell((cell, index) => {
        const rows = worksheet.getRow(index).values;
        const firstname = rows[3];
        const lastname = rows[2];
        const companyname = rows[4];

        firstname !== 'First Name'
          && lastname !== 'Last Name'
          && nameSQLStringArray.push(`(N'${firstname} ${lastname}', NULL, NULL)`);

        companyname !== 'Company Name' && companySQLStringArray.push(`(N'${companyname}', 1)`);
      });
    });
    const filteredCompany = filterData(companySQLStringArray);
    const filteredNames = filterData(nameSQLStringArray);
    return {
      nameSQLStringArray: filteredNames.join(','),
      companySQLStringArray: filteredCompany.join(','),
    };
  } catch (err) {
    throw err;
  }
};

singleColumnSQLString().then(data => console.log(data));
multiColumnSQLString().then(data => console.log(data));

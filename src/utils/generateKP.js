import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function generateKP(products) {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(
    await fetch("price-calc/src/public/templates/kp-template.xlsx").then(
      (res) => res.arrayBuffer(),
    ),
  );

  const sheet = workbook.getWorksheet(1);
  console.log(sheet);

  let row = 26; // Начинаем с 26-й строки, так как первые 25 строк - это шаблон

  products.forEach((product, index) => {
    sheet.getCell(`A${row}`).value = index + 1;
    sheet.getCell(`B${row}`).value = product.name;
    sheet.getCell(`C${row}`).value = product.unit;
    sheet.getCell(`D${row}`).value = product.amount;
    sheet.getCell(`E${row}`).value = product.price;

    row++;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  console.log("ready kp");

  saveAs(new Blob([buffer]), `КП.xlsx`);
}

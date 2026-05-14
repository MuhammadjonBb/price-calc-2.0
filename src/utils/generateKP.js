import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function generateKP(products) {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(
    await fetch(
      `/price-calc/templates/kp-template-${products.length}.xlsx`,
    ).then((res) => res.arrayBuffer()),
  );

  const sheet = workbook.getWorksheet("КП-2 (со СКИДКОЙ) RUS");

  const BASE_HEIGHT = 15;
  const CHARS_PER_LINE = 30;
  const LINE_HEIGHT = 15;

  products.forEach((product, index) => {
    const r = 26 + index;

    const cells = [
      { col: `A${r}`, value: index + 1 },
      { col: `B${r}`, value: product.name },
      { col: `C${r}`, value: product.unit },
      { col: `D${r}`, value: product.amount, numFmt: "#,##0" },
      { col: `E${r}`, value: product.deliveryPrice, numFmt: "#,##0.00" },
      { col: `F${r}`, value: { formula: `D${r}*E${r}` }, numFmt: "#,##0.00" },
      { col: `G${r}`, value: 0.12 },
      { col: `H${r}`, value: { formula: `F${r}*G${r}` }, numFmt: "#,##0.00" },
      { col: `I${r}`, value: { formula: `F${r}+H${r}` }, numFmt: "#,##0.00" },
    ];

    cells.forEach(({ col, value, numFmt }) => {
      const cell = sheet.getCell(col);
      cell.value = value;
      cell.font = { ...cell.font, bold: false }; // сбрасываем жирный

      if (numFmt) {
        cell.numFmt = numFmt; // применяем числовой формат
      }
    });

    // Высота строки по длине названия
    const lines = Math.ceil(product.name.length / CHARS_PER_LINE);
    sheet.getRow(r).height = Math.max(BASE_HEIGHT, lines * LINE_HEIGHT);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `КП.xlsx`);
}

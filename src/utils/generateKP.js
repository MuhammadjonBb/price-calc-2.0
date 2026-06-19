import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function generateKP(products, props) {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(
    await fetch(
      `/price-calc/templates/kp-template-${products.length}.xlsx`,
    ).then((res) => res.arrayBuffer()),
  );

  const setTemplate = () => {
    if (props.template === "nds") {
      return "КП-1 (с НДС) RUS";
    } else {
      return "КП-2 (со СКИДКОЙ) RUS";
    }
  };

  const sheet = workbook.getWorksheet(setTemplate());
  const checkBuffer = await fetch("/price-calc/assets/checkmark.png").then(
    (r) => r.arrayBuffer(),
  );

  const BASE_HEIGHT = 15;
  const CHARS_PER_LINE = 30;
  const LINE_HEIGHT = 15;

  products.forEach((product, index) => {
    const r = 26 + index;

    const cells = [
      // Заполняем ячейки для каждой строки
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

  function setCheck(tCol, tRow) {
    const imageId = workbook.addImage({
      buffer: checkBuffer,
      extension: "png",
    });

    sheet.addImage(imageId, {
      tl: { col: tCol, row: tRow },
      ext: { width: 18, height: 18 },
      editAs: "absolute",
    });
  }

  const checks = {
    Фундамент: [0.99, 14.7],
    Фасад: [0.99, 15.7],
    СК: [0.95, 16.7],
    ЛКМ: [0.92, 17.7],
    Звукоизоляция: [0.88, 18.7],
    "Линейный водоотвод": [0.97, 19.7],
    Мансарда: [0.93, 20.7],
    Терраса: [0.91, 21.7],
    ПК: [0.99, 22.7],
    Полы: [0.96, 23.7],
    "Опалубочная система": [0.94, 24.7],
  };

  Object.entries(checks).forEach(([name, [c, r]]) => {
    if (props.constructions.includes(name)) {
      setCheck(c, r);
    }
  });

  // Заполняем дату и данные пользователя
  const dateCell = sheet.getCell("B8");
  dateCell.value = `от ${new Date().toLocaleDateString("ru-RU")} г.`;

  const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null; // Получаем данные пользователя из localStorage
  const roleCell = sheet.getCell(`B${40 - 1 + products.length}`);
  roleCell.value = userData ? userData.role : "Менеджер";

  const nameCell = sheet.getCell(`B${42 - 1 + products.length}`);
  nameCell.value = userData ? userData.name : "";

  const phoneCell = sheet.getCell(`B${43 - 1 + products.length}`);
  phoneCell.value = userData ? userData.phone : "";

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `КП.xlsx`);
}

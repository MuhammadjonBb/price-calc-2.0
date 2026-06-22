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

  function keepOnlySheet(workbook, sheetNameToKeep) {
    workbook.worksheets.forEach((ws) => {
      if (ws.name !== sheetNameToKeep) {
        workbook.removeWorksheet(ws.id);
      }
    });
  }

  // использование:
  keepOnlySheet(workbook, setTemplate());

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

    const setCellData = (cells) => {
      cells.forEach(({ col, value, numFmt }) => {
        const cell = sheet.getCell(col);
        cell.value = value;
        cell.font = { ...cell.font, bold: false }; // сбрасываем жирный

        if (numFmt) {
          cell.numFmt = numFmt; // применяем числовой формат
        }
      });
    };

    if (props.template === "nds") {
      const shortKp = cells.slice(0, -3);
      setCellData(shortKp);
    } else {
      setCellData(cells);
    }

    // Высота строки по длине названия
    const lines = Math.ceil(product.name.length / CHARS_PER_LINE);
    sheet.getRow(r).height = Math.max(BASE_HEIGHT, lines * LINE_HEIGHT);
  });

  function checkBox(cell, label, checked = true) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const from = checked ? "☐" : "✅";
    const to = checked ? "✅" : "☐";
    const regex = new RegExp(`${from}(?=\\s*${escaped})`);
    cell.value = cell.value.replace(regex, to);
  }

  const checks = [
    {
      Фундамент: "A15",
      Фасад: "A15",
      СК: "A15",
      ЛKМ: "A15",
      Звукоизоляция: "A15",
      "Линейный водоотвод": "A15",
      Мансарда: "A15",
      Терраса: "A15",
      ПK: "A15",
      Полы: "A15",
      "Опалубочная система": "A15",
    },
    {
      Узбекистан: "A20",
      Германия: "A20",
      Грузия: "A20",
      Швейцария: "A20",
      Казахстан: "A20",
      Россия: "A20",
      Бельгия: "A20",
      Дания: "A20",
      Финляндия: "A20",
      Франция: "A20",
      Китай: "A20",
      Туркменистан: "A20",
      Беларусь: "A20",
      Италия: "A20",
      Польша: "A20",
      Турция: "A20",
    },
    {
      "В наличии": "A30",
      Комплексность: "A30",
      "Временное хранение": "A30",
      Скидка: "A30",
      Доставка: "A30",
      "Шеф. Монтаж": "A30",
      Эксклюзивность: "A30",
      "Ускоренная поставка": "A30",
      "Доп. скидка": "A30",
      PMG: "A30",
    },
  ];

  Object.entries(checks[0]).forEach(([name, c]) => {
    if (props.constructions.includes(name)) {
      const cell = sheet.getCell(c);
      console.log(cell);
      checkBox(cell, name, true);
    }
  });

  Object.entries(checks[1]).forEach(([name, c]) => {
    if (props.countries.includes(name)) {
      const cell = sheet.getCell(c);
      checkBox(cell, name, true);
    }
  });

  Object.entries(checks[2]).forEach(([name, c]) => {
    if (props.benefits.includes(name)) {
      const col = c[0];
      const row = Number(c.slice(1));
      const cellID = col + (row + products.length - 1);
      const cell = sheet.getCell(cellID);
      checkBox(cell, name, true);
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

  function sanitizeSheetName(name) {
    return name.replace(/[\\/?*\[\]]/g, "").slice(0, 31);
  }

  // Переименовываем лист, используя текущую дату
  sheet.name = sanitizeSheetName(
    `КП от ${new Date().toLocaleDateString("ru-RU")}`,
  );

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `КП.xlsx`);
}

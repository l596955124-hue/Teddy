const fs = require("fs");

const sourcePath =
  "D:/Teddy创业项目/工作流专区/02-选品与供应商专项/供应商资料/1688醉清风礼盒-pageData-20260607.json";
const outputPath =
  "D:/Teddy创业项目/工作流专区/02-选品与供应商专项/供应商资料/1688醉清风-全店类目总表-20260607.csv";

const raw = fs.readFileSync(sourcePath, "utf8").replace(/^\uFEFF/, "");
const data = JSON.parse(raw);
const rows = [];
const seen = new Set();

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function addCategory(node, parentName = "", parentId = "", level = 1) {
  if (!node || typeof node !== "object") return;
  if (!("name" in node) || !("id" in node) || !("count" in node)) return;

  const name = String(node.name || "");
  const id = String(node.id || "");
  const count = Number(node.count || 0);
  if (!name || !id || !Number.isFinite(count)) return;

  const key = `${id}|${level}|${parentId}`;
  if (!seen.has(key)) {
    seen.add(key);
    rows.push({
      level,
      parentName,
      parentId,
      categoryName: name,
      categoryId: id,
      count,
      categoryUrl: `https://yixingfangsc.1688.com/page/offerlist_${id}.htm`,
      fullPath: parentName ? `${parentName} > ${name}` : name,
    });
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) addCategory(child, name, id, level + 1);
  }
}

function walk(node) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) walk(item);
    return;
  }

  if (Array.isArray(node.offerCategoryList)) {
    for (const category of node.offerCategoryList) addCategory(category);
  }

  for (const value of Object.values(node)) walk(value);
}

const categorySamples = [];
if (Array.isArray(data.found)) {
  for (const item of data.found) {
    if (
      item &&
      item.path &&
      String(item.path).endsWith("offerCategoryList") &&
      Array.isArray(item.sample)
    ) {
      categorySamples.push(item.sample);
    }
  }
}

if (categorySamples.length) {
  for (const sample of categorySamples) {
    for (const category of sample) addCategory(category);
  }
} else {
  walk(data);
}

rows.sort((a, b) =>
  a.level - b.level ||
  a.parentId.localeCompare(b.parentId) ||
  a.categoryName.localeCompare(b.categoryName, "zh-Hans-CN"),
);

const headers = [
  "Level",
  "ParentName",
  "ParentId",
  "CategoryName",
  "CategoryId",
  "Count",
  "CategoryUrl",
  "FullPath",
];

const csv = [
  headers.join(","),
  ...rows.map((row) =>
    [
      row.level,
      row.parentName,
      row.parentId,
      row.categoryName,
      row.categoryId,
      row.count,
      row.categoryUrl,
      row.fullPath,
    ]
      .map(csvEscape)
      .join(","),
  ),
].join("\r\n");

fs.writeFileSync(outputPath, "\uFEFF" + csv, "utf8");
console.log(JSON.stringify({ outputPath, categoryCount: rows.length, totalListedCount: rows.reduce((sum, row) => sum + row.count, 0) }, null, 2));

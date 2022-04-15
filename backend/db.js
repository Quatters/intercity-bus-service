import { createConnection } from 'mysql2/promise';

let connection = await createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'intercity_bus_service',
});

async function select(tables, columns = '*', order = null) {
  tables = getArrayFromArg(tables);
  columns = getArrayFromArg(columns);

  if (!tables) {
    throw 'Parameter "tables" must be specified.';
  }

  let sql = 'SELECT';

  columns.forEach(column => {
    sql = `${sql} ${column},`;
  });
  sql = sql.slice(0, -1) + ' FROM';

  tables.forEach(table => {
    sql = `${sql} ${table},`;
  });
  sql = sql.slice(0, -1);

  if (order) {
    sql = `${sql} ORDER BY`;
    const orderColumns = getArrayFromArg(order.columns);
    orderColumns.forEach(column => {
      sql = `${sql} ${column},`;
    });
    sql = sql.slice(0, -1);
    const direction = order.direction || 'ASC';
    sql = `${sql} ${direction}`;
  }

  const [rows] = await connection.query(sql);
  return rows;
}

async function insert(table, value) {
  if (!table) {
    throw 'Parameter "table" must be specified.';
  }
  if (!value || Object.keys(value).length === 0) {
    throw 'Parameter "value" must be specified.';
  }

  let sql = `INSERT INTO ${table} (`;

  Object.keys(value).forEach(key => {
    sql = `${sql}\`${key}\`,`;
  });
  sql = sql.slice(0, -1) + ') VALUE (';

  Object.values(value).forEach(val => {
    if (typeof val === 'number') {
      sql = `${sql}${val},`;
    } else {
      sql = `${sql}'${val}',`;
    }
  });
  sql = sql.slice(0, -1) + ')';

  await connection.query(sql);
  const [rows] = await connection.query('SELECT LAST_INSERT_ID() AS id');

  return rows[0].id;
}

async function update(table, oldData, newData) {
  if (!table) {
    throw 'Parameter "table" must be specified.';
  }

  let sql = `UPDATE ${table} SET`;
  Object.entries(newData).forEach(([key, value]) => {
    if (typeof value === 'number') {
      sql = `${sql} \`${key}\`=${value},`;
    } else {
      sql = `${sql} \`${key}\`='${value}',`;
    }
  });
  sql = sql.slice(0, -1) + ' WHERE';

  Object.entries(oldData).forEach(([key, value]) => {
    if (typeof value === 'number') {
      sql = `${sql} \`${key}\`=${value} AND`;
    } else {
      sql = `${sql} \`${key}\`='${value}' AND`;
    }
  });
  sql = sql.slice(0, -4);

  await connection.query(sql);

  return newData;
}

function getArrayFromArg(arg) {
  if (!arg || arg.length === 0) {
    return null;
  }
  if (Array.isArray(arg)) {
    return arg;
  }
  return [arg];
}

connection.select = select;
connection.insert = insert;
connection.update = update;

export default connection;

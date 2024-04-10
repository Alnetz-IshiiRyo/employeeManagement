// 文字列をキャメルケースからスネークケースに変換する関数
export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// 文字列をスネークケースからキャメルケースに変換する関数
export function snakeToCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
}

// オブジェクトのキーをスネークケースに変換する関数
export function convertToSnakeCase(
  data: Record<string, any>,
): Record<string, any> {
  return Object.keys(data).reduce(
    (acc, key) => {
      const snakeCaseKey = camelToSnakeCase(key);
      acc[snakeCaseKey] = data[key];
      return acc;
    },
    {} as Record<string, any>,
  );
}

// オブジェクトのキーをキャメルケースに変換する関数
export function convertKeysToCamelCase(
  data: Record<string, any>,
): Record<string, any> {
  if (Array.isArray(data)) {
    return data.map((item) => convertKeysToCamelCase(item));
  } else if (data !== null && typeof data === 'object') {
    return Object.keys(data).reduce(
      (result, key) => {
        const camelCaseKey = snakeToCamelCase(key);
        result[camelCaseKey] = convertKeysToCamelCase(data[key]);
        return result;
      },
      {} as Record<string, any>,
    );
  }
  return data;
}

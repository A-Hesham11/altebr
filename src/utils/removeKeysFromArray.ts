export const removeKeysFromArray = (
  array: object[],
  keysToRemove: string[]
) => {
  return array?.map((obj: any) => {
    let newObj: any = {};

    for (let key in obj) {
      if (!keysToRemove.includes(key)) {
        newObj[key] = obj[key];
      }
    }

    return newObj;
  });
};

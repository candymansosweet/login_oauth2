export function DeleteKeyObject(object: object,keys: string[]) {
  keys.forEach((key: string) => {
    if(object.hasOwnProperty(key)){
      delete object[key as keyof typeof object];
    }
    else {
      console.error('không chứa key ' + key);
    }
  })
  return object;
}

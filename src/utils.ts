export function findBy(array, key, value) {
    return array.find((item) => {
        return item[key] === value;
    });
}
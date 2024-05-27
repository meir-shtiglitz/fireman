export const shuffelArray = (arr) => {
    const shuffeld = arr.sort((a, b) => getRandom(0, arr.length) - getRandom(0, arr.length))
    return shuffeld
}

export const getRandom = (min, max) => {
    return Math.ceil(Math.random() * (max - min) + min)
}
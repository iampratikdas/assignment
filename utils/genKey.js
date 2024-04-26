exports.GenKey = async function (length, type) {
    let result = '';
    let characters;
    switch (type) {
        case "string":
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        break;
        case "numeric":
            characters ='0123456789';
            break;
        default:
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            break;

    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return await result;
}
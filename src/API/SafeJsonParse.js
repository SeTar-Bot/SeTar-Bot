module.exports = (data) => {
    if (data == null)
        return data;
    try {
        return JSON.parse(data);
    }
    catch {
        return null;
    }
};
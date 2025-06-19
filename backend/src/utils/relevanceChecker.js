const isRelevantToAngola = (text = "") => {
    if (!text) return false;

    const keywords = [
        // Figuras e história
        "angola", "história", "independência", "guerra civil", "jonas savimbi", "agostinho neto", "joão lourenço",
        "unita", "mpla", "figuras nacionais", "líder", "presidente",

        // Geografia e províncias
        "província", "luanda", "bié", "huambo", "cabinda", "benguela", "morro do moco",

        // Cultura
        "kuduro", "semba", "tradições", "língua", "umbundu", "kimbundu", "etnias",

        // Gastronomia e sociedade
        "comida angolana", "funje", "muamba", "cultura angolana", "dança angolana"
    ];

    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword));
};

const isInterestingEnough = (text) => {
    if (!text) return false;
    const words = text.trim().split(/\s+/);
    return words.length >= 3;
};

const shouldStoreMessage = (text, geminiReply) => {
    return isRelevantToAngola(text) && isInterestingEnough(text) && !geminiReply?.includes("erro");
};

module.exports = {
    isRelevantToAngola,
    isInterestingEnough,
    shouldStoreMessage
};




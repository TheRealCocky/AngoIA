const isRelevantToAngola = (text) => {
    if (!text) return false;

    //palavras relevantes a ser avalidas para serem guardadas palavras semelhantes no banco de dados
    const keywords = [
        "Angola", "Luanda", "Benguela", "Huambo", "Kwanza", "MPLA", "UNITA", "Guerra Civil",
        "língua nacional", "umbundu", "kimbundu", "ovimbundu", "nhaneca", "humbe",
        "história de Angola", "independência", "colonialismo", "Educação em Angola",
        "tradições angolanas", "comida angolana", "músicas de Angola", "culturas locais"
    ];

    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

const isInterestingEnough = (text) => {
    if (!text) return false;

    const words = text.trim().split(/\s+/);
    return words.length >= 5 && !text.toLowerCase().startsWith('oi') && !text.toLowerCase().startsWith('ola');
};

const shouldStoreMessage = (text, geminiReply) => {
    return isRelevantToAngola(text) && isInterestingEnough(text) && !geminiReply;
};

module.exports = {
    isRelevantToAngola,
    isInterestingEnough,
    shouldStoreMessage
};

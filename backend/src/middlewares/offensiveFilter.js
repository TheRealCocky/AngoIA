// middlewares/offensiveFilter.js

const palavrasOfensivas = [
    "merda", "porra", "fdp", "foda", "puta", "caralho", "burro", "otario", "otário", "besta", "estupido"
];

const offensiveFilter = (req, res, next) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string') return next();

    // Normaliza: remove acentos e transforma em minúsculas
    const texto = message
        .toLowerCase()
        .normalize('NFD') // decompõe acentos
        .replace(/[\u0300-\u036f]/g, ''); // remove acentos

    const isOffensive = palavrasOfensivas.some(palavra => texto.includes(palavra));

    if (isOffensive) {
        return res.status(400).json({
            message: 'Sua pergunta contém palavras ofensivas. Reformule com respeito e tente novamente. 🇦🇴'
        });
    }

    next(); // segue se estiver tudo certo
};

module.exports = offensiveFilter;


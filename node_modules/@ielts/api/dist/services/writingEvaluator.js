"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateWriting = evaluateWriting;
// Common Academic Word List (AWL) subset for Band 6.5+
const ACADEMIC_WORDS = new Set([
    'analyze', 'approach', 'area', 'assess', 'assume', 'authority', 'available', 'benefit', 'concept',
    'consistent', 'constitutional', 'context', 'contract', 'create', 'data', 'definition', 'derived',
    'distribution', 'economic', 'environment', 'established', 'estimate', 'evidence', 'export', 'factors',
    'financial', 'formula', 'function', 'identified', 'income', 'indicate', 'individual', 'interpretation',
    'involved', 'issues', 'labor', 'legal', 'legislation', 'major', 'method', 'percent', 'period',
    'perspective', 'policy', 'principle', 'procedure', 'process', 'require', 'research', 'response',
    'role', 'section', 'sector', 'significant', 'similar', 'source', 'specific', 'structure', 'theory',
    'variable', 'achieve', 'acquire', 'administrate', 'affect', 'appropriate', 'aspects', 'assistance',
    'consequence', 'construct', 'consume', 'credit', 'cultural', 'design', 'distinct', 'element',
    'evaluate', 'feature', 'final', 'focus', 'impact', 'injury', 'institute', 'invest', 'item', 'journal',
    'maintain', 'normal', 'obtain', 'participate', 'perceive', 'positive', 'potential', 'previous',
    'primary', 'purchase', 'range', 'region', 'regulate', 'relevant', 'reside', 'resource', 'restrict',
    'secure', 'seek', 'select', 'site', 'strategy', 'survey', 'text', 'tradition', 'transfer', 'alternative',
    'circumstance', 'comment', 'compensate', 'component', 'consent', 'considerable', 'constant', 'constrain',
    'contribute', 'convene', 'coordinate', 'core', 'corporate', 'correspond', 'criteria', 'deduce',
    'demonstrate', 'document', 'dominate', 'emphasis', 'ensure', 'exclude', 'fund', 'framework', 'illustrate',
    'immigrate', 'imply', 'initial', 'instance', 'interact', 'justify', 'layer', 'link', 'locate', 'maximize',
    'minor', 'negate', 'outcome', 'partner', 'philosophy', 'physical', 'proportion', 'publish', 'react',
    'register', 'rely', 'remove', 'scheme', 'sequence', 'shift', 'specify', 'sufficient', 'task', 'technical',
    'technique', 'technology', 'valid', 'volume', 'access', 'adequate', 'annual', 'apparent', 'approximate',
    'attitude', 'attribute', 'civil', 'code', 'commit', 'communicate', 'concentrate', 'confer', 'contrast',
    'cycle', 'debate', 'despite', 'dimension', 'domestic', 'emerge', 'error', 'ethnic', 'goal', 'grant',
    'hence', 'hypothesis', 'implement', 'implicate', 'impose', 'integrate', 'internal', 'investigate',
    'mechanism', 'occupy', 'overall', 'parallel', 'parameter', 'phase', 'predict', 'prior', 'professional',
    'project', 'promote', 'regime', 'resolve', 'retain', 'series', 'statistic', 'status', 'stress',
    'subsequent', 'undertake', 'mitigate', 'exacerbate', 'detrimental', 'paramount', 'ubiquitous'
]);
// Cohesive devices for Band 6.5+
const COHESIVE_DEVICES = [
    'furthermore', 'moreover', 'in addition', 'on the other hand', 'however', 'nevertheless',
    'consequently', 'therefore', 'as a result', 'in contrast', 'firstly', 'secondly', 'finally',
    'for instance', 'for example', 'in conclusion', 'to summarize', 'subsequently', 'in particular'
];
function evaluateWriting(taskType, content, promptText) {
    const trimmed = content.trim();
    const words = trimmed.length > 0 ? trimmed.split(/\s+/) : [];
    const wordCount = words.length;
    const minWords = taskType === 'TASK_1' ? 150 : 250;
    const taskRequirementsMet = wordCount >= minWords;
    // Split paragraphs
    const paragraphs = trimmed.split(/\n+/).filter((p) => p.trim().length > 0);
    const paragraphCount = paragraphs.length;
    // Sentence split
    const sentences = trimmed
        .split(/(?<=[.?!])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    // --- 1. Task Response (TR) ---
    let trScore = 5.0;
    if (wordCount >= minWords + 30) {
        trScore += 1.0;
    }
    else if (wordCount >= minWords) {
        trScore += 0.5;
    }
    else if (wordCount < minWords - 50) {
        trScore -= 1.0;
    }
    // Check structure: Task 2 needs intro, at least 2 body paragraphs, conclusion
    if (taskType === 'TASK_2') {
        if (paragraphCount >= 4) {
            trScore += 0.5;
        }
        else if (paragraphCount < 3) {
            trScore -= 0.5;
        }
    }
    else {
        // Task 1 needs intro, overview, body details
        if (paragraphCount >= 3) {
            trScore += 0.5;
        }
    }
    // --- 2. Coherence & Cohesion (CC) ---
    let ccScore = 5.0;
    const lowerContent = trimmed.toLowerCase();
    let cohesiveCount = 0;
    for (const device of COHESIVE_DEVICES) {
        if (lowerContent.includes(device)) {
            cohesiveCount++;
        }
    }
    if (cohesiveCount >= 5 && paragraphCount >= 3) {
        ccScore = 6.5;
    }
    else if (cohesiveCount >= 3 && paragraphCount >= 3) {
        ccScore = 6.0;
    }
    else if (cohesiveCount >= 1) {
        ccScore = 5.5;
    }
    else {
        ccScore = 5.0;
    }
    // --- 3. Lexical Resource (LR) ---
    let lrScore = 5.0;
    let academicCount = 0;
    const uniqueWords = new Set();
    for (const w of words) {
        const cleanWord = w.toLowerCase().replace(/[^a-z]/g, '');
        if (cleanWord.length > 0) {
            uniqueWords.add(cleanWord);
            if (ACADEMIC_WORDS.has(cleanWord)) {
                academicCount++;
            }
        }
    }
    const lexicalDiversity = wordCount > 0 ? uniqueWords.size / wordCount : 0;
    const academicDensity = wordCount > 0 ? (academicCount / wordCount) * 100 : 0;
    if (academicDensity >= 4.0 && lexicalDiversity >= 0.45) {
        lrScore = 6.5;
    }
    else if (academicDensity >= 2.5 && lexicalDiversity >= 0.4) {
        lrScore = 6.0;
    }
    else if (academicDensity >= 1.0) {
        lrScore = 5.5;
    }
    else {
        lrScore = 5.0;
    }
    // --- 4. Grammatical Range & Accuracy (GRA) ---
    let graScore = 5.0;
    const sentenceCorrections = [];
    // Detect common Vietnamese learner errors
    for (const sentence of sentences) {
        const sLower = sentence.toLowerCase();
        // Subject-verb error: "people is" / "children is"
        if (/\b(people|children|men|women|students)\s+is\b/i.test(sentence)) {
            sentenceCorrections.push({
                original: sentence,
                corrected: sentence.replace(/\b(people|children|men|women|students)\s+is\b/gi, (match) => {
                    const parts = match.split(/\s+/);
                    return `${parts[0]} are`;
                }),
                errorCategory: 'subject_verb_agreement',
                reasonEn: 'The subject is plural, so use "are" instead of "is".',
                reasonVi: 'Chủ ngữ ở dạng số nhiều (people/children/students), động từ phải chia là "are", không dùng "is".',
                improvedBand65: sentence.replace(/\b(people|children|men|women|students)\s+is\b/gi, (match) => {
                    const parts = match.split(/\s+/);
                    return `An increasing number of ${parts[0].toLowerCase()} are`;
                }),
            });
        }
        // Uncountable noun plural: "researches", "informations", "equipments", "advices"
        if (/\b(researches|informations|equipments|advices|knowledges)\b/i.test(sentence)) {
            sentenceCorrections.push({
                original: sentence,
                corrected: sentence
                    .replace(/\bresearches\b/gi, 'research studies')
                    .replace(/\binformations\b/gi, 'information')
                    .replace(/\bequipments\b/gi, 'equipment')
                    .replace(/\badvices\b/gi, 'advice')
                    .replace(/\bknowledges\b/gi, 'knowledge'),
                errorCategory: 'word_choice',
                reasonEn: 'In English, "research", "information", and "equipment" are uncountable nouns and do not take "-s".',
                reasonVi: 'Trong tiếng Anh, "information", "equipment", "advice", "knowledge" là danh từ không đếm được, không thêm đuôi "-s".',
                improvedBand65: sentence.replace(/\b(researches|informations|equipments|advices|knowledges)\b/gi, (m) => `empirical ${m.toLowerCase() === 'researches' ? 'research' : m.toLowerCase().slice(0, -1)}`),
            });
        }
        // Article omission / error: "in world", "play guitar", "go to university"
        if (/\bin world\b/i.test(sentence)) {
            sentenceCorrections.push({
                original: sentence,
                corrected: sentence.replace(/\bin world\b/gi, 'in the world'),
                errorCategory: 'article',
                reasonEn: '"World" is unique, so the definite article "the" is required ("in the world").',
                reasonVi: '"World" là danh từ duy nhất, bắt buộc phải có mạo từ "the" ("in the world").',
                improvedBand65: sentence.replace(/\bin world\b/gi, 'across the globe'),
            });
        }
        // Run-on / comma splice with "however" e.g., "sentence, however sentence"
        if (/, however /i.test(sentence)) {
            sentenceCorrections.push({
                original: sentence,
                corrected: sentence.replace(/, however /gi, '; however, '),
                errorCategory: 'run_on',
                reasonEn: '"However" is a conjunctive adverb, not a coordinating conjunction. Use a semicolon or start a new sentence.',
                reasonVi: '"However" là trạng từ nối, không thể dùng dấu phẩy để nối hai mệnh đề độc lập. Hãy dùng dấu chấm phẩy (; however,) hoặc tách câu.',
                improvedBand65: sentence.replace(/, however /gi, '. Nevertheless, '),
            });
        }
        // Preposition error: "discuss about", "mention about", "emphasize on"
        if (/\b(discuss about|mention about|emphasize on)\b/i.test(sentence)) {
            sentenceCorrections.push({
                original: sentence,
                corrected: sentence
                    .replace(/\bdiscuss about\b/gi, 'discuss')
                    .replace(/\bmention about\b/gi, 'mention')
                    .replace(/\bemphasize on\b/gi, 'emphasize'),
                errorCategory: 'preposition',
                reasonEn: 'Verbs like "discuss", "mention", and "emphasize" are transitive and do not take prepositions like "about" or "on".',
                reasonVi: 'Các động từ "discuss", "mention", "emphasize" là ngoại động từ tác động trực tiếp lên tân ngữ, không đi kèm "about" hay "on".',
                improvedBand65: sentence
                    .replace(/\bdiscuss about\b/gi, 'comprehensively analyze')
                    .replace(/\bmention about\b/gi, 'highlight')
                    .replace(/\bemphasize on\b/gi, 'underscore'),
            });
        }
    }
    // Complex sentence check (subordinators: although, because, since, while, if, unless, whereas)
    const complexMarkers = ['although', 'because', 'since', 'while', 'if', 'unless', 'whereas', 'which', 'that', 'who'];
    let complexSentenceCount = 0;
    for (const s of sentences) {
        const sLow = s.toLowerCase();
        if (complexMarkers.some((m) => sLow.includes(m))) {
            complexSentenceCount++;
        }
    }
    const complexRatio = sentences.length > 0 ? complexSentenceCount / sentences.length : 0;
    if (sentenceCorrections.length === 0 && complexRatio >= 0.4) {
        graScore = 6.5;
    }
    else if (sentenceCorrections.length <= 2 && complexRatio >= 0.3) {
        graScore = 6.0;
    }
    else if (sentenceCorrections.length <= 4) {
        graScore = 5.5;
    }
    else {
        graScore = 5.0;
    }
    // Clamp criteria between 4.0 and 8.0
    trScore = Math.min(8.0, Math.max(4.0, Math.round(trScore * 2) / 2));
    ccScore = Math.min(8.0, Math.max(4.0, Math.round(ccScore * 2) / 2));
    lrScore = Math.min(8.0, Math.max(4.0, Math.round(lrScore * 2) / 2));
    graScore = Math.min(8.0, Math.max(4.0, Math.round(graScore * 2) / 2));
    const avg = (trScore + ccScore + lrScore + graScore) / 4;
    const estimatedBand = Math.round(avg * 2) / 2;
    // Strengths and weaknesses
    const strengths = [];
    const weaknesses = [];
    const actionableTips = [];
    if (taskRequirementsMet) {
        strengths.push(`Met the length requirement with ${wordCount} words (minimum ${minWords}).`);
    }
    else {
        weaknesses.push(`Under length: wrote ${wordCount} words out of required ${minWords}.`);
        actionableTips.push(`Expand each body paragraph with concrete examples and consequence explanations to reach at least ${minWords + 20} words.`);
    }
    if (cohesiveCount >= 4) {
        strengths.push('Effective use of linking words and logical sequencing.');
    }
    else {
        weaknesses.push('Limited variety of cohesive devices; essay flow can be disjointed.');
        actionableTips.push('Incorporate contrastive and causal transitions like "Furthermore", "In contrast", and "Consequently".');
    }
    if (academicDensity >= 3.0) {
        strengths.push(`Good academic vocabulary ratio (${academicDensity.toFixed(1)}% of words from AWL).`);
    }
    else {
        weaknesses.push('Vocabulary relies heavily on general English words rather than formal IELTS academic register.');
        actionableTips.push('Upgrade basic words: replace "big problem" with "pressing issue", "good" with "beneficial/advantageous".');
    }
    if (sentenceCorrections.length === 0) {
        strengths.push('High grammatical accuracy with no major structural mistakes detected.');
    }
    else {
        weaknesses.push(`Found ${sentenceCorrections.length} recurring grammatical issues (e.g. subject-verb agreement or article omissions).`);
        actionableTips.push('Carefully proofread subjects and plural nouns, and ensure singular countable nouns always have an article (a/an/the).');
    }
    // Band 6.5 Sample generator
    const band65ModelSample = taskType === 'TASK_2'
        ? `In contemporary society, this topic has sparked considerable debate among educators and policymakers. While some individuals argue that traditional methods remain indispensable, others contend that modern technological advancements offer superior advantages. In my opinion, a balanced integration of both approaches represents the most viable solution.\n\nOn the one hand, traditional practices provide a structured foundation that fosters discipline and deep comprehension. For example, direct engagement with instructors allows for immediate clarification of complex concepts. Consequently, students develop a more thorough grasp of fundamental principles.\n\nOn the other hand, adopting digital tools substantially broadens educational accessibility and caters to diverse learning paces. Modern multimedia resources enable learners to assimilate abstract information more effectively. Furthermore, digital platforms equip individuals with practical technological competencies essential for the modern workforce.\n\nIn conclusion, although conventional methodologies continue to hold intrinsic value, the incorporation of modern technology is paramount for educational progress. Therefore, institutions should adopt a hybrid model to maximize learning outcomes.`
        : `The provided chart illustrates the distribution of energy consumption across various sectors from 2010 to 2020. Overall, it is evident that industrial usage accounted for the largest proportion throughout the surveyed period, whereas agricultural consumption remained the lowest.\n\nIn 2010, industrial energy consumption stood at approximately 45%, followed by the residential sector at 30%. Over the subsequent decade, industrial demand experienced a steady upward trajectory, culminating at 52% in 2020. Conversely, residential consumption witnessed a moderate decline to 25%.\n\nIn terms of the remaining sectors, transport accounted for 20% in 2010 before declining marginally to 18% in 2020. Agricultural energy usage maintained a relatively constant level of around 5% over the entire ten-year timeframe.`;
    return {
        taskResponseScore: trScore,
        coherenceScore: ccScore,
        lexicalScore: lrScore,
        grammarScore: graScore,
        estimatedBand,
        wordCount,
        taskRequirementsMet,
        strengths,
        weaknesses,
        sentenceCorrections,
        band65ModelSample,
        actionableTips,
    };
}

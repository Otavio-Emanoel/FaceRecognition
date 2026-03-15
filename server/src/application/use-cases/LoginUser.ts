function cosineSimilarity(vecA: number[], vecB: number[]) {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;

    return dot / denominator;
}

class LoginUser {
    constructor(userRepository: any) {
        this.userRepository = userRepository;
    }

    async execute = await this.userRepository.findAll().then((users: any[]) => {

        for (const user of users) {
            const similarity = cosineSimilarity(user.descriptor, descriptor);
            if (similarity > 0.6) {
                return user;
            }
        }
        return null;
    })
}

module.exports = LoginUser;
export const TryCatch = (handler) => {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
};
export default TryCatch;
//# sourceMappingURL=index.js.map
function authApi(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({
            erro: "Acesso negado. Faça login"
        })
    }

    next()
}

module.exports = authApi;
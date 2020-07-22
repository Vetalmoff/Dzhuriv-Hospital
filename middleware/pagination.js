module.exports = function(model) {
    return async (req, res, next) => {
        try {
             if (req.query.title) {
                 next()
             } else {
                const page = +req.query.page
                const limit = +req.query.limit
                const isActive = req.query.isActive
                const order = req.query.order
                const upOrDown = req.query.upOrDown
    
                console.log(order, upOrDown)
    
                const result = {}
                const startIndex = (page - 1) * limit
                const endIndex = page * limit
    
                result.page = page
    
                result.firstPage = {
                    page: 1,
                    isActive,
                    limit,
                }
    
                result.lastPage = {
                    page: Math.ceil( await model.count({
                        where: {
                            isActive
                        },
                        order: [[order, upOrDown]]
                    }) / limit),
                    isActive,
                    limit
                }
    
                if (endIndex < await model.count({
                    where: {
                        isActive
                    },
                    order: [[order, upOrDown]]
                })) {
                    result.next = {
                        page: page + 1,
                        isActive,
                        limit
                    }
                }
    
                if (startIndex > 0) {
                    result.previous = {
                        page: page - 1,
                        isActive,
                        limit
                    }
                }
                
        
                result.results = await model.findAll({
                    where: {
                        isActive: isActive
                    },
                    offset: startIndex,
                    limit,
                    order: [[order, upOrDown]]
                })
                res.paginationResult = result
    
                next()
             }
            
        } catch (e) {
            throw e
        }
        
    }
}
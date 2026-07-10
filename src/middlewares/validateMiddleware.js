export const validateMiddleware = (schema) => {
    return (req, res, next)=> {
        const result = schema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({ status: "error", message: result.error.message });
    }
    req.body = result.data;
    next();
  };
};
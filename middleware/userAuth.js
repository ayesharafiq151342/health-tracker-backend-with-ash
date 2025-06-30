import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const userAuth = async (req, res, next)=>
{
    const token = req.cookies.token;
    
    console.log(token)
    if(!token)
    {
        return res.json({success: false, message: 'Not Authorized login again'});

    }
    try 
    {
        const tokenDecode= jwt.verify(token, 'secret@123')
        console.log(tokenDecode.role)
        if(tokenDecode.role)
        {
            if(tokenDecode.id)

                {

                    req.body.userId = tokenDecode.id;
                }
        }
        // if(tokenDecode.id )
        // {
        //     req.body.userId = tokenDecode.id;
        // }
        else 
        {
            return res.json({success: false, message: 'Not Authorized and login again'})
        }
        next();
    }
    catch(error)
    {
        return res.json({success: false, message: error.message});

    }
}

export default userAuth;


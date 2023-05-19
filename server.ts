
import express, { Request, Response } from 'express'
import prisma from './configs/prismaClient'
import { generate_refresh_token, generate_token, validate_token } from './jwt'
const app = express()
const port = 3000

app.use(express.json())

app.post('/login', async (req: Request, res: Response) => {
    const {email, password} = req.body;
    if(!email || !password) return res.sendStatus(401);

    const user = await prisma.user.findFirst({
        where:{
            email: email,
            password: password
        },
        select: {
            id: false,
            name: true,
            role: true,
            email: true,
            jwt: true,
            password: false
        }
    })

    let hasToken = false;
    
    if(user){
        if(!!user.jwt.length) hasToken = true;
        const { jwt, ...newUser } = user;

        const token = generate_token(newUser);
        const refresh_token = generate_refresh_token(newUser);

        if (hasToken){
            await prisma.refreshJWT.update({
                where: {
                    email: newUser.email
                },
                data: {
                    jwt: refresh_token
                }
            })
        } else {
            await prisma.refreshJWT.create({
                data:{
                    jwt: refresh_token,
                    email: newUser.email,
                }
            })
        }
        return res.json({token: token, refresh_token: refresh_token});
    }
    return res.sendStatus(401);
})


app.post('/refresh-token', async (req: Request, res: Response) => {
    const {refresh_token} = req.body;
    if (refresh_token == null) return res.sendStatus(401);

    const user_with_token = await prisma.user.findFirst({
        where:{
            jwt:{
                some:{
                    jwt:refresh_token
                }
            }
        }, 
        select:{
            name:true,
            role:true,
            email:true,
            jwt:true,
            password: false
        }
    })

    if (user_with_token == null) return res.sendStatus(401);

    //24h
    if (user_with_token.jwt[0].createdAt.getTime() + 86400000 < Date.now()){
        await prisma.refreshJWT.delete({where:{jwt:user_with_token.jwt[0].jwt}});
        return res.sendStatus(403);
    } else {
        const { jwt, ...newUser } = user_with_token
        const token = generate_token(newUser);
        return res.json({token: token});
    }

    
})


app.post('/logout', async (req: Request, res: Response) => {
    const {refresh_token} = req.body
    if (refresh_token == null) return res.sendStatus(401);
    try {
        await prisma.refreshJWT.delete({where:{jwt:refresh_token}});
        return res.sendStatus(200);
    } catch (error) {
        
    }
    return res.sendStatus(403);
})



app.get('/', validate_token, async (req: Request, res: Response) => {
    console.log(req.user)
    return res.json(await prisma.user.findMany())
})



app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})


import { Request, Response } from 'express'
import Users from '../models/user_model';

const getUser = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const student = await Users.findById(id);
        res.status(200).send(student);
    } catch (err) {
        res.status(400).send({ err: err.message })
    }
}


const editUserInfo = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { name, avatarUrl } = req.body;

    try {
        const user = await Users.findByIdAndUpdate(id, {
            $set: {
                name,
                avatarUrl,
            }
        });

        await user.save();
        res.status(200).send({ msg: "Update succes", status: 200 });
    } catch (err) {
        res.status(400).send({ err: err.message })
    }

}


export = { editUserInfo, getUser };
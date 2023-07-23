import { Router } from "express";
import db from "../../db/conn.js";
import { ObjectId } from "mongodb";

const TodoRouter = Router();

const todo = db.collection('todo');

TodoRouter.get('/', async (req, res) => {
    const todo_list = todo.find();
    const todo_list_array = await todo_list.toArray();
    res.send(todo_list_array).status(200);
});

TodoRouter.post('/', (req, res) => {
    const data = {
        title: req.body.title,
        is_completed: false,
        created_at: new Date(),
    };
    todo.insertOne(data).then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    });
    res.send({
        message: `Todo item Added: ${data.title}`,
    }).status(200);
});

TodoRouter.patch('/', (req, res) => {
    const todo_id = new ObjectId(req.body._id);
    const data = {
        title: req.body.title,
        edited_at: new Date(),
    };
    todo.findOneAndUpdate(
        {
            _id: todo_id,
        },
        {
            $set: data,
        }
    ).then(res => {
        console.log(res.ok);
    }).catch(error => {
        console.error(error);
    });
    res.send({
        message: `Todo Item Updated To ${data.title}`,
    }).status(200);
});

TodoRouter.delete('/', (req, res) => {
    const _id = req.body._id;
    todo.deleteOne({ _id: new ObjectId(_id) }).then(res => {
        console.log(res);
    }).catch(error => {
        console.error(error);
    });
    res.send().status(200);
});

export default TodoRouter;
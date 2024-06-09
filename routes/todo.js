const express = require('express');
const auth = require('../middleware/user_jwt');

const Todo = require('../models/Todo');

const router = express.Router();

router.post('/', auth, async(req, res, next) => {
    try {
        const toDo = await Todo.create({ title: req.body.title, description: req.body.description, user: req.user.id, deadline: req.body.deadline});
        if(!toDo) {
            return res.status(400).json({
                success: false,
                msg: 'Something went wrong'
            });
        }

        res.status(200).json({
            success: true,
            todo: toDo,
            msg: 'Successfully created'
        });
    } catch(error) {
        next(error)
    }
});

router.get('/', auth, async(req, res, next) => {
    try {
        const todo = await Todo.find({ user: req.user.id, finished: false });

        if(!todo) {
            return res.status(400).json({
                success: false,
                message: "Some error happened"
            });
        }
        res.status(200).json({
            success: true,
            message: "Successfully fectched",
            count: todo.length,
            todos: todo
        })
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        let toDo = await Todo.findById(req.params.id);
        if(!toDo) {
            return res.status(404).json({
                status: false,
                message: "Task todo doesn't exist"
            });
        }
        const currentDate = new Date();
        req.body.createdAt = currentDate;


        toDo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: "Successfully updated",
            todo: toDo
        });

    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        let toDo = await Todo.findById(req.params.id);
        if(!toDo) {
            return res.status(404).json({
                success: false,
                message: "Task todo doesn't exist"
            });
        }

        toDo = await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });

    } catch (error) {
        next(error)
    }
});

router.get('/finished', auth, async(req, res, next) => {
    try {
        const todo = await Todo.find({ user: req.user.id, finished: true });

        if(!todo) {
            return res.status(400).json({
                success: false,
                message: "Some error happened"
            });
        }
        res.status(200).json({
            success: true,
            message: "Successfully fectched",
            count: todo.length,
            todos: todo
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router;
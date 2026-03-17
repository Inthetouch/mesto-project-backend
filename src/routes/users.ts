import { Router } from 'express';
import {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

router.get('/:userId', getUserById);

export default router;

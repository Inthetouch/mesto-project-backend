import { Router } from 'express';
import {
  getUsers, getUserById, updateProfile,
  updateAvatar, getCurrentUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

router.get('/:userId', getUserById);

export default router;

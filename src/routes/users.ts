import { Router } from 'express';
import { validateId, validateUpdateProfile, validateUpdateAvatar } from '../utils/validation';
import {
  getUsers, getUserById, updateProfile,
  updateAvatar, getCurrentUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

router.get('/:userId', validateId, getUserById);

export default router;

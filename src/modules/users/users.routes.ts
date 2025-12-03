import { Router } from 'express';
import { verifyStaff, verifyStaffAdminAndSuperAdmin } from '../../middleware/authenticate.js';
import { loginGet, loginPost, signupGet, signupPost, updateUserAdminGet, updateUserAdminPut, updateUserSuperAdminPut, logout } from '../../controllers/usersController.js';

const userRouter = Router() 

//USERS
userRouter.get("/", signupGet);
userRouter.post("/signup", signupPost);
userRouter.get("/login", loginGet);
userRouter.post("/login", loginPost);
userRouter.get("/updateUserAdminGet", verifyStaffAdminAndSuperAdmin, updateUserAdminGet);
userRouter.put("/updateUserAdminPut", verifyStaffAdminAndSuperAdmin, updateUserAdminPut);
userRouter.put("/updateUserSuperAdminPut", verifyStaffAdminAndSuperAdmin, updateUserSuperAdminPut);
userRouter.get("/logout", verifyStaff, logout);

export default userRouter;
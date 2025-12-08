import userModel from './users.model.js';
import signJwt from '../../utils/createJwt.js';
import bcrypt from 'bcrypt';

export const signup = async (email: string, password: string, officeCode: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const prevUser = await userModel.findOne({ email });

  if (prevUser !== null) {
    return {
      code: 404,
      message: `User+already+exists`,
    };
  }

  if (officeCode !== (process.env.OFFICECODE as string)) {
    return {
      code: 400,
      message: `Invalid+office+code`,
    };
  }

  const user = await userModel.create({ email, password: hashedPassword });
  const token = signJwt(user.id);

  return {
    code: 200,
    message: 'User created successfully',
    data: token,
  };
};

export const login = async (email: string, password: string) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    return {
      code: 404,
      message: `No+user+found`,
    };
  }

  if ((await bcrypt.compare(password, user.password)) === false) {
    return {
      code: 400,
      message: `Incorrect+password`,
    };
  }

  const token = signJwt(user.id);

  return {
    code: 200,
    message: 'User created successfully',
    data: token,
  };
};

export const updateUseradmin = async (email: string) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    return {
      code: 400,
      message: 'No+user+found',
    };
  }

  if (user.isAdmin === true) {
    return {
      code: 404,
      message: 'user+already+admin',
    };
  }

  user.isAdmin = true;
  await user.save();

  return {
    code: 200,
    message: 'success',
  };
};

export const updateUsersuperadmin = async (email: string) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    return {
      code: 400,
      message: 'No+user+found',
    };
  }

  if (user.isSuperAdmin === true) {
    return {
      code: 404,
      message: 'user+already+superadmin',
    };
  }

  user.isSuperAdmin = true;
  await user.save();

  return {
    code: 200,
    message: 'success+superadmin',
  };
};

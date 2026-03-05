
import jwt from 'jsonwebtoken'
import UserModel from '../models/user.models.js';
const generatedRefeshToken = async (userId) => {
  const token = jwt.sign(
      { id: userId },
      process.env.SECRET_KEY_REFESH_TOKEN,
      { expiresIn: "7d" }
  );

  const updateRefeshTokenUser = await UserModel.updateOne(
    { _id: userId },
    { refresh_token: token }
  );

  return token;
};

export default generatedRefeshToken;

import { signUp, getUserByEmail } from 'supertokens-node/recipe/emailpassword';
import { addRoleToUser } from './auth/roles.service';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import EmailVerification from 'supertokens-node/recipe/emailverification';

async function manuallyVerifyEmail(userId: string) {
  try {
    // Create an email verification token for the user
    const tokenRes = await EmailVerification.createEmailVerificationToken(
      userId,
    );

    // If the token creation is successful, use the token to verify the user's email
    if (tokenRes.status === 'OK') {
      await EmailVerification.verifyEmailUsingToken(tokenRes.token);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function addSuperAdmin(email: string, password?: string) {
  const exists = await getUserByEmail(email);
  if (exists) {
    console.log('Super admin user already exists');
    return;
  }
  const response = await signUp(email, password);
  if (response.status === 'OK') {
    console.log(response);
    await manuallyVerifyEmail(response.user.id);
    await addRoleToUser(response.user.id, 'super');
    await UserMetadata.updateUserMetadata(response.user.id, {
      deployment: '*',
    });
  }
}

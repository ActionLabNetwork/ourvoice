import { signUp } from 'supertokens-node/recipe/emailpassword';
import { addRoleToUser } from './auth/roles.service';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import supertokens from 'supertokens-node';

const DEFAULT_TENANT_ID = 'public';

async function manuallyVerifyEmail(
  recipeUserId: supertokens.RecipeUserId,
  tenantId?: string,
) {
  try {
    // Create an email verification token for the user
    const tokenRes = await EmailVerification.createEmailVerificationToken(
      tenantId ?? DEFAULT_TENANT_ID,
      recipeUserId,
    );

    // If the token creation is successful, use the token to verify the user's email
    if (tokenRes.status === 'OK') {
      await EmailVerification.verifyEmailUsingToken(
        tenantId ?? DEFAULT_TENANT_ID,
        tokenRes.token,
      );
    }
  } catch (err) {
    console.error(err);
  }
}

export async function addSuperAdmin(email: string, password?: string) {
  const exists = await doesEmailExists(email);
  console.log('Trying to create super admin user...');
  if (exists) {
    console.log('Super admin user already exists');
    return;
  }
  const response = await signUp(DEFAULT_TENANT_ID, email, password);
  if (response.status === 'OK') {
    await manuallyVerifyEmail(response.recipeUserId);
    await addRoleToUser(response.user.id, 'super');
    await UserMetadata.updateUserMetadata(response.user.id, {
      deployment: '*',
    });
    console.log('Created super admin user: ', JSON.stringify(response));
  }
}

async function doesEmailExists(email: string) {
  const users = await supertokens.listUsersByAccountInfo(DEFAULT_TENANT_ID, {
    email,
  });
  return users.length > 0;
}

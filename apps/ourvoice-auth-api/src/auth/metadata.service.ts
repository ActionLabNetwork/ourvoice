import UserMetadata from 'supertokens-node/recipe/usermetadata';

export async function addEmailToAllowlist(email: string) {
  const existingData = await UserMetadata.getUserMetadata('emailAllowList');
  let allowList: string[] = existingData.metadata.allowList || [];
  allowList = [...allowList, email];
  await UserMetadata.updateUserMetadata('emailAllowList', {
    allowList,
  });
}
export async function addEmailsToAllowlist(emails: string[]) {
  const existingData = await UserMetadata.getUserMetadata('emailAllowList');
  let allowList: string[] = existingData.metadata.allowList || [];
  allowList = [...allowList, ...emails];
  await UserMetadata.updateUserMetadata('emailAllowList', {
    allowList,
  });
}

export async function isEmailAllowed(email: string) {
  const existingData = await UserMetadata.getUserMetadata('emailAllowList');
  const allowList: string[] = existingData.metadata.allowList || [];
  return allowList.includes(email);
}

export async function addPhoneNumberToAllowlist(phoneNumber: string) {
  const existingData = await UserMetadata.getUserMetadata(
    'phoneNumberAllowList',
  );
  let allowList: string[] = existingData.metadata.allowList || [];
  allowList = [...allowList, phoneNumber];
  await UserMetadata.updateUserMetadata('phoneNumberAllowList', {
    allowList,
  });
}

export async function isPhoneNumberAllowed(phoneNumber: string) {
  const existingData = await UserMetadata.getUserMetadata(
    'phoneNumberAllowList',
  );
  const allowList: string[] = existingData.metadata.allowList || [];
  return allowList.includes(phoneNumber);
}

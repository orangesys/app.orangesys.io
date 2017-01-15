import { firebaseDB } from 'src/core/firebase';

export const updateEmail = (uid, email) => {
  const key = `users/${uid}`;
  const updates = {
    [`${key}/email`]: email,
  };
  return firebaseDB.ref().update(updates)
    .then(result => ({ result }))
    .catch(dbError => ({ dbError }));
};

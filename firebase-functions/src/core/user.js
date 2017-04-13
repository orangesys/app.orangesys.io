
export const getUserData = async (database, uid) => {
  const snapshot = await database().ref(`/users/${uid}`).once('value')
  return snapshot.val()
}

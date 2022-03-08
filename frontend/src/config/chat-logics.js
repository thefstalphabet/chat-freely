export const frontUser = (userInfo, chat) => {
  return chat.users[0]._id === userInfo._id ? chat.users[1] : chat.users[0];
};

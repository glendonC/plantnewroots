export const transformConversations = (conversations) => {
    return conversations.map(conversation => ({
        ...conversation,
        displayName: `${conversation.name} - ${conversation.tag}`,
        formattedDate: formatDate(conversation.createdAt)
    }));
};
  
export const enhanceReadingSessions = (sessions) => {
return sessions.map(session => ({
    ...session,
    formattedDate: formatDate(session.date),
    title: capitalizeWords(session.title)
}));
};
  
export const aggregateUserData = (userData) => {
    const { posts, comments, likes } = userData;
    return {
        totalPosts: posts.length,
        totalComments: comments.length,
        totalLikes: likes.reduce((acc, cur) => acc + cur.count, 0)
    };
};

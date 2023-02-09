// function to fetch the recipient email from the users array
function getRecipientEmail(users, userEmail) {
    return users?.filter((userToFilter) => userToFilter !== userEmail)[0];
}

export default getRecipientEmail;
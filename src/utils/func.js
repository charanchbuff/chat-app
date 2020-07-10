const Generate = (username,message) => {
    return {
        username,
        message,
        createdAt : new Date().getDate()
    }
}

const GenerateURL = (username,url) => {
    return {
        username,
        url,
        createdAt : new Date().getDate()
    }
}
module.exports = {Generate,GenerateURL}
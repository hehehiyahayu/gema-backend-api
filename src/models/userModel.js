class userModel {
    constructor(avatar, email, full_name, nim, password, phone_number, token, username){
        this.avatar = avatar
        this.email = email
        this.full_name = full_name
        this.nim = nim
        this.password = password
        this.phone_number = phone_number
        this.token = token
        this.username = username
    }
}

module.exports = userModel